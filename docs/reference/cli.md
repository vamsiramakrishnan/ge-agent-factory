---
title: CLI
parent: Reference
nav_order: 1
layout: default
---

# CLI reference

The factory exposes three command surfaces:

- **`ge`** — the human/operator CLI (`bun tools/ge.mjs`). Lifecycle: set up the
  machine → stand up the platform → run agents.
- **`factory`** — the lower-level generator CLI
  (`node apps/factory/scripts/factory.mjs`) that emits one agent
  workspace step by step.
- **`mise run <task>`** — task runner that wraps both for the common flows.

`ge` is a thin renderer over `tools/lib/factory-core.mjs`. Every command accepts
`--json` (structured result on stdout, progress on stderr); the MCP server drives
the same core for model/harness callers.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## `ge` — operator CLI

Source: [`tools/ge.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory).
Install with `mise run install` (writes `~/.local/bin/ge` → `bun tools/ge.mjs`), or
call `bun tools/ge.mjs <cmd>` directly.

Config resolves with precedence **flag → env → `.ge.json` → default** —
`ge config explain` shows each value and its source. The local runtime daemon
(`ge daemon`) defaults to port **17654** (`GE_DAEMON_PORT`).

The command reference below is generated from the citty command tree in
[`tools/ge.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory) —
the same source `ge --help` renders — so it cannot drift from the CLI.

<!-- BEGIN GENERATED: ge-command-tree — do not edit; run `bun run docs:cli` -->
### Shared flags

Every `ge` command accepts these shared flags (omitted from the per-command tables below):

| Flag | Type | Description |
|---|---|---|
| `--json` | boolean | Machine-readable JSON result on stdout |
| `--project` / `--gcp-project` | string | GCP project id |
| `--region` | string | Region (default us-central1) |
| `--agentIdentityOrgId` | string | Organization ID for Agent Identity principalSet trust domain |

### `ge`

GE Agent Factory — set up · stand up · run agents. Bare `ge` shows status + next step.

### `ge up`

Stand up the platform: infra + data + tool planes → unified doctor (--infra/--data/--mcp for one)

| Flag | Type | Description |
|---|---|---|
| `--infra` | boolean | Stand up the infra plane only (combinable with --data/--mcp) |
| `--data` | boolean | Stand up the data plane only (combinable with --infra/--mcp) |
| `--mcp` | boolean | Stand up the tool (MCP) plane only (combinable with --infra/--data) |

### `ge doctor`

Unified health: toolchain · factory · data plane · tool plane (--local/--cloud/--data/--mcp to filter). Narrower scoped checks: `ge data doctor` (data plane only), `ge mcp doctor` (tool plane / MCP services only).

| Flag | Type | Description |
|---|---|---|
| `--local` | boolean | Include the uv toolchain section |
| `--cloud` | boolean | Only the factory section |
| `--data` | boolean | Only the data plane section |
| `--mcp` | boolean | Only the tool plane section |
| `--command` | string | Check readiness for a mutating command (up\|data.up\|mcp.deploy\|agents.build\|agents.build.local\|agents.ship\|agents.sync) |

### `ge init`

Discover config (terraform outputs → gcloud) → .ge.json

### `ge cutover`

Adopt a hand-managed project into Terraform (plan by default; --apply to run)

| Flag | Type | Description |
|---|---|---|
| `--apply` | boolean | Execute the steps (default: print the plan) |

### `ge mode`

Show or set the operating mode: local (build on this machine) | remote (cloud factory)

| Flag | Type | Description |
|---|---|---|
| `<set>` | positional | local \| remote |

### `ge devex`

Developer-experience checks and one-command local smoke paths

### `ge devex check`

Fast DevEx gate: local doctor, docs links, and workspace manifest contracts

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Workspace or use-case id to check (default: generated use-case workspaces) |
| `--all-workspaces` | boolean | Also check scratch/test workspaces without a use-case id |
| `--no-docs` | boolean | Skip local docs link checks |
| `--no-local` | boolean | Skip local toolchain doctor checks |
| `--no-strict-workspaces` | boolean | Warn instead of fail on missing generated workspace files |

### `ge devex smoke`

