from __future__ import annotations

import json
import socket
import ssl
import sys
import threading
import urllib.parse
import urllib.request
from copy import deepcopy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime.live_dispatch import (  # noqa: E402
    DIRECTIVE_SCHEMA_VERSION,
    DISPATCH_ENV,
    DISPATCH_FILE_ENV,
    LIVE_CONFIRM_ENV,
    MAX_RESPONSE_BYTES_HARD_CAP,
    LiveDispatchConfigurationError,
    READ_OPS,
    _build_live_opener,
    live_target,
)
import simulator_runtime.live_dispatch as live_dispatch  # noqa: E402
import simulator_runtime.router as router  # noqa: E402
from simulator_runtime.replay import RECORD_DIR_ENV  # noqa: E402
from simulator_runtime.router import execute_simulator_tool  # noqa: E402
from simulator_runtime.simulators import SimulatorError  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]
CORPUS = REPO_ROOT / "apps" / "factory" / "simulator-systems"

# absencesoft declares EXPLICIT per-tool bindings (search/get/submit) — the
# shape live dispatch requires — so it is the fixture system throughout.
SYSTEM = "absencesoft"


def _tool(name: str) -> dict:
    return {"name": name, "simulator": {"system_id": SYSTEM, "tool": name}}


def _directive(base_url: str, mode: str = "live_first", **extra) -> str:
    entry = {
        "decision": "live" if mode == "live_first" else "twin",
        "mode": mode,
        "fallback": "twin" if mode == "live_first" else "live",
        "kind": "rest",
        "baseUrl": base_url,
        "requiresApproval": True,
        "maxResponseBytes": 1_048_576,
        **extra,
    }
    return json.dumps(
        {
            "schemaVersion": DIRECTIVE_SCHEMA_VERSION,
            "systems": {SYSTEM: entry},
        }
    )


def _activate(monkeypatch, base_url: str, mode: str = "live_first", **extra) -> None:
    if base_url.startswith("http://127.0.0.1"):
        extra.setdefault("allowInsecureHttp", True)
        extra.setdefault("allowPrivateNetwork", True)
    monkeypatch.setenv(LIVE_CONFIRM_ENV, "1")
    monkeypatch.setenv(DISPATCH_ENV, _directive(base_url, mode=mode, **extra))


class _StubHandler(BaseHTTPRequestHandler):
    """Records every request; replies from the server's scripted queue."""

    def do_GET(self):  # noqa: N802 — BaseHTTPRequestHandler API
        self.server.requests.append(
            {"method": "GET", "path": self.path, "authorization": self.headers.get("authorization")}
        )
        reply = self.server.replies[min(len(self.server.requests) - 1, len(self.server.replies) - 1)]
        status, body, *header_sets = reply
        headers = header_sets[0] if header_sets else {}
        payload = body.encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(payload)))
        for name, value in headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *args):  # silence per-request stderr noise
        pass


@pytest.fixture()
def stub_server():
    server = ThreadingHTTPServer(("127.0.0.1", 0), _StubHandler)
    server.requests = []
    server.replies = [(200, json.dumps({"results": [{"employee_id": "E1"}]}))]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield server, f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        thread.join(timeout=5)


@pytest.fixture(autouse=True)
def _pinned_env(monkeypatch):
    monkeypatch.setenv("GE_SIMULATOR_SYSTEMS_DIR", str(CORPUS))
    monkeypatch.delenv(DISPATCH_ENV, raising=False)
    monkeypatch.delenv(DISPATCH_FILE_ENV, raising=False)
    monkeypatch.delenv(LIVE_CONFIRM_ENV, raising=False)
    monkeypatch.delenv(RECORD_DIR_ENV, raising=False)


def test_no_directive_means_twin_and_no_shape_change():
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {"query": "smith"})
    assert envelope["simulator"] is True
    assert envelope["status"] in ("ok", "error")
    assert "live" not in envelope


def test_live_http_opener_never_inherits_environment_proxies():
    configured = []

    def proxy_factory(proxies):
        configured.append(proxies)
        return urllib.request.ProxyHandler(proxies)

    opener = _build_live_opener(proxy_factory)
    assert configured == [{}]
    assert not any(isinstance(handler, urllib.request.ProxyHandler) for handler in opener.handlers)


