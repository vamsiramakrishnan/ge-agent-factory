"""The four sketch-derivation strategies: samples, OpenAPI, NL-heuristic, NL-LLM.

Extracted verbatim from ``synthesis.py`` (see the parity oracle in
``test_synthesis_golden.py``; the deterministic strategies are golden-pinned).
``synthesis.py`` re-exports everything here.

The LLM tier (``_genai_json`` / ``_llm_sketch`` / ``_llm_repair``) is
runtime-unverified in offline environments: it needs Vertex credentials and is
exercised only through the monkeypatched repair-loop tests. The orchestrator
(and those tests) access it via THIS module's attributes so monkeypatching
``synthesis_sketch._llm_sketch`` / ``_llm_repair`` intercepts the real call path.
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

from synthesis_naming import _APPROVAL_HINTS, _extract_nouns, _pluralize, _singular

logger = logging.getLogger(__name__)


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


# Property names that mark a schema's lifecycle field, in pick order.
_STATE_PROP_NAMES = ("status", "state", "stage", "phase")


def _openapi_write_segments(spec: dict[str, Any]) -> set[str]:
    """Path segments that carry a write verb — the evidence a collection is mutable."""
    segments: set[str] = set()
    for path, ops in (spec.get("paths") or {}).items():
        if not isinstance(ops, dict):
            continue
        if any(verb in ops for verb in ("post", "put", "patch", "delete")):
            for seg in re.split(r"/+", str(path)):
                seg = seg.strip()
                if seg and not seg.startswith("{"):
                    segments.add(re.sub(r"[^a-z0-9]+", "_", seg.lower()).strip("_"))
    return segments


def sketch_from_openapi(spec: dict[str, Any], *, system_id: str, display_name: str | None = None) -> dict[str, Any]:
    """Infer a sketch from an OpenAPI document's component schemas.

    Deterministic, evidence-based write semantics (ge.mutation-model.v1,
    Phase 1 of docs/plans/real-system-twins/): a string enum is preserved as
    an ``enum:`` field type instead of being flattened to ``string``, and a
    status-like enum property becomes the collection's ``stateField`` plus
    ``transitionCandidates`` ONLY when the spec also declares a write verb
    (post/put/patch/delete) on a path segment matching the collection — an
    enum the API never mutates is data, not a state machine. The enum order
    is never converted into transition edges; those require review.
    """
    schemas = (spec.get("components") or {}).get("schemas") or spec.get("definitions") or {}
    write_segments = _openapi_write_segments(spec)
    collections = []
    for schema_name, schema in list(schemas.items())[:12]:
        props = (schema or {}).get("properties") or {}
        if not props:
            continue
        name = _pluralize(re.sub(r"[^a-z0-9]+", "_", schema_name.lower()).strip("_"))
        fields = {}
        enum_values: dict[str, list[str]] = {}
        for prop, prop_schema in props.items():
            ptype = (prop_schema or {}).get("type")
            enum = (prop_schema or {}).get("enum")
            if isinstance(enum, list) and enum and all(isinstance(v, str) for v in enum):
                fields[prop] = "enum:" + "|".join(enum)
                enum_values[prop] = list(enum)
            elif ptype in ("integer", "number"):
                fields[prop] = "number"
            elif ptype == "boolean":
                fields[prop] = "boolean"
            else:
                fields[prop] = "string"
        primary_key = next((p for p in fields if p in ("id", f"{_singular(name)}_id")), None) or f"{_singular(name)}_id"
        fields.setdefault(primary_key, "string")
        col: dict[str, Any] = {"name": name, "primaryKey": primary_key, "fields": fields}
        if name in write_segments or _singular(name) in write_segments:
            state_prop = next((p for p in _STATE_PROP_NAMES if p in enum_values), None)
            if state_prop:
                col["stateField"] = state_prop
                col["transitionCandidates"] = enum_values[state_prop]
        collections.append(col)
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
