---
title: Glossary
nav_order: 8
layout: default
---

# Glossary

Plain-language translations of the internal jargon you'll run into while
reading the `ge-agent-factory` codebase and docs (the "GE" is **Gemini
Enterprise** — the Google Cloud product the factory publishes agents into).
Each entry gives the term as you'll actually see it, what it IS in one
sentence, and where you're likely to first bump into it.

If a term you needed isn't here, it's probably still worth a doc PR — this
list is deliberately focused, not exhaustive.

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
may do and what world it operates in — materialized today as the use-case
spec (`usecase-spec.json`: `behaviorContract` + `generationSpec`) with a
portable Markdown twin (the [OKF](#okf--knowledge-bundle) bundle). "Contract"
in these docs always means this artifact, not a legal document.

**Where you'll meet it:** `docs/concepts/enterprise-agent-contract.md`;
`docs/reference/spec-schema.md` for the field tables; the console's Spec
Review canvas.

---

### Behavior Contract

**What it is:** The half of a use-case spec that defines what the agent is
*allowed and expected to do* — its role, its primary objective, what's in
and out of scope, the tools it may call, the evidence it must gather before
acting, and hard guardrails (escalation/refusal rules). It's the field
literally named `behaviorContract` in `usecase-spec.json`. The other half,
`generationSpec`, describes the *world* the agent operates in (source
systems, entities) — behavior vs. world are the "two halves of a spec."

**Where you'll meet it:** `docs/concepts/enterprise-agent-contract.md` ("The two halves
of a spec"); `docs/reference/spec-schema.md` for the full field list; the
console's spec editor renders this as the agent's role/scope/rules section.

---

### Source-system Twin

**What it is:** The docs' name for a simulated enterprise backend — a
[scenario/simulator pack](#scenario-packs-aka-simulator-packs) executed by
the generic simulator engine — realistic enough (state machines, approval
gates, idempotency) that agents are tested against it before any real
integration exists.

**Where you'll meet it:** `docs/concepts/source-system-twins.md`;
`simulator-systems/<id>/` packs; the console's BYO system flow.

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
It's the very first box in the [pipeline](#pipeline-formerly-journey).

**Where you'll meet it:** `apps/console/src/views/Interview.tsx`; the
"Author a spec via the interview" cookbook.

---

### Prove

**What it is:** The golden path's middle verb — compiling contracts into
working agents and running their evidence: evals, the
[spec-to-code trace](#spec-to-code-trace), and verify verdicts, all up to the
[build boundary](#build-boundary) (pure local computation). On a fresh
machine `ge prove` runs the health check and builds a first validated
workspace (the operator spelling is `ge devex smoke`); once agents exist it
rebuilds their proof (`ge agents build`). `ge prove --watch` re-proves on
contract change.

**Where you'll meet it:** `ge prove`; `docs/cookbooks/prove-an-agent.md`; the
[Promotion Gate](#promotion-gate) consumes what it produces.

---

### Evalset

**What it is:** The generated evaluation suite for one agent — prompts plus
expected behavior in `agents-cli`'s eval format — that scores whether the
agent actually behaves as the spec's behavior contract says. It's generated
into the [workspace](#workspace) alongside the code and run with
`agents-cli eval run --all` inside the workspace (or the eval commands
`workspace.json` lists).

**Where you'll meet it:** `docs/cookbooks/prove-an-agent.md`; the eval config
path `ge devex smoke` prints; [`agents-cli`](#agents-cli)'s eval surface.

---

### Spec-to-Code Trace

**What it is:** The automated check that verifies the code the
factory generated actually matches what the spec asked for; one of the
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

**What it is:** The identity side of the proof story: the artifacts that say
what a deployed agent *is* — `agents-cli-manifest.yaml`, its Agent Registry
entry, its per-agent runtime identity, and its `workspace.json` manifest.
There is no single consolidated passport file yet; consolidating one is
roadmap work.

**Where you'll meet it:** `docs/concepts/agent-passport-and-proof-pack.md`;
the `register_tools` stage; Agent detail in the console.

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

**What it is:** The cutoff point between "building and previewing an agent
on your own machine" and "actually deploying it to your Google Cloud
project." In local mode, everything up to and including the `preview`
stage runs offline with no cloud credentials; anything past that boundary
(deploy, publish, register) touches real cloud infrastructure and is
dispatched to Cloud Build. In code this shows up as the constant
`LOCAL_BUILD_BOUNDARY = "previewed"`.

**Where you'll meet it:** The "AUTHOR & BUILD / VALIDATE & REFINE / RELEASE"
diagram and "The build boundary: local build vs remote release" section in
`docs/start/mental-model.md`; the `buildBoundary` field on
[pipeline-run](#pipeline-run-formerly-mission) plans (`tools/lib/factory-autopilot-mission.mjs`).

---

### Handoff

**What it is:** The factory's release act: giving a locally proven workspace
to the layer below — `agents-cli` → ADK Agent Engine → Gemini Enterprise —
via `ge agents ship`, which runs only the post-boundary stages
(`load_data → deploy_runtime → register_tools → publish_enterprise`).

**Where you'll meet it:** `docs/concepts/handoff-targets.md`;
`docs/cookbooks/handoff-adk-gemini-enterprise.md`; `ge agents ship`.


---

## The operator register

The machinery's own names, for people running the factory in anger. Every
term below is real, supported, and documented — this register just doesn't
lead: it lives in `Operate` sections, reference pages, and under-the-hood
disclosures rather than front doors.

### Harness

**What it is:** The local, LLM-driven "does this generated agent actually
match the spec?" review-and-fix step that runs on your machine (or the
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
"concepts") instead of one big JSON blob. A "Knowledge Bundle" is that
folder once it's built: it's written into the generated agent's
`app/knowledge/` directory, and the agent reads it at runtime to ground its
answers in the systems, tables, tools, and rules the spec actually declared.
You can also hand-author a bundle from scratch and feed it back into the
factory (`scripts/okf-to-spec.mjs`) — a spec and an OKF bundle are two forms
of the same object.

**Where you'll meet it:** `docs/concepts/enterprise-agent-contract.md` for the concept;
in the console, the spec editor's "Export OKF" button and the "OKF
Knowledge Bundle" preview modal (`apps/console/src/components/interview/SpecCanvas.tsx`).

---

### Scenario Packs (a.k.a. Simulator Packs)

**What it is:** Pre-built bundles that give a use case realistic-looking
fake data and a fake backend to talk to, without hand-coding anything. Each
pack (there are 50+ system simulator packs, plus higher-level "scenario"
packs like `analyticsPack` or `hrEmployeeRecordsPack`) declares which
source systems, entities, tools, and workflows it covers, plus starter data.
The factory's docs mostly call the system-level version a "simulator pack"
(`simulator-systems/<id>/`) and the use-case-level grouping a "scenario
pack" — same underlying idea: a ready-made fixture/simulator binding you
don't have to build from scratch.

**Where you'll meet it:** `docs/concepts/source-system-twins.md` for
simulator packs; `apps/factory/scripts/factory/packs/index.mjs` and the
`factory pack-coverage` CLI command for the use-case-level scenario packs.

---

### agents-cli

**What it is:** A lower-level command-line tool (from the `google-agents-cli`
Python package) that actually scaffolds and builds real Google ADK
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
your cloud project — the **factory plane** (gateway, worker, Cloud Tasks
queue, Cloud Build: the machinery that runs builds), the **data plane**
(GCS, BigQuery, Bigtable, Firestore, AlloyDB, per-agent data + IAM), and the
**tool plane** (the per-department MCP services, Agent Registry entries, and
the Agent Gateway that agents call tools through). `ge up` provisions all
three; `--infra`/`--data`/`--mcp` pick one. Not the same thing as the
"durable control plane," which is the run-orchestration loop *inside* the
factory plane.

**Where you'll meet it:** Bare `ge`'s status board ("planes ✓/○"); the
three-planes diagram in `docs/developers.md`; `tools/lib/planes/` in code.

---

### Daemon

**What it is:** The local background process (`ge daemon start`, HTTP on
port `17654` / `GE_DAEMON_PORT`) that runs long factory work —
[pipeline runs](#pipeline-run-formerly-mission), [repair runs](#repair-run-formerly-autopilot), generic jobs — as durable
runtime *tasks*, so a run survives your terminal closing and can be
resumed. `mise run setup` starts it for you; the console and CLI both talk
to it.

**Where you'll meet it:** `ge daemon status` / `ge daemon tasks`;
`tools/lib/runtime-daemon.mjs` in code; every `--port` flag on
`ge mission|journey|autopilot` commands is this daemon's port.

---

### Ledger

**What it is:** The durable, event-sourced record of every run — one entry
per run, item, and stage — that `ge agents status`, the Fleet view, and the
console's Activity feed all read. Progress lives in the ledger (SQLite or
Postgres locally, via the `@ge/run-ledger` package; mirrored to Firestore
for cloud runs), never in a process — which is what makes runs observable
and resumable after a crash.

**Where you'll meet it:** "The durable control plane" in
`docs/start/mental-model.md`; `ge ledger backfill`;
`tools/lib/ledger/run-ledger.mjs` (shim over `packages/run-ledger`).

Note the ledger records **milestones** (`created`, `previewed`, `deployed` —
past-tense states), which are deliberately *not* the same names as the cloud
line's **stations** (`generate_workspace`, `preview`, `deploy_runtime` —
verbs). The mapping between the two vocabularies is in "Stations vs.
milestones" in `docs/reference/architecture.md`.

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

### DevEx gate and smoke

**What it is:** Two developer-experience commands that prove the repo works
on your machine. `ge devex check` (the *gate*) is the fast read-only pass:
local [doctor](#doctor) + docs link check + generated workspace manifest
contracts. `ge devex smoke` (the *smoke*) is the one-command proof: doctor →
local mode → build one validated [canary](#canary) workspace, then print its
paths and next commands.

**Where you'll meet it:** `mise run devex-check` / `mise run devex-smoke`;
`docs/start/getting-started.md` steps 1–2.

---

### Canary

**What it is:** A build of exactly **one** agent, used to prove the pipeline
works end to end before committing to the whole catalog. `--canary` on
`ge agents build` (or `CANARY=1` on the `mise run provision*` tasks) is the
opposite of `--all`. Nothing to do with feature-flag canary releases — it's
just "one [workspace](#workspace), all the way through."

**Where you'll meet it:** `mise run devex-smoke` builds one;
`CANARY=1 mise run provision-local`; the bootstrap task's optional canary
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

**Where you'll meet it:** `ge devex smoke` prints the primary workspace
path; "Workspace manifest" in `docs/developers.md`; `ge state paths` shows
where they land.

---

### Pipeline run (formerly "mission")

**What it is:** One orchestrated, resumable run of the pipeline for a use
case, executed as a DAG of [daemon](#daemon) child tasks — data readiness,
simulator checks, optionally the factory build itself, the
[Antigravity](#antigravity) review node, and convergence to a target stage.
Preview the DAG without running (`ge pipeline graph`), run it
(`ge pipeline run`), resume it after a failure (`ge pipeline resume`).
The old `ge mission …` spellings still work as deprecated aliases, and the
persisted daemon task kind stays `mission.run` (wire identifiers never
rename; `pipeline.run` is accepted and normalized at the boundary).

**Where you'll meet it:** `ge pipeline run|status|resume|graph|runs`;
scenario state under `.ge/missions/<scenario>`;
`skills/planning-missions/references/mission-contract.md` for the contract.

---

### Pipeline (formerly "journey")

**What it is:** The user-facing, end-to-end path from business intent to a
deployed agent — interview → spec → data → simulator → build → eval →
preview → deploy — rendered as a plan you can read (`ge pipeline plan`) and
watch (`ge pipeline status`). The stage view and the executable DAG behind
it (see [Pipeline run](#pipeline-run-formerly-mission)) are one noun now:
`ge pipeline status` shows where you are, `ge pipeline run` executes. The
old `ge journey …` spellings remain as deprecated aliases.

**Where you'll meet it:** `ge pipeline plan --usecase <id>`;
`tools/lib/journey-plan.mjs` in code (the module keeps its historical name).

---

### Repair run (formerly "autopilot")

**What it is:** The [daemon](#daemon)-native convergence loop for *many*
workspaces at once: given a set of ids (or the current queue), it observes
each workspace's blockers, runs repair up to `--attempts` times, and keeps
going until every item reaches the target stage (default `preview`). Think
"keep the [fleet](#fleet) converged" rather than "run one pipeline."
The old `ge autopilot …` spellings remain as deprecated aliases, and the
persisted daemon task kind stays `autopilot.run` (`repair.run` is accepted
and normalized at the boundary).

**Where you'll meet it:** `ge fleet repair|repairs`; the Repair Queue in the
console; `tools/ge/fleet.mjs` in code.

---

### The consolidated orchestration vocabulary

**What it is:** Four historical nouns (mission, journey, autopilot, factory
run) collapsed into two, plus a build. The old spellings all still work as
deprecated aliases, and *persisted identifiers* (daemon task kinds, ledger
tables) keep their historical names — only the operator surface renamed:

| Today | What it orchestrates | Formerly |
|---|---|---|
| **A build** (`ge agents build`) | One agent workspace through the stage pipeline (generate → validate → … → publish); recorded in the run [ledger](#ledger) | "factory run" |
| **[Pipeline](#pipeline-formerly-journey)** (`ge pipeline plan\|run\|status\|resume\|graph`) | The end-to-end path AND its executable DAG — one noun for the view and the engine | "journey" (the view) + "mission" (the DAG) |
| **[Repair run](#repair-run-formerly-autopilot)** (`ge fleet repair\|repairs`) | Convergence across many workspaces: observe blockers → repair → retry to a target stage | "autopilot" |
| **Runs** (`ge runs list\|show\|events\|resume`) | Observability over every daemon-backed run of any kind | `ge runtime tasks\|task\|events\|resume` |

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
just reports how well the generated code matches the spec
(`generator-feedback.json`); "Refine" goes further and tries to
automatically fix mismatches (`harness-refine.json`). Easy to conflate,
but only Refine changes code.

**Where you'll meet it:** The `harness_reviewed` and `harness_refined`
pipeline stages; `factory harness-review` vs. `factory harness-refine`.

