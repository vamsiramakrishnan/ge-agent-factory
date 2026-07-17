"""Policy-enforcing live READ dispatch for simulator tools.

The module is the Python tool plane's only live HTTP seam. It consumes a
resolved dispatch directive, requires a separate runtime confirmation, and
owns target validation, DNS/IP policy, URL construction, redirects, auth,
timeouts, and bounded response reads. Write-class operations never enter this
module.
"""

from __future__ import annotations

import http.client
import ipaddress
import json
import os
import re
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

DISPATCH_ENV = "GE_SIMULATOR_DISPATCH"
DISPATCH_FILE_ENV = "GE_SIMULATOR_DISPATCH_FILE"
LIVE_CONFIRM_ENV = "GE_SIMULATOR_LIVE_CONFIRM"
DIRECTIVE_SCHEMA_VERSION = "ge.dispatch-directive.v1"

READ_OPS = frozenset({"search", "get"})

_DEFAULT_TIMEOUT_MS = 10_000
_DEFAULT_MAX_RESPONSE_BYTES = 1_048_576
MAX_RESPONSE_BYTES_HARD_CAP = 16_777_216
_MAX_RAW_BODY = 2_000
_MAX_REDIRECTS = 3
_READ_CHUNK_BYTES = 65_536
_REDIRECT_STATUSES = frozenset({301, 302, 303, 307, 308})
_BLOCKED_HOSTNAMES = frozenset({"localhost", "metadata.google.internal"})
_QUERY_NAME = re.compile(r"^[A-Za-z][A-Za-z0-9_.-]*$")


