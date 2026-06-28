#!/usr/bin/env python3
"""Unit tests for the pure helpers in antigravity-sdk-agent.py.

These exercise the logic that does NOT require the google-antigravity SDK (which
is imported lazily inside main()), so they run anywhere. Runnable directly
(`python3 test_antigravity_sdk_agent.py`) or via pytest.
"""
import importlib.util
import os
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "agy_agent_under_test", Path(__file__).with_name("antigravity-sdk-agent.py")
)
agy = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agy)


class _FakeBuiltins:
    DELETE_FILE = "delete_file"
    EDIT_FILE = "edit_file"
    GENERATE_IMAGE = "generate_image"


class _FakeTypes:
    BuiltinTools = _FakeBuiltins


def test_recovery_hint_policy_denied():
    hint = agy.tool_error_recovery_hint(PermissionError("write denied by policy"))
    assert hint is not None and "Do not retry" in hint


def test_recovery_hint_file_not_found():
    hint = agy.tool_error_recovery_hint(FileNotFoundError("No such file: x"))
    assert hint is not None and "Path not found" in hint


def test_recovery_hint_value_error():
    hint = agy.tool_error_recovery_hint(ValueError("bad argument shape"))
    assert hint is not None and "ValueError" in hint


def test_recovery_hint_unknown_returns_none():
    assert agy.tool_error_recovery_hint(RuntimeError("mystery")) is None


def test_recovery_hint_opt_out(monkeypatch=None):
    os.environ["GE_HARNESS_NO_TOOL_ERROR_RECOVERY"] = "1"
    try:
        assert agy.tool_error_recovery_hint(ValueError("x")) is None
    finally:
        del os.environ["GE_HARNESS_NO_TOOL_ERROR_RECOVERY"]


def test_resolve_disabled_tools_skips_unknown():
    resolved = agy.resolve_disabled_tools(["DELETE_FILE", "NOPE", "generate_image"], _FakeTypes)
    assert resolved == ["delete_file", "generate_image"]


def test_protect_pred_matches_basename():
    pred = agy._make_protect_pred("tools.py")
    assert pred({"path": "/ws/app/tools.py"}) is True
    assert pred({"absolute_path": "/ws/app/agent.py"}) is False
    assert pred("not-a-dict") is False


if __name__ == "__main__":
    passed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            passed += 1
    print(f"ok - {passed} passed")
