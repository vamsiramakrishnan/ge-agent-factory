from types import SimpleNamespace
import asyncio

from generated_agent_runtime.callbacks import (
    WorkflowCallbackConfig,
    capture_tool_evidence,
    enforce_tool_contract,
    make_enforce_tool_contract,
    make_initialize_workflow_state,
)


def test_initialize_workflow_state_factory_sets_defaults():
    config = WorkflowCallbackConfig(
        scenario_id="scenario-1",
        primary_objective="objective",
        expected_tools=("lookup",),
    )
    context = SimpleNamespace(state={})
    asyncio.run(make_initialize_workflow_state(config)(context))
    assert context.state["scenario_id"] == "scenario-1"
    assert context.state["expected_tools"] == ["lookup"]
    assert context.state["evidence_log"] == []


def test_non_write_tool_is_allowed():
    config = WorkflowCallbackConfig("s", "o", write_tools=("submit",))
    assert asyncio.run(enforce_tool_contract("lookup", {}, None, config=config)) is None


def test_write_tool_missing_inputs_is_blocked():
    config = WorkflowCallbackConfig(
        "s",
        "o",
        write_tools=("submit",),
        required_inputs_by_tool={"submit": ("target_id", "rationale")},
    )
    result = asyncio.run(make_enforce_tool_contract(config)("submit", {"target_id": ""}, None))
    assert result["error"] == "missing_required_inputs"
    assert "target_id" in result["missing"]
    assert "rationale" in result["missing"]


def test_write_tool_requires_minimum_evidence_systems():
    config = WorkflowCallbackConfig(
        "s",
        "o",
        write_tools=("submit",),
        evidence_min_systems_by_tool={"submit": 2},
    )
    context = SimpleNamespace(state={"evidence_log": [{"source_system": "Workday"}]})
    result = asyncio.run(enforce_tool_contract("submit", {"target_id": "T"}, context, config=config))
    assert result["error"] == "insufficient_evidence"
    assert result["actual_source_systems"] == ["workday"]


def test_write_tool_allows_enough_evidence():
    config = WorkflowCallbackConfig(
        "s",
        "o",
        write_tools=("submit",),
        evidence_min_systems_by_tool={"submit": 2},
    )
    context = SimpleNamespace(
        state={"evidence_log": [{"source_system": "Workday"}, {"source_system_id": "Service_Now"}]}
    )
    assert asyncio.run(enforce_tool_contract("submit", {"target_id": "T"}, context, config=config)) is None


def test_capture_tool_evidence_records_dict_results():
    context = SimpleNamespace(state={})
    asyncio.run(
        capture_tool_evidence(
            "lookup",
            tool_context=context,
            tool_response={
                "source_system_id": "workday",
                "evidence": ["row"],
                "audit_trail": "lookup()",
            },
        )
    )
    assert context.state["evidence_log"][0]["source_system"] == "workday"
    assert context.state["audit_trails"] == ["lookup()"]
