# WS2 — `@ge/agent-spec`: one home for the agent-spec shape

**Status:** `[x]` done — merged 2026-07-02
**Write-set:** NEW `packages/agent-spec/**` · `apps/factory/src/agent-spec-registry.js` ·
`apps/console/src/components/interview/artifacts/specArtifact.ts` ·
`apps/presentation/src/types/architecture.ts` (re-export shim only) ·
root `package.json` (workspace dep declaration only) · `docs/reference/spec-schema.md`
(consumer-checklist rows only)
**Depends on:** nothing. **Blocks:** WS5 track D.

## Problem (verified 2026-07-02)

The agent-spec shape — the system's most load-bearing contract — has **no
schema module**. It is duck-typed across 13 verified consumers
(`docs/reference/spec-schema.md` §"Adding a new spec field"). The three
authorities:

1. `apps/presentation/src/types/architecture.ts` — TS interfaces
   (`UseCaseGenerationSpec`, `AgentBehaviorContract`, `UseCaseEntitySpec`),
   declared "types of record" by the docs, but plain types: no runtime
   validation.
2. `apps/factory/src/agent-spec-registry.js` — hand-rolled imperative
   validation (`validateGenerationSpec`, `validateCatalogParity`,
   `validateAgentSpecQuality`; `REQUIRED_BEHAVIOR_FIELDS`), **no zod**, gap
   strings pushed ad hoc.
3. `apps/console/…/specArtifact.ts` — loose parser
   (`spec: Record<string, any>`), with `SpecWorkflow`/`AnswerableQuery`
   interfaces that "mirror" the generator **by comment**
   (`apps/factory/scripts/factory/agent-workflow.mjs`).

## Target

`packages/agent-spec` (name `@ge/agent-spec`): zod v4 schemas + inferred TS
types for the whole spec shape, plus the existing validators re-homed with
**byte-identical** `{ ok, maturity, gaps }` output. Factory and console import
it; presentation's `architecture.ts` becomes a re-export shim. Nothing changes
behavior — proven by a corpus oracle.

## Non-negotiable constraint

The gap strings from `validateGenerationSpec` / `validateCatalogParity` /
`validateAgentSpecQuality` are consumed downstream (audit tooling, interview
skill, `packages/std/src/spec-gaps.mjs` gap codes). They must remain
**byte-identical** for every spec in the repo. That means: the zod schemas are
for *shape/type authority and new consumers*; the shipped validators keep
their imperative logic (moved verbatim) in the same package. Do NOT rewrite
validation as `schema.safeParse` + error-mapping — that is a behavior change
this workstream forbids.

---

## Step 1 — Corpus oracle FIRST (`packages/agent-spec/src/parity.test.mjs`)

Before any move, write a test that runs the CURRENT
`apps/factory/src/agent-spec-registry.js` validators over the entire on-disk
corpus and snapshots results:

- Corpus = every JSON under `apps/factory/catalog/interview-specs/` **plus**
  every entry produced by `loadInterviewSpecEntries` **plus** the baseline
  specs emitted by `bun run generator:emit-baselines` fixtures if checked in
  (inventory at implementation time; document the exact glob in the test).
- For each spec, record `{ id, validateGenerationSpec: {ok,maturity,gaps},
  validateAgentSpecQuality: {ok,maturity,gaps}, validateCatalogParity: gaps }`.
- Write the snapshot to
  `packages/agent-spec/tests/fixtures/validator-parity.json` (stable ordering,
  `stableSnapshotJson` from `apps/factory/tests/golden-test-helpers.mjs` is the
  house util — copy the pattern, not the import, to avoid an apps→packages
  test dependency).
- The test asserts current output === snapshot. After the move (Step 3), the
  same test imports from `@ge/agent-spec` and must still pass **unchanged**.

## Step 2 — Package skeleton

```
packages/agent-spec/
  package.json          # name "@ge/agent-spec", type module, exports below
  src/
    schema.ts           # zod schemas + inferred types (NEW authority)
    validate.mjs        # the three validators + helpers, MOVED verbatim
    constants.mjs       # AGENT_SPEC_SCHEMA_VERSION, INTERVIEW_SPEC_DIR,
                        # REQUIRED_BEHAVIOR_FIELDS, MOVED verbatim
    index.ts            # re-export all of the above
  tests/ (parity.test.mjs, schema.test.ts, fixtures/)
```

`package.json` `exports`: `"."`, `"./schema"`, `"./validate"`. Declare
`@ge/agent-spec: "workspace:*"` in root `package.json` dependencies (same
pattern as `@ge/std`). zod is already a root dependency — declare it in the
package's own `dependencies` too (`"zod": "^4"`). The
`check-no-app-imports.mjs` packages-guard already forbids this package from
importing `apps/*` — keep it a leaf (may import `@ge/std/naming` only, which
`agent-spec-registry.js` already uses for `slug`).

## Step 3 — `schema.ts` content (the new part)

Transcribe the shape from THREE sources and reconcile field-by-field; where
they disagree, the **registry's validation semantics win** (it is what gates
writes today), and any disagreement gets a `// DIVERGENCE:` comment naming the
loser:

