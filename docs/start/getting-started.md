---
title: Set up locally
nav_order: 3
layout: default
description: Install the local factory and produce a validated agent workspace without a cloud project.
---

# Set up locally

**Scope:** the default proof is local-only and needs no cloud project. The
optional preview step can use Vertex; it is called out separately below.

## Goal

Install the factory and finish with one validated agent workspace. The product
path is **Capture → Prove → Handoff**: capture an Enterprise Agent Contract,
prove it on this machine, then hand the same workspace to the cloud only when
you choose. This page stops after the local proof, so no cloud project or
credentials are required.

Unfamiliar term? See the [Glossary](../GLOSSARY.html) — plain-language
translations of every internal term, the operator vocabulary included.

## Recommended: verified installer

Run the supported GitHub installer to clone the repository, provision the
toolchain, run `mise run setup`, verify the installation, and expose the
factory skills to your coding agent:

```bash
curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \
  | bun - -- --yes --skills agents  # clone, run setup, verify, and install skills
```

`--yes` tells the installer to execute the setup phases. Without it, the
installer prints the phases for review and exits without installing them.

Other surfaces use the same skill bundle:

| Surface | Setup |
| --- | --- |
| Plugin marketplace | `/plugin marketplace add vamsiramakrishnan/ge-agent-factory`, then `/plugin install factory-bootstrap@ge-agent-factory` |
| Gemini CLI | `gemini extensions install https://github.com/vamsiramakrishnan/ge-agent-factory` |
| Existing checkout | `mise run skills-install` |
| Model Context Protocol (MCP)-capable assistant | `bun tools/mcp-server.mjs` to expose the `factory_*` tools |

After setup, `ge prove` produces a standard [Google
agents-cli](https://google.github.io/agents-cli/) / Agent Development Kit
(ADK) project. The skills automate setup and operations for the layer above.

## Manual prerequisites + install

**→ For the full step-by-step (clone, prerequisites, `mise run setup`,
`mise run doctor-local`, first command, optional cloud setup), see
[`SETUP.md`](../../SETUP.md) at the repo root.** The short version:

```bash
mise run setup          # install deps, sync catalog/skills, install the `ge` command, start the local background runtime
mise run doctor-local    # check local tools: Bun, uv, Python, agents-cli, cache, build-engine wiring
mise run console         # open the operator UI → http://localhost:18260
```

## Steps

1. **Prove the included starter contract.**

   ```bash
   ge prove
   ```

   On a fresh machine this runs local readiness checks, then builds one
   starter agent to the `validated` stage and prints the workspace path,
   `workspace.json`, eval config, and next commands. It is the fastest proof
   that the repo is usable on this machine. It is pure local computation, so
   it is safe to re-run any time (`ge prove --watch` re-proves whenever a
   contract changes).

   To prove your own use case instead, run `ge capture`, finish the guided
   interview, and then run `ge prove`.

   <details>
   <summary>Under the hood</summary>

   On a fresh machine, `ge prove` (also exposed as `mise run prove`) runs
   local readiness checks, sets local mode, and builds one
   **[canary](../GLOSSARY.html#canary)** workspace (one small catalog agent
   used to prove the path, instead of building every contract) to the
   `validated` stage. Once workspaces exist, `ge prove`
   rebuilds their proof via `ge agents build`.

   The fast pre-check on its own is `mise run devex-check` (=
   `ge devex check`): local doctor, documentation link checks, and generated
   workspace manifest contract validation in one fast command.

   </details>

2. **Know where cloud work begins.**

   <p align="center">
     <img src="../assets/diagrams/factory-line.svg" alt="The factory line's three phases: Author and Build, then Validate and Refine (ending at preview, the build boundary), then Release — only the Release phase touches your GCP project" width="700">
   </p>

   The default `ge prove` stops at `validated` and needs no cloud credentials.
   The optional `previewed` stage is the **build boundary**: it still runs from
   this checkout, but its default Vertex-backed review can require a project
   and application credentials. Deploy, tool registration, and publication
   happen only after an explicit `ge handoff agents-cli` and mutate your
   Google Cloud project.

   <details>
   <summary>Operator spelling / under the hood</summary>

   The switch is the **mode**, persisted in `.ge.json`:

   - `ge mode` with no argument **reports** the active mode (defaults to
     `local` when unset — remote, billable work is opt-in).
   - `ge mode local` — this machine builds up to the `previewed` build
     boundary; deploy/register/publish are cloud-only steps.
   - `ge mode remote` — this machine submits + observes; the cloud factory
     builds, deploys, and publishes.

   `mise.toml` also exposes `mise run mode-local` and `mise run mode-remote`
   as thin wrappers.

   </details>

   > A fresh checkout builds on this machine and never hands anything to
   > Google Cloud by accident. Bare `ge` reports your current position and
   > the exact next command.
   {: .note }

3. **(Optional) Build one specific agent locally to the preview boundary.**

   ```bash
   ge prove --id <use-case-id> --target previewed
   ```

   This builds a single agent on this machine up to the `previewed` build
   boundary. Because preview uses Vertex by default, authenticate and set a
   project first. To disable Vertex-backed stages, use the lower-level command
   in the details below with `--no-vertex`.

   <details>
   <summary>Operator spelling / under the hood</summary>

   The task-runner spelling is `CANARY=1 mise run build-agents-local`, which
   is `ge agents build --local --canary` — it
   builds a single agent on this machine up to the `previewed` build
   boundary.

   To select one contract and disable Vertex-backed stages explicitly:

   ```bash
   ge agents build --local --ids <use-case-id> --target previewed --no-vertex
   ```

   </details>

## Verify

```bash
mise run doctor-local  # local toolchain section is all green
ge prove               # rebuilds the proof; green means this machine works
ge                     # status board: where you are, any blocker, the next command
ge state paths         # shows where state lands (.ge/...)
```

<details>
<summary>Operator spelling / under the hood</summary>

```bash
mise run devex-check       # local doctor + docs links + workspace manifest contracts
mise run prove             # validates one canary workspace and prints workspace.json
ge mode                    # prints: mode: local (or remote)
```

</details>

The console should load at http://localhost:18260 and show the Readiness view.

## Next step

- Capture your own use case: [Capture from an interview](../cookbooks/capture-from-interview.html).
- Run Capture → Prove → Handoff once: the [first proof tutorial](https://vamsiramakrishnan.github.io/ge-agent-factory/start/quickstart/).
- Inspect proof artifacts and gates: [Prove an agent](../cookbooks/prove-an-agent.html).

## Troubleshoot

See [`SETUP.md`](../../SETUP.md#troubleshoot) for install-time issues (missing
Bun, `~/.local/bin` not on PATH, `google.antigravity` not importable). Specific
to this guide's loop:

Run the fast read-only check when setup or a generated workspace looks wrong:

<details open>
<summary>Example: a clean checkout before setup</summary>

```bash
ge devex check
```

The check groups failures under local tools, documentation links, and
workspace contracts. Each failure includes its exact fix; on a clean checkout
the next command is normally `mise run setup`.
</details>

`mise run setup` installs dependencies, syncs the catalog and skills, puts
`ge` on `PATH`, and starts the local background runtime. Re-running it is the
fastest way to reconcile an incomplete setup.

- **Mock/simulator data pauses** — `mise run data-runtime` warms the Snowfakery
  runtime; it needs network/cache the first time.
- **Status board / next step** — run `mise run next` or bare `ge` for a status-based
  recommendation.
