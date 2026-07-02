"""In-process validation (the checker the repair loop closes against).

Extracted verbatim from ``synthesis.py`` (see the parity oracle in
``test_synthesis_golden.py``). ``synthesis.py`` re-exports everything here.
"""

from __future__ import annotations

from typing import Any

from synthesis_naming import _APPROVAL_HINTS, _extract_nouns, _pluralize, _resolve_ref_collection, _singular


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