class LiveDispatchConfigurationError(ValueError):
    """A configured live route is unsafe or incomplete and must not fall back."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _configuration_error(code: str, message: str) -> None:
    raise LiveDispatchConfigurationError(code, message)


def _load_directive() -> dict[str, Any] | None:
    inline = os.environ.get(DISPATCH_ENV)
    path = os.environ.get(DISPATCH_FILE_ENV)
    if inline and path:
        _configuration_error("live_directive_ambiguous", f"set only one of {DISPATCH_ENV} or {DISPATCH_FILE_ENV}")
    if not inline and not path:
        return None
    try:
        if path:
            with open(path, encoding="utf-8") as handle:
                inline = handle.read()
        directive = json.loads(inline or "")
    except (OSError, json.JSONDecodeError):
        _configuration_error("live_directive_invalid", "live dispatch directive could not be read as JSON")
    if not isinstance(directive, dict) or directive.get("schemaVersion") != DIRECTIVE_SCHEMA_VERSION:
        _configuration_error(
            "live_directive_invalid",
            f"live dispatch directive must use schemaVersion {DIRECTIVE_SCHEMA_VERSION}",
        )
    if not isinstance(directive.get("systems"), dict):
        _configuration_error("live_directive_invalid", "live dispatch directive systems must be an object")
    return directive


def _assert_safe_path(path: str) -> None:
    if "\\" in path:
        _configuration_error("live_path_escape", "live target path must not contain backslashes")
    for raw_segment in path.split("/"):
        if re.search(r"%(?![0-9A-Fa-f]{2})", raw_segment):
            _configuration_error("live_path_invalid", "live target path contains invalid percent encoding")
        segment = raw_segment
        for _ in range(2):
            try:
                decoded = urllib.parse.unquote(segment, errors="strict")
            except UnicodeDecodeError:
                _configuration_error("live_path_invalid", "live target path contains invalid percent encoding")
            if decoded == segment:
                break
            segment = decoded
        if segment in {".", ".."} or "/" in segment or "\\" in segment:
            _configuration_error("live_path_escape", "live target path must stay within the configured base path")


def _is_public_address(address: str) -> bool:
    try:
        return ipaddress.ip_address(address.split("%", 1)[0]).is_global
    except ValueError:
        return False


def _effective_port(parts: urllib.parse.SplitResult) -> int:
    if parts.port is not None:
        return parts.port
    return 443 if parts.scheme == "https" else 80


def _origin(parts: urllib.parse.SplitResult) -> tuple[str, str, int]:
    return (parts.scheme.lower(), (parts.hostname or "").lower(), _effective_port(parts))


def _validated_target(target: dict[str, Any], *, require_approval: bool = True) -> tuple[dict[str, Any], urllib.parse.SplitResult]:
    if not isinstance(target, dict):
        _configuration_error("live_target_invalid", "live target must be an object")
    mode = target.get("mode")
    expected = {
        "live_first": ("live", "twin"),
        "twin_first": ("twin", "live"),
    }.get(mode)
    if expected is None or target.get("decision") != expected[0] or target.get("fallback") != expected[1]:
        _configuration_error("live_target_invalid", "live target has an inconsistent dispatch order")
    if target.get("kind") != "rest":
        _configuration_error("live_target_invalid", "live target kind must be rest")
    if target.get("requiresApproval") is not True:
        _configuration_error("live_approval_required", "live target must require explicit runtime approval")
    if require_approval and os.environ.get(LIVE_CONFIRM_ENV) != "1":
        _configuration_error(
            "live_approval_required",
            f"set {LIVE_CONFIRM_ENV}=1 to approve read-only live calls for this process",
        )

    base_url = target.get("baseUrl")
    if not isinstance(base_url, str):
        _configuration_error("live_target_invalid", "live target baseUrl must be a string")
    try:
        parts = urllib.parse.urlsplit(base_url)
        _ = parts.port
    except ValueError:
        _configuration_error("live_target_invalid", "live target must be a valid HTTP(S) URL")
    if parts.scheme not in {"http", "https"} or not parts.hostname:
        _configuration_error("live_target_invalid", "live target must be an HTTP(S) URL")
    if parts.username or parts.password:
        _configuration_error("live_target_userinfo", "live target must not contain user information")
    if parts.query or parts.fragment:
        _configuration_error("live_target_invalid", "live target must not contain a query or fragment")
    if parts.scheme != "https" and target.get("allowInsecureHttp") is not True:
        _configuration_error(
            "live_target_insecure",
            "live target requires HTTPS unless allowInsecureHttp is explicitly enabled",
        )
    _assert_safe_path(parts.path)

    hostname = parts.hostname.lower()
    allowed_hosts = target.get("allowedHosts")
    if allowed_hosts is not None:
        if not isinstance(allowed_hosts, list) or any(not isinstance(host, str) or not host for host in allowed_hosts):
            _configuration_error("live_policy_invalid", "allowedHosts must be an array of host names")
        if hostname not in {host.lower() for host in allowed_hosts}:
            _configuration_error("live_host_denied", "live target host is not in allowedHosts")

    allow_private = target.get("allowPrivateNetwork") is True
    literal_private = False
    try:
        literal_private = not ipaddress.ip_address(hostname).is_global
    except ValueError:
        pass
    if (hostname in _BLOCKED_HOSTNAMES or hostname.endswith(".localhost") or literal_private) and not allow_private:
        _configuration_error(
            "live_private_target",
            "live target resolves outside the public network; enable allowPrivateNetwork explicitly to permit it",
        )

    timeout_ms = target.get("timeoutMs", _DEFAULT_TIMEOUT_MS)
    if not isinstance(timeout_ms, (int, float)) or isinstance(timeout_ms, bool) or timeout_ms <= 0:
        _configuration_error("live_policy_invalid", "timeoutMs must be a positive number")
    max_bytes = target.get("maxResponseBytes", _DEFAULT_MAX_RESPONSE_BYTES)
    if (
        not isinstance(max_bytes, int)
        or isinstance(max_bytes, bool)
        or max_bytes <= 0
        or max_bytes > MAX_RESPONSE_BYTES_HARD_CAP
    ):
        _configuration_error(
            "live_policy_invalid",
            f"maxResponseBytes must be an integer between 1 and {MAX_RESPONSE_BYTES_HARD_CAP}",
        )
    auth_env = target.get("authEnv")
    if auth_env is not None and (not isinstance(auth_env, str) or not re.fullmatch(r"[A-Z][A-Z0-9_]*", auth_env)):
        _configuration_error("live_policy_invalid", "authEnv must be an uppercase environment-variable name")

    canonical_path = parts.path or "/"
    if not canonical_path.endswith("/"):
        canonical_path += "/"
    canonical = parts._replace(path=canonical_path, query="", fragment="")
    return target, canonical


def live_target(system_id: str) -> dict[str, Any] | None:
    """Return a validated target; live-first routes also require approval."""
    directive = _load_directive()
    if not directive:
        return None
    entry = directive["systems"].get(system_id)
    if entry is None:
        return None
    _validated_target(entry, require_approval=entry.get("mode") == "live_first")
    return entry


def forwardable_binding(catalog_tool: dict[str, Any] | None) -> dict[str, Any] | None:
    """A tool's explicit pack binding, iff its op is live-forwardable."""
    if not isinstance(catalog_tool, dict):
        return None
    binding = catalog_tool.get("binding")
    if isinstance(binding, dict) and binding.get("op") in READ_OPS and binding.get("collection"):
        return binding
    return None


