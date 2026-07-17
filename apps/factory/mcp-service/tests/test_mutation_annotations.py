"""Synthesized packs carry ge.mutation-model.v1 annotations from birth.

The JS twin of these assertions lives in
packages/byo-systems/src/mutation-model.test.mjs; this side pins the Python
emitter (synthesis_contract.build_contract_from_sketch) so `ge systems synth`
output passes `ge systems mutation validate` without retrofit.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from synthesis_contract import build_contract_from_sketch  # noqa: E402
from synthesis_sketch import sketch_from_openapi  # noqa: E402

SKETCH = {
    "displayName": "CRM",
    "collections": [
        {
            "name": "cases",
            "fields": {"case_id": "string", "status": "string"},
            "primaryKey": "case_id",
            "stateField": "status",
            "transitions": {"open": ["investigating", "closed"], "investigating": ["closed"]},
        },
        {"name": "approvals", "fields": {"approval_id": "string", "state": "string"}},
    ],
}


def test_submit_handlers_are_annotated_from_birth():
    contract = build_contract_from_sketch(SKETCH)
    catalog = contract["workflowCatalog"]
    assert catalog["mutationModel"] == "ge.mutation-model.v1"

    # Look the handler up by its collection, not its name — the singularizer's
    # exact spelling (submit_cas_update for "cases") is a separate known
    # id-mangling quirk, not this contract's subject.
    handlers = [h for h in catalog["toolHandlers"].values() if h.get("collection") == "cases"]
    assert len(handlers) == 1
    handler = handlers[0]
    assert handler["semantics"] == "state_transition"
    assert handler["compensation"] == "manual"
    assert handler["idempotency"] == {"keyFields": ["idempotency_key"]}
    tool = next(t for t in contract["toolCatalog"]["tools"] if t["name"] in catalog["toolHandlers"])
    assert "idempotency_key" in tool["inputSchema"]["properties"]
    # The existing runtime keys are untouched by the annotations.
    assert handler["transitions"]["open"] == ["investigating", "closed"]


def test_emission_is_deterministic():
    a = build_contract_from_sketch(SKETCH)
    b = build_contract_from_sketch(SKETCH)
    assert a["workflowCatalog"] == b["workflowCatalog"]


def test_state_vocabulary_without_edges_is_a_review_candidate_not_a_graph():
    contract = build_contract_from_sketch({
        "id": "candidate_only",
        "collections": [{
            "name": "requests",
            "primaryKey": "request_id",
            "states": ["draft", "submitted", "fulfilled"],
        }],
    })
    handler = next(iter(contract["workflowCatalog"]["toolHandlers"].values()))
    assert handler["semantics"] == "unmodeled"
    assert handler["transitionCandidates"] == ["draft", "submitted", "fulfilled"]
    assert "transitions" not in handler


def test_openapi_enum_order_never_becomes_transition_order():
    spec = {
        "paths": {"/requests/{id}": {"patch": {}}},
        "components": {"schemas": {"Request": {"properties": {
            "id": {"type": "string"},
            "status": {"type": "string", "enum": ["new", "done", "queued"]},
        }}}},
    }
    sketch = sketch_from_openapi(spec, system_id="requests")
    collection = sketch["collections"][0]
    assert collection["transitionCandidates"] == ["new", "done", "queued"]
    contract = build_contract_from_sketch(sketch)
    handler = next(iter(contract["workflowCatalog"]["toolHandlers"].values()))
    assert handler["semantics"] == "unmodeled"
    assert "transitions" not in handler
