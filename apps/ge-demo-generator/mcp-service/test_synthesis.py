"""Tests for system synthesis (deterministic / offline tiers — no creds required)."""

from __future__ import annotations

import json
from copy import deepcopy

import pytest

import synthesis
from simulator_runtime import overlay
from simulator_runtime.router import execute_simulator_tool
from simulator_runtime.simulators import reset_handler_cache


@pytest.fixture(autouse=True)
def _clean():
    overlay.clear()
    reset_handler_cache()
    yield
    overlay.clear()
    reset_handler_cache()


def _call(system_id: str, tool: str, args: dict):
    binding = {"name": tool, "simulator": {"system_id": system_id, "tool": tool}}
    return execute_simulator_tool("agentA", binding, args)


def test_build_contract_emits_bindings_and_workflow():
    sketch = {
        "id": "byo_demo",
        "displayName": "Demo",
        "collections": [
            {"name": "requisitions", "primaryKey": "req_id", "fields": {"req_id": "string", "status": "enum:open|pending_approval|approved"},
             "stateField": "status", "transitions": {"open": ["pending_approval"], "pending_approval": ["approved"]}, "approvalGated": True},
            {"name": "approvals", "primaryKey": "approval_id", "fields": {"approval_id": "string", "req_id": "ref:requisitions.req_id", "state": "enum:requested|approved"}},
        ],
    }
    contract = synthesis.build_contract_from_sketch(sketch)
    # Every tool carries an explicit binding (no naming-convention reliance).
    assert all("binding" in tool for tool in contract["toolCatalog"]["tools"])
    handler = contract["workflowCatalog"]["toolHandlers"]["submit_requisition_update"]
    assert handler["collection"] == "requisitions"
    assert handler["approvalBlockers"][0]["collection"] == "approvals"


def test_synthesize_nl_offline_registers_and_serves():
    out = synthesis.synthesize_system({
        "mode": "nl", "displayName": "PartsLedger", "use_llm": False,
        "description": "PartsLedger tracks parts and requisitions with an approval flow before approval.",
    })
    assert out["registered"] and out["source"] == "nl-heuristic"
    # Served live through the router with a non-empty, binding-driven tool.
    res = _call(out["id"], "list_pending_approvals", {})
    assert res["status"] == "ok"
    assert len(res["data"]["approvals"]) >= 1  # scenario coverage guarantees a pending approval


def test_seed_is_deterministic_and_fk_closed():
    spec = {"mode": "nl", "displayName": "Ledger", "use_llm": False,
            "description": "Ledger has requisitions and an approval flow before approval."}
    a = synthesis.synthesize_system(spec, register=False)["contract"]["seed"]
    b = synthesis.synthesize_system(spec, register=False)["contract"]["seed"]
    assert json.dumps(a, sort_keys=True) == json.dumps(b, sort_keys=True)
    # FK closure: every approvals.<entity>_id resolves to a real primary key.
    contract = synthesis.synthesize_system(spec, register=False)["contract"]
    collections = contract["schema"]["collections"]
    seed = contract["seed"]
    for name, spec_c in collections.items():
        for field, ftype in spec_c["fields"].items():
            if isinstance(ftype, str) and ftype.startswith("ref:"):
                target = ftype[len("ref:"):].split(".")[0]
                pks = {r.get(collections[target]["primaryKey"]) for r in seed.get(target, [])}
                for row in seed.get(name, []):
                    if row.get(field) is not None:
                        assert row[field] in pks, f"dangling {name}.{field}={row[field]}"


def test_samples_mode_infers_collections():
    out = synthesis.synthesize_system({
        "mode": "samples", "displayName": "Tickets", "use_llm": False,
        "samples": {"tickets": [{"ticket_id": "T-1", "subject": "x", "priority": 2, "open": True}]},
    }, register=False)
    cols = out["contract"]["schema"]["collections"]
    assert "tickets" in cols and cols["tickets"]["primaryKey"] == "ticket_id"
    assert cols["tickets"]["fields"]["priority"] == "number"
    assert cols["tickets"]["fields"]["open"] == "boolean"


