---
title: CLI
parent: Reference
nav_order: 1
layout: default
---

# CLI reference

`ge` is the operator surface of the contract layer: every capture, compile,
prove, and handoff operation is one of the commands below (see the
[core mental model](../start/mental-model.html) for which command implements
which verb). The factory exposes three command surfaces:

- **`ge`** — the human/operator CLI (`bun tools/ge.mjs`). Lifecycle: set up the
  machine → stand up the platform → run agents.
- **`factory`** — the lower-level generator CLI
  (`node apps/factory/scripts/factory.mjs`) that emits one agent
  workspace step by step.
- **`mise run <task>`** — task runner that wraps both for the common flows.

`ge` is a thin renderer over `tools/lib/factory-core.mjs`. Every command accepts
`--json` (structured result on stdout, progress on stderr). The MCP (Model
Context Protocol) server drives the same core for model/harness callers.

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
| `--projectNumber` / `--project-number` | string | GCP project number (Agent Identity principalSet) |
| `--region` | string | Region (default us-central1) |
| `--agentIdentityOrgId` | string | Organization ID for Agent Identity principalSet trust domain |
| `--bucket` | string | Artifact bucket override (default <project>-ge-agent-factory) |
| `--gatewayUrl` / `--gateway-url` | string | Gateway URL for direct-HTTPS calls (no proxy tunnel) |
| `--geApp` / `--ge-app` | string | Gemini Enterprise app/engine id |

### `ge`

GE Agent Factory — set up · stand up · run agents. Bare `ge` shows status + next step.

### `ge create`

Create an agent workspace from the Agent Library, workflow, OpenAPI, or blank contract

| Flag | Type | Description |
|---|---|---|
| `--from-library` | string | Library blueprint slug |
| `--out` | string |  |
| `--overlay` | string |  |
| `--target` | string |  |
| `--dry-run` | boolean |  |
| `--no-smoke` | boolean |  |
| `--force` | boolean |  |

### `ge capture`

Capture an agent contract: opens the console Interview (starts the console if needed); --from registers an existing contract file

| Flag | Type | Description |
|---|---|---|
| `--from` | string | Path to a captured contract (agent-spec.json) to register with the catalog |

### `ge prove`

Prove the current contracts end to end: fresh machine → health check + first agent build; agents built already → rebuild their proof. --live verifies the shipped agent through its assist surface; --watch re-proves on contract change

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Prove one use-case/workspace id (default: everything built, or the catalog canary when fresh) |
| `--target` | string | Stop at this stage (default: validated when fresh, the build boundary otherwise) |
| `--force` | boolean | Re-prove from scratch (wipes matching local workspaces first) |
| `--preview` | boolean | Shortcut for --target previewed (may require project/Vertex auth) |
| `--vertex` | boolean | Use Vertex-backed stages when the target reaches them |
| `--warm` | boolean | Pre-warm the shared uv cache before running |
| `--watch` | boolean | Watch contract sources and re-prove on change (local, pure computation — safe to loop) |
| `--live` | boolean | Release verification: run evalset cases through the deployed agent's live assist surface (explicit, cost-guarded — never the default) |
| `--evalset` | string | Evalset to prove live (ADK-compatible; record one with ge drive --record) |
| `--cassette` | string | Replay a recorded cassette instead of live traffic (deterministic, no cloud) |
| `--maxCases` | string | Cap the number of eval cases run live (cost guard) |
| `--maxTurns` | string | Cap turns per case (cost guard) |
| `--strictResponder` | boolean | Fail cases whose responder identity cannot be verified |
| `--updateBaseline` | boolean | Accept the current live behavior as the new conformance baseline |
| `--targetAgent` | string | Expected responding agent id (asserted against the stream) |
| `--assistant` | string | Assistant id on the engine (default default_assistant) — prove any deployed agent, factory-built or not |

### `ge handoff`

