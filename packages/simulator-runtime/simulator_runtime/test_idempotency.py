from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import generic, idempotency  # noqa: E402
from simulator_runtime.idempotency import (  # noqa: E402
    IDEMPOTENCY_ARG,
    IDEMPOTENCY_COLLECTION,
    idempotency_key_from_args,
    lookup_replay,
    record_replay,
)
from simulator_runtime.state_store import MemoryStateStore  # noqa: E402


# --- key extraction ----------------------------------------------------------


def test_key_from_args_absent_is_none():
    assert idempotency_key_from_args({}) is None
    assert idempotency_key_from_args({"foo": "bar"}) is None


def test_key_from_args_blank_is_none():
    assert idempotency_key_from_args({IDEMPOTENCY_ARG: ""}) is None
    assert idempotency_key_from_args({IDEMPOTENCY_ARG: "   "}) is None


def test_key_from_args_present_is_stripped_string():
    assert idempotency_key_from_args({IDEMPOTENCY_ARG: "  abc  "}) == "abc"
    assert idempotency_key_from_args({IDEMPOTENCY_ARG: 123}) == "123"


# --- replay cache round-trip (memory store) ----------------------------------


def test_lookup_miss_returns_none():
    store = MemoryStateStore()
    assert lookup_replay(store, "ns", "submit_x", "k1") is None


def test_record_then_lookup_returns_stored_result():
    store = MemoryStateStore()
    record_replay(store, "ns", "submit_x", "k1", {"worker": {"id": "W-1"}, "ok": True})
    assert lookup_replay(store, "ns", "submit_x", "k1") == {"worker": {"id": "W-1"}, "ok": True}


def test_replay_is_isolated_copy_not_live_reference():
    store = MemoryStateStore()
    record_replay(store, "ns", "submit_x", "k1", {"row": {"status": "active"}})
    first = lookup_replay(store, "ns", "submit_x", "k1")
    first["row"]["status"] = "TAMPERED"
    second = lookup_replay(store, "ns", "submit_x", "k1")
    assert second["row"]["status"] == "active"


def test_recorded_result_unaffected_by_later_source_mutation():
    store = MemoryStateStore()
    source = {"row": {"status": "active"}}
    record_replay(store, "ns", "submit_x", "k1", source)
    source["row"]["status"] = "closed"
    assert lookup_replay(store, "ns", "submit_x", "k1")["row"]["status"] == "active"


def test_keys_are_scoped_by_tool_name():
    store = MemoryStateStore()
    record_replay(store, "ns", "submit_a", "k1", {"v": "a"})
    record_replay(store, "ns", "submit_b", "k1", {"v": "b"})
    assert lookup_replay(store, "ns", "submit_a", "k1") == {"v": "a"}
    assert lookup_replay(store, "ns", "submit_b", "k1") == {"v": "b"}


def test_re_record_overwrites_same_key():
    store = MemoryStateStore()
    record_replay(store, "ns", "submit_x", "k1", {"v": 1})
    record_replay(store, "ns", "submit_x", "k1", {"v": 2})
    doc = store.get("ns")
    entries = [e for e in doc[IDEMPOTENCY_COLLECTION] if e["cache_id"] == "submit_x::k1"]
    assert len(entries) == 1
    assert lookup_replay(store, "ns", "submit_x", "k1") == {"v": 2}


def test_cache_lives_inside_state_doc_alongside_other_collections():
    store = MemoryStateStore()
    store.set("ns", {"workers": [{"id": "W-1"}], "audit_events": []})
    record_replay(store, "ns", "submit_x", "k1", {"v": 1})
    doc = store.get("ns")
    # Existing collections are preserved; cache is just another key.
    assert doc["workers"] == [{"id": "W-1"}]
    assert IDEMPOTENCY_COLLECTION in doc


# --- end-to-end through generic submit handler -------------------------------


def _contract():
    return {
        "schema": {
            "collections": {
                "things": {"primaryKey": "thing_id", "fields": {"status": {}}},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "submit_thing_update",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "thing_id": {"type": "string"},
                            "status": {"type": "string"},
                            IDEMPOTENCY_ARG: {"type": "string"},
                        },
                    },
                }
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "submit_thing_update": {
                    "collection": "things",
                    "primaryKey": "thing_id",
                    "stateField": "status",
                    "transitions": {"active": ["closed"], "*": ["active", "closed"]},
                }
            }
        },
    }


def _ctx(scenario: str):
    return SimpleNamespace(
        agent_id="agent-idem",
        system_id="__idem_system__",
        scenario_id=scenario,
        actor="x@example.com",
        role="hr_partner",
    )


def _seed_state(ctx):
    state = generic.generic_state(ctx)
    state["things"] = [{"thing_id": "T-1", "status": "active"}]
    state.setdefault("audit_events", [])
    generic._save_state(ctx, state)


def test_submit_handler_without_key_runs_normally(monkeypatch):
    contract = _contract()
    handlers = generic.build_generic_handlers(contract)
    handler = handlers["submit_thing_update"]
    ctx = _ctx("scn-nokey")
    _seed_state(ctx)
    result = handler(ctx, {"thing_id": "T-1", "status": "closed"})
    assert result["thing"]["status"] == "closed"
    # No idempotency cache written when no key supplied.
    doc = generic._store_for(ctx).get(generic._state_key(ctx))
    assert IDEMPOTENCY_COLLECTION not in doc


def test_submit_handler_replays_on_repeated_key():
    contract = _contract()
    handler = generic.build_generic_handlers(contract)["submit_thing_update"]
    ctx = _ctx("scn-replay")
    _seed_state(ctx)

    first = handler(ctx, {"thing_id": "T-1", "status": "closed", IDEMPOTENCY_ARG: "key-1"})
    assert first["thing"]["status"] == "closed"

    # Second call with the SAME key returns the original result. Even though the row
    # is now "closed" (so a fresh active->closed run would still work), the replay
    # path must not re-execute the transition — prove it by checking audit count.
    state_before = generic._store_for(ctx).get(generic._state_key(ctx))
    audit_before = len(state_before["audit_events"])

    second = handler(ctx, {"thing_id": "T-1", "status": "closed", IDEMPOTENCY_ARG: "key-1"})
    assert second == first

    state_after = generic._store_for(ctx).get(generic._state_key(ctx))
    assert len(state_after["audit_events"]) == audit_before  # no new audit event


def test_submit_handler_distinct_keys_execute_independently():
    contract = _contract()
    handler = generic.build_generic_handlers(contract)["submit_thing_update"]
    ctx = _ctx("scn-distinct")
    _seed_state(ctx)
    # active -> closed (k1), then closed -> active (k2); both valid under transitions.
    handler(ctx, {"thing_id": "T-1", "status": "closed", IDEMPOTENCY_ARG: "k1"})
    handler(ctx, {"thing_id": "T-1", "status": "active", IDEMPOTENCY_ARG: "k2"})
    store = generic._store_for(ctx)
    key = generic._state_key(ctx)
    # Each key has its own isolated cached snapshot capturing the state at its call.
    cached_k1 = lookup_replay(store, key, "submit_thing_update", "k1")
    cached_k2 = lookup_replay(store, key, "submit_thing_update", "k2")
    assert cached_k1["thing"]["status"] == "closed"
    assert cached_k2["thing"]["status"] == "active"
