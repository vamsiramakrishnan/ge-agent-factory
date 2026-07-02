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

logger = logging.getLogger(__name__)

_TERMINAL_HINTS = ("approved", "rejected", "closed", "cancelled", "canceled", "done", "complete", "resolved")


# ── sketch -> contract (deterministic core) ─────────────────────────────────
def _default_fields(primary_key: str) -> dict[str, str]:
    return {
        primary_key: "string",
        "name": "string",
        "status": "enum:open|in_progress|closed",
        "owner": "string",
        "created_at": "date",
    }


def _state_machine(collection: dict[str, Any]) -> dict[str, Any] | None:
    transitions = collection.get("transitions")
    states = collection.get("states")
    state_field = collection.get("stateField") or collection.get("statusField")
    if not state_field and (transitions or states):
        state_field = "status"
    if not state_field:
        return None
    if not transitions:
        if not states:
            return None
        # Linear default chain through the declared states.
        transitions = {states[i]: [states[i + 1]] for i in range(len(states) - 1)}
    return {"stateField": state_field, "transitions": transitions, "states": states or list(transitions)}


def _terminal_states(transitions: dict[str, list[str]]) -> list[str]:
    # First-seen order (not a set): set iteration is randomized per process
    # (PYTHONHASHSEED), which made synthesized contracts differ byte-wise
    # across otherwise-identical CLI invocations.
    targets = list(dict.fromkeys(t for ts in transitions.values() for t in ts))
    sources = set(transitions)
    terminal = [t for t in targets if t not in sources]
    hinted = [t for t in targets if any(h in t for h in _TERMINAL_HINTS)]
    return list(dict.fromkeys([*terminal, *hinted]))