def test_validated_dns_address_is_pinned_for_tcp_while_tls_keeps_original_hostname(monkeypatch):
    resolver_calls = 0

    def rebinding_resolver(host, port, **kwargs):
        nonlocal resolver_calls
        resolver_calls += 1
        address = "93.184.216.34" if resolver_calls == 1 else "169.254.169.254"
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", (address, port))]

    monkeypatch.setattr(live_dispatch.socket, "getaddrinfo", rebinding_resolver)
    parts = urllib.parse.urlsplit("https://api.example.com/v1")
    pinned = live_dispatch._resolve_target_addresses(parts, allow_private=False)

    connected = []

    class FakeSocket:
        def settimeout(self, timeout):
            self.timeout = timeout

        def connect(self, endpoint):
            connected.append(endpoint)

        def setsockopt(self, *args):
            pass

        def close(self):
            pass

    monkeypatch.setattr(live_dispatch.socket, "socket", lambda *_args: FakeSocket())

    wrapped = []

    class VerifyingContext:
        verify_mode = ssl.CERT_REQUIRED
        check_hostname = True
        post_handshake_auth = None

        def wrap_socket(self, raw_socket, *, server_hostname):
            wrapped.append((raw_socket, server_hostname))
            return raw_socket

    connection = live_dispatch._PinnedHTTPSConnection(
        "api.example.com",
        pinned_addresses=pinned,
        context=VerifyingContext(),
    )
    connection.connect()

    assert resolver_calls == 1
    assert connected == [("93.184.216.34", 443)]
    assert connection.host == "api.example.com"
    assert wrapped[0][1] == "api.example.com"


def test_response_limit_hard_cap_and_bounded_reader_fail_before_oversized_read(monkeypatch, stub_server):
    server, base_url = stub_server
    _activate(monkeypatch, base_url, maxResponseBytes=MAX_RESPONSE_BYTES_HARD_CAP + 1)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_policy_invalid"
    assert server.requests == []

    class RecordingResponse:
        headers = {}

        def __init__(self):
            self.body = bytearray(b"123456789")
            self.read_sizes = []

        def read(self, size):
            self.read_sizes.append(size)
            chunk = bytes(self.body[:size])
            del self.body[:size]
            return chunk

    response = RecordingResponse()
    with pytest.raises(LiveDispatchConfigurationError, match="8-byte limit"):
        live_dispatch._bounded_read(response, 8)
    assert response.read_sizes == [8, 1]


def test_read_ops_forward_to_the_live_system(monkeypatch, stub_server):
    server, base_url = stub_server
    _activate(monkeypatch, base_url)

    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {"status": "active"})
    assert envelope["live"] is True
    assert envelope["simulator"] is False
    assert envelope["status"] == "ok"
    assert envelope["data"] == {"results": [{"employee_id": "E1"}]}
    # No queryMap is declared in the pack, so no argument is forwarded by
    # implication. Tool metadata must opt each query field in explicitly.
    assert server.requests[0]["path"] == "/employees"

    envelope = execute_simulator_tool("agent-x", _tool("get_employee"), {"employee_id": "E1"})
    assert envelope["status"] == "ok"
    assert server.requests[1]["path"] == "/employees/E1"


def test_write_ops_stay_on_the_twin_whatever_the_directive_says(monkeypatch, stub_server):
    server, base_url = stub_server
    _activate(monkeypatch, base_url)

    envelope = execute_simulator_tool(
        "agent-x", _tool("submit_employee_update"), {"employee_id": "EMP-2001", "update_type": "address_change"}
    )
    # Whatever the twin decides about this submit, it must be the TWIN deciding.
    assert envelope["simulator"] is True
    assert "live" not in envelope
    assert server.requests == []
    assert "submit" not in READ_OPS and "create" not in READ_OPS


def test_bearer_auth_resolves_from_the_named_env_var(monkeypatch, stub_server):
    server, base_url = stub_server
    _activate(monkeypatch, base_url, authEnv="ABSENCESOFT_TOKEN")
    monkeypatch.setenv("ABSENCESOFT_TOKEN", "tok-123")

    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["status"] == "ok"
    assert server.requests[0]["authorization"] == "Bearer tok-123"


def test_named_but_unset_auth_var_fails_loudly_without_dialing(monkeypatch, stub_server):
    server, base_url = stub_server
    _activate(monkeypatch, base_url, authEnv="NOT_SET_ANYWHERE")

    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["status"] == "error"
    assert envelope["error"]["code"] == "live_auth_unresolved"
    assert "NOT_SET_ANYWHERE" in envelope["error"]["message"]
    assert server.requests == []


def test_live_first_falls_back_to_twin_on_an_operational_live_failure(monkeypatch, stub_server):
    server, base_url = stub_server
    server.replies = [(503, json.dumps({"down": True}))]
    _activate(monkeypatch, base_url)

    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["simulator"] is True
    assert envelope["fallback"] == {"from": "live", "to": "twin", "reason": "live_http_503"}


