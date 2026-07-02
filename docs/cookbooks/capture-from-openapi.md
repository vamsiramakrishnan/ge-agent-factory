---
title: Capture a source system from OpenAPI
parent: Guides
nav_order: 3
layout: default
description: Synthesize a simulated source-system twin from an OpenAPI document and mount or promote it.
---

# Capture a source system from OpenAPI

**Scope:** local-only — deterministic synthesis, no model calls; `--promote` writes into the repo.

## When to use this

The agent you're building needs to call an internal API, and what you have is
that API's OpenAPI document. This guide turns the document into a **source
system** the platform can work with: a simulated twin — a pack served by the
simulator engine as a stateful, MCP-shaped backend — that the contract's tool
intents can bind to and that proofs can run against, without touching the real
system. See [Source-system twins](../concepts/source-system-twins.html).

> Be clear about what this captures. An OpenAPI document describes an API's
> surface, so OpenAPI capture produces a **source-system twin** — collections,
> tools, seed data. It does not produce a behavior contract; the contract (the
> use-case spec) is captured separately, via the
> [interview](capture-from-interview.html).
{: .note }

## Input artifact

An OpenAPI 3.x document (or Swagger 2) as a JSON file. The synthesizer's
sketch step reads **component schemas** (`components.schemas`, falling back to
`definitions`): up to 12 object schemas with properties become collections,
with primary keys inferred from `id`-like fields. A document with no component
schemas yields no useful collections. This derivation is deterministic — it is
golden-pinned in the mcp-service tests and makes no model calls (the LLM tier
applies only to natural-language synthesis).

Environment: local toolchain installed (`mise run setup`). The synthesis CLI
runs against the mcp-service's Python; the interpreter is resolved as
`$GE_HARNESS_PYTHON` → the repo `.venv/bin/python` → `python3`.

## Steps

1. **Change into the mcp-service directory.**

   ```bash
   cd apps/factory/mcp-service
   ```

   > `synthesize_cli.py` does a bare `import synthesis`, so from any other
   > directory it fails immediately. cwd must be `apps/factory/mcp-service/`.
   {: .warning }

2. **Synthesize the twin from the OpenAPI document.**

   ```bash
   python synthesize_cli.py --mode openapi --openapi-file ./my-api.json --display-name MyApi
   ```

   Key flags (argparse): `--mode {nl,samples,openapi}` (default `nl`),
   `--description`, `--display-name`, `--id`, `--samples-file`,
   `--openapi-file`, `--seed` (default 42), `--count` (default 6), `--no-llm`
   (offline heuristic, NL mode only), `--no-register` (don't mount into the
   overlay), `--include-contract`, `--promote`, `--repo-root`.

3. **Check the result.**

   The CLI prints a JSON result: `id`, `displayName`, `tools`, `collections`,
   `valid`, `validationErrors`, `repairs`, `registered`, `ok: true`. Confirm
   `"valid": true` and `"ok": true`, and that the collections and tools match
   the entities you expected from the API's schemas.

4. **Decide: mount for this session, or promote into the corpus.**

   By default the synthesized contract is registered into the **runtime
   overlay**, so the running mcp-service (the MCP layer generated agents call
   through to reach source systems) resolves it immediately — no files
   written. `--no-register` disables mounting.

   > The default overlay is **in-process only** — other mcp-service instances
   > (and every Cloud Run replica) won't see the mounted twin. Set
   > `GE_SIMULATOR_OVERLAY_BACKEND=firestore` *before* synthesizing to make it
   > durable and shared.
   {: .warning }

   To graduate the twin to a built-in, add `--promote` — it writes the six
   per-section pack files into `apps/factory/simulator-systems/<id>/` and
   upserts the `registry.json` entry. Promotion runs only when the result is
   `valid`.

   ```bash
   python synthesize_cli.py --mode openapi --openapi-file ./my-api.json --display-name MyApi --promote
   ```

5. **Generate seed data and validate the pack** (after promoting):

   ```bash
   # from the repo root — deterministic seed (Snowfakery, falls back to Faker offline):
   node apps/factory/scripts/generate-simulator-data.mjs --system <id> --seed 42
   # validate the pack against the registry:
   npm run generator:validate-simulators -- --system <id> --strict
   ```

6. **Or do it from the console.** The interview's *Systems* field
   (`apps/console/src/components/interview/SystemsField.tsx`) has a "Bring
   your own system" modal that calls `POST /api/systems/synthesize` (which
   spawns the same `synthesize_cli.py`). Existing systems list via
   `GET /api/systems`.

## Expected output

- The CLI's JSON result has `"valid": true`, `"ok": true`, and a `tools` /
  `collections` set that mirrors the API's component schemas.
- After `--promote`:

  ```bash
  ls apps/factory/simulator-systems/<id>   # schema.json, tools.json, workflows.json, ...
  npm run generator:validate-simulators -- --system <id>
  ```

## Console view

The **Interview** view's Systems field is where a twin is synthesized and
attached to a use case. See the [console tour](../console/index.html).

## Generated files

Overlay-only mounting writes nothing to disk. With `--promote`, the pack lands
at `apps/factory/simulator-systems/<id>/` with six files — `schema.json`,
`tools.json`, `workflows.json`, `projection.json`, `materialization.json`,
`seed.json` — plus an entry in `simulator-systems/registry.json`. The pack
contract is documented in [Simulator systems](../reference/simulator-systems.html).

## Common failures

- **`import synthesis` fails** — cwd isn't `apps/factory/mcp-service/`.
- **Few or no collections synthesized** — the OpenAPI document has no (or
  bare) `components.schemas`; the sketcher only reads component schemas, not
  paths.
- **Overlay twin not visible to other instances** — the default overlay is
  in-process only.
- **Validation fails under `--strict`** — strict promotes warnings (no
  explicit tool binding, empty seed collections) to errors.
- **Snowfakery not installed** — `generate-simulator-data.mjs` logs a notice
  and falls back to the Faker tier.

## Repair

- Wrong cwd: `cd apps/factory/mcp-service` and re-run.
- Thin schemas: enrich the OpenAPI document's component schemas, or switch to
  sample-based synthesis (`--mode samples` with `--samples-file`) using real
  rows — see [Generate simulations](generate-simulations.html).
- Shared visibility: set `GE_SIMULATOR_OVERLAY_BACKEND=firestore` and
  re-synthesize, or `--promote` so the twin is a built-in.
- Strict validation: fix the reported bindings/seeds, or drop `--strict`
  while iterating.

## Next step

Deepen the twin — workflows, failure injection, seed realism — in
[Generate simulations](generate-simulations.html), then reference the system
from a contract and [compile it](compile-a-contract.html).
