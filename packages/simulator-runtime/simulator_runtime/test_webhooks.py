from __future__ import annotations

import hashlib
import hmac
import json
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime.webhooks import (  # noqa: E402
    EVENT_HEADER,
    SIGNATURE_HEADER,
    WebhookEmitter,
)


class FakeHttpClient:
    """Records POSTs; returns a scripted sequence of status codes / exceptions."""

    def __init__(self, responses=None):
        # responses: list of int (status) or Exception (raised). Default: always 200.
        self._responses = list(responses or [])
        self.calls: list[dict] = []

    def post(self, url, *, data, headers):
        self.calls.append({"url": url, "data": data, "headers": headers})
        if not self._responses:
            return 200
        nxt = self._responses.pop(0)
        if isinstance(nxt, Exception):
            raise nxt
        return nxt


class FakeClock:
    def __init__(self):
        self.slept: list[float] = []

    def sleep(self, seconds):
        self.slept.append(seconds)


def _emitter(http, clock=None, **kwargs):
    clock = clock or FakeClock()
    return WebhookEmitter(http_client=http, sleep=clock.sleep, secret="test-secret", **kwargs), clock


# --- happy path --------------------------------------------------------------


def test_emit_delivers_and_signs():
    http = FakeHttpClient([200])
    emitter, clock = _emitter(http)
    payload = {"entity": "worker", "entity_id": "W-1"}
    results = emitter.emit([{"event": "worker.terminated", "target": "https://sub/hook"}], payload)

    assert results == [
        {"event": "worker.terminated", "target": "https://sub/hook", "outcome": "delivered", "status": 200, "attempts": 1}
    ]
    assert clock.slept == []
    call = http.calls[0]
    assert call["url"] == "https://sub/hook"
    assert call["headers"][EVENT_HEADER] == "worker.terminated"

    # Signature is a valid HMAC-SHA256 over the exact body with the secret.
    body = call["data"]
    expected = "sha256=" + hmac.new(b"test-secret", body, hashlib.sha256).hexdigest()
    assert call["headers"][SIGNATURE_HEADER] == expected
    assert json.loads(body) == payload


def test_emit_multiple_targets():
    http = FakeHttpClient([200, 200])
    emitter, _ = _emitter(http)
    results = emitter.emit(
        [
            {"event": "a", "target": "https://one"},
            {"event": "b", "target": "https://two"},
        ],
        {"x": 1},
    )
    assert [r["outcome"] for r in results] == ["delivered", "delivered"]
    assert len(http.calls) == 2


# --- retry + backoff ---------------------------------------------------------


def test_emit_retries_on_5xx_then_succeeds():
    http = FakeHttpClient([500, 200])
    emitter, clock = _emitter(http, max_attempts=3, backoff_base=0.1)
    results = emitter.emit([{"event": "e", "target": "https://sub"}], {"x": 1})
    assert results[0]["outcome"] == "delivered"
    assert results[0]["attempts"] == 2
    assert clock.slept == [0.1]  # one backoff between attempt 1 and 2


def test_emit_retries_on_transport_error():
    http = FakeHttpClient([ConnectionError("refused"), 200])
    emitter, clock = _emitter(http)
    results = emitter.emit([{"event": "e", "target": "https://sub"}], {"x": 1})
    assert results[0]["outcome"] == "delivered"
    assert results[0]["attempts"] == 2


def test_emit_exhausts_retries_and_reports_failed():
    http = FakeHttpClient([500, 500, 500])
    emitter, clock = _emitter(http, max_attempts=3, backoff_base=0.05)
    results = emitter.emit([{"event": "e", "target": "https://sub"}], {"x": 1})
    assert results[0]["outcome"] == "failed"
    assert results[0]["attempts"] == 3
    assert results[0]["error"] == "http 500"
    assert clock.slept == [0.05, 0.1]  # backoff after attempt 1 and 2, none after the last


# --- never blocks the primary call -------------------------------------------