def _envelope(contract: dict[str, Any], system_id: str, tool_name: str, scenario_id: str) -> dict[str, Any]:
    return {
        "source_system": contract["displayName"],
        "system_id": system_id,
        "simulator": False,
        "live": True,
        "tool": tool_name,
        "scenario_id": scenario_id,
    }


def _error(base: dict[str, Any], code: str, message: str) -> dict[str, Any]:
    return {**base, "status": "error", "error": {"code": code, "message": message}}


def _query_from_args(binding: dict[str, Any], args: dict[str, Any]) -> str:
    mapping = binding.get("queryMap")
    if mapping is None:
        return ""
    if isinstance(mapping, list):
        pairs = [(name, name) for name in mapping]
    elif isinstance(mapping, dict):
        pairs = list(mapping.items())
    else:
        _configuration_error("live_query_map_invalid", "queryMap must be an object or an array")
    declared: list[tuple[str, str]] = []
    for arg_name, query_name in pairs:
        if not isinstance(arg_name, str) or not isinstance(query_name, str):
            _configuration_error("live_query_map_invalid", "queryMap names must be strings")
        if not _QUERY_NAME.fullmatch(arg_name) or not _QUERY_NAME.fullmatch(query_name):
            _configuration_error("live_query_map_invalid", "queryMap contains an invalid name")
        value = args.get(arg_name)
        if value is None:
            continue
        if not isinstance(value, (str, int, float, bool)):
            _configuration_error("live_bad_request", f"declared query argument {arg_name} must be scalar")
        declared.append((query_name, str(value)))
    return urllib.parse.urlencode(declared)


def _safe_collection_path(collection: Any) -> str:
    value = str(collection).strip("/")
    if not value:
        _configuration_error("live_path_invalid", "live collection path must not be empty")
    _assert_safe_path(value)
    return "/".join(urllib.parse.quote(segment, safe="-._~") for segment in value.split("/"))


def _safe_record_id(value: Any) -> str:
    text = str(value)
    _assert_safe_path(text)
    if text in {"", ".", ".."} or "/" in text or "\\" in text:
        _configuration_error("live_bad_request", "live record id must be one path segment")
    return urllib.parse.quote(text, safe="-._~")


def _resolve_target_addresses(
    parts: urllib.parse.SplitResult,
    allow_private: bool,
) -> tuple[tuple[int, str], ...]:
    hostname = parts.hostname or ""
    try:
        literal = ipaddress.ip_address(hostname.split("%", 1)[0])
    except ValueError:
        literal = None
    if literal is not None:
        family = socket.AF_INET6 if literal.version == 6 else socket.AF_INET
        return ((family, str(literal)),)

    try:
        answers = socket.getaddrinfo(hostname, _effective_port(parts), type=socket.SOCK_STREAM)
    except OSError as exc:
        raise ConnectionError("target resolution failed") from exc
    addresses: list[tuple[int, str]] = []
    seen: set[tuple[int, str]] = set()
    for answer in answers:
        if not answer or len(answer) <= 4 or not answer[4] or answer[0] not in {socket.AF_INET, socket.AF_INET6}:
            continue
        candidate = (answer[0], answer[4][0].split("%", 1)[0])
        if candidate not in seen:
            seen.add(candidate)
            addresses.append(candidate)
    if not addresses:
        raise ConnectionError("target resolution failed")
    if not allow_private and any(not _is_public_address(address) for _, address in addresses):
        _configuration_error(
            "live_private_target",
            "live target resolves outside the public network; enable allowPrivateNetwork explicitly to permit it",
        )
    return tuple(addresses)


def _dial_pinned(
    addresses: tuple[tuple[int, str], ...],
    port: int,
    timeout: float | object,
    source_address: tuple[str, int] | None,
) -> socket.socket:
    """Connect only to numeric addresses returned by the validated lookup."""
    last_error: OSError | None = None
    for family, address in addresses:
        sock = socket.socket(family, socket.SOCK_STREAM)
        try:
            sock.settimeout(None if timeout is socket._GLOBAL_DEFAULT_TIMEOUT else timeout)
            if source_address:
                sock.bind(source_address)
            endpoint = (address, port, 0, 0) if family == socket.AF_INET6 else (address, port)
            sock.connect(endpoint)
            return sock
        except OSError as exc:
            last_error = exc
            sock.close()
    if last_error is not None:
        raise last_error
    raise OSError("live target has no dialable address")


