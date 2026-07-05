# WS1 — Fix the two real correctness bugs the audit surfaced

**Status:** `[ ]` open
**Write-set:** `apps/factory/scripts/spec-to-okf.test.mjs` ·
`tools/known-test-failures.json` (trim only, last step) ·
`packages/run-ledger/src/firestore.mjs` (the `recordEvent` function body
only) · `packages/run-ledger/src/adapter-parity.test.mjs` (the stage-blanking
sub-test inside `describe("KNOWN DIVERGENCE", ...)` only — the seq-value
sub-test in the same block is a documented, accepted design difference; do
not touch it)
**Depends on:** nothing. **Blocks:** nothing (scheduled Wave 1 alongside WS5
because both are small, contained, and de-risk everything downstream).

## Problem (verified 2026-07-05 — re-verify before editing; line numbers drift)

This workstream folds together the audit's TOP-10 #1 and #2. Both looked, on
paper, like "generator bugs." Investigation this session (reproducing both
failures directly, then tracing each root cause) found one is real and one
is not what the audit's label ("spec-to-okf.mjs id-mangling") suggests —
**read this section before touching either file**, it changes the fix.

### 1a. The "id-mangling" bug is a stale test assertion, not a generator bug

`tools/known-test-failures.json`'s two `kind: "bug"` entries (`round-trip
recovers tool names, systems, and workflow step order` and `capability
spine: queries/, tests/, documents/ concepts emitted + round-trip`, both
`addedAt: "2026-07-01"`) both fail on the same two lines:

```
apps/factory/scripts/spec-to-okf.test.mjs:125
  expect(recoveredOrder[0]).toBe("balance__document__pull");
apps/factory/scripts/spec-to-okf.test.mjs:179
  expect(balance.stage).toBe("balance__document__pull");
