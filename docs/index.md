---
title: Home
layout: home
nav_order: 1
description: GE Agent Factory compiles enterprise workflows into governed agent contracts, simulations, eval suites, and proof packs — the layer above agents-cli, ADK, and Gemini Enterprise.
---

# What is GE Agent Factory?

GE Agent Factory compiles enterprise workflows into governed agent
**contracts**, source-system **simulations**, **eval** suites, tool plans, and
**proof** packs. It does not replace agents-cli, ADK, or Gemini Enterprise; it
produces the upstream contract and proof artifacts they need.

It occupies exactly one layer:

> capture enterprise intent → compile an Enterprise Agent Contract → generate
> simulations, evals, tools, and proof → hand off to agents-cli / ADK /
> Gemini Enterprise.

Everything below the handoff line — scaffolding the ADK project, deploying to
Agent Engine, publishing into Gemini Enterprise — is done *by* those tools.
The factory's job is to make sure that what reaches them is a contract you
can read, a simulation you can test against, and proof you can show an
auditor.

<p align="center">
  <img src="assets/diagrams/signature-pipeline.svg" alt="capture flows into the Enterprise Agent Contract; the contract generates code, tools, and source-system twins under authority-graph control; twins and generated code feed prove (evals, verify-stage review, promotion gate); prove produces a passport and proof pack; the passport hands off across the build boundary to agents-cli, ADK, and Gemini Enterprise" width="900">
</p>

## Start with skills — works with your coding agent

<p align="center">
  <img src="assets/icons/claude-code.svg" alt="Claude Code" height="44">&nbsp;
  <img src="assets/icons/antigravity.svg" alt="Antigravity" height="44">&nbsp;
  <img src="assets/icons/codex.svg" alt="Codex" height="44">&nbsp;
  <img src="assets/icons/gemini-cli.svg" alt="Gemini CLI" height="44">&nbsp;
  <img src="assets/icons/mcp.svg" alt="MCP" height="44">
</p>

The recommended setup path is skills-first. The factory ships as agent skills
— including the install itself — so a coding agent can set up a bare machine,
verify each phase, and then run the whole line using the same playbooks the
harness uses:

```bash
bunx create-ge-agent-factory        # any machine: clone + guided, verified install
```

| Agent | Install |
| --- | --- |
| **Claude Code** | `/plugin marketplace add vamsiramakrishnan/ge-agent-factory` then `/plugin install factory-bootstrap@ge-agent-factory` |
| **Gemini CLI** | `gemini extensions install https://github.com/vamsiramakrishnan/ge-agent-factory` |
| **Antigravity · Codex · agents-cli-style sessions** | `bunx create-ge-agent-factory --skills agents` |
| **Any MCP client** | `bun tools/mcp-server.mjs` from a checkout |

