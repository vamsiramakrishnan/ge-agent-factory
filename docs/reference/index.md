---
title: Reference
nav_order: 6
layout: default
has_children: true
---

# Reference

This is the ground-truth reference for the contract layer: the commands,
contracts, and APIs behind capture → compile → simulate → prove → hand off.
Every command, flag, field, and endpoint on these pages exists in the source
tree — the CLI command tree, the contract schema tables, and the console
route table are **generated from source** and drift-gated in CI, so they
cannot fall out of sync with the code.

Use Reference after you know what you are trying to do and need the exact
command, field, endpoint, file, stage, or schema. For task order, use the
[Guides](../cookbooks/). For the rationale behind the shape of the system,
use [Core Concepts](../concepts/).

| Page | What it covers |
|---|---|
| [CLI](cli.html) | The `ge` operator CLI (generated from the command tree), the `factory` generator CLI, and the `mise` tasks. |
| [Contract schema](spec-schema.html) | The Enterprise Agent Contract's fields: `generationSpec`, `behaviorContract` (incl. `workflow`, `answerableQueries`, eval `mechanisms`), and `architecture.pipeline` — tables generated from the zod schema. |
| [OKF](okf.html) | The contract's portable Markdown form — concept types, bundle layout, and the `spec-to-okf` / `okf-to-spec` converters. |
| [Agent lifecycle](agent-lifecycle.html) | How an agent moves through its OKF-bundle lifecycle: `ge okf customize` (variants), `ge agents register` (draft → registered + catalog refresh), `ge agents track` (provenance, registry, variant lineage). |
| [Generated artifacts](agent-generation.html) | What a compiled agent looks like on disk: real ADK, the three callbacks, the dual tool backend, multi-agent topology, the knowledge bundle, and the eval set. |
| [Simulator systems](simulator-systems.html) | The source-system twin engine: the pack contract, the generic runtime, the BYO overlay, state backends, the pack tooling, and the determinism extras (virtual clock, chaos profiles, record/replay). |
| [Synthetic data](synthetic-data.html) | How seed data is synthesized: the recipe model, the Snowfakery and offline realization tiers, the statistical realism profile, determinism guarantees, and `ge data synth`. |
| [Console & APIs](console-and-apis.html) | The server API endpoints under `/api/ge/*`, `/api/runtime/*`, `/api/systems/*`, and `/api/interviews/:id/*` — the mutating route table is generated from the command registry. |
| [Config](config.html) | `.ge.json`, the flag → env → file → default precedence, and `ge config explain`. |
| [Architecture](architecture.html) | The three planes, local vs remote mode, the durable control plane (ADR 0001), the run ledger, the request/auth flow, and the skill matrix (station → skill → `ge` command → engine package → doc, generated from source). |
| [Live transcript](live-transcript.html) | The LiveTranscript artifact every live surface produces and consumes — fields, where it is written, who reads it. |
| [Live budgets and gates](live-budgets.html) | Every `live.budgets` key, the `live.bench` hard guard rails, and the `promotion.gates.live` policy. |
| [Admission gate & Agent Passport](admission.html) | The signed passport file, the recorded AdmissionDecision, the `promotion.gates.admission` policy keys, the `GEADM` blocker codes, key management, and break-glass. |
| [Evaluation generation](evaluation-generation.html) | The behavioral compiler pipeline (graph → expansion → set-cover → emitters), the `--perturb`/`--adversarial` hardening flags, and the statistics (Wilson intervals, lexical similarity). |
| [Metric applicability](metric-applicability.html) | Which eval metric families grade the local rail vs the live assist surface, and the honest-status policy. |
| [Atomic capabilities](atomic-capabilities.html) | The end-to-end system as composable capabilities — CLI verb, console route, MCP tool, and skill for each. |
| [Agent operability](agent-operability.html) | The contract that makes the factory drivable by an AI agent — position/next guidance, background runs, event streams, resume plans, mid-run questions, skill loading. |
| [MCP tools](../MCP.html) | The factory's MCP server for model callers, and the MCP tool plane generated agents call through. |
| [Glossary](../GLOSSARY.html) | Plain-language translations of every internal noun. |

## Fast lookup

| If you need to... | Read |
|---|---|
| Run or script the factory | [CLI](cli.html) |
| Change the contract | [Contract schema](spec-schema.html) |
| Change the contract's portable form | [OKF](okf.html) |
| Make a variant of an agent, register it, or check where it stands | [Agent lifecycle](agent-lifecycle.html) |
| Debug compiled ADK code | [Generated artifacts](agent-generation.html) |
| Add or validate a source-system twin pack | [Simulator systems](simulator-systems.html) |
| Generate or tune a pack's seed data | [Synthetic data](synthetic-data.html) |
| Understand where an eval suite's cases come from | [Evaluation generation](evaluation-generation.html) |
| Wire a UI or automation against the backend | [Console & APIs](console-and-apis.html) |
| Understand where a config value came from | [Config](config.html) |
| Explain local vs remote mode or the three planes | [Architecture](architecture.html) |
| Map a pipeline station to its skill, `ge` command, and engine package | [Architecture](architecture.html) |
| Navigate the operator UI | [Console](../console/) |

## JSON output and error surfaces

Two contracts don't have separate pages yet, to avoid hand-maintained drift:

- **JSON output:** every `ge` command accepts `--json` and emits one
  structured result object on stdout (progress goes to stderr); the shapes
  live in `packages/contracts` and are exercised by the registry parity
  tests. Until a generated reference exists, treat `--json` output + the
  TypeScript types as the contract.
- **Error codes:** there is no numeric error-code system; failures surface
  as structured check results (doctor), stage blockers (runs), or thrown
  command errors. The catalog of *operational* failure modes is
  [Troubleshooting](../operations/troubleshooting.html).

## Reference standards

- Prefer source-linked facts over prose-only explanations.
- Generated regions are never hand-edited — regenerate with
  `bun run docs:cli`, `bun run docs:spec-ref`, `bun run docs:console-api`,
  `bun run docs:skill-matrix`.
- Keep command examples copyable from the repo root.
- State whether a command is local-only, cloud-only, read-only, or mutating.
- Link to the guide when a reference page describes a full workflow.
