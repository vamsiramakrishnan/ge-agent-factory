import json

from generated_agent_runtime.action_events import (
    action_events_path,
    append_action_event,
    build_action_submission_result,
    deterministic_id,
    missing_required_inputs,
)


def test_deterministic_id_is_stable():
    assert deterministic_id("A", "tool", "target") == deterministic_id("A", "tool", "target")
    assert deterministic_id("A") == "A-EMPTY00000"


def test_action_events_path_prefers_env(tmp_path):
    configured = tmp_path / "events.jsonl"
    assert action_events_path(env={"ACTION_EVENTS_PATH": str(configured)}) == configured


def test_append_action_event_writes_jsonl(tmp_path):
    path = tmp_path / "events.jsonl"
    append_action_event("submit", {"status": "ok"}, path=path)
    assert json.loads(path.read_text()) == {"tool": "submit", "status": "ok"}


def test_missing_required_inputs_detects_blank_values():
    assert missing_required_inputs({"a": "", "b": None, "c": 0}) == ["a", "b"]


def test_build_action_submission_result_contains_audit_fields():
    result = build_action_submission_result(
        tool_name="submit_case",
        source_system_id="workday",
        target_id="W1",
        rationale="approved",
    )
    assert result["tool_kind"] == "action"
    assert result["action_id"].startswith("ACTION_I-")
    assert "submit_case" in result["audit_trail"]
