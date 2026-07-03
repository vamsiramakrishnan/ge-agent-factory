# @ge/synthkit

The repo's deterministic synthetic-data engine: pack recipes, seeded
statistical distributions, the statistical realism tier, faker-backed
cell-value generation, and every Snowfakery recipe renderer. This package
depends only on `@ge/std` and third-party leaves (`@faker-js/faker`, `yaml`) —
nothing in `apps` or `tools` — so it can be imported from anywhere in the repo
without creating a layering cycle (`node tools/check-no-app-imports.mjs`
enforces it).

Everything here used to live scattered across `apps/factory/scripts`
(`lib/data-recipe.mjs`, `lib/synth-distributions.mjs`,
`lib/realism-profiles.mjs`, `factory/fixtures/value-gen.mjs`,
`factory/data/yaml-render.mjs`, `factory/data/snowfakery-recipe-render.mjs`,
plus an inline `generateValue` duplicate in `generate-mock-data.mjs`). The
consolidation is byte-preserving: the golden/parity suites under
`apps/factory/tests` pin the outputs, and the only sanctioned behavior change
was the realism tier's persona pool (see below).

**Check here before you hand-roll a generator.** If you're about to write a
seeded PRNG, a skewed distribution, a fake-person pool, a business-hours
timestamp, or a Snowfakery emitter — it very likely already exists here.

Operator-facing documentation — the recipe model, the tiers, the realism
profile, and the `ge data synth` verb — lives at
[`docs/reference/synthetic-data.md`](../../docs/reference/synthetic-data.md).

## The model: one recipe, two tiers, plus a realism profile

A simulator pack's contract (`schema.json` + `projection` / `materialization` /
`workflows`) is normalized once by `buildRecipe(contract, { seed })` into a
recipe: per-field generator descriptors, FK edges, and a topologically sorted
collection order (referents before referrers). Both realization tiers read the
same recipe:

- **Snowfakery tier** (high-fidelity, out-of-process):
  `toSnowfakeryYaml(recipe)` renders the recipe with a pinned seed for the
  `snowfakery` CLI. Used when scale matters and `snowfakery` is on PATH.
- **Offline tier** (in-process, dependency-free despite the name):
  `generateWithFaker(recipe, { seed })` realizes rows from a mulberry32 PRNG,
  resolving every FK to a real, already-generated primary key — the output is
  referentially closed by construction.

On top of the offline tier sits the **realism profile**
(`generateRealistic(recipe, contract, { seed, profile: "realistic" })`): it
keeps the baseline's PKs, FK closure, and row counts, then deterministically
re-realizes value fields — logNormal money, poisson counts, zipf-weighted
enums (workflow state enums weighted so source states outnumber terminal
ones), monotone business-hours lifecycles, a shared persona pool so the same
humans recur across collections with emails that match their names, and a
seeded fraction of realistic edge cases (unicode names, max-length text,
boundary amounts, same-day lifecycles, near-duplicate names). It returns
`{ data, report }` — the report lists personas, injected edge cases, and the
distribution used per field.

## Determinism guarantees

- No `Math.random()`, no `Date.now()`, no argless `new Date()` anywhere in
  generation code. Identical `(contract, seed)` ⇒ identical bytes.
- Per-field sub-streams derive from `(seed, collection, field)` via an FNV-1a
  fold, so two fields never share a draw sequence.
- `values.mjs`'s `generateValue` is deliberately **not** self-seeding: it
  consumes the shared `@faker-js/faker` singleton's current state, so the
  caller (factory.mjs's `cmdGenerate`, `generate-mock-data.mjs`) owns the seed
  and fixture bytes are governed by that seed alone. The realism tier's
  persona pool, by contrast, uses a **private** `new Faker` instance seeded
  from the recipe seed — it never disturbs the singleton.
- The Snowfakery renderers are pure string functions; their exact bytes are
  pinned by golden tests (see below).

## Modules

### `recipe` — `@ge/synthkit/recipe`

`buildRecipe`, `generateWithFaker`, `scenarioCoverageRows` (rows that exercise
every declared transition source state, approval blocker, and failure mode),
`applyMaterialization` / `normalizeForCollection` / `mergeByKey` (the
materialize-simulator-seeds alias+defaults logic), `checkFkClosure`,
`parseFieldType`, `makeRng`, and the `codePrefix` / `stringGeneratorFor`
heuristics the Snowfakery recipe dialect shares.

### `distributions` — `@ge/synthkit/distributions`

Seeded samplers taking an explicit rng: `normal`, `logNormal`, `poisson`,
`pareto`, `triangular`, `mixture`, `zipfWeights` + `weightedChoice`; temporal
helpers `businessHoursTimestamp` and `eventSequence`; `rngFor(seed, ...labels)`
for independent per-label streams.

### `realism` — `@ge/synthkit/realism`

`REALISM_PROFILES`, `generateRealistic`, `buildPersonaPool(seed)`,
`personaSlug`. The persona pool is faker-backed and seed-derived (24 unique
full names, emails ASCII-folded from the names) — this replaced the original
hand-rolled name arrays and is the one place the consolidation intentionally
changed output bytes; the `--profile realistic` output is opt-in and not
golden-pinned.

### `values` — `@ge/synthkit/values`

`generateValue(col, rowIndex, generatedTables)` — the faker-backed column-type
dispatch (seq patterns, number/float/date/enum/boolean, cross-table refs,
dotted faker paths) that fills workspace fixture tables.

### `snowfakery` — `@ge/synthkit/snowfakery`

All three Snowfakery emitters plus their YAML helpers (`yamlScalar`,
`snowExpression`, `renderYaml`, `renderYamlValue`):

| Renderer | Dialect | Byte-pinned by |
|----------|---------|----------------|
| `toSnowfakeryYaml(recipe)` | pack recipe (simulator seeds) | `apps/factory/tests/to-snowfakery-yaml-golden.test.js` |
| `planRecipeYaml(plan, { referenceTargetFor })` | mock-data planner realization plan | `apps/factory/tests/plan-mock-data-golden.test.js` |
| `snowfakeryFakeForColumn(col)` + `renderYamlValue` | workspace schema columns | `apps/factory/scripts/factory-data-gen.test.mjs` |

The dialects diverge **on purpose** (different input shapes, consumers, and
quoting conventions); do not unify their heuristics without regenerating and
defending the corresponding goldens. `planRecipeYaml` takes the FK-target
resolver as an injected option so app-level domain heuristics
(`lakehouse-targets.mjs`) stay app-side.

## Who consumes it

- `apps/factory/scripts/generate-simulator-data.mjs` — recipe + tiers +
  realism + `toSnowfakeryYaml`.
- `apps/factory/scripts/materialize-simulator-seeds.mjs` — the shared
  normalize/merge logic.
- `apps/factory/scripts/generate-mock-data.mjs` — recipe (pack mode) +
  `generateValue` (schema/table modes).
- `apps/factory/scripts/plan-mock-data.mjs` — `renderYaml` + `planRecipeYaml`.
- `apps/factory/scripts/factory.mjs` — `generateValue` (cmdGenerate) +
  `snowfakeryFakeForColumn` / `renderYamlValue` (cmdSnowfakeryRecipe).
