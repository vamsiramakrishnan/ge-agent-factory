# tools/

Operator tooling for the GE Agent Factory.

> First time setting up? See [`SETUP.md`](../SETUP.md) at the repo root for
> the step-by-step (clone → prerequisites → `mise run setup` → `mise run doctor-local`
> → first command → optional cloud setup). This doc is a command reference,
> not a setup walkthrough.

## `ge` — the CLI (canonical)

`bun tools/ge.mjs <command>`. Built on [citty]; every command supports `--json`
(structured result → stdout, progress → stderr) so it's scriptable.

Commands are grouped by noun; bare `ge` prints a status board (mode · planes · next
command). Legacy flat verbs and wrapper scripts have been removed so every
operator path uses the same command contract.

**Lifecycle / cross-cutting**

| Command | What it does |
|---|---|
| `ge` | Status board: mode, project/app, planes ✓/○, next command |
| `mode [local\|remote]` | Show/set the operating mode (persisted in `.ge.json`, default remote) |
| `init` | Discover config (terraform outputs → gcloud) → `.ge.json` |
| `up [--infra\|--data\|--mcp]` | Stand up the platform (all planes) → unified doctor |
| `doctor [--local\|--cloud\|--data\|--mcp]` | One report: toolchain · factory · data plane · tool plane (mode-aware default) |
| `state paths` / `state reset --yes` | Inspect or clear canonical local `.ge/` state |
| `cutover [--apply]` | Adopt a hand-managed project into Terraform (plan by default) |

**Noun groups**

| Command | What it does |
|---|---|
| `infra <init\|plan\|apply\|output\|destroy>` | Drive the Terraform module (vars from config) |
| `images build [builder]` / `images deploy [gateway\|worker\|all]` | Build / deploy the gateway+worker images |
| `data up` / `data doctor` | Provision + check the shared data stores |
| `data synth --system <id> [--seed N] [--profile realistic]` | Deterministic seed data for a simulator twin (`@ge/synthkit`; local, no cloud) |
| `evals compile [--max-cases N]` | Compile the behavioral eval suite from a captured contract (`@ge/evalkit`) → `.ge/behavioral/` |
| `mcp deploy` / `mcp doctor` | Deploy + check the per-department custom MCP services |
| `agents build --canary\|--all\|--dept <d>\|--ids <a,b>` | Build agents in the active mode (`--local`/`--remote` override) |
| `agents status [--watch]` | Poll runs → stage tally + per-run status |
| `agents logs <runId> [--stage S] [--item ws-…]` | Pretty-print a stage's result + errors |
| `agents sync [--ids <a,b>] [--local] [--remote <git-url>] [--push] [--force] [--no-commit]` | Generated agent code → `generated-agents/` or a dedicated git repo |

**Local state.** Active local persistence is under `.ge/`:
`.ge/runtime` for daemon tasks, `.ge/pipelines` for scenario/data/simulator
artifacts, `.ge/interviews` for generated specs, `.ge/factory/workspaces` for
local agent workspaces, `.ge/skills` for the harness skill manifest, `.ge/cache`
for shared caches, and `.ge/console` for console job records. Legacy roots are
cleanup-only; use `ge state reset --yes` to clear local generated state.

**Code sync.** In local mode, `agents sync` copies selected workspaces from
`.ge/factory/workspaces/<id>` into either this repo's `generated-agents/<id>` or
an external repo (`--remote <git-url>`). The console Fleet and Agent Detail
pages call the same command path with explicit selected ids.

Config precedence: **flag > env > `.ge.json` > default** (defined once in
`lib/config-schema.mjs`; `init` seeds `.ge.json` from terraform outputs / gcloud).
Run `ge config explain` to see the resolved value and source of each field. See
[../docs/OPERATIONS.md](../docs/OPERATIONS.md) for the local/remote modes + the
build-boundary capability matrix.

## Architecture: one core, three surfaces

- **`lib/factory-core.mjs`** — the engine. Pure-ish operations that return
  structured data and take a `log()` callback; no direct printing; throw on
  error.
- **`ge.mjs`** — human surface (citty + picocolors, or `--json`).
- **`mcp-server.mjs`** — machine surface: MCP tools over stdio for
  models/harnesses (see [../docs/MCP.md](../docs/MCP.md)). Registered in
  `../.mcp.json`.
- **`apps/console`** — web ops console driving `factory-core` via `/api/ge/*`
  endpoints. See [../docs/OPERATIONS.md](../docs/OPERATIONS.md) § Console.
- **`lib/gcp.mjs`** — shared `idTokenFor` + `pool`.

## Other Helpers

- `setup-harness.mjs` — install the local agents-cli harness.
- `build-batch.mjs` — catalog/plan helper used by the unified agents pipeline.

[citty]: https://github.com/unjs/citty