def test_openapi_mode_infers_from_components():
    spec = {
        "info": {"title": "Widgets API"},
        "components": {"schemas": {"Widget": {"properties": {"id": {"type": "string"}, "count": {"type": "integer"}}}}},
    }
    out = synthesis.synthesize_system({"mode": "openapi", "id": "byo_widgets", "openapi": spec, "use_llm": False}, register=False)
    cols = out["contract"]["schema"]["collections"]
    assert "widgets" in cols
    assert cols["widgets"]["fields"]["count"] == "number"


def test_invalid_transition_is_enforced_on_synthesized_system():
    out = synthesis.synthesize_system({
        "mode": "nl", "displayName": "Flow", "use_llm": False,
        "description": "Flow has requisitions and an approval flow before approval.",
    })
    sid = out["id"]
    submit = next(t for t in out["tools"] if t.startswith("submit_"))
    pk = out["contract"]["workflowCatalog"]["toolHandlers"][submit]["primaryKey"]
    coll = out["contract"]["workflowCatalog"]["toolHandlers"][submit]["collection"]
    first_id = out["contract"]["seed"][coll][0][pk]
    res = _call(sid, submit, {pk: first_id, "status": "approved"})  # skips pending_approval / hits a gate
    # The synthesized workflow is enforced — either the transition is illegal or an approval gates it.
    assert res["status"] == "error"
    assert res["error"]["code"] in {"invalid_state_transition", "missing_approval"}


def test_validate_contract_flags_unknown_ref():
    sketch = {
        "id": "byo_v", "displayName": "V",
        "collections": [{"name": "orders", "primaryKey": "order_id",
                         "fields": {"order_id": "string", "customer_id": "ref:customers.customer_id"}}],
    }
    contract = synthesis.build_contract_from_sketch(sketch)
    contract["seed"] = synthesis.generate_seed(contract)
    errors = synthesis.validate_contract(contract)
    assert any("unknown collection customers" in e for e in errors)


def test_repair_loop_self_corrects(monkeypatch):
    """The agentic tier: a bad LLM sketch is repaired against the validator until valid."""
    bad = {
        "id": "byo_orders", "displayName": "Orders", "source": "nl-llm",
        "collections": [{"name": "orders", "primaryKey": "order_id",
                         "fields": {"order_id": "string", "customer_id": "ref:customers.customer_id", "status": "enum:open|closed"},
                         "stateField": "status", "transitions": {"open": ["closed"]}}],
    }
    good = deepcopy(bad)
    good["source"] = "nl-llm-repaired"
    good["collections"].append({"name": "customers", "primaryKey": "customer_id",
                                "fields": {"customer_id": "string", "name": "string"}})

    monkeypatch.setattr(synthesis, "_llm_sketch",
                        lambda description, *, system_id, display_name: {**deepcopy(bad), "id": system_id})
    monkeypatch.setattr(synthesis, "_llm_repair",
                        lambda description, prior, errors, *, system_id, display_name: {**deepcopy(good), "id": system_id})

    out = synthesis.synthesize_system({
        "mode": "nl", "id": "byo_orders", "displayName": "Orders", "use_llm": True,
        "description": "orders with customers and an approval flow",
    })
    assert out["repairs"] >= 1
    assert out["valid"] and out["validationErrors"] == []
    assert out["registered"]


def test_promote_to_corpus_writes_files_and_registry(tmp_path):
    out = synthesis.synthesize_system({
        "mode": "nl", "id": "byo_promote_me", "displayName": "Promote Me", "use_llm": False,
        "description": "Tickets with an approval flow before approval.",
    }, register=False)
    contract = out["contract"]

    sim_dir = tmp_path / "apps/ge-demo-generator/simulator-systems"
    sim_dir.mkdir(parents=True)
    (sim_dir / "registry.json").write_text(json.dumps({"version": 1, "simulators": []}))

    res = synthesis.promote_to_corpus(contract, str(tmp_path))
    pack_dir = sim_dir / "byo_promote_me"
    for name in ("schema.json", "tools.json", "workflows.json", "projection.json", "materialization.json", "seed.json"):
        assert (pack_dir / name).exists(), f"missing {name}"
    registry = json.loads((sim_dir / "registry.json").read_text())
    entry = next(s for s in registry["simulators"] if s["id"] == "byo_promote_me")
    assert entry["schemaPath"].endswith("byo_promote_me/schema.json")
    assert entry["maturity"] == "synthesized"
    # Idempotent: re-promote doesn't duplicate the entry.
    synthesis.promote_to_corpus(contract, str(tmp_path))
    registry2 = json.loads((sim_dir / "registry.json").read_text())
    assert sum(1 for s in registry2["simulators"] if s["id"] == "byo_promote_me") == 1
    assert res["id"] == "byo_promote_me"


