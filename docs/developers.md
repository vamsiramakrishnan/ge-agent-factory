---
title: Developer Guide
nav_order: 2
layout: default
---

# Developer Guide

This guide is the fastest way to understand why the repo exists, where the code
lives, and how to make a change without guessing.

Unfamiliar term? See the [Glossary](./GLOSSARY.html) — plain-language
translations of the jargon (harness, OKF, canary, planes, pipelines, …).

## Purpose first

GE Agent Factory exists to close the gap between "we can imagine an enterprise
agent" and "we can ship, audit, test, and operate one." The system is built
around one principle: **the spec is the contract**. Business intent, source
systems, data entities, tool bindings, workflows, eval mechanisms, generated code,
and cloud release stages all trace back to that contract.

That is why the repo has more than an app shell. It has a generator, local
fixtures, simulator packs, an operator CLI, a console, an MCP (Model Context Protocol) server, Terraform,
run [ledgers](./GLOSSARY.html#ledger) (durable run records), evals, and
generated-agent workspaces. Those pieces exist so a
developer can reproduce the agent locally and an operator can release the same
artifact into a governed project.

## What to run first

```bash
mise run setup
mise run doctor-local
mise run devex-check
mise run prove
mise run console
mise run mode-local
CANARY=1 mise run build-agents-local
```

The local path installs the toolchain, checks docs and workspace contracts,
proves one validated [canary](./GLOSSARY.html#canary) workspace (a single agent
that proves the pipeline), starts the [daemon](./GLOSSARY.html#daemon) (the
local background task runner), opens the console at
`http://localhost:18260`, and can build one agent up to the build boundary. The
default `mise run prove` path does not require cloud credentials.

For cloud release work:

```bash
export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
CANARY=1 mise run bootstrap-cloud
```

## Repo map

The layering is enforced, not conventional: apps import the operator core,
the core imports the shared packages, and nothing imports upward
(`node tools/check-no-app-imports.mjs`, part of the commit gate):

<p align="center">
  <img src="assets/diagrams/repo-layers.svg" alt="Three stacked layers: the apps layer (console, factory, docs) imports the tools operator core (ge.mjs CLI boundary, tools/lib, mcp-server.mjs MCP boundary); the core imports the shared packages layer (@ge/agent-spec, @ge/synthkit, @ge/evalkit, @ge/run-ledger); both edges are labeled imports — never the reverse" width="700">
</p>

| Path | Purpose | Start here when... |
|---|---|---|
| `tools/ge.mjs` | Human CLI over the factory core | Adding or debugging operator commands |
| `tools/lib/factory-core.mjs` | Shared engine used by CLI, console, and MCP | Changing build, ship, sync, doctor, or platform behavior |
| `tools/lib/ledger/run-ledger.mjs` | Local/remote run state and event history | Debugging status, fleet, logs, or resumability |
| `tools/mcp-server.mjs` | MCP surface over factory operations | Letting models or [harnesses](./GLOSSARY.html#harness) (LLM review/driver loops) drive the factory |
| `apps/console/` | React operator UI | Changing Pipeline, Fleet, Activity, Doctor, or agent detail flows |
| `apps/factory/` | Generator, workbench, simulator tooling, factory worker | Changing generated workspaces, data, evals, or simulator integration |
| `apps/factory/simulator-systems/` | Source-system simulator packs | Adding Workday/SAP/etc. behavior without a live system |
| `apps/factory/mcp-service/` | Runtime MCP facade for generated agents | Changing how cloud agents call source-system tools |
| `installer/terraform/` | Cloud project platform | Changing infra, IAM, data stores, Cloud Run, Agent Gateway, or MCP |
| `packages/` | Shared workspace libraries, including the extracted engines: `@ge/synthkit` (deterministic synthetic data — [Synthetic data](./reference/synthetic-data.html)) and `@ge/evalkit` (behavioral eval compiler + metrics — [Evaluation generation](./reference/evaluation-generation.html)). Not all packages are wired in yet; see the [modularization audit](./modularization-audit.html) for per-package integration status | Changing cross-app contracts, an engine, or reusable UI/runtime code |
| `docs/` | GitHub Pages docs | Changing public explanation, guides, reference, or operations docs |

## Mental model

The factory has one stage graph and two execution modes.

| Mode | Runs where | Use it for |
|---|---|---|
| Local | Your machine | Fast iteration, fixture-backed generation, tests, evals, preview checks |
| Remote | Your Google Cloud project | Data load, Agent Runtime deploy, MCP registration, Gemini Enterprise publish |

The build boundary is `previewed`. Stages before it are pure computation and can
run locally. Stages after it touch cloud resources and run through the remote
factory or `ge handoff agents-cli`.

The three platform [planes](./GLOSSARY.html#planes) — the infrastructure
layers `ge up` stands up — are:

<p align="center">
  <img src="assets/diagrams/three-planes.svg" alt="The ge CLI and console call into your Google Cloud project, drawn as one box holding all three planes: the factory plane (Cloud Run gateway, Cloud Tasks queue, worker), the data plane stores (GCS, AlloyDB, Firestore, BigQuery, Bigtable), and the tool plane (Agent Gateway, per-department MCP services, Agent Registry), with the worker reading and writing the other two planes" width="660">
</p>

| Plane | Owns |
|---|---|
| Factory plane | Gateway, worker, Cloud Tasks queue, Cloud Build, run orchestration |
| Data plane | GCS, BigQuery, Bigtable, Firestore, AlloyDB, per-agent data/IAM |
| Tool plane | Per-department MCP services, Agent Registry entries, Agent Gateway |

## Workspace manifest

Every local build writes `.ge/factory/workspaces/<workspace-id>/workspace.json`.
Treat it as the workspace contract for developers and tools:

| Field | Why it exists |
|---|---|
| `source` | The originating use case, department, spec, pipeline, and fixture manifest |
| `agent` | Runtime, entrypoint, agent path, and tool path |
| `commands` | Copyable install, run, test, eval, doctor, repair, sync, and ship commands |
| `generatedFiles` | Required and optional generated files with existence status |
| `readiness` / `quality` | Current local health: mock data, agent, tests, trace, preview, data package |
| `registration` | Whether deploy, registry, runtime, publish, and Gemini Enterprise handoff are ready |
| `artifacts.items` | Validation, trace, preview, deploy, publish, data, and tool-plan artifact inventory |

`ge devex check` validates the local doctor, GitHub Pages links, and generated
workspace contracts. `ge prove` prints the primary workspace path and
manifest path, then gives the next commands to run.

## Development loops

### CLI/core change

1. Edit `tools/ge.mjs` for rendering/command wiring or `tools/lib/*` for behavior.
2. Run the focused test when one exists, then `bun test tools`.
3. Run `ge --json` or the exact command you touched.
4. Update [CLI reference](./reference/cli.html) if flags, commands, or behavior changed.

### Console change

1. Edit `apps/console/src/*`.
2. Run `mise run console`.
3. Exercise the affected view in the browser.
4. Update [Console & APIs](./reference/console-and-apis.html) or
   [Console Tour](./console/) if routes, views, or payloads changed.

### Generator or generated-agent change

1. Edit `apps/factory/src/*` or the relevant generator scripts.
2. Build one canary locally with `mise run mode-local && CANARY=1 mise run build-agents-local`.
3. Inspect the generated workspace under `.ge/factory/workspaces/`.
4. Run evals when the change affects behavior contracts.
5. Update [Agent generation](./reference/agent-generation.html),
   [Spec schema](./reference/spec-schema.html), or [OKF](./reference/okf.html).

### Simulator change

1. Add or edit a pack under `apps/factory/simulator-systems/`.
2. Validate the pack with the simulator tooling.
3. Build a canary that uses the system.
4. Update [Simulator systems](./reference/simulator-systems.html) and the
   [Bring your own simulator](./cookbooks/generate-simulations.html) cookbook
   when the pack contract changes.

### Cloud platform change

1. Edit `installer/terraform/` or cloud-facing factory code.
2. Run `ge doctor` before and after the change.
3. Prefer `ge infra plan` before any apply.
4. Update [Architecture](./reference/architecture.html), [Operations](./OPERATIONS.html),
   or [MCP](./MCP.html) if IAM, ingress, service names, data stores, or stage
   ownership changed.

## Quality gates

Use the smallest gate that proves the change, then run the broader gate before
merging shared behavior.

| Change type | Focused check | Broader check |
|---|---|---|
| Docs only | `bun run docs:check` and local Jekyll build if Ruby is available | `mise run devex-check` |
| CLI/core | `bun test tools` and the touched `ge` command | `mise run devex-check`, then `mise run ci` |
| Console | `bun run build:console` | `mise run ci` |
| Presentation | `bun run build:presentation` | `mise run ci` |
| Generator | Relevant `apps/factory` tests | `mise run ci` plus canary build |
| Python simulator runtime | `bun run test:py` | `mise run ci` plus simulator conformance test |
| Terraform/platform | `ge infra plan`, `ge doctor` | Canary bootstrap in a test project |

`mise run ci` mirrors `cloudbuild.ci.yaml`: source hygiene → `bun run typecheck` →
the catalog build → `bun run docs:gate` → `bun run test:gated` (the last one
wraps `bun test apps tools packages` and cross-checks failures against
`tools/known-test-failures.json` — see AGENTS.md's "Before you commit"
section).

## Documentation rules

The docs should stay purpose-first and executable.

- Start each page by saying why the thing exists.
- Keep commands copyable from the repo root unless the page says otherwise.
- Name whether commands are read-only, local-mutating, or cloud-mutating.
- Link concepts to reference and reference to cookbooks.
- When behavior changes, update docs in the same change as code.
- Prefer source paths over vague component names.

## Where to go next

| Question | Read |
|---|---|
| Why is the factory shaped this way? | [Concepts](./concepts/) |
| What command or field do I need? | [Reference](./reference/) |
| How do I complete a task? | [Cookbooks](./cookbooks/) |
| How do I deploy or recover it? | [Operations](./OPERATIONS.html) |
| How does MCP fit in? | [MCP](./MCP.html) |
