---
title: Reference
nav_order: 6
layout: default
has_children: true
---

# Reference

Ground-truth reference for the contract layer — the commands, contracts, and
APIs behind capture → compile → simulate → prove → hand off. Every command,
flag, field, and endpoint on these pages exists in the source tree; the CLI
command tree, the contract schema tables, and the console route table are
**generated from source** and drift-gated in CI, so they cannot lie.

Use Reference after you know what you are trying to do and need the exact
command, field, endpoint, file, stage, or schema. For task order, use the
[Guides](../cookbooks/). For the rationale behind the shape of the system,
use [Core Concepts](../concepts/).

| Page | What it covers |
|---|---|
| [CLI](cli.html) | The `ge` operator CLI (generated from the command tree), the `factory` generator CLI, and the `mise` tasks. |
| [Contract schema](spec-schema.html) | The Enterprise Agent Contract's fields: `generationSpec`, `behaviorContract` (incl. `workflow`, `answerableQueries`, eval `mechanisms`), and `architecture.pipeline` — tables generated from the zod schema. |
| [OKF](okf.html) | The contract's portable Markdown form — concept types, bundle layout, and the `spec-to-okf` / `okf-to-spec` converters. |
| [Generated artifacts](agent-generation.html) | What a compiled agent looks like on disk: real ADK, the three callbacks, the dual tool backend, multi-agent topology, the knowledge bundle, and the eval set. |
| [Simulator systems](simulator-systems.html) | The source-system twin engine: the pack contract, the generic runtime, the BYO overlay, state backends, and the pack tooling. |
| [Console & APIs](console-and-apis.html) | The server API endpoints under `/api/ge/*`, `/api/runtime/*`, `/api/systems/*`, and `/api/interviews/:id/*` — the mutating route table is generated from the command registry. |
| [Config](config.html) | `.ge.json`, the flag → env → file → default precedence, and `ge config explain`. |
| [Architecture](architecture.html) | The three planes, local vs remote mode, the durable control plane (ADR 0001), the run ledger, and the request/auth flow. |
| [MCP tools](../MCP.html) | The factory's MCP server for model callers, and the MCP tool plane generated agents call through. |
| [Glossary](../GLOSSARY.html) | Plain-language translations of every internal noun. |

## Fast lookup

| If you need to... | Read |
|---|---|
| Run or script the factory | [CLI](cli.html) |
| Change the contract | [Contract schema](spec-schema.html) |
| Change the contract's portable form | [OKF](okf.html) |
| Debug compiled ADK code | [Generated artifacts](agent-generation.html) |
| Add or validate a source-system twin pack | [Simulator systems](simulator-systems.html) |
| Wire a UI or automation against the backend | [Console & APIs](console-and-apis.html) |
| Understand where a config value came from | [Config](config.html) |
| Explain local vs remote mode or the three planes | [Architecture](architecture.html) |
| Navigate the operator UI | [Console](../console/) |

## JSON output and error surfaces

Two contracts are deliberately *not* separate pages yet, to avoid
hand-maintained drift:

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
  `bun run docs:cli`, `bun run docs:spec-ref`, `bun run docs:console-api`.
- Keep command examples copyable from the repo root.
- State whether a command is local-only, cloud-only, read-only, or mutating.
- Link to the guide when a reference page describes a full workflow.
