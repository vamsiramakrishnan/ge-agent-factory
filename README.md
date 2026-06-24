# GE Agent Factory

GE Agent Factory exists because enterprise agents need more than prompts: they
need a business contract, source-system grounding, generated tools, tests, evals,
deployment automation, and runtime identity. This repo makes those pieces one
traceable path from use case to production.

In one sentence, it turns an enterprise use case into a **generated, tested,
deployable Gemini Enterprise agent**. You start from a business use case (or an
interview that produces one), and the factory generates a real ADK agent — code,
tools, fixtures, tests, and evals — grounded by simulated source systems. The
same generated workspace runs locally against fixtures and is then promoted to
**your own** Google Cloud project (single-tenant; no shared/cross-project
deploys): per-agent data stores, an MCP tool plane, Agent Runtime, Agent
Registry, and a Gemini Enterprise publish. It is an agent **factory**, not a
prompt-only demo generator.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/vamsiramakrishnan/ge-agent-factory&cloudshell_workspace=installer&cloudshell_tutorial=installer/TUTORIAL.md)

**Architecture map:** [docs/architecture.svg](docs/architecture.svg) shows the system in
developer-friendly terms.

## 📚 Documentation

The full docs site (sidebar + search) is published with GitHub Pages:

**→ https://vamsiramakrishnan.github.io/ge-agent-factory/**