```

Reproduced directly: `bun test ./apps/factory/scripts/spec-to-okf.test.mjs`
→ `11 pass, 2 fail`, both failures `Expected: "balance__document__pull"
Received: "balance_document_pull"` (double vs. single underscore).

Traced with a throwaway script that materializes the real bundle and
compiles it back (do this yourself before trusting this doc — data drifts):
```js
import { specToOkf } from "apps/factory/scripts/spec-to-okf.mjs";
import { compileOkfBundle } from "apps/factory/scripts/okf-to-spec.mjs";
// materialize "account-reconciliation-agent", then read
// workflow/balance-document-pull.md — its frontmatter already reads
// `source_id: balance_document_pull` (SINGLE underscore) on disk, before
// any round-trip. compileOkfBundle() recovers exactly that string. The
// round-trip is LOSSLESS: line 124 in the same test
// (`expect(recoveredOrder).toEqual(originalOrder)`, a DYNAMIC comparison
// against the real catalog spec, not a hardcoded literal) PASSES.
```
Confirmed further: `apps/factory/generated/use-cases.generated.json` (the
gitignored, locally-synced catalog — not tracked in git, `git log` on it is
empty) and the checked-in `okf/account-reconciliation-agent/spec.json` (the
already-registered real agent bundle) **both** already store this step's id
as `balance_document_pull` — single underscore. There is no data source
anywhere in this repo with the double-underscore form as the *true*
original id.

Root cause of the double-underscore *expectation*: the step id is minted by
`safePyName()` in `packages/std/src/naming.mjs:57`, which calls
`snakeCase()` (from the `change-case` package, `naming.mjs:9`). That file's
own header comment (`naming.mjs:3-8`) documents an intentional migration:
*"change-case splits camelCase/PascalCase AND runs of capitals at word
boundaries... instead of the per-letter `salesforce__c_r_m` the old
hand-rolled regex emitted."* The two failing assertions were written against
the **old hand-rolled regex's** output (double-underscore-heavy) and were
never updated when the naming pipeline migrated to `change-case`'s cleaner,
canonical, single-underscore output. `git log -p` on
`spec-to-okf.test.mjs` shows both literals introduced together, already
carrying the stale expectation, no later commit revisiting them.

**Conclusion:** `spec-to-okf.mjs` and `okf-to-spec.mjs`'s round-trip is
correct and lossless today. `tools/known-test-failures.json`'s framing
("an OKF round-trip normalization discrepancy in spec-to-okf.mjs") is
itself imprecise — file it as: two stale hardcoded literals in the test,
bit-rotted by an intentional, already-shipped naming improvement elsewhere.
The fix is a **test-only** change (update two literals from
`"balance__document__pull"` to `"balance_document_pull"`), not a
`spec-to-okf.mjs` behavior change.

**Before you fix it: re-verify this is still true.** If `naming.mjs`,
`use-cases.generated.json`'s generator, or the checked-in
`okf/account-reconciliation-agent/spec.json` have changed since
2026-07-05, re-run the reproduction above — don't take this doc's word for
a fast-moving generated artifact.

### 1b. Firestore mirror really does blank per-item stage history — this one is real

`packages/run-ledger/src/adapter-parity.test.mjs`'s
`describe("KNOWN DIVERGENCE", ...)` block (~line 188-226) documents two
divergences between the SQLite ledger and its Firestore mirror. One
(seq values: SQLite is a monotonic counter, Firestore falls back to
`Date.now()` ms) is an accepted design difference — leave it. The other is
a real data-loss bug:

- `packages/run-ledger/src/firestore.mjs`'s `recordEvent` (~line 268-280)
  writes, on every event for a work item:
  ```js
  await runDoc(runId).collection("items").doc(String(event.workItemId)).set(
    { stage: event.stage ?? null, status: event.status, ... }, { merge: true },
  );
  ```
  This unconditionally sets `stage` to `event.stage ?? null`. An
  `item_done` event carries no `.stage` (it signals completion, not a
  specific stage) — so its `?? null` clobbers whatever stage was
  previously recorded, even though `{merge:true}` on the surrounding
  `.set()` would otherwise have left untouched fields alone.
- `summarizeRunDoc` (~line 125-155) then reads that single materialized
  field: `stages: item.currentStage || item.stage ? [{ name: ..., status:
  ... }] : []` — so a completed item's `getRun().results[].stages` comes
  back `[]` (empty), where the SQLite side
  (`packages/run-ledger/src/store.mjs`'s `itemStages`, ~line 185) replays
  the full `ledger_events` history and returns every stage the item
  visited, e.g. `[{name:"created",status:"done"},
  {name:"validated",status:"done"}]`.
- `store.mjs`'s own `recordTransition` (~line 156) has the forward-only
  guard the Firestore mirror lacks: `const advance = stage && (status ===
  "reset" || !existing || stageIndex(stage) >= stageIndex(existing.stage));`
  — it never regresses/blanks the current stage on a stage-less event.

**Fix, scoped narrowly (do not touch anything else in this file):** give
`recordEvent` the same forward-only discipline — when `event.stage` is
falsy, omit the `stage` field from the item-doc write entirely (so
`{merge:true}` actually preserves the prior value) instead of writing
`null`. This does not require replaying full history to match SQLite's
multi-entry `stages[]` array (that would be a larger, separately-scoped
change to `summarizeRunDoc`'s per-item shape) — it stops the *regression to
empty*, which is the data-loss the audit flagged as "load-bearing: any
remote-mode console/CLI reader of `getRun().results[].stages` sees far less
than the SQLite path." Read the full comment block above the `describe`
(~line 188-197) before editing — it explains why this lives in a "KNOWN
DIVERGENCE, reported not silently normalized" section and what NOT to
change without a deliberate decision (the seq-value test's assertions).

## Target

`bun run test:gated` reports zero `kind: "bug"` entries remaining relevant
in `known-test-failures.json` (both trimmed once green), and
`adapter-parity.test.mjs`'s Firestore reader returns a non-empty,
non-regressed `stages[]` for a completed item whose last event carried no
stage — matching the guarantee SQLite already gives, without requiring full
multi-stage history parity (that's a bigger, separately-scoped ask; see
Forbidden).

## Step 1 — pin current (buggy) behavior before changing anything

Both fixes already have their oracle: the two failing tests themselves are
the verification net (they exist, they're red, they'll go green). No new
oracle file is needed. Before Step 2, run and record the CURRENT (failing)
output of both:
```bash
bun test ./apps/factory/scripts/spec-to-okf.test.mjs   # expect 11 pass, 2 fail (as above)
bun test packages/run-ledger/src/adapter-parity.test.mjs  # expect the stage-blanking sub-test to fail if you assert the FIXED behavior against it first (negative-test check)
```

## Step 2 — fix 1a: update the two stale literals (test-only, no BEHAVIOR-CHANGE tag needed — the generator's behavior is unchanged)

In `apps/factory/scripts/spec-to-okf.test.mjs`:
- Line 125: `"balance__document__pull"` → `"balance_document_pull"`.
- Line 179: `"balance__document__pull"` → `"balance_document_pull"`.
- Re-grep the same file and `okf-to-spec.mjs`/`spec-to-okf.mjs` for any
  OTHER hardcoded double-underscore literal keyed off the same step (there
  were several in a similar-looking test file in git history for a
  different, already-passing test — the "strengthened OKF concepts" test's
  own hand-written fixture at ~line 401-407 uses a **hand-authored** spec
  object with a literal `id: "balance__document__pull"` as *input* data,
  which is fine and untouched — do not confuse fixture input with recovered
  output. Only fix assertions on RECOVERED values that came from the real
  catalog.
- Run `bun test ./apps/factory/scripts/spec-to-okf.test.mjs` → expect
  `13 pass, 0 fail`.

## Step 3 — fix 1b: forward-only stage guard in the Firestore mirror

In `packages/run-ledger/src/firestore.mjs`'s `recordEvent`, change the
item-doc write so a falsy `event.stage` does not overwrite the persisted
`stage` field:

```js
const itemPatch = { status: event.status, workspaceId: event.workspaceId ?? null, error: event.error ?? null, updatedAt: ts };
if (event.stage) itemPatch.stage = event.stage; // forward-only: never blank a recorded stage on a stage-less event (mirrors store.mjs's recordTransition guard)
if (event.workItemId) {
  await runDoc(runId).collection("items").doc(String(event.workItemId)).set(itemPatch, { merge: true });
}
```

`BEHAVIOR-CHANGE`: this changes what the Firestore mirror persists for
work items on stage-less events. Land it as its own commit, subject naming
the change (e.g. `fix(run-ledger): stop Firestore mirror from blanking
item stage on stage-less events`).

## Step 4 — update the oracle: retire the stage-blanking KNOWN DIVERGENCE sub-test

In `packages/run-ledger/src/adapter-parity.test.mjs`, the sub-test titled
`"getRun().results[].stages: SQLite keeps the FULL per-item stage
timeline; Firestore's item doc only ever holds the CURRENT stage..."`
currently asserts `expect(fsRun.results[0].stages).toEqual([])`. Update it
to assert the NEW (fixed) behavior — the last non-empty stage survives,
e.g. `expect(fsRun.results[0].stages).toEqual([{ name: "validated", status:
"done" }])` (re-derive the exact expected value from the test's own driving
events — do not guess; run the test and read the actual output first). Move
this sub-test OUT of the `describe("KNOWN DIVERGENCE", ...)` block into the
main parity test body (it's no longer a divergence) — leave the seq-value
sub-test as the sole remaining member of that `describe` block, and update
its surrounding comment (~line 188-197) to say "one divergence" not "two."
Do NOT touch the seq-value sub-test's assertions.

## Step 5 — trim `known-test-failures.json`

Only after both fixes are green (`bun run test:gated` reports neither test
name failing): remove the two `kind: "bug"` entries (`round-trip recovers
tool names...` and `capability spine: queries/, tests/, documents/...`)
from `tools/known-test-failures.json`'s `failures` array. Do not touch the
`kind: "env"` entries.

## Definition of done

- [ ] `bun test ./apps/factory/scripts/spec-to-okf.test.mjs` → `13 pass, 0 fail`.
- [ ] `bun test packages/run-ledger/src/adapter-parity.test.mjs` → all pass;
      `describe("KNOWN DIVERGENCE", ...)` contains exactly one `test(...)`
      (the seq-value one).
- [ ] `node -e "const j=JSON.parse(require('fs').readFileSync('tools/known-test-failures.json','utf8')); console.log(j.failures.filter(f=>f.kind==='bug').length)"`
      → prints `0`.
- [ ] Negative-test check (prove the assertions actually gate something):
      temporarily revert Step 3's fix, confirm the updated Step-4 assertion
      fails, then re-apply Step 3.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Do not "fix" `spec-to-okf.mjs`/`okf-to-spec.mjs`/`naming.mjs`'s id
  generation to produce double underscores — that would be reverting an
  intentional, already-shipped, documented naming improvement to satisfy a
  bit-rotted test literal. Verify Step 2's premise yourself; if you find it
  no longer holds (data sources changed), stop and report instead of
  patching around it.
- Do not attempt full multi-stage timeline parity for the Firestore mirror
  (replaying every historical stage transition to match SQLite's
  `itemStages()` array exactly) — that is a larger, separately-scoped
  change to `summarizeRunDoc`'s per-item shape and the events query it would
  need; this workstream only stops the *regression to empty*.
- Do not touch the seq-value `KNOWN DIVERGENCE` sub-test or its surrounding
  design rationale — it documents an accepted difference, not a bug.
- Do not widen `recordEvent`'s write beyond the `stage` field guard above.

---
Worker protocol (inherited from `00-orchestration.md`): worktree forks from
origin/main, so `git merge <integration-branch> --no-edit` FIRST if an
integration branch exists; commit incrementally with the repo's trailer
convention; never push, never stash; final report is raw data — branch,
`git log --oneline`, each DoD item with its actual output, deviations each
justified in one line. A separate reviewer re-runs the DoD before merge;
report, don't stretch scope.
