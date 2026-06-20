---
title: CLI
parent: Reference
nav_order: 1
layout: default
---

# CLI reference

The factory exposes three command surfaces:

- **`ge`** — the human/operator CLI (`bun tools/ge.mjs`). Lifecycle: set up the
  machine → stand up the platform → run agents.
- **`ge-mock`** — the lower-level generator CLI
  (`node apps/ge-demo-generator/scripts/ge-mock.mjs`) that emits one agent
  workspace step by step.
- **`make`** — task runner that wraps both for the common flows.

`ge` is a thin renderer over `tools/lib/factory-core.mjs`. Every command accepts
`--json` (structured result on stdout, progress on stderr); the MCP server drives
the same core for model/harness callers.

---

## `ge` — operator CLI

Source: [`tools/ge.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory).
Install with `make install` (writes `~/.local/bin/ge` → `bun tools/ge.mjs`), or
call `bun tools/ge.mjs <cmd>` directly.

### Shared flags

Every command accepts: `--json`, `--project <id>`, `--region <r>` (default
`us-central1`), `--agentIdentityOrgId <org>`. Config resolves with precedence
**flag → env → `.ge.json` → default**.

### Status board

```bash
ge                 # bare: project/app, mode, planes ✓/○, and the next command
```

### Lifecycle

| Command | Purpose | Key flags / args | Example |
|---|---|---|---|
| `ge init` | Discover config (terraform outputs → gcloud) → write `.ge.json` | shared | `ge init` |
| `ge up` | Stand up the platform: infra + data + tool planes → unified doctor | `--infra` `--data` `--mcp` (one plane only) | `ge up` |
| `ge doctor` | Unified health: toolchain · factory · data plane · tool plane | `--local` `--cloud` `--data` `--mcp` (filter); `--command <up\|data.up\|mcp.deploy\|agents.build\|agents.build.local\|agents.ship\|agents.sync>` | `ge doctor --local` |
| `ge cutover` | Adopt a hand-managed project into Terraform | `--apply` (default: print the plan) | `ge cutover --apply` |
| `ge mode [set]` | Show or set the operating mode | positional `local` \| `remote` | `ge mode local` |
| `ge config explain` | Show each config value and where it came from | — | `ge config explain` |

### Platform planes

| Command | Purpose | Key flags | Example |
|---|---|---|---|
| `ge infra <sub>` | Drive the terraform module | positional `init\|plan\|apply\|output\|destroy`; `--gatewayImage` `--workerImage` `--yes` | `ge infra apply --yes` |
| `ge images build [target]` | Build images (no arg = gateway+worker; `builder` = shared toolchain) | positional target | `ge images build` |
| `ge images deploy [target]` | Build gateway/worker images + bind via terraform | positional `gateway\|worker\|all` | `ge images deploy` |
| `ge data up` | Provision shared data stores (terraform apply) → merge coords into `.ge.json` | — | `ge data up` |
| `ge data doctor` | Check bucket, AlloyDB DSN secret, Bigtable, BigQuery | — | `ge data doctor` |
| `ge mcp deploy` | Deploy the per-department custom MCP services to Cloud Run | — | `ge mcp deploy` |
| `ge mcp doctor` | Check the MCP services + Agent Registry readiness | — | `ge mcp doctor` |

### Agent lifecycle

```bash
ge agents build      # build agents in the active mode
ge agents ship       # hand off locally-built agents to the cloud
ge agents status     # poll submitted runs (stage tally)
ge agents fleet      # fleet pipeline health, bottlenecks, repair owners
ge agents logs <id>  # pretty-print a stage's result + errors
ge agents sync       # generated agent code → generated-agents/ → git
```

**`ge agents build`** uses the active mode (`ge mode`); `--local`/`--remote`
override it.

- Scope: `--canary` (one agent) · `--all` · `--dept <d>` · `--ids <a,b,c>`
- Remote: `--concurrency <n>` (default 2), `--force`, `--no-proxy`,
  `--no-refine` (skip the cloud Antigravity refine stage, equivalent to
  `REFINE=0`), `--model <m>`, `--max-output-tokens <n>`
- Local (`--local`): `--target <stage>` (harness build boundary, default
  `previewed`), `--vertex` / `--no-vertex`, `--location <l>`, `--limit <n>`,
  `--warm` (pre-warm the uv cache)

```bash
ge agents build --canary --local         # build one agent on this machine
ge agents build --all --remote            # submit the whole fleet to the cloud
ge agents build --ids account-reconciliation-agent --no-refine
```

**`ge agents ship`** — `--ids <list>`, `--start-stage <s>` (default `load_data`),
`--target-stage <s>` (default `publish_enterprise`), `--concurrency`, `--no-proxy`.

**`ge agents sync`** — `--ids <list>`, `--push`, `--force`, `--no-commit`,
`--local` / `--remote-mode`, `--remote <git-url>`, `--create` (create the Cloud
Source repo if missing, local mode).

**`ge agents logs <runId>`** — `--stage <s>` (default `validate`), `--item <id>`.

### Daemon & runtime

The local **GE runtime daemon** (`ge daemon`) backs Autopilot, missions, the
journey, and the console. Default port **17654** (`GE_DAEMON_PORT`).

```bash
ge daemon start | status | tasks | task <id> | events <id> [--follow] | stop
```

`ge runtime` is the unified runtime activity surface over the same daemon:

```bash
ge runtime status
ge runtime tasks [--limit N]
ge runtime task <id>
ge runtime events <id> [--follow]
ge runtime resume <id>                       # resume via the task's resumePlan
ge runtime start autopilot --ids <a,b> --stage preview [--repair] [--attempts N] [--runPreview]
ge runtime start job -- ge <args>            # run a ge command as a runtime task
```

### Autopilot · mission · journey

| Group | Subcommands | Notes |
|---|---|---|
| `ge autopilot` | `run` · `status [id]` · `events <id>` | Daemon-native convergence. `run`: `--ids`, `--target-stage` (default `preview`), `--no-repair`, `--attempts <n>` (default 3), `--run-preview`. |
| `ge mission` | `plan` · `run` · `status [id]` · `resume <id>` | Mission graph DAG. Args: `--ids`, `--scenario`, `--systems`, `--target-stage`, `--with-factory`, `--no-antigravity`, `--model`, `--location`. `plan` builds the DAG without running it. |
| `ge journey` | `plan` · `status` · `run` | The user-facing pipeline: interview → spec → data → simulator → build → eval → preview → deploy. Args: `--scenario`, `--usecase`, `--systems`, `--ids`, `--target-stage`. |

```bash
ge journey plan --usecase account-reconciliation-agent
ge mission run --scenario leave-planning --systems workday,docusign_clm --target-stage preview
ge autopilot run --ids agent-a,agent-b --target-stage preview
```

### State & ledger

```bash
ge state paths              # show the canonical local GE state layout (.ge/…)
ge state reset --yes        # destructive: clear runtime/factory/mission/interview state
```

The **durable run ledger** (ADR 0001) is the single source of truth for runs,
local and remote:

```bash
ge ledger backfill          # import legacy run state into the ledger
ge ledger runs [--limit N]  # list recorded runs
ge ledger fleet [--limit N] # latest work-item state per use case
ge ledger plan [--target previewed] [--mode local|remote]   # next action per item
```

### Declarative reconcile

```bash
ge apply                    # plan: actual → desired from ge.manifest.json
ge apply --yes              # execute the plan in dependency order
ge apply --manifest <path>  # use a specific manifest
```

---

## `ge-mock` — generator CLI

Source:
[`apps/ge-demo-generator/scripts/ge-mock.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory).
Invoke as `node apps/ge-demo-generator/scripts/ge-mock.mjs <command>`. This is the
build engine the factory drives per stage; it emits one agent workspace into
`--dir <dir>`.