def test_invalid_synthesis_is_not_registered(monkeypatch):
    """A sketch that can't be made valid is reported, not silently mounted."""
    bad = {
        "id": "byo_broken", "displayName": "Broken", "source": "nl-llm",
        "collections": [{"name": "orders", "primaryKey": "order_id",
                         "fields": {"order_id": "string", "customer_id": "ref:customers.customer_id"}}],
    }
    monkeypatch.setattr(synthesis, "_llm_sketch",
                        lambda description, *, system_id, display_name: {**deepcopy(bad), "id": system_id})
    monkeypatch.setattr(synthesis, "_llm_repair",
                        lambda description, prior, errors, *, system_id, display_name: None)  # repair fails
    out = synthesis.synthesize_system({"mode": "nl", "id": "byo_broken", "use_llm": True, "description": "x"})
    assert not out["valid"] and not out["registered"]
    assert out["validationErrors"]


def _fk_contract(collections: dict) -> dict:
    return {
        "id": "byo_fk_test",
        "displayName": "FK Test",
        "schema": {"id": "s", "version": 1, "collections": collections},
        "toolCatalog": {"tools": []},
        "workflowCatalog": {"toolHandlers": {}},
    }


# ── BUG 2: FK-by-convention must honor pluralization ─────────────────────────


def test_pluralized_fk_resolves_to_real_pk_in_seed():
    """field `team_id` resolves against plural collection `teams`, so members[*].team_id
    must point at a real teams PK rather than a literal placeholder."""
    contract = _fk_contract({
        "teams": {"primaryKey": "team_id", "fields": {"team_id": "string", "name": "string"}},
        "members": {"primaryKey": "member_id", "fields": {
            "member_id": "string", "team_id": "string", "name": "string"}},
    })
    seed = synthesis.generate_seed(contract, count=4)
    team_pks = {row["team_id"] for row in seed["teams"]}
    assert team_pks
    for row in seed["members"]:
        assert row["team_id"] in team_pks, (
            f"members.team_id={row['team_id']!r} is not a real teams PK {team_pks}"
        )


def test_validate_contract_detects_dangling_pluralized_fk():
    contract = _fk_contract({
        "teams": {"primaryKey": "team_id", "fields": {"team_id": "string"}},
        "members": {"primaryKey": "member_id", "fields": {
            "member_id": "string", "team_id": "string"}},
    })
    contract["seed"] = {
        "teams": [{"team_id": "T-001"}],
        "members": [{"member_id": "M-001", "team_id": "NOPE-999"}],
        "audit_events": [],
    }
    errors = synthesis.validate_contract(contract)
    assert any("members.team_id" in e and "dangling" in e.lower() for e in errors), errors


# ── BUG 3: cyclic FK must be repaired (no None refs left) ────────────────────


def test_cyclic_fk_repair_pass_binds_all_refs():
    contract = _fk_contract({
        "orders": {"primaryKey": "order_id", "fields": {
            "order_id": "string", "customer_id": "string"}},
        "customers": {"primaryKey": "customer_id", "fields": {
            "customer_id": "string", "order_id": "string"}},
    })
    seed = synthesis.generate_seed(contract, count=3)
    customer_pks = {row["customer_id"] for row in seed["customers"]}
    assert customer_pks
    for row in seed["orders"]:
        assert row["customer_id"] is not None, "cyclic FK left customer_id None (no repair pass)"
        assert row["customer_id"] in customer_pks
    contract["seed"] = seed
    assert synthesis.validate_contract(contract) == []
