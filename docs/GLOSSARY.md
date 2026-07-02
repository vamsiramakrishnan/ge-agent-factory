# Glossary

Plain-language translations of the internal jargon you'll run into while
reading the `ge-agent-factory` codebase and docs. Each entry gives the term
as you'll actually see it, what it IS in one sentence, and where you're
likely to first bump into it.

If a term you needed isn't here, it's probably still worth a doc PR — this
list is deliberately focused, not exhaustive.

---

### Harness

**What it is:** The local, LLM-driven "does this generated agent actually
match the spec?" review-and-fix step that runs on your machine (or the
worker) after code generation and before anything ships to the cloud. It's
powered by the **Antigravity SDK** (`apps/factory/scripts/antigravity-sdk-agent.py`),
which reviews the generated ADK code against the spec (writing
`artifacts/generator-feedback.json`), then tries to auto-fix mismatches
(writing `artifacts/harness-refine.json` with a `spec_to_code_fidelity`
verdict). "Harness" also loosely refers to the whole local operator
surface — the CLI loop, the daemon, and the pipeline stages named
`harness_reviewed` and `harness_refined`.

**Where you'll meet it:** The stage pipeline diagram in
`docs/concepts/the-factory-line.md`; `apps/factory/docs/harness-data-model.md`;
in the console, the Activity feed shows a line like "Antigravity review:
&lt;provider&gt; · score &lt;n&gt;" for any run that went through this step.

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

**Where you'll meet it:** `docs/concepts/specs-and-okf.md` for the concept;
in the console, the spec editor's "Export OKF" button and the "OKF
Knowledge Bundle" preview modal (`apps/console/src/components/interview/SpecCanvas.tsx`).

---

### Behavior Contract

**What it is:** The half of a use-case spec that defines what the agent is
*allowed and expected to do* — its role, its primary objective, what's in
and out of scope, the tools it may call, the evidence it must gather before
acting, and hard guardrails (escalation/refusal rules). It's the field
literally named `behaviorContract` in `usecase-spec.json`. The other half,
`generationSpec`, describes the *world* the agent operates in (source
systems, entities) — behavior vs. world are the "two halves of a spec."

**Where you'll meet it:** `docs/concepts/specs-and-okf.md` ("The two halves
of a spec"); `docs/reference/spec-schema.md` for the full field list; the
console's spec editor renders this as the agent's role/scope/rules section.

---

### Promotion Gate

**What it is:** An automated pass/fail check that runs right before deploy
and refuses to ship a workspace whose validation report, spec-to-code
trace, or harness verdicts (review/refine) haven't cleared their bar. If it
fails, you get a list of specific blockers instead of a deploy — you can
override with `--force` or `GE_ALLOW_UNPROMOTED=1`, but the gate exists so a
broken or unreviewed agent can't reach the cloud by accident.

**Where you'll meet it:** Run `factory promotion-gate` (implemented in
`apps/factory/src/promotion-packet.js`); it's also section `## Promotion
Gate` inside the generated promotion packet artifact, and the quickstart doc
(`apps/docs/src/content/docs/start/quickstart.md`) mentions it as the check
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
`docs/concepts/the-factory-line.md`; the `buildBoundary` field on mission
plans (`tools/lib/factory-autopilot-mission.mjs`).

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

**Where you'll meet it:** `docs/concepts/simulators-and-byo.md` for
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
workspaces and its evalset format.

**Where you'll meet it:** `docs/concepts/agents-and-adk.md` ("the
ADK/`agents-cli` command surface"); `mise run doctor-local` checks whether it's
installed; `apps/factory/src/agents-cli-scaffold.js` is where the factory
locates and invokes it.

---

### A few more terms that trip people up

- **Canary** — a build of exactly **one** agent, used to prove the pipeline
  works end to end before committing to the whole catalog. `--canary` on
  `ge agents build` (or `CANARY=1` on the `mise run provision*` tasks) is the
  opposite of `--all`. Nothing to do with feature-flag canary releases — it's
  just "one workspace, all the way through."
- **Interview** — the guided, conversational flow where a business user (or
  agent) describes a use case and the factory turns it into a formal spec.
  See `apps/console/src/views/Interview.tsx`.
- **Mission** — one orchestrated, resumable run of the factory pipeline for
  a use case (plan → generate → harness → validate → deploy). See
  `skills/planning-missions/references/mission-contract.md`.
- **Spec-to-Code Trace** — the automated check that verifies the code the
  factory generated actually matches what the spec asked for; one of the
  inputs the Promotion Gate reads. See `apps/factory/src/spec-code-trace.js`.
- **Workspace** — the on-disk folder for one generated agent
  (`.ge/factory/projects/<workspace>/`), with a `workspace.json` manifest
  describing what's in it. This is the unit that flows down the factory
  line from stage to stage.
- **Review vs. Refine** — two distinct sub-steps of the harness. "Review"
  just reports how well the generated code matches the spec
  (`generator-feedback.json`); "Refine" goes further and tries to
  automatically fix mismatches (`harness-refine.json`). Easy to conflate,
  but only Refine changes code.
