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
make setup          # bun install, sync the catalog + skills, install the `ge` command, start the daemon
make doctor-local   # verify the local toolchain: Bun, uv, Python, agents-cli, shared cache, harness wiring
```

`make setup` runs, in order: `bun install` → `make catalog` → `make deps` →
`make install` (puts `ge` on your `PATH` at `~/.local/bin/ge`) → `make skills-sync` →
starts the daemon. If you only want the language toolchains, `make deps` installs
`uv`, the pinned `google-agents-cli`, the repo `.venv` with the `google-antigravity`
SDK, the Snowfakery data runtime, and `terraform`.

### Python / pytest

The MCP service lives at `apps/ge-demo-generator/mcp-service` and is a standard
`pyproject.toml` project (`requires-python >= 3.11`; pytest is in the `dev` extra).
The repo's test scripts invoke pytest as **`python3 -m pytest`** — so they use
whatever `python3` resolves to on your `PATH`, and that interpreter must have pytest
installed.

> **Note:** the repo `.venv` (created by `make deps` for the `google-antigravity`
> SDK) does **not** include pytest, so a bare `python3 -m pytest` will fail with
> `No module named pytest` if `.venv` is first on your `PATH`. Either install the dev
> deps into the interpreter you run tests with —
> `python3 -m pip install -e 'apps/ge-demo-generator/mcp-service[dev]'` (or
> `uv pip install -e '…[dev]'`) — or run pytest from an interpreter that already has
> it (on the maintainer's machine that is the Anaconda Python, not `.venv`). Confirm
> with `python3 -m pytest --version` before assuming a clean run.

---

## Repo layout

This is a Bun workspace monorepo (`apps/*`, `packages/*`) driven by one operator core
(`tools/lib/factory-core.mjs`) behind three surfaces: the `ge` CLI, the web console,
and an MCP server.

| Path | What it is |
|------|------------|
| [`apps/console`](apps/console) | The main operator UI (React + Vite + Tailwind). Its Bun server exposes `/api/ge/*` — the same JSON the CLI emits. See the [Console Tour](docs/reference/console-tour.md). |
| [`apps/presentation`](apps/presentation) | The transformation deck + source use-case catalog used to explain the system. |
| [`apps/ge-demo-generator`](apps/ge-demo-generator) | The generator: the `ge-mock` pipeline, the lower-level web workbench, the factory runner/worker, and the generic FastMCP server under [`mcp-service/`](apps/ge-demo-generator/mcp-service). |
| [`tools/`](tools) | The `ge` operator CLI (`ge.mjs`), the MCP server (`mcp-server.mjs`), and the shared operator core + runtime daemon under `tools/lib/`. |
| [`skills/`](skills) | Cross-runtime harness skills (one dir per skill, each with a `SKILL.md`). |
| [`installer/`](installer) | Terraform + the guided Cloud Shell installer (`TUTORIAL.md`) that stands the platform up in a target project. |
| [`docs/`](docs) | The GitHub Pages documentation site plus operator runbooks, ADRs, and design specs. |
| [`packages/`](packages) | Shared workspace packages (e.g. `@ge/agent-resolver`). |

---

## Running the gates (before a PR)

CI is the source hygiene check plus the full Bun test suite (see
[`cloudbuild.ci.yaml`](cloudbuild.ci.yaml)). Run the same gate locally with:

```bash
make ci             # source:hygiene → catalog → bun test apps tools  (mirrors CI)
```

Or run the individual checks:

```bash
bun run source:hygiene          # repo hygiene guard (tools/source-hygiene.mjs)
bun run lint                    # typecheck every workspace (tsc --noEmit, per app)
bun test apps tools             # the JS test suite (CI runs this)
bun test apps tools packages    # include the packages workspace tests too
```

For the Python MCP service (run from a `python3` that has pytest — see above):

```bash
python3 -m pytest apps/ge-demo-generator/mcp-service        # the MCP / simulator tests
bun run test:py                                             # same, via the package script
```

App production builds (useful when you've touched the UIs):

```bash
bun run build:console
bun run build:presentation
```

> CI typechecks with `bun run lint` because `vite build` strips types — a TS error
> can otherwise ship silently. Note `apps/ge-demo-generator` has no `lint` script, so
> `bun run lint` typechecks the console and presentation apps. The Python tests are
> **not** part of the `bun`/Cloud Build CI gate today — run them yourself when you
> touch `mcp-service` or the simulator packs.

---

## Branches + commits

- The repo's default branch is **`main`** (older history used `master`; PRs target
  `main`).
- The primary git remote is **`google`** — Cloud Source Repositories — with a
  **public GitHub mirror** (`github`) kept as a clean snapshot. Push to `google`.
- Use **[Conventional Commits](https://www.conventionalcommits.org/)**:
  `feat(scope): …`, `fix(scope): …`, `chore(scope): …`, etc. Recent history is the
  reference (e.g. `feat(okf): …`, `fix(agent-gateway): …`).
- Optional: `make install-hooks` installs a fast pre-commit hook that runs source
  hygiene before each commit (the full suite runs in `make ci` / CI).

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
make skills-sync     # validate the repo skills + (re)write the harness skill manifest
make skills-doctor   # verify the manifest is current and the skills are discoverable
```

`make skills-install` symlinks the repo skills into a headless harness skills dir
(`AGENTS_SKILLS_DIR`, default `~/.agents/skills`). `make skills-spec-audit` reports
Agent Skills spec portability gaps.

---

## Authoring specs / OKF

The factory's spec is the spine of generation. Specs round-trip to **OKF (Open
Knowledge Format) v0.1**, a portable BRD exchange format, via the converters in
`scripts/` (`spec-to-okf.mjs` / `okf-to-spec.mjs`).

- Concept: [Specs & OKF](docs/concepts/specs-and-okf.md)
- Reference: [Spec schema](docs/reference/spec-schema.md) · [OKF](docs/reference/okf.md)
- Cookbook: [Spec ⇄ OKF](docs/cookbooks/spec-to-okf.md) · [Author a spec via interview](docs/cookbooks/author-a-spec-via-interview.md)
- Skill: [`authoring-okf-specs`](skills/authoring-okf-specs/SKILL.md)

---

## Adding a simulator

Generated agents are grounded by simulated source systems under
`apps/ge-demo-generator/simulator-systems/`. To add one:

```bash
bun run generator:new-simulator          # scaffold a new simulator pack
bun run generator:validate-simulators    # validate the pack (schema/tools/workflows)
bun run generator:materialize-simulators # materialize seed data
bun run generator:test-simulators        # python3 -m pytest simulator conformance
```

There is also a **Bring Your Own System** flow that synthesizes a brand-new live
simulator from a natural-language description (NL / OpenAPI / samples) directly from
the console's Systems field.

- Concept: [Simulators & BYO](docs/concepts/simulators-and-byo.md)
- Reference: [Simulator systems](docs/reference/simulator-systems.md)
- Cookbook: [Bring your own simulator](docs/cookbooks/bring-your-own-simulator.md)

---

## More

- Docs site: <https://vamsiramakrishnan.github.io/ge-agent-factory/>
- Cookbooks: [docs/cookbooks/](docs/cookbooks/)
- Console Tour: [docs/reference/console-tour.md](docs/reference/console-tour.md)
- Operator runbook: [docs/OPERATIONS.md](docs/OPERATIONS.md)
- CLI internals: [tools/README.md](tools/README.md)
