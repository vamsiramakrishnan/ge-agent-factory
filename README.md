# GE Agent Factory

GE (Gemini Enterprise) Agent Factory exists because enterprise agents need more than prompts: they
need a business contract, source-system grounding, generated tools, tests, evals,
deployment automation, and runtime identity. This repo makes those pieces one
traceable path from use case to production.

In one sentence, it turns an enterprise use case into a **generated, tested,
deployable Gemini Enterprise agent**. You start from a business use case (or an
interview that produces one), and the factory generates a real ADK agent — code,
tools, fixtures, tests, and evals — grounded by simulated source systems. The
same generated workspace runs locally against fixtures and is then promoted to
**your own** Google Cloud project (single-tenant; no shared/cross-project
deploys): per-agent data stores, an MCP tool [plane](docs/GLOSSARY.md#planes)
(one of the platform's three infrastructure layers — factory, data, tool),
Agent Runtime, Agent Registry, and a Gemini Enterprise publish. It is an agent **factory**, not a
prompt-only demo generator. After a one-time `mise run setup` (~5-10 min), your
first canary agent is about five minutes away — then you build, watch it run
live, and ship it to the cloud.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/vamsiramakrishnan/ge-agent-factory&cloudshell_workspace=installer&cloudshell_tutorial=installer/TUTORIAL.md)

**Architecture map:** [docs/architecture.svg](docs/architecture.svg) shows the system in
developer-friendly terms.

## 📚 Documentation

The full docs site (sidebar + search) is published with GitHub Pages:

**→ https://vamsiramakrishnan.github.io/ge-agent-factory/**

- **[Developer Guide](https://vamsiramakrishnan.github.io/ge-agent-factory/developers.html)** — purpose, repo map, development loops, quality gates, and docs rules.
- **[Concepts](https://vamsiramakrishnan.github.io/ge-agent-factory/concepts/)** — the factory model: local vs remote mode, the stage graph, [OKF](docs/GLOSSARY.md#okf--knowledge-bundle) (Open Knowledge Format — the spec's portable Markdown form) specs, the data plane, the MCP tool plane.
- **[Reference](https://vamsiramakrishnan.github.io/ge-agent-factory/reference/)** — the `ge` CLI, `mise` tasks, configuration, and the apps.
- **[Cookbooks](https://vamsiramakrishnan.github.io/ge-agent-factory/cookbooks/)** — task-oriented guides: build a [canary](docs/GLOSSARY.md#canary) (a single agent that proves the pipeline), run the [pipeline](docs/GLOSSARY.md#pipeline-formerly-journey) end to end (one orchestrated, resumable run), bring your own simulator, ship to the cloud.
- **[Operations](https://vamsiramakrishnan.github.io/ge-agent-factory/OPERATIONS.html)** — deploy, operate, troubleshoot, and recover the factory.
- **[MCP](https://vamsiramakrishnan.github.io/ge-agent-factory/MCP.html)** — factory MCP tools plus the generated-agent MCP tool plane.

The site is sourced from [`docs/`](docs/) (start at [`docs/index.md`](docs/index.md)).

Unfamiliar term? See the [Glossary](docs/GLOSSARY.md) — plain-language translations of the repo's jargon (harness, OKF, canary, planes, pipeline runs, …).

## Quickstart

**→ See [`SETUP.md`](SETUP.md) for the full step-by-step: clone, prerequisites,
`mise run setup`, `mise run doctor-local`, first command, optional cloud setup.**

Three steps, all local — no cloud credentials required:

```bash
curl https://mise.run | sh   # one-time, if you don't have mise yet — see SETUP.md
mise run setup          # 1. toolchain + daemon (one time, ~5-10m)
ge init                 # 2. discover config, write .ge.json (~30s)
ge devex smoke          # 3. first canary agent: doctor → validated workspace (~5 min)
```

Then: build agents, watch them run live, ship to the cloud. `mise run console`
opens the operator UI (Overview · Pipeline · Interview · Fleet · Repair Queue ·
Runs · Readiness) → http://localhost:18260.

Run `mise run help` for all targets, or `mise run next` for a status-based recommendation.

## Deploy to your own GCP project

The control plane lands in **your own** GCP project (single-tenant), ~15 min:

- Click **Open in Cloud Shell** above to clone the repo and run the guided installer
  ([`installer/TUTORIAL.md`](installer/TUTORIAL.md)).
- Or, from a checkout with `gcloud` authenticated:

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  CANARY=1 mise run bootstrap   # toolchain → ge init → ge up (factory + data + tool planes) → prove one agent
  ```

## Local vs remote mode

The factory has two first-class modes, set once with `ge mode local|remote` (persisted in
`.ge.json`; default `remote`, overridable per command with `--local`/`--remote`). Both share
the same generated workspace and quality gates; they differ in **where work runs**. There is a
hard build boundary: everything up to validate/preview is pure computation; everything after
touches GCP.

<p align="center">
  <img src="docs/assets/diagrams/factory-line.svg" alt="Author and Build, Validate and Refine, Release, with the build boundary between them" width="620">
</p>

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
| [`apps/console`](apps/console) | The main operator UI — a React + Vite + Tailwind app whose Bun server exposes `/api/ge/*` (the same JSON the CLI emits). Views: Overview · Pipeline · Interview · Fleet · Repair Queue · Runs · Readiness, plus Agent detail (stage pipeline + live logs + artifacts). The **third surface** over `factory-core`. |
| [`apps/presentation`](apps/presentation) | The transformation deck and source use-case catalog used to explain the system. |
| [`apps/factory`](apps/factory) | The generator: the `factory` generation pipeline, the lower-level web workbench, the factory runner/worker, and the generic multi-tenant FastMCP server under [`mcp-service/`](apps/factory/mcp-service). |
| [`tools/`](tools) | The `ge` operator CLI (`ge.mjs`), the MCP server (`mcp-server.mjs`), and the shared operator core + runtime [daemon](docs/GLOSSARY.md#daemon) (the local background process that runs long factory tasks durably) under `tools/lib/`. |
| [`installer/`](installer) | Terraform + the guided Cloud Shell installer (`TUTORIAL.md`) that stands the platform up in your project. |
| [`docs/`](docs) | This documentation site (GitHub Pages) plus operator runbooks, ADRs, and design specs. |

### Running an app locally

`mise run dev` (or `bun run dev`) just lists the apps and starts nothing — pick one:

| App | Dev (hot reload) | Build | Serve the build |
|-----|------------------|-------|-----------------|
| Console — ops UI (:18260) | `mise run console` · `bun run dev:console` | `bun run build:console` | `bun run start:console` (:8261) |
| Presentation — deck (:18250) | `mise run presentation` · `bun run dev:presentation` | `bun run build:presentation` | `bun run start:presentation` (:8251) |
| Generator — web (:17655) | `mise run generator` · `bun run dev:generator` | — | — |

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
ge pipeline run --scenario <id>   # orchestrate the end-to-end pipeline (plan|status|resume|graph)
ge fleet status        # fleet convergence; ge fleet repair --ids <a,b> fixes blockers in bulk
ge runs list           # every daemon-backed run; ge runs events <id> --follow streams one live
```

Run via `bun tools/ge.mjs <cmd>`, or install it on your PATH with `mise run setup` (then just `ge`).

## Develop

```bash
bun install            # install workspace deps
mise run devex-check       # fast local gate before or after a focused edit
mise run ci                # the CI gate: source hygiene + full bun test suite (mirrors CI)
bun test apps tools    # run the test suite directly
```

## More

- Operator runbook: [`docs/OPERATIONS.md`](docs/OPERATIONS.md)
- Design specs: [`docs/design-specs/specs/`](docs/design-specs/specs)
- CLI internals: [`tools/README.md`](tools/README.md)