**Flow:** `init → schema → generate → tools → test → serve → deploy → register → publish`

### Local development

| Command | Purpose | Key flags |
|---|---|---|
| `init` | Create the workspace structure | `--name <n>` `--domain <d>` `--dir <dir>` |
| `from-usecase` | Materialize a workspace from an enterprise catalog use case | `--usecase <id>` (or `--freeform '<description>'`) `--dir` |
| `schema` | Add / inspect table schemas | `--dir` `--add-table '<json>'` |
| `generate` | Produce fixture data (faker) | `--dir` `[--seed N]` `[--rows N]` |
| `tools` | Generate the Python ADK agent (`app/agent.py`, `app/tools.py`, evals, OKF `app/knowledge/`) | `--dir` |
| `test` | Generate + run smoke tests | `--dir` `[--run true\|false]` |
| `eval` | Generate / run the evalset | `--dir` `[--run true\|false]` |
| `quality-gate` | Run the build-boundary gate | `--dir` `--prompt "…"` `[--evals]` `[--harness-review]` `[--vertex\|--no-vertex]` `[--project]` `[--location]` |
| `harness-review` | Headless harness review of the workspace | `--dir` `[--provider antigravity-sdk\|agy\|gemini\|codex\|claude]` `[--vertex\|--no-vertex]` |
| `harness-refine` | Harness self-correction pass (edits the workspace) | `--dir` `[--provider antigravity-sdk]` `[--vertex\|--no-vertex]` |
| `serve` | Start the ADK web preview | `--dir` `[--port N]` |
| `data-plan` | Generate BigQuery/GCS load artifacts | `--dir` `[--project --dataset --bucket]` |
| `plan-data` | Plan a datastore collection from a use case | `--dir` `--usecase <UseCaseName>` |
| `source-integration-plan` | Plan API/MCP/datastore provisioning + registry wiring | `--dir` `[--project]` |
| `snowfakery-recipe` | Export an optional Snowfakery recipe | `--dir` |
| `sources` | Analyze slide source systems | `--slides <dir>` `[--json --md]` |