- **[Developer Guide](https://vamsiramakrishnan.github.io/ge-agent-factory/developers.html)** — purpose, repo map, development loops, quality gates, and docs rules.
- **[Concepts](https://vamsiramakrishnan.github.io/ge-agent-factory/concepts/)** — the factory model: local vs remote mode, the stage graph, OKF specs, the data plane, the MCP tool plane.
- **[Reference](https://vamsiramakrishnan.github.io/ge-agent-factory/reference/)** — the `ge` CLI, `make` targets, configuration, and the apps.
- **[Cookbooks](https://vamsiramakrishnan.github.io/ge-agent-factory/cookbooks/)** — task-oriented guides: build a canary, run a mission, bring your own simulator, ship to the cloud.
- **[Operations](https://vamsiramakrishnan.github.io/ge-agent-factory/OPERATIONS.html)** — deploy, operate, troubleshoot, and recover the factory.
- **[MCP](https://vamsiramakrishnan.github.io/ge-agent-factory/MCP.html)** — factory MCP tools plus the generated-agent MCP tool plane.

The site is sourced from [`docs/`](docs/) (start at [`docs/index.md`](docs/index.md)).

## Quickstart

Local development — no cloud credentials required:

```bash
make setup          # install deps, sync catalog/skills, install the `ge` command, start the daemon
make doctor-local   # check local tools: Bun, uv, Python, agents-cli, cache, harness wiring
make devex-check    # fast gate: local doctor, docs links, workspace manifest contracts
make devex-smoke    # prove the path: doctor → local mode → one validated canary workspace
make console        # open the operator UI (Pipeline · Fleet · Activity · Doctor) → http://localhost:18260
```

Build one agent locally, up to the preview/build boundary:

```bash
make mode-local
make provision-local CANARY=1
```

Run `make help` for all targets, or `make next` for a status-based recommendation.

## Deploy to your own GCP project

The control plane lands in **your own** GCP project (single-tenant), ~15 min:

- Click **Open in Cloud Shell** above to clone the repo and run the guided installer
  ([`installer/TUTORIAL.md`](installer/TUTORIAL.md)).
- Or, from a checkout with `gcloud` authenticated:

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  make bootstrap CANARY=1   # toolchain → ge init → ge up (factory + data + tool planes) → prove one agent
  ```

## Local vs remote mode

The factory has two first-class modes, set once with `ge mode local|remote` (persisted in
`.ge.json`; default `remote`, overridable per command with `--local`/`--remote`). Both share
the same generated workspace and quality gates; they differ in **where work runs**. There is a
hard build boundary: everything up to validate/preview is pure computation; everything after
touches GCP.

| Mode | What runs here | Use it for |
|------|----------------|------------|
| **Local** | generate → validate → preview on your machine, against fixtures | fast iteration, offline tests, coding-agent review |
| **Remote** | the cloud factory builds → deploys → publishes in your GCP project | release: per-agent data, Agent Runtime, MCP/registry, Gemini Enterprise |

`ge agents ship` bridges the two: build + validate locally, then hand the post-boundary
stages (`load_data → deploy_runtime → register_tools → publish_enterprise`) to the cloud
factory, which consumes the prebuilt workspace instead of regenerating.

```bash
ge mode local
ge agents build --all     # plan → … → preview locally (stops at the build boundary)
ge agents ship --all      # cloud runs load_data → deploy → register → publish
```

## Monorepo layout

This is a Bun workspace monorepo (`apps/*`, `packages/*`) driven by one operator core
(`tools/lib/factory-core.mjs`) behind three surfaces: the `ge` CLI, the web console, and an
MCP server.

| Path | What it is |
|------|------------|
| [`apps/console`](apps/console) | The main operator UI — a React + Vite + Tailwind app whose Bun server exposes `/api/ge/*` (the same JSON the CLI emits). Views: Overview/Pipeline, Fleet (bulk build/ship/sync), Agent detail (stage pipeline + live logs + artifacts), Doctor, Activity. The **third surface** over `factory-core`. |
| [`apps/presentation`](apps/presentation) | The transformation deck and source use-case catalog used to explain the system. |
| [`apps/ge-demo-generator`](apps/ge-demo-generator) | The generator: the `ge-mock` generation pipeline, the lower-level web workbench, the factory runner/worker, and the generic multi-tenant FastMCP server under [`mcp-service/`](apps/ge-demo-generator/mcp-service). |
| [`tools/`](tools) | The `ge` operator CLI (`ge.mjs`), the MCP server (`mcp-server.mjs`), and the shared operator core + runtime daemon under `tools/lib/`. |
| [`installer/`](installer) | Terraform + the guided Cloud Shell installer (`TUTORIAL.md`) that stands the platform up in your project. |
| [`docs/`](docs) | This documentation site (GitHub Pages) plus operator runbooks, ADRs, and design specs. |

### Running an app locally

`make dev` (or `bun run dev`) just lists the apps and starts nothing — pick one:

| App | Dev (hot reload) | Build | Serve the build |
|-----|------------------|-------|-----------------|
| Console — ops UI (:18260) | `make console` · `bun run dev:console` | `bun run build:console` | `bun run start:console` (:8261) |
| Presentation — deck (:18250) | `make presentation` · `bun run dev:presentation` | `bun run build:presentation` | `bun run start:presentation` (:8251) |
| Generator — web (:17655) | `make generator` · `bun run dev:generator` | — | — |

## The `ge` CLI

`ge` is the human surface over the factory core (the console and MCP server drive the same
core). Bare `ge` prints a status board with the next step; every command supports `--json`.

```bash
ge                     # status board: mode · planes ✓/○ · next step
ge init                # discover config → .ge.json
ge mode local          # or: ge mode remote
ge up                  # stand up all planes (infra + data + tool) → unified doctor
ge doctor              # toolchain · factory · data plane · tool plane
ge devex check         # fast gate: local doctor + docs links + workspace manifests
ge devex smoke         # one-command local proof: doctor → validated canary workspace
ge agents build --canary
ge agents ship --canary
ge agents status --watch
ge agents sync --push
```

Run via `bun tools/ge.mjs <cmd>`, or install it on your PATH with `make setup` (then just `ge`).

## Develop

```bash
bun install            # install workspace deps
make devex-check       # fast local gate before or after a focused edit
make ci                # the CI gate: source hygiene + full bun test suite (mirrors CI)
bun test apps tools    # run the test suite directly
```

## More

- Operator runbook: [`docs/OPERATIONS.md`](docs/OPERATIONS.md)
- Design specs: [`docs/superpowers/specs/`](docs/superpowers/specs)
- CLI internals: [`tools/README.md`](tools/README.md)