def build_contract_from_sketch(sketch: dict[str, Any]) -> dict[str, Any]:
    """Expand a sketch into the full enriched engine contract (with explicit bindings)."""
    system_id = sketch.get("id") or slugify(sketch.get("displayName", "system"))
    display_name = sketch.get("displayName") or system_id.removeprefix("byo_").replace("_", " ").title()
    raw_collections = sketch.get("collections") or []

    collection_names = {c["name"] for c in raw_collections if c.get("name")}
    has_approvals = "approvals" in collection_names

    schema_collections: dict[str, Any] = {}
    tools: list[dict[str, Any]] = []
    tool_handlers: dict[str, Any] = {}
    materialization: dict[str, Any] = {"id": f"{system_id}_materialization", "version": 1, "collections": {}}
    projection_mappings: list[dict[str, Any]] = []
    entities: list[str] = []

    for col in raw_collections:
        name = col.get("name")
        if not name:
            continue
        primary_key = col.get("primaryKey") or f"{_singular(name)}_id"
        fields = dict(col.get("fields") or _default_fields(primary_key))
        fields.setdefault(primary_key, "string")
        schema_collections[name] = {"primaryKey": primary_key, "fields": fields}
        entities.append(_singular(name))
        materialization["collections"][name] = {
            "primaryKey": primary_key,
            "fieldAliases": {primary_key: [primary_key, "id", "source_record_id"]},
            "defaults": {},
        }
        projection_mappings.append({
            "graphKinds": [system_id, _singular(name)],
            "realizedObjects": [name],
            "simulatorCollection": name,
            "mergeMode": "merge-records-by-primary-key",
        })

        singular = _singular(name)
        tools.append({
            "name": f"search_{name}",
            "description": f"Search {display_name} {name}.",
            "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}, "limit": {"type": "integer"}}},
            "binding": {"op": "search", "collection": name},
        })
        tools.append({
            "name": f"get_{singular}",
            "description": f"Get a {display_name} {singular} by id.",
            "inputSchema": {"type": "object", "properties": {primary_key: {"type": "string"}}, "required": [primary_key]},
            "binding": {"op": "get", "collection": name, "primaryKey": primary_key},
        })

        machine = _state_machine(col)
        if machine:
            transitions = machine["transitions"]
            state_field = machine["stateField"]
            fields.setdefault(state_field, "enum:" + "|".join(machine["states"]))
            submit_name = f"submit_{singular}_update"
            handler: dict[str, Any] = {
                "collection": name,
                "primaryKey": primary_key,
                "stateField": state_field,
                "targetStateArg": state_field,
                "noteArg": "note",
                "roleArg": "role",
                "transitions": transitions,
            }
            if col.get("allowedRoles"):
                handler["allowedRoles"] = col["allowedRoles"]
            if has_approvals and col.get("approvalGated", name != "approvals"):
                handler["approvalBlockers"] = [{
                    "collection": "approvals",
                    "sourceRecordField": primary_key,
                    "states": ["requested", "pending", "pending_approval"],
                    "blockedTargetStates": _terminal_states(transitions) or [],
                }]
            tool_handlers[submit_name] = handler
            tools.append({
                "name": submit_name,
                "description": f"Transition a {display_name} {singular} to a new {state_field}.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        primary_key: {"type": "string"},
                        state_field: {"type": "string"},
                        "note": {"type": "string"},
                        "role": {"type": "string"},
                    },
                    "required": [primary_key, state_field],
                },
                "binding": {"op": "submit", "collection": name, "primaryKey": primary_key},
            })

    if has_approvals:
        tools.append({
            "name": "list_pending_approvals",
            "description": "List pending approvals.",
            "inputSchema": {"type": "object", "properties": {"source_record_id": {"type": "string"}}},
            "binding": {"op": "list_pending_approvals", "collection": "approvals"},
        })
    tools.append({
        "name": "list_audit_events",
        "description": "List recent audit events.",
        "inputSchema": {"type": "object", "properties": {"limit": {"type": "integer"}}},
        "binding": {"op": "list_audit_events"},
    })

    return {
        "id": system_id,
        "displayName": display_name,
        "maturity": "synthesized",
        "family": sketch.get("family") or "custom",
        "aliases": sketch.get("aliases") or [display_name, system_id],
        "entities": entities,
        "roles": sketch.get("roles") or [],
        "stateBackend": sketch.get("stateBackend") or "memory",
        "provenance": {"source": sketch.get("source") or "sketch", "synthesized": True},
        "schema": {"id": f"{system_id}_schema", "version": 1, "collections": schema_collections},
        "toolCatalog": {"id": f"{system_id}_tools", "version": 1, "tools": tools},
        "workflowCatalog": {"id": f"{system_id}_workflows", "version": 1, "toolHandlers": tool_handlers},
        "projection": {"id": f"{system_id}_projection", "version": 1, "collectionMappings": projection_mappings},
        "materialization": materialization,
        "tools": [tool["name"] for tool in tools],
    }


# ── seed generation (live tier: python-native, FK closure + scenario coverage) ──
def _rng(seed: int):
    state = (seed * 2654435761 + 12345) & 0xFFFFFFFF

    def nxt() -> int:
        nonlocal state
        state = (1103515245 * state + 12345) & 0x7FFFFFFF
        return state

    return nxt


def _field_value(field: str, spec: str, rng, index: int, refs: dict[str, list[str]]) -> Any:
    spec = spec or "string"
    if spec.startswith("enum:"):
        options = spec[len("enum:"):].split("|")
        return options[index % len(options)] if options else None
    if spec.startswith("ref:"):
        target = spec[len("ref:"):].split(".")[0]
        pool = refs.get(target) or []
        return pool[index % len(pool)] if pool else None
    if field.endswith("_id"):
        target = _resolve_ref_collection(field[:-3], refs)
        if target is not None:
            pool = refs[target]
            return pool[index % len(pool)] if pool else None
    low = field.lower()
    if "email" in low:
        return f"user{index + 1}@example.com"
    if "date" in low or low.endswith("_at"):
        return f"2026-{(index % 12) + 1:02d}-{(index % 27) + 1:02d}"
    if "amount" in low or "cost" in low or "price" in low or "balance" in low:
        return 1000 + (rng() % 90000)
    if "count" in low or "qty" in low or "quantity" in low or "score" in low:
        return rng() % 100
    if "name" in low or "title" in low or "description" in low:
        return f"{field.replace('_', ' ').title()} {index + 1}"
    return f"{field}-{index + 1}"