One-command local DevEx proof: doctor → local mode → canary workspace manifest

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Use-case id to build (default: catalog canary) |
| `--target` | string | Local harness target (default validated; use previewed for full build boundary) |
| `--preview` | boolean | Shortcut for --target previewed (may require project/Vertex auth) |
| `--vertex` | boolean | Use Vertex-backed harness stages when target reaches them |
| `--no-vertex` | boolean | Disable Vertex-backed harness stages |
| `--warm` | boolean | Pre-warm the shared uv cache before running |
| `--force` | boolean | Regenerate matching local workspace(s) from scratch |

### `ge config`

Operator config: explain (precedence/sources)

### `ge config explain`

Show each config value and where it came from (flag · env · .ge.json · default)

| Flag | Type | Description |
|---|---|---|
| `--projectNumber` | string | GCP project number override |
| `--gatewayUrl` | string | Factory gateway URL override |
| `--geApp` | string | Gemini Enterprise app id override |
| `--mode` | string | Operating mode override (local\|remote) |
| `--agentsRepo` | string | Generated-agents git repo override |
| `--bucket` | string | GCS bucket override |

### `ge pipeline`

The spec-to-deploy pipeline: plan · run · status · resume · graph · runs

### `ge pipeline plan`

Show the pipeline plan for a spec/scenario (stages, owners, first commands)

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |

### `ge pipeline run`

Start a pipeline run: the durable orchestration graph on the daemon

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |
| `--workspace` | string | Scenario workspace path (default .ge/missions/<scenario>) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--with-factory` | boolean | Actually schedule the factory build node |
| `--no-antigravity` | boolean | Do not include the Antigravity spec/data review node |
| `--harness-agent` | string | Harness agent for the review node (default antigravity-sdk) |
| `--model` | string | Model for the Antigravity review node |
| `--location` | string | Location for the Antigravity review node |
| `--follow` | boolean | Stay attached and stream the run's live events |

### `ge pipeline status`

Pipeline status: bare → the live stage view; with an id → that run's graph + resume plan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional | Pipeline run id (omit for the stage view) |
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |

### `ge pipeline resume`

Resume a pipeline run via its deterministic resume plan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Pipeline run id |
| `--port` | string | Daemon port (default 17654) |

### `ge pipeline graph`

Build the pipeline's orchestration DAG without running it

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |
| `--workspace` | string | Scenario workspace path (default .ge/missions/<scenario>) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--with-factory` | boolean | Actually schedule the factory build node |
| `--no-antigravity` | boolean | Do not include the Antigravity spec/data review node |
| `--harness-agent` | string | Harness agent for the review node (default antigravity-sdk) |
| `--model` | string | Model for the Antigravity review node |
| `--location` | string | Location for the Antigravity review node |
| `--follow` | boolean | Stay attached and stream the run's live events |

### `ge pipeline runs`

List recent pipeline runs

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Max runs to list (default 20) |

### `ge fleet`

Many-agent state and convergence: status · repair · repairs

### `ge fleet status`

Fleet pipeline health, bottlenecks, and repair owners

| Flag | Type | Description |
|---|---|---|
| `--limit` | string | Max bottlenecks to list (default 8) |

### `ge fleet repair`

Converge blocked agents to a target stage: observe blockers → repair → retry

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids (default: current repair queue) |
| `--target-stage` | string | Gate to converge to (default preview) |
| `--no-repair` | boolean | Observe blockers without running repair |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--follow` | boolean | Stay attached and stream the run's live events |
| `--port` | string | Daemon port (default 17654) |

### `ge fleet repairs`

Show one repair run, or list recent repair runs

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional | Repair run id (omit to list recent runs) |
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Recent repair run count when no id is provided |

### `ge runs`

Run activity across every kind: list · show · events · resume · job

### `ge runs list`

List recent local GE runtime daemon tasks

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Max tasks to list (default 20) |

### `ge runs show`

Show one local GE runtime daemon task

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge runs events`

Show or follow one local GE runtime task event stream

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |
| `--follow` | boolean | Follow the live event stream (SSE) |

### `ge runs resume`

