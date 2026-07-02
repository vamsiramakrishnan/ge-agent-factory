---
title: Cookbooks
nav_order: 5
has_children: true
layout: default
---

# Cookbooks

Task-oriented, step-by-step recipes for operating the GE Agent Factory. Each
recipe is structured as **Goal → Prerequisites → Steps → Verify → Troubleshoot**
and uses only real commands from the repo (`mise.toml`, `tools/ge.mjs`,
`scripts/*`, `installer/*`).

Use Cookbooks when you want a known-good path through the system. Each recipe
answers four questions before it gets clever: what are we trying to achieve,
what has to exist first, which commands do we run, and how do we know it worked?

| # | Recipe | What you get |
|---|--------|--------------|
| 1 | [Getting started locally](getting-started.html) | Install the toolchain, open the console, understand local vs remote mode |
| 2 | [Author a spec via the interview](author-a-spec-via-interview.html) | Turn a BRD + chat into a spec, export it as OKF |
| 3 | [Generate an agent](generate-an-agent.html) | Build one agent end-to-end (`ge agents build --canary`) |
| 4 | [Bring your own simulator](bring-your-own-simulator.html) | Synthesize a simulated system from NL / OpenAPI / samples and promote it |
| 5 | [Spec ⇄ OKF](spec-to-okf.html) | Convert a spec to an OKF knowledge bundle and back (round-trip) |
| 6 | [Run the factory](run-the-factory.html) | Run a build local vs remote, watch it live, resume a blocked run |
| 7 | [Provision the platform](provision-the-platform.html) | Stand up the cloud planes (`ge up`, `ge data up`, `ge mcp deploy`) |
| 8 | [Deploy the Agent Gateway](deploy-the-agent-gateway.html) | Provision the managed gateway + authz extension/policy |
| 9 | [Run evals](run-evals.html) | Run the per-agent behavior-contract eval set |
| 10 | [Add a ge command](add-a-ge-command.html) | Wire a `ge` command into the shared registry so the console gets a route, preflight, and job streaming |

> Where a path or flag differs from common assumptions, the recipe calls it out
> explicitly.
{: .note }

## Recommended paths

<p align="center">
  <img src="../assets/diagrams/cookbook-paths.svg" alt="Four entry situations — fresh clone, business use case, new source system, first cloud release — each mapped to its recipe sequence; the two cloud recipes (provision, gateway) are highlighted" width="750">
</p>

| Situation | Path |
|---|---|
| Fresh clone, no cloud | [Getting started locally](getting-started.html) → [Generate an agent](generate-an-agent.html) → [Run evals](run-evals.html) |
| Business use case, no spec yet | [Author a spec via the interview](author-a-spec-via-interview.html) → [Spec ⇄ OKF](spec-to-okf.html) → [Generate an agent](generate-an-agent.html) |
| New source system | [Bring your own simulator](bring-your-own-simulator.html) → [Run the factory](run-the-factory.html) |
| First cloud release | [Provision the platform](provision-the-platform.html) → [Deploy the Agent Gateway](deploy-the-agent-gateway.html) → [Run the factory](run-the-factory.html) |

## Recipe contract

Every cookbook should keep the same shape so developers can skim under pressure:

1. **Scope** (the line under the title) says up front whether the recipe is
   local-only or touches your Google Cloud project.
2. **Goal** says the outcome in one sentence.
3. **Prerequisites** says what must already be true.
4. **Steps** contains commands in execution order.
5. **Verify** proves the system state changed correctly.
6. **Troubleshoot** lists real failure modes, not generic advice.