def _pinned_connection_factory(addresses: tuple[tuple[int, str], ...]):
    def create_connection(
        destination: tuple[str, int],
        timeout: float | object = socket._GLOBAL_DEFAULT_TIMEOUT,
        source_address: tuple[str, int] | None = None,
    ) -> socket.socket:
        # Ignore destination[0]: it is retained by http.client as the Host and
        # HTTPS server name, but the TCP dial must use the validated address.
        return _dial_pinned(addresses, destination[1], timeout, source_address)

    return create_connection


class _PinnedHTTPConnection(http.client.HTTPConnection):
    def __init__(self, host: str, *, pinned_addresses: tuple[tuple[int, str], ...], **kwargs: Any):
        super().__init__(host, **kwargs)
        self._create_connection = _pinned_connection_factory(pinned_addresses)


class _PinnedHTTPSConnection(http.client.HTTPSConnection):
    def __init__(self, host: str, *, pinned_addresses: tuple[tuple[int, str], ...], **kwargs: Any):
        super().__init__(host, **kwargs)
        self._create_connection = _pinned_connection_factory(pinned_addresses)


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001, ANN201, ARG002
        return None


class _PinnedHTTPHandler(urllib.request.HTTPHandler):
    def __init__(self, addresses: tuple[tuple[int, str], ...]):
        super().__init__()
        self._addresses = addresses

    def http_open(self, request):  # noqa: ANN001, ANN201
        def connection(host: str, **kwargs: Any) -> _PinnedHTTPConnection:
            return _PinnedHTTPConnection(host, pinned_addresses=self._addresses, **kwargs)

        return self.do_open(connection, request)


class _PinnedHTTPSHandler(urllib.request.HTTPSHandler):
    def __init__(self, addresses: tuple[tuple[int, str], ...]):
        super().__init__()
        self._addresses = addresses

    def https_open(self, request):  # noqa: ANN001, ANN201
        def connection(host: str, **kwargs: Any) -> _PinnedHTTPSConnection:
            return _PinnedHTTPSConnection(host, pinned_addresses=self._addresses, **kwargs)

        return self.do_open(
            connection,
            request,
            context=self._context,
            check_hostname=self._check_hostname,
        )


def _build_live_opener(
    proxy_handler_factory=urllib.request.ProxyHandler,
    *,
    pinned_addresses: tuple[tuple[int, str], ...] | None = None,
):
    """Build an opener with empty proxies, manual redirects, and optional address pinning."""
    handlers: list[Any] = [proxy_handler_factory({}), _NoRedirect]
    if pinned_addresses:
        handlers.extend([_PinnedHTTPHandler(pinned_addresses), _PinnedHTTPSHandler(pinned_addresses)])
    return urllib.request.build_opener(*handlers)


def _bounded_read(response: Any, limit: int) -> bytes:
    if limit <= 0 or limit > MAX_RESPONSE_BYTES_HARD_CAP:
        _configuration_error(
            "live_policy_invalid",
            f"maxResponseBytes must be an integer between 1 and {MAX_RESPONSE_BYTES_HARD_CAP}",
        )
    content_length = response.headers.get("content-length") if response.headers else None
    if content_length:
        try:
            if int(content_length) > limit:
                _configuration_error("live_response_too_large", f"live response exceeded the {limit}-byte limit")
        except ValueError:
            pass
    body = bytearray()
    while len(body) < limit:
        chunk = response.read(min(_READ_CHUNK_BYTES, limit - len(body)))
        if not chunk:
            return bytes(body)
        body.extend(chunk)
    if response.read(1):
        _configuration_error("live_response_too_large", f"live response exceeded the {limit}-byte limit")
    return bytes(body)


def _open_once(
    opener: urllib.request.OpenerDirector,
    url: str,
    headers: dict[str, str],
    timeout_s: float,
) -> tuple[Any, int]:
    request = urllib.request.Request(url, headers=headers, method="GET")
    try:
        response = opener.open(request, timeout=timeout_s)  # noqa: S310 - validated target and pinned address
        return response, response.status
    except urllib.error.HTTPError as exc:
        return exc, exc.code