The output still hands off to [Google agents-cli](https://google.github.io/agents-cli/) / ADK / Gemini Enterprise; skills are the assistant-facing setup and operations layer above that handoff.


## The operating surface: contract, OKF, drive, proof

The docs now follow the same path the console exposes: start with the contract,
keep the OKF knowledge bundle beside it, drive the factory run, and inspect the
proof before handoff. That keeps the landing page, diagrams, console views, and
CLI language aligned instead of describing four different products.

<p align="center">
  <img src="assets/diagrams/console-okf-drive-views.svg" alt="Operator intent enters the Interview view, flows through Spec Review and the OKF view into the GE Drive view, records stages in the run ledger, opens workspace proof views, and reaches the promotion gate before handoff to agents-cli, ADK, and Gemini Enterprise" width="900">
</p>

| Surface | What you check | Why it matters |
|---|---|---|
| **Interview + Spec Review** | Role, scope, tools, refusal rules, success criteria | The business request becomes an auditable Enterprise Agent Contract |
| **OKF view** | Knowledge bundle, concepts, source files, export readiness | The contract has grounded context that can travel with the generated agent |
| **GE Drive view** | `ge prove`, `ge agents build`, stage logs, blockers | Operators can drive the same factory engine from the browser or terminal |
| **Workspace + proof views** | Files, ADK preview, eval results, proof pack | Reviewers see the generated output and evidence before promotion |

## The problem it solves

Enterprise agent programs rarely fail at the model. They fail at the seams:
the business intent lives in a slide deck, the data access rules live in an
IAM console, the tool definitions live in a notebook, and the evidence that
any of it works lives nowhere. Each seam is a place where an agent silently
drifts from what the business asked for.

The factory closes those seams with one artifact chain:

| Without the factory | With the factory |
|---|---|
| Intent is a slide or a prompt | Intent is captured into a versioned **contract** — role, scope, tools, evidence rules, escalation and refusal rules |
| Agents are demoed against production or nothing | Agents are exercised against **source-system twins** — simulated backends with realistic data |
| "It works" is a vibe | **Evals are the proof**: generated eval suites, a spec-to-code trace, and a promotion gate that blocks unproven agents |
| Tool access is hand-wired | Tools are generated from the contract and governed at runtime |
| Deployment is a bespoke script | **Handoff** is a defined step: the output is a real agents-cli / ADK project, shipped to Agent Engine and published to Gemini Enterprise in your own Google Cloud project |

## What the factory is not

- **Not an agent framework.** The generated agent is standard Google ADK
  Python; the factory writes it, it doesn't run it.
- **Not a deploy tool.** Deployment is `agents-cli`'s job; the factory
  prepares the project and drives the handoff.
- **Not a chat product.** The output is code, data, evals, and proof — the
  conversational surface belongs to Gemini Enterprise.

If you're deciding where this fits next to what you already run, read
[GE Agent Factory vs agents-cli](./start/vs-agents-cli.html).

## See it work

All local, no cloud credentials — about ten minutes end to end:

```bash
curl https://mise.run | sh   # once, if you don't have mise
mise run setup               # toolchain + the ge CLI (~5-10 min, one time)
ge init                      # discover config, write .ge.json (~30 s)
ge prove                     # compile one contract into a validated agent workspace (~5 min)
```

<details>
<summary>Under the hood</summary>

On a fresh machine, `ge prove` runs the local doctor, then builds one
canary workspace to the `validated` stage. Once workspaces exist,
`ge prove` rebuilds their proof via `ge agents build`; `ge prove --watch`
re-proves on contract change.

</details>

The result on disk is the whole layer in miniature: a contract
(`usecase-spec.json` with its `behaviorContract`), generated ADK code and
tools, fixture data, smoke tests, an eval suite, and the validation artifacts
the promotion gate reads. Continue with the
[ten-minute tutorial](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/)
or the fuller [local setup guide](./start/getting-started.html).

<p align="center">
  <img src="assets/screenshots/overview.png" alt="Console Overview view showing the build-to-deploy stage rail (362 in Build, 1 in Ship), a Next step card recommending ge init, and summary cards with 0 deployed, 1 submitted, 1 failed" width="820">
</p>

The console (`mise run console` → `http://localhost:18260`) shows the same
state live — a real capture from the screenshot factory below, not a mock.
See [Console](./console/).

## Where to go

| You want to | Start at |
|---|---|
| Understand the layer and its artifacts | [Core mental model](./start/mental-model.html), then [Core Concepts](./concepts/) |
| Compare against agents-cli / ADK / Gemini Enterprise | [GE Agent Factory vs agents-cli](./start/vs-agents-cli.html) |
| Do a task end to end | [Guides](./cookbooks/) |
| Drive it from a browser instead of a terminal | [Console](./console/) |
| Stand up, operate, and troubleshoot the platform | [Operations](./OPERATIONS.html) |
| Look up a command, schema, or API | [Reference](./reference/) |
| Work on the factory itself | [Contributor docs](./developers.html) |

Unfamiliar term? The [Glossary](./GLOSSARY.html) translates every internal
noun into plain language — the operator vocabulary included.
