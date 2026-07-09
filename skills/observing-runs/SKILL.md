---
name: observing-runs
description: Observes factory and cloud runs without babysitting a terminal — polling submitted run status, fetching a stage's result/errors, tracking an agent's lifecycle state, reading eval coverage, and reading platform readiness. Use when a long-running build or release was submitted (especially a detached, laptop-closable local run), when checking whether a run is healthy, when an agent's lifecycle state is unclear, or before triaging a run that looks stuck.
composes: [triaging-runs, recording-evidence]
---

# Observing Runs

Use this skill whenever work is running somewhere other than the current terminal — a detached local build, a submitted cloud run, or a compiled eval suite — and the question is "is it healthy, and what's the state?"

In plain language: anything long-running in this factory is a run, and runs are durable — they persist their status and event log on disk (or in the cloud ledger) whether or not the process that started them is still attached. This skill is the read-only observation layer over that: poll status, pull a stage's logs, check one agent's registered lifecycle state, read eval coverage, and confirm platform readiness — never guess from a spinner.

## Assembly-Line Slot

- **First step:** identify what's being observed — a submitted cloud run (`status`), one stage's result (`logs`), one agent's lifecycle (`agents.track`), a compiled/imported evalset's coverage (`evals.coverage`), or overall factory readiness (`doctor`).
- **Plays a role in:** every station that produces a background run — `running-factory` (detached local builds, remote submissions), `running-release` (handoff/publish stages), `driving-live-proof` (compiled evalsets) — as the shared read-only status surface over all of them.
- **Input:** a run id (from a prior submission or `ge agents status`), an agent id, or an evalset id.
- **Output:** a stage tally / run status, a stage's result JSON (errors, exit codes, build log URL), an agent's provenance + variant lineage, a coverage report (required/covered/gaps), or a doctor report.
- **Next step:** a healthy run needs nothing further; a stuck or failed one hands to `triaging-runs` with the first real failure; a repeated defect hands to `recording-evidence`.

## Workflow

1. For a detached local run (`ge agents build --local --detach`, "close-your-laptop"), or any long factory work, use `ge daemon start` first if the local runtime daemon isn't already up.
2. Poll cloud-submitted runs with `status` — it reports the stage tally per run, not per-item detail.
3. Pull one stage's result with `logs` when the tally shows a failure — it returns the actual errors and exit code, not just pass/fail.
4. For a single agent's lifecycle (draft vs. registered vs. promoted, registry presence, variant lineage back to its base), use `agents.track` rather than re-deriving it from the OKF bundle by hand.
5. For eval readiness, read `evals.coverage` before assuming a compiled/imported suite is complete — it reports per-dimension required/covered/gaps, not just a pass/fail.
6. For "is the platform itself healthy" (as opposed to one run), read `doctor` — it's the same structured check every other station consults before mutating cloud state.
7. Anything genuinely stuck or failed — not just "still running" — hands to `triaging-runs`, which reads the first real failure from the same event timeline this skill observes.

## Commands

```bash
bun tools/ge.mjs daemon start                      # ensure the local runtime is up before detaching work
bun tools/ge.mjs agents build --local --detach --ids <id>   # submit, return a run id immediately

bun tools/ge.mjs agents status --watch              # poll submitted cloud runs until terminal
bun tools/ge.mjs agents logs <runId> --stage <stage> # a stage's result JSON (errors, exit code, log URL)
bun tools/ge.mjs agents track --id <agent-id>        # one agent's provenance + variant lineage
bun tools/ge.mjs evals coverage --id <evalset-id>    # per-dimension required/covered/gaps
bun tools/ge.mjs doctor                              # factory/cloud plane readiness

# lower-level run primitives (background task + event timeline, not yet
# wired into the shared command registry — CLI-only today):
bun tools/ge.mjs runs list
bun tools/ge.mjs runs events <runId> --follow
bun tools/ge.mjs runs replay <runId>
```

## Common mistakes

- Reading `status`'s stage tally as per-item detail — it's a rollup; use `logs` for one item's actual result.
- Treating "still running" as unhealthy and re-submitting — durable runs survive a closed terminal by design; observe before you re-run.
- Skipping `evals.coverage` and assuming a compiled suite covers every required dimension — gaps are enumerated, not implied by a passing compile.
- Diagnosing a stuck run here instead of handing it to `triaging-runs` — this skill observes; it doesn't classify or recover.

## Done when

The run's actual state (not an assumption) is known — terminal and healthy, terminal and failed (handed to `triaging-runs` with the first-failure detail), or genuinely still in progress and safe to leave running.

## References

- Worked example: `references/example-session.md` — observing a detached run
  through status, events, and first-failure detail.
- Reference: `docs/reference/agent-operability.md` — the operability contract this skill implements: position/next, background runs, event streaming and replay, resume.
- Reference: `docs/reference/cli.md` — full flag tables for `ge agents status/logs/track`, `ge evals coverage`, `ge doctor`, and `ge runs`.
