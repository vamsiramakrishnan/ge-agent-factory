---
title: Set up locally
nav_order: 3
layout: default
description: Local setup, the local/remote mode switch, and the fast checks that prove the repo works on your machine — no cloud project required.
---

# Set up locally

**Scope:** local-only — no cloud project or credentials required.

## Goal

Get a working local factory: understand the difference between **local** and
**remote** mode, and see how the fast DevEx gate and one-command smoke proof
fit into the loop — all without touching a cloud project.

Unfamiliar term? See the [Glossary](../GLOSSARY.html) — plain-language
translations of the jargon (harness, OKF, canary, planes, pipeline runs, …).

## Prerequisites + install

**→ For the full step-by-step (clone, prerequisites, `mise run setup`,
`mise run doctor-local`, first command, optional cloud setup), see
[`SETUP.md`](../../SETUP.md) at the repo root.** The short version:

```bash
mise run setup          # install deps, sync catalog/skills, install the `ge` command, start the daemon
mise run doctor-local    # check local tools: Bun, uv, Python, agents-cli, cache, harness wiring
mise run console         # open the operator UI → http://localhost:18260
```

## Steps

1. **Run the fast DevEx gate.**

   ```bash
   mise run devex-check
   ```

   This is `ge devex check`: local doctor, GitHub Pages link check, and generated
   workspace manifest contract validation in one fast command.

2. **Prove one local workspace end to end.**

   ```bash
   mise run devex-smoke
   ```

   This runs local readiness, sets local mode, builds one
   **[canary](../GLOSSARY.html#canary)** workspace
   (a single throwaway agent used to prove the pipeline works, as opposed to
   building the whole catalog) to the `validated` stage, and prints the
   workspace path, `workspace.json`, eval config, and next commands. It is the
   fastest proof that the repo is usable on this machine.

3. **Understand which mode you're in.**

   <p align="center">
     <img src="../assets/diagrams/factory-line.svg" alt="The factory line's three phases: Author and Build, then Validate and Refine (ending at preview, the build boundary), then Release — only the Release phase touches your GCP project" width="700">
   </p>

   ```bash
   ge mode
   ```

   - `ge mode` with no argument **reports** the active mode (defaults to
     `local` when unset — remote, billable work is opt-in).
   - `ge mode local` — this machine runs *generate → validate* up to the
     **build boundary** (the `previewed` stage — the last stage that runs with
     no cloud credentials; everything after it touches your Google Cloud
     project); deploy/register/publish are cloud-only steps.
   - `ge mode remote` — this machine submits + observes; the cloud factory
     builds, deploys, and publishes.

   `mise.toml` also exposes `mise run mode-local` and `mise run mode-remote` as
   thin wrappers.

   > The mode defaults to `local` when unset, so a fresh clone with no cloud
   > project never reaches Google Cloud by accident. Run `ge mode` anytime to
   > confirm which mode you're in.
   {: .note }

4. **(Optional) Build one agent locally to the preview boundary.**

   ```bash
   mise run mode-local && CANARY=1 mise run provision-local
   ```

   `CANARY=1 mise run provision-local` is `ge agents build --local --canary` — it
   builds a single agent on this machine up to the `previewed` build boundary.

## Verify

```bash
mise run doctor-local      # local toolchain section is all green
mise run devex-check       # local doctor + docs links + workspace manifest contracts
mise run devex-smoke       # validates one canary workspace and prints workspace.json
ge mode                # prints: mode: local (or remote)
ge state paths         # shows where state lands (.ge/...)
```

The console should load at http://localhost:18260 and show the Readiness view.

## Next step

- Run the whole path once: the [ten-minute tutorial](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/).
- Capture your own use case: [Capture from an interview](../cookbooks/capture-from-interview.html).
- Compile a contract into an agent workspace: [Compile a contract](../cookbooks/compile-a-contract.html).

## Troubleshoot

See [`SETUP.md`](../../SETUP.md#troubleshoot) for install-time issues (missing
Bun, `~/.local/bin` not on PATH, `google.antigravity` not importable). Specific
to this cookbook's loop:

Real output from running the DevEx gate on a clean clone, before `mise run
setup` has installed `agents-cli`/Antigravity/skills — this is what "not
ready yet" looks like, and every line names its own fix:

```text title="bun tools/ge.mjs devex check" {3,6,9}
DevEx Check
  failed

  Local Doctor
  ✗ agents-cli                     not found
      fix: uv tool install google-agents-cli
  ✗ google-antigravity SDK         not importable (python3)
      fix: mise run deps  (creates .venv via uv + installs the SDK)
  ✗ harness skills manifest        .ge/skills/manifest.json missing or empty
      fix: mise run skills-sync
  ▲ GOOGLE_CLOUD_PROJECT           not set — required for cloud ops (provision/up/data/mcp) and both apps' read paths
      fix: cp .env.example .env  then set GOOGLE_CLOUD_PROJECT=<your-project-id>  (or: gcloud config set project <id>)

  Docs
  ✓ 99 markdown files checked

  Workspace Contracts
  checked 0 · failed 0 · warnings 0

  Next
  $ mise run setup
```

`mise run setup` runs exactly the three fixes above in order — this is why
step 1 of "Prerequisites + install" is a single command instead of three.

- **Mock/simulator data pauses** — `mise run data-runtime` warms the Snowfakery
  runtime; it needs network/cache the first time.
- **Status board / next step** — run `mise run next` or bare `ge` for a status-based
  recommendation.
