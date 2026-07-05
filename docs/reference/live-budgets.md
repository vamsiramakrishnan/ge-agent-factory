---
title: Live budgets and gates
parent: Reference
nav_order: 11
layout: default
description: Every live.budgets key, its default and enforcing command; the live.bench hard guard rails; and the promotion.gates.live policy keys.
---

# Live budgets and gates

Three related `.ge.json` blocks govern the live layer. **Budgets**
(`live.budgets`) are the non-functional-requirement (NFR) side of the
contract — numbers a run must meet.
**Guards** (`live.bench`) are hard caps a run may never exceed — cost
protection, not quality assertion. **Gate policy** (`promotion.gates.live`)
decides whether live verdicts block promotion. All three merge over defaults,
so an empty `.ge.json` is fully functional; extra keys in these blocks are
sanctioned (`additionalProperties` is true by design).

Sources of truth: `tools/lib/bench/budgets.mjs` (budgets + guards) and
`tools/lib/gates/live-gate.mjs` (gate policy).

## `live.budgets` — what a run must meet

Evaluated by [`ge bench`](../cookbooks/bench-live-budgets.html) as pass/fail
verdicts, one per key. Latency percentiles are nearest-rank over per-turn
samples from the [transcript](live-transcript.html) stream timings.

| Key | Default | Meaning | Enforced by |
| --- | --- | --- | --- |
| `ttftMsP95` | `2500` | 95th-percentile time to first text (ms) must not exceed this. | `ge bench` |
| `fullResponseMsP95` | `15000` | 95th-percentile full response time (ms). | `ge bench` |
| `interChunkGapMsP99` | `3000` | 99th-percentile worst stall between stream chunks (ms). | `ge bench` |
| `errorRateMax` | `0.01` | Failed turns / total turns must not exceed this rate. | `ge bench` |
| `responderUnknownRateMax` | `0` | Sessions whose responder identity could not be verified / total sessions. Only applies when an expected agent was asserted (`--target-agent`); a run with no assertion cannot fail it. | `ge bench` |
| `responderMismatchRateMax` | `0` | Sessions answered by the wrong agent / total sessions. Same applicability rule. | `ge bench` |

A failed budget becomes a `GELIVE008` blocker in the bench verdict and a
non-zero exit. The exported k6 script (`ge bench --export k6`) carries the
same budgets as k6 thresholds.

## `live.bench` — hard guard rails

Checked *before* a bench run starts; a plan exceeding any cap throws
`GELIVE008` and nothing runs. They exist so a typo cannot buy an accidental
load test against a paid surface — raising them is a deliberate config edit,
not a flag.

| Key | Default | Meaning |
| --- | --- | --- |
| `maxSessions` | `25` | Cap on independent conversations per run (`--sessions`). |
| `maxTurnsPerSession` | `5` | Cap on turns per conversation (`--turns`). |
| `maxConcurrency` | `8` | Cap on the highest level in a `--concurrency` sweep. |
| `maxDurationSeconds` | `120` | Wall-clock deadline; a run that reaches it stops early (reported as `stopped at deadline`). |

Live runs also require `--yes` (`confirm=true` over MCP — the Model Context
Protocol) no matter what the guards allow; cassette replays need neither the
guard check nor the confirmation.

## `promotion.gates.live` — gate policy

Read by `ge prove --live` (via `evaluateLiveGate`) to turn a LiveProofResult
into a gate verdict. Staged defaults: local proof is required everywhere;
the live gate is opt-in until an operator turns it on for release/production
promotion.

| Key | Default | Meaning |
| --- | --- | --- |
| `required` | `false` | Whether a missing live proof result blocks the gate at all. When `false`, absence passes; a *failing* result still reports its blockers. |
| `minPassRate` | `1.0` | Minimum fraction of eval cases that must pass. Below it, the gate blocks with `GELIVE008`. |
| `strictResponder` | `true` | Cases whose responder identity is `unknown` or `mismatched` block the gate with `GELIVE006`. (The CLI's `--strict-responder` flag additionally fails such cases during the run itself.) |
| `allowBaselineDrift` | `false` | Whether a `drifted` conformance baseline may pass the gate. When `false`, drift blocks until `--update-baseline` deliberately accepts the new behavior. |

## Example

```json
{
  "live": {
    "budgets": { "ttftMsP95": 2000, "errorRateMax": 0 },
    "bench": { "maxSessions": 10 }
  },
  "promotion": {
    "gates": {
      "live": { "required": true, "minPassRate": 0.9 }
    }
  }
}
```

Unlisted keys keep their defaults. `ge config explain` shows the rest of
`.ge.json`; see [Config](config.html) for the flag → env → file → default
precedence that governs the top-level fields.
