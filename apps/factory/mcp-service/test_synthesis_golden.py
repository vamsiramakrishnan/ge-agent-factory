"""Byte-exact parity oracle for ``synthesis.py`` — built BEFORE its decomposition.

Mirrors the JS-side methodology (REFACTOR-HANDOFF.md §9): pin the exact output of
every deterministic/pure function that is about to move, so each extraction commit
can be verified as a verbatim move. Every case below is offline (``use_llm=False``
or no LLM path at all) and fully deterministic when seeded.

The LLM-backed tier (``_genai_json`` / ``_llm_sketch`` / ``_llm_repair``) cannot be
golden-tested — those functions are moved verbatim and remain runtime-unverified
beyond the monkeypatched repair-loop tests in ``test_synthesis.py``.

Regenerate the fixture (ONLY when the new output is confirmed correct — see
AGENTS.md "Golden/parity-oracle tests are byte-exact on purpose"):

    GE_REGEN_SYNTHESIS_GOLDEN=1 python3 -m pytest apps/factory/mcp-service/test_synthesis_golden.py
"""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any, Callable

import pytest

import synthesis

GOLDEN_PATH = Path(__file__).parent / "tests" / "fixtures" / "synthesis-golden.json"
REGEN = os.environ.get("GE_REGEN_SYNTHESIS_GOLDEN") == "1"


def _canon(value: Any) -> str:
    return json.dumps(value, indent=2, sort_keys=True)


# ── case builders (each returns a JSON-serializable value) ──────────────────


def _case_nl_offline_synthesize() -> dict[str, Any]:
    """End-to-end NL heuristic tier: pins slugify, _extract_nouns, _heuristic_sketch,
    build_contract_from_sketch, generate_seed (+ scenario coverage) and validate_contract."""
    return synthesis.synthesize_system(
        {
            "mode": "nl",
            "displayName": "PartsLedger",
            "use_llm": False,
            "description": "PartsLedger tracks parts, requisitions and suppliers with an approval flow before closure.",
            "seed": 7,
            "count": 4,
        },
        register=False,
    )


def _case_samples_synthesize() -> dict[str, Any]:
    return synthesis.synthesize_system(
        {
            "mode": "samples",
            "displayName": "Ticket Desk",
            "use_llm": False,
            "samples": {
                "teams": [{"team_id": "T-1", "name": "Core"}],
                "tickets": [
                    {"ticket_id": "K-1", "subject": "boot loop", "priority": 2, "open": True, "team_id": "T-1"},
                    {"ticket_id": "K-2", "subject": "slow sync", "priority": 1, "open": False, "team_id": "T-1"},
                ],
            },
            "seed": 5,
            "count": 3,
        },
        register=False,
    )


def _case_openapi_synthesize() -> dict[str, Any]:
    spec = {
        "info": {"title": "Widgets API"},
        "components": {
            "schemas": {
                "Widget": {"properties": {"id": {"type": "string"}, "count": {"type": "integer"}, "active": {"type": "boolean"}}},
                "Order Line": {"properties": {"order_line_id": {"type": "string"}, "amount": {"type": "number"}}},
                "Empty": {},
            }
        },
    }
    return synthesis.synthesize_system(
        {"mode": "openapi", "id": "byo_widgets", "openapi": spec, "use_llm": False, "seed": 11, "count": 3},
        register=False,
    )


def _seed_probe_contract() -> dict[str, Any]:
    """Hand-built contract exercising every _field_value branch, the pluralized-FK
    resolution, the cyclic-FK repair pass, and approval-gated scenario coverage."""
    return {
        "id": "byo_seed_probe",
        "displayName": "Seed Probe",
        "schema": {
            "id": "s",
            "version": 1,
            "collections": {
                "orders": {
                    "primaryKey": "order_id",
                    "fields": {
                        "order_id": "string",
                        "customer_id": "string",  # cyclic by-convention FK -> customers
                        "status": "enum:open|pending_approval|approved|rejected",
                        "contact_email": "string",
                        "created_at": "date",
                        "total_amount": "number",
                        "item_count": "number",
                        "title": "string",
                        "misc_code": "string",
                    },
                },
                "customers": {
                    "primaryKey": "customer_id",
                    "fields": {
                        "customer_id": "string",
                        "order_id": "string",  # cyclic back-ref
                        "name": "string",
                    },
                },
                "approvals": {
                    "primaryKey": "approval_id",
                    "fields": {
                        "approval_id": "string",
                        "order_id": "ref:orders.order_id",
                        "state": "enum:requested|approved|rejected",
                        "reason": "string",
                    },
                },
            },
        },
        "workflowCatalog": {
            "toolHandlers": {
                "submit_order_update": {
                    "collection": "orders",
                    "primaryKey": "order_id",
                    "stateField": "status",
                    "transitions": {"open": ["pending_approval"], "pending_approval": ["approved", "rejected"]},
                    "approvalBlockers": [
                        {
                            "collection": "approvals",
                            "sourceRecordField": "order_id",
                            "states": ["requested", "pending"],
                            "blockedTargetStates": ["approved", "rejected"],
                        }
                    ],
                }
            }
        },
    }