Resume a runtime task using its deterministic resumePlan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge runs job`

Run a ge command as a background run; pass args after --

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |

### `ge infra`

Drive the terraform module (init|plan|apply|output|destroy)

| Flag | Type | Description |
|---|---|---|
| `<sub>` | positional (required) | init \| plan \| apply \| output \| destroy |
| `--gatewayImage` | string | Gateway container image to bind |
| `--workerImage` | string | Worker container image to bind |
| `--yes` | boolean | Required confirmation for destroy |

### `ge images`

Gateway/worker images: build · deploy

### `ge images build`

Build images: no arg = gateway+worker; 'builder' = shared toolchain image

| Flag | Type | Description |
|---|---|---|
| `<target>` | positional | builder = shared toolchain image (default: gateway+worker) |

### `ge images deploy`

Build gateway/worker images + bind via terraform (Terraform owns Cloud Run config)

| Flag | Type | Description |
|---|---|---|
| `<target>` | positional | gateway\|worker\|all (advisory; terraform apply reconciles the whole module) |

### `ge data`

Data plane (GCS/BigQuery/AlloyDB/Bigtable/Firestore): up · doctor

### `ge data up`

Provision the shared data stores (terraform apply) → merge coords into .ge.json

### `ge data doctor`

Check the shared data stores (bucket, AlloyDB DSN secret, Bigtable, BigQuery)

### `ge mcp`

Tool plane (per-department custom MCP services): deploy · doctor

### `ge mcp deploy`

Deploy the per-department custom MCP services to Cloud Run (fleet-level)

### `ge mcp doctor`

Check the per-department MCP services + Agent Registry readiness

### `ge agents`

Agent lifecycle: build · resume · ship · status · fleet · logs · sync

### `ge agents build`

Build agents. Uses the active mode (ge mode); --local/--remote override

| Flag | Type | Description |
|---|---|---|
| `--canary` | boolean | Scope: one canary agent |
| `--all` | boolean | Scope: the whole fleet |
| `--dept` | string | Scope: one department |
| `--ids` | string | Scope: comma-separated agent/workspace ids |
| `--concurrency` | string | Parallel remote submissions (default 2) |
| `--force` | boolean | Rebuild/resubmit even if already completed (local: wipes the selected workspaces first) |
| `--no-proxy` | boolean | Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel |
| `--local` | boolean | Override: run on this machine via the harness |
| `--remote` | boolean | Override: submit to the cloud factory |
| `--limit` | string | Max workspaces to build (local) |
| `--target` | string | Harness target (local; default previewed) |
| `--vertex` | boolean | Use Vertex for local harness review/preview stages (default true) |
| `--no-vertex` | boolean | Disable Vertex-backed harness stages (negates --vertex; same as --vertex=false) |
| `--location` | string | Vertex/GenAI location for local harness stages |
| `--model` | string | Model for harness review/refine + generated agents (local and remote) |
| `--max-output-tokens` | string | Override generated-agent max_output_tokens (local and remote); default unset = model default |
| `--no-refine` | boolean | Skip the cloud Antigravity refine stage (REFINE=0) |
| `--warm` | boolean | Pre-warm the shared uv cache before running (local) |
| `--watch` | boolean | Remote: after submitting, watch run status until all runs are terminal |

### `ge agents resume`

Resume interrupted/failed builds from the ledger: retry failed stages, finish local work, ship past the boundary

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Only resume these comma-separated use-case/workspace ids |
| `--target` | string | Target stage (default: previewed in local mode, published in remote mode) |
| `--local` | boolean | Override: plan against local mode |
| `--remote` | boolean | Override: plan against remote mode |
| `--run` | boolean | Execute the resume plan (default: print it) |

### `ge agents ship`

Hand off locally-built agents to the cloud: upload + run deploy→register→publish remotely

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated local workspace ids (default: all built locally) |
| `--start-stage` | string | Stage to start at remotely (default load_data) |
| `--target-stage` | string | Stage to stop at (default publish_enterprise) |
| `--concurrency` | string | Parallel remote submissions (default 2) |
| `--no-proxy` | boolean | Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel |

### `ge agents status`

Poll submitted runs (stage tally)

| Flag | Type | Description |
|---|---|---|
| `--watch` | boolean | Re-poll every 15s until all runs are terminal |
| `--no-proxy` | boolean | Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel |

### `ge agents fleet`

(deprecated → ge fleet status) Fleet pipeline health, bottlenecks, and repair owners

| Flag | Type | Description |
|---|---|---|
| `--limit` | string | Max bottlenecks to list (default 8) |

### `ge agents logs`

Pretty-print a stage's result + errors

| Flag | Type | Description |
|---|---|---|
| `<runId>` | positional (required) | Run id (from ge agents status / the ledger) |
| `--stage` | string | Stage result to print (default validate) |
| `--item` | string | Work item id within the run |

### `ge agents sync`

Generated agent code → generated-agents/ → git (cloud: GCS; --local: harness workspaces)

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids (default: all syncable workspaces) |
| `--push` | boolean | git push after committing |
| `--force` | boolean | Re-download/re-sync even if the run was already synced |
| `--no-commit` | boolean | Copy the code but skip the git commit |
| `--local` | boolean | Override: sync locally-generated workspaces |
| `--remote-mode` | boolean | Override: pull from GCS (cloud mode) |
| `--remote` | string | Push to a specific git remote/URL (the repo the agent code must sit in) |
| `--create` | boolean | Create the Cloud Source repo if it doesn't exist (local mode) |

### `ge daemon`

Local GE runtime daemon: start · status · tasks · task · stop

### `ge daemon start`

Start the local GE runtime daemon

| Flag | Type | Description |
|---|---|---|
| `--foreground` | boolean | Run the daemon in this process instead of detaching |
| `--port` | string | Daemon port (default 17654) |
| `--host` | string | Bind host (default 127.0.0.1) |

### `ge daemon status`

Show local GE runtime daemon status

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |

### `ge daemon tasks`

List recent local GE runtime daemon tasks

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Max tasks to list (default 20) |

### `ge daemon task`

Show one local GE runtime daemon task

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge daemon events`

