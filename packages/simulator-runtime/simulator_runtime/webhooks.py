from __future__ import annotations

import hashlib
import hmac
import json
import logging
import os
import time
from typing import Any, Callable, Protocol, runtime_checkable

logger = logging.getLogger(__name__)


# A transition in workflows.json may declare:
#   "emit": [{"event": "worker.terminated", "target": "https://sub.example/hook"}]
# When the transition fires, the engine POSTs the event payload to each target URL
# with an HMAC-SHA256 signature header, retrying with bounded exponential backoff.
# Webhook delivery is best-effort: every outcome (delivered/failed) is recorded in
# the audit trail and a delivery NEVER blocks or fails the primary tool call.
SIGNATURE_HEADER = "X-GE-Signature"
EVENT_HEADER = "X-GE-Event"
DEFAULT_MAX_ATTEMPTS = 3
DEFAULT_BACKOFF_BASE = 0.2  # seconds; multiplied by 2**attempt


@runtime_checkable
class HttpClient(Protocol):
    """Minimal injectable HTTP client. Returns the response status code.

    Implementations should raise on a transport error so the emitter can retry.
    """

    def post(self, url: str, *, data: bytes, headers: dict[str, str]) -> int:
        ...


class UrllibHttpClient:
    """Default client over the stdlib (no new dependency)."""

    def __init__(self, timeout: float = 5.0) -> None:
        self._timeout = timeout

    def post(self, url: str, *, data: bytes, headers: dict[str, str]) -> int:
        from urllib.request import Request, urlopen

        request = Request(url, data=data, headers=headers, method="POST")
        with urlopen(request, timeout=self._timeout) as response:  # noqa: S310 - target is contract-declared
            return int(getattr(response, "status", 200) or 200)


def _sign(secret: str, body: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()


def _resolve_secret(secret: str | None) -> str:
    return secret or os.environ.get("GE_WEBHOOK_SECRET") or "ge-simulator-dev-secret"


class WebhookEmitter:
    """Delivers transition events to subscriber URLs with bounded retry + HMAC.

    The HTTP client and sleep clock are injectable so tests run with no real network
    and no real delay. Delivery results are returned as audit-shaped dicts; the caller
    appends them to ``state["audit_events"]`` so failures are visible but never raised.
    """

    def __init__(
        self,
        *,
        http_client: HttpClient | None = None,
        secret: str | None = None,
        max_attempts: int = DEFAULT_MAX_ATTEMPTS,
        backoff_base: float = DEFAULT_BACKOFF_BASE,
        sleep: Callable[[float], None] | None = None,
    ) -> None:
        self._http = http_client or UrllibHttpClient()
        self._secret = _resolve_secret(secret)
        self._max_attempts = max(1, int(max_attempts))
        self._backoff_base = float(backoff_base)
        self._sleep = sleep or time.sleep

    def _deliver_one(self, event: str, target: str, payload: dict[str, Any]) -> dict[str, Any]:
        body = json.dumps(payload, sort_keys=True, default=str).encode("utf-8")
        signature = _sign(self._secret, body)
        headers = {
            "Content-Type": "application/json",
            EVENT_HEADER: event,
            SIGNATURE_HEADER: f"sha256={signature}",
        }
        last_error: str | None = None
        for attempt in range(self._max_attempts):
            try:
                status = self._http.post(target, data=body, headers=headers)
                if 200 <= int(status) < 300:
                    return {"event": event, "target": target, "outcome": "delivered", "status": int(status), "attempts": attempt + 1}
                last_error = f"http {status}"
            except Exception as exc:  # noqa: BLE001 - transport failures are retried
                last_error = str(exc)
            if attempt + 1 < self._max_attempts:
                self._sleep(self._backoff_base * (2 ** attempt))
        logger.warning("webhook %s to %s failed after %s attempts: %s", event, target, self._max_attempts, last_error)
        return {"event": event, "target": target, "outcome": "failed", "error": last_error, "attempts": self._max_attempts}

    def emit(self, emit_specs: list[dict[str, Any]] | None, payload: dict[str, Any]) -> list[dict[str, Any]]:
        """Deliver every ``{event, target}`` spec; return per-delivery audit dicts.

        Never raises: a malformed spec or a failed delivery is reported in the
        returned list, so the primary call is unaffected.
        """
        results: list[dict[str, Any]] = []
        for spec in emit_specs or []:
            event = str(spec.get("event") or "event")
            target = spec.get("target")
            if not target:
                results.append({"event": event, "target": None, "outcome": "skipped", "error": "missing target"})
                continue
            try:
                results.append(self._deliver_one(event, str(target), payload))
            except Exception as exc:  # noqa: BLE001 - emitter must never break the primary call
                logger.warning("webhook emit error for %s: %s", event, exc)
                results.append({"event": event, "target": str(target), "outcome": "failed", "error": str(exc)})
        return results


_DEFAULT_EMITTER: WebhookEmitter | None = None


def default_emitter() -> WebhookEmitter:
    global _DEFAULT_EMITTER
    if _DEFAULT_EMITTER is None:
        _DEFAULT_EMITTER = WebhookEmitter()
    return _DEFAULT_EMITTER
