from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import chaos, clock, generic  # noqa: E402
from simulator_runtime.chaos import (  # noqa: E402
    CHAOS_PROFILE_ENV,
    CHAOS_PROFILES,
    effective_latency,
    resolve_chaos,
)
from simulator_runtime.failures import select_failure  # noqa: E402
from simulator_runtime.simulators import SimulatorError  # noqa: E402


def _ctx(system: str, scenario: str) -> SimpleNamespace:
    return SimpleNamespace(
        agent_id="agent-chaos",
        system_id=system,
        scenario_id=scenario,
        actor="x@example.com",
        role="hr_partner",
    )


def _reset_state(ctx) -> None:
    generic._store_for(ctx).delete(generic._state_key(ctx))


def _contract(extra: dict | None = None) -> dict:
    contract = {
        "schema": {"collections": {"things": {"primaryKey": "thing_id", "fields": {"status": {}}}}},
        "toolCatalog": {
            "tools": [
                {
                    "name": "search_things",
                    "inputSchema": {"type": "object", "properties": {"query": {}}},
                },
                {
                    "name": "submit_thing_update",
                    "inputSchema": {"type": "object", "properties": {"thing_id": {}, "status": {}}},
                },
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "submit_thing_update": {
                    "collection": "things",
                    "primaryKey": "thing_id",
                    "stateField": "status",
                    "transitions": {"*": ["active", "closed"]},
                }
            }
        },
    }
    contract.update(extra or {})
    return contract


def _seed(ctx) -> None:
    _reset_state(ctx)
    state = generic.generic_state(ctx)
    state["things"] = [{"thing_id": "T-1", "status": "active"}]
    state.setdefault("audit_events", [])
    generic._save_state(ctx, state)


def _run_writes(handler, ctx, n: int) -> list[tuple[str, str | None] | None]:
    """Drive n alternating transitions; None per success, (code, detail) per injection."""
    outcomes: list[tuple[str, str | None] | None] = []
    target = "closed"
    for _ in range(n):
        try:
            handler(ctx, {"thing_id": "T-1", "status": target})
            outcomes.append(None)
            target = "active" if target == "closed" else "closed"
        except SimulatorError as exc:
            outcomes.append((exc.code, (exc.audit or {}).get("detail")))
    return outcomes


@pytest.fixture(autouse=True)
def _clean_env(monkeypatch):
    monkeypatch.delenv(CHAOS_PROFILE_ENV, raising=False)
    monkeypatch.delenv(clock.VIRTUAL_TIME_ENV, raising=False)
    monkeypatch.delenv(clock.EPOCH_ENV, raising=False)


# --- activation & resolution ---------------------------------------------------


def test_no_profile_is_a_noop_decision():
    decision = resolve_chaos(contract={}, workflow=None, tool="submit_thing_update", ctx=None, call_index=0)
    assert decision.profile is None
    assert decision.weights == {}
    assert decision.latency_multiplier == 1.0


def test_steady_profile_injects_nothing(monkeypatch):
    monkeypatch.setenv(CHAOS_PROFILE_ENV, "steady")
    decision = resolve_chaos(contract={}, tool="submit_thing_update", ctx=None, call_index=0)
    assert decision.profile == "steady"
    assert decision.weights == {}


def test_env_and_contract_activation_are_equivalent(monkeypatch):
    monkeypatch.setenv(CHAOS_PROFILE_ENV, "brownout")
    via_env = resolve_chaos(contract={}, tool="submit_thing_update", ctx=None, call_index=3)
    monkeypatch.delenv(CHAOS_PROFILE_ENV)
    via_contract = resolve_chaos(
        contract={"chaosProfile": "brownout"}, tool="submit_thing_update", ctx=None, call_index=3
    )
    assert via_env.profile == via_contract.profile == "brownout"
    assert via_env.weights == via_contract.weights == CHAOS_PROFILES["brownout"]["weights"]


def test_contract_profile_wins_over_env(monkeypatch):
    monkeypatch.setenv(CHAOS_PROFILE_ENV, "storm")
    decision = resolve_chaos(
        contract={"chaosProfile": "steady"}, tool="submit_thing_update", ctx=None, call_index=0
    )
    assert decision.profile == "steady"
    assert decision.weights == {}


def test_unknown_profile_is_a_noop(monkeypatch):
    monkeypatch.setenv(CHAOS_PROFILE_ENV, "tornado")
    decision = resolve_chaos(contract={}, tool="submit_thing_update", ctx=None, call_index=0)
    assert decision.profile is None
    assert decision.weights == {}


# --- burst windows (flaky_dependency) -------------------------------------------


def test_flaky_dependency_bursts_are_windowed_periodic_and_recomputable():
    contract = {"chaosProfile": "flaky_dependency"}
    ctx = _ctx("__chaos_burst__", "scn-burst")
    burst = CHAOS_PROFILES["flaky_dependency"]["burst"]
    period, width = burst["period"], burst["width"]
    flags = [
        bool(resolve_chaos(contract=contract, tool="submit_thing_update", ctx=ctx, call_index=i).weights)
        for i in range(2 * period)
    ]
    # Injection is confined to one width-sized window per period, repeating.
    assert sum(flags) == 2 * width
    assert flags[:period] == flags[period:]
    assert not all(flags) and any(flags)
    # The window phase is independently recomputable (process-independent BLAKE2b).
    phase = chaos.burst_phase(ctx, "flaky_dependency", period)
    for index, injecting in enumerate(flags):
        assert injecting == (((index - phase) % period) < width)