def _case_generate_seed_direct() -> dict[str, Any]:
    return synthesis.generate_seed(_seed_probe_contract(), seed=3, count=5)


def _case_build_contract_states_only() -> dict[str, Any]:
    """Pins _state_machine's linear-chain default (states, no transitions), _default_fields
    (collection without fields), allowedRoles passthrough, and the approvals-driven gate."""
    sketch = {
        "id": "byo_states",
        "displayName": "States Only",
        "roles": ["requester", "approver"],
        "collections": [
            {
                "name": "requests",
                "primaryKey": "request_id",
                "states": ["draft", "submitted", "fulfilled"],
                "allowedRoles": ["approver"],
            },
            {
                "name": "approvals",
                "primaryKey": "approval_id",
                "fields": {"approval_id": "string", "request_id": "ref:requests.request_id", "state": "enum:requested|approved"},
            },
        ],
    }
    return synthesis.build_contract_from_sketch(sketch)


def _case_validate_contract_errors() -> list[str]:
    contract = {
        "id": "byo_broken",
        "schema": {
            "collections": {
                "orders": {
                    "primaryKey": "order_id",
                    "fields": {"order_id": "string", "vendor_id": "ref:vendors.vendor_id", "team_id": "string"},
                },
                "teams": {"primaryKey": "team_id", "fields": {"team_id": "string"}},
                "empty_ones": {"primaryKey": "empty_one_id", "fields": {"empty_one_id": "string"}},
            }
        },
        "toolCatalog": {"tools": [{"name": "get_ghost", "binding": {"op": "get", "collection": "ghosts"}}]},
        "workflowCatalog": {"toolHandlers": {"submit_phantom_update": {"collection": "phantoms"}}},
        "seed": {
            "orders": [{"order_id": "O-1", "team_id": "NOPE-9"}],
            "teams": [{"team_id": "T-1"}],
            "empty_ones": [],
        },
    }
    return synthesis.validate_contract(contract)


def _case_completeness_gaps() -> list[str]:
    sketch = {
        "id": "byo_thin",
        "displayName": "Thin",
        "collections": [{"name": "records", "primaryKey": "record_id", "fields": {"record_id": "string"}}],
    }
    contract = synthesis.build_contract_from_sketch(sketch)
    description = "Thin tracks invoices, vendors and payments with an approval workflow before closure."
    return synthesis.completeness_gaps(contract, description, system_id="byo_thin", display_name="Thin")


def _case_sketch_from_samples_direct() -> dict[str, Any]:
    return synthesis.sketch_from_samples(
        {
            "policies": [{"policy_id": "P-1", "holder_id": "H-1", "premium": 120.5, "active": True, "note": "x"}],
            "claims": [],
        },
        system_id="byo_policies",
        display_name="Policies",
    )


def _case_sketch_from_openapi_direct() -> dict[str, Any]:
    spec = {
        "info": {"title": "Legacy"},
        "definitions": {
            "Invoice": {"properties": {"id": {"type": "string"}, "total": {"type": "number"}, "paid": {"type": "boolean"}}},
        },
    }
    return synthesis.sketch_from_openapi(spec, system_id="byo_legacy")


def _case_heuristic_sketch_direct() -> dict[str, Any]:
    return synthesis._heuristic_sketch(
        "Track shipments and manifests across warehouses with a review gate.",
        system_id="byo_shipments",
        display_name="Shipments",
    )


