---
name: operating-the-factory
description: Drives the GE Agent Factory end to end like a console operator — turns a goal into the right next station, watches runs, resolves blockers, and decides build/repair/ship/escalate. Use when an autonomous harness (Antigravity) must operate the factory or console without a human clicking, or when deciding which factory skill to run next.
---

# Operating The Factory

The conductor skill. Use it when no human is clicking the console and the harness must take a goal — "get use-case X live", "stand the platform up", "fix the blocked run" — and run the operator loop itself.

In plain language: this skill does NOT reimplement any station. It reads the current state from the shared core (status / mission contract / run events), picks the one next station, delegates to that station's skill, watches the result, and decides what comes next. It is the loop; the composed skills are the stations.

## Assembly-Line Slot

- **First step:** read current state — `ge` status, the mission contract, fleet, and the latest run's events — before choosing an action.
- **Plays a role in:** the whole line; it sequences every other capability and owns the decision between stations.
- **Input:** an operator goal + observable factory/run/plane state.
- **Output:** one chosen next action (delegated to a station skill), plus a recorded decision and outcome.
- **Next step:** loop — re-read state and choose again until the goal is met or a guard says escalate.

## The operator loop

1. **Assess.** Read status + mission contract + last run. Never act from assumption; act from observed state.
2. **Guard.** Before any deploy / data load / publish / IAM / cross-project / destructive step, consult `guarding-the-factory`. If it says "needs sign-off", stop and escalate instead of acting.
3. **Pick the next station** (see map) and delegate to that skill. Run exactly one station at a time.
4. **Observe** the run/stage via SSE + artifacts (do not declare success from a started job).
5. **On trouble**, hand to `triaging-runs` to decide resume / re-run / upstream fix / escalate.
6. **Record** the decision + outcome via `recording-evidence`.
7. **Repeat** until the goal is reached or blocked.

## Station map (which composed skill owns what)

| Goal / state | Delegate to |
|---|---|
| Planes down / doctor red | `standing-up-the-platform` |
| Rough idea → spec | `interviewing-specs` (+ `grounding-interviews-with-documents` if the user has a BRD/doc) |
| Spec → mission / local-vs-remote | `planning-missions` |
| Build workspace / refine | `running-factory` → `checking-workspaces` |
| Mock data / simulators | `building-simulators` |
| Ship → deploy agents → publish to Gemini Enterprise | `running-release` |
| Deploy/update the factory's OWN apps (gateway/console/worker/mcp) | `deploying-the-control-plane` |
| 403 / auth / access | `managing-access` |
| Run blocked/failed/stuck | `triaging-runs` |
| Anything irreversible or outward-facing | `guarding-the-factory` first |

## Common mistakes

- Acting before reading state, or declaring success from a *started* (not *finished*) run.
- Running several stations at once instead of one decision at a time.
- Skipping `guarding-the-factory` on an irreversible step because "it probably works".

## Done when

The goal's terminal artifact exists and is verified (spec registered, agent deployed + live-verified, plane green) — or a guard escalated with a recorded reason.
