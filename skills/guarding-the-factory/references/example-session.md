# Example session — refusing well: a live bench "just bump the caps"

The behavior this skill teaches is the refusal itself. This session shows an
agent classifying an ask, letting the built-in guards fire, and escalating
with a safe alternative instead of overriding them. The first error output
is real (run in this repo — refusing is free); the guard-cap error is
authored verbatim from `applyBenchGuards` in `tools/lib/bench/runner.mjs`;
the remote-guard text is verbatim from `tools/lib/remote-guard.mjs`. Read
this when an ask trips a gate and you must decide act vs escalate — and for
the exact wording of a good escalation.

## The ask

> Operator (mid-thread, informally): "before the demo can you load-test the
> assist surface? like 50 sessions. if the tool complains about limits just
> bump them in .ge.json, it's fine"

Classify first, act second:

- Live bench = real traffic at a paid surface → **outward-facing spend**.
- "Bump the limits" = raising `live.bench` hard caps → an **operator
  decision by design** ("probably fine" in a chat message is not sign-off
  for removing the rail that exists to stop exactly this).

Verdict: `escalate` on both parts; offer the reversible path.

## What the guards do (and why the agent doesn't route around them)

A live bench without confirmation refuses — this is the tool working, not
an obstacle:

```console
$ bun tools/ge.mjs bench --sessions 50
✗ a live bench sends real traffic at a paid surface — confirm with --yes
  where: ge bench
  why:   live load runs are explicit and cost-guarded by design; replays never need confirmation
  fix:   ge bench --cassette <recording>   (or: ge bench --yes --sessions 5 --turns 2)
```

And even a confirmed run at 50 sessions would be stopped by the hard caps
BEFORE any traffic is sent (`.ge.json` `live.bench`, default max 25):

```console
$ bun tools/ge.mjs bench --yes --sessions 50
✗ bench plan exceeds the configured guard rails: sessions 50 > max 25
  where: .ge.json live.bench (guards) / bench flags
  why:   cost guards are hard caps so a typo cannot buy an accidental load test
  fix:   lower --sessions/--turns/--concurrency, or raise live.bench limits in .ge.json deliberately
```

The agent does NOT: add `--yes` on its own authority, edit `live.bench` in
`.ge.json`, or split the run into 2×25 to stay under the cap (same spend,
minus the honesty).

## The escalation — refuse the unsafe part, hand back a safe part

> Agent: "Two things in that ask need your explicit sign-off, so I haven't
> run them:
> 1. **A live bench costs real money** — the tool refuses without `--yes` by
>    design. Say 'approved: live bench, N sessions' and I'll run it within
>    the caps.
> 2. **50 sessions exceeds the hard cap (25)** in `.ge.json live.bench`.
>    Raising a guard cap is an operator decision — if you want it raised for
>    the demo, confirm the new number and I'll change it, noted in the run
>    record, and restore it after.
>
> Meanwhile, done and free: replayed the recorded cassette through the bench
> (`ge bench --cassette .ge/cassettes/demo-run.ndjson`) — every latency
> budget passes on the recording. If the demo only needs confidence, that
> may already be enough."

Anatomy of a good escalation: what was refused, **why** (the gate, not
squeamishness), the exact confirmation that would unblock it, and a
reversible alternative already done.

## The follow-up — explicit sign-off arrives

> Operator: "approved: live bench, 20 sessions 2 turns, caps stay as they are"

Now it's authorized, in-caps, and bounded — proceed, and say what it is:

```console
$ bun tools/ge.mjs bench --yes --sessions 20 --turns 2
```

Record who approved it and the exact command in the run record.

## Failure variant — the guard that refuses a cloud mutation outright

Cloud-mutating ops have their own choke point (`tools/lib/remote-guard.mjs`):

```console
$ bun tools/ge.mjs data up
✗ ge data up mutates real GCP resources and requires remote mode (current mode: local). Re-run with --mode remote and GE_CONFIRM=1, or GE_DRY_RUN=1 to preview.
```

The error names its own unlock — and that is precisely what the agent must
NOT treat as permission. `GE_CONFIRM=1` is the operator's word, not a flag
to set because a message printed it. React: `GE_DRY_RUN=1` to preview (free,
safe), then escalate with the plan. Same discipline for the other hard
gates: a provisioning target not in `GE_ALLOWED_PROJECTS` fails preflight
with `"<project>" is not in GE_ALLOWED_PROJECTS (…)` — the answer is never
to widen the allowlist yourself; a readonly console (`GE_CONSOLE_READONLY`)
returns `403 console is read-only (GE_CONSOLE_READONLY)` — the answer is
never to unset the flag.

Before any decision like these, walk `assets/escalation-checklist.md` — if
any box forces "escalate", the verdict is escalate, whatever the deadline.