def _case_helpers() -> dict[str, Any]:
    slug_inputs = ["Parts Ledger 2!", "", "byo_already", "ÜberSystem"]
    singular_inputs = ["policies", "boxes", "batches", "wishes", "buses", "orders", "status", "glass", "y"]
    plural_inputs = ["policy", "box", "batch", "wish", "bus", "order", "day", "y"]
    resolve_pool = {"teams", "orders", "companies", "boxes"}
    resolve_inputs = ["team", "order", "company", "box", "ghost", ""]
    noun_description = "The homegrown PartsLedger platform tracks parts, requisitions, suppliers and approvals for our internal teams."
    return {
        "slugify": {value: synthesis.slugify(value) for value in slug_inputs},
        "singular": {value: synthesis._singular(value) for value in singular_inputs},
        "pluralize": {value: synthesis._pluralize(value) for value in plural_inputs},
        "resolve_ref_collection": {value: synthesis._resolve_ref_collection(value, resolve_pool) for value in resolve_inputs},
        "extract_nouns": synthesis._extract_nouns(noun_description, system_id="byo_partsledger", display_name="PartsLedger"),
        "terminal_states": synthesis._terminal_states(
            {"open": ["pending_approval"], "pending_approval": ["approved", "rejected"], "approved": ["closed"]}
        ),
        "state_machine_states_only": synthesis._state_machine({"states": ["a", "b", "c"]}),
        "state_machine_none": synthesis._state_machine({"name": "plain"}),
        "default_fields": synthesis._default_fields("thing_id"),
    }


def _case_promote_to_corpus() -> dict[str, Any]:
    out = synthesis.synthesize_system(
        {
            "mode": "nl",
            "id": "byo_promote_golden",
            "displayName": "Promote Golden",
            "use_llm": False,
            "description": "Tickets with an approval flow before approval.",
            "seed": 42,
            "count": 3,
        },
        register=False,
    )
    with tempfile.TemporaryDirectory() as tmp:
        sim_dir = Path(tmp) / "apps/factory/simulator-systems"
        sim_dir.mkdir(parents=True)
        (sim_dir / "registry.json").write_text('{\n  "version": 1,\n  "simulators": []\n}\n')
        result = synthesis.promote_to_corpus(out["contract"], tmp)
        files = {
            name: (sim_dir / "byo_promote_golden" / name).read_text()
            for name in ("schema.json", "tools.json", "workflows.json", "projection.json", "materialization.json", "seed.json")
        }
        files["registry.json"] = (sim_dir / "registry.json").read_text()
        result["dir"] = result["dir"].replace(tmp, "<tmp>")
        result["registry"] = result["registry"].replace(tmp, "<tmp>")
    return {"result": result, "files": files}


CASE_BUILDERS: dict[str, Callable[[], Any]] = {
    "nl_offline_synthesize": _case_nl_offline_synthesize,
    "samples_synthesize": _case_samples_synthesize,
    "openapi_synthesize": _case_openapi_synthesize,
    "generate_seed_direct": _case_generate_seed_direct,
    "build_contract_states_only": _case_build_contract_states_only,
    "validate_contract_errors": _case_validate_contract_errors,
    "completeness_gaps": _case_completeness_gaps,
    "sketch_from_samples_direct": _case_sketch_from_samples_direct,
    "sketch_from_openapi_direct": _case_sketch_from_openapi_direct,
    "heuristic_sketch_direct": _case_heuristic_sketch_direct,
    "helpers": _case_helpers,
    "promote_to_corpus": _case_promote_to_corpus,
}


@pytest.fixture(scope="module")
def golden() -> dict[str, str]:
    if REGEN:
        data = {name: _canon(builder()) for name, builder in sorted(CASE_BUILDERS.items())}
        GOLDEN_PATH.parent.mkdir(parents=True, exist_ok=True)
        GOLDEN_PATH.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    assert GOLDEN_PATH.exists(), f"golden fixture missing — regenerate: GE_REGEN_SYNTHESIS_GOLDEN=1 pytest {Path(__file__).name}"
    return json.loads(GOLDEN_PATH.read_text(encoding="utf-8"))


@pytest.mark.parametrize("case", sorted(CASE_BUILDERS))
def test_golden_parity(case: str, golden: dict[str, str]) -> None:
    assert case in golden, f"golden fixture has no case {case!r} — regenerate (see module docstring)"
    assert _canon(CASE_BUILDERS[case]()) == golden[case], (
        f"synthesis output for {case!r} drifted from the pinned golden — if this fires after a "
        "refactor, the move was NOT verbatim (do not regenerate the fixture to make it pass)"
    )


def test_seed_stability_across_repeat_calls() -> None:
    """generate_seed is documented deterministic-when-seeded; pin that property directly."""
    a = synthesis.generate_seed(_seed_probe_contract(), seed=3, count=5)
    b = synthesis.generate_seed(_seed_probe_contract(), seed=3, count=5)
    assert _canon(a) == _canon(b)
