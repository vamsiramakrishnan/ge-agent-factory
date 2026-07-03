# Example session — "the dashboard says done, but is it actually good?"

A worked triage: list → show → read the event stream for the FIRST failure →
classify → pick the cheapest correct recovery. All outputs below are real
(captured against this repo's local daemon), trimmed. Read this when a run
is blocked/failed/suspicious and you must decide resume vs re-run vs
upstream fix vs escalate.

## The ask

> Operator: "Last night's preflight job shows `done` in the console. Before
> I trust it for today's build: did it actually pass? Recover it if not."

Key instinct: `done` is a task status, not a verdict — read the events, not
the spinner.

## Step 1 — one timeline over every run

```console
$ bun tools/ge.mjs runs list
Runs
  daemon   healthy  http://127.0.0.1:17654

  status  source   kind        id                          detail
  done    runtime  ge.command  job-1783066037945-2d913473  2026-07-03T08:07:18.304Z
  done    ledger   build       oracle-ledger-20028         2026-06-15T10:00:03.000Z
```

Two sources merge here: daemon tasks (`runtime`) and durable ledger runs
(`ledger`). The preflight job is the runtime one.

## Step 2 — task detail + its resume plan

```console
$ bun tools/ge.mjs runs show job-1783066037945-2d913473
GE Runtime Task job-1783066037945-2d913473
  kind      ge.command
  status    done
  created   2026-07-03T08:07:17.945Z
  updated   2026-07-03T08:07:18.304Z
  resume   none
  reason   task is done; no resume action is needed
```

`resume: none` already rules out the cheapest recovery — whatever is wrong,
resuming won't run anything again.

## Step 3 — read the events; find the first REAL failure, not the last line

```console
$ bun tools/ge.mjs runs events job-1783066037945-2d913473
GE Runtime Events job-1783066037945-2d913473
    1 stage_started $ ge doctor --local
    …
    8 log             ✓ python 3.11                    /usr/local/bin/python3
    9 log             ✗ agents-cli                     not found
   10 log                 fix: uv tool install google-agents-cli
   11 log             ✗ google-antigravity SDK         not importable (python3)
   12 log                 fix: mise run deps  (creates .venv via uv + installs the SDK)
   …
   23 log           ✗ 2 hard failure(s).
   24 stage_done    exit 0
```

Decisions made here:

- The **first failure** is event 9: `agents-cli not found`. Event 11 is its
  sibling (same root cause: local toolchain never provisioned). Everything
  after is confirmation, not cause.
- The task is `done` with `exit 0` because the *task* (run a command,
  capture output) succeeded — the *doctor inside it* failed. This is exactly
  why "done" on a dashboard is not a verdict.
- Missed it live? `ge runs replay <id>` folds the recorded events back
  through the terminal at speed — same data, watchable.

## Step 4 — classify and pick the recovery

Per the decision rule: deterministic readiness gap (missing toolchain), not
transient, not an upstream-station input, no half-applied side effects.
Resume is useless (same machine state → same failure) — **fix the cause,
then re-run**:

```console
$ uv tool install google-agents-cli && mise run deps
…
$ bun tools/ge.mjs runs job -- doctor --local
✓ started job task job-1783066112201-8ac41e02

  next  ge runs events job-1783066112201-8ac41e02 --follow
```

Re-observe until the new run's events show the checks green — recovery isn't
done when the fix command exits, it's done when the run proves it cleared.

## Step 5 — report back

> Agent: "The preflight job was NOT good: task `done` but the doctor inside
> it had 2 hard failures — first failure `agents-cli not found` (event 9;
> the SDK failure is the same root cause). Deterministic readiness gap, so I
> installed the toolchain per the doctor's own fix lines and re-ran; the new
> run is green. Nothing needed escalation — no side effects were touched.
> Evidence: event streams for both task ids."

## Failure variant — the id doesn't resolve

```console
$ bun tools/ge.mjs runs show job-000
✗ daemon task lookup failed: 404
```

React: get the id from `ge runs list` — and check its `source` column.
`show`/`events`/`replay`/`resume` operate on **daemon tasks**; a `ledger`
run id (e.g. `oracle-ledger-20028`) lives in the durable ledger instead —
inspect those with `ge ledger runs`. If the daemon itself is the problem
(`daemon stopped` in the list header, or "Unable to connect"), that's a
plane blocker: `ge daemon start`, then re-observe — and if a run *pauses on
a question* rather than failing (`ge.interaction.request` in the stream),
answer it with `ge runs respond <task> <interaction>` instead of triaging it
as a failure.
