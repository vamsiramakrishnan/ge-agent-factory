"""Domain-facade store backend for the GE Agent Factory MCP server.

Each tool carries a `binding` ({op, store, entity, key, sourceSystem, shape}).
plan_op() and shape_envelope() are pure (offline-testable); execute_tool() runs
the plan against the bound per-agent 1P store and wraps the result in a
source-system envelope — turning a plain store row into a Workday/Ariba-shaped
response. GE_DATA_BACKEND=mcp only.
"""
from __future__ import annotations

import re
from typing import Any


def _namespace(agent_id: str) -> str:
    """Per-agent object namespace (BQ dataset / AlloyDB db / Firestore DB / BT table prefix)."""
    return "agent_" + re.sub(r"[^a-zA-Z0-9]", "_", agent_id)


def plan_op(agent_id: str, tool: dict[str, Any], args: dict[str, Any]) -> dict[str, Any]:
    binding = tool.get("binding")
    if not binding:
        raise KeyError(f"tool {tool.get('name')} has no binding")
    op = binding.get("op", "read")
    kind = "append" if op in ("action", "write") else "read"
    key = binding.get("key")
    filters = {key: args[key]} if key and key in args else {}
    return {
        "kind": kind,
        "op": op,
        "store": binding["store"],
        "entity": binding["entity"],
        "namespace": _namespace(agent_id),
        "filters": filters,
        "record": dict(args) if kind == "append" else {},
        "binding": binding,
    }


def shape_envelope(binding: dict[str, Any], data: Any, *, kind: str) -> dict[str, Any]:
    """Wrap a store result in the source-system envelope that creates the domain effect."""
    system = binding.get("sourceSystem", "source_system")
    action = "write" if kind == "append" else "read"
    return {
        "source_system": system,
        "evidence_type": binding.get("shape", "source_system_record"),
        # deterministic audit trail (no wall-clock in the pure layer; stamped by caller if needed)
        "audit_trail": f"{system}:{binding['entity']}:{action}:fixture_backed",
        "data": data,
    }


def execute_tool(agent_id: str, tool: dict[str, Any], args: dict[str, Any]) -> dict[str, Any]:
    import stores

    op = plan_op(agent_id, tool, args)
    if op["kind"] == "append":
        data = stores.append_record(op)
    else:
        data = stores.read_records(op)
    return shape_envelope(op["binding"], data, kind=op["kind"])
