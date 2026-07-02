"""Seed generation (live tier: python-native, FK closure + scenario coverage).

Extracted verbatim from ``synthesis.py`` (see the parity oracle in
``test_synthesis_golden.py``). ``synthesis.py`` re-exports everything here.
The richer offline / corpus tier is ``scripts/generate-simulator-data.mjs``.
"""

from __future__ import annotations

from typing import Any

from synthesis_naming import _resolve_ref_collection, _singular


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
