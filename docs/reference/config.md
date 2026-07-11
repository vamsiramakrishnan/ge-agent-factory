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
| `dataBackend` | *(env / file only)* | `GE_DATA_BACKEND` | `fixtures` — `fixtures` (local) vs `mcp` (cloud) tool backend in generated agents; the generated Python tool backend reads the env var directly and never `.ge.json` |
| `consoleReadonly` | *(env / file only)* | `GE_CONSOLE_READONLY` | `false` — optional observe-only console lock; read per-request straight off the env var by the console server, not through `.ge.json` |
| `harnessPythonPath` | *(env / file only)* | `GE_HARNESS_PYTHON` | — (falls back to a discovered venv, then `python3`) — override the harness interpreter; resolved from the env var only |
| `allowUnpromoted` | `--force` (on `ge handoff`) | `GE_ALLOW_UNPROMOTED` | `false` — override the promotion gate (visible, deliberate); resolved from the env var only |
| `simulatorOverlayBackend` | *(env / file only)* | `GE_SIMULATOR_OVERLAY_BACKEND` | `memory` — durable backend (`firestore`/`alloydb`) for BYO-twin overlays shared across Cloud Run instances; a configured value flows to deployed MCP services via `ge mcp deploy`, but the simulator's own Python reader honors only the env var |
| `agentModel` | `--model` (on `ge agents build`) | `GE_AGENT_MODEL` | `gemini-3.5-flash` — the runtime model in every generated `app/agent.py`; validated against the known-models allowlist at generation time |
| `harnessAgent` | `--harness-agent` (on `ge pipeline run`/`graph`); `--provider` on `factory harness-*` | `GE_HARNESS_AGENT` | `antigravity-sdk` — the default harness adapter for review/refine/judge/pipeline harness nodes (`antigravity-sdk`, `claude`, `codex`, `gemini`, `agy`, `mock`) |
| `refinementModel` | `--model` (on `ge pipeline run`/`graph` and the harness commands) | `GE_REFINEMENT_MODEL` | `gemini-3.5-flash` — the model the harness review/refine steps run against |
| `judgeModel` | *(env / file only)* | `GE_JUDGE_MODEL` | `gemini-3.5-flash` — the LLM-judge model rendered into every generated `eval_config.yaml` |
| `synthesisModel` | *(env / file only)* | `GE_SYNTHESIS_MODEL` | `gemini-3.5-flash` — the MCP tool-plane's LLM synthesis-sketch model; the Python service reads the env var directly |

> `.ge.json` remains an available spelling for every field above per the flag →
> env → file → default precedence, but `dataBackend`, `consoleReadonly`,
> `harnessPythonPath`, and `allowUnpromoted` currently have **no JS reader that
> consumes the resolved config value** — only the env var is actually read at
> the point of use (Python tool backend, console server, harness doctor,
> promotion gate). Setting them in `.ge.json` will show up in `ge config
> explain` for visibility, but won't itself change behavior; use the env var
> to actually change behavior. `simulatorOverlayBackend` is the one field in
> this group that *does* flow from `.ge.json`/flag through to a JS consumer
> (`ge mcp deploy`'s env-var forwarding).
{: .note }

> The model and harness fields are wired end to end: `buildFactoryConfig()`
> (`tools/lib/config-schema.mjs`) carries the resolved values onto `cfg`, and
> the consumers read them — `ge agents build` exports `agentModel` to the
> generator (which validates it against the known-models allowlist) and pins
> `refinementModel` on the harness review/refine stages; `ge pipeline
> run`/`graph` and the daemon resolve `harnessAgent`/`refinementModel` for
> their harness nodes; the eval-artifact renderer threads `judgeModel`
> (`GE_JUDGE_MODEL`) into every generated `eval_config.yaml`. `ge models
> doctor` warns when `refinementModel`/`judgeModel` don't match a known family
> (`gemini-*`, `claude-*`, `gpt-*`), and `ge byo apply` writes both from a
> manifest's `models.refinement`/`models.judge` section.
{: .note }

> `.ge.schema.json` is the operator config schema — it is **not** the
> Enterprise Agent Contract's schema. The contract's schema lives in
> `packages/agent-spec/src/schema.ts` and is documented in
> [Contract schema](./spec-schema.html).
{: .note }

## Adjacent knobs (env-only)

A few behaviors are environment-only, documented where they're used:

| Env | Effect | Documented in |
|---|---|---|
| `GE_DAEMON_PORT` | local daemon port (default 17654) | [CLI](./cli.html) |
| `GE_STATE_ROOT` | relocate the `.ge/` state root | [Run and observe](../operations/run-and-observe.html) |
| `GE_ADMISSION_BREAK_GLASS` | release despite a denied admission decision — a recorded override, same as `ge handoff --force` | [Admission gate & Agent Passport](./admission.html) |

`GE_DATA_BACKEND`, `GE_CONSOLE_READONLY`, `GE_HARNESS_PYTHON`,
`GE_ALLOW_UNPROMOTED`, and `GE_SIMULATOR_OVERLAY_BACKEND` moved into the
[Fields](#fields) table above — they're now in `CONFIG_FIELDS` /
`.ge.schema.json`, even though most of them still resolve only from the env
var at the point of use (see the note under that table).

## Where config is read

All three surfaces — CLI, console, MCP server — resolve config through the
same module (`tools/lib/config-schema.mjs` via `factory-core`), so
`ge config explain` is authoritative for all of them.
