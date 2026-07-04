from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import replay, simulators  # noqa: E402
from simulator_runtime.context import build_context  # noqa: E402
from simulator_runtime.replay import RECORD_DIR_ENV, REPLAY_DIR_ENV, args_fingerprint  # noqa: E402
from simulator_runtime.router import execute_simulator_tool  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]
CORPUS = REPO_ROOT / "apps" / "factory" / "simulator-systems"


def _tool(name: str) -> dict:
    return {"name": name, "simulator": {"system_id": "workday", "tool": name}}


@pytest.fixture(autouse=True)
def _replay_session(monkeypatch):
    # Pin the corpus (same one the search-upward default finds from the repo root)
    # so these tests run regardless of cwd, and start each test with both modes
    # off and a fresh replay session.
    monkeypatch.setenv("GE_SIMULATOR_SYSTEMS_DIR", str(CORPUS))
    monkeypatch.delenv(RECORD_DIR_ENV, raising=False)
    monkeypatch.delenv(REPLAY_DIR_ENV, raising=False)
    replay.reset()
    yield
    replay.reset()


# --- fingerprinting --------------------------------------------------------------


def test_fingerprint_is_canonical_and_ignores_volatile_keys():
    base = args_fingerprint("submit_worker_change", {"worker_id": "W-1001", "change_type": "transfer"})
    reordered = args_fingerprint("submit_worker_change", {"change_type": "transfer", "worker_id": "W-1001"})
    with_volatile = args_fingerprint(
        "submit_worker_change",
        {"worker_id": "W-1001", "change_type": "transfer", "idempotency_key": "abc-123"},
    )
    assert base == reordered == with_volatile
    assert base != args_fingerprint("submit_worker_change", {"worker_id": "W-1002", "change_type": "transfer"})
    assert base != args_fingerprint("get_worker", {"worker_id": "W-1001", "change_type": "transfer"})


# --- default (neither env): zero change, zero file IO ----------------------------


def test_default_mode_never_touches_cassette_io(monkeypatch):
    monkeypatch.setattr(
        replay, "_cassette_path", lambda *a, **k: pytest.fail("cassette IO attempted with envs unset")
    )
    result = execute_simulator_tool("agent-replay-off", _tool("search_workers"), {"query": "avery"})
    assert result["status"] == "ok"
    assert "replayed" not in result


# --- record mode ------------------------------------------------------------------


def test_record_writes_human_readable_jsonl(tmp_path, monkeypatch):
    cassette_dir = tmp_path / "cassettes"  # does not exist yet — record mode creates it
    monkeypatch.setenv(RECORD_DIR_ENV, str(cassette_dir))
    agent = "agent-replay-rec"

    execute_simulator_tool(agent, _tool("search_workers"), {"query": "avery"})
    execute_simulator_tool(agent, _tool("list_audit_events"), {})
    execute_simulator_tool(agent, _tool("get_worker"), {"worker_id": "W-NOPE"})  # error envelope

    path = cassette_dir / f"{agent}__workday.jsonl"
    assert path.is_file()
    lines = path.read_text("utf-8").splitlines()
    assert len(lines) == 3
    for line in lines:
        assert line.startswith('{"args_fingerprint"')  # sort_keys ⇒ stable field order
        entry = json.loads(line)
        assert set(entry) == {"args_fingerprint", "envelope", "key", "tool"}
        assert entry["key"] == f"{agent}:workday:default"
    assert json.loads(lines[2])["envelope"]["status"] == "error"


# --- replay mode -------------------------------------------------------------------


def test_replay_returns_recorded_envelopes_in_recorded_order(tmp_path, monkeypatch):
    agent = "agent-replay-play"
    monkeypatch.setenv(RECORD_DIR_ENV, str(tmp_path))
    recorded = [
        execute_simulator_tool(agent, _tool("list_audit_events"), {}),
        execute_simulator_tool(agent, _tool("search_workers"), {"query": "avery"}),
        execute_simulator_tool(agent, _tool("list_audit_events"), {}),  # differs: trail grew
        execute_simulator_tool(agent, _tool("get_worker"), {"worker_id": "W-NOPE"}),  # error
    ]
    assert recorded[0] != recorded[2], "the two identical calls must have distinct envelopes"

    monkeypatch.delenv(RECORD_DIR_ENV)
    monkeypatch.setenv(REPLAY_DIR_ENV, str(tmp_path))
    replay.reset()

    # Identical calls consume recorded matches in order: 1st ⇒ recorded[0], 2nd ⇒ recorded[2].
    first = execute_simulator_tool(agent, _tool("list_audit_events"), {})
    second = execute_simulator_tool(agent, _tool("list_audit_events"), {})
    searched = execute_simulator_tool(agent, _tool("search_workers"), {"query": "avery"})
    errored = execute_simulator_tool(agent, _tool("get_worker"), {"worker_id": "W-NOPE"})
    for replayed_env, recorded_env in ((first, recorded[0]), (second, recorded[2]), (searched, recorded[1]), (errored, recorded[3])):
        assert replayed_env.pop("replayed") is True
        assert replayed_env == recorded_env
    assert errored["status"] == "error"  # error envelopes replay too


