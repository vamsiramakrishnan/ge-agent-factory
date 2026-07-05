---
title: Generate simulations (source-system twins)
parent: Guides
nav_order: 6
layout: default
description: Synthesize a simulated source system from natural language, sample rows, or an OpenAPI spec, seed it with deterministic data, and promote it into the corpus.
---

# Generate simulations (source-system twins)

**Scope:** local by default — NL synthesis calls Vertex unless you pass
`--no-llm`; `--promote` writes into the repo.

A simulation — a [source-system twin](../concepts/source-system-twins.html) —
is a stateful stand-in for an enterprise backend, realistic enough that a
compiled agent behaves as if it were wired into the real system. This guide
creates a new twin from natural language, an OpenAPI spec, or sample rows,
then mounts it into the running MCP (Model Context Protocol) service — the
layer generated agents call through to reach source systems. It can also
promote the twin into the curated corpus so it loads as a built-in.

<p align="center">
  <img src="../assets/diagrams/byo-synthesis.svg" alt="A description, samples, or OpenAPI spec is synthesized into a sketch, then a contract with tool bindings and workflows, then referentially-consistent seed data, and finally registered into the runtime overlay where the generic engine resolves it" width="700">
</p>

## When to use this

- A contract names a source system that has no built-in twin in the
  [simulator-systems corpus](../reference/simulator-systems.html).
- You want to prove an agent against a system whose real integration doesn't
  exist yet.
- You have an OpenAPI spec or sample rows from a real backend and want a
  faithful simulation of it (for spec capture itself, see
  [Capture from OpenAPI](capture-from-openapi.html)).

## Input artifact

One of three descriptions of the source system:

- a **natural-language description** (`--description "..."`),
- **sample rows** (JSON via stdin or `--samples-file`),
- an **OpenAPI spec** (`--openapi-file`).

Prerequisites: local toolchain installed (`mise run setup`). The synthesis
CLI runs `synthesis.py` from the mcp-service; the interpreter is resolved as
`$GE_HARNESS_PYTHON` → the repo `.venv/bin/python` → `python3`. NL synthesis
uses Vertex; pass `--no-llm` to force the offline heuristic tier.

> Run `synthesize_cli.py` with **cwd = `apps/factory/mcp-service/`** — it does
> a bare `import synthesis`, so from any other directory it fails immediately.
{: .warning }

## Steps

1. **Synthesize from natural language** (the common case):

   ```bash
   cd apps/factory/mcp-service
   python synthesize_cli.py \
     --description "PartsLedger: parts, requisitions, approval flow" \
     --display-name PartsLedger
   ```

2. **…or from sample rows (via stdin):**

   ```bash
   echo '{"mode":"samples","displayName":"Tickets","samples":{"tickets":[{"ticket_id":"T-1","subject":"x"}]}}' \
     | python synthesize_cli.py --stdin
   ```