- `apps/presentation/src/types/architecture.ts` interfaces,
- `agent-spec-registry.js` `validateGenerationSpec` — documented field list
  and minimums:

  ```
  version
  rowPolicy{defaultRowsPerEntity, minimumRowsPerEntity, rationale}
  sourceSystems[]{id, name, owns[], protocol, localBacking[], toolNames[], evidence[]}
  entities[]{name, primaryKey, columns[] (>=3), datastore, rowCount, sourceSystemId}
  documents[]{id, title, requiredSections[], citationAnchors[], minimumWordCount}
  apis[]{method, path, requestSchema, responseSchema}
  anomalies[]{description, affectedEntities[], expectedEvidence[]}
  datastorePackaging
  validation{smokePrompt, assertions[] (>=2)}
  behaviorContract{
    role, primaryObjective (>=60 chars), inScope[] (>=2), outOfScope[] (>=2),
    toolIntents[] (>=3; one kind==="query", one kind==="evidence_lookup")
      {name, kind, description, requiredInputs[], produces[], evidenceEmitted[]},
    evidenceRequirements[] (>=1), escalationRules[] (>=2),
    refusalRules[] (>=2), goldenEvals[] (>=1)
  }
  ```

- `docs/reference/spec-schema.md` enums (`toolIntents[].kind` ∈
  `query|action|evidence_lookup|notification|calculation`;
  `escalationRules[].action` ∈
  `escalate_to_human|refuse|request_more_info|use_fallback_tool`;
  `connections[].direction` ∈ `read|write|bidirectional`; `category` ∈
  `erp|analytics|ai|clm|market-data|collaboration`; entity column keys
  allowlist `name,type,values,weights,ref,min,max`).

Export names (fixed, so consumers can be written in parallel):
`GenerationSpecSchema`, `BehaviorContractSchema`, `ToolIntentSchema`,
`SpecWorkflowSchema`, `AnswerableQuerySchema`, `AgentSpecEntrySchema`
(the normalized-entry shape from `normalizeAgentSpecEntry`, including the
`registry:{…}` block), `ArchitectureSchema`; types via `z.infer` with the
same names minus `Schema`. All schemas `.loose()` (specs in the wild carry
extra keys; stripping would be a behavior change when round-tripping).

`schema.test.ts`: every corpus spec from Step 1 must `safeParse` successfully
with `GenerationSpecSchema` **or** be listed in a checked-in
`tests/fixtures/known-nonconforming.json` with the zod error path — an honest
inventory, not a silent skip. (Specs that fail today's `validateGenerationSpec`
are allowed to fail parse; the file records why.)

## Step 4 — Move the validators, shim the registry

- Move `validateGenerationSpec`, `validateCatalogParity`,
  `validateAgentSpecQuality`, `REQUIRED_BEHAVIOR_FIELDS`,
  `AGENT_SPEC_SCHEMA_VERSION`, and their private helpers (`asArray`,
  `nonEmptyString`) verbatim into `packages/agent-spec/src/validate.mjs`.
- `apps/factory/src/agent-spec-registry.js` re-exports them from
  `@ge/agent-spec` (one-line re-exports), keeping its own exports table
  unchanged so all 7 current importers (`tools/lib/factory-catalog.mjs`,
  `skills/interviewing-specs/scripts/validate-usecase-spec.mjs`,
  `register-agent-spec.mjs`, `audit-usecase-specs.mjs`,
  `sync-use-cases-from-slides.mjs`, tests) need **zero changes**.
  `normalizeAgentSpecEntry`/`mergeAgentSpecEntries`/file-IO functions stay in
  the registry file (they are factory-side IO, not contract).
- Step 1's parity test now imports from the package and must pass unmodified.

## Step 5 — Consume the types

- `apps/console/…/specArtifact.ts`: replace the local `SpecWorkflowStep`,
  `SpecWorkflow`, `AnswerableQuery` interfaces with
  `import type { SpecWorkflow, SpecWorkflowStep, AnswerableQuery } from "@ge/agent-spec"`,
  and type `SpecArtifactState.spec` as
  `Partial<GenerationSpecEnvelope> | Record<string, unknown> | null` (define
  the envelope in schema.ts: the catalog-entry wrapper with
  `id/title/department/generationSpec`). Delete the "Mirrors the SPEC-SHAPE"
  comment — the import *is* the mirror now.
- `apps/presentation/src/types/architecture.ts`: keep the file, but the three
  spec types become `export type { UseCaseGenerationSpec, … } from
  "@ge/agent-spec"` aliases (map names in schema.ts if they differ). Anything
  in that file that is presentation-only (slide layout types) stays put.
- `docs/reference/spec-schema.md`: update checklist rows 1 and 4 to name
  `packages/agent-spec/src/schema.ts` as the authority; add one row for the
  package itself. (Full doc generation from the schema is WS5 track D — do
  not do it here.)

## Definition of done

- [ ] `bun test packages/agent-spec` green; parity snapshot **unchanged**
      between the pre-move and post-move commits (verify:
      `git diff <pre>..<post> -- packages/agent-spec/tests/fixtures/validator-parity.json` is empty).
- [ ] `grep -rn "Mirrors the SPEC-SHAPE" apps/console` → no matches.
- [ ] All 7 previous importers of `agent-spec-registry.js` untouched
      (`git diff --stat` shows no edits to them).
- [ ] `node tools/check-no-app-imports.mjs` green (packages guard covers the
      new package).
- [ ] Full gate + `bun run test:gated` green; the two known-failing round-trip
      tests (`round-trip recovers tool names…`, `capability spine…`) fail with
      the SAME names as before — this workstream must not touch
      `spec-to-okf.mjs` (its id-mangling bug is out of scope).

## Forbidden

- Rewriting validators to zod-parse internally (gap-string behavior change).
- Renaming any gap string, maturity value, or exported symbol.
- Fixing the `spec-to-okf.mjs` round-trip bug (separate, known, out of scope).
- Adding spec fields "while we're here" — the schema documents what exists.
