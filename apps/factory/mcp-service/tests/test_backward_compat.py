from __future__ import annotations

"""Adversarial backward-compatibility guard for the simulator-fidelity primitives.

These tests pin the contract that a system declaring NONE of the new fields
(`stateBackend`, `latency`, `rateLimit`, `emit`, `async`, weighted `failureModes`,
`poll_async_job`, `idempotency_key`) behaves byte-for-byte as it did before the
primitives landed: no failure injection, no throttling, no idempotency caching,
no webhook emission, no async deferral, and crucially no extra bookkeeping
collections (`_idempotency`, `async_jobs`) leaking into the state document.

The cross-module integration matrix (state_store / failures / idempotency /
throttle / async_jobs / webhooks) is covered by each module's own test file and
by `tests/test_simulator_conformance.py` (all 54 real contracts). This file is
the explicit "no new fields => identical behaviour" assertion.
"""

from types import SimpleNamespace

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime.generic import STATE, build_generic_handlers  # noqa: E402
from simulator_runtime.simulators import SimulatorError  # noqa: E402


# A deliberately minimal contract: no stateBackend, no workflow latency/rateLimit/
# emit/async, no weighted failureModes, no poll_async_job. Exactly the shape every
# one of the 54 packs ships today.
def _legacy_contract() -> dict:
    return {
        "id": "legacy_contract",
        "schema": {
            "collections": {
                "orders": {"primaryKey": "order_id", "fields": {"order_id": "string", "status": "string"}},
                "approvals": {"primaryKey": "approval_id"},
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {"name": "search_orders"},
                {"name": "get_order"},
                {"name": "submit_order_update"},
                {"name": "list_pending_approvals"},
                {"name": "list_audit_events"},
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "submit_order_update": {
                    "primitive": "state_machine_update",
                    "collection": "orders",
                    "primaryKey": "order_id",
                    "roleArg": "role",
                    "allowedRoles": ["buyer"],
                    "stateField": "status",
                    "targetStateArg": "status",
                    "transitions": {"active": ["pending_approval"], "pending_approval": ["approved"]},
                }
            }
        },
    }


def _seed_state(key: str) -> None:
    STATE[key] = {
        "orders": [{"order_id": "ORD-001", "name": "Widget order", "status": "active"}],
        "approvals": [],
        "audit_events": [],
    }


def test_no_new_fields_submit_is_synchronous_and_mutates_in_place():
    contract = _legacy_contract()
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="bc-1", system_id="legacy_contract", scenario_id="s1", actor="buyer@example.com", role="buyer")
    key = "bc-1:legacy_contract:s1:generic"
    _seed_state(key)

    result = handlers["submit_order_update"](ctx, {"order_id": "ORD-001", "status": "pending_approval", "role": "buyer"})

    # Synchronous transition: returns the updated record, NOT a {job_id, queued}.
    assert "job_id" not in result
    assert result["order"]["status"] == "pending_approval"
    assert STATE[key]["orders"][0]["status"] == "pending_approval"


def test_no_new_fields_creates_no_bookkeeping_collections():
    contract = _legacy_contract()
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="bc-2", system_id="legacy_contract", scenario_id="s2", actor="buyer@example.com", role="buyer")
    key = "bc-2:legacy_contract:s2:generic"
    _seed_state(key)

    handlers["search_orders"](ctx, {"query": "widget"})
    handlers["get_order"](ctx, {"order_id": "ORD-001"})
    handlers["submit_order_update"](ctx, {"order_id": "ORD-001", "status": "pending_approval", "role": "buyer"})
    handlers["list_pending_approvals"](ctx, {})

    # The idempotency / async-job reserved collections must NOT appear when no
    # idempotency_key was passed and no transition declared async.
    assert "_idempotency" not in STATE[key]
    assert "async_jobs" not in STATE[key]
    # Only the originally-seeded collections (plus the always-present audit trail).
    assert set(STATE[key]) == {"orders", "approvals", "audit_events"}


def test_no_new_fields_no_poll_async_job_handler():
    contract = _legacy_contract()
    handlers = build_generic_handlers(contract)
    # A contract that does not declare poll_async_job gets no such handler.
    assert "poll_async_job" not in handlers


def test_no_new_fields_inline_failures_unchanged():
    contract = _legacy_contract()
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="bc-3", system_id="legacy_contract", scenario_id="s3", actor="buyer@example.com", role="buyer")
    key = "bc-3:legacy_contract:s3:generic"
    _seed_state(key)

    # Wrong role => the engine's inline permission_denied, never an injected mode.
    try:
        handlers["submit_order_update"](ctx, {"order_id": "ORD-001", "status": "pending_approval", "role": "intruder"})
    except SimulatorError as error:
        assert error.code == "permission_denied"
    else:
        raise AssertionError("expected permission_denied")

    # Disallowed transition => inline invalid_state_transition.
    _seed_state(key)
    try:
        handlers["submit_order_update"](ctx, {"order_id": "ORD-001", "status": "approved", "role": "buyer"})
    except SimulatorError as error:
        assert error.code == "invalid_state_transition"
    else:
        raise AssertionError("expected invalid_state_transition")


def test_string_list_failure_modes_do_not_inject():
    # The registry's real shape: failureModes as a plain list[str]. This must be
    # treated as a *catalog* (no probabilities) and never trigger injection, even
    # for modes the failures module CAN realize (e.g. validation_error).
    contract = _legacy_contract()
    contract["failureModes"] = ["permission_denied", "validation_error", "rate_limited", "conflict"]
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="bc-4", system_id="legacy_contract", scenario_id="s4", actor="buyer@example.com", role="buyer")
    key = "bc-4:legacy_contract:s4:generic"

    # Run across many seeds: if string-list modes leaked into the weighted selector
    # some of these would raise an injected failure. None should.
    for seed in range(50):
        _seed_state(key)
        result = handlers["submit_order_update"](
            ctx, {"order_id": "ORD-001", "status": "pending_approval", "role": "buyer", "seed": seed}
        )
        assert result["order"]["status"] == "pending_approval"


def test_idempotency_key_absent_means_no_replay_cache():
    contract = _legacy_contract()
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="bc-5", system_id="legacy_contract", scenario_id="s5", actor="buyer@example.com", role="buyer")
    key = "bc-5:legacy_contract:s5:generic"
    _seed_state(key)

    handlers["submit_order_update"](ctx, {"order_id": "ORD-001", "status": "pending_approval", "role": "buyer"})

    # No idempotency_key arg => nothing cached, behaviour identical to legacy.
    assert "_idempotency" not in STATE[key]
