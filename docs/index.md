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
  <img src="assets/diagrams/signature-pipeline.svg" alt="capture flows into the Enterprise Agent Contract; the contract generates code, tools, and source-system twins under authority-graph control; twins and generated code feed prove (evals, harness, promotion gate); prove produces a passport and proof pack; the passport hands off across the build boundary to agents-cli, ADK, and Gemini Enterprise" width="900">
</p>

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
ge devex smoke               # compile one contract into a validated agent workspace (~5 min)
```

The result on disk is the whole layer in miniature: a contract
(`usecase-spec.json` with its `behaviorContract`), generated ADK code and
tools, fixture data, smoke tests, an eval suite, and the validation artifacts
the promotion gate reads. Continue with the
[ten-minute tutorial](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/)
or the fuller [local setup guide](./start/getting-started.html).

<p align="center">
  <img src="assets/screenshots/overview.png" alt="Console Overview view showing the build-to-deploy pipeline rail (362 in Build, 1 in Ship), a Next step card recommending ge init, and Pipeline / Fleet summary cards with 0 deployed, 1 submitted, 1 failed" width="820">
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
noun (harness, OKF, canary, planes, pipeline) into plain language.
