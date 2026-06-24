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
| Irreversible side-effect already partially applied, or ambiguous | escalate (see `guarding-the-factory`) |

## Workflow

1. Read the run via the console run stream / events API (don't infer from the spinner).
2. Locate the first failing stage + its blocker detail; ignore cascade noise after it.
3. Classify per the table; prefer the cheapest correct recovery (resume < re-run < upstream fix < escalate).
4. Execute through the owning station skill; re-observe to confirm it actually cleared.
5. Record the failure + recovery via `recording-evidence` so repeat failures are visible.

## Common mistakes

- Reading the last log line instead of the first failure (you fix the symptom, not the cause).
- Re-running a deterministic failure (same input → same failure) instead of fixing the cause.
- Resuming a run whose side-effects are half-applied — escalate instead.

## Done when

The run reaches its terminal artifact after recovery, or it's escalated with the first-failure evidence and a recommended fix.
