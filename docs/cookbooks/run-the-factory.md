---
title: Run the factory
parent: Cookbooks
nav_order: 6
layout: default
---

# Run the factory

## Goal

Run an agent build through the pipeline — local on your machine or remote in the
cloud factory — watch it live in the console (Run Drawer / Activity), and resume a
run that has blocked.

## Prerequisites

- Local toolchain installed (`mise run setup`); the daemon running
  (`ge daemon status`).
- Console running for the live views: `mise run console` → http://localhost:18260.
- For remote runs, the cloud planes provisioned. See
  [Provision the platform](provision-the-platform.html).

## Steps

1. **Pick a mode.**

   ```bash
   ge mode local     # build on this machine, up to the 'previewed' build boundary
   # or
   ge mode remote    # submit to the cloud factory (builds, deploys, publishes)
   ```

2. **Kick off a build.**

   ```bash
   ge agents build --canary       # one agent, active mode
   ge agents build --all          # whole catalog
   ge agents build --local --canary    # force local
   ge agents build --remote --all      # force remote
   ```

   (`mise run` equivalents: `CANARY=1 mise run provision`, `CANARY=1 mise run provision-local`.)

3. **Watch it live in the console.** Open the console; the Run Drawer follows any
   run (including remote runs via the run ledger SSE stream), and the Activity
   timeline shows stage-by-stage progress and blockers.

4. **Watch it from the CLI.**

   ```bash
   ge agents status --watch       # loops every 15s until runs are terminal
   ge agents fleet                # fleet-wide run/work-item view
   ge agents logs <runId>         # logs for a specific run
   ```

   For the runtime/daemon view of work items:

   ```bash
   ge runtime status
   ge runtime tasks
   ge runtime events <id> --follow   # stream SSE events for one task
   ```

5. **Resume a blocked run.**

   ```bash
   ge runtime resume <id>
   ```

   This POSTs `/api/tasks/<id>/resume` with a deterministic resume plan.
   (`ge mission resume <id>` does the same for mission tasks.)

6. **Inspect the durable run ledger** (remote runs, history):

   ```bash
   ge ledger runs
   ge ledger fleet
   ge ledger plan
   ```

## Verify

- `ge agents status` (or the console Activity tab) shows the run reaching a
  terminal state.
- Local runs leave a workspace under `.ge/factory/workspaces/<id>/` (see
  `ge state paths`).
- A resumed run advances past the blocked stage in `ge runtime status`.

## Troubleshoot

- **Build won't start** — daemon down. `ge daemon start` (or `mise run setup` starts
  it).
- **Remote build rejected / unhealthy** — run cloud readiness checks:
  `ge doctor` (or scoped: `ge doctor --command agents.build`).
- **Run stuck at data readiness** — warm the data runtime: `mise run data-runtime`.
- **Resume does nothing** — confirm the task id and that it's actually blocked
  (`ge runtime task <id>`).
