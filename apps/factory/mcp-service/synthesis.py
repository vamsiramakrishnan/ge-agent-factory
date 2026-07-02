"""Synthesize a live simulator from a description / samples / OpenAPI — no redeploy.

This is the headline of the BYO-system capability: a user describes a system they
have (or uploads sample payloads / an OpenAPI spec) and the factory *compiles* it into
a stateful, tool-exposing simulator and mounts it into the runtime overlay so the same
generic engine serves it immediately.

Pipeline: ``spec -> sketch -> contract (+ data recipe) -> seed -> overlay``

- **sketch** — a compact, intermediate description: collections, primary keys, fields,
  and (optionally) a per-collection state machine. Produced three ways:
  ``sketch_from_nl`` (LLM tier via Vertex ``global`` with a strict response schema, with
  a deterministic heuristic fallback so it always works offline), ``sketch_from_samples``
  (infer from example JSON rows), ``sketch_from_openapi`` (infer from a spec).
- **contract** — the full enriched contract the engine consumes, with EXPLICIT tool
  bindings (no naming-convention guessing), workflows (transitions + approval gates),
  and derived projection/materialization.
- **seed** — referentially-consistent rows (FK closure) plus scenario-coverage rows so
  the agent's demo actually exercises approval gates / invalid transitions. The live
  tier is python-native (mcp-service is python-only at runtime); the richer offline /
  corpus tier is ``scripts/generate-simulator-data.mjs``.
"""

from __future__ import annotations

import json
import logging
import os
import re
from copy import deepcopy
from typing import Any

from simulator_runtime import overlay

from synthesis_naming import (  # noqa: F401 - re-exported for compatibility
    _APPROVAL_HINTS,
    _APPROVAL_NOUNS,
    _STOPWORDS,
    _extract_nouns,
    _pluralize,
    _resolve_ref_collection,
    _singular,
    slugify,
)

from synthesis_contract import (  # noqa: F401 - re-exported for compatibility
    _TERMINAL_HINTS,
    _default_fields,
    _state_machine,
    _terminal_states,
    build_contract_from_sketch,
)

logger = logging.getLogger(__name__)


from synthesis_seed import (  # noqa: F401 - re-exported for compatibility
    _field_value,
    _inject_scenario_coverage,
    _rng,
    generate_seed,
)

from synthesis_validation import (  # noqa: F401 - re-exported for compatibility
    completeness_gaps,
    validate_contract,
)

import synthesis_sketch
from synthesis_sketch import (  # noqa: F401 - re-exported for compatibility
    _SKETCH_RESPONSE_SCHEMA,
    _SKETCH_SYSTEM_RULES,
    _genai_json,
    _heuristic_sketch,
    _llm_repair,
    _llm_sketch,
    sketch_from_nl,
    sketch_from_openapi,
    sketch_from_samples,
)

