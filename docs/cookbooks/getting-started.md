---
title: Getting started locally
parent: Cookbooks
nav_order: 1
layout: default
---

# Getting started locally

## Goal

Understand the difference between **local** and **remote** mode, and see how
the fast DevEx gate and one-command smoke proof fit into the loop — all
without touching a cloud project.

## Prerequisites + install

**→ For the full step-by-step (clone, prerequisites, `make setup`,
`make doctor-local`, first command, optional cloud setup), see
[`SETUP.md`](../../SETUP.md) at the repo root.** The short version:

```bash
make setup          # install deps, sync catalog/skills, install the `ge` command, start the daemon
make doctor-local    # check local tools: Bun, uv, Python, agents-cli, cache, harness wiring
make console         # open the operator UI → http://localhost:18260
```

## Steps

1. **Run the fast DevEx gate.**

   ```bash
   make devex-check
   ```

   This is `ge devex check`: local doctor, GitHub Pages link check, and generated
   workspace manifest contract validation in one fast command.

2. **Prove one local workspace end to end.**

   ```bash
   make devex-smoke
   ```

   This runs local readiness, sets local mode, builds one canary workspace to the
   `validated` stage, and prints the workspace path, `workspace.json`, eval
   config, and next commands. It is the fastest proof that the repo is usable on
   this machine.

3. **Understand which mode you're in.**

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

4. **(Optional) Build one agent locally to the preview boundary.**

   ```bash
   make mode-local && make provision-local CANARY=1
   ```

   `make provision-local CANARY=1` is `ge agents build --local --canary` — it
   builds a single agent on this machine up to the `previewed` build boundary.

## Verify

```bash
make doctor-local      # local toolchain section is all green
make devex-check       # local doctor + docs links + workspace manifest contracts
make devex-smoke       # validates one canary workspace and prints workspace.json
ge mode                # prints: mode: local (or remote)
ge state paths         # shows where state lands (.ge/...)
```

The console should load at http://localhost:18260 and show the Doctor tab.

## Troubleshoot

See [`SETUP.md`](../../SETUP.md#troubleshoot) for install-time issues (missing
Bun, `~/.local/bin` not on PATH, `google.antigravity` not importable). Specific
to this cookbook's loop:

- **Mock/simulator data pauses** — `make data-runtime` warms the Snowfakery
  runtime; it needs network/cache the first time.
- **Status board / next step** — run `make next` or bare `ge` for a status-based
  recommendation.