Show or follow one local GE runtime task event stream

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |
| `--follow` | boolean | Follow the live event stream (SSE) |

### `ge daemon stop`

Stop the local GE runtime daemon

### `ge state`

Local GE state: paths · reset

### `ge state paths`

Show the canonical local GE state layout

### `ge state reset`

Clear local GE runtime/factory/mission/interview state

| Flag | Type | Description |
|---|---|---|
| `--yes` | boolean | Confirm destructive local state reset |

### `ge ledger`

Durable run ledger (ADR 0001): backfill · runs · fleet · plan

### `ge ledger backfill`

Import legacy run state (.ge-state.json + factory-run-*.json) into the durable ledger

### `ge ledger runs`

List runs recorded in the durable ledger (local + remote, one source of truth)

| Flag | Type | Description |
|---|---|---|
| `--limit` | string | Max runs to list (default 25) |

### `ge ledger fleet`

Latest work-item state per use case, from the ledger

| Flag | Type | Description |
|---|---|---|
| `--limit` | string | Max rows to list (default 50) |

### `ge ledger plan`

Next action per work item from the ledger + pipeline state machine

| Flag | Type | Description |
|---|---|---|
| `--target` | string | Target stage (default previewed) |
| `--mode` | string | local\|remote (default local) |

### `ge autopilot`

(deprecated → ge fleet repair) autopilot is a fleet repair run

### `ge autopilot run`

(deprecated → ge fleet repair) Converge blocked agents to a target stage: observe blockers → repair → retry

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids (default: current repair queue) |
| `--target-stage` | string | Gate to converge to (default preview) |
| `--no-repair` | boolean | Observe blockers without running repair |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--follow` | boolean | Stay attached and stream the run's live events |
| `--port` | string | Daemon port (default 17654) |

### `ge autopilot status`

(deprecated → ge fleet repairs [id]) Show one repair run, or list recent repair runs

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional | Repair run id (omit to list recent runs) |
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Recent repair run count when no id is provided |

### `ge autopilot events`

(deprecated → ge runs events <id>) Show or follow one local GE runtime task event stream

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |
| `--follow` | boolean | Follow the live event stream (SSE) |

### `ge mission`

(deprecated → ge pipeline) a mission is a pipeline run

### `ge mission plan`

(deprecated → ge pipeline graph) Build the pipeline's orchestration DAG without running it

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |
| `--workspace` | string | Scenario workspace path (default .ge/missions/<scenario>) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--with-factory` | boolean | Actually schedule the factory build node |
| `--no-antigravity` | boolean | Do not include the Antigravity spec/data review node |
| `--harness-agent` | string | Harness agent for the review node (default antigravity-sdk) |
| `--model` | string | Model for the Antigravity review node |
| `--location` | string | Location for the Antigravity review node |
| `--follow` | boolean | Stay attached and stream the run's live events |

### `ge mission run`

