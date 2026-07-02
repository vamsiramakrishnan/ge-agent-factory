---
title: Modularization audit
layout: default
nav_exclude: true
---

# Modularization Audit

## First Package Wave

| Package | Source Boundary | Standalone Purpose |
| --- | --- | --- |
| `@ge/agent-workspace` | Generated workspace path and manifest contract | Lets generators, validators, and promotion gates inspect or create generated-agent workspaces without importing `apps/factory`. |
| `@ge/runtime` | Runtime event, blocker, artifact, and resume-plan normalization | Lets daemon, CLI, UI, and future remote workers share one tested runtime contract. |
| `@ge/simulator-packs` | `apps/factory/simulator-systems` corpus facade | Gives simulator packs a package identity, manifest, and validator before the large corpus is physically moved. |
| `generated-agent-runtime` | Repeated Python helpers in generated agents | Provides reusable callbacks, evidence capture, action events, fixture document helpers, and MCP backend selection for generated agents. |
| `@ge/factory-install` | Installer/Terraform/build/runtime env contract | Makes deployment inputs, outputs, runtime targets, and command plans inspectable without running Terraform or shell scripts. |

## First Wave integration status

> Status as of **2026-07-02**, re-verified by grepping the tree for importers
> of each package (by `@ge/*` specifier, by relative path into `src/`, and by
> `package.json` dependency declarations). "Standalone-only" means the package
> has **zero importers outside its own directory and tests** — the concern it
> models is served in production by a separate, un-synced implementation,
> listed in the last column.
{: .status }

The table above describes each package's *intended* standalone purpose. This
one describes what is actually wired in today:

| Package | Status | Real call sites today |
| --- | --- | --- |
| `@ge/runtime` | **Wired in** — declared `workspace:*` dependency, imported by specifier | `tools/lib/events.mjs` and `tools/lib/runtime-contract.mjs` (re-export `@ge/runtime/events` / `@ge/runtime/contract`), `apps/factory/src/harness-runner.js` (`splitLines`) |
| `@ge/agent-workspace` | **Partially wired** — consumed, but only via a deep relative import from `apps/factory` itself; not a declared dependency, and nothing imports the `@ge/agent-workspace` specifier | `apps/factory/src/workspace-contract.js` imports `packages/agent-workspace/src/index.mjs` by relative path and re-exports it; the 20+ downstream consumers (promotion packet, workspace validation/doctor, `tools/lib/factory-local-ops.mjs`, …) all route through that wrapper |
| `@ge/simulator-packs` | **Standalone-only** — zero external importers; the facade's manifest just points back at the live corpus | Packs are actually loaded/validated by `apps/factory/scripts/factory/simulators/registry.mjs` (`loadSimulatorRegistry`) over `apps/factory/simulator-systems/` (plus `simulator-sdk.mjs`, `generate-simulator-data.mjs`, `scaffold-simulator-pack.mjs`) |
| `generated-agent-runtime` (Python) | **Standalone-only** — zero external importers; no generated agent depends on it (`generated-agents/*/pyproject.toml` lists only `google-adk`/`pydantic`/`pytest`) | The same helpers (callbacks, evidence capture, action events, MCP backend selection) are emitted as **inline copies** into every agent's `app/tools.py` / `app/agent.py` by `apps/factory/scripts/factory/runtime/tools-backend.mjs` and `apps/factory/scripts/factory/agents/render-agent-py.mjs` |
| `@ge/factory-install` | **Standalone-only** — zero external importers; nothing in-repo invokes its `ge-factory-install` bin (by design it never executes Terraform/shell, but nothing reads its plan contract either) | Install/deploy logic actually lives in `installer/terraform/*`, `installer/build-and-deploy.sh`, `installer/scripts/*` (see `installer/factory-install.md`) |

> **Open decision — wire in or retire.** For each standalone-only package the
> options are: (a) make the live call site consume the package (and delete
> the duplicate), or (b) retire the package until the extraction is
> scheduled. That is a product/roadmap call, deliberately **not** made in this
> document. Until it is made, treat the packages' own tests as contract
> documentation, not as coverage of production behavior — the live
> implementations in the last column can and do drift independently.
{: .warning }

## Larger Candidates

| Candidate | Why It Should Become Standalone |
| --- | --- |
| `@ge/mock-generator` | The generator currently mixes CLI orchestration, simulator selection, schema projection, fixture generation, and generated workspace emission. Splitting it would let mock generation run as a library, CI task, or service. |
| `@ge/factory-control` | Factory request submission, task queueing, and ledger surfaces can become an API package shared by gateway, console, tests, and external automation. |
| `@ge/factory-gateway` | HTTP/auth/IAP/OIDC gateway behavior is deployable as its own service package, separate from installer and generated-agent code. |
| `@ge/eval-contracts` | Evalset, optimizer, golden behavior, and promotion packet shapes are reusable by generated agents, harness tests, and release gates. |

## Parallelism Model

The repo can be audited and split in parallel by ownership boundary:

- CLI/runtime packages.
- Generated-agent Python runtime.
- Simulator corpus and mock data.
- Frontend shared contracts/design/UI.
- Installer and deployment contracts.
- Generated workspaces and promotion/eval artifacts.

Implementation can also run in parallel when each worker owns a disjoint write set. The main integration risk is cross-boundary imports, especially any cycle where `tools/` imports `apps/` while `apps/` imports `tools/`.

## Why Care If Upstream Has A Sage Checkpoint

An upstream checkpoint is a source-of-truth safety net, not a package boundary. Standalone packages still matter because they give the repo:

- Independent tests for contracts that multiple apps rely on.
- Versioned interfaces instead of implicit path imports.
- Smaller dependency surfaces for generated agents, CLIs, services, and CI jobs.
- The ability to run or publish one subsystem without cloning operational state from the whole monorepo.
- Clear ownership when a service, generated workspace, or installer contract changes.

The checkpoint helps recover state. Packages help prevent ambiguous coupling from becoming the default state.
