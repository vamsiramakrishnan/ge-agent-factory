---
title: Quickstart
description: From a fresh clone to a validated agent workspace on your machine.
---

Get from a fresh clone to a validated agent workspace — no cloud required until you choose to ship.

## 1. Set up the toolchain

```bash
mise run setup    # JS deps + Python/uv toolchain + put `ge` on PATH
ge doctor     # toolchain + factory + data/MCP plane health
```

## 2. Build one agent locally

```bash
ge agents build:local            # build a canary agent via the local harness
```

Local mode runs the whole line — generate → validate → preview — on your machine with fixtures. Nothing touches the cloud until the `ship` boundary.

## 3. Inspect what was generated

The factory emits a real workspace: ADK agent code, tools, fixtures, evals, and a promotion packet. The promotion gate blocks a ship that hasn't passed validation and the harness verdicts.

## Next steps

- The full operator surface: [ge command reference](../reference/cli/)
- Stand up the cloud platform: `ge up` (see the command reference for prerequisites and risk).

:::tip
Every `ge` command accepts `--json` for scripting, and the same commands are available as HTTP routes (the console) and MCP tools (model/harness callers).
:::
