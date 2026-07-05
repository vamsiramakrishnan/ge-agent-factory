---
title: Atomic capabilities
parent: Reference
nav_order: 14
layout: default
description: The end-to-end system as composable atomic capabilities — every capability with its CLI verb, console route, MCP tool, and skill, each independently drivable by a human, a CI job, the console, or an AI assistant.
---

# Atomic capabilities

The factory is not one monolithic flow — it is a set of **atomic
capabilities**, each with the same four faces:

- a **CLI verb** a human runs at a terminal (`bun tools/ge.mjs …`);
- **`--json`** on that same verb for CI jobs and scripts (structured result
  on stdout, progress on stderr — byte-identical for subprocess callers, no
  flags needed when stdout is not a TTY);
- a **console route** under `/api/ge/*` (generated from the same command
  registry — see [Console & APIs](console-and-apis.html));
- an **MCP (Model Context Protocol) tool** (`factory_*`) plus a **skill** for
  AI assistants and agent harnesses (see [MCP tools](../MCP.html) and
  [`skills/`](https://github.com/vamsiramakrishnan/ge-agent-factory/tree/main/skills)).

One command registry (`packages/capability-registry/src/registry.mjs`) wires all four, so
a capability's route, CLI invocation, and MCP schema cannot drift apart. The
consequence is the point of this page: **every capability is independently
drivable** — you can plug in your own inputs and use any one of them without
the others.

The registry holds 54 capabilities today, each validated against the closed
vocabularies in `@ge/core-api` (`packages/core-api/src/capability.mjs` —
risk levels, preflight requirement keys, observability modes, MCP parameter
types) via `assertCapabilityTable()`, called once at import time. A
malformed entry — an unknown risk level, a route two commands both claim, an
MCP tool name two entries share — fails every surface (CLI, console, MCP
server) before any of them serve a single request, not just the one you
happened to exercise. See [Architecture — the capability kernel](architecture.html#the-capability-kernel)
for how the check works.

## The map

| Capability | CLI verb | `--json` | Console route | MCP tool | Skill |
| --- | --- | --- | --- | --- | --- |
| Capture the contract | `ge capture` | yes | — (capture *is* the console Interview) | `factory_capture` | `interviewing-specs` |
| Review the spec | `ge capture --from <agent-spec.json>` (register) | yes | `#/spec-review/:usecaseId` view + `/api/interviews/:id/*` | — | `grounding-interviews-with-documents` |
| Compile evals | `ge evals compile` | yes | `POST /api/ge/evals/compile` | `factory_evals_compile` | `driving-live-proof` |
| Build the agent | `ge agents build` (`--local` for on-machine) | yes | `POST /api/ge/agents/build` | `factory_agents_build` | `running-factory` |
| Generate dependency data | `ge pipeline run` | yes | — (observed via `/api/runtime/*`) | — | `building-simulators` |
| Synthesize seed data | `ge data synth` | yes | `POST /api/ge/data/synth` | `factory_data_synth` | `building-simulators` |
| Prove locally | `ge prove` | yes | `POST /api/ge/prove` | `factory_prove` | `checking-workspaces` |
| Hand off & ship | `ge handoff` | yes | `POST /api/ge/handoff` | `factory_handoff` | `running-release` |
| Drive live | `ge drive` | yes | `POST /api/ge/drive` | `factory_drive` | `driving-live-proof` |
| Prove live | `ge prove --live` | yes | `POST /api/ge/prove/live` | `factory_prove_live` | `driving-live-proof` |
| Bench | `ge bench` | yes | `POST /api/ge/bench` | `factory_bench` | `driving-live-proof` |

Supporting operator tools exist alongside these — read-only checks
(`factory_doctor`, `factory_status`, `factory_logs`, `factory_usecases_list`,
`factory_mcp_doctor`, `factory_systems_doctor`, `factory_byo_doctor`,
`factory_models_doctor`, `factory_console_doctor`, `factory_quality_audit`,
`factory_evals_verify`, `factory_evals_coverage`, and the Agent Library reads
`factory_library_stats/search/inspect/status`), local-only compiles and
imports (`factory_evals_import`, `factory_enrich_plan`, `factory_handoff_plan`,
`factory_handoff_package`, `factory_handoff_verify_package`), and mutating
operator actions (`factory_sync`, `factory_mcp_deploy`,
`factory_systems_bind`/`unbind`, `factory_byo_apply`,
`factory_library_create`) — the authoritative list is the registry itself
(54 entries as of this writing); see [MCP tools](../MCP.html) for the full
tool-by-tool breakdown.

## Using each capability standalone

**Capture the contract** (`ge capture`). Opens the console Interview and
returns the deep link; `--from <agent-spec.json>` registers a contract you
authored elsewhere — the standalone entry point for teams that already have
specs. See [Capture a contract](../cookbooks/capture-from-interview.html).

**Review the spec.** The console's spec-review view
(`#/spec-review/:usecaseId`) inspects and edits a captured contract; the
interview APIs (`/api/interviews/:id/*`) upload grounding documents, write
the spec artifact, and render its OKF (Open Knowledge Format) form.
Standalone use: point it at any registered contract — nothing downstream
needs to exist yet.

**Compile evals** (`ge evals compile`). Bring your own spec: `--spec` accepts
any `GenerationSpecEnvelope` JSON, no capture step required, and the output
evalset/dataset/load-profile are plain files any runner can consume. See
[Compile behavioral evals](../cookbooks/compile-behavioral-evals.html).

**Build the agent** (`ge agents build`). Compiles contracts into generated
workspaces — through the cloud factory, or entirely on-machine with
`--local`. Standalone: `--ids`/`--dept` scope it to exactly the contracts you
name. See [Compile a contract](../cookbooks/compile-a-contract.html).

**Generate dependency data** (`ge pipeline run`). Runs spec, data, simulator,
build, eval, and preview gates as one resumable run — the data/simulation
stages are how a workspace gets deterministic source-system data. Standalone:
run it against a single use case and stop at the stage you need; poll with
`ge pipeline status <run-id>`. See
[Generate simulations](../cookbooks/generate-simulations.html).

**Synthesize seed data** (`ge data synth`). Realizes one simulator pack's
deterministic `seed.json` from its contract — no capture, build, or pipeline
run required. Standalone: `--pack <dir>` takes any directory of pack JSON,
`--stdout` pipes the seed to your own tooling, and `--profile realistic`
switches on the statistical realism tier. See
[Synthetic data](synthetic-data.html).

**Prove locally** (`ge prove`). The dispatch rule needs no flags: fresh
machine → health check plus first validated workspace; workspaces present →
rebuild their proof. `--watch` re-proves on contract change. Standalone: it
only touches local computation up to the build boundary. See
[Prove an agent](../cookbooks/prove-an-agent.html).

**Hand off & ship** (`ge handoff agents-cli`). Uploads proven local builds
and runs deploy → register → publish remotely. Standalone: it takes whatever
workspaces passed the gate — it does not care how they were produced. See
[Hand off to agents-cli](../cookbooks/handoff-agents-cli.html).

**Drive live** (`ge drive`). Talks to *any* deployed assist surface —
factory-built or not: `--ge-app` takes a full engine resource name and
`--assistant` any assistant on it; cassettes make it fully offline. Of every
capability here, this one asks the least about where its inputs came from.
See [Drive a shipped agent](../cookbooks/drive-a-shipped-agent.html).

**Prove live** (`ge prove --live`). Runs any evalset compatible with ADK
(Agent Development Kit) — compiled, recorded, or hand-written — against any
deployed agent (`--ge-app`/`--assistant`) or a cassette. Cost caps
(`--max-cases`, `--max-turns`) make the live version safe to script. See
[Prove the shipped agent live](../cookbooks/prove-live.html).

**Bench** (`ge bench`). Budgets from `.ge.json`, load shape from flags or a
compiled profile, target from config/`--ge-app`, or a cassette for a free
deterministic run; `--export k6` hands the load definition to your own
tooling. See [Bench against live budgets](../cookbooks/bench-live-budgets.html).

## One capability, four drivers

The same capability composes into whichever loop you are building:

- **Human at a TTY** — the `ge` verb renders a short human summary and the
  exact next command.
- **CI job** — the same verb with `--json` (or a non-TTY stdout) emits one
  structured result object; exit codes carry the verdict. Cassettes keep the
  live capabilities deterministic and free in CI.
- **Console** — `POST /api/ge/<route>` runs the identical command through the
  job runner, with the registry's risk level and preflight requirements
  enforced before dispatch.
- **AI assistant** — the MCP tools (`bun tools/mcp-server.mjs`) expose the
  same registry entries with typed schemas; the skills under `skills/` teach
  an agent harness when and how to sequence them, with
  `guarding-the-factory` as the shared safety rail.
