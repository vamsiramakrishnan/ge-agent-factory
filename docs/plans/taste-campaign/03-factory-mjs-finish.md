# WS3 — Finish `scripts/factory.mjs`: extract the data-gen and pipeline-state residue

**Status:** `[x]` done — merged 2026-07-02
**Write-set:** `apps/factory/scripts/factory.mjs` · NEW
`apps/factory/scripts/factory/fixtures/{document-gen.mjs,value-gen.mjs}` · NEW
`apps/factory/scripts/factory/data/snowfakery-recipe-render.mjs` · NEW
`apps/factory/scripts/factory/core/pipeline.mjs` (+ their `.test.mjs` files)
**Depends on:** nothing. **Blocks:** nothing.

## Problem (verified 2026-07-02, exact line numbers drift — re-map with grep first)

`scripts/factory.mjs` is 2,513 lines. The cmd-handler shell (~60%) is
legitimate; two foreign masses remain:

1. **Faker data-gen cluster** (contiguous L2142–2335): `DOC_TEMPLATES`,
   `DOMAIN_DOC_SETS`, `generateDocument`, `generateDomainDocuments`,
   `generateParagraph`, `pickEntityRefs`, `generateValue`. Entry points:
   `cmdGenerate` only (calls `generateValue` L~470, `generateDocument` L~510,
   `generateDomainDocuments` L~530).
2. **Snowfakery YAML pair** (L1436–1473): `snowfakeryFakeForColumn`,
   `renderYamlValue` (recursive). Entry point: `cmdSnowfakeryRecipe` only.
3. **Pipeline-state cluster** (L96–214): `pipelinePath`/`schemaPath`/
   `manifestPath`/`fixturesDir`/`cloudDataDir`/`deployPlanPath`, `readJson`,
   `writeJson`, `writeText`, `loadPipeline`, `savePipeline`, `markStep`,
   `requireStep`, `nextCommandFor`, `STEPS`, `STEP_CLI_COMMAND`,
   `STEP_CLI_PLACEHOLDER_ARGS`, `FactoryCommandError`, `ok`, `fail`,
   `warnMkdirFailure`. Called by every `cmd*` and injected into
   `harnessDeps()` (L~1302), `cmdDataPlan` deps (L~1406), `lifecycleDeps()`
   (L~1531).

**CRITICAL COVERAGE FACT:** no golden oracle executes this cluster.
`factory-cloud-data-golden.test.js` copies pre-built fixture rows
(`cpSync FIXTURE_DIR`) — it never runs `factory generate`.
`to-snowfakery-yaml-golden.test.js` pins a *different* module
(`scripts/lib/data-recipe.mjs`). Extraction is unprotected until Step 1.

## Target

`factory.mjs` ≤ ~1,900 lines: cmd handlers + `buildAgentQualityPlan`/
`renderAgentInstruction` (which stay — see Constraint below) + wiring. The
three clusters live in domain modules with direct unit tests.

## Constraint carried from REFACTOR-HANDOFF §9 (verified current)

`buildAgentQualityPlan` (L~575) stays in `factory.mjs`: it drives BOTH the
agent.py emitter and schema derivation, and is **injected** into
`deriveSchemaFromUseCase(useCase, rows, { buildAgentQualityPlan })` at every
call site (L~1723, L~1994) with the `__test` wrapper (L~2494) preserving the
2-arg test signature. Do not move it; do not "simplify" the injection.

---

## Step 1 — Verification net FIRST (no golden exists; build a stash-diff harness + seed-pinned unit tests)

The faker cluster is nondeterministic per-process unless seeded, so a
subprocess golden is not achievable without a behavior change (do NOT add
seeding to `cmdGenerate`). Use the house stash-diff method (the one
schema-derivation used, REFACTOR-HANDOFF §9):

1. **Unit tests first, against the CURRENT in-file functions** via a temporary
   `__test` extension. Add to `factory.mjs`'s existing `__test` export:
   `generateDocument, generateDomainDocuments, generateParagraph,
   pickEntityRefs, generateValue, snowfakeryFakeForColumn, renderYamlValue,
   loadPipeline, savePipeline, markStep, requireStep, nextCommandFor`.
   Commit this alone.