# --- degraded_writes targets writes only ----------------------------------------


def test_degraded_writes_skips_read_tools():
    contract = {"chaosProfile": "degraded_writes"}
    for read_tool in ("search_things", "get_thing", "list_things", "poll_async_job"):
        assert resolve_chaos(contract=contract, tool=read_tool, ctx=None, call_index=0).weights == {}
    for write_tool in ("submit_thing_update", "create_order", "update_record"):
        decision = resolve_chaos(contract=contract, tool=write_tool, ctx=None, call_index=0)
        assert decision.weights == CHAOS_PROFILES["degraded_writes"]["weights"]


# --- latency shaping -------------------------------------------------------------


def test_effective_latency_is_untouched_without_profile():
    config = {"distribution": "fixed", "ms": 100}
    assert effective_latency(config, contract={}) is config
    assert effective_latency(None, contract={}) is None


def test_effective_latency_scales_and_provides_base(monkeypatch):
    contract = {"chaosProfile": "brownout"}
    scaled = effective_latency({"distribution": "fixed", "ms": 100}, contract=contract)
    assert scaled["ms"] == pytest.approx(300.0)
    base = effective_latency(None, contract=contract)
    assert base == CHAOS_PROFILES["brownout"]["baseLatency"]
    assert base is not CHAOS_PROFILES["brownout"]["baseLatency"]  # a copy, not the spec


# --- deterministic selection (recomputable across processes) ---------------------


def test_chaos_draw_is_deterministic_when_recomputed():
    weights = CHAOS_PROFILES["brownout"]["weights"]
    draws = {
        select_failure(
            weights,
            agent="agent-chaos",
            system="__chaos_sys__",
            scenario="scn-x",
            seed="chaos:brownout:7",
            tool="submit_thing_update",
        )
        for _ in range(5)
    }
    assert len(draws) == 1  # identical inputs ⇒ identical outcome, every time


# --- end to end through the generic handlers ------------------------------------


def test_no_profile_e2e_behaves_exactly_as_before():
    handler = generic.build_generic_handlers(_contract())["submit_thing_update"]
    ctx = _ctx("__chaos_off__", "scn-off")
    _seed(ctx)
    assert _run_writes(handler, ctx, 40) == [None] * 40


def test_brownout_e2e_injects_timeouts_with_chaos_audit_detail(monkeypatch):
    monkeypatch.setenv(CHAOS_PROFILE_ENV, "brownout")
    # Virtual time keeps brownout's injected latency simulated (no wall sleeps).
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    handler = generic.build_generic_handlers(_contract())["submit_thing_update"]
    ctx = _ctx("__chaos_brownout__", "scn-brownout")
    _seed(ctx)
    outcomes = _run_writes(handler, ctx, 80)
    failures = [o for o in outcomes if o is not None]
    assert failures, "brownout (timeout weight 0.08) must fire within 80 calls"
    assert {code for code, _ in failures} == {"timeout"}
    assert {detail for _, detail in failures} == {"chaos:brownout"}
    # The injected events landed in the audit trail with the chaos detail.
    trail = generic.generic_state(ctx)["audit_events"]
    assert any(e.get("detail") == "chaos:brownout" and e.get("outcome") == "timeout" for e in trail)
    # Deterministic across a fresh run of the same (agent, system, scenario).
    _seed(ctx)
    assert _run_writes(handler, ctx, 80) == outcomes


def test_brownout_via_contract_field_without_env(monkeypatch):
    monkeypatch.setenv(clock.VIRTUAL_TIME_ENV, "1")
    contract = _contract({"chaosProfile": "brownout"})
    handler = generic.build_generic_handlers(contract)["submit_thing_update"]
    ctx = _ctx("__chaos_brownout_contract__", "scn-brownout-c")
    _seed(ctx)
    outcomes = _run_writes(handler, ctx, 80)
    failures = [o for o in outcomes if o is not None]
    assert failures
    assert {detail for _, detail in failures} == {"chaos:brownout"}


def test_degraded_writes_e2e_hits_writes_and_leaves_reads_clean(monkeypatch):
    monkeypatch.setenv(CHAOS_PROFILE_ENV, "degraded_writes")
    handlers = generic.build_generic_handlers(_contract())
    ctx = _ctx("__chaos_degraded__", "scn-degraded")
    _seed(ctx)
    # Reads never inject (chaos composes with the write-path injection hook only).
    for _ in range(25):
        result = handlers["search_things"](ctx, {"query": ""})
        assert "things" in result
    # Writes deterministically degrade with the profile's modes and audit detail.
    outcomes = _run_writes(handlers["submit_thing_update"], ctx, 120)
    failures = [o for o in outcomes if o is not None]
    assert failures, "degraded_writes (0.12 total weight) must fire within 120 calls"
    assert {code for code, _ in failures} <= {"conflict", "validation_error"}
    assert {detail for _, detail in failures} == {"chaos:degraded_writes"}
