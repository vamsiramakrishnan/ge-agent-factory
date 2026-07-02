---
title: Home
layout: home
nav_order: 1
---

# GE Agent Factory

**Purpose:** GE Agent Factory exists because enterprise agents should not jump
from a slide, a prompt, or a one-off notebook straight into production. A useful
agent needs a business contract, source-system grounding, generated tools,
repeatable tests, evals, deployment automation, and runtime identity. This
factory makes those pieces one traceable path.

In one sentence: **it turns an enterprise use case into a generated, tested,
deployable Gemini Enterprise agent.** You start from a use case or an interview;
the factory writes the spec, generates real ADK code, builds fixtures and
simulators, runs smoke tests and evals, and promotes the same checked workspace
into your own Google Cloud project.

It is an agent **factory**, not a prompt-only demo generator.

<p align="center">
  <img src="assets/diagrams/system-map.svg" alt="A use case enters the factory's three planes (factory, data, tool) and the result reaches Gemini Enterprise as a deployed agent" width="900">
</p>

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/vamsiramakrishnan/ge-agent-factory&cloudshell_workspace=installer&cloudshell_tutorial=installer/TUTORIAL.md)

![Architecture](architecture.svg)

## Why this system needs to exist

Most enterprise agent programs break at the handoff between intent and
operation: the business use case lives in one place, data access in another,
tool contracts in another, evals in another, and deployment rules somewhere
else. That split makes agents hard to trust, hard to reproduce, and hard to
ship safely.

GE Agent Factory exists to make the handoff explicit:

| Problem | Factory answer |
|---|---|
| Use cases are ambiguous | Normalize the business request into a versioned spec and [OKF](./GLOSSARY.html#okf--knowledge-bundle) (Open Knowledge Format — the spec's portable Markdown form) bundle |
| Agents are demos, not systems | Generate ADK code, tools, fixtures, evals, and deployment artifacts |
| Data access is hand-wired | Use simulator packs locally and governed MCP/data [planes](./GLOSSARY.html#planes) (the platform's infrastructure layers) in cloud |
| Quality is manual | Gate every workspace with tests, evals, and [harness](./GLOSSARY.html#harness) (LLM spec-fidelity check) review/refine |
| Releases are not repeatable | Run a stage graph with a durable [ledger](./GLOSSARY.html#ledger) (the event record every status view reads) and resumable cloud control plane |
| Enterprise data needs boundaries | Deploy into your own single-tenant Google Cloud project |

## The factory path

<p align="center">
  <img src="assets/diagrams/concept-pipeline.svg" alt="use case to spec (OKF, the contract) to generate to validate and refine to simulate to deploy to publish" width="800">
</p>

1. **Interview or choose a use case.** Start from business intent, not an
   implementation guess.
2. **Materialize the spec.** The spec is the contract: systems, entities, tools,
   workflow, test mechanisms, and runtime expectations.
3. **Generate the workspace.** The factory emits ADK code, tools, fixture data,
   simulator bindings, smoke tests, eval config, and an OKF grounding bundle.
4. **Validate locally.** Local mode runs generation, validation, and preview up
   to the build boundary without cloud deployment.
5. **Ship remotely.** Remote mode loads per-agent data, deploys Agent Runtime,
   registers MCP tools, publishes to Gemini Enterprise, and verifies live access.

## Quickstart

Local development — no cloud credentials required:

```bash
mise run setup          # install deps, sync catalog/skills, install the `ge` command, start the daemon
mise run doctor-local   # check local tools: Bun, uv, Python, agents-cli, cache, harness wiring
mise run devex-check    # fast gate: local doctor, docs links, workspace manifest contracts
mise run devex-smoke    # prove the path: doctor → local mode → one validated canary workspace
mise run console        # open the operator UI (Pipeline · Fleet · Activity · Doctor) → http://localhost:18260
```

Build one agent locally, up to the preview/build boundary:

```bash
mise run mode-local
CANARY=1 mise run provision-local
```

Deploy to your own GCP project:

- Click **Open in Cloud Shell** above to clone the repo and run the installer
  ([`installer/TUTORIAL.md`](https://github.com/vamsiramakrishnan/ge-agent-factory/blob/main/installer/TUTORIAL.md)).
- Or, from a checkout with `gcloud` authed:

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  CANARY=1 mise run bootstrap   # stand up the planes and prove one agent end to end
  ```

Run `mise run help` for every target, or `mise run next` for a status-based recommendation.

## Documentation map

| Need | Start here |
|---|---|
| Understand the purpose, repo shape, and developer loop | **[Developer Guide](./developers.html)** |
| Learn the mental model before running commands | **[Concepts](./concepts/)** |
| Look up exact commands, schemas, APIs, and architecture | **[Reference](./reference/)** |
| Complete a task step by step | **[Cookbooks](./cookbooks/)** |
| Deploy, operate, troubleshoot, and recover the factory | **[Operations](./OPERATIONS.html)** |
| Expose the factory or generated agents through MCP | **[MCP](./MCP.html)** |
| Add or edit a docs page or diagram | **[Docs design system](./DESIGN.html)** |

Unfamiliar term? See the [Glossary](./GLOSSARY.html) — plain-language
translations of the jargon (harness, OKF, canary, planes, missions, …).

## Read this first if you are new

- If you are a **developer**, read the [Developer Guide](./developers.html), run
  `mise run setup`, then open `mise run console`.
- If you are an **operator**, read [Operations](./OPERATIONS.html), set
  `GEMINI_ENTERPRISE_APP_ID`, then run `CANARY=1 mise run bootstrap`.
- If you are a **platform reviewer**, read [Architecture](./reference/architecture.html),
  [Security and the Agent Gateway](./concepts/security-and-the-agent-gateway.html),
  and [MCP](./MCP.html).
- If you are an **agent author**, read [Specs and OKF](./concepts/specs-and-okf.html),
  [Author a spec via the interview](./cookbooks/author-a-spec-via-interview.html),
  and [Generate an agent](./cookbooks/generate-an-agent.html).
