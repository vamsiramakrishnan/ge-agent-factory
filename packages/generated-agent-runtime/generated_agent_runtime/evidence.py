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


RECORD_ID_FIELDS = (
    "id",
    "source_record_id",
    "target_id",
    "account_number",
    "account_id",
    "case_id",
    "case_number",
    "application_number",
    "transaction_id",
    "envelope_id",
)


def result_record_ids(result: Mapping[str, Any]) -> list[str]:
    """Return business identifiers found in a source query result."""

    rows = result.get("rows")
    if not isinstance(rows, list):
        return []
    ids: list[str] = []
    for row in rows[:50]:
        if not isinstance(row, Mapping):
            continue
        for field in RECORD_ID_FIELDS:
            value = row.get(field)
            if value not in ("", None):
                ids.append(str(value))
    seen: set[str] = set()
    unique: list[str] = []
    for value in ids:
        if value in seen:
            continue
        seen.add(value)
        unique.append(value)
    return unique


def evidence_has_rows(entry: Mapping[str, Any]) -> bool:
    """Return whether an evidence entry represents usable source data."""

    if entry.get("error"):
        return False
    if "total" not in entry or entry.get("total") in (None, ""):
        return True
    try:
        return int(entry.get("total")) > 0
    except (TypeError, ValueError):
        return True


def evidence_entry(tool: Any, result: Mapping[str, Any]) -> dict[str, Any]:
    """Build the session evidence-log row for a tool result."""

    return {
        "tool": tool_name_for(tool),
        "source_system": result.get("source_system") or result.get("source_system_id"),
        "source_system_id": result.get("source_system_id"),
        "evidence": result.get("evidence"),
        "table": result.get("table"),
        "total": result.get("total"),
        "error": result.get("error"),
        "record_ids": result_record_ids(result),
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
        if not evidence_has_rows(entry):
            continue
        source = entry.get("source_system_id") or entry.get("source_system")
        if source:
            systems.add(normalize_source_system(source))
    return systems


def record_ids_from_evidence(evidence_log: Iterable[Any]) -> set[str]:
    """Return identifiers that came from non-empty source evidence."""

    ids: set[str] = set()
    for entry in evidence_log:
        if not isinstance(entry, Mapping) or not evidence_has_rows(entry):
            continue
        for value in entry.get("record_ids") or ():
            if value not in ("", None):
                ids.add(str(value))
    return ids
