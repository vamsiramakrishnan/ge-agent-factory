# GE Agent Factory

**GE Agent Factory compiles enterprise workflows into governed agent
contracts, source-system simulations, eval suites, tool plans, and proof
packs. It does not replace agents-cli, ADK, or Gemini Enterprise; it produces
the upstream contract and proof artifacts they need.**

It occupies exactly one layer:

> capture enterprise intent → compile an **Enterprise Agent Contract** →
> generate **simulations / evals / tools / proof** → hand off to
> **agents-cli / ADK / Gemini Enterprise**.

Every workspace the factory emits is a real, standard ADK Python project —
generated from a versioned contract, exercised against simulated source
systems, scored by generated evals, and blocked from release by a promotion
gate until the proof passes. What reaches `agents-cli` and your Google Cloud
project (single-tenant, always your own) is code you can trace back, line by
line, to a contract a business owner signed off on.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/?cloudshell_git_repo=https://github.com/vamsiramakrishnan/ge-agent-factory&cloudshell_workspace=installer&cloudshell_tutorial=installer/TUTORIAL.md)

## The layer, at a glance

| Layer | Owned by |
|---|---|
| Intent → contract → simulations → evals → proof | **GE Agent Factory** (this repo) |
| Agent project scaffold, build, deploy | **agents-cli / ADK** (generated and driven by the factory) |
| Runtime | **ADK Agent Engine** |
| End-user surface | **Gemini Enterprise** |

