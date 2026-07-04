---
title: Pipeline & runs
parent: Console
nav_order: 2
layout: default
description: The Pipeline wizard that compiles a contract into an agent, and the Runs timeline and Run Drawer that let you watch every stage live.
---

# Pipeline & runs

Compilation and observation are two views: **Pipeline** starts work,
**Runs** watches it.

## Pipeline — from contract to agent

A three-step wizard — **Source → Configure → Review**:

1. **Source** picks an existing contract or starts a new one (handing you to
   the [contract editor](./contract-editor.html) if needed).
2. **Configure** sets the scenario and the **source systems** via the
   SystemsField, which autocompletes over the simulated-system corpus. Its
   **Bring Your Own System** flow synthesizes a brand-new
   [source-system twin](../concepts/source-system-twins.html) from a
   natural-language description and binds it to the contract, live.
3. **Review** shows what will run and launches it.

Use it to drive a single agent (or a bulk scope) from contract to generated,
validated workspace. The CLI equivalents are `ge pipeline plan|run` and
`ge agents build`.

<p align="center">
  <img src="../assets/screenshots/pipeline.png" alt="Pipeline wizard's Source step: a Choose the route card offering Deploy from registered specs or Interview to registered spec, with a Next: Configure action" width="820">
</p>

## Runs — everything, chronologically

One timeline over all three run sources — pipeline runs, builds, and jobs —
normalized into a single list with a unified status filter. Each row is
tagged by origin, expands to detail, and **Follow** opens the live Run
Drawer on it. CLI equivalents: `ge runs list`, `ge runs show <id>`,
`ge runs events <id> --follow`.

## The Run Drawer

The live-follow surface: an ordered **stage timeline**, a rolling **log
tail**, the **blocked reason** when a run pauses, and a reconnecting
indicator if the stream drops. **Pin** keeps it open after completion.
Because remote runs stream their logs through the same durable record, a
cloud compilation follows exactly like a local one.

<p align="center">
  <img src="../assets/diagrams/run-drawer-follow.svg" alt="Now pulse polls the ledger; Follow subscribes the Run Drawer to a run's SSE event stream, which reduces into the stage timeline and log tail, and auto-reconnects on drop" width="700">
</p>

## See also

- [Compile a contract](../cookbooks/compile-a-contract.html) — the same path from the CLI.
- [Run and observe](../operations/run-and-observe.html) — resuming blocked runs, inspecting the durable record.
- [Fleet & repair](./fleet-and-repair.html) — when it's many agents, not one.
