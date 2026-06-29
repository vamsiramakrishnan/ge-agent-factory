# `factory.mjs` decomposition plan

This note translates the refactor handoff into an executable, reviewable plan for shrinking
`apps/factory/scripts/factory.mjs` without changing generator behavior. The goal is not to
"split files because the file is large"; the goal is to isolate policies, pure derivation, and
code emitters behind small seams that can be parity-tested before the deploy path is touched.

## Current shape

`factory.mjs` is currently a command runner, schema derivation engine, Python code generator,
fixture writer, deploy/register orchestrator, and use-case bridge in one module. The most
important concentrated seams are:

- `cmdTools()` builds `tools.py`, optionally builds `agent.py`, writes eval artifacts, writes
  pyproject/agents-cli metadata, marks the pipeline, and prints the command result.
- `deriveColumnsForEntity()` encodes business fixture schemas with a long order-sensitive
  `if` chain. This is data-as-control-flow and is the safest first extraction target.
- `deriveSchemaFromUseCase()` contains two welded paths: generation-spec-first derivation and
  legacy architecture/system-name derivation.
- `SYSTEM_TABLE_PATTERNS` is already a declarative lookup. Use this as the local pattern for the
  first refactor rather than introducing a new abstraction style.

## Refactor principles for this branch

1. **Behavior first, extraction second.** Every extraction should have a parity test or golden
   fixture that proves the generated schema or emitted text did not change.
2. **Prefer data tables over strategy classes.** This code is mostly deterministic generation and
   policy selection; declarative maps are easier to diff and safer than class hierarchies.
3. **Use libraries where they remove maintenance.** Keep the recently adopted libraries
   (`execa`, `citty`, `c12`, `jsonrepair`, `change-case`, `yaml`) and add libraries only behind
   byte/golden gates. Do not replace persisted slug/key behavior with convenience packages such
   as `slugify` unless the migration is explicitly accepted.
4. **Keep deploy/register orchestration thin until it can run in CI.** The handoff explicitly says
   the sandbox cannot execute gcloud/agents-cli/uv/Firestore paths, so deploy-path changes need
   parse-only checks here and runtime validation elsewhere.
5. **Move reusable leaf utilities to `@ge/std`, domain code to `apps/factory/scripts/factory/*`,
   and generated-runtime code emitters to focused renderer modules.** Avoid new imports from
   `tools/*` into `apps/*` or vice versa.

## Recommended module boundaries

| Future module | Owns | Why |
| --- | --- | --- |
| `factory/use-case/schema-from-generation-spec.mjs` | The `generationSpec.entities` branch of schema derivation. | Separates explicit source-of-truth specs from heuristic legacy derivation. |
| `factory/use-case/legacy-schema-derivation.mjs` | Architecture/connections/system-name fallback derivation. | Makes the old heuristic path testable and eventually replaceable. |
| `factory/use-case/entity-column-schemas.mjs` | Declarative column schemas and entity matchers. | Replaces the 13-branch column function with table-driven data. |
| `factory/tools/render-tools-py.mjs` | `tools.py` line assembly, table query tools, document tools, contract tools. | `cmdTools()` should not know Python source layout details. |
| `factory/agents/render-agent-py.mjs` | `agent.py`, callbacks, workflow topology, quality-plan comments. | Keeps ADK agent rendering separate from fixture adapter rendering. |
| `factory/evals/render-eval-artifacts.mjs` | Golden eval JSON, agents-cli evalset, optimization config, OKF coverage. | Lets tests snapshot eval outputs independently from tools generation. |
| `factory/workspace/agents-cli-metadata.mjs` | `pyproject.toml`, `agents-cli-manifest.yaml`, `.agent_engine_config.json`. | Isolates packaging/deploy metadata from app code rendering. |
| `factory/commands/tools.mjs` | Thin command orchestration for `factory tools`. | Loads inputs, calls renderers, writes files, updates pipeline. |

## Phase 1: safest slice — `deriveColumnsForEntity()`

Start with the smallest behavior-preserving refactor recommended by the handoff.