def test_live_first_falls_back_to_twin_when_target_is_unreachable(monkeypatch):
    _activate(monkeypatch, "http://127.0.0.1:1", timeoutMs=500)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["simulator"] is True
    assert envelope["fallback"]["reason"] == "live_unreachable"


def test_directive_file_env_and_target_gating(monkeypatch, tmp_path):
    path = tmp_path / "dispatch.json"
    path.write_text(_directive("https://crm.example.com"))
    monkeypatch.setenv(LIVE_CONFIRM_ENV, "1")
    monkeypatch.setenv(DISPATCH_FILE_ENV, str(path))
    assert live_target(SYSTEM)["baseUrl"] == "https://crm.example.com"
    assert live_target("unbound-system") is None
    monkeypatch.delenv(DISPATCH_FILE_ENV)

    # A configured but inconsistent/unsafe route fails closed rather than
    # silently turning into a twin decision.
    for entry in (
        {"decision": "twin", "kind": "rest", "baseUrl": "https://x.example.com"},
        {"decision": "live", "kind": "mcp", "baseUrl": "https://x.example.com"},
        {"decision": "live", "kind": "rest", "baseUrl": "ftp://x"},
    ):
        monkeypatch.setenv(
            DISPATCH_ENV,
            json.dumps({"schemaVersion": DIRECTIVE_SCHEMA_VERSION, "systems": {SYSTEM: entry}}),
        )
        with pytest.raises(LiveDispatchConfigurationError):
            live_target(SYSTEM)

    monkeypatch.setenv(DISPATCH_ENV, json.dumps({"schemaVersion": "ge.dispatch-directive.v0", "systems": {}}))
    with pytest.raises(ValueError):
        live_target(SYSTEM)


def test_live_activation_requires_a_separate_explicit_confirmation(monkeypatch, stub_server):
    server, base_url = stub_server
    monkeypatch.setenv(
        DISPATCH_ENV,
        _directive(base_url, allowInsecureHttp=True, allowPrivateNetwork=True),
    )
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_approval_required"
    assert LIVE_CONFIRM_ENV in envelope["error"]["message"]
    assert server.requests == []


@pytest.mark.parametrize(
    ("base_url", "extra", "expected_code"),
    [
        ("http://user:pass@127.0.0.1:9", {"allowInsecureHttp": True, "allowPrivateNetwork": True}, "live_target_userinfo"),
        ("http://127.0.0.1:9", {"allowPrivateNetwork": True}, "live_target_insecure"),
        ("http://127.0.0.1:9", {"allowInsecureHttp": True}, "live_private_target"),
        ("https://169.254.169.254/latest/meta-data", {}, "live_private_target"),
        ("https://metadata.google.internal/computeMetadata/v1", {}, "live_private_target"),
    ],
)
def test_ssrf_and_transport_policy_fail_closed(monkeypatch, base_url, extra, expected_code):
    monkeypatch.setenv(LIVE_CONFIRM_ENV, "1")
    monkeypatch.setenv(DISPATCH_ENV, _directive(base_url, **extra))
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["status"] == "error"
    assert envelope["error"]["code"] == expected_code
    assert "http" not in envelope["error"]["message"]


def test_only_declared_query_mapping_is_forwarded(monkeypatch, stub_server):
    server, base_url = stub_server
    contract = deepcopy(router.get_simulator_contract(SYSTEM))
    tool = next(item for item in contract["toolCatalog"]["tools"] if item["name"] == "search_employees")
    tool["binding"]["queryMap"] = {"status": "state", "limit": "page_size"}
    monkeypatch.setattr(router, "get_simulator_contract", lambda _system_id: contract)
    _activate(monkeypatch, base_url)

    envelope = execute_simulator_tool(
        "agent-x",
        _tool("search_employees"),
        {"status": "active", "limit": 5, "secret": "must-not-forward"},
    )
    assert envelope["status"] == "ok"
    assert server.requests[0]["path"] == "/employees?state=active&page_size=5"
    assert "secret" not in server.requests[0]["path"]


def test_twin_first_never_calls_live_after_a_twin_error(monkeypatch, stub_server):
    server, base_url = stub_server
    _activate(monkeypatch, base_url, mode="twin_first")

    twin = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert twin["simulator"] is True
    assert server.requests == []

    original = router.get_simulator_handlers

    def failing_handlers(system_id, tenant=None):
        handlers = dict(original(system_id, tenant=tenant))

        def fail(_ctx, _args):
            raise SimulatorError("twin_read_failed", "synthetic twin read failed")

        handlers["search_employees"] = fail
        return handlers

    monkeypatch.setattr(router, "get_simulator_handlers", failing_handlers)
    twin_error = execute_simulator_tool("agent-y", _tool("search_employees"), {})
    assert twin_error["simulator"] is True
    assert twin_error["status"] == "error"
    assert twin_error["error"]["code"] == "twin_read_failed"
    assert "live" not in twin_error
    assert server.requests == []