def generate_seed(contract: dict[str, Any], *, seed: int = 42, count: int = 6) -> dict[str, Any]:
    """Deterministic seed with FK closure + scenario-coverage rows."""
    rng = _rng(seed)
    collections = contract.get("schema", {}).get("collections", {})
    handlers = contract.get("workflowCatalog", {}).get("toolHandlers", {})

    # Order so a collection's FK referents exist before it (best-effort topo by ref edges).
    order = list(collections)
    pk_pools: dict[str, list[str]] = {name: [] for name in collections}
    data: dict[str, list[dict[str, Any]]] = {name: [] for name in collections}

    def ref_targets(name: str) -> set[str]:
        targets = set()
        for field, spec in collections[name]["fields"].items():
            if isinstance(spec, str) and spec.startswith("ref:"):
                targets.add(spec[len("ref:"):].split(".")[0])
            elif field.endswith("_id"):
                resolved = _resolve_ref_collection(field[:-3], collections)
                if resolved is not None:
                    targets.add(resolved)
        return targets - {name}

    order.sort(key=lambda n: len(ref_targets(n)))

    for name in order:
        spec = collections[name]
        primary_key = spec["primaryKey"]
        prefix = "".join(part[0] for part in _singular(name).split("_"))[:3].upper() or "R"
        for i in range(count):
            row: dict[str, Any] = {}
            pk_value = f"{prefix}-{i + 1:03d}"
            for field, ftype in spec["fields"].items():
                row[field] = pk_value if field == primary_key else _field_value(field, ftype if isinstance(ftype, str) else "string", rng, i, pk_pools)
            data[name].append(row)
            pk_pools[name].append(pk_value)

    # Second pass: repair FKs the one-pass ordering couldn't satisfy. A cyclic ref
    # (orders↔customers) generates one side before the other's PKs exist, leaving those
    # FK values None / dangling. Now that every PK pool is fully populated, rebind any FK
    # that doesn't point at a real referent to a real PK (round-robin for determinism).
    for name in order:
        for field, spec in collections[name]["fields"].items():
            if field == collections[name]["primaryKey"]:
                continue
            target: str | None = None
            if isinstance(spec, str) and spec.startswith("ref:"):
                target = spec[len("ref:"):].split(".")[0]
                if target not in pk_pools:
                    target = None
            elif isinstance(field, str) and field.endswith("_id"):
                target = _resolve_ref_collection(field[:-3], pk_pools)
            if not target or target == name:
                continue
            pool = pk_pools.get(target) or []
            if not pool:
                continue
            for idx, row in enumerate(data[name]):
                if row.get(field) not in pool:
                    row[field] = pool[idx % len(pool)]

    seed_doc: dict[str, Any] = {name: rows for name, rows in data.items()}
    seed_doc.setdefault("audit_events", [])
    _inject_scenario_coverage(seed_doc, collections, handlers)
    return seed_doc


def _inject_scenario_coverage(seed_doc: dict[str, Any], collections: dict[str, Any], handlers: dict[str, Any]) -> None:
    """Guarantee rows that exercise each transition source + each approval gate."""
    for handler in handlers.values():
        collection = handler.get("collection")
        rows = seed_doc.get(collection)
        if not rows:
            continue
        state_field = handler.get("stateField", "status")
        transitions = handler.get("transitions") or {}
        sources = list(transitions)
        # Spread existing rows across the transition source states so every transition is reachable.
        for idx, source_state in enumerate(sources):
            if idx < len(rows):
                rows[idx][state_field] = source_state
        # Approval gate: put a row in a blockable source state + a matching pending approval.
        for blocker in handler.get("approvalBlockers") or []:
            approvals = seed_doc.setdefault(blocker.get("collection", "approvals"), [])
            source_field = blocker.get("sourceRecordField", "source_record_id")
            primary_key = collections.get(collection, {}).get("primaryKey", "id")
            gated = rows[0]
            if sources:
                gated[state_field] = sources[0]
            approvals.append({
                "approval_id": f"APR-COV-{collection}",
                source_field: gated.get(primary_key),
                "state": "requested",
                "reason": f"coverage: gates {collection} closure",
            })


