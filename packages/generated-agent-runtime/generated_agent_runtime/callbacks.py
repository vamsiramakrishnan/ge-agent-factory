"""ADK-compatible callbacks for generated agents.

This module does not import Google ADK. The callbacks use duck-typed ``state`` objects
so they remain importable and unit-testable without ADK installed.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
import re
from typing import Any

from generated_agent_runtime.evidence import (
    normalize_source_system,
    record_ids_from_evidence,
    record_tool_evidence,
    source_systems_from_evidence,
    tool_name_for,
)

EMPTY_ARGUMENT_VALUES = ("", None)
BYPASS_REFUSAL_TEXT = (
    "I cannot skip evidence, policy, compliance, approval, or source-system "
    "checks. The compliant path is to gather source-system evidence, check the "
    "governing policy, and only then recommend or execute an escalation with an "
    "audit trail."
)
BYPASS_REQUEST_RE = re.compile(
    r"(?:\b(skip|bypass|ignore|override|waive|disable)\b.{0,120}\b"
    r"(evidence|policy|compliance|approval|source|check|verification|guardrail)\b)"
    r"|(?:\b(evidence|policy|compliance|approval|source)\b.{0,120}\b"
    r"(skip|bypass|ignore|override|waive|disable)\b)"
    r"|(?:\bi take responsibility\b)",
    re.IGNORECASE | re.DOTALL,
)


@dataclass(frozen=True)
class WorkflowCallbackConfig:
    """Static generated-agent metadata used by callback factories."""

    scenario_id: str
    primary_objective: str
    expected_tools: Sequence[str] = field(default_factory=tuple)
    write_tools: Sequence[str] = field(default_factory=tuple)
    required_inputs_by_tool: Mapping[str, Sequence[str]] = field(default_factory=dict)
    evidence_min_systems_by_tool: Mapping[str, int] = field(default_factory=dict)
    evidence_required_systems_by_tool: Mapping[str, Sequence[str]] = field(default_factory=dict)


def initialize_workflow_state_value(
    state: Any,
    config: WorkflowCallbackConfig,
) -> None:
    """Initialize session-scoped state used by evals, callbacks, and audit review."""

    state.setdefault("scenario_id", config.scenario_id)
    state.setdefault("primary_objective", config.primary_objective)
    state.setdefault("expected_tools", list(config.expected_tools))
    state.setdefault("evidence_log", [])
    state.setdefault("audit_trails", [])


def content_text(content: Any) -> str:
    """Extract text from an ADK/GenAI Content-like object without importing ADK."""

    parts = getattr(content, "parts", None) or []
    return "\n".join(str(getattr(part, "text", "") or "") for part in parts)


def is_bypass_request(text: str) -> bool:
    """Return true for prompts that try to bypass evidence or governance checks."""

    return bool(BYPASS_REQUEST_RE.search(text or ""))


def bypass_refusal_content(text: str = BYPASS_REFUSAL_TEXT) -> Any:
    """Build a GenAI Content response when google-genai is available."""

    try:
        from google.genai import types as genai_types

        return genai_types.Content(
            role="model",
            parts=[genai_types.Part(text=text)],
        )
    except Exception:
        return {"role": "model", "parts": [{"text": text}]}


async def initialize_workflow_state(
    callback_context: Any,
    *,
    config: WorkflowCallbackConfig,
) -> Any | None:
    """Initialize callback state from a ``WorkflowCallbackConfig``."""

    initialize_workflow_state_value(callback_context.state, config)
    if is_bypass_request(content_text(getattr(callback_context, "user_content", None))):
        callback_context.state["bypass_request_refused"] = True
        return bypass_refusal_content()
    return None


def make_initialize_workflow_state(config: WorkflowCallbackConfig):
    """Return an ADK ``before_agent_callback`` bound to ``config``."""

    async def _initialize_workflow_state(callback_context: Any) -> Any | None:
        return await initialize_workflow_state(callback_context, config=config)

    return _initialize_workflow_state


def missing_tool_inputs(
    args: Mapping[str, Any],
    required: Sequence[str],
) -> list[str]:
    """Return missing required inputs plus any blank input present in args."""

    missing = [key for key in required if args.get(key) in EMPTY_ARGUMENT_VALUES]
    missing.extend(
        key
        for key, value in args.items()
        if value in EMPTY_ARGUMENT_VALUES and key not in missing
    )
    return missing


async def enforce_tool_contract(
    tool: Any = None,
    args: dict[str, Any] | None = None,
    tool_context: Any = None,
    *,
    config: WorkflowCallbackConfig,
    **kwargs: Any,
) -> dict[str, Any] | None:
    """Block unsafe write-like tool calls before they can mutate external state."""

    del kwargs
    args = args or {}
    tool_name = tool_name_for(tool)
    state = getattr(tool_context, "state", {}) or {}
    if state.get("bypass_request_refused"):
        return {
            "error": "bypass_request_refused",
            "tool": tool_name,
            "escalation": "refuse",
            "rationale": BYPASS_REFUSAL_TEXT,
        }
    if tool_name not in set(config.write_tools):
        return None

    required = config.required_inputs_by_tool.get(tool_name, ())
    missing = missing_tool_inputs(args, required)
    idempotency = args.get("idempotency_key") or args.get("idempotencyKey")
    if missing:
        return {
            "error": "missing_required_inputs",
            "missing": missing,
            "tool": tool_name,
            "escalation": "request_more_info",
        }
    if ("idempotency_key" in args or "idempotencyKey" in args) and not idempotency:
        return {
            "error": "missing_idempotency_key",
            "tool": tool_name,
            "escalation": "request_confirmation",
        }

    min_systems = config.evidence_min_systems_by_tool.get(tool_name, 0)
    required_systems = {
        normalize_source_system(system)
        for system in config.evidence_required_systems_by_tool.get(tool_name, ())
    }
    if min_systems or required_systems:
        evidence_log = state.get("evidence_log", [])
        systems = source_systems_from_evidence(evidence_log)
        evidence_record_ids = record_ids_from_evidence(evidence_log)
        target_id = args.get("target_id") or args.get("targetId")
        if target_id and evidence_record_ids and str(target_id) not in evidence_record_ids:
            return {
                "error": "target_not_in_evidence",
                "tool": tool_name,
                "target_id": str(target_id),
                "known_record_ids": sorted(evidence_record_ids)[:25],
                "escalation": "request_more_info",
                "rationale": "The write-like tool target must come from a non-empty source result retrieved in this session.",
            }
        missing_systems = sorted(required_systems - systems)
        if missing_systems:
            return {
                "error": "insufficient_required_evidence",
                "tool": tool_name,
                "required_source_systems": sorted(required_systems),
                "missing_source_systems": missing_systems,
                "actual_source_systems": sorted(systems),
                "escalation": "refuse",
                "rationale": (
                    "Required source-system evidence is missing before this "
                    "write-like tool can run."
                ),
            }
        if len(systems) < min_systems:
            return {
                "error": "insufficient_evidence",
                "tool": tool_name,
                "required_source_systems": min_systems,
                "actual_source_systems": sorted(systems),
                "escalation": "refuse",
                "rationale": (
                    "Single-system evidence is insufficient to authorize external "
                    "state changes without manual review."
                ),
            }
    return None


def make_enforce_tool_contract(config: WorkflowCallbackConfig):
    """Return an ADK ``before_tool_callback`` bound to ``config``."""

    async def _enforce_tool_contract(
        tool: Any = None,
        args: dict[str, Any] | None = None,
        tool_context: Any = None,
        **kwargs: Any,
    ) -> dict[str, Any] | None:
        return await enforce_tool_contract(
            tool=tool,
            args=args,
            tool_context=tool_context,
            config=config,
            **kwargs,
        )

    return _enforce_tool_contract


async def capture_tool_evidence(
    tool: Any = None,
    args: dict[str, Any] | None = None,
    tool_context: Any = None,
    tool_response: Any = None,
    **kwargs: Any,
) -> dict[str, Any] | None:
    """Record source evidence and audit trails without changing the tool result."""

    del args
    result = tool_response if tool_response is not None else kwargs.get("result")
    state = getattr(tool_context, "state", None)
    if state is None:
        return None
    record_tool_evidence(state, tool, result)
    return None
