"""Shared helpers for generated GE agents."""

from generated_agent_runtime.action_events import (
    ACTION_EVENTS_PATH_ENV,
    action_events_path,
    append_action_event,
    build_action_submission_result,
    deterministic_id,
    missing_required_inputs,
)
from generated_agent_runtime.callbacks import (
    WorkflowCallbackConfig,
    capture_tool_evidence,
    enforce_tool_contract,
    initialize_workflow_state,
    make_enforce_tool_contract,
    make_initialize_workflow_state,
)
from generated_agent_runtime.evidence import (
    evidence_entry,
    normalize_source_system,
    record_tool_evidence,
    source_systems_from_evidence,
    tool_name_for,
)

__version__ = "0.1.0"

__all__ = [
    "__version__",
    "ACTION_EVENTS_PATH_ENV",
    "WorkflowCallbackConfig",
    "action_events_path",
    "append_action_event",
    "build_action_submission_result",
    "capture_tool_evidence",
    "deterministic_id",
    "enforce_tool_contract",
    "evidence_entry",
    "initialize_workflow_state",
    "make_enforce_tool_contract",
    "make_initialize_workflow_state",
    "missing_required_inputs",
    "normalize_source_system",
    "record_tool_evidence",
    "source_systems_from_evidence",
    "tool_name_for",
]
