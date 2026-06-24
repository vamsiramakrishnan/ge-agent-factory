"""Tests for the lazy, layered registry + runtime overlay (BYO/synthesized packs)."""

from __future__ import annotations

import pytest

from simulator_runtime import overlay, registry
from simulator_runtime.router import execute_simulator_tool
from simulator_runtime.simulators import get_simulator_handlers, reset_handler_cache


def _byo_pack() -> dict:
    return {
        "id": "byo_test_ledger",
        "displayName": "Test Ledger",
        "maturity": "synthesized",
        "schema": {
            "collections": {
                "requisitions": {
                    "primaryKey": "req_id",
                    "fields": {"req_id": "string", "status": "enum:open|pending_approval|approved", "part": "string"},
                }
            }
        },
        "toolCatalog": {
            "tools": [
                {"name": "find_reqs", "binding": {"op": "search", "collection": "requisitions"}},
                {"name": "fetch_req", "binding": {"op": "get", "collection": "requisitions", "primaryKey": "req_id"}},
                {"name": "advance_req", "binding": {"op": "submit", "collection": "requisitions"}},
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "advance_req": {
                    "collection": "requisitions",
                    "primaryKey": "req_id",
                    "stateField": "status",
                    "targetStateArg": "status",
                    "transitions": {"open": ["pending_approval"], "pending_approval": ["approved"]},
                }
            }
        },
        "seed": {
            "requisitions": [
                {"req_id": "REQ-1", "status": "open", "part": "turbine-blade"},
                {"req_id": "REQ-2", "status": "pending_approval", "part": "fan-disk"},
            ],
            "audit_events": [],
        },
    }


@pytest.fixture(autouse=True)
def _clean_overlay():
    overlay.clear()
    reset_handler_cache()
    yield
    overlay.unregister_overlay_contract("byo_test_ledger")
    overlay.clear()
    reset_handler_cache()


def test_lazy_index_and_hydration():
    assert len(registry.builtin_ids()) > 0
    contract = registry.get_simulator_contract("servicenow")
    assert contract["id"] == "servicenow"
    assert contract.get("schema") and contract.get("toolCatalog")
    # Cached: a second call returns the same object.
    assert registry.get_simulator_contract("servicenow") is contract


def test_unknown_system_raises():
    with pytest.raises(KeyError):
        registry.get_simulator_contract("does_not_exist_system")


def test_overlay_resolves_before_builtin_and_lists():
    overlay.register_overlay_contract(_byo_pack())
    assert registry.get_simulator_contract("byo_test_ledger")["displayName"] == "Test Ledger"
    ids = {c["id"] for c in registry.list_simulator_contracts()}
    assert "byo_test_ledger" in ids and "servicenow" in ids


def test_binding_driven_handlers_ignore_naming_convention():
    # Tool names deliberately do NOT match search_/get_/submit_*_update; explicit
    # bindings must still produce working handlers.
    overlay.register_overlay_contract(_byo_pack())
    handlers = get_simulator_handlers("byo_test_ledger")
    assert handlers is not None
    assert set(handlers) == {"find_reqs", "fetch_req", "advance_req"}


def test_byo_pack_served_through_router_with_inline_seed():
    overlay.register_overlay_contract(_byo_pack())
    search = {"name": "find_reqs", "simulator": {"system_id": "byo_test_ledger", "tool": "find_reqs"}}
    res = execute_simulator_tool("agentA", search, {"query": "fan"})
    assert res["status"] == "ok"
    assert [r["req_id"] for r in res["data"]["requisitions"]] == ["REQ-2"]

    advance = {"name": "advance_req", "simulator": {"system_id": "byo_test_ledger", "tool": "advance_req"}}
    # open → approved is not a declared transition (must go via pending_approval).
    bad = execute_simulator_tool("agentA", advance, {"req_id": "REQ-1", "status": "approved"})
    assert bad["status"] == "error" and bad["error"]["code"] == "invalid_state_transition"
    # open → pending_approval is declared, so it succeeds.
    ok = execute_simulator_tool("agentA", advance, {"req_id": "REQ-1", "status": "pending_approval"})
    assert ok["status"] == "ok"


def test_durable_overlay_survives_instance_restart(monkeypatch):
    """A pack registered on one 'instance' resolves on a fresh one via the durable store."""
    from simulator_runtime.state_store import MemoryStateStore

    durable = MemoryStateStore()  # stands in for Firestore/AlloyDB
    monkeypatch.setattr(overlay, "_durable", lambda: durable)
    overlay.register_overlay_contract(_byo_pack())
    overlay.clear()  # simulate a fresh process: in-memory overlay cache is empty
    contract = registry.get_simulator_contract("byo_test_ledger")
    assert contract["displayName"] == "Test Ledger"  # resolved from the durable store


def test_builtin_ids_skip_the_durable_overlay_read(monkeypatch):
    """Non-prefixed (builtin) ids must NOT hit the durable store — keeps a Firestore
    overlay cheap for the 54 corpus systems (no per-call read-miss)."""
    from simulator_runtime.state_store import MemoryStateStore

    class SpyStore(MemoryStateStore):
        gets: list

        def __init__(self):
            super().__init__()
            self.gets = []

        def get(self, namespace):
            self.gets.append(namespace)
            return super().get(namespace)

    spy = SpyStore()
    monkeypatch.setattr(overlay, "_durable", lambda: spy)

    assert overlay.get_overlay_contract("servicenow") is None  # builtin
    assert spy.gets == []  # durable store never consulted

    assert overlay.get_overlay_contract("byo_anything") is None  # prefixed → may consult
    assert spy.gets == ["pack:byo_anything"]


def test_unregister_removes_from_resolution():
    overlay.register_overlay_contract(_byo_pack())
    assert registry.get_simulator_contract("byo_test_ledger")
    overlay.unregister_overlay_contract("byo_test_ledger")
    reset_handler_cache()
    with pytest.raises(KeyError):
        registry.get_simulator_contract("byo_test_ledger")


# ── BUG 1: handler cache must be invalidated on overlay re-registration ──────


def test_reregistering_same_id_invalidates_stale_handler_cache():
    """Re-registering a pack under the SAME id (BYO refine loop) must serve the NEW
    handler map — not the cached old one. Overlay registration fires a change-listener
    that drops the per-id handler cache entry, so this happens with no manual reset."""
    first = _byo_pack()
    overlay.register_overlay_contract(first)
    before = get_simulator_handlers("byo_test_ledger")
    assert before is not None and "advance_req" in before

    # Re-synth the same id with an added tool.
    second = _byo_pack()
    second["toolCatalog"]["tools"].append(
        {"name": "escalate_req", "binding": {"op": "search", "collection": "requisitions"}}
    )
    overlay.register_overlay_contract(second)  # must invalidate the stale cache

    after = get_simulator_handlers("byo_test_ledger")
    assert after is not None
    assert "escalate_req" in after, "stale handler cache: new tool not resolvable after re-register"


def test_change_listener_fires_with_system_id_on_register_and_unregister():
    seen: list = []
    overlay.register_change_listener(seen.append)
    try:
        overlay.register_overlay_contract(_byo_pack())
        overlay.unregister_overlay_contract("byo_test_ledger")
    finally:
        overlay.unregister_change_listener(seen.append)
    assert seen.count("byo_test_ledger") >= 2
