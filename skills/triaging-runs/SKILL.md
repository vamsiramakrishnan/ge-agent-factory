---
name: triaging-runs
description: Diagnoses a stuck, blocked, or failed factory run from its event timeline and blockers, then decides resume vs re-run vs upstream fix vs escalate. Use when a run is blocked/failed, a stage errored, a build/deploy didn't produce its artifact, or the operator must recover a run.
---

# Triaging Runs

Use this skill when a run isn't progressing and the operator must decide how to recover it — the diagnosis-and-recovery counterpart to the station skills.

In plain language: read the run's actual events and blockers, find the first real failure (not the downstream noise), classify it, then pick the cheapest correct recovery. Don't blindly re-run; don't escalate what a resume would fix.

## Assembly-Line Slot

- **First step:** pull the run's event timeline + blockers + last artifact — read the FIRST failure, not the last log line.
- **Plays a role in:** recovery for any station (build, data, release, deploy).
- **Input:** a run/task id and its events/artifacts.
- **Output:** a recovery decision (resume / re-run / upstream fix / escalate) + the reason.
- **Next step:** execute the recovery via the owning station skill, or escalate with evidence.

## Decision rule

| Signal in the events/blockers | Recovery |
|---|---|
| Transient (timeout, rate limit, daemon blip) + safe-to-resume | resume |
| Bad/missing input from an earlier station (spec gap, missing data) | upstream fix in that station, then re-run |
| Readiness/plane blocker | hand to `standing-up-the-platform` |
| Deterministic code/config error in the stage | fix the cause, then re-run (resume won't help) |
| Exact, scoped, reversible partial canary resource | inspect it, guard the cleanup, remove/recover only that resource, then replay from the proven package |
| Irreversible side-effect already partially applied, or ambiguous | escalate (see `guarding-the-factory`) |

## Workflow

1. Read the run via the console run stream / events API (don't infer from the spinner).
2. Locate the first failing stage and its first actionable blocker. A warning
   whose fallback succeeds (for example old-template smart merge) is context,
   not the root cause; prefer the concrete permission/API error emitted later.
3. Classify per the table; prefer the cheapest correct recovery (resume < re-run < upstream fix < escalate).
4. If the stage can create resources before failing, inspect exact resource ids
   before retrying. Consult `guarding-the-factory` before any cleanup, and never
   use a broad prefix/name sweep.
5. Execute through the owning station skill; re-observe to confirm it actually cleared.
6. Record the failure + recovery via `recording-evidence` so repeat failures are visible.

## Common mistakes

- Reading the last log line instead of the first failure (you fix the symptom, not the cause).
- Re-running a deterministic failure (same input → same failure) instead of fixing the cause.
- Assuming a failed deploy created nothing, then leaking an identity-only
  runtime on every retry.
- Escalating a known, canary-scoped, reversible partial resource without first
  inspecting it and proposing an exact guarded recovery.
- Resuming an ambiguous or irreversible half-applied operation.

## Done when

The run reaches its terminal artifact after recovery, or it's escalated with the first-failure evidence and a recommended fix.

## References

- Read `references/example-session.md` for a worked triage with real output (list → show → events → first-failure classification → recovery) — including why a `done` task can still be a failed run, and the unknown-id/ledger-id variant.
- Read `references/remote-canary-failure-ladder.md` when a remote canary or Cloud Build-backed stage fails — gateway/worker/Cloud Tasks/Cloud Build/IAM/status checks in the order that finds the first real failure.
- Copy `assets/triage-decision-table.md` into the triage note and mark the row that fired — the signal→classification→recovery table with the overriding rules.
