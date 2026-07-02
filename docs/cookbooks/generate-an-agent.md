---
title: Generate an agent
parent: Cookbooks
nav_order: 3
layout: default
---

# Generate an agent

## Goal

Build one agent end-to-end from a spec, on your machine, and know exactly what
lands on disk: the multi-agent [ADK](https://google.github.io/adk-docs/)
(Google's Agent Development Kit) app, fixtures, the OKF knowledge bundle, and
evals.

## Prerequisites

- Local toolchain installed (`mise run setup`) and `mise run doctor-local` green.
- A spec to build from (from the [interview](author-a-spec-via-interview.html) or
  the catalog).
- For local builds, `google-antigravity` must be importable in `.venv` (verified
  by `mise run deps` / `mise run doctor-local`).

## Steps

1. **Switch to local mode** (build on this machine, up to the build boundary).

   ```bash
   ge mode local
   ```

2. **Build a single agent end-to-end (canary).**

   ```bash
   ge agents build --canary
   ```

   - `--canary` builds **one** agent; `--all` builds the whole catalog.
   - `--local` forces this machine via the Antigravity harness (stops at the
     `previewed` build boundary); `--remote` submits to the cloud factory.
     Without an override it follows the active `ge mode`.
   - `--dept <name>` filters by department; `--ids <a,b,c>` builds specific
     agent/workspace ids.
   - `--limit <n>` caps local selection; `--concurrency <n>` sets remote submit
     concurrency (default 2).
   - `--model <id>`, `--location <loc>`, `--vertex` / `--no-vertex`,
     `--max-output-tokens <n>` tune the harness review/refine + generated agent.
   - `--target <stage>` sets the harness target (local; default `previewed`).
   - `--warm` pre-warms the shared uv cache before running (local).

   Equivalent `mise` shortcuts:

   ```bash
   CANARY=1 mise run provision-local   # ge agents build --local --canary
   CANARY=1 mise run provision         # ge agents build --canary  (active mode)
   ```

3. **Find the workspace.** Local builds report `Workspaces in <dir>`. The
   canonical location is:

   ```
   .ge/factory/workspaces/<workspace-id>/
   ```

   (Override the state root with `GE_STATE_ROOT`. The manifest is
   `.ge/factory/workspaces.json`.) Inspect paths with:

   ```bash
   ge state paths
   ```

## What's produced

Inside a generated workspace (the multi-agent ADK app):

- `app/agent.py` — the generated agent (real ADK; Sequential/Parallel topology
  derived from `behaviorContract.workflow`, not a mock).
- Fixtures / simulator data for the agent's source systems.
- An OKF knowledge bundle (`app/knowledge/...`) grounding the agent.
- Evals under `tests/eval/` — `evalsets/ge_behavior_contract.evalset.json`,
  `eval_config.json`, `optimization_config.json`. See
  [Run evals](run-evals.html).

## Verify

```bash
ge agents status            # shows the run and its stages
ge agents status --watch    # loops every 15s until runs are terminal
ge runs events <runId> --follow   # stream one run's events live
ls .ge/factory/workspaces   # the workspace directory exists
```

Then open the workspace and confirm `app/agent.py` and `tests/eval/` exist.

## Troubleshoot

- **Build pauses at data readiness** — the Snowfakery runtime isn't warm. Run
  `mise run data-runtime`.
- **Local build fails immediately** — `google.antigravity` not importable.
  Re-run `mise run deps`.
- **Want to skip the cloud refine stage (remote)** — pass `--no-refine`
  (sets `REFINE=0`).
- **Inspect a specific run's logs** — `ge agents logs <runId>`.
