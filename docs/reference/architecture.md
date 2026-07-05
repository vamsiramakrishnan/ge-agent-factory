---
title: Architecture
parent: Reference
nav_order: 2
layout: default
---

# Architecture

The factory turns a business use case into a generated, tested, deployable agent.
It is organized into three **planes** and runs in one of two **modes**. Release
builds use a **durable control plane** (ADR 0001) so that work survives a laptop
closing and is observable from one place — the **run ledger**.

See also: the rendered diagram at
[`docs/architecture.svg`](https://github.com/vamsiramakrishnan/ge-agent-factory),
and [ADR 0001 — remote control plane](https://github.com/vamsiramakrishnan/ge-agent-factory)
(`docs/adr/0001-remote-control-plane.md`).

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## The three planes

<p align="center">
  <img src="../assets/diagrams/three-planes.svg" alt="The ge CLI and console call into your Google Cloud project, drawn as one box holding all three planes: the factory plane (Cloud Run gateway, Cloud Tasks queue, worker), the data plane stores (GCS, AlloyDB, Firestore, BigQuery, Bigtable), and the tool plane (Agent Gateway, per-department MCP services, Agent Registry), with the worker reading and writing the other two planes" width="660">
</p>

| Plane | What it is | Provisioned by |
|---|---|---|
| **Factory plane** | Orchestration + build: the `ge` CLI, the Cloud Run **gateway**, the **worker**, and the **Cloud Tasks** stage queue | `installer/terraform/` (`cloud_run.tf`, `tasks.tf`, `service_accounts.tf`) |
| **Data plane** | Shared + per-agent data stores: GCS bucket, **AlloyDB** (Postgres) cluster, **Firestore**, BigQuery, Bigtable, and the AlloyDB DSN secret | `installer/terraform/data_plane.tf`, `firestore.tf` |
| **Tool (MCP) plane** | Per-department custom MCP services + the **Agent Registry**, fronted by the managed **Agent Gateway** | `installer/terraform/agent_gateway.tf`; `ge mcp deploy` |

`ge up` stands up all three (`infra` → `data` → `mcp`) and runs the unified
doctor. `ge data up` and `ge mcp deploy` provision the data and tool planes
independently.

---

## Local vs remote mode

Mode is stored in `.ge.json` (`ge mode local | remote`) and dictates **where the
work runs**. The split point is the **build boundary** — the `previewed` stage.

### Local mode (`provisionLocal`)

Driven by `core.provisionLocal` in
[`tools/lib/factory-core.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory).
Stages **up to the build boundary** run on the operator's machine via the
Antigravity harness (`apps/factory/`):

```
created → validated → harness_reviewed → harness_refined → data_packaged → previewed
```

- Output: generated workspaces under `.ge/factory/workspaces/` + a
  `factory-events.jsonl` live stream.
- Ledger writes to a local SQLite store.
- Deploy / register / publish are cloud steps — hand the checked workspace off
  with `ge handoff agents-cli` (or switch to remote mode).

### Remote mode (`provision`)

Driven by `core.provision`. The CLI **submits** the build intent to the gateway
and observes; the cloud worker runs all stages through to publish (or stops at the
requested `targetStage`). The durable ledger (Firestore + AlloyDB) records the
run state.

---

## The durable control plane (ADR 0001)

A remote build is a chain of HTTP tasks, one per `(runId, item, stage)`:

<p align="center">
  <img src="../assets/diagrams/durable-control-plane.svg" alt="ge CLI to gateway to Cloud Tasks to worker to the Firestore/AlloyDB ledger, looping until the run completes" width="700">
</p>

- **Gateway** (`ge-agent-factory-gateway`, `cloud_run.tf`) authenticates the
  caller and enqueues stage tasks; the gateway service account holds
  `roles/cloudtasks.enqueuer`.
- **Cloud Tasks queue** (`tasks.tf`) dispatches one HTTP task per stage with
  retries + exponential backoff. Each task carries an OIDC token signed as the
  **runner** service account, with the worker URL as audience.
- **Worker** (`ge-agent-factory-worker`,
  [`apps/factory/src/factory-worker.js`](https://github.com/vamsiramakrishnan/ge-agent-factory))
  restores the workspace, runs the stage, records the stage event to Firestore +
  AlloyDB, streams bounded log frames, and enqueues the next stage. It runs as the
  runner SA (Firestore, AlloyDB, GCS, Secret Manager access).

The stages themselves, in execution order, each colored by the component that
owns it (this diagram is generated from `FACTORY_STAGE_GRAPH` in
`apps/factory/src/factory-orchestration.js` — `bun run docs:stage-diagram`):

<p align="center">
  <img src="../assets/diagrams/factory-stages.svg" alt="the factory stage graph in execution order, from plan through generate/package/refine/validate/preview to deploy, register, publish, and verify-live, with each stage colored by its owner: control plane (blue), Cloud Run service (grey), Cloud Build (green), or Cloud Tasks (dark blue)" width="800">
</p>

This replaces the original model where the operator's laptop ran the whole fleet:
the control plane is now Cloud Tasks + a Cloud Run worker + a Firestore/AlloyDB
ledger, durable across restarts.

### Stations vs. milestones — two stage vocabularies, one line

You will meet **two different stage name sets** and both are correct — they
name different things. Execution uses **stations** (verbs — the work a stage
*does*), from `FACTORY_STAGE_GRAPH` in
`apps/factory/src/factory-orchestration.js`. Everything that reports
*progress* — `ge agents status`, `ge ledger plan`, the run ledger, the
pipeline state machine — uses **milestones** (past-tense states an item has
*reached*), from `LEDGER_STAGES` in `packages/run-ledger/src/store.mjs`.
Reading `generate_workspace` in a worker log and then seeing `created` in
`ge agents status` is the same item, described from the other side:

| Station (does the work) | Milestone recorded (what status reports) |
|---|---|
| `plan` | `planned` |
| `generate_workspace`, `generate_data` | `created` |
| `package_data` | `data_packaged` |
| `harness_refine` | `harness_reviewed`, then `harness_refined` |
| `validate` | `validated` |
| `preview` | `previewed` — the **build boundary** in both vocabularies |
| `plan_deploy` | `deploy_planned` |
| `load_data` | (no dedicated milestone — release-movement prep) |
| `deploy_runtime`, `poll_runtime` | `deploying`, then `deployed` |
| `register_tools` | `registered` |
| `publish_enterprise` | `publish_planned`, then `published` |
| `verify_live` | (no dedicated milestone — verification report artifact) |

Milestones are listed in the ledger's canonical order (its reducer only ever
advances an item forward through that list); station order is the cloud
line's execution order — the two orderings differ slightly in the middle
movement, which is expected, not drift.

The retry metadata on each stage (`RETRY_POLICIES`) describes how an operator
*may* safely retry a stage — it is **metadata, not an automatic
retry engine**; nothing re-executes a stage from those values today.

### The skill matrix — stations to commands, engines, and docs

Every station skill maps to the `ge` commands it drives, the engine packages
behind those commands, and the reference docs that describe them. The table is
rendered from `skills/skill-routing.json`, `FACTORY_SKILL_BINDINGS`
(`apps/factory/src/skill-registry.js`), and the shared command registry
(`tools/lib/ge-command-registry.mjs`), so it cannot drift from those sources:

<!-- BEGIN GENERATED: skill-matrix — do not edit; run `bun run docs:skill-matrix` -->
| Station skill | Capability | `ge` commands | Engine packages | Reference docs |
|---|---|---|---|---|
| [`installing-the-factory`](../../skills/installing-the-factory/) | `factory_install` | `ge doctor`, `ge prove` | — | [`getting-started.md`](../start/getting-started.md) |
| [`navigating-factory-line`](../../skills/navigating-factory-line/) | `factory_line` | — | — | [`architecture.md`](architecture.md), [`atomic-capabilities.md`](atomic-capabilities.md) |
| [`interviewing-specs`](../../skills/interviewing-specs/) | `spec_interview` | `ge capture`, `ge agents register` | [`@ge/agent-spec`](../../packages/agent-spec/) | [`spec-schema.md`](spec-schema.md) |
| [`planning-missions`](../../skills/planning-missions/) | `mission_planning` | — | — | — |
| [`running-factory`](../../skills/running-factory/) | `factory_run` | `ge pipeline run`, `ge daemon start`, `ge prove`, `ge agents build`, `ge agents build --local`, `ge agents sync`, `ge evals compile` | [`@ge/evalkit`](../../packages/evalkit/) | [`agent-generation.md`](agent-generation.md), [`evaluation-generation.md`](evaluation-generation.md) |
| [`building-simulators`](../../skills/building-simulators/) | `simulator_build` | `ge data synth`, `ge pipeline run`, `ge daemon start` | [`@ge/synthkit`](../../packages/synthkit/) | [`synthetic-data.md`](synthetic-data.md), [`simulator-systems.md`](simulator-systems.md) |
| [`checking-workspaces`](../../skills/checking-workspaces/) | `workspace_check` | — | [`@ge/agent-workspace`](../../packages/agent-workspace/) | — |
| [`running-release`](../../skills/running-release/) | `release_run` | `ge handoff`, `ge agents status`, `ge agents logs` | — | — |
| [`admitting-agents`](../../skills/admitting-agents/) | `release_admission` | `ge passport emit`, `ge passport verify`, `ge passport admit`, `ge handoff` | [`@ge/admission`](../../packages/admission/) | [`admission.md`](admission.md), [`admit-an-agent.md`](../cookbooks/admit-an-agent.md), [`agent-passport-and-proof-pack.md`](../concepts/agent-passport-and-proof-pack.md) |
| [`driving-live-proof`](../../skills/driving-live-proof/) | `live_proof` | `ge evals compile`, `ge drive`, `ge prove --live`, `ge bench` | [`@ge/evalkit`](../../packages/evalkit/) | [`evaluation-generation.md`](evaluation-generation.md), [`metric-applicability.md`](metric-applicability.md), [`live-transcript.md`](live-transcript.md), [`live-budgets.md`](live-budgets.md) |
| [`operating-console`](../../skills/operating-console/) | `console_operation` | `ge daemon start` | — | [`console-and-apis.md`](console-and-apis.md) |
| [`recording-evidence`](../../skills/recording-evidence/) | `evidence_recording` | — | [`@ge/run-ledger`](../../packages/run-ledger/) | — |
| [`operating-the-factory`](../../skills/operating-the-factory/) | `factory_operation` | `ge agents status`, `ge doctor`, `factory list-usecases` | — | [`agent-operability.md`](agent-operability.md), [`cli.md`](cli.md) |
| [`standing-up-the-platform`](../../skills/standing-up-the-platform/) | `platform_readiness` | `ge up`, `ge data up`, `ge mcp deploy`, `ge doctor`, `ge mcp doctor` | — | [`config.md`](config.md), [`architecture.md`](architecture.md) |
| [`deploying-the-control-plane`](../../skills/deploying-the-control-plane/) | `control_plane_deploy` | — | — | [`architecture.md`](architecture.md) |
| [`grounding-interviews-with-documents`](../../skills/grounding-interviews-with-documents/) | `document_grounding` | `ge capture` | — | [`spec-schema.md`](spec-schema.md) |
| [`managing-access`](../../skills/managing-access/) | `access_control` | — | — | — |
| [`triaging-runs`](../../skills/triaging-runs/) | `run_triage` | `ge agents status`, `ge agents logs` | — | — |
| [`guarding-the-factory`](../../skills/guarding-the-factory/) | `factory_safety` | — | — | — |
| [`authoring-okf-specs`](../../skills/authoring-okf-specs/) | `knowledge_format` | `ge okf customize`, `ge agents register`, `ge agents track` | [`@ge/okf`](../../packages/okf/) | [`okf.md`](okf.md), [`agent-lifecycle.md`](agent-lifecycle.md) |
<!-- END GENERATED: skill-matrix -->

---

## The run ledger

The ledger is the **single source of truth** for runs — local and remote — read
by `ge ledger *`, `ge fleet`, and the console.

- **API** ([`tools/lib/run-ledger.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory)):
  `startRun`, `recordTransition`, `completeRun`, `getRun`, `listRuns`,
  `events(runId, {afterSeq})`, `fleetByUseCase`, `recordReset`, `backfill`.
- **Three tables**: `ledger_runs` (one row per run), `ledger_work_items` (latest
  state per use case / workspace), `ledger_events` (monotonic `seq`-indexed event
  log for live tail + reconnect dedup).
- **Backends**:
  - Local / test → **SQLite** (`bun:sqlite`, fallback `better-sqlite3`).
  - Cloud control plane → **AlloyDB / Postgres** via a `pg` adapter; the DSN comes
    from the `ge-agent-alloydb-dsn` Secret Manager secret.
  - **Firestore** mirrors the event stream for the live console
    ([`tools/lib/run-ledger-firestore.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory),
    `normalizeFirestoreLedgerEvent`).
- If no driver is available, callers fall back to the legacy on-disk
  `.ge-state.json` / `factory-run-*.json` / `factory-events.jsonl`.

`ge ledger backfill` imports legacy on-disk state into the ledger.

---

## Request / auth flow

| Hop | Auth | Required role |
|---|---|---|
| CLI → gateway | gcloud identity token (`gcloud auth print-identity-token`, audience = gateway URL) | `roles/run.invoker` on the gateway for the active identity |
| gateway → Cloud Tasks | gateway service account | `roles/cloudtasks.enqueuer` |
| Cloud Tasks → worker | OIDC token signed as the **runner** SA (audience = worker URL) | inherited from the runner SA |
| worker → data plane | workload identity (runner SA) | `roles/alloydb.client`, `roles/datastore.user`, GCS + `secretmanager.secretAccessor` |

The CLI talks to the gateway in one of two transports: a `gcloud run services
proxy` tunnel (the default, no public ingress needed) or a direct HTTPS call with
a bearer ID token. The managed **Agent Gateway** governs the MCP plane — only its
Service Extensions identity holds `roles/run.invoker` on the MCP services.

> The exact CLI→gateway request payload shape and the optional legacy IAP
> load-balancer path are referenced in ADR 0001 and the Terraform module but were
> not line-by-line verified here. Treat those specifics as advisory and confirm
> against `factory-core.mjs` / `installer/terraform/` before relying on them.
{: .warning }