# ── top-level orchestration ─────────────────────────────────────────────────
def synthesize_system(spec: dict[str, Any], *, register: bool = True) -> dict[str, Any]:
    """Synthesize a complete simulator from ``spec`` and (optionally) mount it live.

    ``spec`` = {mode: 'nl'|'samples'|'openapi', displayName?, id?, seed?, use_llm?, ...}
    Returns {id, contract, summary}. When ``register`` is True the contract is mounted
    into the runtime overlay and is immediately resolvable by the engine.
    """
    mode = spec.get("mode", "nl")
    display_name = spec.get("displayName")
    system_id = spec.get("id") or slugify(display_name or spec.get("description", "system"))
    seed_value = int(spec.get("seed", 42))

    count = int(spec.get("count", 6))
    use_llm = spec.get("use_llm", True)
    description = spec.get("description", "")

    if mode == "samples":
        sketch = sketch_from_samples(spec["samples"], system_id=system_id, display_name=display_name)
    elif mode == "openapi":
        sketch = sketch_from_openapi(spec["openapi"], system_id=system_id, display_name=display_name)
    else:
        sketch = synthesis_sketch.sketch_from_nl(description, system_id=system_id, display_name=display_name, use_llm=use_llm)
    sketch["id"] = system_id

    # ── Agentic generate → validate → repair loop ──
    # Build the contract, check it against the in-process validator, and (for the LLM
    # NL tier) feed any errors back to the model to self-correct. Deterministic tiers
    # (heuristic/samples/openapi) validate once and report. The heuristic output is
    # already structurally closed, so this mainly hardens LLM-authored sketches.
    can_repair = mode == "nl" and use_llm and sketch.get("source", "").startswith("nl-llm")
    max_attempts = max(1, int(spec.get("repair_attempts", 2))) if can_repair else 1
    contract: dict[str, Any] = {}
    errors: list[str] = []
    repairs = 0
    for attempt in range(max_attempts):
        contract = build_contract_from_sketch(sketch)
        contract["seed"] = generate_seed(contract, seed=seed_value, count=count)
        errors = validate_contract(contract)
        # Structural errors block registration; completeness gaps only drive repair.
        gaps = completeness_gaps(contract, description, system_id=system_id, display_name=display_name) if can_repair else []
        if (not errors and not gaps) or attempt == max_attempts - 1:
            break
        repaired = synthesis_sketch._llm_repair(description, sketch, errors + gaps, system_id=system_id, display_name=display_name)
        if not repaired:
            break
        sketch, repairs = repaired, repairs + 1

    contract.setdefault("provenance", {})["source"] = sketch.get("source", mode)
    contract["provenance"]["repairs"] = repairs

    if register and not errors:
        overlay.register_overlay_contract(deepcopy(contract))

    return {
        "id": contract["id"],
        "displayName": contract["displayName"],
        "source": sketch.get("source", mode),
        "tools": contract["tools"],
        "collections": {name: len(contract["seed"].get(name, [])) for name in contract["schema"]["collections"]},
        "valid": not errors,
        "validationErrors": errors,
        "repairs": repairs,
        "registered": bool(register and not errors),
        "contract": contract,
    }


_SIM_DIR_REL = "apps/factory/simulator-systems"


def promote_to_corpus(contract: dict[str, Any], repo_root: str) -> dict[str, Any]:
    """Persist a synthesized/overlay contract into the CURATED corpus.

    Writes the per-section files (the legacy 6-file layout the engine already loads)
    and adds/updates a registry.json entry so the pack loads as a built-in — graduating
    an ephemeral BYO system into the durable corpus. Returns the written paths.
    """
    system_id = contract["id"]
    base = os.path.join(repo_root, _SIM_DIR_REL, system_id)
    os.makedirs(base, exist_ok=True)
    sections = {
        "schema.json": contract.get("schema") or {},
        "tools.json": contract.get("toolCatalog") or {"tools": []},
        "workflows.json": contract.get("workflowCatalog") or {},
        "projection.json": contract.get("projection") or {},
        "materialization.json": contract.get("materialization") or {},
        "seed.json": contract.get("seed") or {"audit_events": []},
    }
    for name, data in sections.items():
        with open(os.path.join(base, name), "w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2)
            handle.write("\n")

    rel = f"{_SIM_DIR_REL}/{system_id}"
    entry = {
        "id": system_id,
        "displayName": contract.get("displayName") or system_id,
        "maturity": contract.get("maturity") or "synthesized",
        "family": contract.get("family") or "custom",
        "aliases": contract.get("aliases") or [contract.get("displayName") or system_id, system_id],
        "entities": contract.get("entities") or [],
        "roles": contract.get("roles") or [],
        "tools": contract.get("tools") or [],
        "schemaPath": f"{rel}/schema.json",
        "toolsPath": f"{rel}/tools.json",
        "workflowsPath": f"{rel}/workflows.json",
        "projectionPath": f"{rel}/projection.json",
        "materializationPath": f"{rel}/materialization.json",
        "seedPath": f"{rel}/seed.json",
        "provenance": contract.get("provenance") or {"source": "synthesized"},
    }
    reg_path = os.path.join(repo_root, _SIM_DIR_REL, "registry.json")
    registry = json.loads(open(reg_path, encoding="utf-8").read())
    sims = [s for s in registry.get("simulators", []) if s.get("id") != system_id]
    sims.append(entry)
    registry["simulators"] = sims
    with open(reg_path, "w", encoding="utf-8") as handle:
        json.dump(registry, handle, indent=2)
        handle.write("\n")
    return {"id": system_id, "dir": base, "files": sorted(sections), "registry": reg_path}
