---
title: GE Agent Factory vs agents-cli
nav_order: 5
layout: default
description: The two tools occupy different layers — agents-cli builds and deploys one ADK project; the factory compiles contracts and proof upstream of it.
---

# GE Agent Factory vs agents-cli

Short answer: **they are not alternatives.** `agents-cli` (with ADK under it)
is the build-and-deploy layer for one Google agent project. GE Agent Factory
is the contract layer above it — it decides *what* that project must contain,
generates it, proves it, and then drives `agents-cli` to ship it. Every
workspace the factory emits **is** an `agents-cli` project; you can `cd` into
one and use `agents-cli` directly.

## Layer by layer

<p align="center">
  <img src="../assets/diagrams/factory-vs-agents-cli-layers.svg" alt="GE Agent Factory turns enterprise intent into a contract, then simulation, evals, and proof; a thick handoff edge crosses into agents-cli / ADK, which scaffolds the agent project and deploys it to the Agent Runtime; a second thick edge crosses into Gemini Enterprise, which publishes the agent to end users" width="700">
</p>

| Layer | Owned by | Artifacts |
|---|---|---|
| Enterprise intent → contract | **GE Agent Factory** | use-case spec (`behaviorContract` + `generationSpec`), OKF bundle |
| Simulation, evals, proof | **GE Agent Factory** | source-system twins, fixtures, evalsets, spec-to-code trace, harness verdicts, promotion gate |
| Agent project scaffold & code | **ADK / agents-cli** (generated and driven by the factory) | `app/agent.py`, `app/tools.py`, `pyproject.toml`, `agents-cli-manifest.yaml` |
| Deploy & runtime | **agents-cli → Agent Engine** | deployed Agent Runtime, Agent Registry entry |
| End-user surface | **Gemini Enterprise** | the published agent your business users talk to |

## Feature comparison

| Question | agents-cli / ADK alone | With GE Agent Factory above it |
|---|---|---|
| Where does the agent's definition of "correct behavior" live? | In code and prompts you write | In a versioned contract (`behaviorContract`): role, scope, tool intents, evidence requirements, escalation and refusal rules |
| What do you test against before production data access exists? | Whatever you mock by hand | Generated source-system twins with realistic seeded data, per system |
| Where do evals come from? | You author evalsets yourself | Generated from the contract's golden evals and answerable queries, in `agents-cli`'s own eval format |
| What blocks a bad deploy? | Your judgment | The promotion gate: validation report, spec-to-code trace, and harness verdicts must pass |
| How do tools get defined? | Hand-written FunctionTools | Generated from the contract's `toolIntents`, with governance callbacks (write-guard, evidence capture) wired in |
| How many agents does the workflow scale to? | One project at a time | A catalog: bulk build, bulk repair, and status across every generated agent |
| What reaches your reviewers/auditors? | The code | The contract, the proof artifacts, and the code — one traceable chain |

## What stays exactly agents-cli's job

The factory deliberately does **not** reimplement the layer below:

- The generated project is standard ADK Python — no factory runtime library,
  no lock-in shim. Delete the factory tomorrow and the workspace still
  builds and deploys with `agents-cli`.
- Deployment to Agent Engine is performed *by* `agents-cli` (`agents-cli
  deploy`), invoked by the factory's release stages.
- The eval format is `agents-cli`'s eval format, so `agents-cli eval run
  --all` works unmodified inside any workspace.
- Publishing and the conversational surface belong to Gemini Enterprise.

## When you'd use which

- **Building one agent by hand, exploring ADK, or prototyping?** Use
  `agents-cli` directly — the factory adds process you don't need yet.
- **Turning a portfolio of enterprise workflows into governed, testable,
  auditable agents — before the production integrations even exist?** That
  is the factory's layer: capture the intent, compile the contract, prove
  against simulations, then hand off to the same `agents-cli` path you'd
  have used anyway.

## See the seam yourself

```bash
ge devex smoke                       # factory: compile + prove one canary workspace
cd .ge/factory/workspaces/<id>       # the output is an agents-cli project
agents-cli eval run --all            # the layer below, used directly
```

Next: [Core mental model](./mental-model.html) ·
[Handoff targets](../concepts/handoff-targets.html) ·
[Hand off to agents-cli](../cookbooks/handoff-agents-cli.html)
