from __future__ import annotations

from types import SimpleNamespace

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest  # noqa: E402

from simulator_runtime import failures  # noqa: E402
from simulator_runtime.failures import (  # noqa: E402
    Conflict,
    Forbidden,
    RateLimited,
    Timeout,
    Unauthorized,
    ValidationError,
    maybe_inject_failure,
    resolve_weights,
    select_failure,
)
from simulator_runtime.generic import STATE, build_generic_handlers  # noqa: E402
from simulator_runtime.simulators import SimulatorError  # noqa: E402


def _ctx(agent="agent-f", scenario="scenario-f"):
    return SimpleNamespace(
        agent_id=agent,
        system_id="generic_contract",
        scenario_id=scenario,
        actor="buyer@example.com",
        role="buyer",
    )


# ---------------------------------------------------------------------------
# Typed error hierarchy
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "cls,code,status",
    [
        (RateLimited, "rate_limited", 429),
        (ValidationError, "validation_error", 422),
        (Conflict, "conflict", 409),
        (Unauthorized, "unauthorized", 401),
        (Forbidden, "forbidden", 403),
        (Timeout, "timeout", 504),
    ],
)
def test_each_typed_error_has_code_status_and_is_simulator_error(cls, code, status):
    err = cls()
    assert isinstance(err, SimulatorError)  # router envelope still works
    assert err.code == code
    assert err.status == status


def test_typed_error_carries_audit_and_message():
    audit = {"outcome": "rate_limited"}
    err = RateLimited("too many requests", audit=audit)
    assert err.audit is audit
    assert "too many" in str(err)


def test_raise_failure_attaches_audit_event():
    ctx = _ctx()
    with pytest.raises(Conflict) as exc:
        failures.raise_failure("conflict", ctx=ctx, tool="submit_x", entity="supplier", entity_id="S-1")
    err = exc.value
    assert err.code == "conflict"
    assert err.audit is not None
    assert err.audit["outcome"] == "conflict"
    assert err.audit["action"] == "submit_x"
    assert err.audit["entity_id"] == "S-1"


def test_alias_modes_map_onto_typed_errors():
    ctx = _ctx()
    for mode, expected in [
        ("stale_read", Conflict),
        ("security_domain_denied", Forbidden),
        ("network_delivery_failed", Timeout),
        ("401", Unauthorized),
    ]:
        with pytest.raises(expected):
            failures.raise_failure(mode, ctx=ctx, tool="t")


# ---------------------------------------------------------------------------
# Weight resolution (backward-compatible)
# ---------------------------------------------------------------------------


def test_resolve_weights_empty_when_no_declaration():
    assert resolve_weights() == {}
    assert resolve_weights(workflow={}, contract={}) == {}


def test_resolve_weights_ignores_plain_string_list_system_declaration():
    # The registry's declared-modes shape is list[str] with no probabilities; it
    # must NOT enable injection (would change behaviour for every system).
    contract = {"failureModes": ["permission_denied", "validation_error", "rate_limited"]}
    assert resolve_weights(contract=contract) == {}


def test_resolve_weights_reads_dict_and_drops_unrealizable_modes():
    workflow = {"failureModes": {"rate_limited": 0.2, "missing_approval": 0.5, "conflict": 0.1}}
    # missing_approval is realized inline by the engine, not injectable here.
    assert resolve_weights(workflow=workflow) == {"rate_limited": 0.2, "conflict": 0.1}


def test_resolve_weights_reads_list_of_objects():
    workflow = {"failureModes": [{"mode": "timeout", "weight": 0.3}, {"validation_error": 0.1}]}
    assert resolve_weights(workflow=workflow) == {"timeout": 0.3, "validation_error": 0.1}


def test_workflow_weights_take_precedence_over_contract():
    workflow = {"failureModes": {"conflict": 0.4}}
    contract = {"failureModes": {"rate_limited": 0.4}}
    assert resolve_weights(workflow=workflow, contract=contract) == {"conflict": 0.4}


# ---------------------------------------------------------------------------
# Deterministic selection
# ---------------------------------------------------------------------------


def test_select_failure_none_when_no_weights():
    assert select_failure({}, agent="a", system="s", scenario="sc") is None


def test_select_failure_is_deterministic_per_seed_tuple():
    weights = {"rate_limited": 0.5, "conflict": 0.5}
    first = select_failure(weights, agent="a", system="s", scenario="sc", seed=7, tool="submit_x")
    again = select_failure(weights, agent="a", system="s", scenario="sc", seed=7, tool="submit_x")
    assert first == again
    # Changing any key in the tuple may change the draw, but repeated identical
    # calls never vary.
    for _ in range(5):
        assert select_failure(weights, agent="a", system="s", scenario="sc", seed=7, tool="submit_x") == first