(deprecated → ge pipeline run) Start a pipeline run: the durable orchestration graph on the daemon

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |
| `--workspace` | string | Scenario workspace path (default .ge/missions/<scenario>) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--with-factory` | boolean | Actually schedule the factory build node |
| `--no-antigravity` | boolean | Do not include the Antigravity spec/data review node |
| `--harness-agent` | string | Harness agent for the review node (default antigravity-sdk) |
| `--model` | string | Model for the Antigravity review node |
| `--location` | string | Location for the Antigravity review node |
| `--follow` | boolean | Stay attached and stream the run's live events |

### `ge mission status`

(deprecated → ge pipeline status <id> · ge pipeline runs) Pipeline status: bare → the live stage view; with an id → that run's graph + resume plan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional | Pipeline run id (omit for the stage view) |
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |

### `ge mission resume`

(deprecated → ge pipeline resume) Resume a pipeline run via its deterministic resume plan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Pipeline run id |
| `--port` | string | Daemon port (default 17654) |

### `ge journey`

(deprecated → ge pipeline) the user journey is the pipeline

### `ge journey plan`

(deprecated → ge pipeline plan) Show the pipeline plan for a spec/scenario (stages, owners, first commands)

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |

### `ge journey status`

(deprecated → ge pipeline status) Pipeline status: bare → the live stage view; with an id → that run's graph + resume plan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional | Pipeline run id (omit for the stage view) |
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |

### `ge journey run`

(deprecated → ge pipeline run) Start a pipeline run: the durable orchestration graph on the daemon

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--scenario` | string | Scenario/use-case id |
| `--usecase` | string | Use case id from interview/spec registry |
| `--systems` | string | Comma-separated source-system simulator ids |
| `--target-stage` | string | Target stage (default preview) |
| `--port` | string | Daemon port (default 17654) |
| `--workspace` | string | Scenario workspace path (default .ge/missions/<scenario>) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--run-preview` | boolean | Run preview after repair when supported |
| `--with-factory` | boolean | Actually schedule the factory build node |
| `--no-antigravity` | boolean | Do not include the Antigravity spec/data review node |
| `--harness-agent` | string | Harness agent for the review node (default antigravity-sdk) |
| `--model` | string | Model for the Antigravity review node |
| `--location` | string | Location for the Antigravity review node |
| `--follow` | boolean | Stay attached and stream the run's live events |

### `ge runtime`

(deprecated → ge runs · ge fleet repair) runtime task plumbing: status · tasks · task · events · resume · start

### `ge runtime status`

Show local GE runtime daemon status

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |

### `ge runtime tasks`

List recent local GE runtime daemon tasks

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Max tasks to list (default 20) |

### `ge runtime task`

Show one local GE runtime daemon task

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge runtime events`

Show or follow one local GE runtime task event stream

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |
| `--follow` | boolean | Follow the live event stream (SSE) |

### `ge runtime resume`

Resume a runtime task using its deterministic resumePlan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge runtime start`

Start runtime tasks: repair (canonical) · autopilot (deprecated) · job

### `ge runtime start autopilot`

Start an Autopilot runtime task

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--stage` | string | Target convergence stage (default preview) |
| `--repair` | boolean | Run repair on blockers (default true; --no-repair to observe only) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--runPreview` | boolean | Run preview after repair when supported |
| `--port` | string | Daemon port (default 17654) |

### `ge runtime start repair`

Start an Autopilot runtime task

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated agent/workspace ids |
| `--stage` | string | Target convergence stage (default preview) |
| `--repair` | boolean | Run repair on blockers (default true; --no-repair to observe only) |
| `--attempts` | string | Repair attempts per item (default 3) |
| `--runPreview` | boolean | Run preview after repair when supported |
| `--port` | string | Daemon port (default 17654) |

### `ge runtime start job`

Start a GE command runtime task; pass command args after --

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |

### `ge apply`

Reconcile actual → desired platform + fleet from a manifest (ge.manifest.json). Plans by default; --yes executes.

| Flag | Type | Description |
|---|---|---|
| `--yes` | boolean | Execute the plan in dependency order (default: plan only) |
| `--manifest` | string | Path to a manifest JSON (default ge.manifest.json) |
<!-- END GENERATED: ge-command-tree -->

### Examples

```bash
ge                                        # status board: planes ✓/○ + next command
ge agents build --canary --local          # build one agent on this machine
ge agents build --all --remote            # submit the whole fleet to the cloud
ge agents build --ids account-reconciliation-agent --no-refine
ge journey plan --usecase account-reconciliation-agent
ge mission run --scenario leave-planning --systems workday,docusign_clm --target-stage preview
ge autopilot run --ids agent-a,agent-b --target-stage preview
ge runtime start job -- ge <args>         # run a ge command as a runtime task
ge state reset --yes                      # destructive: clear local GE state
ge ledger backfill                        # import legacy run state into the ledger
ge apply --yes                            # reconcile actual → desired from ge.manifest.json
```

---

## `factory` — generator CLI

Source:
[`apps/factory/scripts/factory.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory).
Invoke as `node apps/factory/scripts/factory.mjs <command>`. This is the
build engine the factory drives per stage; it emits one agent workspace into
`--dir <dir>`.

