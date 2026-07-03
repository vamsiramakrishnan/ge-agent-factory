---
title: Prove the shipped agent live
parent: Guides
nav_order: 13
layout: default
description: Run evalset cases through the deployed agent's assist surface (or a cassette replay) with ge prove --live — per-case metric grid, conformance baselines, drift detection, and the live promotion gate.
---

# Prove the shipped agent live

**Scope:** live by default and therefore explicit — `--live` never runs as
part of plain `ge prove`, and cost caps are in your hands. With `--cassette`
the whole run is local-only, zero cloud.

Local proof shows the agent you *built* behaves;
[live proof](../concepts/live-proof.html) shows the agent you *shipped* still
does — through the same streaming assist surface real users hit. `ge prove
--live` replays an evalset's conversations against the deployed agent (or a
recorded cassette), grades each case with the GE-owned metric grid, compares
behavior against stored baselines, and produces a gate-ready verdict.

## When to use this

- The agent shipped (or re-shipped) and you need evidence the deployed
  surface still honors the contract.
- You changed retrieval config, model version, or registration and want to
  know what drifted before users tell you.
- You are wiring release automation and need a machine verdict
  (`promotion.gates.live`) instead of a manual smoke test.

## Prerequisites

- An evalset. Two honest sources:
  - compile one from the contract —
    [Compile behavioral evals](compile-behavioral-evals.html)
    (`ge evals compile` → `.ge/behavioral/<spec-id>.evalset.json`), or
  - record one from a real conversation —
    [Drive a shipped agent](drive-a-shipped-agent.html)
    (`ge drive --record evals/recorded.evalset.json`).
- For live runs: a deployed agent (`geAppId` in `.ge.json`, or `--ge-app`)
  and application default credentials. For `--cassette` runs: nothing.

## Input artifact

An ADK-compatible evalset (`evalCases[]` with `conversation` turns; reference
answers make cases gradeable for response match). Optionally a cassette
recorded with `ge drive --record-cassette`.

## Command

Cost caps first — start with one case, live:

```bash
bun tools/ge.mjs prove --live --evalset evals/recorded.evalset.json --max-cases 1
```

Then widen deliberately:

```bash
bun tools/ge.mjs prove --live --evalset .ge/behavioral/<spec-id>.evalset.json \
  --max-cases 5 --max-turns 3 --target-agent <agent-id> --strict-responder
```

Offline, against a recording (zero cloud — the CI path):

```bash
bun tools/ge.mjs prove --live \
  --evalset evals/recorded.evalset.json \
  --cassette .ge/cassettes/enrollment.ndjson
```

Accept current behavior as the new known-good baseline (a deliberate act):

```bash
bun tools/ge.mjs prove --live --evalset evals/recorded.evalset.json --update-baseline
```

Machine callers use `--json`. The same command is `POST /api/ge/prove/live`
in the console and the `factory_prove_live` MCP tool.

## Reading the output

Per case, one line per metric that failed or warned; then conformance and the
gate:

- **Cases** — `✓/✗ <case-id> · N turn(s) · conformance <state>`, with failing
  metrics (`transport`, `session_threading`, `responder_identity`,
  `response_match`, `tool_trajectory`, `grounding_citations`) and blockers
  underneath.
- **Metric statuses are honest**: `response_match` is a deterministic
  token-F1 against the recorded reference (threshold 0.35 — a structural
  check; judged quality is delegated to the platform graders);
  `tool_trajectory` reports `unavailable` when the live stream exposed no
  tool metadata rather than pretending to pass; metrics with no expectations
  report `not_applicable`. See
  [Metric applicability](../reference/metric-applicability.html).
- **Baseline** — `created` on first green run, `matched`, or `drifted` (with
  the drifted fields per case).
- **Gate** — `live gate passed` / `blocked`, evaluated against
  `promotion.gates.live` policy.

Exit code is non-zero when the proof failed *or* the gate blocked.

## Baselines and drift

A green case's behavior summary — responder assertion, threading, tool set,
cited sources, timing classes, turn states — is stored under
`.ge/live-baselines/<evalset-id>/<case-id>.json`. Baselines compare by
*policy*, not bytes: later runs diff those fields and report `drifted` with
the exact fields that moved. Drift blocks the verdict (unless the gate policy
sets `allowBaselineDrift: true`); `--update-baseline` is the explicit way to
accept the new behavior. A failing first run never becomes a baseline —
baselines are known-good by construction.

## The gate policy

Live proof is opt-in as a promotion gate. Policy lives in `.ge.json`:

```json
{
  "promotion": {
    "gates": {
      "live": {
        "required": true,
        "minPassRate": 1.0,
        "strictResponder": true,
        "allowBaselineDrift": false
      }
    }
  }
}
```

Defaults (when the block is absent): `required: false`, `minPassRate: 1.0`,
`strictResponder: true`, `allowBaselineDrift: false` — see
[Live budgets and gates](../reference/live-budgets.html) for every key.

## The CI story: replay by default, live by opt-in

Cassette replay makes live proof CI-safe: record the stream once
(`ge drive --record-cassette`), commit or stash the cassette, and run
`ge prove --live --evalset … --cassette …` on every build — deterministic,
free, zero cloud. Gate *real* traffic behind an explicit opt-in the way the
repo's own end-to-end tests do (they run only when `GE_E2E=1` is exported):
a release-branch job sets the opt-in variable and drops `--cassette`, with
`--max-cases` keeping the spend bounded. Replays never need confirmation;
real traffic is always a deliberate step.

## Generated files

- `.ge/proof/live-proof-result.json` — the full LiveProofResult (status,
  per-case metrics, pass rate, conformance, verdict).
- `.ge/proof/eval-matrix.json` — the case × metric grid the console renders.
- `.ge/transcripts/prove-<evalset>-<case>.json` — one
  [LiveTranscript](../reference/live-transcript.html) per case.
- `.ge/live-baselines/<evalset-id>/<case-id>.json` — conformance baselines.

## Common failures

- **`live proof needs an evalset`** — there is no default suite. Fix:
  `ge drive --record evals/recorded.evalset.json`, or `ge evals compile`.
- **`GELIVE001` — no shipped live target found.** Fix: `ge init` or
  `--ge-app <engine>`; `ge config explain` shows what is set.
- **`GELIVE002` — application default credentials unavailable.** Fix:
  `gcloud auth application-default login`.
- **`GELIVE004` — live stream could not be parsed.** Retryable transport
  failure, or a broken cassette (re-record with
  `ge drive --record-cassette <path>`).
- **`GELIVE005` — session threading failed across turns.** A follow-up turn
  was not sent with the session the previous response returned; retry, and if
  it persists the assist surface is not continuing sessions.
- **`GELIVE006` — responder identity mismatched** (or unverified under
  `--strict-responder` / a strict gate). Fix the registration, or verify who
  actually answered via the transcript's `responder.evidence`.
- **`GELIVE008` — pass rate below the gate's `minPassRate`.** Read the
  failing cases; reproduce one interactively with `ge drive`.
- **Baseline drifted, but the new behavior is correct** — accept it
  deliberately: `ge prove --live --update-baseline`.

## Next step

Behavior proven — now hold the surface to its latency and error budgets:
[Bench against live budgets](bench-live-budgets.html) (`ge bench`). To
reproduce a failing conversation by hand, go back to
[Drive a shipped agent](drive-a-shipped-agent.html).