# ── in-process validation (the checker the repair loop closes against) ───────
def validate_contract(contract: dict[str, Any]) -> list[str]:
    """Return structural errors in a synthesized contract (empty list = valid).

    This is the same quality bar the Node validator enforces, in-process so the LLM
    tier can self-correct against it: bindings/workflows resolve to real collections,
    foreign keys reference real collections AND resolve to real PKs in the seed, and
    every collection has rows.
    """
    errors: list[str] = []
    collections = contract.get("schema", {}).get("collections", {})
    if not collections:
        return ["contract declares no collections"]
    seed = contract.get("seed") or {}

    for tool in contract.get("toolCatalog", {}).get("tools", []):
        binding = tool.get("binding") or {}
        op = binding.get("op")
        if op in ("search", "get", "submit") and binding.get("collection") not in collections:
            errors.append(f"tool {tool.get('name')} binds to unknown collection {binding.get('collection')}")
    for name, handler in contract.get("workflowCatalog", {}).get("toolHandlers", {}).items():
        if handler.get("collection") not in collections:
            errors.append(f"workflow {name} targets unknown collection {handler.get('collection')}")

    for cname, cspec in collections.items():
        primary_key = cspec.get("primaryKey")
        for field, ftype in (cspec.get("fields") or {}).items():
            target = None
            if isinstance(ftype, str) and ftype.startswith("ref:"):
                target = ftype[len("ref:"):].split(".")[0]
                if target not in collections:
                    errors.append(f"{cname}.{field} references unknown collection {target}")
                    continue
            elif field != primary_key and field.endswith("_id"):
                target = _resolve_ref_collection(field[:-3], collections)
            if target and target in collections:
                ref_pk = collections[target].get("primaryKey")
                pks = {row.get(ref_pk) for row in seed.get(target, [])}
                for row in seed.get(cname, []):
                    value = row.get(field)
                    if value is not None and value not in pks:
                        errors.append(f"dangling FK {cname}.{field}={value} (no {target}.{ref_pk})")
        if not seed.get(cname):
            errors.append(f"collection {cname} has no seed rows")
    return errors


def completeness_gaps(contract: dict[str, Any], description: str, *, system_id: str = "", display_name: str | None = None) -> list[str]:
    """Advisory richness checks — entities named but not modeled, or a missing workflow.

    These don't block registration (the result is still structurally valid), but they
    DO trigger an LLM repair pass so a rich description doesn't collapse to one table.
    """
    gaps: list[str] = []
    collections = contract.get("schema", {}).get("collections", {})
    singulars = {_singular(c) for c in collections}
    nouns = _extract_nouns(description, system_id=system_id or contract.get("id", ""), display_name=display_name)
    missing = [n for n in nouns if n not in singulars and _pluralize(n) not in collections]
    if missing:
        gaps.append(f"entities named in the description are not modeled as collections: {', '.join(missing[:6])}")
    lifecycle_words = (*_APPROVAL_HINTS, "close", "open", "complete", "lifecycle", "workflow", "submit", "status", "state")
    if any(w in description.lower() for w in lifecycle_words) and not contract.get("workflowCatalog", {}).get("toolHandlers"):
        gaps.append("the primary transactional entity has no stateField/transitions (no workflow)")
    if len(collections) < 2 and len(nouns) >= 2:
        gaps.append(f"only {len(collections)} collection(s) for a system that names {len(nouns)} entities")
    return gaps