3. **…or from an OpenAPI spec:**

   ```bash
   python synthesize_cli.py --mode openapi --openapi-file ./my-api.json --display-name MyApi
   ```

   Key flags (argparse): `--mode {nl,samples,openapi}` (default `nl`),
   `--description`, `--display-name`, `--id`, `--samples-file`,
   `--openapi-file`, `--seed` (default 42), `--count` (default 6), `--no-llm`
   (offline heuristic), `--no-register` (don't mount into the overlay),
   `--include-contract`, `--promote`, `--repo-root`.

   The CLI prints a JSON result (`id`, `displayName`, `tools`, `collections`,
   `valid`, `validationErrors`, `repairs`, `registered`, `ok: true`).

4. **Alternative: scaffold a pack from an archetype** to hand-author from a
   template:

   ```bash
   node apps/factory/scripts/scaffold-simulator-pack.mjs --id partsledger --archetype procurement
   # or via the npm wrapper:
   npm run generator:scaffold-simulator -- --id partsledger --archetype procurement
   # list available archetypes:
   node apps/factory/scripts/scaffold-simulator-pack.mjs --list-archetypes
   ```

   Flags: `--id` (required), `--archetype` (default `procurement`),
   `--displayName`, `--realism` (default `starter`), `--root` (default `.`),
   `--force true` to overwrite.

5. **Decide: mount (runtime overlay) vs. promote (corpus).**

   - **Runtime overlay** — `synthesize_cli.py` registers the synthesized
     contract into the overlay by default so the running mcp-service resolves
     it immediately (no files written). `--no-register` disables mounting.

     > The default overlay is **in-process only** — other mcp-service
     > instances (and every Cloud Run replica) won't see the mounted pack.
     > Set `GE_SIMULATOR_OVERLAY_BACKEND=firestore` *before* synthesizing to
     > make it durable and shared.
     {: .warning }

   - **Promote to the corpus** — add `--promote` to write the 6 per-section
     files into `apps/factory/simulator-systems/<id>/` and upsert the
     `registry.json` entry, graduating the simulation to a built-in.
     Promotion runs only when the synthesized result is `valid`.

     ```bash
     cd apps/factory/mcp-service
     python synthesize_cli.py --description "PartsLedger ..." --display-name PartsLedger --promote
     ```

6. **Generate deterministic seed data.**

   ```bash
   node apps/factory/scripts/generate-simulator-data.mjs --system partsledger --seed 42
   ```

   `generate-simulator-data.mjs` flags: `--system <id>` or `--pack <dir>`
   (one required), `--seed N`, `--out <path>` (default `<packDir>/seed.json`),
   `--no-snowfakery`, `--stdout`. (Snowfakery generates the data; it falls
   back to Faker offline.)

7. **Validate the pack against the registry.**

   ```bash
   npm run generator:validate-simulators -- --system partsledger --strict
   ```

   `validate-simulator-pack.mjs` flags: `--system <id>`, `--strict`,
   `--check true`.

## Expected output

- The synthesis CLI's JSON output has `"valid": true` and `"ok": true`
  (`registered: true` if mounted into the overlay).
- After `--promote`, the pack directory and registry entry exist:

  ```bash
  ls apps/factory/simulator-systems/partsledger
  npm run generator:validate-simulators -- --system partsledger
  ```

## Console view

- **Interview** — the interview's *Systems* field
  (`apps/console/src/components/interview/SystemsField.tsx`) has a "Bring
  your own system" modal that calls `POST /api/systems/synthesize` (which
  spawns the same `synthesize_cli.py`). Existing simulations list via
  `GET /api/systems`. See the
  [contract editor](../console/contract-editor.html) for the surrounding
  capture flow.

## Generated files

Each promoted simulation lives at `apps/factory/simulator-systems/<id>/`
with six files: `schema.json`, `tools.json`, `workflows.json`,
`projection.json`, `materialization.json`, `seed.json` — plus an entry in
`simulator-systems/registry.json`. The runtime handler module is
`simulator_runtime.generic`. (Overlay-mounted simulations write no files;
they live in the running service.) Reference:
[Simulator systems](../reference/simulator-systems.html).

## Common failures

- **`import synthesis` fails** — you're not in the mcp-service dir.
  `cd apps/factory/mcp-service` first.
- **NL synthesis errors / no Vertex** — pass `--no-llm` to use the offline
  heuristic tier.
- **Overlay simulation not visible to other instances** — set
  `GE_SIMULATOR_OVERLAY_BACKEND=firestore` before synthesizing.
- **Validation fails under `--strict`** — strict promotes warnings (no
  explicit tool binding, empty seed collections) to errors.
- **Snowfakery not installed** — `generate-simulator-data.mjs` logs a notice
  and falls back to the Faker tier; or pass `--no-snowfakery` explicitly.

## Repair

- Inspect `validationErrors` and `repairs` in the CLI's JSON output — the
  synthesizer self-repairs what it can and reports the rest.
- Fix tool bindings or seed collections and re-run
  `npm run generator:validate-simulators -- --system <id> --strict`; drop
  `--strict` while iterating.
- Re-synthesize with a sharper `--description` (or switch to `--mode openapi`
  / samples for ground truth) if the shape came out wrong; `--seed` keeps
  data deterministic across retries.

## Next step

Recompile the agents that name this source system so they bind to the new
twin: [Compile a contract into an agent](compile-a-contract.html). Then run
the proof against it: [Prove an agent](prove-an-agent.html).
