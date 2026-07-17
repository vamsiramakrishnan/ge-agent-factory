"""sketch -> contract (deterministic core) for system synthesis.

Extracted verbatim from ``synthesis.py`` (see the parity oracle in
``test_synthesis_golden.py``). ``synthesis.py`` re-exports everything here.
"""

from __future__ import annotations

from typing import Any

from synthesis_naming import _singular, slugify

_TERMINAL_HINTS = ("approved", "rejected", "closed", "cancelled", "canceled", "done", "complete", "resolved")


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
    states = collection.get("states") or collection.get("transitionCandidates")
    state_field = collection.get("stateField") or collection.get("statusField")
    if not state_field and (transitions or states):
        state_field = "status"
    if not state_field:
        return None
    if not transitions and not states:
        return None
    if transitions and not states:
        states = [state for state in dict.fromkeys([
            *transitions.keys(),
            *(target for targets in transitions.values() for target in targets),
        ]) if state != "*"]
    # An enum is a vocabulary, not evidence of transition edges. When a source
    # supplies states without transitions, preserve them for review and emit an
    # unmodeled (fail-closed) handler instead of inventing a linear graph.
    return {
        "stateField": state_field,
        "transitions": transitions,
        "states": states,
        "transitionCandidates": states if not transitions else None,
    }


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
            if machine["states"]:
                fields[state_field] = "enum:" + "|".join(machine["states"])
            submit_name = f"submit_{singular}_update"
            # Mutation annotations are part of the handler contract from
            # birth. A state vocabulary without edges stays explicitly
            # unmodeled until a reviewer supplies the transition graph.
            handler: dict[str, Any] = {
                "collection": name,
                "primaryKey": primary_key,
                "stateField": state_field,
                "targetStateArg": state_field,
                "noteArg": "note",
                "roleArg": "role",
                "semantics": "state_transition" if transitions else "unmodeled",
                "compensation": "manual",
                "idempotency": {"keyFields": ["idempotency_key"]},
            }
            if transitions:
                handler["transitions"] = transitions
            else:
                handler["transitionCandidates"] = machine["transitionCandidates"]
            if col.get("allowedRoles"):
                handler["allowedRoles"] = col["allowedRoles"]
            if has_approvals and col.get("approvalGated", name != "approvals"):
                handler["approvalBlockers"] = [{
                    "collection": "approvals",
                    "sourceRecordField": primary_key,
                    "states": ["requested", "pending", "pending_approval"],
                    "blockedTargetStates": _terminal_states(transitions) if transitions else [],
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
                        "idempotency_key": {"type": "string"},
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
        "workflowCatalog": {
            "id": f"{system_id}_workflows",
            "version": 1,
            "mutationModel": "ge.mutation-model.v1",
            "toolHandlers": tool_handlers,
        },
        "projection": {"id": f"{system_id}_projection", "version": 1, "collectionMappings": projection_mappings},
        "materialization": materialization,
        "tools": [tool["name"] for tool in tools],
    }
