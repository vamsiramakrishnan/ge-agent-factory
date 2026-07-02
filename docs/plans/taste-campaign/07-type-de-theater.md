# WS7 — De-theater the `.d.ts`: real types for run-ledger's store and runtime's normalizers

**Status:** `[ ]` open
**Write-set:** `packages/run-ledger/src/index.d.ts` · NEW
`packages/run-ledger/src/store.d.ts` · `packages/runtime/src/contract.d.ts` ·
NEW per-package `tsconfig.json` + `typecheck.ts` in both packages · both
packages' `package.json` (scripts only)
**Depends on:** nothing. **Blocks:** nothing.

## Problem (verified 2026-07-02)

The two packages that ship `.d.ts` files type their hot paths as `any`:

- `packages/run-ledger/src/index.d.ts` declares the entire store surface
  loosely: `factoryEventToLedgerOp(event: any): any`,
  `createRunLedger(adapter: any): any`, `sqliteAdapter(path?): Promise<any>`,
  `pgAdapter(dsn): Promise<any>`, `openRunLedger(path?): Promise<any>` — while
  the same package's `reduce.d.ts`/`status.d.ts`/`frames.d.ts` are properly
  typed. TS consumers (the console) get IntelliSense for the pure reducer and
  `any` for the ledger itself.
- `packages/runtime/src/contract.d.ts` declares real `ArtifactRef`/`Blocker`
  shapes but its six `normalize*` functions return
  `Record<string, unknown>` — a typed façade over untyped behavior.

## Rules

- **Types only.** Zero edits to any `.mjs` runtime file except adding JSDoc
  comments. If typing reveals a real bug, file it in the PR description —
  don't fix it here.
- Types are **derived from the implementation**, not aspiration: read
  `store.mjs` (and its tests) function by function; every property you
  declare must be traceable to a line that reads or writes it. Where the
  implementation is genuinely dynamic, use a named, documented type
  (`type LedgerRow = { … } & Record<string, unknown>`), never bare `any`.
  `unknown` is acceptable for payloads the ledger only stores and never
  inspects — say so in a comment.

## Step 1 — Typecheck harness FIRST (both packages)

Types without a compiler are still theater. Per package:

- `tsconfig.json`: `strict: true`, `noEmit: true`, `checkJs: false`,
  `include: ["src/**/*.d.ts", "typecheck.ts"]`.
- `typecheck.ts`: imports every exported symbol and exercises the surface —
  construct a `LedgerOp`, feed `factoryEventToLedgerOp`'s result into
  `createRunLedger(...).apply(...)` (match real method names from
  `store.mjs`), pass a reducer frame through, include `// @ts-expect-error`
  probes for the mistakes the types must catch (wrong status string, missing
  required field).
- `package.json` script `"typecheck": "bunx tsc --noEmit -p ."` (main merged
  per-package test scripts — match that pattern), and add both typechecks to
  the root `lint`-adjacent flow the same way per-package tests were wired
  (read commit `a4f602b` for the pattern and copy it).

Commit the harness with the CURRENT loose types green, so the diff that
follows shows exactly what tightened.

## Step 2 — `run-ledger` store types

Move the store block out of `index.d.ts` into a real `store.d.ts`
(`index.d.ts` gains `export * from "./store"`). Author, from reading
`store.mjs`:

- `LedgerOp` (the discriminated union `factoryEventToLedgerOp` actually
  emits — enumerate its `kind`/`type` branches from the source),
- `LedgerAdapter` (the sqlite/pg adapter contract: exact method names,
  parameter and return types as implemented),
- `RunLedger` (what `createRunLedger` returns: every public method),
- `LEDGER_STAGES: readonly string[]`,
- `factoryEventToLedgerOp(event: FactoryEvent): LedgerOp | null` — define
  `FactoryEvent` from the fields the function reads; if the function can
  return null/undefined on unrecognized events (check!), the signature must
  say so,
- `sqliteAdapter(path?: string): Promise<LedgerAdapter>`,
  `pgAdapter(dsn: string): Promise<LedgerAdapter>`,
  `openRunLedger(path?: string): Promise<RunLedger>`.

Reuse `RunStatus` from `./status` instead of `string` wherever a status
flows (this is the union type REFACTOR-HANDOFF §5.3 said the `.d.ts`
implies — deliver it here at the type layer; the `.mjs` migration it
mentions stays out of scope).

## Step 3 — `runtime` normalizer returns

In `contract.d.ts`, replace each `normalize*(...): Record<string, unknown>`
with the real shape: read each normalizer in `contract.mjs`, declare the
output interface it constructs (`ArtifactRef` and `Blocker` already exist in
this file — the normalizers that produce them must return them), and add the
missing interfaces (`RuntimeEventShape`, `ResumePlanShape`, … — name them
after what the functions build, matching `events.d.ts` naming style).
Cross-check against `packages/contracts/src/journey.ts`'s
`MissionArtifactRefSchema`: where the two `ArtifactRef` notions are the same
shape, note it with a comment referencing the schema (`// matches
@ge/contracts MissionArtifactRef — merge tracked by the action-kinds
reconciliation spec`); do NOT merge the packages here (that judgment call is
explicitly deferred, see 00-orchestration "OUT of this campaign").

## Definition of done

- [ ] `grep -c ': any' packages/run-ledger/src/*.d.ts` → 0;
      `grep -c 'Record<string, unknown>' packages/runtime/src/contract.d.ts` → 0
      (named `& Record<string, unknown>` extensions with comments are fine —
      bare ones are not).
- [ ] `bunx tsc --noEmit -p packages/run-ledger` and
      `… -p packages/runtime` green; `@ts-expect-error` probes present.
- [ ] Console still typechecks/builds: `bun run build:console` green (it is
      the main TS consumer of both).
- [ ] Zero diff in any `.mjs` file (verify:
      `git diff --stat -- '*.mjs'` empty).
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Editing runtime behavior, renaming exports, or `.mjs`→`.ts` migration.
- `any` (including implicit) anywhere in the touched `.d.ts` files.
- Merging `@ge/runtime` into `@ge/contracts` (tracked separately).
