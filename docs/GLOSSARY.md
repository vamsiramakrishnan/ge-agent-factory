---
title: Glossary
description: Translate factory terminology into plain language and follow each term to the concept, guide, or reference page that owns it.
nav_order: 8
layout: default
---

# Glossary

Plain-language translations of the internal jargon you'll run into while
reading the `ge-agent-factory` codebase and docs (the "GE" is **Gemini
Enterprise** — the Google Cloud product the factory publishes agents into).
Each entry gives the term as you'll see it, what it IS in one
sentence, and where you're likely to first bump into it.

Missing a term? Open a doc PR to add it.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## The golden register

The words a stranger meets first — they name **what you have** (a contract, a
proof, a passport), not how the machinery produces it. These terms are the
product's public vocabulary (see [`LANGUAGE.md`](LANGUAGE.md) for the policy
and the CI gate that keeps them in front).

### Enterprise Agent Contract

**What it is:** The versioned, machine-readable statement of what an agent
may do and what world it operates in. It's materialized today as the
use-case spec (`usecase-spec.json`: `behaviorContract` + `generationSpec`),
with a portable Markdown twin — the [OKF](#okf--knowledge-bundle) bundle.
"Contract" in these docs always means this artifact, not a legal document.

**Where you'll meet it:** `docs/concepts/enterprise-agent-contract.md`;
`docs/reference/spec-schema.md` for the field tables; the console's Spec
Review canvas.

---

### Behavior Contract

**What it is:** The half of a use-case spec that defines what the agent is
*allowed and expected to do*: role, objective, scope, callable tools,
required evidence, and escalation/refusal guardrails. It's the
`behaviorContract` field in `usecase-spec.json`. The other half,
`generationSpec`, describes the *world* the agent operates in (source
systems, entities) — behavior vs. world are the "two halves of a spec."

**Where you'll meet it:** `docs/concepts/enterprise-agent-contract.md` ("The two halves
of a spec"); `docs/reference/spec-schema.md` for the full field list; the
console's spec editor renders this as the agent's role/scope/rules section.

---

### Source-system Twin

**What it is:** A simulated enterprise backend — a
[scenario/simulator pack](#scenario-packs-aka-simulator-packs) run by the
generic simulator engine — realistic enough (state machines, approval
gates, idempotency) to test agents against before any real integration
exists.

**Where you'll meet it:** `docs/concepts/source-system-twins.md`;
`simulator-systems/<id>/` packs; the console's BYO system flow.

---

### System Binding

**What it is:** The recorded choice of what a contract's system id actually
talks to: a simulated [twin](#source-system-twin) (the default — nothing to
bind), or a live target reached over MCP (Model Context Protocol) or REST.
`ge systems bind <system> --to <target> --kind twin|mcp|rest --mode
twin_first|live_first|twin_only` writes one (schema `ge.system-binding.v1`)
to `.ge/systems/bindings.json`; `mode` decides whether calls try the twin or
the live target first.

**Where you'll meet it:** `ge systems bind|bindings|unbind|doctor`;
`packages/byo-systems/src/bindings.mjs`;
[Bring your own systems](cookbooks/bring-your-own-systems.html).

---

### BYO Manifest

**What it is:** One file (`ge.byo.yaml`, schema `ge.byo.v1`) that packages
every bring-your-own insertion point an enterprise might set at once —
system bindings and overlay backend, eval packs, domain packs, model
choices, admission/promotion policy, the generated-agents repo, cloud
project/region. `ge byo doctor` validates it and reports a plan (each
action `appliable`, `planned-only`, or `invalid`) without changing
anything; `ge byo apply` executes the appliable subset. Not the same file as
`ge.manifest.json` (the platform/fleet desired state `ge apply` reconciles).

**Where you'll meet it:** `ge.byo.example.yaml` (repo root);
`ge byo doctor|apply`; `tools/lib/byo-manifest.mjs`;
[Bring your own systems](cookbooks/bring-your-own-systems.html).

---

### Capture

**What it is:** The golden path's first verb — turning business intent into an
[Enterprise Agent Contract](#enterprise-agent-contract). `ge capture` opens
(and if needed starts) the console [Interview](#interview) for conversational
capture with document grounding; `ge capture --from <agent-spec.json>`
registers an already-captured contract with the catalog. Capture is
console-first today; CLI-native capture is roadmap.

**Where you'll meet it:** `ge capture`; the console Interview
(`#/interview`); `docs/cookbooks/capture-from-interview.md`.

---

### Interview

**What it is:** The guided, conversational flow where a business user (or
agent) describes a use case and the factory turns it into a formal spec.
It's the very first box in the [pipeline](#pipeline).

**Where you'll meet it:** `apps/console/src/views/Interview.tsx`; the
"Author a spec via the interview" cookbook.

---

### Prove

**What it is:** The golden path's middle verb — compiling contracts into
working agents and running their evidence: evals, the
[spec-to-code trace](#spec-to-code-trace), and verify verdicts, all up to the
[build boundary](#build-boundary) (pure local computation). On a fresh
machine `ge prove` runs the health check and builds a first validated
workspace; once agents exist it rebuilds their proof (`ge agents build`).
`ge prove --watch` re-proves on contract change.

**Where you'll meet it:** `ge prove`; `docs/cookbooks/prove-an-agent.md`; the
[Promotion Gate](#promotion-gate) consumes what it produces.

---

### Evalset

**What it is:** The generated evaluation suite for one agent — prompts plus
expected behavior in `agents-cli`'s eval format — that scores whether the
agent behaves as the spec's behavior contract says. It's generated
into the [workspace](#workspace) alongside the code and run with
`agents-cli eval run --dataset tests/eval/datasets/ge_behavior_contract.json
--config tests/eval/eval_config.yaml` inside the workspace (or the eval command
`workspace.json` lists).

**Where you'll meet it:** `docs/cookbooks/prove-an-agent.md`; the eval config
path `ge prove` prints; [`agents-cli`](#agents-cli)'s eval surface.

---

### Spec-to-Code Trace

**What it is:** The automated check that verifies the code the
factory generated matches what the spec asked for; one of the
inputs the [Promotion Gate](#promotion-gate) reads.

**Where you'll meet it:** `apps/factory/src/spec-code-trace.js`; the trace
artifact listed in `workspace.json`.

---

### Proof Pack

**What it is:** The set of artifacts showing an agent honored its contract
before release: the validation report, the
[spec-to-code trace](#spec-to-code-trace), the harness review/refine
verdicts, eval results, and the promotion packet the
[Promotion Gate](#promotion-gate) writes. Not a single file today — the
promotion packet is the closest single summary.

**Where you'll meet it:** `docs/concepts/agent-passport-and-proof-pack.md`;
`workspace.json`'s artifact list; the console's Agent detail artifacts.

---

### Agent Passport

**What it is:** The identity side of the proof story — the artifacts that
say what a deployed agent *is*: `agents-cli-manifest.yaml`, its Agent
Registry entry, its per-agent runtime identity, and its `workspace.json`
manifest. Their consolidated, signed form — `artifacts/agent-passport.json`,
minted by `ge passport emit` — binds the [proof pack](#proof-pack) to the
workspace's exact content by digest and signature.

**Where you'll meet it:** `docs/concepts/agent-passport-and-proof-pack.md`;
`ge passport emit|verify|admit`; the `register_tools` stage; Agent detail in
the console.

---

### Admission Gate

**What it is:** The recorded allow/deny decision in front of a release.
`ge handoff` verifies each workspace's [Agent Passport](#agent-passport) —
signatures, digest bindings, freshness, and attested verdicts — against
the `promotion.gates.admission` policy before uploading anything. It ships
in audit mode (every decision recorded, nothing refused) and enforces once
an operator sets `required: true`; `--force` is the recorded break-glass.

**Where you'll meet it:** `ge passport admit`;
`docs/reference/admission.md`; `docs/cookbooks/admit-an-agent.md`; the
decision log at `.ge/admission/decisions.jsonl`.

---

### Promotion Gate

**What it is:** An automated pass/fail check that runs right before deploy
and refuses to ship a [workspace](#workspace) whose validation report,
[spec-to-code trace](#spec-to-code-trace), or harness verdicts
(review/refine) haven't cleared their bar. If it
fails, you get a list of specific blockers instead of a deploy — you can
override with `--force` or `GE_ALLOW_UNPROMOTED=1`, but the gate exists so a
broken or unreviewed agent can't reach the cloud by accident.

**Where you'll meet it:** Run `factory promotion-gate` (implemented in
`apps/factory/src/promotion-packet.js`); it's also section `## Promotion
Gate` inside the generated promotion packet artifact, and the quickstart doc
(`apps/docs/src/content/docs/start/quickstart.mdx`) mentions it as the check
that "blocks a ship that hasn't passed validation and the harness verdicts."

---

### Build Boundary

**What it is:** The cutoff between building and previewing an agent locally
and deploying it to your Google Cloud project. In local mode, everything up
to and including the `preview` stage runs offline with no cloud
credentials; anything past that boundary (deploy, publish, register)
touches real cloud infrastructure and is dispatched to Cloud Build. In code
this shows up as the constant `LOCAL_BUILD_BOUNDARY = "previewed"`.

**Where you'll meet it:** The "AUTHOR & BUILD / VALIDATE & REFINE / RELEASE"
diagram and "The build boundary: local build vs remote release" section in
`docs/start/mental-model.md`; the `buildBoundary` field on
[pipeline-run](#pipeline-run) plans (`tools/lib/factory-autopilot-mission.mjs`).

---

### Handoff

**What it is:** The factory's release act — handing a locally proven
workspace to the layer below: `agents-cli` → ADK Agent Engine → Gemini
Enterprise. `ge handoff agents-cli` runs only the post-boundary stages
(`load_data → deploy_runtime → register_tools → publish_enterprise`).

**Where you'll meet it:** `docs/concepts/handoff-targets.md`;
`docs/cookbooks/handoff-adk-gemini-enterprise.md`; `ge handoff agents-cli`.

---

### Handoff Package

**What it is:** A local, zero-cloud-call copy of exactly what `ge handoff`
would upload, plus a manifest of content digests. `ge handoff plan` reports
the digests and the [Admission Gate](#admission-gate) verdict without
building anything; `ge handoff package` builds the archive to a local path
instead of GCS; `ge handoff verify-package` re-extracts it and checks the
digests against the manifest for tamper or corruption. None of the three
upload, submit, or record a decision — they exist to let you inspect a
handoff before running it for real.

**Where you'll meet it:** `ge handoff plan|package|verify-package`;
`tools/lib/handoff-package.mjs`.

---

## The operator register

The machinery's own names, for people operating the factory day to day. Every
term below is real, supported, and documented — this register doesn't
lead: it lives in `Operate` sections, reference pages, and under-the-hood
disclosures rather than front doors.

### Capability Kernel

**What it is:** The closed vocabulary + validator every operator command's
entry must satisfy: risk levels, preflight requirement keys, observability
modes, MCP (Model Context Protocol) parameter types
(`packages/core-api/src/capability.mjs`), checked by
`assertCapabilityTable()` at import time. A malformed entry — an unknown
risk level, a route two commands both claim — fails every surface (CLI,
console, MCP server) before any of them run, not just the one exercised.

**Where you'll meet it:** `@ge/core-api`; the "capability kernel" section of
`docs/reference/architecture.md`; [Atomic capabilities](reference/atomic-capabilities.html).

---

### Capability Registry

**What it is:** The single table (`GE_COMMANDS`,
`packages/capability-registry/src/registry.mjs`, 54 entries) that wires one
capability to its CLI verb, console route, MCP tool, risk level, and
preflight requirements at once. The CLI, the console, and the MCP server all
read this same table, validated against the [Capability
Kernel](#capability-kernel) — a route, a CLI invocation, and an MCP schema
cannot drift apart because they're one object rendered three ways.

**Where you'll meet it:** `@ge/capability-registry`; `tools/mcp-server.mjs`;
`apps/console/src/shared/ge-commands.mjs`;
[Atomic capabilities](reference/atomic-capabilities.html).

---

### Harness

**What it is:** The local, LLM-driven review-and-fix step that checks
whether generated code matches the spec, running on your machine (or the
worker) after code generation and before anything ships to the cloud. It's
powered by [Antigravity](#antigravity)
(`apps/factory/scripts/antigravity-sdk-agent.py`),
which reviews the generated ADK code against the spec (writing
`artifacts/generator-feedback.json`), then tries to auto-fix mismatches
(writing `artifacts/harness-refine.json` with a `spec_to_code_fidelity`
verdict). "Harness" also loosely refers to the whole local operator
surface — the CLI loop, the daemon, and the pipeline stages named
`harness_reviewed` and `harness_refined`.

**Where you'll meet it:** The stage pipeline diagram in
`docs/start/mental-model.md`; `apps/factory/docs/harness-data-model.md`;
in the console, the Activity feed shows a line like "Antigravity review:
&lt;provider&gt; · score &lt;n&gt;" for any run that went through this step.

---

### Antigravity

**What it is:** Google's agent SDK (the `google-antigravity` Python package)
that powers the [harness](#harness) review/refine step — the factory drives
it headlessly to judge and repair spec-to-code fidelity. `mise run deps`
installs it into the repo `.venv`; if `google.antigravity` isn't importable,
local harness runs fail.

**Where you'll meet it:** `mise run doctor-local` checks it;
`apps/factory/scripts/antigravity-sdk-agent.py` is the driver; console
Activity lines read "Antigravity review: …".

---

### OKF / Knowledge Bundle

**What it is:** OKF (**Open Knowledge Format**) is a portable, human-readable
version of an agent's spec — a folder of plain Markdown files (called
"concepts") instead of one `usecase-spec.json` file. A "Knowledge Bundle" is
that folder once it's built: it's written into the generated agent's
`app/knowledge/` directory, and the agent reads it at runtime to ground its
answers in the systems, tables, tools, and rules the spec declared.
You can also hand-author a bundle from scratch and feed it back into the
factory (`scripts/okf-to-spec.mjs`) — a spec and an OKF bundle are two forms
of the same object.

**Where you'll meet it:** `docs/concepts/enterprise-agent-contract.md` for the concept;
in the console, the spec editor's "Export OKF" button and the "OKF
Knowledge Bundle" preview modal (`apps/console/src/components/interview/SpecCanvas.tsx`).

---

### Scenario Packs (a.k.a. Simulator Packs)

**What it is:** Pre-built bundles that give a use case fixture data and a
simulated backend to call, without hand-building either. Each
pack (there are 50+ system simulator packs, plus higher-level "scenario"
packs like `analyticsPack` or `hrEmployeeRecordsPack`) declares which
source systems, entities, tools, and workflows it covers, plus starter data.
The system-level version is usually called a "simulator pack"
(`simulator-systems/<id>/`); the use-case-level grouping, a "scenario
pack" — same underlying idea: a ready-made fixture/simulator binding you
don't have to build from scratch.

**Where you'll meet it:** `docs/concepts/source-system-twins.md` for
simulator packs; `apps/factory/scripts/factory/packs/index.mjs` and the
`factory pack-coverage` CLI command for the use-case-level scenario packs.

---

### Domain Pack

**What it is:** A checked-in bundle of expert knowledge for one regulatory
or business domain — invariants (e.g. "SAR clock preserved," "no
customer tipoff" for AML), eval seeds, adversarial seeds, fixture rules, and
an expert rubric (`domain-packs/<id>/pack.json`, schema
`okf-domain-pack.v1`). `ge okf quality audit`/`ge okf enrich plan` match a
spec against every domain pack whose `applies_when` keywords/domains/tools
fire, so enrichment adds domain-specific coverage instead of generic evals.

**Where you'll meet it:** `domain-packs/` (repo root — `aml`,
`loan-covenants`, `fnol-claims`, `procure-to-pay`, and others);
`tools/lib/okf-quality.mjs`; `skills/enriching-okf-blueprints/`.

---

### Overlay Scope

**What it is:** Where a synthesized or bound source-system twin's runtime
state lives — the in-process, non-durable `memory` backend (lost on
restart, not shared across replicas) or a durable backend (`firestore`,
`alloydb`) shared across every Cloud Run instance. `resolveOverlayScope()`
defaults to `memory` locally but auto-injects `firestore` the moment
[mode](#planes) is `remote`; an explicit `simulatorOverlayBackend` (config
field, flag, or BYO manifest section) always wins over either default.

**Where you'll meet it:** `packages/byo-systems/src/index.mjs`;
`GE_SIMULATOR_OVERLAY_BACKEND`/`simulatorOverlayBackend`;
[Bring your own systems](cookbooks/bring-your-own-systems.html).

---

### agents-cli

**What it is:** A lower-level command-line tool (from the `google-agents-cli`
Python package) that scaffolds and builds real Google ADK
(Agent Development Kit) Python projects — the `pyproject.toml`, the agent
code skeleton, and the eval harness format. The factory in this repo is a
higher-level orchestrator that *drives* `agents-cli` as one step among many
(alongside spec generation, data synthesis, and the harness review); you
won't usually call it directly, but you'll see its fingerprints in generated
workspaces and its [evalset](#evalset) format.

**Where you'll meet it:** `docs/concepts/handoff-targets.md` ("the
ADK/`agents-cli` command surface"); `mise run doctor-local` checks whether it's
installed; `apps/factory/src/agents-cli-scaffold.js` is where the factory
locates and invokes it.

---

### Planes

**What it is:** The three infrastructure layers the platform stands up in
your cloud project: the **factory plane**, the **data plane**, and the
**tool plane**. The factory plane runs builds (gateway, worker, Cloud Tasks
queue, Cloud Build); the data plane holds per-agent data and IAM (GCS,
BigQuery, Bigtable, Firestore, AlloyDB); the tool plane is what agents call
tools through (per-department MCP services, Agent Registry entries, Agent
Gateway). `ge up` provisions all three; `--infra`/`--data`/`--mcp` pick
one. Not the same thing as the "durable control plane," which is the
run-orchestration loop *inside* the factory plane.

**Where you'll meet it:** Bare `ge`'s status board ("planes ✓/○"); the
three-planes diagram in `docs/developers.md`; `tools/lib/planes/` in code.

---

### Daemon

**What it is:** The local background process (`ge daemon start`, HTTP on
port `17654` / `GE_DAEMON_PORT`) that runs long factory work —
[pipeline runs](#pipeline-run), [repair runs](#repair-run), generic jobs — as durable
runtime *tasks*, so a run survives your terminal closing and can be
resumed. `mise run setup` starts it for you; the console and CLI both talk
to it.

**Where you'll meet it:** `ge daemon status` / `ge daemon tasks`;
`tools/lib/runtime-daemon.mjs` in code; every `--port` flag on
`ge pipeline|fleet|runs` commands is this daemon's port.

---

### Detach

**What it is:** Submitting a local build to the [daemon](#daemon) and
getting a run id back immediately, instead of blocking for the whole build —
`ge agents build --local --detach` (and the `factory_agents_build` MCP tool
with `local:true, detach:true`). Only applies to local builds; a remote
build submission is already asynchronous, so `--detach` without `--local` is
a rejected combination, not a silent no-op.

**Where you'll meet it:** `ge agents build --local --detach`;
`tools/lib/daemon/detached-submit.mjs`; `ge agents status`/`ge runs events`
to follow the detached run.

---

### Ledger

**What it is:** The durable, event-sourced record of every run — one entry
per run, item, and stage — that `ge agents status`, the Fleet view, and the
console's Activity feed all read. Progress lives in the ledger (SQLite or
Postgres locally, via the `@ge/run-ledger` package; mirrored to Firestore
for cloud runs), never in a process — so runs stay observable and resumable
after a crash.

**Where you'll meet it:** "The durable control plane" in
`docs/start/mental-model.md`; `ge ledger backfill`;
`tools/lib/ledger/run-ledger.mjs` (shim over `packages/run-ledger`).

Note the ledger records **milestones** (`created`, `previewed`, `deployed` —
past-tense states), which are deliberately *not* the same names as the cloud
line's **stations** (`generate_workspace`, `preview`, `deploy_runtime` —
verbs). The mapping between the two vocabularies is in "Stations vs.
milestones" in `docs/reference/architecture.md`.

---

### Observation Plane

**What it is:** The one place a run's state gets read from, regardless of
whether the run is local or remote — `resolveRunLedger()`
(`tools/lib/planes/run-plane.mjs`), which picks the local SQLite
[ledger](#ledger) or the remote Firestore mirror behind one shape
(`events`, `getRun`, `listRuns`). Deliberately read-only: *submitting* a
run stays two different shapes (a local `ge` argv line vs. a remote build
intent), because there's no shared contract to unify those the way this
module unifies reads.

**Where you'll meet it:** `tools/lib/planes/run-plane.mjs`;
`ge runs events --remote`; "Observation vs. submission" in
`docs/reference/architecture.md`.

---

### Doctor

**What it is:** The health-check family: a set of read-only, actionable
pass/fail checks over the toolchain and the three [planes](#planes).
`ge doctor` is the unified check (toolchain · factory · data plane · tool
plane); `ge doctor --local` checks only the local toolchain; `ge data
doctor` and `ge mcp doctor` scope to one plane. It diagnoses; it never
mutates.

**Where you'll meet it:** `mise run doctor-local` right after setup; the
console's Doctor tab; `tools/lib/doctor/` in code.

---

### DevEx gate

**What it is:** The fast read-only developer-experience pass that checks the
repo works on your machine: `ge devex check` runs the local
[doctor](#doctor), the docs link check, and the generated workspace manifest
contracts. It only checks — the one-command *proof* (doctor → local mode →
one validated [canary](#canary) workspace) lives at `ge prove`; see
[Prove](#prove).

**Where you'll meet it:** `mise run devex-check`;
`docs/start/getting-started.md` steps 1–2.

---

### Canary

**What it is:** A build of exactly **one** agent, used to prove the pipeline
works end to end before committing to the whole catalog. `--canary` on
`ge agents build` (or `CANARY=1` on the `mise run build-agents*` tasks) is the
opposite of `--all`. Nothing to do with feature-flag canary releases — it's
"one [workspace](#workspace), all the way through."

**Where you'll meet it:** `mise run prove` builds one;
`CANARY=1 mise run build-agents-local`; the bootstrap task's optional canary
step.

---

### Fleet

**What it is:** The whole set of generated agents/workspaces, treated as one
unit — the opposite end of the scale from a [canary](#canary). "Fleet-level"
operations (bulk build, ship, sync, health) apply to every agent at once:
`ge agents build --all`, the shared MCP services, fleet health checks.

**Where you'll meet it:** The console's Fleet view (bulk build/ship/sync);
`tools/lib/fleet-ops.mjs` and `tools/lib/doctor/fleet-health.mjs` in code.

---

### Workspace

**What it is:** The on-disk folder for one generated agent
(`.ge/factory/workspaces/<workspace-id>/`), with a `workspace.json` manifest
describing what's in it. This is the unit that flows down the factory
line from stage to stage — and the thing the [Promotion Gate](#promotion-gate)
inspects before a deploy.

**Where you'll meet it:** `ge prove` prints the primary workspace
path; "Workspace manifest" in `docs/developers.md`; `ge state paths` shows
where they land.

---

### Pipeline run

**What it is:** One orchestrated, resumable run of the pipeline for a use
case, executed as a DAG of [daemon](#daemon) child tasks — data readiness,
simulator checks, optionally the factory build, the
[Antigravity](#antigravity) review node, and convergence to a target stage.
Preview the DAG without running (`ge pipeline graph`), run it
(`ge pipeline run`), resume it after a failure (`ge pipeline resume`). The
persisted daemon task kind is `pipeline.run`.

**Where you'll meet it:** `ge pipeline run|status|resume|graph|runs`;
scenario state under `.ge/pipelines/<scenario>`;
`skills/planning-missions/references/mission-contract.md` for the contract.

---

### Pipeline

**What it is:** The user-facing, end-to-end path from business intent to a
deployed agent — interview → spec → data → simulator → build → eval →
preview → deploy — rendered as a plan you can read (`ge pipeline plan`) and
watch (`ge pipeline status`). The stage view and the executable DAG behind
it (see [Pipeline run](#pipeline-run)) are one noun:
`ge pipeline status` shows where you are, `ge pipeline run` executes.

**Where you'll meet it:** `ge pipeline plan --usecase <id>`;
`tools/lib/journey-plan.mjs` in code.

---

### Repair run

**What it is:** The [daemon](#daemon)-native convergence loop for *many*
workspaces at once: given a set of ids (or the current queue), it observes
each workspace's blockers, runs repair up to `--attempts` times, and keeps
going until every item reaches the target stage (default `preview`). Think
"keep the [fleet](#fleet) converged" rather than "run one pipeline." The
persisted daemon task kind is `repair.run`.

**Where you'll meet it:** `ge fleet repair|repairs`; the Repair Queue in the
console; `tools/ge/fleet.mjs` in code.

---

### The orchestration vocabulary

**What it is:** The three orchestration nouns and the build, side by side —
what each one drives and which command family owns it:

| Term | What it orchestrates |
|---|---|
| **A build** (`ge agents build`) | One agent workspace through the stage pipeline (generate → validate → … → publish); recorded in the run [ledger](#ledger) |
| **[Pipeline](#pipeline)** (`ge pipeline plan\|run\|status\|resume\|graph`) | The end-to-end path AND its executable DAG — one noun for the view and the engine |
| **[Repair run](#repair-run)** (`ge fleet repair\|repairs`) | Convergence across many workspaces: observe blockers → repair → retry to a target stage |
| **Runs** (`ge runs list\|show\|events\|resume`) | Observability over every daemon-backed run of any kind |

**Where you'll meet it:** The `ge` CLI reference (`docs/reference/cli.md`);
the console's Pipeline / Fleet / Repair Queue / Runs views; the daemon's task
list (`ge runs list`).

---

### Gateway vs. Agent Gateway

**What it is:** Two different front doors that share a word. "The
**gateway**" (lowercase, factory-plane) is the Cloud Run service that
receives operator/CLI/console requests and enqueues factory work onto Cloud
Tasks — part of the durable control plane that runs builds. The "**Agent
Gateway**" (capitalized, managed Google Cloud product) is the governed
runtime front door that *deployed agents* call their MCP tools through, with
its own authz layer. Operator traffic goes through the first; agent tool
calls go through the second.

**Where you'll meet it:** Factory-plane gateway: the plane table in
`docs/developers.md` and `docs/start/mental-model.md`. Agent Gateway:
`docs/concepts/authority-graph.md` and
`installer/terraform/agent_gateway.tf`.

---

### Review vs. Refine

**What it is:** Two distinct sub-steps of the [harness](#harness). "Review"
only reports how well the generated code matches the spec
(`generator-feedback.json`); "Refine" goes further and tries to
automatically fix mismatches (`harness-refine.json`). Easy to conflate,
but only Refine changes code.

**Where you'll meet it:** The `harness_reviewed` and `harness_refined`
pipeline stages; `factory harness-review` vs. `factory harness-refine`.

---

### Proof Binding

**What it is:** The digest that ties a signed [Agent Passport](#agent-passport)'s
promotion packet to the exact OKF, evals, fixtures, and generator code it
was proven against (`computeProofBinding()`, `@ge/admission`) — four scoped
content digests plus a whole-workspace digest and a digest of the proof
policy itself. `validateProofBinding()` compares a stored binding against
what the workspace looks like right now; a mismatch is `GEADM009` — the
[Admission Gate](#admission-gate)'s way of saying the evidence backing a
promotion verdict is stale, not just that the verdict itself failed
(`GEADM006`).

**Where you'll meet it:** `packages/admission/src/digest.mjs`;
`docs/reference/admission.md`'s `GEADM` blocker-code table;
`requireFreshProofBinding` in the admission policy.
