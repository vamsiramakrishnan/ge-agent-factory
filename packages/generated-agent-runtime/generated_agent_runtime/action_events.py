"""Action-event helpers for fixture-backed generated tools."""

from __future__ import annotations

import hashlib
import json
import os
from collections.abc import Iterable, Mapping
from pathlib import Path
from typing import Any

ACTION_EVENTS_PATH_ENV = "ACTION_EVENTS_PATH"
DEFAULT_ACTION_EVENTS_PATH = Path("artifacts") / "action-events.jsonl"


def deterministic_id(prefix: str, *parts: Any) -> str:
    """Return a stable identifier for action and audit records."""

    payload = "|".join(str(part) for part in parts if part is not None and part != "")
    digest = (
        hashlib.sha1(payload.encode("utf-8")).hexdigest()[:10].upper()
        if payload
        else "EMPTY00000"
    )
    return f"{prefix}-{digest}"


def action_events_path(
    default_path: str | os.PathLike[str] | None = None,
    *,
    env: Mapping[str, str] | None = None,
) -> Path:
    """Resolve the action-events path using ``ACTION_EVENTS_PATH`` first."""

    source_env = os.environ if env is None else env
    configured = source_env.get(ACTION_EVENTS_PATH_ENV)
    if configured:
        return Path(configured)
    return Path(default_path) if default_path is not None else DEFAULT_ACTION_EVENTS_PATH


def append_action_event(
    tool_name: str,
    result: Mapping[str, Any],
    *,
    path: str | os.PathLike[str] | None = None,
    default_path: str | os.PathLike[str] | None = None,
    env: Mapping[str, str] | None = None,
) -> Path:
    """Append one JSONL action event and return the file path written."""

    event_path = Path(path) if path is not None else action_events_path(default_path, env=env)
    event_path.parent.mkdir(parents=True, exist_ok=True)
    with event_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps({"tool": tool_name, **dict(result)}, sort_keys=True) + "\n")
    return event_path


def missing_required_inputs(values: Mapping[str, Any] | Iterable[tuple[str, Any]]) -> list[str]:
    """Return names whose values are blank or missing."""

    items = values.items() if isinstance(values, Mapping) else values
    return [name for name, value in items if value in ("", None)]


def build_action_submission_result(
    *,
    tool_name: str,
    source_system_id: str,
    target_id: str,
    rationale: str,
    status: str = "submitted",
    action_id_prefix: str = "ACTION_I",
    audit_record_id_prefix: str = "AUDIT_RE",
    evidence: Iterable[str] = ("api_response", "generated_audit_trail"),
    produces: Iterable[str] = ("action_id", "audit_record_id"),
) -> dict[str, Any]:
    """Build the standard fixture-backed action result payload."""

    audit_trail = f"{tool_name}(target_id={target_id}, rationale={rationale})"
    return {
        "source_system_id": source_system_id,
        "tool_kind": "action",
        "status": status,
        "action_id": deterministic_id(action_id_prefix, tool_name, target_id, rationale),
        "audit_record_id": deterministic_id(
            audit_record_id_prefix,
            tool_name,
            target_id,
            rationale,
        ),
        "audit_trail": audit_trail,
        "evidence": list(evidence),
        "produces": list(produces),
    }