def test_emit_missing_target_is_skipped_not_raised():
    http = FakeHttpClient()
    emitter, _ = _emitter(http)
    results = emitter.emit([{"event": "e"}], {"x": 1})
    assert results[0]["outcome"] == "skipped"
    assert http.calls == []


def test_emit_none_specs_is_noop():
    http = FakeHttpClient()
    emitter, _ = _emitter(http)
    assert emitter.emit(None, {"x": 1}) == []
    assert http.calls == []


# --- integration with generic submit handler ---------------------------------


def test_generic_submit_emits_and_records_audit():
    from simulator_runtime import generic

    http = FakeHttpClient([200])
    emitter = WebhookEmitter(http_client=http, sleep=lambda s: None, secret="test-secret")
    generic.set_webhook_emitter(emitter)
    try:
        contract = {
            "schema": {"collections": {"workers": {"primaryKey": "worker_id", "fields": {"status": {}}}}},
            "toolCatalog": {"tools": [{"name": "submit_worker_update", "inputSchema": {"properties": {}}}]},
            "workflowCatalog": {
                "toolHandlers": {
                    "submit_worker_update": {
                        "collection": "workers",
                        "primaryKey": "worker_id",
                        "stateField": "status",
                        "targetStateArg": "status",
                        "emit": [{"event": "worker.terminated", "target": "https://sub/hook"}],
                        "transitions": {"*": ["terminated"]},
                    }
                }
            },
        }
        handlers = generic.build_generic_handlers(contract)
        ctx = SimpleNamespace(
            agent_id="agent-wh",
            system_id="__webhook_e2e__",
            scenario_id="scn-wh",
            actor="x@example.com",
            role="hr_partner",
        )
        state = generic.generic_state(ctx)
        state["workers"] = [{"worker_id": "W-1", "status": "active"}]
        generic._save_state(ctx, state)

        out = handlers["submit_worker_update"](ctx, {"worker_id": "W-1", "status": "terminated"})
        assert out["worker"]["status"] == "terminated"
        assert len(http.calls) == 1

        state2 = generic.generic_state(ctx)
        emit_audits = [e for e in state2["audit_events"] if e["action"] == "webhook_emit"]
        assert len(emit_audits) == 1
        assert emit_audits[0]["outcome"] == "delivered"
    finally:
        generic.set_webhook_emitter(None)


def test_generic_submit_webhook_failure_does_not_block_call():
    from simulator_runtime import generic

    http = FakeHttpClient([500, 500, 500])
    emitter = WebhookEmitter(http_client=http, sleep=lambda s: None, secret="test-secret", max_attempts=3)
    generic.set_webhook_emitter(emitter)
    try:
        contract = {
            "schema": {"collections": {"workers": {"primaryKey": "worker_id", "fields": {"status": {}}}}},
            "toolCatalog": {"tools": [{"name": "submit_worker_update", "inputSchema": {"properties": {}}}]},
            "workflowCatalog": {
                "toolHandlers": {
                    "submit_worker_update": {
                        "collection": "workers",
                        "primaryKey": "worker_id",
                        "stateField": "status",
                        "targetStateArg": "status",
                        "emit": [{"event": "worker.terminated", "target": "https://sub/hook"}],
                        "transitions": {"*": ["terminated"]},
                    }
                }
            },
        }
        handlers = generic.build_generic_handlers(contract)
        ctx = SimpleNamespace(
            agent_id="agent-wh2",
            system_id="__webhook_fail_e2e__",
            scenario_id="scn-wh2",
            actor="x@example.com",
            role="hr_partner",
        )
        state = generic.generic_state(ctx)
        state["workers"] = [{"worker_id": "W-1", "status": "active"}]
        generic._save_state(ctx, state)

        # Primary call still succeeds even though the webhook delivery failed.
        out = handlers["submit_worker_update"](ctx, {"worker_id": "W-1", "status": "terminated"})
        assert out["worker"]["status"] == "terminated"

        state2 = generic.generic_state(ctx)
        emit_audits = [e for e in state2["audit_events"] if e["action"] == "webhook_emit"]
        assert emit_audits[0]["outcome"] == "failed"
    finally:
        generic.set_webhook_emitter(None)
