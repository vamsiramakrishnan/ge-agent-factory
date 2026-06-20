from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime import async_jobs  # noqa: E402
from simulator_runtime.async_jobs import (  # noqa: E402
    FAILED,
    QUEUED,
    RUNNING,
    SUCCEEDED,
    build_async_handlers,
    poll_job,
    submit_job,
)


def _ctx(system_id: str = "__async_test__"):
    return SimpleNamespace(
        agent_id="agent-async",
        system_id=system_id,
        scenario_id="scn-async",
        actor="x@example.com",
        role="hr_partner",
    )


# --- submit / poll lifecycle -------------------------------------------------


def test_submit_returns_queued_and_records_job():
    state: dict = {}
    out = submit_job(state, tool="submit_worker_update", args={"worker_id": "W-1"})
    assert out["status"] == QUEUED
    assert out["job_id"].startswith("job-")
    jobs = state[async_jobs.ASYNC_JOBS_COLLECTION]
    assert len(jobs) == 1 and jobs[0]["tool"] == "submit_worker_update"


def test_poll_advances_running_then_succeeds():
    state: dict = {}
    job_id = submit_job(state, tool="t", running_polls=1)["job_id"]
    first = poll_job(state, job_id)
    assert first["status"] == RUNNING
    second = poll_job(state, job_id)
    assert second["status"] == SUCCEEDED
    assert second["result"] == {}


def test_poll_resolves_immediately_when_no_running_polls():
    state: dict = {}
    job_id = submit_job(state, tool="t", running_polls=0)["job_id"]
    assert poll_job(state, job_id)["status"] == SUCCEEDED


def test_poll_runs_runner_and_captures_result():
    state: dict = {}
    job_id = submit_job(state, tool="t", running_polls=0)["job_id"]

    def runner(job):
        return {"applied": job["tool"], "ok": True}

    out = poll_job(state, job_id, runner=runner)
    assert out["status"] == SUCCEEDED
    assert out["result"] == {"applied": "t", "ok": True}


def test_poll_marks_failed_when_runner_raises():
    state: dict = {}
    job_id = submit_job(state, tool="t", running_polls=0)["job_id"]

    def runner(job):
        raise RuntimeError("boom")

    out = poll_job(state, job_id, runner=runner)
    assert out["status"] == FAILED
    assert out["error"]["message"] == "boom"


def test_poll_is_terminal_after_success():
    state: dict = {}
    job_id = submit_job(state, tool="t", running_polls=0)["job_id"]
    poll_job(state, job_id)
    # Polling again must not re-run / re-advance.
    assert poll_job(state, job_id)["status"] == SUCCEEDED


def test_poll_unknown_job_returns_not_found():
    assert poll_job({}, "job-missing")["status"] == "not_found"


def test_public_view_omits_internal_fields():
    state: dict = {}
    job_id = submit_job(state, tool="t", running_polls=0)["job_id"]
    out = poll_job(state, job_id)
    assert "_polls_remaining" not in out


# --- generic poll handler wiring (memory store) ------------------------------


def test_build_async_handlers_only_when_tool_declared():
    no_tool = {"toolCatalog": {"tools": [{"name": "search_workers"}]}}
    assert build_async_handlers(no_tool, state_loader=lambda c: {}, state_saver=lambda c, s: None) == {}

    with_tool = {"toolCatalog": {"tools": [{"name": "poll_async_job"}]}}
    handlers = build_async_handlers(with_tool, state_loader=lambda c: {}, state_saver=lambda c, s: None)
    assert "poll_async_job" in handlers


def test_poll_handler_round_trips_through_injected_state():
    backing = {"jobs": {}}

    def loader(ctx):
        return backing["jobs"]

    saved = {"n": 0}

    def saver(ctx, state):
        saved["n"] += 1

    # Pre-seed a queued job in the shared state dict.
    submit_job(backing["jobs"], tool="t", running_polls=0)
    job_id = backing["jobs"][async_jobs.ASYNC_JOBS_COLLECTION][0]["job_id"]

    contract = {"toolCatalog": {"tools": [{"name": "poll_async_job"}]}}
    handler = build_async_handlers(contract, state_loader=loader, state_saver=saver)["poll_async_job"]
    out = handler(_ctx(), {"job_id": job_id})
    assert out["status"] == SUCCEEDED
    assert saved["n"] == 1


# --- end-to-end through generic submit handler (async transition) -------------


def test_async_submit_via_generic_enqueues_job():
    from simulator_runtime import generic

    contract = {
        "schema": {"collections": {"workers": {"primaryKey": "worker_id", "fields": {"status": {}}}}},
        "toolCatalog": {"tools": [{"name": "submit_worker_update", "inputSchema": {"properties": {}}}]},
        "workflowCatalog": {
            "toolHandlers": {
                "submit_worker_update": {
                    "collection": "workers",
                    "primaryKey": "worker_id",
                    "stateField": "status",
                    "targetStateArg": "status",
                    "async": True,
                    "transitions": {"*": ["on_leave"]},
                }
            }
        },
    }
    handlers = generic.build_generic_handlers(contract)
    ctx = _ctx(system_id="__async_e2e__")
    # Seed a worker directly into the memory-backed state.
    state = generic.generic_state(ctx)
    state["workers"] = [{"worker_id": "W-1", "status": "active"}]
    generic._save_state(ctx, state)

    out = handlers["submit_worker_update"](ctx, {"worker_id": "W-1", "status": "on_leave"})
    assert out["status"] == QUEUED
    # Worker unchanged until the job resolves; the synchronous transition was deferred.
    state2 = generic.generic_state(ctx)
    assert state2["workers"][0]["status"] == "active"
    assert state2[async_jobs.ASYNC_JOBS_COLLECTION][0]["status"] == QUEUED