Hand off proven agents to a deploy target (supported today: agents-cli → Agent Engine → Gemini Enterprise); plan/package/verify-package inspect a handoff with zero cloud calls

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | (agents-cli/plan/package) comma-separated local workspace ids |
| `--start-stage` | string | (agents-cli/plan) stage to start at remotely |
| `--target-stage` | string | (agents-cli/plan) stage to stop at |
| `--concurrency` | string | (agents-cli) parallel remote submissions |
| `--out` | string | (package) output path |
| `--archive` | string | (verify-package) path to the packaged archive/directory |
| `--no-proxy` | boolean | (agents-cli) call the gateway directly, no proxy tunnel |
| `--force` | boolean | (agents-cli/plan) break-glass override |

### `ge handoff agents-cli`

Hand off proven agents through agents-cli deploy → Agent Engine → Gemini Enterprise (the default target)

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated local workspace ids (default: all built locally) |
| `--start-stage` | string | Stage to start at remotely (default load_data) |
| `--target-stage` | string | Stage to stop at (default publish_enterprise) |
| `--concurrency` | string | Parallel remote submissions (default 2) |
| `--no-proxy` | boolean | Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel |
| `--force` | boolean | Break-glass: release despite a denied admission decision (the override is recorded in the decision log) |

### `ge handoff plan`

Dry run: report content digests and the admission verdict for a handoff, without uploading, submitting, or recording anything

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated local workspace ids (default: all built locally) |
| `--target` | string | Deploy target the plan is for (default agents-cli) |
| `--start-stage` | string | Stage the real handoff would start at remotely (default load_data) |
| `--target-stage` | string | Stage the real handoff would stop at (default publish_enterprise) |
| `--force` | boolean | Preview the plan as if --force (break-glass) were used on the real handoff |

### `ge handoff package`

Build the same archive `ge handoff` uploads, to a local path, with a manifest of content digests — no upload, no cloud call

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Comma-separated local workspace ids (default: all built locally) |
| `--out` | string | Output path (default ./handoff-package.tar.gz for one workspace, a directory of <id>.tar.gz for several) |
| `--target` | string | Deploy target recorded in the manifest (default agents-cli) |

### `ge handoff verify-package`

Re-extract a handoff package and compare its content digests against the manifest written at package time

| Flag | Type | Description |
|---|---|---|
| `<archive>` | positional (required) | Path to the packaged archive (single workspace) or directory (several workspaces) |

### `ge status`

Where am I? Position on capture → prove → handoff, the current blocker, and the exact next command

### `ge drive`

Talk to the shipped agent over its live assist surface — per-turn timing/responder footer; --record saves the conversation as an eval case