Not sure this is the layer you need? Read
[GE Agent Factory vs agents-cli](https://vamsiramakrishnan.github.io/ge-agent-factory/start/vs-agents-cli/).

## Quickstart (runs today, all local)

No cloud credentials required; ~10 minutes end to end:

```bash
curl https://mise.run | sh   # once, if you don't have mise — see SETUP.md
mise run setup               # toolchain + the `ge` CLI on PATH (~5-10 min, one time)
ge init                      # discover config, write .ge.json (~30 s)
ge devex smoke               # compile + prove one canary agent workspace (~5 min)
```

The result on disk is the whole layer in miniature: the contract
(`usecase-spec.json` with its `behaviorContract`), generated ADK code and
tools, fixture data, smoke tests, an eval suite in `agents-cli`'s own
format, and the artifacts the promotion gate reads. Then:

```bash
ge mode local
ge agents build --canary     # compile one contract → validated workspace (build boundary)
mise run console             # watch runs live in the operator console → http://localhost:18260
ge agents ship               # hand off: cloud runs load_data → deploy → register → publish
```

**→ Full setup path: [`SETUP.md`](SETUP.md). Ten-minute tutorial:
[contract to handoff](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/).**

## Roadmap: the golden path

The layer's three verbs will eventually be three commands:

```bash
ge capture "Benefits enrollment agent"   # roadmap — not implemented yet
ge prove                                 # roadmap — not implemented yet
ge handoff agents-cli                    # roadmap — not implemented yet
```

**None of these exist today.** Their current equivalents, all real:

| Golden-path verb | Runs today |
|---|---|
| `ge capture` | the console **Interview** (`mise run console`) — conversational capture, document grounding, contract editing |
| `ge prove` | `ge devex smoke` / `ge agents build` (evals + spec-to-code trace + harness verdicts + promotion gate) |
| `ge handoff` | `ge agents ship` (→ `agents-cli deploy` → Agent Engine → Gemini Enterprise) |

## 📚 Documentation

Published docs site (search, sidebar, dark mode):
**→ https://vamsiramakrishnan.github.io/ge-agent-factory/**

- **[Start Here](https://vamsiramakrishnan.github.io/ge-agent-factory/start/what-is-the-factory/)** — what the factory is, the mental model, the ten-minute tutorial, vs agents-cli.
- **[Core Concepts](https://vamsiramakrishnan.github.io/ge-agent-factory/concepts/)** — the Enterprise Agent Contract, the Authority Graph, source-system twins, evals as proof, the passport & proof pack, handoff targets.
- **[Guides](https://vamsiramakrishnan.github.io/ge-agent-factory/cookbooks/)** — capture → compile → simulate → prove → hand off, task by task.
- **[Console](https://vamsiramakrishnan.github.io/ge-agent-factory/console/)** — the operator UI, view by view.
- **[Operations](https://vamsiramakrishnan.github.io/ge-agent-factory/operations/)** — provision, run, observe, troubleshoot.
- **[Reference](https://vamsiramakrishnan.github.io/ge-agent-factory/reference/)** — CLI (generated from the command tree), contract schema (generated from the zod source), console APIs, config, architecture.
- **[Contributor Docs](https://vamsiramakrishnan.github.io/ge-agent-factory/contributing/)** — developer guide, extending the CLI/console, docs rules.

The site is sourced from [`docs/`](docs/) (start at [`docs/index.md`](docs/index.md)).
Unfamiliar term? The [Glossary](docs/GLOSSARY.md) translates the internal
jargon (harness, OKF, canary, planes, pipeline, …).

## Local vs remote: the build boundary

Everything up to *proof* is pure computation on your machine; everything
after touches your Google Cloud project. The mode switch (`ge mode
local|remote`, default **local** — billable work is opt-in) selects the
side; `ge agents ship` bridges them by handing a locally proven workspace to
the cloud for the release stages only.

<p align="center">
  <img src="docs/assets/diagrams/factory-line.svg" alt="Author and Build, Validate and Refine, Release, with the build boundary between them" width="620">
</p>

| Mode | What runs here | Use it for |
|------|----------------|------------|
| **Local** | compile → validate → prove, against source-system twins | the everyday loop: fast, offline, credential-free |
| **Remote** | the cloud factory builds → deploys → publishes in your GCP project | release: per-agent data, Agent Runtime, tool registry, Gemini Enterprise |

## Deploy the platform to your own GCP project

Single-tenant, ~15 min: click **Open in Cloud Shell** above for the guided
installer ([`installer/TUTORIAL.md`](installer/TUTORIAL.md)), or from an
authenticated checkout:

```bash
export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
CANARY=1 mise run bootstrap   # toolchain → ge init → ge up (all three planes) → prove one agent
```

## Monorepo layout

A Bun workspace monorepo driven by one operator core
(`tools/lib/factory-core.mjs`) behind three surfaces — the `ge` CLI, the web
console, and an MCP server — that share a single command registry and can
never disagree.

| Path | What it is |
|------|------------|
| [`apps/console`](apps/console) | The operator UI (React + Vite): Overview · Pipeline · Interview · Fleet · Repair Queue · Runs · Readiness, plus Agent detail and Spec Review. |
| [`apps/factory`](apps/factory) | The generator: the `factory` pipeline that compiles contracts into workspaces, the simulator runtime, and the multi-tenant FastMCP service. |
| [`apps/presentation`](apps/presentation) | The transformation deck and source use-case catalog. |
| [`apps/docs`](apps/docs) | The Astro/Starlight docs site (content sourced from `docs/`). |
| [`tools/`](tools) | The `ge` CLI, the MCP server, and the shared operator core + local runtime daemon under `tools/lib/`. |
| [`packages/`](packages) | Shared contracts: the agent-spec (contract) schema, the run ledger, OKF, design tokens. |
| [`installer/`](installer) | Terraform + the guided Cloud Shell installer. |
| [`docs/`](docs) | Documentation source (rendered by `apps/docs`), plus runbooks, ADRs, and design specs. |

## The `ge` CLI

Bare `ge` prints a status board with the next step; every command supports
`--json` and is also an HTTP route (console) and an MCP tool — one registry,
three surfaces.

```bash
ge                     # status board: mode · planes ✓/○ · next step
ge init                # discover config → .ge.json
ge devex smoke         # one-command local proof: doctor → validated canary workspace
ge agents build --canary
ge agents ship --ids <workspace-id>
ge agents status --watch
ge pipeline run --scenario <id>   # orchestrate the end-to-end pipeline
ge fleet status        # fleet convergence; ge fleet repair --ids <a,b> fixes blockers in bulk
ge runs list           # every recorded run; ge runs events <id> --follow streams one live
ge doctor              # health with runnable fixes (console: Readiness)
```

Full reference (generated from the command tree, drift-gated in CI):
[CLI reference](https://vamsiramakrishnan.github.io/ge-agent-factory/reference/cli/).

## Develop

```bash
bun install                # workspace deps
mise run devex-check       # fast local gate
mise run ci                # the CI gate: hygiene + lint + typecheck + docs gate + tests
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md), the
[Contributor Docs](https://vamsiramakrishnan.github.io/ge-agent-factory/contributing/),
and [`docs/OPERATIONS.md`](docs/OPERATIONS.md) for the operator runbook.
