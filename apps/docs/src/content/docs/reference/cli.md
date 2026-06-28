---
title: CLI
description: The ge, factory, and make command surfaces.
---

The factory exposes three command surfaces:

- **`ge`** — the operator CLI (`bun tools/ge.mjs`): set up the machine → stand up the platform → run agents.
- **`factory`** — the lower-level generator CLI (`node apps/factory/scripts/factory.mjs`) that emits one agent workspace step by step.
- **`make`** — a task runner that wraps the common flows.

`ge` is a thin renderer over `tools/lib/factory-core.mjs`. Every command accepts `--json` (structured result on stdout, progress on stderr); the console serves the same commands as HTTP routes, and the MCP server exposes them as tools — one registry, three surfaces.

:::note[Auto-generated reference is on the way]
The per-command reference (each command's purpose, risk, typical duration, and prerequisites) is being moved to **generation from the command registry** as part of the CLI migration to [citty](https://github.com/unjs/citty) — so this page will always match the running CLI instead of drifting. Until then, run `ge --help` (or `ge <command> --help`) for the authoritative, live list.
:::

## Lifecycle at a glance

| Phase | Command | What it does |
| --- | --- | --- |
| Set up | `ge doctor` | Toolchain + factory + data/MCP plane health |
| Stand up | `ge up` | Provision infra, data, and tool planes |
| Build | `ge agents build` | Build selected agents through the cloud factory |
| Build (local) | `ge agents build:local` | Build agents on this machine via the local harness |
| Ship | `ge ship` | Upload locally built agents and continue cloud deployment |

Run `ge` with no arguments for the status board and the next recommended command.
