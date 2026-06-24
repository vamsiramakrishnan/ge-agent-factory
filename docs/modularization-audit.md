# Modularization Audit

## First Package Wave

| Package | Source Boundary | Standalone Purpose |
| --- | --- | --- |
| `@ge/agent-workspace` | Generated workspace path and manifest contract | Lets generators, validators, and promotion gates inspect or create generated-agent workspaces without importing `apps/ge-demo-generator`. |
| `@ge/runtime` | Runtime event, blocker, artifact, and resume-plan normalization | Lets daemon, CLI, UI, and future remote workers share one tested runtime contract. |
| `@ge/simulator-packs` | `apps/ge-demo-generator/simulator-systems` corpus facade | Gives simulator packs a package identity, manifest, and validator before the large corpus is physically moved. |
| `generated-agent-runtime` | Repeated Python helpers in generated agents | Provides reusable callbacks, evidence capture, action events, fixture document helpers, and MCP backend selection for generated agents. |
| `@ge/factory-install` | Installer/Terraform/build/runtime env contract | Makes deployment inputs, outputs, runtime targets, and command plans inspectable without running Terraform or shell scripts. |

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
