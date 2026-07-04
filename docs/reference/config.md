---
title: Config
parent: Reference
nav_order: 9
layout: default
description: The .ge.json operator config — every field, its flag and env spellings, and the flag → env → file → default precedence.
---

# Config

Operator configuration lives in **`.ge.json`** at the repo root, written by
`ge init` (which discovers values from Terraform outputs, then gcloud). Every
value resolves with one precedence, highest first:

```
CLI flag  →  environment variable  →  .ge.json  →  default
```

Two commands make configuration inspectable instead of mysterious:

```bash
ge config explain   # every field: value + which source supplied it (flag/env/file/default/unset)
ge init             # (re)discover and write .ge.json
```

## Fields

The machine-readable schema is
[`.ge.schema.json`](https://github.com/vamsiramakrishnan/ge-agent-factory/blob/main/.ge.schema.json)
at the repo root — generated from `CONFIG_FIELDS` in
`tools/lib/config-schema.mjs` (`bun run config:schema`; drift-gated in CI),
and referenced by `ge init` so editors validate `.ge.json` as you type. The
core fields:

| Field | CLI spelling | Env | Default |
|---|---|---|---|
| `project` | `--project` / `--gcp-project` (every command) | `GCP_PROJECT_ID`, `GOOGLE_CLOUD_PROJECT`, `GCLOUD_PROJECT` | — (required for infra/build/agents/data/mcp) |
| `projectNumber` | *(env / file only)* | `GOOGLE_CLOUD_PROJECT_NUMBER` | — |
| `region` | `--region` (every command) | `GCP_REGION` | `us-central1` |
| `mode` | `ge mode local\|remote`; per-command `--local`/`--remote` overrides | `GE_MODE` | `local` — remote (billable) work is opt-in |
| `gatewayUrl` | *(env / file only)* | `API_GATEWAY_URL` | discovered |
| `gatewayTransport` | *(env / file only)* | `GE_GATEWAY_TRANSPORT` | `proxy` (`direct` calls `gatewayUrl` with a bearer token) |
| `bucket` | *(env / file only)* | `GE_AGENT_FACTORY_BUCKET` | discovered |
| `geApp` | *(env / file only)* | `GEMINI_ENTERPRISE_APP_ID` | — (required to publish) |
| `geLocation` | *(env / file only)* | `GEMINI_ENTERPRISE_LOCATION` | `global` |
| `agentIdentityOrgId` | `--agentIdentityOrgId` (every command) | `GE_AGENT_IDENTITY_ORG_ID` | — |
| `agentsRepo` | `--remote <git-url>` (on `ge agents sync`) | `GE_AGENTS_REPO` | `""` (falls back to `generated-agents/` in-repo) |

> `.ge.schema.json` is the operator config schema — it is **not** the
> Enterprise Agent Contract's schema. The contract's schema lives in
> `packages/agent-spec/src/schema.ts` and is documented in
> [Contract schema](./spec-schema.html).
{: .note }

## Adjacent knobs (env-only)

A few behaviors are environment-only, documented where they're used:

| Env | Effect | Documented in |
|---|---|---|
| `GE_DATA_BACKEND` | `fixtures` (local) vs `mcp` (cloud) tool backend in generated agents | [Generated artifacts](./agent-generation.html) |
| `GE_DAEMON_PORT` | local daemon port (default 17654) | [CLI](./cli.html) |
| `GE_STATE_ROOT` | relocate the `.ge/` state root | [Run and observe](../operations/run-and-observe.html) |
| `GE_CONSOLE_READONLY` | read-only production console | [Operations](../OPERATIONS.html) |
| `GE_HARNESS_PYTHON` | override the harness interpreter | [Operations](../OPERATIONS.html) |
| `GE_ALLOW_UNPROMOTED` | override the promotion gate (visible, deliberate) | [Evals as proof](../concepts/evals-as-proof.html) |
| `GE_ADMISSION_BREAK_GLASS` | release despite a denied admission decision — a recorded override, same as `ge handoff --force` | [Admission gate & Agent Passport](./admission.html) |
| `GE_SIMULATOR_OVERLAY_BACKEND` | share BYO twin overlays across instances (`firestore`/`alloydb`) | [Simulator systems](./simulator-systems.html) |

## Where config is read

All three surfaces — CLI, console, MCP server — resolve config through the
same module (`tools/lib/config-schema.mjs` via `factory-core`), so
`ge config explain` is authoritative for all of them.
