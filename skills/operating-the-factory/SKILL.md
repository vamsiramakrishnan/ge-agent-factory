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
3. **Pick the next station** (see map) and delegate to that skill. Make one
   orchestration decision at a time; inside that station, let the shared
   scheduler fan independent agents/stages out in parallel.
4. **Observe** the shared ledger via SSE/status plus artifacts (do not declare
   success from a started job). Console, CLI, API, and MCP are submission and
   projection surfaces over the same registry/job runner, not separate task
   implementations.
5. **On trouble**, hand to `triaging-runs` to decide resume / re-run / upstream fix / escalate.
6. **Record** the decision + outcome via `recording-evidence`.
7. **Repeat** until the goal is reached or blocked.

## Mode contract

- **Local:** submit through the local daemon, stream its ledger/events, and run
  the canonical stage registry in local transports.
- **Remote/cloud:** submit through the gateway, dispatch with Cloud Tasks to
  workers/Cloud Build, and stream the same stage ids, result JSON, event schema,
  and workspace archive contract.
- A generated remote run starts at `package_data`. A prebuilt local workspace
  uses explicit `ge handoff` and normally starts at `load_data`.
- Recover a failed remote run with `ge agents resume --remote --run --ids
  <id>`. It creates a lineage-linked continuation from the last stable
  `workspace.tar.gz` and retries the exact failed stage; it does not regenerate
  the agent. A successful partial run advances from the next stage.
- `validate`, eval, or preview can exercise agents-cli, but the actual runtime
  handoff is complete only when `deploy_runtime` records a non-null remote
  runtime id and later release stages verify it.

Useful machine-readable observers:

```bash
bun tools/ge.mjs daemon status --json
bun tools/ge.mjs daemon cloud --json
bun tools/ge.mjs agents status --watch --json
bun tools/ge.mjs agents logs <run-id> --stage <stage>
bun tools/ge.mjs runs events <run-id> --remote --follow --json
```

Treat a nonzero exit from a watched build/status command as a failed terminal
run even when the final JSON frame was emitted successfully. "Terminal" means
the watcher finished; it does not mean the run passed.

For console/API observers, status reads must use the shared asynchronous status
board. Never put synchronous `gcloud` probes on a server request path: they
block module/API delivery and can leave the UI on `Loading…` even though every
completed response is 200. Coalesce identical in-flight plane probes; do not
create a console-only status cache or contract.

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
- Manually submitting duplicate station jobs to get parallelism instead of
  relying on deterministic item/stage fanout and ledger fan-in.
- Reading only a console spinner or process stdout instead of the shared event
  stream and terminal stage artifacts.
- Treating a console loading state as a frontend failure before checking
  pending requests and server-thread cloud probes.
- Skipping `guarding-the-factory` on an irreversible step because "it probably works".

## Done when

The goal's terminal artifact exists and is verified (spec registered, agent deployed + live-verified, plane green) — or a guard escalated with a recorded reason.

## References

- Read `references/example-session.md` before your first loop — a worked goal ("get one agent to preview, no cloud") run iteration by iteration with real `ge status` / `ge doctor` / `ge pipeline plan` output, a guard escalation, and the dead-daemon failure variant.
