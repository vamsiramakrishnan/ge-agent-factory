---
title: Concepts
nav_order: 3
has_children: true
layout: default
---

# Concepts

These pages explain the *mental model* of the GE Agent Factory — the **why** and
the **how it fits together**, not the exact commands. For commands, flags, and
file layouts, follow the links into the [Reference](../reference/) section and the
[Cookbooks](../cookbooks/).

Read Concepts when you need to understand why the factory has a spec, why local
and remote mode are separate, why simulators exist, and why deployment is modeled
as a staged control plane instead of a single script.

## The big idea

The factory turns an enterprise **use case** into a **real, tested, deployable
[ADK](https://google.github.io/adk-docs/) agent** — code, tools, fixtures, tests,
and evals — grounded by **simulated source systems**. The same workspace runs
locally against fixtures (no cloud needed) and, when you are ready, is promoted to
*your own* Google Cloud project: per-agent data stores, an MCP tool plane, Agent
Runtime, Agent Registry, and a Gemini Enterprise publish.

One idea ties it all together: **the spec is the contract.** A use case becomes a
normalized spec (portable as an [Open Knowledge Format](https://openknowledge.foundation/)
bundle). Generation, validation, simulation, evals, and runtime grounding all read
from that one contract — so the agent the factory builds *is* the agent the spec
described, and you can trace any line of generated code back to a spec intent.

```
 use case ──▶ spec (OKF) ──▶ generate ──▶ validate/refine ──▶ simulate ──▶ eval ──▶ deploy ──▶ publish
              │                  │              │                  │                    │
          the contract       real ADK     pytest +           simulated            your GCP
          everything         (not a       agents-cli eval    source systems       project
          reads from         mock)        + Antigravity      (fixtures / MCP)     (single-tenant)
```

## Read these in order

1. **[The factory line](./the-factory-line.html)** — the assembly line and the
   durable control plane that runs it.
2. **[Specs and OKF](./specs-and-okf.html)** — the spec as the knowledge contract,
   and OKF as its portable, human- and agent-authorable form.
3. **[Agents and ADK](./agents-and-adk.html)** — what a generated agent actually
   *is*, and how governance is wired into it.
4. **[Simulators and BYO](./simulators-and-byo.html)** — the simulated
   source-system plane and how you bring your own.
5. **[Security and the Agent Gateway](./security-and-the-agent-gateway.html)** —
   the runtime identity model and the governed front door.

> It is an agent **factory**, not a prompt-only demo generator: the output is a
> versioned workspace of running code, gated by tests, deployed under
> least-privilege identities in single-tenant infrastructure.

## Concept to source map

| Concept | Source anchor | Why it matters |
|---|---|---|
| Factory line | `tools/lib/factory-core.mjs` | Shared engine behind CLI, console, and MCP |
| Durable ledger | `tools/lib/run-ledger.mjs` | Single source of truth for local and remote runs |
| Generated agent | `apps/ge-demo-generator/src/agent-workspace-pipeline.js` | Turns specs into ADK workspaces |
| Simulator systems | `apps/ge-demo-generator/simulator-systems/` | Makes source systems testable before real integration |
| Tool plane | `apps/ge-demo-generator/mcp-service/` | Runtime facade that generated agents call through MCP |
| Cloud platform | `installer/terraform/` | Owns infra, IAM, data stores, MCP, and runtime services |

## How to use this section

- Start with **The factory line** if the stage names feel abstract.
- Read **Specs and OKF** before changing generation behavior.
- Read **Agents and ADK** before editing generated `app/agent.py` or `app/tools.py`.
- Read **Simulators and BYO** before adding a source-system pack.
- Read **Security and the Agent Gateway** before changing runtime identity,
  ingress, IAP, or MCP invocation.
