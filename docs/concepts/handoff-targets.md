---
title: Handoff Targets
parent: Core Concepts
nav_order: 6
layout: default
description: agents-cli, ADK Agent Engine, and Gemini Enterprise — the layer below the factory, and exactly what crosses the handoff line.
---

# Handoff Targets

**Definition:** a handoff target is the downstream system that receives the
factory's output: **agents-cli** (the build/deploy CLI), **ADK Agent
Engine** (the runtime), and **Gemini Enterprise** (the end-user surface).
The factory compiles and proves; the targets build, run, and serve.

## Why the boundary exists

The factory refuses to reimplement the layer below it — that is a design
decision, not a limitation. Because the generated workspace is a *standard*
ADK project driven by *standard* `agents-cli` commands, there is no factory
runtime library in production, no lock-in shim between your agent and
Google's stack, and nothing to migrate off if you stop using the factory
tomorrow. The factory's entire value is upstream: the contract, the twins,
the evals, and the proof.

## What each target receives

| Target | What crosses the line | Where it's declared |
|---|---|---|
| **agents-cli** | a complete ADK Python project: `app/agent.py`, `app/tools.py`, `pyproject.toml`, tests, evalsets — plus `agents-cli-manifest.yaml` naming the deploy | the workspace itself |
| **ADK Agent Engine** (Agent Runtime) | the deployed agent, under its per-agent runtime identity | `deployment_target: agent_runtime` in the manifest; `deploy_runtime` stage |
| **Agent Registry** | the agent's registration and resolvable toolsets (modes `adk`, `mcp`, `a2a`) | `register_tools` stage |
| **Gemini Enterprise** | the published agent your business users talk to | `publish_enterprise` stage |

## Example — a generated workspace is an agents-cli project

The proof that the boundary is honest is that you can ignore the factory and
drive a workspace with the target's own tools:

```bash
cd .ge/factory/workspaces/<id>
agents-cli eval run --all          # the factory-generated evalset, in agents-cli's format
# agents-cli deploy                # the same command the factory's release stages run
```

The agent code is plain ADK — an `Agent`/`App` with real `FunctionTool`s and
callbacks, tools named `<verb>_<source_system_id>_<business_object>` so every
tool traces to a contract intent. The full anatomy is in
[Generated artifacts](../reference/agent-generation.html).

## The handoff itself

`ge agents ship` is the handoff command: it takes workspaces that were built
and proven locally and runs only the post-boundary stages in your Google
Cloud project —

```
load_data → deploy_runtime → poll_runtime → register_tools → publish_enterprise → verify_live
```

— loading per-agent data stores, deploying to Agent Engine (via
`agents-cli deploy` under the hood), registering tools, publishing to
Gemini Enterprise, and verifying live access. The cloud consumes the
prebuilt workspace; it never regenerates. In remote mode, `ge agents build`
runs the same stages end to end in the cloud instead.

One switch makes the same code work on both sides of the line: the generated
tools read `GE_DATA_BACKEND` and present identical tool names and result
envelopes whether backed by local fixtures or the cloud MCP tool plane — so
the agent that was proven is the agent that ships.

## What stays out of the factory's scope

- **Runtime orchestration** — Agent Engine's job.
- **The conversational UX** — Gemini Enterprise's job.
- **ADK itself** — the factory generates against it, tracks it, and pins
  `agents-cli` versions; it does not fork or wrap it.

## Where it appears

- **CLI:** `ge agents ship` (all locally-built workspaces, or `--ids <a,b>`); `ge agents status --watch` for
  the release milestones (`deployed`, `registered`, `published`); `ge mode
  remote` + `ge agents build` for cloud-side end-to-end runs.
- **Console:** release stages in the Agent detail view and **Runs**; fleet
  rollout state in **Fleet**.
- **Generated artifacts:** `agents-cli-manifest.yaml`, deployment metadata
  from `deploy_runtime`, the Agent Registry entry, the Gemini Enterprise
  registration, and a live-verification report from `verify_live`.

## Related concepts

- [Agent Passport & Proof Pack](./agent-passport-and-proof-pack.html) — what
  identifies and justifies the agent after this handoff.
- [The Authority Graph](./authority-graph.html) — the identity model the
  deployed agent runs under.
- [GE Agent Factory vs agents-cli](../start/vs-agents-cli.html) — the layer
  comparison in full.