| Flag | Type | Description |
|---|---|---|
| `--geApp` | string | Gemini Enterprise engine (full resource name or bare id; default from .ge.json geAppId) |
| `--turns` | string | Drive non-interactively from inline turns (one user turn per line/newline) instead of --script — the transport for programmatic callers |
| `--script` | string | Drive non-interactively: file with one user turn per line (# comments allowed) |
| `--cassette` | string | Replay a recorded cassette instead of calling the live surface (no cloud, deterministic) |
| `--record` | string | Append the driven conversation to this evalset as a new eval case |
| `--recordId` | string | Case id to record under (default: derived from the transcript id) |
| `--recordCassette` | string | Record the live stream to this cassette file for later replay |
| `--targetAgent` | string | Expected responding agent id — responder identity is asserted against the stream |
| `--assistant` | string | Assistant id on the engine (default default_assistant) — plug any deployed agent, factory-built or not |
| `--strictResponder` | boolean | Fail when responder identity cannot be verified (default: warn) |

### `ge bench`

Load the live assist surface within hard cost guards and verdict the latency/error budgets (ttft, full response, stalls, errors, responder identity)

| Flag | Type | Description |
|---|---|---|
| `--geApp` | string | Gemini Enterprise engine (full resource name or bare id; default from .ge.json geAppId) |
| `--sessions` | string | Number of independent conversations (default 5; hard-capped by live.bench guards) |
| `--turns` | string | Turns per conversation (default 2) |
| `--concurrency` | string | Concurrency sweep, e.g. 1,2,4 (default 1) |
| `--cassette` | string | Replay a recorded cassette — deterministic timings, zero cloud (the CI path) |
| `--profile` | string | Bench profile JSON (e.g. .ge/behavioral/bench-profile.json from ge evals compile) |
| `--targetAgent` | string | Expected responding agent id — responder rates then count against budgets |
| `--strictResponder` | boolean | Treat unverifiable responder identity as failure |
| `--export` | string | Export a load script instead of running: k6 |
| `--yes` | boolean | Confirm a LIVE bench run (real traffic, real cost) — refused without it |

### `ge evals`

Behavioral compiler: turn agent contracts into executable eval suites, datasets, and load profiles

### `ge evals compile`

Compile an agent contract into executable behavior: graph, coverage, selected cases, ADK evalset, grading dataset, load profile

| Flag | Type | Description |
|---|---|---|
| `--spec` | string | A GenerationSpecEnvelope JSON file to compile (bring your own spec) |
| `--id` | string | Registered/captured spec id (default: the only one, when exactly one exists) |
| `--maxCases` | string | Case budget for the set-cover selection (default 40) |
| `--perturb` | string | Linguistic perturbation variants per selected case (default 0 — off; variants mirror selected cases) |
| `--adversarial` | boolean | Add adversarial/safety cases (prompt injection, spoofing, exfiltration, …) to the pool and require adversarial coverage |
| `--out` | string | Output directory (default .ge/behavioral) |

### `ge evals import`

Import a bring-your-own ADK-compatible evalset into .ge/behavioral, alongside compiled suites

| Flag | Type | Description |
|---|---|---|
| `--evalset` | string | Path to an external ADK-compatible evalset JSON file |
| `--id` | string | Id to store the evalset under (default: the file's own evalSetId, or a filename slug) |
| `--force` | boolean | Overwrite an existing evalset with the same id |

### `ge evals coverage`

Report per-dimension coverage from the last `ge evals compile` (required/covered/gaps), optionally scoped to one evalset id

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Evalset id to also report case counts for (compiled or imported) |

### `ge evals applicability`

Which metric families apply locally vs through the live assist surface (and why)

| Flag | Type | Description |
|---|---|---|
| `--markdown` | boolean | Print the markdown table instead of the human view |

### `ge passport`

Agent Passport: mint, verify, and admit — the signed proof-pack identity behind the handoff admission gate

### `ge passport emit`

Mint the signed Agent Passport for a proven workspace (digests + attestations over the proof pack)

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Local workspace id (or use-case id) |

### `ge passport verify`

Verify a passport's integrity: signatures, and digest binding to the workspace bytes on disk

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Local workspace id (or use-case id) |

### `ge passport admit`

Evaluate the admission gate (policy: .ge.json promotion.gates.admission) and record the decision

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Local workspace id (or use-case id) |
| `--stage` | string | Stage the decision is for (default handoff) |
| `--force` | boolean | Break-glass: exit 0 despite a denial (the override is recorded in the decision log) |

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
| `--command` | string | Check readiness for a mutating command (up\|data.up\|mcp.deploy\|agents.build\|agents.build.local\|handoff\|agents.sync\|prove) |

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

Developer-experience checks (fast read-only gate: doctor + docs + workspace contracts)

### `ge devex check`

Fast DevEx gate: local doctor, docs links, and workspace manifest contracts

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Workspace or use-case id to check (default: generated use-case workspaces) |
| `--all-workspaces` | boolean | Also check scratch/test workspaces without a use-case id |
| `--no-docs` | boolean | Skip local docs link checks |
| `--no-local` | boolean | Skip local toolchain doctor checks |
| `--no-strict-workspaces` | boolean | Warn instead of fail on missing generated workspace files |

### `ge config`

Operator config: explain (precedence/sources)

### `ge config explain`

Show each config value and where it came from (flag · env · .ge.json · default)

| Flag | Type | Description |
|---|---|---|
| `--projectNumber` | string | GCP project number override |
| `--bucket` | string | GCS bucket override |
| `--gatewayUrl` | string | Factory gateway URL override |
| `--geApp` | string | Gemini Enterprise app id override |
| `--mode` | string | Operating mode override (local\|remote) |
| `--agentsRepo` | string | Generated-agents git repo override |

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
| `--workspace` | string | Scenario workspace path (default .ge/pipelines/<scenario>) |
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
| `--workspace` | string | Scenario workspace path (default .ge/pipelines/<scenario>) |
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

Run activity across every kind: list · show · events · replay · resume · respond · job

### `ge runs list`

One timeline over every run: daemon tasks + durable ledger runs, newest first

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |
| `--limit` | string | Max runs to list per source (default 20) |

### `ge runs show`

Show one local GE runtime daemon task

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge runs events`

Show or follow one run's events — local daemon task stream by default; --remote reads the durable Firestore run ledger

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |
| `--follow` | boolean | Follow the live event stream (SSE) |
| `--remote` | boolean | Read the durable Firestore run ledger instead of the local daemon task stream |
| `--project` / `--gcp-project` | string | GCP project id override (with --remote) |
| `--afterSeq` | string | Only show events with seq greater than this (reconnect/dedup, with --remote) |

### `ge runs replay`

Replay a finished run's recorded events at speed (default 10×)

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Run id (daemon task) |
| `--speed` | string | Time-compression factor (default 10; gaps capped at 2s) |
| `--instant` | boolean | No pacing — dump the whole event log |
| `--port` | string | Daemon port (default 17654) |

### `ge runs resume`

Resume a runtime task using its deterministic resumePlan

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) | Runtime task id |
| `--port` | string | Daemon port (default 17654) |

### `ge runs respond`

Answer a running task's pending question (interaction): --answers JSON, --freeform text, or --cancel

| Flag | Type | Description |
|---|---|---|
| `<task>` | positional (required) | Task id (from ge runs list / the event stream) |
| `<interaction>` | positional (required) | Interaction id (from the ge.interaction.request event) |
| `--answers` | string | Full responses JSON: [{"questionId":"q1","selectedOptionIds":["a"],"freeformResponse":"..."}] |
| `--question` | string | Question id for --freeform/--select (single-question shorthand) |
| `--freeform` | string | Freeform answer text (with --question) |
| `--select` | string | Comma-separated option ids to select (with --question) |
| `--cancel` | boolean | Cancel the interaction instead of answering |
| `--port` | string | Daemon port (default 17654) |

### `ge runs job`

Run a ge command as a background run; pass args after --

| Flag | Type | Description |
|---|---|---|
| `--port` | string | Daemon port (default 17654) |

### `ge infra`

Stand up or tear down the cloud infrastructure this factory needs

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

Data: provision the shared cloud stores (up · doctor) · synthesize deterministic simulator seeds (synth)

### `ge data up`

Provision the shared data stores (terraform apply) → merge coords into .ge.json

### `ge data doctor`

Check the shared data stores (bucket, AlloyDB DSN secret, Bigtable, BigQuery)

### `ge data synth`

Synthesize deterministic seed data for a simulator system twin: pack contract → recipe → seeded rows → seed.json

| Flag | Type | Description |
|---|---|---|
| `--system` | string | Simulator system id under apps/factory/simulator-systems/ (e.g. servicenow) |
| `--pack` | string | Explicit pack directory (schema/projection/materialization/workflows JSON) instead of --system |
| `--seed` | string | Deterministic seed — the same contract and seed always produce identical bytes (default 42) |
| `--profile` | string | Realization profile: baseline (default) or realistic (skewed distributions, shared personas, seeded edge cases) |
| `--edge-case-rate` | string | Fraction of rows given realistic edge cases with --profile realistic, 0..1 (default 0.06) |
| `--out` | string | Seed output path (default: the pack's own seed.json) |
| `--stdout` | boolean | Print the seed JSON to stdout instead of writing a file; the summary goes to stderr |
| `--no-snowfakery` | boolean | Skip the Snowfakery tier and force the offline in-process tier |

### `ge mcp`

Tool plane (per-department custom MCP services): deploy · doctor

### `ge mcp deploy`

Deploy the per-department custom MCP services to Cloud Run (fleet-level)

### `ge mcp doctor`

Check the per-department MCP services + Agent Registry readiness

### `ge agents`

Agent lifecycle: register · track · build · resume · status · logs · sync (release proven agents with `ge handoff`)

### `ge agents register`

Register an OKF bundle as a tracked agent: compile it, flip provenance draft→registered (version +1), refresh the catalog

| Flag | Type | Description |
|---|---|---|
| `--bundle` | string | Agent id (resolved under the OKF corpus root) or an explicit bundle directory |
| `--owner` | string | Owner email to stamp into the bundle's provenance |
| `--catalog` | boolean | Re-run `bun run catalog` after registering (pass --catalog=false in batch loops and regenerate once at the end) |

### `ge agents track`

Report one agent's lifecycle state: provenance, registry presence, and its variant lineage chain

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Agent id (resolved under the OKF corpus root) or an explicit bundle directory |

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
| `--detach` | boolean | Local only: submit to the runtime daemon and return immediately with a run id (close-your-laptop) |

### `ge agents resume`

Resume interrupted/failed builds from the ledger: retry failed stages, finish local work, hand off past the boundary

| Flag | Type | Description |
|---|---|---|
| `--ids` | string | Only resume these comma-separated use-case/workspace ids |
| `--target` | string | Target stage (default: previewed in local mode, published in remote mode) |
| `--local` | boolean | Override: plan against local mode |
| `--remote` | boolean | Override: plan against remote mode |
| `--run` | boolean | Execute the resume plan (default: print it) |

### `ge agents status`

Poll submitted runs (stage tally)

| Flag | Type | Description |
|---|---|---|
| `--watch` | boolean | Re-poll every 15s until all runs are terminal |
| `--no-proxy` | boolean | Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel |

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

Keep long factory work running after your terminal closes

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

Clear local GE runtime/factory/pipeline/interview state

| Flag | Type | Description |
|---|---|---|
| `--yes` | boolean | Confirm destructive local state reset |

### `ge ledger`

See every run the factory has ever done, and rebuild the record if it drifts

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

### `ge okf`

OKF knowledge substrate: compile · skill · customize · audit · quality · enrich · eval · domain-packs · graph · explain · diff · repair

### `ge okf audit`

Audit an OKF bundle across base conformance, navigability, semantics, behavior, and consumption readiness

| Flag | Type | Description |
|---|---|---|
| `<bundle>` | positional (required) |  |
| `--strict` | boolean |  |

### `ge okf quality`

Quality status, scoring, and deterministic audit for OKF blueprints

### `ge okf quality audit`

Compute deterministic L0-L5 OKF blueprint quality reports

| Flag | Type | Description |
|---|---|---|
| `--all` | boolean |  |
| `--spec` | string |  |
| `--changed` | boolean |  |
| `--root` | string |  |
| `--fail-under` | string | Fail if any audited spec score is below this threshold |
| `--write` | string | Write JSON report to this path |
| `--markdown` | string | Write Markdown report to this path |

### `ge okf domain-packs`

Reusable enrichment invariant and eval seed packs

### `ge okf domain-packs list`

List reusable OKF enrichment domain packs

| Flag | Type | Description |
|---|---|---|
| `--root` | string |  |

### `ge okf domain-packs inspect`

Inspect one OKF enrichment domain pack

| Flag | Type | Description |
|---|---|---|
| `<id>` | positional (required) |  |
| `--root` | string |  |

### `ge okf domain-packs match`

Match a spec to deterministic domain packs

| Flag | Type | Description |
|---|---|---|
| `--spec` | string |  |
| `--root` | string |  |
| `--pack-root` | string |  |

### `ge okf enrich`

Plan and shard OKF blueprint enrichment work

### `ge okf enrich plan`

Generate coverage obligations for OKF blueprint enrichment

| Flag | Type | Description |
|---|---|---|
| `--all` | boolean |  |
| `--spec` | string |  |
| `--target` | string |  |
| `--root` | string |  |
| `--pack-root` | string |  |
| `--write` | string | Write plan JSON to this path |

### `ge okf enrich generate`

Generate a reviewable OKF enrichment patch without mutating source specs

| Flag | Type | Description |
|---|---|---|
| `--spec` | string |  |
| `--target` | string |  |
| `--root` | string |  |
| `--pack-root` | string |  |
| `--out` | string | Write patch JSON to this path |
| `--max-evals` | string |  |

### `ge okf enrich apply`

Apply or dry-run a structured OKF enrichment patch

| Flag | Type | Description |
|---|---|---|
| `--patch` | string |  |
| `--root` | string |  |
| `--write` | boolean |  |
| `--force` | boolean |  |

### `ge okf enrich shard`

Group an enrichment plan into bounded parallel shard manifests

| Flag | Type | Description |
|---|---|---|
| `--plan` | string |  |
| `--out` | string |  |

### `ge okf enrich prompt`

Render a Codex/Claude/Antigravity shard prompt from an enrichment manifest

| Flag | Type | Description |
|---|---|---|
| `--shard` | string |  |
| `--harness` | string |  |
| `--out` | string |  |

### `ge okf eval`

Static OKF eval verification

### `ge okf eval verify`

Static verification for OKF eval references, fixtures, assertions, and action-tool state coverage

| Flag | Type | Description |
|---|---|---|
| `--all` | boolean |  |
| `--spec` | string |  |
| `--changed` | boolean |  |
| `--root` | string |  |

### `ge okf graph`

Extract concept authority/relationship graph from an OKF bundle

| Flag | Type | Description |
|---|---|---|
| `<bundle>` | positional (required) |  |
| `--format` | string | json or cytoscape |

### `ge okf explain`

Explain one OKF concept's authority, backlinks, proof, citations, and gaps

| Flag | Type | Description |
|---|---|---|
| `<concept>` | positional (required) |  |
| `--bundle` | string | OKF bundle directory |

### `ge okf compile`

Compile spec→OKF bundle or OKF bundle→spec (typed compiler with variant resolution)

| Flag | Type | Description |
|---|---|---|
| `--from` | string |  |
| `--to` | string |  |
| `--spec` | string |  |
| `--bundle` | string |  |
| `--out` | string |  |
| `--all` | boolean | Compile every generated catalog agent spec into an OKF bundle and write audit/graph/coverage sidecars |
| `--variant-base` | string | Base bundle directory for a variant bundle (default: sibling directory named after the root's variant_of id) |

### `ge okf skill`

Compile an agent spec into an Agent Skill package (SKILL.md + references + scripts + assets) — the skill-based alternative to generated ADK runtime code

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Use case id from the generated catalog |
| `--spec` | string | Path to an agent spec JSON (alternative to --id) |
| `--out` | string | Output skill directory (default apps/factory/artifacts/skills/<id>) |

### `ge okf customize`

Customize a base agent into a variant bundle (system swaps, terminology, vertical policy overlay) and compile it against the base

| Flag | Type | Description |
|---|---|---|
| `--base` | string | Base agent id (under the OKF corpus root) or an explicit bundle directory |
| `--id` | string | New agent id for the variant bundle |
| `--swap-system` | string | System swap <from>=<to> (repeatable, or comma-separated) |
| `--rename` | string | Terminology rewrite <term>=<replacement> (repeatable, or comma-separated) |
| `--vertical` | string | Vertical name — sets variant_kind vertical and adds a policy-overlay stub |
| `--out` | string | Output bundle directory (default <okf root>/<id>) |

### `ge okf diff`

Machine-readable OKF/spec round-trip diff summary

| Flag | Type | Description |
|---|---|---|
| `<left>` | positional (required) |  |
| `<right>` | positional (required) |  |

### `ge okf repair`

Conservatively repair navigability (missing indexes/log); dry-run by default

| Flag | Type | Description |
|---|---|---|
| `<bundle>` | positional (required) |  |
| `--dryRun` | boolean |  |

### `ge library`

Agent Library package manager: stats · list · search · inspect · create

### `ge library stats`

Show Agent Library inventory counts

### `ge library list`

List Agent Library blueprints

| Flag | Type | Description |
|---|---|---|
| `--limit` | string |  |

### `ge library search`

Search Agent Library blueprints

| Flag | Type | Description |
|---|---|---|
| `<query>` | positional |  |
| `--vertical` | string |  |
| `--department` | string |  |
| `--domain` | string |  |
| `--system` | string |  |
| `--target` | string |  |
| `--status` | string |  |
| `--authority` | string |  |

### `ge library inspect`

Inspect a blueprint package

| Flag | Type | Description |
|---|---|---|
| `<slug>` | positional (required) |  |

### `ge library explain`

Explain a blueprint's behavior contract and next steps

| Flag | Type | Description |
|---|---|---|
| `<slug>` | positional (required) |  |

### `ge library status`

Show computed blueprint lifecycle readiness

| Flag | Type | Description |
|---|---|---|
| `<slug>` | positional (required) |  |

### `ge library related`

Show related blueprints

| Flag | Type | Description |
|---|---|---|
| `<slug>` | positional (required) |  |

### `ge library doctor`

Check the generated Agent Library index

### `ge library refresh-index`

Regenerate okf/library/index.json from OKF bundles

### `ge systems`

Bring-Your-Own-System: list built-in simulators (list) · synthesize a new one (synth) · bind a system to a live target (bind/bindings/unbind) · check the toolchain (doctor)

### `ge systems list`

List the built-in simulated systems known to the generator registry

### `ge systems synth`

Synthesize a brand-new live simulator system from an NL description, samples, or an OpenAPI spec

| Flag | Type | Description |
|---|---|---|
| `--name` | string | Display name for the synthesized system |
| `--description` | string | Natural-language description (mode: nl, the default) |
| `--from-openapi` | string | Path to an OpenAPI/Swagger JSON spec (mode: openapi) |
| `--from-samples` | string | Path to a JSON file of {collection: [rows]} (mode: samples) |
| `--promote` | boolean | Also persist the result into the curated corpus (registry.json + per-section files) |
| `--local` | boolean | Override: synthesize with the in-process (session-only) overlay (default) |
| `--remote` | boolean | Override: synthesize as if run remotely — auto-sets a durable overlay backend (firestore) unless one is already configured |

### `ge systems bind`

Bind a contract system to a live twin/mcp/rest target

| Flag | Type | Description |
|---|---|---|
| `<system>` | positional (required) | Contract system id to bind (see `ge systems list`) |
| `--to` | string | Bind target: twin pack id \| MCP endpoint URL \| REST base URL |
| `--kind` | string | Target kind: twin \| mcp \| rest |
| `--mode` | string | Twin vs. live precedence: twin_first \| live_first \| twin_only |
| `--connector` | string | Connector package/module name (informational until a connector SDK exists) |
| `--config` | string | Inline JSON object, or a path to a JSON file, of connector config |

### `ge systems bindings`

List stored live-system bindings (read-only)

### `ge systems unbind`

Remove a system's live binding

| Flag | Type | Description |
|---|---|---|
| `<system>` | positional (required) | Contract system id to unbind |

### `ge systems doctor`

Check the BYO-systems toolchain: python, synthesize_cli.py, registry.json, live bindings, overlay backend

### `ge byo`

BYO manifest (ge.byo.yaml): validate + plan (doctor) · execute the safe subset (apply)

### `ge byo doctor`

Validate a BYO manifest and report the full apply plan (read-only)

| Flag | Type | Description |
|---|---|---|
| `--manifest` | string | Path to the ge.byo.yaml manifest |

### `ge byo apply`

Apply the safe (appliable) subset of a BYO manifest; --dry-run reports the plan without executing anything

| Flag | Type | Description |
|---|---|---|
| `--manifest` | string | Path to the ge.byo.yaml manifest |
| `--dry-run` | boolean | Print what would be applied; execute nothing |

### `ge harness`

Harness integration: wire factory gates into the assistant's own hook system

### `ge harness hooks`

Post-action checks inside the harness session: install · show

### `ge harness hooks install`

Write this repo's post-action checks into a harness's hook config (supported: claude)

| Flag | Type | Description |
|---|---|---|
| `--harness` | string | Harness to configure (default claude → .claude/settings.json) |
| `--dry-run` | boolean | Show the merge without writing |

### `ge harness hooks show`

Show the hook plan `install` would apply, per harness

### `ge improve`

Self-improvement loop: enrich an agent's blueprint toward a target quality level (audit → enrich → verify → re-audit), then build+judge

| Flag | Type | Description |
|---|---|---|
| `--id` | string | Agent/spec id under the OKF corpus root |
| `--spec` | string | Alias for --id |
| `--target` | string | Target quality level L0–L5 (default L4) |
| `--write` | boolean | Run the closed loop and enrich the corpus (default: preview one batch) |
| `--max-iterations` | string | Loop cap when writing (default 5) |
| `--max-evals` | string | Obligations added per iteration (default 5) |
| `--root` | string | OKF corpus root (default okf) |

### `ge models`

Model provider readiness: doctor

### `ge models doctor`

Structural readiness for model providers: Vertex, harness Python, refinement/judge model config (no network/paid calls)

### `ge console`

Operator console UI (Cloud Run service): deploy · doctor

### `ge console deploy`

Build the console image + bind it via terraform apply (Terraform owns Cloud Run config)

| Flag | Type | Description |
|---|---|---|
| `--tag` | string | Explicit image tag (default: git short SHA) |
| `--no-apply` | boolean | Build + push only — skip terraform apply (bind later with a plain `ge console deploy` or `ge infra apply`) |

### `ge console doctor`

Check the console Cloud Run service + config (read-only; never fails hard — see `ge doctor` for the mutating gateway/worker plane)

### `ge apply`

Reconcile actual → desired platform + fleet from a manifest (ge.manifest.json). Plans by default; --yes executes.

| Flag | Type | Description |
|---|---|---|
| `--yes` | boolean | Execute the plan in dependency order (default: plan only) |
| `--manifest` | string | Path to a manifest JSON (default ge.manifest.json) |

### `ge completions`

Emit a shell completion script for `ge` (bash|zsh|fish) — subcommand names only, not flags

| Flag | Type | Description |
|---|---|---|
| `<shell>` | positional (required) | bash, zsh, or fish |
<!-- END GENERATED: ge-command-tree -->

### Examples

```bash
ge                                        # status board: planes ✓/○ + next command
ge agents build --canary --local          # build one agent on this machine
ge agents build --all --remote            # submit the whole fleet to the cloud
ge agents build --ids account-reconciliation-agent --no-refine
ge pipeline plan --usecase account-reconciliation-agent
ge pipeline run --scenario leave-planning --systems workday,docusign_clm --target-stage preview
ge fleet repair --ids agent-a,agent-b --target-stage preview
ge runs job -- ge <args>                  # run a ge command as a background run
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
| `mise run prove` | Run `ge prove`: local doctor → local mode → one validated canary workspace |
| `mise run bootstrap-cloud [CANARY=1]` | End-to-end: toolchain + `ge init` + `ge up`. `CANARY=1` also builds one agent. Needs `GEMINI_ENTERPRISE_APP_ID` + gcloud auth |
| `mise run all` | Alias for `bootstrap` |
| `mise run deps` / `mise run data-runtime` / `mise run deps-terraform` | Toolchain pieces: uv + agents-cli + `.venv` (google-antigravity); Snowfakery runtime; terraform |
| `mise run install` / `mise run uninstall` | Install / remove the `ge` command |
| `mise run ci` | Run the CI gate locally (source hygiene + `bun test apps tools`) |
| `mise run install-hooks` | Install the pre-commit hook (source hygiene) |
| `mise run catalog` | Regenerate the use-case catalog build artifact |

### Skills

`mise run skills-sync` · `mise run skills-doctor` · `mise run skills-doctor-spec` ·
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
| `mise run build-agents [CANARY=1]` | `ge agents build` (`--canary` or `--all`) |
| `mise run build-agents-local [CANARY=1]` | `ge agents build --local` |
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
