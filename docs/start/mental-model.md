---
title: Core mental model
nav_order: 4
layout: default
description: The five verbs of the contract layer — capture, compile, generate, prove, hand off — and how they map onto the commands and stages that exist today.
---

# Core mental model

One sentence to keep: **the factory turns enterprise intent into a contract,
turns the contract into artifacts, proves the artifacts, and hands them off.**
Everything in this repo — every command, console view, and generated file —
serves one of those five verbs.

## The five verbs

| Verb | What it means | Where it happens today |
|---|---|---|
| **Capture** | Turn business intent (an interview, a document, an API surface) into structured input | `ge capture` (opens the console **Interview**; `--from` registers an existing contract file); document upload; simulator synthesis from OpenAPI |
| **Compile** | Materialize an **Enterprise Agent Contract**: the machine-readable statement of role, scope, tools, evidence rules, escalation and refusal rules, plus the world the agent operates in | The use-case spec (`generationSpec` + `behaviorContract`) and its [portable OKF (Open Knowledge Format) twin](../concepts/enterprise-agent-contract.html#the-contracts-portable-form-okf) |
| **Generate** | Emit everything the contract implies: ADK (Agent Development Kit) agent code, tools, fixture data, source-system simulations, smoke tests, eval suites | `ge prove` / `ge agents build` (one workspace per contract) |
| **Prove** | Show — not claim — that the generated agent honors the contract | `ge prove`: evals, the spec-to-code trace, verify-stage review/refine verdicts, the promotion gate |
| **Hand off** | Give the proven agent to the layer below: agents-cli → ADK Agent Engine → Gemini Enterprise, in your own Google Cloud project | `ge handoff agents-cli` |

> `capture`, `prove`, and `handoff` are first-class commands as well as
> concepts: `ge capture` → `ge prove` → `ge handoff agents-cli` is the
> golden path, and bare `ge` reports where you are on it. What remains on
> the [Roadmap section of the
> README](https://github.com/vamsiramakrishnan/ge-agent-factory#roadmap-the-golden-path):
> capture that lives entirely in the terminal, and more handoff targets.
{: .note }

## The contract is the center of gravity

Every artifact is derived from the contract, and every check points back at
it:

- The **tools** an agent gets exist because the contract's `toolIntents`
  declared them.
- The **simulations** it is tested against exist because the contract's
  source systems declared them.
- The **evals** that judge it are generated from the contract's
  `goldenEvals` and answerable queries.
- The **proof** that gates release is a comparison between the contract and
  what was actually generated.

One built workspace shows the whole derivation on disk:

<p align="center">
  <img src="../assets/diagrams/workspace-anatomy.svg" alt="One workspace directory drawn as a box containing four inner boxes: the contract (usecase-spec.json and its portable OKF twin), the generated agent (app/agent.py and app/tools.py), the simulation (source-system twins and synthetic-data fixtures), and the proof (eval suite, spec-to-code trace, and the workspace.json manifest); arrows show the contract generating the agent and the twins, and the agent plus fixtures feeding the eval suite" width="760">
</p>

This is what makes the output trustworthy: there is no hand-wired step where
an engineer's interpretation silently replaces the business's stated intent.
Read [the Enterprise Agent Contract](../concepts/enterprise-agent-contract.html)
for the artifact itself.

## The build boundary: everything before handoff is pure computation

The factory line has a hard cut in the middle — the **build boundary**:

<p align="center">
  <img src="../assets/diagrams/factory-line.svg" alt="The factory line: Author and Build, Validate and Refine, Release, with the build boundary between them" width="700">
</p>

- **Before the boundary** (compile → generate → prove): everything runs on
  your machine against simulated source systems. No cloud credentials, no
  side effects. This is the everyday loop, and it is cheap to repeat.
- **After the boundary** (hand off): stages touch your Google Cloud project —
  per-agent data is loaded, the Agent Runtime is deployed, tools are
  registered, and the agent is published to Gemini Enterprise.

Building on this machine is the default (billable cloud work is opt-in),
and `ge handoff` is the bridge: it takes a workspace that was built and
proven locally and runs only the post-boundary stages in the cloud. The
same workspace crosses the boundary unchanged — simulated backends
give way to governed cloud services.

<details>
<summary>Under the hood</summary>

The two sides are selected by **mode** (`ge mode local` / `ge mode remote`,
persisted in `.ge.json`); `ge handoff agents-cli` tars and uploads each
proven workspace, then runs only the post-boundary release stages in the
cloud.

</details>

## What a run looks like

A build is a sequence of stages, each of which writes inspectable artifacts
before handing the workspace to the next. In progress reporting you'll see
the stages as past-tense milestones:

```
planned → created → validated → harness_reviewed → harness_refined
        → data_packaged → previewed   ← the build boundary
        → deploy_planned → deploying → deployed
        → registered → publish_planned → published
```

Three things are worth knowing up front, and each has a plain-language
glossary entry: runs are recorded durably (the *ledger*), long-running work
is supervised by a local background runtime, and the LLM (large language
model) review-and-fix step between generation and validation is the
build-and-verify engine. That's enough to operate the factory for a long
time.

<details>
<summary>Operator names for those three</summary>

The local background runtime is the *daemon*; the build-and-verify engine
is the *harness* — both defined in the [Glossary](../GLOSSARY.html),
alongside the *ledger*.

</details>

The full machinery — stage graph source of truth, the stations-vs-milestones
vocabulary, the durable control layer — is in
[Architecture](../reference/architecture.html).

## Two surfaces: beginner and operator

The same engine has a shallow end and a deep end — you can be productive in
the shallow end for weeks:

| | Beginner surface | Operator surface |
|---|---|---|
| **Entry point** | the three golden verbs (`ge capture` / `ge prove` / `ge handoff`) and `mise run <task>` (`setup`, `console`, `next`) — guided, status-driven | the full `ge` command tree, plus the lower-level `factory` generator CLI |
| **Feedback** | the console: live runs, readiness verdicts, runnable fixes | `--json` on every command, streamed events (`ge runs events --follow`), the durable run record |
| **Scale** | one starter agent at a time | the whole catalog: bulk build, bulk repair, convergence across all agents |
| **Typical day** | capture in the Interview, prove a first agent, watch it in Runs | script the stages in CI, drive repairs, ship in batches, wire MCP callers |

Three facts make the deep end safe to grow into: bare `ge` always prints the
next step; every mutating command declares a risk level; and one registry
backs all three surfaces — CLI, [console](../console/), and
[MCP tools](../MCP.html) — so they cannot disagree.

## Next

- [Ten-minute tutorial](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/) — run the whole path once.
- [The Enterprise Agent Contract](../concepts/enterprise-agent-contract.html) — the artifact everything derives from.
- [Evals as proof](../concepts/evals-as-proof.html) — how "it works" becomes evidence.