**Flow:** `init → schema → generate → tools → test → serve → deploy → register → publish`

### Local development

| Command | Purpose | Key flags |
|---|---|---|
| `quickstart` | Zero-flag local pipeline for a brand-new workspace: init → schema → generate → tools → test | `--dir` `[--name] [--domain] [--seed] [--rows] [--run-tests]` |
| `init` | Create the workspace structure | `--name <n>` `--domain <d>` `--dir <dir>` |
| `from-usecase` | Materialize a workspace from an enterprise catalog use case | `--usecase <id>` (or `--freeform '<description>'`) `--dir` |
| `schema` | Add / inspect table schemas | `--dir` `--add-table '<json>'` |
| `generate` | Produce fixture data (faker) | `--dir` `[--seed N]` `[--rows N]` |
| `tools` | Generate the Python ADK agent (`app/agent.py`, `app/tools.py`, evals, OKF `app/knowledge/`) | `--dir` |
| `test` | Generate + run smoke tests | `--dir` `[--run true\|false]` |
| `eval` | Generate / run the evalset | `--dir` `[--run true\|false]` |
| `quality-gate` | Run the build-boundary gate | `--dir` `--prompt "…"` `[--evals]` `[--harness-review]` `[--vertex\|--no-vertex]` `[--project]` `[--location]` |
| `harness-review` | Headless harness review of the workspace | `--dir` `[--provider antigravity-sdk\|agy\|gemini\|codex\|claude]` `[--vertex\|--no-vertex]` |
| `harness-refine` | Harness self-correction pass (edits the workspace) | `--dir` `[--provider antigravity-sdk]` `[--vertex\|--no-vertex]` |
| `serve` | Start the ADK web preview | `--dir` `[--port N]` |
| `data-plan` | Generate BigQuery/GCS load artifacts | `--dir` `[--project --dataset --bucket]` |
| `plan-data` | Plan a datastore collection from a use case | `--dir` `--usecase <UseCaseName>` |
| `source-integration-plan` | Plan API/MCP/datastore provisioning + registry wiring | `--dir` `[--project]` |
| `snowfakery-recipe` | Export an optional Snowfakery recipe | `--dir` |
| `sources` | Analyze slide source systems | `--slides <dir>` `[--json --md]` |

### Google Cloud

| Command | Purpose | Key flags |
|---|---|---|
| `mcp` | Manage Google Cloud MCP servers | `--action plan\|list\|enable\|disable` `[--service bigquery\|maps\|…]` |
| `deploy` | Deploy to Agent Runtime / Cloud Run | `--dir` `--project` `[--target agent_runtime\|cloud_run]` |
| `deploy-status` | Check a pending Agent Runtime deploy | `--dir` `--project` `--region` |
| `verify-live` | Probe a live deployment | `--dir` `--prompt "…"` |
| `register` | Register in Agent Registry | `--dir` `--as adk\|mcp\|a2a` |
| `publish` | Publish to Gemini Enterprise | `--dir` `--app-id <id>` |

### Pipeline & audit

| Command | Purpose | Key flags |
|---|---|---|
| `status` | Show pipeline state + data analysis | `--dir` |
| `reset` | Reset the pipeline from a step | `--dir` `--step <step>` |
| `list-usecases` | Browse the enterprise use-case catalog | — |
| `promotion-gate` | Evaluate the promotion gate (blocks deploy on failure) | `--dir` `[--force]` |
| `pack-coverage` | Report simulator-pack coverage | `[--out artifacts/pack-coverage.json]` |
| `batch-audit` | Audit many generated workspaces | `[--limit N]` `[--department hr]` `[--root <dir>]` `[--run]` `[--harness-review]` |

