from __future__ import annotations

import uuid
from typing import Any, Callable

from simulator_runtime.state_store import StateStore


# Async jobs are persisted as rows in a reserved collection inside the per-state
# document, exactly like any other entity list (so they survive across calls and
# live wherever the system's StateStore lives). A job row is a small dict:
#   {"job_id", "status", "tool", "args", "result", "error", "created_action"}
# Status lifecycle: queued -> running -> succeeded | failed.
ASYNC_JOBS_COLLECTION = "async_jobs"

QUEUED = "queued"
RUNNING = "running"
SUCCEEDED = "succeeded"
FAILED = "failed"

# Default number of poll calls a job stays in `running` before it resolves. This
# keeps the simulator deterministic (no wall-clock dependence) while still modelling
# an async lifecycle a client must poll. A value of 0 resolves on the first poll.
DEFAULT_RUNNING_POLLS = 1


def _new_job_id() -> str:
    return f"job-{uuid.uuid4().hex[:12]}"


def _jobs(state: dict[str, Any]) -> list[dict[str, Any]]:
    return state.setdefault(ASYNC_JOBS_COLLECTION, [])


def _find_job(state: dict[str, Any], job_id: str) -> dict[str, Any] | None:
    return next((job for job in _jobs(state) if job.get("job_id") == job_id), None)


def submit_job(
    state: dict[str, Any],
    *,
    tool: str,
    args: dict[str, Any] | None = None,
    running_polls: int = DEFAULT_RUNNING_POLLS,
) -> dict[str, Any]:
    """Enqueue an async job into ``state`` and return ``{job_id, status:queued}``.

    The caller (a handler) is responsible for persisting ``state`` through the
    StateStore afterwards, mirroring how every other generic handler works.
    """
    job = {
        "job_id": _new_job_id(),
        "status": QUEUED,
        "tool": tool,
        "args": dict(args or {}),
        "result": None,
        "error": None,
        "_polls_remaining": max(0, int(running_polls)),
    }
    _jobs(state).append(job)
    return {"job_id": job["job_id"], "status": QUEUED}


def poll_job(
    state: dict[str, Any],
    job_id: str,
    *,
    runner: Callable[[dict[str, Any]], dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Advance and return the status of ``job_id``.

    Each poll advances the lifecycle deterministically: ``queued``/``running`` count
    down ``_polls_remaining``; once it reaches zero the optional ``runner`` is invoked
    to produce the result (``succeeded``) or, if it raises, the job is marked
    ``failed`` with the error message. Without a ``runner`` the job simply succeeds
    with an empty result. Polling an unknown job returns ``status: not_found``.
    """
    job = _find_job(state, job_id)
    if job is None:
        return {"job_id": job_id, "status": "not_found", "result": None, "error": None}
    if job["status"] in (SUCCEEDED, FAILED):
        return _public(job)

    remaining = int(job.get("_polls_remaining", 0))
    if remaining > 0:
        job["_polls_remaining"] = remaining - 1
        job["status"] = RUNNING
        return _public(job)

    # Resolve now.
    if runner is None:
        job["status"] = SUCCEEDED
        job["result"] = job.get("result") or {}
    else:
        try:
            job["result"] = runner(job)
            job["status"] = SUCCEEDED
        except Exception as exc:  # noqa: BLE001 - any runner failure marks the job failed
            job["status"] = FAILED
            job["error"] = {"code": getattr(exc, "code", "error"), "message": str(exc)}
    return _public(job)


def _public(job: dict[str, Any]) -> dict[str, Any]:
    """The client-visible view of a job (drops internal bookkeeping fields)."""
    return {
        "job_id": job["job_id"],
        "status": job["status"],
        "tool": job.get("tool"),
        "result": job.get("result"),
        "error": job.get("error"),
    }


def build_async_handlers(
    contract: dict[str, Any],
    *,
    state_loader: Callable[[Any], dict[str, Any]],
    state_saver: Callable[[Any, dict[str, Any]], None],
) -> dict[str, Callable[[Any, dict[str, Any]], dict[str, Any]]]:
    """Build a generic ``poll_async_job`` handler if the system declares the tool.

    Submission of async jobs is wired into the existing submit handlers (a transition
    may declare ``async: true``); this only adds the standalone poll tool. The
    ``state_loader``/``state_saver`` are injected so this module never imports
    ``generic`` (avoiding the generic⇄simulators import cycle).
    """
    handlers: dict[str, Callable[[Any, dict[str, Any]], dict[str, Any]]] = {}
    tool_names = {t.get("name", "") for t in contract.get("toolCatalog", {}).get("tools", [])}
    poll_name = "poll_async_job"
    if poll_name in tool_names:
        def handler(ctx, args: dict[str, Any]) -> dict[str, Any]:
            state = state_loader(ctx)
            job_id = str(args.get("job_id") or "")
            result = poll_job(state, job_id)
            state_saver(ctx, state)
            return result

        handlers[poll_name] = handler
    return handlers