def test_select_failure_varies_across_inputs():
    weights = {"rate_limited": 0.5, "conflict": 0.5}
    draws = {
        select_failure(weights, agent=f"a{i}", system="s", scenario="sc", seed=0, tool="t")
        for i in range(50)
    }
    # With two equally-weighted (and summing-to-1) modes, both should appear
    # across 50 distinct agents.
    assert {"rate_limited", "conflict"} <= draws


def test_select_failure_respects_probability_mass():
    # Low total weight ⇒ mostly None across many distinct inputs.
    weights = {"rate_limited": 0.1}
    nones = sum(
        1
        for i in range(200)
        if select_failure(weights, agent=f"a{i}", system="s", scenario="sc", seed=0, tool="t") is None
    )
    assert nones > 150  # ~90% expected None


# ---------------------------------------------------------------------------
# maybe_inject_failure: backward-compat no-op + raising path
# ---------------------------------------------------------------------------


def test_maybe_inject_failure_noop_without_weights():
    ctx = _ctx()
    # No declaration at all: must not raise.
    maybe_inject_failure(ctx=ctx, tool="submit_x", workflow={}, contract={})
    # Plain string-list system declaration: still a no-op.
    maybe_inject_failure(
        ctx=ctx,
        tool="submit_x",
        workflow={},
        contract={"failureModes": ["validation_error"]},
    )


def test_maybe_inject_failure_raises_typed_error_with_weights():
    # weight 1.0 guarantees injection regardless of the deterministic draw.
    workflow = {"failureModes": {"rate_limited": 1.0}}
    ctx = _ctx()
    with pytest.raises(RateLimited) as exc:
        maybe_inject_failure(ctx=ctx, tool="submit_x", workflow=workflow, entity="supplier", entity_id="S-1")
    assert exc.value.code == "rate_limited"
    assert exc.value.audit["entity_id"] == "S-1"


# ---------------------------------------------------------------------------
# End-to-end: generic submit handler consults the selector
# ---------------------------------------------------------------------------


def _submit_contract(weights=None):
    handler_spec = {
        "primitive": "state_machine_update",
        "collection": "suppliers",
        "primaryKey": "supplier_id",
        "roleArg": "role",
        "allowedRoles": ["buyer"],
        "stateField": "status",
        "targetStateArg": "status",
        "transitions": {"active": ["pending_approval"]},
    }
    if weights is not None:
        handler_spec["failureModes"] = weights
    return {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "suppliers": {"primaryKey": "supplier_id"},
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {"tools": [{"name": "submit_supplier_update"}]},
        "workflowCatalog": {"toolHandlers": {"submit_supplier_update": handler_spec}},
    }


def _seed_state(ctx):
    STATE[f"{ctx.agent_id}:{ctx.system_id}:{ctx.scenario_id}:generic"] = {
        "suppliers": [{"supplier_id": "SUP-001", "name": "Acme", "status": "active"}],
        "audit_events": [],
    }


def test_generic_submit_unchanged_without_failure_weights():
    contract = _submit_contract()
    handlers = build_generic_handlers(contract)
    ctx = _ctx(agent="agent-noinject", scenario="sc-noinject")
    _seed_state(ctx)
    result = handlers["submit_supplier_update"](ctx, {"supplier_id": "SUP-001", "status": "pending_approval", "role": "buyer"})
    assert result["supplier"]["status"] == "pending_approval"


def test_generic_submit_injects_failure_and_records_audit():
    contract = _submit_contract(weights={"conflict": 1.0})
    handlers = build_generic_handlers(contract)
    ctx = _ctx(agent="agent-inject", scenario="sc-inject")
    _seed_state(ctx)
    key = f"{ctx.agent_id}:{ctx.system_id}:{ctx.scenario_id}:generic"
    with pytest.raises(Conflict) as exc:
        handlers["submit_supplier_update"](ctx, {"supplier_id": "SUP-001", "status": "pending_approval", "role": "buyer"})
    assert exc.value.code == "conflict"
    # The supplier must be untouched (failure raised before the mutation).
    assert STATE[key]["suppliers"][0]["status"] == "active"
    # The injected-failure audit event was persisted.
    outcomes = [e["outcome"] for e in STATE[key]["audit_events"]]
    assert "conflict" in outcomes