### Google Cloud

| Command | Purpose | Key flags |
|---|---|---|
| `mcp` | Manage Google Cloud MCP servers | `--action plan\|list\|enable\|disable` `[--service bigquery\|maps\|…]` |
| `deploy` | Deploy to Agent Runtime / Cloud Run | `--dir` `--project` `[--target agent_runtime\|cloud_run]` |
| `deploy-status` | Check a pending Agent Runtime deploy | `--dir` `--project` `--region` |
| `verify-live` | Probe a live deployment | `--dir` `--prompt "…"` |
| `register` | Register in Agent Registry | `--dir` `--as adk\|mcp\|a2a` |
| `publish` | Publish to Gemini Enterprise | `--dir` `--app-id <id>` |

### Pipeline & audit

| Command | Purpose | Key flags |
|---|---|---|
| `status` | Show pipeline state + data analysis | `--dir` |
| `reset` | Reset the pipeline from a step | `--dir` `--step <step>` |
| `list-usecases` | Browse the enterprise use-case catalog | — |
| `pack-coverage` | Report simulator-pack coverage | `[--out artifacts/pack-coverage.json]` |
| `batch-audit` | Audit many generated workspaces | `[--limit N]` `[--department hr]` `[--root <dir>]` `[--run]` `[--harness-review]` |

```bash
ge-mock init --dir ./hr-agent --name hr-demo --domain hr
ge-mock from-usecase --dir ./hr-agent --usecase account-reconciliation-agent
ge-mock generate --dir ./hr-agent --seed 42
ge-mock tools --dir ./hr-agent
ge-mock quality-gate --dir ./hr-agent --prompt "hello" --harness-review true
ge-mock publish --dir ./hr-agent --app-id my-gemini-enterprise-app-id
```

> `ge-mock` also exports pure build helpers (`deriveAgentWorkflow`,
> `canonicalIntentToolName`, …) under `__test`; importing the module does **not**
> execute the CLI.

---

## `make` targets

Source: [`Makefile`](https://github.com/vamsiramakrishnan/ge-agent-factory). Run
bare `make` (or `make help`) for the grouped listing; `make next` for a
status-based recommendation.

### Setup & toolchain

| Target | What it does |
|---|---|
| `make setup` | Install JS + Python/uv deps, sync catalog/skills, put `ge` on PATH, start the daemon |
| `make bootstrap [CANARY=1]` | End-to-end: toolchain + `ge init` + `ge up`. `CANARY=1` also builds one agent. Needs `GEMINI_ENTERPRISE_APP_ID` + gcloud auth |
| `make all` | Alias for `bootstrap` |
| `make deps` / `make data-runtime` / `make deps-terraform` | Toolchain pieces: uv + agents-cli + `.venv` (google-antigravity); Snowfakery runtime; terraform |
| `make install` / `make uninstall` | Install / remove the `ge` command |
| `make ci` | Run the CI gate locally (source hygiene + `bun test apps tools`) |
| `make install-hooks` | Install the pre-commit hook (source hygiene) |
| `make catalog` | Regenerate the use-case catalog build artifact |

### Skills

`make skills-sync` · `skills-doctor` · `skills-spec-audit` · `skills-install`
(link repo skills into a headless harness at `AGENTS_SKILLS_DIR`, default
`~/.agents/skills`).

### Platform ops

| Target | Wraps |
|---|---|
| `make doctor` / `make doctor-local` | `ge doctor` / `ge doctor --local` |
| `make up` | `ge up` |
| `make cutover [APPLY=1]` | `ge cutover [--apply]` |
| `make data` / `make data-doctor` | `ge data up` / `ge data doctor` |
| `make mcp-deploy` / `make mcp-doctor` | `ge mcp deploy` / `ge mcp doctor` |
| `make status` | bare `ge` |
| `make mode-local` / `make mode-remote` | `ge mode local` / `ge mode remote` |
| `make provision [CANARY=1]` | `ge agents build` (`--canary` or `--all`) |
| `make provision-local [CANARY=1]` | `ge agents build --local` |
| `make sync` / `make sync-local` | `ge agents sync --push` / `--local --create --push` |
| `make mcp-server` / `make mcp` | Run the factory's MCP server (stdio) |

### Run one app locally

| Target | App | URL |
|---|---|---|
| `make console` | Operator UI (Pipeline, Fleet, Activity, Doctor) | `http://localhost:18260` |
| `make presentation` | Transformation deck + source use-case catalog | `http://localhost:18250` |
| `make generator` | Generator workbench (mock data, harness, workspaces) | `http://localhost:17655` |
| `make build-console` / `build-presentation` | Production builds (`dist/`) | — |
| `make serve-console` / `serve-presentation` | Serve the built app via Bun | `PORT` (default 8261 / 8251) |

> Bare `make dev` is a guard: it explains the three apps and starts nothing.