```bash
factory init --dir ./hr-agent --name hr-demo --domain hr
factory from-usecase --dir ./hr-agent --usecase account-reconciliation-agent
factory generate --dir ./hr-agent --seed 42
factory tools --dir ./hr-agent
factory quality-gate --dir ./hr-agent --prompt "hello" --harness-review true
factory publish --dir ./hr-agent --app-id my-gemini-enterprise-app-id
```

> `factory` also exports pure build helpers (`deriveAgentWorkflow`,
> `canonicalIntentToolName`, …) under `__test`; importing the module does **not**
> execute the CLI.
{: .note }

---

## `mise` tasks

Source: [`mise.toml`](https://github.com/vamsiramakrishnan/ge-agent-factory). Run
`mise tasks` for the full list with descriptions, `mise run help` for the grouped
big-picture listing, or `mise run next` for a status-based recommendation. Any
task also runs via the bare shorthand `mise <task>` (e.g. `mise console`) except
the handful that collide with a built-in mise command name (`doctor`, `install`,
`uninstall`, `sync`, `deps`, `mcp`, `up`) — use `mise run <task>` for those.

### Setup & toolchain

| Target | What it does |
|---|---|
| `mise run setup` | Install JS + Python/uv deps, sync catalog/skills, put `ge` on PATH, start the daemon |
| `mise run devex-check` | Run `ge devex check`: local doctor + docs links + workspace manifest contracts |
| `mise run devex-smoke` | Run `ge devex smoke`: local doctor → local mode → one validated canary workspace |
| `mise run bootstrap [CANARY=1]` | End-to-end: toolchain + `ge init` + `ge up`. `CANARY=1` also builds one agent. Needs `GEMINI_ENTERPRISE_APP_ID` + gcloud auth |
| `mise run all` | Alias for `bootstrap` |
| `mise run deps` / `mise run data-runtime` / `mise run deps-terraform` | Toolchain pieces: uv + agents-cli + `.venv` (google-antigravity); Snowfakery runtime; terraform |
| `mise run install` / `mise run uninstall` | Install / remove the `ge` command |
| `mise run ci` | Run the CI gate locally (source hygiene + `bun test apps tools`) |
| `mise run install-hooks` | Install the pre-commit hook (source hygiene) |
| `mise run catalog` | Regenerate the use-case catalog build artifact |

### Skills

`mise run skills-sync` · `mise run skills-doctor` · `mise run skills-spec-audit` ·
`mise run skills-install` (link repo skills into a headless harness at
`AGENTS_SKILLS_DIR`, default `~/.agents/skills`).

### Platform ops

| Target | Wraps |
|---|---|
| `mise run doctor` / `mise run doctor-local` | `ge doctor` / `ge doctor --local` |
| `mise run up` | `ge up` |
| `mise run cutover [APPLY=1]` | `ge cutover [--apply]` |
| `mise run data` / `mise run data-doctor` | `ge data up` / `ge data doctor` |
| `mise run mcp-deploy` / `mise run mcp-doctor` | `ge mcp deploy` / `ge mcp doctor` |
| `mise run status` | bare `ge` |
| `mise run mode-local` / `mise run mode-remote` | `ge mode local` / `ge mode remote` |
| `mise run provision [CANARY=1]` | `ge agents build` (`--canary` or `--all`) |
| `mise run provision-local [CANARY=1]` | `ge agents build --local` |
| `mise run sync` / `mise run sync-local` | `ge agents sync --push` / `--local --create --push` |
| `mise run mcp-server` / `mise run mcp` | Run the factory's MCP server (stdio) |

### Run one app locally

| Target | App | URL |
|---|---|---|
| `mise run console` | Operator UI (Pipeline, Fleet, Activity, Doctor) | `http://localhost:18260` |
| `mise run presentation` | Transformation deck + source use-case catalog | `http://localhost:18250` |
| `mise run generator` | Generator workbench (mock data, harness, workspaces) | `http://localhost:17655` |
| `mise run build-console` / `build-presentation` | Production builds (`dist/`) | — |
| `mise run serve-console` / `serve-presentation` | Serve the built app via Bun | `PORT` (default 8261 / 8251) |

> Bare `mise run dev` is a guard: it explains the three apps and starts nothing.
{: .note }