# ── sketch sources ──────────────────────────────────────────────────────────
def sketch_from_samples(samples: dict[str, list[dict[str, Any]]], *, system_id: str, display_name: str | None = None) -> dict[str, Any]:
    """Infer a sketch from example rows keyed by collection name."""
    collections = []
    for name, rows in samples.items():
        rows = rows or []
        fields: dict[str, str] = {}
        for row in rows[:25]:
            for key, value in row.items():
                if key in fields:
                    continue
                if isinstance(value, bool):
                    fields[key] = "boolean"
                elif isinstance(value, (int, float)):
                    fields[key] = "number"
                elif key.endswith("_id") and key != f"{_singular(name)}_id":
                    fields[key] = f"ref:{_pluralize(key[:-3])}.{key}"
                else:
                    fields[key] = "string"
        primary_key = next((k for k in fields if k == f"{_singular(name)}_id"), None) or next((k for k in fields if k.endswith("_id")), f"{_singular(name)}_id")
        collections.append({"name": name, "primaryKey": primary_key, "fields": fields})
    return {"id": system_id, "displayName": display_name, "source": "samples", "collections": collections}


def sketch_from_openapi(spec: dict[str, Any], *, system_id: str, display_name: str | None = None) -> dict[str, Any]:
    """Infer a sketch from an OpenAPI document's component schemas."""
    schemas = (spec.get("components") or {}).get("schemas") or spec.get("definitions") or {}
    collections = []
    for schema_name, schema in list(schemas.items())[:12]:
        props = (schema or {}).get("properties") or {}
        if not props:
            continue
        name = _pluralize(re.sub(r"[^a-z0-9]+", "_", schema_name.lower()).strip("_"))
        fields = {}
        for prop, prop_schema in props.items():
            ptype = (prop_schema or {}).get("type")
            if ptype in ("integer", "number"):
                fields[prop] = "number"
            elif ptype == "boolean":
                fields[prop] = "boolean"
            else:
                fields[prop] = "string"
        primary_key = next((p for p in fields if p in ("id", f"{_singular(name)}_id")), None) or f"{_singular(name)}_id"
        fields.setdefault(primary_key, "string")
        collections.append({"name": name, "primaryKey": primary_key, "fields": fields})
    return {
        "id": system_id,
        "displayName": display_name or spec.get("info", {}).get("title"),
        "source": "openapi",
        "collections": collections,
    }


def _heuristic_sketch(description: str, *, system_id: str, display_name: str | None) -> dict[str, Any]:
    """Always-available offline NL parse: nouns -> collections, approval words -> a gate."""
    nouns = _extract_nouns(description, system_id=system_id, display_name=display_name, limit=4) or ["record"]
    wants_approval = any(hint in description.lower() for hint in _APPROVAL_HINTS)

    collections = []
    for i, noun in enumerate(nouns):
        name = _pluralize(noun)
        col: dict[str, Any] = {"name": name, "primaryKey": f"{noun}_id",
                               "fields": {f"{noun}_id": "string", "name": "string", "status": "enum:open|pending_approval|approved|rejected", "owner": "string", "created_at": "date"}}
        if i == 0:  # primary entity carries the workflow
            col.update({
                "stateField": "status",
                "transitions": {"open": ["pending_approval"], "pending_approval": ["approved", "rejected"]},
                "approvalGated": wants_approval,
            })
        collections.append(col)
    if wants_approval and not any(c["name"] == "approvals" for c in collections):
        collections.append({
            "name": "approvals",
            "primaryKey": "approval_id",
            "fields": {"approval_id": "string", f"{nouns[0]}_id": f"ref:{_pluralize(nouns[0])}.{nouns[0]}_id", "state": "enum:requested|approved|rejected", "reason": "string"},
        })
    return {"id": system_id, "displayName": display_name, "source": "nl-heuristic", "collections": collections}


_SKETCH_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "displayName": {"type": "string"},
        "roles": {"type": "array", "items": {"type": "string"}},
        "collections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "primaryKey": {"type": "string"},
                    "fields": {"type": "object"},
                    "stateField": {"type": "string"},
                    "states": {"type": "array", "items": {"type": "string"}},
                    "transitions": {"type": "object"},
                    "approvalGated": {"type": "boolean"},
                },
                "required": ["name", "primaryKey"],
            },
        },
    },
    "required": ["collections"],
}


