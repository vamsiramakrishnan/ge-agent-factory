---
title: Console
nav_order: 5
has_children: true
layout: default
description: The operator console — the browser surface over the same engine the CLI drives, view by view.
---

# The console

The console (`mise run console`, <http://localhost:18260>) is the browser
surface over the factory. Its server exposes the same JSON the `ge` CLI
emits, dispatched through the same command registry — so the console and the
CLI are two views of one engine and can never disagree about state.

The left sidebar has seven entries; three detail surfaces open from them. Recent OKF work is represented as export and review affordances inside the existing Spec Review flow, while run-driving remains in the existing Pipeline, Runs, and agent detail surfaces:

| View | What it's for | Page |
|---|---|---|
| **Overview** | The whole system at a glance: fleet summary, recent runs, plane status, next action | this page, below |
| **Interview** | Capture enterprise intent into a contract, conversationally, with document grounding | [Contract editor](./contract-editor.html) |
| **Pipeline** | Drive a use case from contract to generated agent (Source → Configure → Review) | [Pipeline & runs](./pipeline-and-runs.html) |
| **Runs** | One chronological timeline over everything the factory is doing, with live follow | [Pipeline & runs](./pipeline-and-runs.html) |
| **Fleet** | Every generated agent, filterable, with bulk actions | [Fleet & repair](./fleet-and-repair.html) |
| **Repair Queue** | Drive batches of agents to a target stage, auto-repairing blockers | [Fleet & repair](./fleet-and-repair.html) |
| **Readiness** | A preflight verdict with runnable fixes, before anything mutating | [Readiness](./readiness.html) |
| *Agent detail* | Deep view of one agent: stages, artifacts, per-stage actions | [Fleet & repair](./fleet-and-repair.html) |
| *Spec Review* | The contract rendered half-by-half for editing and OKF export | [Contract editor](./contract-editor.html) |
| *OKF export* | The OKF knowledge bundle, concept coverage, source files, and export status for the current contract | [OKF export & run controls](./okf-and-drive.html) |

## Overview — the home base

The landing view pulls the fleet, recent runs, and a best-effort apply plan,
and surfaces plane cards plus a quick path into the pipeline. Use it to see
overall state and jump to the next action; bare `ge` in a terminal prints
the equivalent status board.

<p align="center">
  <img src="../assets/screenshots/overview.png" alt="Console Overview view showing the build-to-deploy pipeline rail (362 in Build, 1 in Ship), a Next step card recommending ge init, and Pipeline / Fleet summary cards with 0 deployed, 1 submitted, 1 failed" width="820">
</p>

## The live status model

Everything live in the console is built on the durable run record (the
*ledger* — the event log every status surface reads):

- The **Now pulse** in the top bar polls it on a calm cadence and shows a
  compact `▶running ⏸blocked ✕failed ✓done` cluster; clicking it opens
  **Runs**.
- **Follow** on any run subscribes the **Run Drawer** — a right-side panel
  with an ordered stage timeline, a rolling log tail, and the blocked
  reason when a run pauses — to that run's live event stream.
- **Remote** runs stream their stage logs through the same record, so a
  cloud run looks and follows exactly like a local one.

<p align="center">
  <img src="../assets/diagrams/run-drawer-follow.svg" alt="Now pulse polls the ledger; Follow subscribes the Run Drawer to a run's SSE event stream, which reduces into the stage timeline and log tail, and auto-reconnects on drop" width="700">
</p>

## See also

- [Console & APIs](../reference/console-and-apis.html) — the `/api/ge/*`
  route surface behind these views.
- [CLI reference](../reference/cli.html) — the same engine from a terminal.