1. Add golden coverage for representative entity names before changing code:
   - `employees`, `benefit_plans`, `enrollments`, `eligibility_rules`, `carrier_sync_events`
   - `transactions`, `tickets`, `vendors`, `purchase_orders`, `campaigns`, `reviews`
   - `documents`, `messages`, `metrics`, plus a generic fallback
2. Extract reusable column factories:
   - `idColumn(prefix)`
   - `sourceRecordColumn(prefix, suffix = "REC")`
   - shared enum values for regions, statuses, carriers, departments, channels
3. Replace the `if` chain with ordered pattern rows, for example:

   ```js
   const ENTITY_COLUMN_SCHEMAS = [
     {
       id: "people",
       matches: [/employee/, /staff/, /worker/],
       columns: ({ idCol, prefix }) => [idCol, sourceRecordColumn(prefix), /* ... */],
     },
   ];
   ```

4. Keep order explicit. Some names can match multiple concepts (for example `plan_documents`),
   so the first-match semantics must be preserved.
5. Export the matcher only if a test needs it; otherwise keep the public surface small and test
   through `deriveColumnsForEntity()`.

## Phase 2: split `deriveSchemaFromUseCase()`

After Phase 1 is green, split the two paths without changing output:

- `deriveSchemaFromGenerationSpec(useCase, defaultRows)` handles explicit `generationSpec` data.
- `deriveSchemaFromLegacyUseCase(useCase, defaultRows)` handles architecture/system heuristics.
- `deriveSchemaFromUseCase()` becomes a two-branch dispatcher.

The important parity check is generated schema equality for one explicit-spec use case and one
legacy/fallback use case from the catalog.

## Phase 3: shrink `cmdTools()` into renderers

The command should become roughly:

```js
async function cmdTools(dir, flags) {
  const context = await loadToolsCommandContext(dir, flags);
  const toolsPy = renderToolsPy(context);
  await writeText(context.outPath, toolsPy);

  const agentArtifacts = renderAgentArtifacts(context);
  await writeAgentArtifacts(dir, agentArtifacts, flags);

  const evalArtifacts = renderEvalArtifacts(context);
  await writeEvalArtifacts(dir, evalArtifacts);

  await ensureAgentsCliPyprojectMetadata(dir, context.manifest);
  await completePipelineStep(dir, context.pipeline, summarizeToolsResult(context, evalArtifacts));
}
```

This introduces seams but no new runtime behavior. The renderer modules can then be snapshot-tested
with a minimal manifest fixture.

## Modern alternatives to keep or evaluate

Already adopted and worth keeping:

- `execa` for child processes instead of raw `spawn` wrappers.
- `citty` for command routing/help rather than hand-rolled CLI dispatch.
- `c12` for config loading where its discovery semantics fit.
- `jsonrepair` for tolerant LLM JSON extraction.
- `change-case` via `@ge/std/naming` for canonical case conversion.
- `yaml` for YAML emission rather than manual string concatenation.

Worth evaluating behind golden gates:

- `csv-parse` / `csv-stringify` for CSV internals, only after byte-identical golden checks.
- `tinyglobby` for filesystem discovery where current traversal is bespoke and behavior is clear.
- `pino` or `consola` for a consistent DEBUG/WARN/error tier, but only after deciding the
  observability contract for silent catches.
- `hono` for remaining HTTP routes, using the existing strangler approach rather than a big-bang
  server rewrite.

Avoid for now:

- `slugify` for persisted identifiers; it would change registry keys.
- A class-heavy command framework inside `factory.mjs`; the problem is coupling, not lack of OOP.
- A generic `uniq/asArray/compact` helper that hides the different falsy-value semantics called
  out in the handoff.
- Bulk timeout constant renaming before a real timeout taxonomy is designed.

## Review checklist for each extraction PR

- Does the diff move code or data without widening behavior?
- Is there a parity/golden test for the moved seam?
- Are deploy/register paths still parse-only unless the environment can execute them?
- Are imports layered through `@ge/std` or local `apps/factory/scripts/factory/*` modules?
- Did we avoid changing persisted identifiers, generated filenames, and agent tool names?
- Did `bun run source:hygiene` and the relevant tests run after the change?
