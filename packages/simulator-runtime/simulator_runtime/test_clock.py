from __future__ import annotations

import re
import sys
import time
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import clock, generic  # noqa: E402
from simulator_runtime.audit import audit_event  # noqa: E402

ISO_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$")


def _ctx(system: str, scenario: str) -> SimpleNamespace:
    return SimpleNamespace(
        agent_id="agent-clock",
        system_id=system,
        scenario_id=scenario,
        actor="x@example.com",
        role="hr_partner",
    )


def _reset_state(ctx) -> None:
    generic._store_for(ctx).delete(generic._state_key(ctx))


def _parse(ts: str) -> datetime:
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


@pytest.fixture(autouse=True)
def _clean_env(monkeypatch):
    monkeypatch.delenv(clock.VIRTUAL_TIME_ENV, raising=False)
    monkeypatch.delenv(clock.EPOCH_ENV, raising=False)


# --- disabled (the default): wall clock, zero state, zero new fields ----------


def test_disabled_now_iso_is_wall_clock_and_touches_no_state():
    ctx = _ctx("__clock_off__", "scn-off-1")
    first = clock.now_iso(ctx)
    second = clock.now_iso(ctx)
    assert ISO_RE.match(first) and ISO_RE.match(second)
    # Fixed-width ISO ⇒ lexicographic order is chronological order.
    assert second >= first
    # Disabled mode must not materialize any simulator state.
    assert generic._store_for(ctx).get(generic._state_key(ctx)) is None


def test_disabled_audit_event_has_no_ts_field():
    event = audit_event(
        ctx=_ctx("__clock_off__", "scn-off-2"),
        action="a",
        entity="e",
        entity_id="1",
        outcome="read",
    )
    assert "ts" not in event


# --- enabled: deterministic, epoch-anchored ------------------------------------


def test_enabled_sequence_is_deterministic_across_fresh_runs(monkeypatch):
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    ctx = _ctx("__clock_sys__", "scn-det")
    _reset_state(ctx)
    first_run = [clock.advance(ctx) for _ in range(6)]
    _reset_state(ctx)  # a "fresh run" of the same (agent, system, scenario)
    second_run = [clock.advance(ctx) for _ in range(6)]
    assert first_run == second_run
    assert first_run == sorted(first_run)
    assert len(set(first_run)) == 6  # strictly advancing


def test_enabled_starts_at_default_epoch_with_steps_13_to_97(monkeypatch):
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    ctx = _ctx("__clock_sys__", "scn-steps")
    _reset_state(ctx)
    assert clock.now_iso(ctx) == "2026-01-01T09:00:00.000Z"
    previous = _parse(clock.now_iso(ctx))
    for _ in range(10):
        current = _parse(clock.advance(ctx))
        assert 13 <= (current - previous).total_seconds() <= 97
        previous = current


def test_epoch_env_is_respected(monkeypatch):
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    monkeypatch.setenv(clock.EPOCH_ENV, "2030-05-05T00:00:00Z")
    ctx = _ctx("__clock_sys__", "scn-epoch")
    _reset_state(ctx)
    assert clock.now_iso(ctx) == "2030-05-05T00:00:00.000Z"
    assert clock.advance(ctx).startswith("2030-05-05T00:0")


def test_bad_epoch_env_fails_loud(monkeypatch):
    monkeypatch.setenv(clock.EPOCH_ENV, "next tuesday")
    with pytest.raises(ValueError):
        clock.epoch()


def test_contract_virtual_time_opt_in_without_env():
    ctx = _ctx("__clock_sys__", "scn-contract")
    assert clock.enabled(ctx, {"virtualTime": True}) is True
    assert clock.enabled(ctx, {}) is False
    assert clock.enabled(ctx) is False


def test_enabled_audit_event_ts_comes_from_virtual_clock(monkeypatch):
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    ctx = _ctx("__clock_sys__", "scn-audit")
    _reset_state(ctx)
    first = audit_event(ctx=ctx, action="a", entity="e", entity_id="1", outcome="read")
    second = audit_event(ctx=ctx, action="a", entity="e", entity_id="1", outcome="read")
    # Stamps come off the epoch-anchored simulation clock, not wall time.
    assert first["ts"].startswith("2026-01-01T09:0")
    assert second["ts"] > first["ts"]


# --- enabled: throttle latency is recorded, never slept -------------------------


def _latency_contract() -> dict:
    return {
        "schema": {"collections": {"things": {"primaryKey": "thing_id", "fields": {"status": {}}}}},
        "toolCatalog": {
            "tools": [
                {
                    "name": "submit_thing_update",
                    "inputSchema": {"type": "object", "properties": {"thing_id": {}, "status": {}}},
                }
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "submit_thing_update": {
                    "collection": "things",
                    "primaryKey": "thing_id",
                    "stateField": "status",
                    "transitions": {"*": ["active", "closed"]},
                    "latency": {"distribution": "fixed", "ms": 5000},
                }
            }
        },
    }


def test_virtual_time_records_latency_instead_of_sleeping(monkeypatch):
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    handler = generic.build_generic_handlers(_latency_contract())["submit_thing_update"]
    ctx = _ctx("__clock_lat__", "scn-lat")
    _reset_state(ctx)
    state = generic.generic_state(ctx)
    state["things"] = [{"thing_id": "T-1", "status": "active"}]
    state.setdefault("audit_events", [])
    generic._save_state(ctx, state)

    started = time.monotonic()
    result = handler(ctx, {"thing_id": "T-1", "status": "closed"})
    elapsed = time.monotonic() - started

    assert result["thing"]["status"] == "closed"
    assert elapsed < 1.0  # the configured 5s latency must NOT be wall-slept
    events = generic.generic_state(ctx)["audit_events"]
    latency_events = [e for e in events if e.get("outcome") == "latency_injected"]
    assert latency_events, "simulated latency must be recorded in the audit trail"
    assert latency_events[0]["detail"] == "virtual_latency_ms=5000"
    assert all("ts" in e for e in events)