def test_replay_miss_falls_through_to_live_execution(tmp_path, monkeypatch):
    agent = "agent-replay-miss"
    monkeypatch.setenv(RECORD_DIR_ENV, str(tmp_path))
    execute_simulator_tool(agent, _tool("search_workers"), {"query": "avery"})

    monkeypatch.delenv(RECORD_DIR_ENV)
    monkeypatch.setenv(REPLAY_DIR_ENV, str(tmp_path))
    replay.reset()

    # Unrecorded call ⇒ live execution, no error, no replayed flag.
    live = execute_simulator_tool(agent, _tool("get_worker"), {"worker_id": "W-1001"})
    assert live["status"] == "ok"
    assert "replayed" not in live

    # A replay dir that does not even exist behaves the same (documented: never errors).
    monkeypatch.setenv(REPLAY_DIR_ENV, str(tmp_path / "nowhere"))
    replay.reset()
    live_again = execute_simulator_tool(agent, _tool("search_workers"), {"query": "avery"})
    assert live_again["status"] == "ok"
    assert "replayed" not in live_again


def test_replay_hit_still_advances_simulator_state(tmp_path, monkeypatch):
    """A replay hit must leave the same state a live call would.

    The router executes the handler even on a hit (discarding its result), so a
    later cassette miss runs against the state the replayed calls implied — not
    the untouched seed. Regression test for the PR #33 review finding.
    """
    agent = "agent-replay-state"
    monkeypatch.setenv(RECORD_DIR_ENV, str(tmp_path))
    recorded = execute_simulator_tool(
        agent, _tool("submit_worker_change"), {"worker_id": "W-1001", "change_type": "location_change"}
    )
    process_id = recorded["data"]["business_process_id"]

    # A fresh run of the same (agent, system, scenario): wipe the state the
    # recording built up, as a new process would start from the seed.
    ctx = build_context(agent, "workday", {})
    simulators.STATE.pop(simulators._state_key(ctx), None)

    monkeypatch.delenv(RECORD_DIR_ENV)
    monkeypatch.setenv(REPLAY_DIR_ENV, str(tmp_path))
    replay.reset()

    replayed = execute_simulator_tool(
        agent, _tool("submit_worker_change"), {"worker_id": "W-1001", "change_type": "location_change"}
    )
    assert replayed.get("replayed") is True
    assert replayed["data"]["business_process_id"] == process_id

    # Unrecorded follow-up (cassette miss ⇒ live) must see the replayed write:
    # without handler execution on hits this would 404 against the seed.
    live = execute_simulator_tool(agent, _tool("get_business_process"), {"business_process_id": process_id})
    assert "replayed" not in live
    assert live["status"] == "ok"
    assert live["data"]["business_process"]["business_process_id"] == process_id


def test_replay_exhausted_matches_fall_through_live(tmp_path, monkeypatch):
    agent = "agent-replay-exhaust"
    monkeypatch.setenv(RECORD_DIR_ENV, str(tmp_path))
    execute_simulator_tool(agent, _tool("list_audit_events"), {})  # recorded exactly once

    monkeypatch.delenv(RECORD_DIR_ENV)
    monkeypatch.setenv(REPLAY_DIR_ENV, str(tmp_path))
    replay.reset()

    first = execute_simulator_tool(agent, _tool("list_audit_events"), {})
    assert first.get("replayed") is True
    second = execute_simulator_tool(agent, _tool("list_audit_events"), {})
    assert "replayed" not in second  # cassette consumed ⇒ live
    assert second["status"] == "ok"
