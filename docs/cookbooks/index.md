---
title: Cookbooks
nav_order: 4
has_children: true
layout: default
---

# Cookbooks

Task-oriented, step-by-step recipes for operating the GE Agent Factory. Each
recipe is structured as **Goal → Prerequisites → Steps → Verify → Troubleshoot**
and uses only real commands from the repo (`Makefile`, `tools/ge.mjs`,
`scripts/*`, `installer/*`).

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

> All commands are verified against the repo. Where a path or flag differs from
> common assumptions, the recipe calls it out explicitly.
