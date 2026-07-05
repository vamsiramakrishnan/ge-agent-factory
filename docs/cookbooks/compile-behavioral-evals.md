---
title: Compile behavioral evals
parent: Guides
nav_order: 13
layout: default
description: Turn a captured contract (or any spec envelope you bring) into an executable behavior suite — graphs, coverage, selected cases, an ADK evalset, a grading dataset, and a load profile — with ge evals compile.
---

# Compile behavioral evals

**Scope:** local-only — deterministic compilation on this machine; no cloud
credentials touched.

The [behavioral compiler](../concepts/behavioral-compiler.html) derives an
eval suite from the contract instead of asking anyone to brainstorm one:
every capability, evidence rule, and tool intent the contract declares gets
its scenarios generated, over-produced, and then set-cover-selected down to a
budget. `ge evals compile` runs that compiler directly.

## When to use this

- You captured a contract and want the executable behavior suite it implies —
  before the agent is even built, and again whenever the contract changes.
- You have a spec envelope from somewhere else entirely and want a suite for
  it (`--spec` — bring your own).
- You need inputs for the live layer: an evalset for
  [`ge prove --live`](prove-live.html) and a load profile for
  [`ge bench`](bench-live-budgets.html), both derived from the same contract
  the agent was built from.

## Prerequisites

- A captured/registered contract (`ge capture`, or
  [the interview](capture-from-interview.html)) — or any
  `GenerationSpecEnvelope` JSON file for `--spec`.
- Nothing else: no build, no deployment, no credentials.

## Input artifact

One of:

- a registered interview spec, picked by `--id` (default: the only one, when
  exactly one exists);
- any `GenerationSpecEnvelope` JSON (`{ id, title, generationSpec }`) via
  `--spec <path>`.

## Command

```bash
bun tools/ge.mjs evals compile                      # the only registered spec
bun tools/ge.mjs evals compile --id <spec-id>       # a specific registered spec
bun tools/ge.mjs evals compile --spec envelope.json # bring your own spec
bun tools/ge.mjs evals compile --max-cases 20       # tighter case budget (default 40)
bun tools/ge.mjs evals compile --out .ge/behavioral # output directory (the default)
```

Machine callers use `--json`. The same command is `POST /api/ge/evals/compile`
in the console and the `factory_evals_compile` MCP tool.

## Expected output

A summary of the compiled suite: source spec, graph counts (capabilities,
tools, evidence rules), how many cases were selected of how many candidates
(and how many the `--max-cases` budget dropped), and coverage — either
`no gaps` or a named list of gaps. The suggested next command is a
cost-capped live proof over the emitted evalset.

## Generated files

All under `.ge/behavioral/` (or `--out`):

| Artifact | What it is |
| --- | --- |
| `graph.json` | The compiled behavioral graphs — capabilities, authority (evidence rules), tool behavior. |
| `coverage.json` | The coverage report: which contract dimensions the selected cases exercise, and the gaps. |
| `selected-cases.json` | The set-cover-selected conversation cases with their expectations (must call, must cite, must refuse). |
| `bench-profile.json` | A load profile (sessions, turns per session, turn texts) for `ge bench --profile`. |
| `<spec-id>.evalset.json` | The evalset in ADK (Agent Development Kit) format — feed it to `ge prove --live --evalset`. |
| `<spec-id>.agents-cli-dataset.json` | The grading dataset for the agents-cli/platform graders. |

Plus `.ge/proof/metric-applicability.json` — the machine-readable
local-vs-live metric matrix (see
[Metric applicability](../reference/metric-applicability.html)).

## Coverage gaps

The compiler over-generates candidates, then selects the smallest set that
covers the contract's dimensions within `--max-cases`. When the budget forces
gaps, they are printed by dimension (`gap …`). Raise `--max-cases`, or accept
the gap deliberately — the coverage report records it either way, so a gap is
a visible decision, not a silent omission.

## Which metrics apply where

Not every metric can grade every rail. `ge evals applicability` prints the
matrix — which metric families run locally under full harness control, which
run through the live assist surface, and why:

```bash
bun tools/ge.mjs evals applicability             # human view
bun tools/ge.mjs evals applicability --markdown  # the docs table
```

See [Metric applicability](../reference/metric-applicability.html) for the
full table and the honest-status policy (`unavailable` / `not_applicable`
are reported, never silently passed).

## Common failures

- **`no captured specs to compile`** — evals compile from a captured
  contract, and none are registered yet. Fix: `ge capture` (or pass
  `--spec <envelope.json>`).
- **`multiple specs registered — pick one with --id`** — the error lists the
  registered ids; re-run with `--id <spec-id>`.
- **`spec not found: <path>`** — the `--spec` file does not exist; pass a
  `GenerationSpecEnvelope` JSON (`{ id, title, generationSpec }`).
- **Coverage gaps you did not expect** — the `--max-cases` budget dropped
  candidates; raise it and recompile.

## Next step

Run the compiled suite against the deployed agent:
[Prove the shipped agent live](prove-live.html)
(`ge prove --live --evalset .ge/behavioral/<spec-id>.evalset.json --max-cases 3`),
then hold the surface to its latency budgets with the compiled load profile:
[Bench against live budgets](bench-live-budgets.html)
(`ge bench --profile .ge/behavioral/bench-profile.json`).
