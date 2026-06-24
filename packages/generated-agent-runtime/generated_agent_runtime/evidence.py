"""Evidence-log helpers shared by generated agent callbacks."""

from __future__ import annotations

from collections.abc import Iterable, Mapping, MutableMapping
from typing import Any


def tool_name_for(tool: Any) -> str | None:
    """Return a stable tool name from an ADK tool object or plain string."""

    value = getattr(tool, "name", tool)
    if value is None:
        return None
    return str(value)


def normalize_source_system(source: Any) -> str:
    """Normalize source-system labels the same way generated guards do today."""

    return str(source).lower().replace(" ", "").replace("_", "").replace("/", "")


def evidence_entry(tool: Any, result: Mapping[str, Any]) -> dict[str, Any]:
    """Build the session evidence-log row for a tool result."""

    return {
        "tool": tool_name_for(tool),
        "source_system": result.get("source_system") or result.get("source_system_id"),
        "evidence": result.get("evidence"),
        "table": result.get("table"),
        "total": result.get("total"),
    }


def record_tool_evidence(
    state: MutableMapping[str, Any],
    tool: Any,
    result: Any,
) -> None:
    """Append evidence and audit-trail data to mutable callback state."""

    if not isinstance(result, Mapping):
        return

    evidence_log = state.setdefault("evidence_log", [])
    evidence_log.append(evidence_entry(tool, result))

    audit_trail = result.get("audit_trail")
    if audit_trail:
        state.setdefault("audit_trails", []).append(audit_trail)


def source_systems_from_evidence(evidence_log: Iterable[Any]) -> set[str]:
    """Return normalized source systems present in an evidence log."""

    systems: set[str] = set()
    for entry in evidence_log:
        if not isinstance(entry, Mapping):
            continue
        source = entry.get("source_system_id") or entry.get("source_system")
        if source:
            systems.add(normalize_source_system(source))
    return systems