2. Write `apps/factory/scripts/factory-data-gen.test.mjs`: import
   `{ faker }` the same way factory.mjs does, call `faker.seed(42)` **in the
   test**, then snapshot-assert outputs of each function over a fixture
   manifest (pick one real generated workspace manifest; check a trimmed copy
   into `apps/factory/tests/fixtures/data-gen-unit/`). Include:
   `renderYamlValue` nesting (object/array/scalar/quote-escaping),
   `snowfakeryFakeForColumn` for every column `type` branch,
   `generateValue` for every branch of its 13-way dispatch,
   one full `generateDocument` + `generateDomainDocuments` run.
   Same for `pipeline.mjs` functions (pure fs-tempdir tests: load→mark→save
   round-trip, `requireStep` throw message byte-exact, `nextCommandFor` per
   step).
3. Commit the tests green. They now pin behavior across the move.

## Step 2 — Extract (verbatim moves, one commit per module)

| New module | Contents (moved verbatim) | Exports |
|---|---|---|
| `factory/fixtures/document-gen.mjs` | `DOC_TEMPLATES`, `DOMAIN_DOC_SETS`, `generateDocument`, `generateDomainDocuments`, `generateParagraph`, `pickEntityRefs` | those four fns |
| `factory/fixtures/value-gen.mjs` | `generateValue` | `generateValue` |
| `factory/data/snowfakery-recipe-render.mjs` | `snowfakeryFakeForColumn`, `renderYamlValue` | both |
| `factory/core/pipeline.mjs` | the full pipeline-state cluster incl. path helpers, `FactoryCommandError`, `ok`, `fail`, `STEPS`, `STEP_CLI_COMMAND`, `STEP_CLI_PLACEHOLDER_ARGS` | all of it |

Notes:
- `factory/fixtures/` is NEW (the existing `factory/data/` is cloud/structured
  packaging — the faker fixture path had no home; keep them separate).
- The modules import `faker` / `bigQuerySafeName` / `parseList` exactly as
  factory.mjs does today (check the import lines; `parseList` comes from
  `@ge/std/list`).
- `factory.mjs` imports the new modules; the `__test` block re-exports the
  moved names from the modules so Step 1's tests keep passing **unmodified**
  (that unmodified-test property is the parity proof).
- Every module gets the one-paragraph header comment style used by
  `factory/tools/py-emit.mjs` (read one extracted module first and match it).
- `deps` injection sites (`harnessDeps`, `cmdDataPlan`, `lifecycleDeps`)
  keep receiving the same function references — now imported ones. Byte-diff
  their call sites to zero.

## Step 3 — Re-point the tests, keep the shim

Flip `factory-data-gen.test.mjs` imports from `__test` to the new modules
directly. KEEP the `__test` re-exports (other tooling may bind them; removing
is separate cleanup). Run the full oracle suite:

```bash
bun test apps/factory/tests/           # all goldens: tools, cloud-data, plan-mock-data, spec-to-okf, snowfakery, scaffold, SSE
bun test apps/factory/scripts/
```

## Definition of done

- [ ] `wc -l apps/factory/scripts/factory.mjs` ≤ 1,950.
- [ ] All four new modules exist with tests;
      `bun test apps/factory/scripts/factory-data-gen.test.mjs` green and its
      assertions unchanged since Step 1 (verify with `git diff`).
- [ ] Every `*-golden.test.js` green (byte-identical — no fixture
      regeneration in this workstream; a regenerated fixture in the diff is
      an automatic reject).
- [ ] `grep -n 'function generateDocument\|function generateValue\|function loadPipeline' apps/factory/scripts/factory.mjs`
      → no matches.
- [ ] `buildAgentQualityPlan` still in factory.mjs, still injected, `__test`
      wrapper intact.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Seeding faker inside `cmdGenerate` (determinism change = data change).
- Touching `cmdTest`/`cmdRegister`/`cmdDeploy` or anything that shells to
  uv/pytest/gcloud (house rule 4).
- Moving `buildAgentQualityPlan`/`renderAgentInstruction`.
- "Improving" generated text/templates while moving (verbatim means verbatim).
