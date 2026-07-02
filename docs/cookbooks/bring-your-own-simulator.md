---
title: Bring your own simulator
parent: Cookbooks
nav_order: 4
layout: default
---

# Bring your own simulator

**Scope:** local by default — NL synthesis calls Vertex unless you pass
`--no-llm`; `--promote` writes into the repo.

## Goal

Create a new simulated source system — from natural language, an OpenAPI spec, or
sample rows — and mount it via the runtime overlay into the running MCP
(Model Context Protocol) service, the layer generated agents call through to
reach source systems. Optionally promote it into the curated corpus so it
loads as a built-in.

<p align="center">
  <img src="../assets/diagrams/byo-synthesis.svg" alt="A description, samples, or OpenAPI spec is synthesized into a sketch, then a contract with tool bindings and workflows, then referentially-consistent seed data, and finally registered into the runtime overlay where the generic engine resolves it" width="700">
</p>

## Prerequisites

- Local toolchain installed (`mise run setup`).
- The synthesis CLI runs `synthesis.py` from the mcp-service. The interpreter is
  resolved as `$GE_HARNESS_PYTHON` → the repo `.venv/bin/python` → `python3`.
- NL synthesis uses Vertex; pass `--no-llm` to force the offline heuristic tier.

> Run `synthesize_cli.py` with **cwd = `apps/factory/mcp-service/`** — it does
> a bare `import synthesis`, so from any other directory it fails immediately.
{: .important }

## Steps

### Option A — synthesize a system (NL / samples / OpenAPI)

1. **From natural language:**

   ```bash
   cd apps/factory/mcp-service
   python synthesize_cli.py \
     --description "PartsLedger: parts, requisitions, approval flow" \
     --display-name PartsLedger
   ```

2. **From sample rows (via stdin):**

   ```bash
   echo '{"mode":"samples","displayName":"Tickets","samples":{"tickets":[{"ticket_id":"T-1","subject":"x"}]}}' \
     | python synthesize_cli.py --stdin
   ```

3. **From an OpenAPI spec:**

   ```bash
   python synthesize_cli.py --mode openapi --openapi-file ./my-api.json --display-name MyApi
   ```

   Key flags (argparse): `--mode {nl,samples,openapi}` (default `nl`),
   `--description`, `--display-name`, `--id`, `--samples-file`, `--openapi-file`,
   `--seed` (default 42), `--count` (default 6), `--no-llm` (offline heuristic),
   `--no-register` (don't mount into the overlay), `--include-contract`,
   `--promote`, `--repo-root`.

   The CLI prints a JSON result (`id`, `displayName`, `tools`, `collections`,
   `valid`, `validationErrors`, `repairs`, `registered`, `ok: true`).

   **From the console:** the interview's *Systems* field
   (`apps/console/src/components/interview/SystemsField.tsx`) has a "Bring your
   own system" modal that calls `POST /api/systems/synthesize` (which spawns the
   same `synthesize_cli.py`). Existing systems list via `GET /api/systems`.

### Option B — scaffold a pack from an archetype

If you'd rather hand-author from a template:

```bash
node apps/factory/scripts/scaffold-simulator-pack.mjs --id partsledger --archetype procurement
# or via the npm wrapper:
npm run generator:new-simulator -- --id partsledger --archetype procurement
# list available archetypes:
node apps/factory/scripts/scaffold-simulator-pack.mjs --list-archetypes
```

Flags: `--id` (required), `--archetype` (default `procurement`), `--displayName`,
`--realism` (default `starter`), `--root` (default `.`), `--force true` to
overwrite.

### Mount (runtime overlay) vs. promote (corpus)

- **Runtime overlay** — `synthesize_cli.py` registers the synthesized contract
  into the overlay by default so the running mcp-service resolves it immediately
  (no files written). `--no-register` disables mounting.

  > The default overlay is **in-process only** — other mcp-service instances
  > (and every Cloud Run replica) won't see the mounted pack. Set
  > `GE_SIMULATOR_OVERLAY_BACKEND=firestore` *before* synthesizing to make it
  > durable and shared.
  {: .warning }
- **Promote to the corpus** — add `--promote` to write the 6 per-section files
  into `apps/factory/simulator-systems/<id>/` and upsert the
  `registry.json` entry, graduating the system to a built-in. Promotion runs only
  when the synthesized result is `valid`.

   ```bash
   cd apps/factory/mcp-service
   python synthesize_cli.py --description "PartsLedger ..." --display-name PartsLedger --promote
   ```

### Generate seed data and validate

```bash
# deterministic seed (Snowfakery, falls back to Faker offline):
node apps/factory/scripts/generate-simulator-data.mjs --system partsledger --seed 42
# validate the pack against the registry:
npm run generator:validate-simulators -- --system partsledger --strict
```

`generate-simulator-data.mjs` flags: `--system <id>` or `--pack <dir>` (one
required), `--seed N`, `--out <path>` (default `<packDir>/seed.json`),
`--no-snowfakery`, `--stdout`. `validate-simulator-pack.mjs` flags: `--system <id>`,
`--strict`, `--check true`.

## A simulator pack's files

Each system lives at `apps/factory/simulator-systems/<id>/` with six files:
`schema.json`, `tools.json`, `workflows.json`, `projection.json`,
`materialization.json`, `seed.json` — plus an entry in
`simulator-systems/registry.json`. The runtime handler module is
`simulator_runtime.generic`.

## Verify

```bash
# the pack validates clean:
npm run generator:validate-simulators -- --system partsledger
# after --promote, the directory + registry entry exist:
ls apps/factory/simulator-systems/partsledger
```

For NL synthesis, confirm the CLI's JSON output has `"valid": true` and
`"ok": true`.

## Troubleshoot

- **`import synthesis` fails** — you're not in the mcp-service dir. `cd
  apps/factory/mcp-service` first.
- **NL synthesis errors / no Vertex** — pass `--no-llm` to use the offline
  heuristic tier.
- **Overlay system not visible to other instances** — set
  `GE_SIMULATOR_OVERLAY_BACKEND=firestore` before synthesizing.
- **Validation fails under `--strict`** — strict promotes warnings (no explicit
  tool binding, empty seed collections) to errors. Fix bindings/seeds or drop
  `--strict` while iterating.
- **Snowfakery not installed** — `generate-simulator-data.mjs` logs a notice and
  falls back to the Faker tier; or pass `--no-snowfakery` explicitly.