_SKETCH_SYSTEM_RULES = (
    "You design enterprise-system simulators. Return a JSON sketch of a system's data model "
    "and workflow. Model EVERY distinct entity named in the description as its own collection — "
    "including child / line-item entities (e.g. work_orders, components) and join entities "
    "(e.g. technician_certifications). Aim for one collection per noun the user mentions; do not "
    "collapse the system into a single table. Use snake_case plural collection names and a "
    "`<singular>_id` primary key per collection. Relate collections with foreign keys. Field types: "
    "'string', 'number', 'boolean', 'date', 'enum:a|b|c', or 'ref:<collection>.<field>' for foreign "
    "keys. The primary transactional entity MUST have a stateField + states + transitions (a realistic "
    "lifecycle). If the description mentions approvals/review/sign-off, add an `approvals` collection "
    "with a ref to the gated entity and set approvalGated=true on it. Every ref MUST point at a "
    "collection you also define."
)


def _genai_json(prompt: str) -> dict[str, Any] | None:
    """One structured Vertex call (``global`` endpoint). Returns parsed JSON or None."""
    try:
        from google import genai
        from google.genai import types as genai_types
    except Exception:  # noqa: BLE001
        return None
    project = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("GCLOUD_PROJECT")
    if not project:
        return None
    location = os.environ.get("GE_SYNTHESIS_LOCATION") or os.environ.get("GOOGLE_CLOUD_LOCATION") or "global"
    model = os.environ.get("GE_SYNTHESIS_MODEL", "gemini-3.5-flash")
    try:
        client = genai.Client(vertexai=True, project=project, location=location)
        resp = client.models.generate_content(
            model=model,
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=_SKETCH_RESPONSE_SCHEMA,
                temperature=0.2,
            ),
        )
        return json.loads(resp.text or "{}")
    except Exception as exc:  # noqa: BLE001 - any LLM/auth failure ⇒ caller falls back
        logger.warning("LLM tier failed (%s)", exc)
        return None


def _llm_sketch(description: str, *, system_id: str, display_name: str | None) -> dict[str, Any] | None:
    """High-fidelity NL tier via Vertex. Returns None on any failure."""
    sketch = _genai_json(f"{_SKETCH_SYSTEM_RULES}\n\nDescription:\n{description}")
    if not sketch:
        return None
    sketch["id"] = system_id
    sketch.setdefault("displayName", display_name)
    sketch["source"] = "nl-llm"
    return sketch


def _llm_repair(description: str, prior_sketch: dict[str, Any], errors: list[str], *,
                system_id: str, display_name: str | None) -> dict[str, Any] | None:
    """Ask the model to FIX a sketch given the validator's errors — the agentic loop.

    This is the 'it can write code, so let it check and correct itself' tier: the model
    sees its previous sketch and the concrete validation failures and returns a repaired
    sketch. Returns None on failure (caller keeps the last valid-enough sketch).
    """
    prompt = (
        f"{_SKETCH_SYSTEM_RULES}\n\nA previous sketch failed validation. Fix EVERY listed error "
        "and return the full corrected sketch (same JSON shape).\n\n"
        f"Description:\n{description}\n\nPrevious sketch:\n{json.dumps(prior_sketch, indent=2)}\n\n"
        f"Validation errors to fix:\n- " + "\n- ".join(errors)
    )
    sketch = _genai_json(prompt)
    if not sketch or not sketch.get("collections"):
        return None
    sketch["id"] = system_id
    sketch.setdefault("displayName", display_name)
    sketch["source"] = "nl-llm-repaired"
    return sketch


def sketch_from_nl(description: str, *, system_id: str, display_name: str | None = None, use_llm: bool = True) -> dict[str, Any]:
    if use_llm:
        llm = _llm_sketch(description, system_id=system_id, display_name=display_name)
        if llm and llm.get("collections"):
            return llm
    return _heuristic_sketch(description, system_id=system_id, display_name=display_name)


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
        sketch = sketch_from_nl(description, system_id=system_id, display_name=display_name, use_llm=use_llm)
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
        repaired = _llm_repair(description, sketch, errors + gaps, system_id=system_id, display_name=display_name)
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
