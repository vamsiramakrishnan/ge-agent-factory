# Setup

The canonical, step-by-step path from a fresh clone to a working local
factory. This is the one place setup steps are written out in full — other
docs (`README.md`, `docs/cookbooks/getting-started.md`, `tools/README.md`)
link back here instead of repeating the steps.

## 1. Clone

```bash
git clone https://github.com/vamsiramakrishnan/ge-agent-factory
cd ge-agent-factory
```

## 2. Prerequisites

- **[Bun](https://bun.sh)** — required. `mise run setup` checks for it first and
  exits with an error if it's missing:

  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- **Optional, for cloud ops later:** `gcloud` (Google Cloud CLI). Not required
  for local mode — `mise run setup`/`mise run deps` will print a warning (not an
  error) if it's missing, since it's only needed for `up`/`data`/`mcp`/
  `provision` against a real GCP project.

Everything else (`uv`, `google-agents-cli`, a repo-local `.venv` with the
`google-antigravity` SDK, the Snowfakery data runtime, Terraform) is installed
by `mise run setup` itself — you don't need to install these by hand.

## 3. `mise run setup`

```bash
mise run setup
```

This one command:

1. Guards on Bun being present (fails fast with a clear message if not).
2. Runs `bun install` (JS/TS workspace deps).
3. Generates the use-case catalog build artifact.
4. Installs the local toolchain (`mise run deps`): `uv`, `google-agents-cli`, a
   repo `.venv` with the `google-antigravity` SDK, the Snowfakery data
   runtime, and Terraform.
5. Installs the `ge` command into `~/.local/bin` (`mise run install`).
6. Syncs the harness skills manifest.
7. Starts the background daemon.

### `~/.local/bin` on your PATH

`mise run install` (run as part of `mise run setup`) puts the `ge` command at
`~/.local/bin/ge`. If `~/.local/bin` is not already on your `PATH`, setup
prints a boxed warning with the exact line to add — it will **not** edit your
shell profile for you. Add it yourself, e.g. to `~/.bashrc` or `~/.zshrc`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then restart your shell (or `source ~/.bashrc`). Until then, you can always
invoke the CLI directly with `bun tools/ge.mjs <command>`.

## 4. Env vars (optional for local mode)

Local mode (steps 1–3) runs with no env file at all. Once you need a GCP
project (cloud ops, `ge doctor`'s env check, or either app's own auth/config
knobs), copy the templates:

```bash
cp .env.example .env                                # shared: GCP project, etc.
cp apps/console/.env.example apps/console/.env       # only if running the console
cp apps/presentation/.env.example apps/presentation/.env  # only if running the deck
```

The root `.env` covers vars shared across the CLI and both apps (Bun
auto-loads it from the repo root); each app's own `.env` covers that app's
specific knobs (provisioning flags, Firebase auth, Vite build-time config).
See the comments in each file — most vars are optional with sane defaults.

## 5. `mise run doctor-local`

```bash
mise run doctor-local
```

This is `ge doctor --local` under the hood. It checks:

- Bun presence + version
- `uv` presence
- Python 3.11 availability
- `agents-cli` presence
- the `google-antigravity` SDK importability
- the shared `uv` cache + link mode
- the harness skills manifest
- the local workspace registry
- generated OpenAPI files excluded from git
- whether `~/.local/bin` is on `PATH`
- whether root workspace deps are installed (`node_modules` present)
- whether `GOOGLE_CLOUD_PROJECT` resolves (env, or `gcloud config get-value project`)

All checks follow the same pass/warn/fail pattern; failures print a `fix:`
line with the exact command to resolve them.

For narrower, scoped checks, use `ge data doctor` (data plane only) or
`ge mcp doctor` (tool plane / MCP services only) instead of the unified
`ge doctor`.

## 6. First command

Open the operator console (Pipeline / specs / Fleet / Activity / Doctor UI):

```bash
mise run console          # → http://localhost:18260
```

Or build one agent locally, up to the preview/build boundary:

```bash
mise run mode-local
CANARY=1 mise run provision-local
```

Or run the fast DevEx gate / one-command local proof:

```bash
mise run devex-check      # local doctor + docs links + workspace manifest contracts
mise run devex-smoke      # doctor → local mode → one validated canary workspace
```

## 7. (Optional) Cloud setup

Local mode (steps 1–6) needs no cloud credentials. To deploy the control
plane into **your own** GCP project (single-tenant, ~15 min):

- Click **Open in Cloud Shell** from the root `README.md` to clone the repo
  and run the guided installer ([`installer/TUTORIAL.md`](installer/TUTORIAL.md)).
- Or, from a checkout with `gcloud` authenticated:

  ```bash
  export GEMINI_ENTERPRISE_APP_ID=projects/<num>/locations/global/collections/default_collection/engines/<app>
  CANARY=1 mise run bootstrap   # toolchain → ge init → ge up (factory + data + tool planes) → prove one agent
  ```

## Troubleshoot

- **`✗ Bun is required...`** from `mise run setup` — install Bun first (step 2);
  setup cannot run without it.
- **`google.antigravity NOT importable`** during `mise run deps` — local
  (Antigravity) mode will fail. Re-run `mise run deps`; it installs
  `google-antigravity` into `.venv`.
- **`ge: command not found`** — `~/.local/bin` is not on `PATH`. Add the
  `export PATH=...` line printed by `mise run install` (see step 3), or run via
  `bun tools/ge.mjs ...` in the meantime.
- **Mock/simulator data pauses** — `mise run data-runtime` warms the Snowfakery
  runtime; it needs network/cache the first time.
- **Status board / next step** — run `mise run next` or bare `ge` for a
  status-based recommendation.

## More

- Full docs site: https://vamsiramakrishnan.github.io/ge-agent-factory/
- `ge` CLI command reference: [`tools/README.md`](tools/README.md)
- Operator runbook: [`docs/OPERATIONS.md`](docs/OPERATIONS.md)
- Getting-started cookbook (local vs remote mode deep dive):
  [`docs/cookbooks/getting-started.md`](docs/cookbooks/getting-started.md)
