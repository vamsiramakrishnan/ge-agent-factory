"""ADK-compatible callbacks for generated agents.

This module does not import Google ADK. The callbacks use duck-typed ``state`` objects
so they remain importable and unit-testable without ADK installed.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

from generated_agent_runtime.evidence import (
    record_tool_evidence,
    source_systems_from_evidence,
    tool_name_for,
)

EMPTY_ARGUMENT_VALUES = ("", None)


@dataclass(frozen=True)
class WorkflowCallbackConfig:
    """Static generated-agent metadata used by callback factories."""

    scenario_id: str
    primary_objective: str
    expected_tools: Sequence[str] = field(default_factory=tuple)
    write_tools: Sequence[str] = field(default_factory=tuple)
    required_inputs_by_tool: Mapping[str, Sequence[str]] = field(default_factory=dict)
    evidence_min_systems_by_tool: Mapping[str, int] = field(default_factory=dict)


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


async def initialize_workflow_state(
    callback_context: Any,
    *,
    config: WorkflowCallbackConfig,
) -> None:
    """Initialize callback state from a ``WorkflowCallbackConfig``."""

    initialize_workflow_state_value(callback_context.state, config)


def make_initialize_workflow_state(config: WorkflowCallbackConfig):
    """Return an ADK ``before_agent_callback`` bound to ``config``."""

    async def _initialize_workflow_state(callback_context: Any) -> None:
        await initialize_workflow_state(callback_context, config=config)

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
    if min_systems:
        state = getattr(tool_context, "state", {}) or {}
        evidence_log = state.get("evidence_log", [])
        systems = source_systems_from_evidence(evidence_log)
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