def test_twin_first_does_not_require_live_call_approval(monkeypatch, stub_server):
    server, base_url = stub_server
    monkeypatch.setenv(DISPATCH_ENV, _directive(base_url, mode="twin_first", allowInsecureHttp=True, allowPrivateNetwork=True))
    monkeypatch.delenv(LIVE_CONFIRM_ENV, raising=False)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["simulator"] is True
    assert envelope["status"] == "ok"
    assert server.requests == []


def test_auth_failures_do_not_fall_back_to_plausible_twin_data(monkeypatch, stub_server):
    server, base_url = stub_server
    server.replies = [(401, json.dumps({"token": "secret-live-body"}))]
    _activate(monkeypatch, base_url)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_http_401"
    assert envelope["live"] is True
    assert "fallback" not in envelope
    assert "secret-live-body" not in json.dumps(envelope)


@pytest.mark.parametrize("status", [400, 404])
def test_live_first_does_not_fallback_on_client_or_data_misses(monkeypatch, stub_server, status):
    server, base_url = stub_server
    server.replies = [(status, json.dumps({"private": "live-error-body"}))]
    _activate(monkeypatch, base_url)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["error"]["code"] == f"live_http_{status}"
    assert envelope["live"] is True
    assert "fallback" not in envelope
    assert "live-error-body" not in json.dumps(envelope)


def test_redirect_status_without_location_is_an_error_not_live_success(monkeypatch, stub_server):
    server, base_url = stub_server
    server.replies = [(302, json.dumps({"unexpected": "body"}))]
    _activate(monkeypatch, base_url)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["status"] == "error"
    assert envelope["error"]["code"] == "live_http_302"
    assert "data" not in envelope


def test_redirects_are_same_origin_and_confined_to_the_base_path(monkeypatch, stub_server):
    server, origin = stub_server
    base_url = f"{origin}/api"
    server.replies = [
        (302, "", {"location": f"{origin}/api/next"}),
        (200, json.dumps({"ok": True})),
    ]
    _activate(monkeypatch, base_url)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["status"] == "ok"
    assert [request["path"] for request in server.requests] == ["/api/employees", "/api/next"]

    server.requests.clear()
    server.replies = [(302, "", {"location": "https://evil.example/steal"})]
    envelope = execute_simulator_tool("agent-y", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_unsafe_redirect"
    assert len(server.requests) == 1

    server.requests.clear()
    port = server.server_address[1]
    server.replies = [(302, "", {"location": f"http://user:pass@127.0.0.1:{port}/api/steal"})]
    envelope = execute_simulator_tool("agent-userinfo", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_unsafe_redirect"
    assert len(server.requests) == 1

    server.requests.clear()
    server.replies = [(302, "", {"location": "/admin"})]
    envelope = execute_simulator_tool("agent-z", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_path_escape"
    assert len(server.requests) == 1


def test_response_reads_are_bounded_and_live_payloads_never_enter_cassettes(monkeypatch, stub_server, tmp_path):
    server, base_url = stub_server
    server.replies = [(200, json.dumps({"secret": "live-pii"}))]
    _activate(monkeypatch, base_url, maxResponseBytes=8)
    monkeypatch.setenv(RECORD_DIR_ENV, str(tmp_path))
    oversized = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert oversized["error"]["code"] == "live_response_too_large"
    assert list(tmp_path.iterdir()) == []

    _activate(monkeypatch, base_url, maxResponseBytes=1024)
    success = execute_simulator_tool("agent-y", _tool("search_employees"), {})
    assert success["data"] == {"secret": "live-pii"}
    assert list(tmp_path.iterdir()) == []


def test_canonical_collection_and_record_paths_cannot_escape(monkeypatch, stub_server):
    server, base_url = stub_server
    contract = deepcopy(router.get_simulator_contract(SYSTEM))
    search = next(item for item in contract["toolCatalog"]["tools"] if item["name"] == "search_employees")
    search["binding"]["collection"] = "%252e%252e/admin"
    monkeypatch.setattr(router, "get_simulator_contract", lambda _system_id: contract)
    _activate(monkeypatch, base_url)
    envelope = execute_simulator_tool("agent-x", _tool("search_employees"), {})
    assert envelope["error"]["code"] == "live_path_escape"
    assert server.requests == []
