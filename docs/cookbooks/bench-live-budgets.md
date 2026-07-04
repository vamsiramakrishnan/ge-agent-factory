---
title: Bench against live budgets
parent: Guides
nav_order: 15
layout: default
description: Load the deployed assist surface within hard cost guards and judge the latency/error budgets — ge bench with .ge.json live.budgets, cassette replay for CI, and the k6 export.
---

# Bench against live budgets

**Scope:** live runs send real traffic at a paid surface and refuse to start
without `--yes`; hard guard rails cap what any run can spend. With
`--cassette` the whole run is local-only, zero cloud, and needs no
confirmation.

`ge bench` turns latency into a verdict: N sessions × M turns against the
deployed assist surface (optionally swept across concurrency levels),
measured per turn (time to first text, full response, inter-chunk stalls,
errors, responder identity) and judged pass/fail against the budgets in
`.ge.json`. Charts are derived; the verdict is the deliverable.

## When to use this

- Before turning on a latency gate for promotion — establish what the
  surface actually does under modest load.
- After a model/retrieval/config change that could move time-to-first-text.
- In CI, over a cassette, so the budget machinery itself is exercised on
  every change for free.

## Prerequisites

- A deployed agent (`geAppId` in `.ge.json` or `--ge-app`) plus application
  default credentials — for live runs only.
- A cassette (`ge drive --record-cassette <path>`) for replay runs — nothing
  else.
- Optionally a compiled load profile from
  [`ge evals compile`](compile-behavioral-evals.html)
  (`.ge/behavioral/bench-profile.json`).

## Input artifact

None required. Optional: `--profile <bench-profile.json>` (sessions, turns,
turn texts derived from the contract) and/or `--cassette <recording>`.

## Configure budgets and guards

Budgets (what a run must meet) live under `live.budgets`; guard rails (what a
run may never exceed) live under `live.bench` — both in `.ge.json`, both
optional, with these defaults:

```json
{
  "live": {
    "budgets": {
      "ttftMsP95": 2500,
      "fullResponseMsP95": 15000,
      "interChunkGapMsP99": 3000,
      "errorRateMax": 0.01,
      "responderUnknownRateMax": 0,
      "responderMismatchRateMax": 0
    },
    "bench": {
      "maxSessions": 25,
      "maxTurnsPerSession": 5,
      "maxConcurrency": 8,
      "maxDurationSeconds": 120
    }
  }
}
```

Budgets are assertions; guards are hard caps — a plan exceeding them throws
`GELIVE008` before anything runs, so a typo cannot buy an accidental load
test. Every key is documented in
[Live budgets and gates](../reference/live-budgets.html).

## Command

Deterministic replay — the CI path, free, no confirmation:

```bash
bun tools/ge.mjs bench --cassette tools/lib/live/fixtures/success.ndjson
```

A small live run — explicit by design:

```bash
bun tools/ge.mjs bench --yes --sessions 5 --turns 2
```

A concurrency sweep with responder assertion, from the compiled profile:

```bash
bun tools/ge.mjs bench --yes --profile .ge/behavioral/bench-profile.json \
  --concurrency 1,2,4 --target-agent <agent-id> --strict-responder
```

Machine callers use `--json`. The same command is `POST /api/ge/bench` in the
console and the `factory_bench` MCP tool (which requires `confirm=true` for
live runs, mirroring `--yes`).

## Reading the output

- **Verdict** — `PASS`/`FAILED` overall, plus target, source (live vs
  cassette replay), and the load actually run (sessions × turns ×
  concurrency, and whether the duration guard stopped it early).
- **Budgets** — one line per budget: observed value vs limit, pass/fail.
  Responder-rate budgets only count when `--target-agent` asserted identity;
  a run with no expected agent cannot fail them.
- **Latency** — p50/p95/p99 for first text, full response, and inter-chunk
  gap, with sample counts. Percentiles are nearest-rank over per-turn
  measurements.
- **Errors** — failed turns and their code taxonomy, when any.

Exit code is non-zero when any budget verdict failed.

## The k6 export

`--export k6` prints a standalone [k6](https://k6.io) load script instead of
running — for teams that want sustained load from their existing tooling:

```bash
bun tools/ge.mjs bench --export k6 > bench.k6.js
```

The script targets the engine's REST `:streamAssist` endpoint with the same
budgets as thresholds. Auth caveat: `ge bench` itself authenticates with
application default credentials, but the exported script has to supply its
own bearer token (e.g.
`k6 run -e TOKEN="$(gcloud auth print-access-token)" bench.k6.js`) — and that
token expires, so long soak runs need refresh handling. Point it at
`bun tools/mock-streamassist.mjs --cassette <path>` to run the script with
zero cloud.

## Generated files

- `.ge/proof/bench-result.json` — the LiveBenchResult: profile, counts,
  percentiles, budget verdicts, error taxonomy, verdict.

## Common failures

- **`a live bench sends real traffic at a paid surface — confirm with --yes`**
  — working as intended. Replay with `--cassette <recording>`, or confirm:
  `ge bench --yes --sessions 5 --turns 2`.
- **`GELIVE008` — bench plan exceeds the configured guard rails.** Lower
  `--sessions/--turns/--concurrency`, or raise `live.bench` limits in
  `.ge.json` deliberately.
- **`GELIVE008` — a budget verdict failed.** Investigate the regression
  (reproduce the slow conversation with `ge drive`), or raise the budget in
  `.ge.json` `live.budgets` deliberately.
- **`GELIVE001`/`GELIVE002`** — no live target / no credentials; same fixes
  as [driving](drive-a-shipped-agent.html): `ge init` / `--ge-app`, and
  `gcloud auth application-default login`.
- **`bench profile not found`** — `ge evals compile` emits
  `.ge/behavioral/bench-profile.json`, or pass `--sessions/--turns` directly.
- **Responder budgets failing on a replay** — the cassette was recorded
  without identity evidence; either record with `--target-agent` context or
  drop the assertion for replay runs.

## Next step

Green budgets plus a green [live proof](prove-live.html) are the two halves
of the release verdict — wire them into `promotion.gates.live` (see
[Live budgets and gates](../reference/live-budgets.html)) so promotion
requires both. To chase a specific slow turn, reproduce it interactively:
[Drive a shipped agent](drive-a-shipped-agent.html).