def _same_origin_redirect(
    location: str,
    current_url: str,
    base: urllib.parse.SplitResult,
) -> str:
    try:
        redirected = urllib.parse.urlsplit(urllib.parse.urljoin(current_url, location))
    except ValueError:
        _configuration_error("live_unsafe_redirect", "live target returned an invalid redirect")
    if redirected.username or redirected.password or _origin(redirected) != _origin(base):
        _configuration_error("live_unsafe_redirect", "live target attempted a cross-origin redirect")
    _assert_safe_path(redirected.path)
    if not redirected.path.startswith(base.path):
        _configuration_error("live_path_escape", "live target redirect escaped the configured base path")
    return urllib.parse.urlunsplit(redirected)


def forward_read(
    target: dict[str, Any],
    contract: dict[str, Any],
    system_id: str,
    tool_name: str,
    binding: dict[str, Any],
    args: dict[str, Any],
    scenario_id: str,
) -> dict[str, Any]:
    """Forward one read op through the hardened live transport seam."""
    base_envelope = _envelope(contract, system_id, tool_name, scenario_id)
    op = binding.get("op")
    if op not in READ_OPS:
        raise ValueError(f"forward_read called with non-read op {op!r} for {system_id}.{tool_name}")

    try:
        target, base = _validated_target(target)
        pinned_addresses = _resolve_target_addresses(base, target.get("allowPrivateNetwork") is True)
        headers = {"accept": "application/json"}
        auth_env = target.get("authEnv")
        if auth_env:
            token = os.environ.get(auth_env)
            if not token:
                return _error(
                    base_envelope,
                    "live_auth_unresolved",
                    f"auth env var {auth_env} is not set in the tool-plane environment",
                )
            headers["authorization"] = f"Bearer {token}"

        collection = _safe_collection_path(binding["collection"])
        path = f"{base.path}{collection}"
        if op == "search":
            query = _query_from_args(binding, args)
            path += f"?{query}" if query else ""
        else:
            key = binding.get("primaryKey") or "id"
            record_id = args.get(key)
            if record_id is None:
                return _error(base_envelope, "live_bad_request", f"get requires {key} in args to address a record")
            path += f"/{_safe_record_id(record_id)}"
        url = urllib.parse.urlunsplit(base._replace(path=path, query="", fragment=""))
    except LiveDispatchConfigurationError as exc:
        return _error(base_envelope, exc.code, str(exc))
    except ConnectionError:
        return _error(base_envelope, "live_unreachable", "live target could not be resolved")

    timeout_s = float(target.get("timeoutMs", _DEFAULT_TIMEOUT_MS)) / 1000
    max_bytes = int(target.get("maxResponseBytes", _DEFAULT_MAX_RESPONSE_BYTES))
    # Never inherit HTTP(S)_PROXY at this secret-bearing seam. The pinned
    # handlers also keep the original hostname for Host and TLS verification.
    opener = _build_live_opener(pinned_addresses=pinned_addresses)
    started = time.monotonic()
    try:
        for redirect_count in range(_MAX_REDIRECTS + 1):
            response, status = _open_once(opener, url, headers, timeout_s)
            try:
                if status in _REDIRECT_STATUSES and response.headers.get("location"):
                    if redirect_count >= _MAX_REDIRECTS:
                        return _error(base_envelope, "live_redirect_limit", "live target exceeded the redirect limit")
                    try:
                        url = _same_origin_redirect(response.headers["location"], url, base)
                    except LiveDispatchConfigurationError as exc:
                        return _error(base_envelope, exc.code, str(exc))
                    continue
                if not 200 <= status < 300:
                    return_envelope = _error(base_envelope, f"live_http_{status}", f"live target returned HTTP {status}")
                    body = b""  # Never retain a raw live error body.
                else:
                    try:
                        body = _bounded_read(response, max_bytes)
                    except LiveDispatchConfigurationError as exc:
                        return _error(base_envelope, exc.code, str(exc))
                    return_envelope = None
                break
            finally:
                response.close()
    except (urllib.error.URLError, TimeoutError, OSError):
        return _error(base_envelope, "live_unreachable", "live target could not be reached")

    latency_ms = round((time.monotonic() - started) * 1000)
    if return_envelope is not None:
        return_envelope["live_status"] = status
        return_envelope["latency_ms"] = latency_ms
        return return_envelope

    text = body.decode("utf-8", errors="replace") if body else ""
    try:
        data = json.loads(text) if text else None
    except json.JSONDecodeError:
        data = {"raw": text[:_MAX_RAW_BODY]}
    return {
        **base_envelope,
        "status": "ok",
        "data": data,
        "live_status": status,
        "latency_ms": latency_ms,
    }
