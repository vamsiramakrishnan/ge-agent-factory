# Contributing to GE Agent Factory

Thanks for working on the factory. This guide covers local setup, the repo layout,
the checks to run before a PR, and the conventions for the parts of the repo that
have their own rules (skills, specs/OKF, simulators).

If you just want to *use* the factory, start with the [README](README.md) and the
[docs site](https://vamsiramakrishnan.github.io/ge-agent-factory/). This document is
for people changing the code.

---

## Prerequisites + setup

The toolchain is **[Bun](https://bun.sh)** (JS workspace + test runner),
**[uv](https://docs.astral.sh/uv/)** (Python venv + tools), and a **Python 3.11**
interpreter for the MCP service. `gcloud` and `terraform` are only needed for cloud
ops (`ge up` / deploy); local development needs neither.

One-command setup:

```bash
mise run setup          # bun install, sync the catalog + skills, install the `ge` command, start the daemon
mise run doctor-local   # verify the local toolchain: Bun, uv, Python, agents-cli, shared cache, harness wiring
```

`mise run setup` runs, in order: `bun install` → `mise run catalog` → `mise run deps` →
`mise run install` (puts `ge` on your `PATH` at `~/.local/bin/ge`) → `mise run skills-sync` →
starts the daemon. If you only want the language toolchains, `mise run deps` installs
`uv`, the pinned `google-agents-cli`, the repo `.venv` with the `google-antigravity`
SDK, the Snowfakery data runtime, and `terraform`.

### Python / pytest

The MCP service lives at `apps/factory/mcp-service` and is a standard
`pyproject.toml` project (`requires-python >= 3.11`; pytest is in the `dev` extra).
The repo's test scripts invoke pytest as **`python3 -m pytest`** — so they use
whatever `python3` resolves to on your `PATH`, and that interpreter must have pytest
installed.

> The repo `.venv` (created by `mise run deps` for the `google-antigravity`
> SDK) does **not** include pytest, so a bare `python3 -m pytest` will fail with
> `No module named pytest` if `.venv` is first on your `PATH`. Either install the dev
> deps into the interpreter you run tests with —
> `python3 -m pip install -e 'apps/factory/mcp-service[dev]'` (or
> `uv pip install -e '…[dev]'`) — or run pytest from an interpreter that already has
> it (on the maintainer's machine that is the Anaconda Python, not `.venv`). Confirm
> with `python3 -m pytest --version` before assuming a clean run.
{: .warning }

---

## Repo layout

This is a Bun workspace monorepo (`apps/*`, `packages/*`) driven by one operator core
(`tools/lib/factory-core.mjs`) behind three surfaces: the `ge` CLI, the web console,
and an MCP server.

| Path | What it is |
|------|------------|
| [`apps/console`](apps/console) | The main operator UI (React + Vite + Tailwind). Its Bun server exposes `/api/ge/*` — the same JSON the CLI emits. See the [Console Tour](docs/reference/console-tour.md). |
| [`apps/presentation`](apps/presentation) | The transformation deck + source use-case catalog used to explain the system. |
| [`apps/factory`](apps/factory) | The generator: the `factory` pipeline, the lower-level web workbench, the factory runner/worker, and the generic FastMCP server under [`mcp-service/`](apps/factory/mcp-service). The `factory.mjs` pipeline's modules are split out under [`apps/factory/scripts/factory/`](apps/factory/scripts/factory/README.md) — see that directory's README for a map of what lives where and why. |
| [`tools/`](tools) | The `ge` operator CLI (`ge.mjs`), the MCP server (`mcp-server.mjs`), and the shared operator core + runtime daemon under `tools/lib/`. |
| [`skills/`](skills) | Cross-runtime harness skills (one dir per skill, each with a `SKILL.md`). |
| [`installer/`](installer) | Terraform + the guided Cloud Shell installer (`TUTORIAL.md`) that stands the platform up in a target project. |
| [`docs/`](docs) | The GitHub Pages documentation site plus operator runbooks, ADRs, and design specs. |
| [`packages/`](packages) | Shared workspace packages (e.g. `@ge/agent-resolver`). See [`packages/std/README.md`](packages/std/README.md) for the `@ge/std` utility catalog — check it before hand-rolling a naming/JSON/CSV/merge helper. |

---

## Running the gates (before a PR)

CI is source hygiene + typecheck + catalog + the docs gate + the gated test
suite (see [`cloudbuild.ci.yaml`](cloudbuild.ci.yaml)). Run the same gate
locally with:

```bash
mise run ci             # source:hygiene → lint → catalog → docs:gate → test:gated  (mirrors CI)
```

Or run the individual checks:

```bash
bun run source:hygiene   # repo hygiene guard (tools/source-hygiene.mjs)
bun run lint             # typecheck every workspace (tsc --noEmit, per app)
bun run docs:gate        # docs link/image/blockquote + diagram-drift + design-token checks
bun run test:gated       # bun test apps tools packages, cross-checked against
                         # tools/known-test-failures.json (see AGENTS.md)
```

For the Python MCP service (run from a `python3` that has pytest — see above):

```bash
python3 -m pytest apps/factory/mcp-service        # the MCP / simulator tests
bun run test:py                                             # same, via the package script
```

App production builds (useful when you've touched the UIs):

```bash
bun run build:console
bun run build:presentation
```

> CI typechecks with `bun run lint` because `vite build` strips types — a TS error
> can otherwise ship silently. `apps/factory` has no `lint` script, so
> `bun run lint` typechecks the console and presentation apps. The Python tests are
> **not** part of the `bun`/Cloud Build CI gate today — run them yourself when you
> touch `mcp-service` or the simulator packs.
{: .note }

---

## Branches + commits

- The repo's default branch is **`main`** (older history used `master`; PRs target
  `main`).
- The primary git remote is **`google`** — Cloud Source Repositories — with a
  **public GitHub mirror** (`github`) kept as a clean snapshot. Push to `google`.
- Use **[Conventional Commits](https://www.conventionalcommits.org/)**:
  `feat(scope): …`, `fix(scope): …`, `chore(scope): …`, etc. Recent history is the
  reference (e.g. `feat(okf): …`, `fix(agent-gateway): …`).
- Optional: `mise run install-hooks` installs a fast pre-commit hook that runs source
  hygiene before each commit (the full suite runs in `mise run ci` / CI).

---

## Skills (harness)

Skills are portable instructions a headless agent harness (Antigravity, agents-cli,
Codex, Gemini) can discover. Each skill is a directory under [`skills/`](skills) with
a `SKILL.md` carrying YAML frontmatter:

```yaml
---
name: my-skill
description: One sentence on what it does. Use when <the trigger condition>.
composes: [other-skill]   # optional — composition is first-class
---
```

By convention every `description` ends with a **"Use when …"** trigger so the harness
can route to it. After adding or editing a skill:

```bash
mise run skills-sync     # validate the repo skills + (re)write the harness skill manifest
mise run skills-doctor   # verify the manifest is current and the skills are discoverable
```

`mise run skills-install` symlinks the repo skills into a headless harness skills dir
(`AGENTS_SKILLS_DIR`, default `~/.agents/skills`). `mise run skills-spec-audit` reports
Agent Skills spec portability gaps.

---

## Authoring specs / OKF

The factory's spec is the spine of generation. Specs round-trip to **OKF (Open
Knowledge Format) v0.1**, a portable BRD exchange format, via the converters in
`apps/factory/scripts/` (`spec-to-okf.mjs` / `okf-to-spec.mjs`).

- Concept: [Specs & OKF](docs/concepts/enterprise-agent-contract.md)
- Reference: [Spec schema](docs/reference/spec-schema.md) · [OKF](docs/reference/okf.md)
- Adding a new spec field? The shape is duck-typed across ~13 consumer files —
  follow the [consumer checklist](docs/reference/spec-schema.md#adding-a-new-spec-field--the-consumer-checklist)
  so the field survives the OKF round-trip.
- Cookbook: [Spec ⇄ OKF](docs/cookbooks/spec-to-okf.md) · [Capture from an interview](docs/cookbooks/capture-from-interview.md)
- Skill: [`authoring-okf-specs`](skills/authoring-okf-specs/SKILL.md)

---

## Adding a `ge` command / console action

The console, CLI, and doctor bind mutating operator commands through one
registry (`tools/lib/ge-command-registry.mjs` — its header JSDoc is the field
contract). One entry gives a command its `/api/ge/*` route, preflight gating,
risk label, and live job streaming; don't add bespoke console route logic for
something a registry entry covers.

- Cookbook: [Add a ge command](docs/contributing/add-a-ge-command.md)
- Layer rules: [`skills/operating-console/references/api-transport-contract.md`](skills/operating-console/references/api-transport-contract.md)

---

## Adding a simulator

Generated agents are grounded by simulated source systems under
`apps/factory/simulator-systems/`. To add one:

```bash
bun run generator:new-simulator          # scaffold a new simulator pack
bun run generator:validate-simulators    # validate the pack (schema/tools/workflows)
bun run generator:materialize-simulators # materialize seed data
bun run generator:test-simulators        # python3 -m pytest simulator conformance
```

There is also a **Bring Your Own System** flow that synthesizes a brand-new live
simulator from a natural-language description (NL / OpenAPI / samples) directly from
the console's Systems field.

- Concept: [Simulators & BYO](docs/concepts/source-system-twins.md)
- Reference: [Simulator systems](docs/reference/simulator-systems.md)
- Cookbook: [Generate simulations](docs/cookbooks/generate-simulations.md)

---

## Regenerating README assets

Every image in the root [`README.md`](README.md) rebuilds from a command —
no hand-screenshotted or hand-recorded asset is checked in.

| Asset | Source | Regenerate |
|---|---|---|
| Diagrams (`docs/assets/diagrams/*.svg`) | `docs/diagrams-src/*.mmd` | `bun run docs:diagrams` |
| Console + presentation screenshots (`docs/assets/screenshots/*.png`) | `tools/docs-shots/*.mjs` (Playwright) — see [Screenshots](docs/DESIGN.md#screenshots) | `bun run docs:shots` |
| Terminal captures (`docs/assets/tapes/*.gif`) | `docs/tapes/*.tape` ([vhs](https://github.com/charmbracelet/vhs)) | `bun run readme:tapes` |

`bun run readme:assets` runs all three. `docs:shots` is fully self-contained
(builds its own throwaway seed state and production servers — see
[docs/DESIGN.md](docs/DESIGN.md#screenshots)). vhs needs a one-time local
setup beyond what `mise run setup` installs:

- [`ttyd`](https://github.com/tsl0922/ttyd) and `ffmpeg` on PATH
  (`apt-get install ttyd ffmpeg` or your platform's equivalent), plus the
  `vhs` binary itself (`go install github.com/charmbracelet/vhs@latest`).
- Recording as root needs `VHS_NO_SANDBOX=true` (Chromium's sandbox refuses
  to start as root).

## More

- Docs site: <https://vamsiramakrishnan.github.io/ge-agent-factory/>
- Cookbooks: [docs/cookbooks/](docs/cookbooks/)
- Console Tour: [docs/console/index.md](docs/console/index.md)
- Operator runbook: [docs/OPERATIONS.md](docs/OPERATIONS.md)
- CLI internals: [tools/README.md](tools/README.md)
- Docs design system (theme, diagrams, callouts): [docs/DESIGN.md](docs/DESIGN.md)
