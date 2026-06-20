---
title: Getting started locally
parent: Cookbooks
nav_order: 1
layout: default
---

# Getting started locally

## Goal

Install the local toolchain, put the `ge` command on your PATH, open the operator
console, and understand the difference between **local** and **remote** mode — all
without touching a cloud project.

## Prerequisites

- A clone of the repo (you are at the repo root).
- [Bun](https://bun.sh) available (the `Makefile` calls `bun install` and
  `bun tools/ge.mjs`). `make setup` installs the rest (uv, agents-cli,
  Antigravity SDK into `.venv`).
- Optional for cloud ops later: `gcloud`. Not required for local mode.

## Steps

1. **Install everything in one shot.**

   ```bash
   make setup
   ```

   This runs `bun install`, generates the use-case catalog, installs the local
   toolchain (`make deps`: uv, `google-agents-cli`, a repo `.venv` with the
   `google-antigravity` SDK, the Snowfakery data runtime, terraform), installs
   the `ge` command into `~/.local/bin`, syncs the harness skills, and starts the
   daemon.

   > If `~/.local/bin` is not on your PATH, `make setup` prints the `export PATH=...`
   > line to add.

2. **Check your local tools are healthy.**

   ```bash
   make doctor-local
   ```

   This is `ge doctor --local` under the hood — it checks the uv toolchain,
   Python 3.11, `agents-cli`, the shared cache, and harness wiring.

3. **Open the console (the main operator UI).**

   ```bash
   make console
   ```

   Serves the Pipeline / specs / Fleet / Activity / Doctor UI at
   **http://localhost:18260**.

4. **Understand which mode you're in.**

   ```bash
   ge mode
   ```

   - `ge mode` with no argument **reports** the active mode (defaults to
     `remote` when unset).
   - `ge mode local` — this machine runs *generate → validate* up to the build
     boundary; deploy/register/publish are cloud-only steps.
   - `ge mode remote` — this machine submits + observes; the cloud factory
     builds, deploys, and publishes.

   The `Makefile` also exposes `make mode-local` and `make mode-remote` as
   thin wrappers.

5. **(Optional) Build one agent locally to confirm the pipeline runs.**

   ```bash
   make mode-local && make provision-local CANARY=1
   ```

   `make provision-local CANARY=1` is `ge agents build --local --canary` — it
   builds a single agent on this machine up to the `previewed` build boundary.

## Verify

```bash
make doctor-local      # local toolchain section is all green
ge mode                # prints: mode: local (or remote)
ge state paths         # shows where state lands (.ge/...)
```

The console should load at http://localhost:18260 and show the Doctor tab.

## Troubleshoot

- **`bun: command not found`** — install Bun first; `make setup` cannot run without it.
- **`google.antigravity NOT importable`** during `make deps` — local (Antigravity)
  mode will fail. Re-run `make deps`; it installs `google-antigravity` into `.venv`.
- **`ge: command not found`** — `~/.local/bin` is not on PATH. Add the `export PATH=...`
  line that `make install` printed, or run via `bun tools/ge.mjs ...`.
- **Mock/simulator data pauses** — `make data-runtime` warms the Snowfakery
  runtime; it needs network/cache the first time.
- **Status board / next step** — run `make next` or bare `ge` for a status-based
  recommendation.
