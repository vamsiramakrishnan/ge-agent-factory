# WS6 — A minimal linter; route `tools/` clocks through source-clock; decide TIMEOUTS

**Status:** `[ ]` open
**Write-set:** NEW `.oxlintrc.json` · `package.json` (new `lint` script +
`source:hygiene`/`ci` wiring) · `tools/docs-shots/*.mjs` · `tools/ge/agents.mjs`
· `tools/ge/drive.mjs` · `tools/lib/factory-runs.mjs` · `REFACTOR-HANDOFF.md`
(the TIMEOUTS queued-work item near line 106 only — **shared with WS5,
disjoint line: WS5 edits §7 item 2, a different numbered item in the same
list**)
**Depends on:** nothing. **Blocks:** nothing.

## Problem (verified 2026-07-05 — re-verify before editing)

### 6a. There is no linter — greenfield, pick one

Verified: `grep -rn "\"oxlint\"\|\"@biomejs" package.json apps/*/package.json
packages/*/package.json` (excluding `node_modules`) returns nothing —
neither tool is installed anywhere. `bun run --filter '*' lint` matches
exactly two workspaces (`apps/console`, `apps/presentation`,
`package.json:12` in each) and both scripts actually run `tsc --noEmit` —
typechecking mislabeled as linting, not a real lint. Zero eslint/biome/
oxlint config exists anywhere in the repo.

**Decision, made here (state the justification in the PR, don't silently
follow it): oxlint.** Reasoning, all verified against this specific repo's
shape, not generic tool-comparison prose:
- The repo is Bun-first (`bunfig.toml`, workspace `.mjs`/`.js`/`.ts` mixed,
  no webpack/babel toolchain) — oxlint is a single native binary, zero
  plugin ecosystem to migrate (there is nothing to migrate from, per the
  audit's own B1 note), and needs no separate formatter decision (this
  workstream is lint-only, not format — don't conflate the two).
  Biome is a reasonable alternative (it bundles a formatter too) but
  that's scope this workstream doesn't need; pick oxlint for the narrower
  job unless a formatter decision is ALSO wanted, in which case say so
  explicitly and treat it as a separate, larger decision than "add a
  linter."
- `.mjs`/`.cjs`/`.js`/`.ts`/`.tsx` all need coverage across `apps/`,
  `tools/`, `packages/` — oxlint's default rule set covers plain JS/TS
  without a tsconfig-project setup cost per package (relevant here: this
  is a multi-package Bun workspace, not a single tsconfig project).
- Today's `lint` scripts in `apps/console`/`apps/presentation` actually
  typecheck. Rename them to `typecheck` (truthful naming; per the audit's
  own suggestion and consistent with WS7 of the taste-campaign already
  having introduced per-package `typecheck` scripts elsewhere) and add a
  NEW `lint` script backed by oxlint at the root, wired into `ci`
  (`package.json`'s `ci` script, not `source:hygiene` — a lint pass is
  advisory/style, not a hygiene-gate the way `check-no-app-imports.mjs` is;
  read `package.json`'s existing `ci` vs `source:hygiene` split before
  deciding which chain to extend, and match that existing split rather than
  inventing a third category).

### 6b. Residual `tools/` generators bypass `source-clock`

`apps/factory/src/source-clock.js` is already the centralized clock (the
sole non-test `GE_SOURCE_DATE` reader per the taste-campaign's B7 work,
mostly DONE — `bunfig.test-preload.mjs` pins `GE_SOURCE_DATE ||=
"2026-01-01T00:00:00.000Z"` for tests). Verified residual, still calling
raw `new Date()`/`Date.now()` directly instead of routing through
`source-clock.js`: `tools/docs-shots/*.mjs`, `tools/ge/agents.mjs`,
`tools/ge/drive.mjs`, `tools/lib/factory-runs.mjs` (re-grep each at
implementation time — `grep -n "new Date()\|Date\.now()"` across these
paths — the exact call sites drift).

### 6c. TIMEOUTS taxonomy — needs an explicit decision, not silence

`REFACTOR-HANDOFF.md:106`: *"`TIMEOUTS` taxonomy (factory.mjs, ~24 bare
timeout literals). Deferred because the same value serves different
operations (`60000` = gcloud-mutate / agents-info-read / scaffold /
IAM-grant), so any purpose-name lies at half its sites and a per-value
bucket is just the number renamed. Needs a deliberate timeout-policy
design, not a find-replace."* Verified: no `TIMEOUTS` const exists anywhere
in the codebase today (`grep -rn "^export const TIMEOUTS\|const TIMEOUTS ="`
returns nothing outside this prose). The doc's own reasoning is sound and
still holds — a bare rename-to-named-bucket would be actively misleading
(the audit's phrase: "lies at half its sites"). This workstream's job is
to convert an open, undecided item into an **explicit, named decision**:
either commit to building the real timeout-policy design (a genuinely
separate, larger effort — a decision to make, not default into), or
formally mark it won't-do-for-now with the criteria that would change that
call.

**Recommended default (state this in the PR, don't silently pick it):**
won't-do-for-now, with named unlock conditions: build the taxonomy only
when (a) a concrete incident/operator complaint ties back to an
undifferentiated timeout value, or (b) `factory.mjs`'s command surface
gets restructured enough (e.g. by a future decomposition wave) that the
~24 literals naturally separate into fewer, purpose-distinct call sites
where a real per-purpose bucket stops "lying." Record this as a decision in
`REFACTOR-HANDOFF.md`'s own queued-work item (rewrite it from "deferred,
needs design" prose into "decided: not now, here's why, here's the
unlock" — a named escape hatch, not silence). If a future worker disagrees
and wants to build it now, that's a legitimate call to make — but it
should be a deliberate choice against these stated conditions, not a
default.

## Target

`bun run lint` (root) runs oxlint across the workspace and is wired into
`ci`. `apps/console`/`apps/presentation`'s existing `lint` scripts are
renamed `typecheck` (truthful). The four named `tools/` files route their
timestamps through `source-clock.js`. `REFACTOR-HANDOFF.md`'s TIMEOUTS item
reads as a decision, not an open question.

## Step 1 — verification net first

- 6a: no oracle needed for adding a NEW tool with a fresh config (nothing
  regresses if `oxlint` starts from zero — the risk is false positives
  breaking `ci`, not a silent regression). Run oxlint once with default
  config against the whole repo BEFORE wiring it into `ci`, to see the
  starting error count; decide (and state) whether `ci` gates on zero
  errors immediately or starts as advisory (non-blocking) for one cycle
  while pre-existing findings get triaged. Don't silently make `ci` fail
  on day one from a wall of pre-existing findings nobody asked for in this
  workstream's scope.
- 6b: existing golden/determinism tests
  (`apps/factory/tests/*-golden.test.js` + `tests/golden-test-helpers.mjs`'s
  `GE_SOURCE_DATE` pin) are the regression net — if any of the four target
  files' output is asserted byte-exact anywhere, routing their clock
  through `source-clock.js` must not change that output under the pinned
  `GE_SOURCE_DATE`. Run the relevant golden tests green before touching
  each file, to confirm your baseline.
- 6c: no test oracle — this is a doc decision. The "oracle" is
  `bun run docs:gate` staying green on the edited `REFACTOR-HANDOFF.md`.

## Step 2 — 6a: add oxlint, rename the mislabeled `lint` scripts

1. Add `.oxlintrc.json` at repo root (minimal — default rule set to start;
   don't hand-tune rule severities without a reason, that's scope creep
   for a "there is no linter yet" workstream).
2. Add a root `package.json` `"lint"` script running oxlint across the
   workspace (exclude `node_modules`, `dist`, generated artifacts — mirror
   whatever glob exclusions `source-hygiene.mjs`/`check-no-app-imports.mjs`
   already use for consistency).
3. Rename `apps/console/package.json:12` and
   `apps/presentation/package.json:12`'s `lint` scripts to `typecheck`
   (they already run `tsc --noEmit`; only the label was wrong). Update any
   caller of the old `lint` name (`bun run --filter '*' lint`,
   `mise.toml` tasks, CI workflow files if any reference it) to the new
   name — grep before assuming nothing else calls it.
4. Wire the new root `lint` script into `package.json`'s `ci` chain (not
   `source:hygiene` — see Problem 6a's reasoning; verify this split against
   the actual current chains before committing to it).

## Step 3 — 6b: route the four files through `source-clock.js`

For each of `tools/docs-shots/*.mjs`, `tools/ge/agents.mjs`,
`tools/ge/drive.mjs`, `tools/lib/factory-runs.mjs`: replace direct
`new Date()`/`Date.now()` calls with whatever `source-clock.js` exports
(read its actual export shape first — `now()`? a `Date`-returning
function? match its existing contract, don't invent a new one). Run the
Step-1 golden tests after each file to confirm no byte-exact output
changed under the pinned clock.

## Step 4 — 6c: record the TIMEOUTS decision

Rewrite `REFACTOR-HANDOFF.md:106`'s TIMEOUTS item per Problem 6c's
guidance — state the decision (won't-do-for-now, or build-it-now if you
disagree and can justify the effort) and the named unlock conditions if
deferring.

## Definition of done

- [ ] `bun run lint` exists at root, runs oxlint, and its current
      pass/fail state (and whether it's wired as blocking or advisory in
      `ci`) is stated explicitly in the PR description.
- [ ] `apps/console/package.json` and `apps/presentation/package.json`'s
      `lint` scripts are renamed `typecheck`; every caller of the old name
      is updated (`grep -rn '"lint"\|run lint\| lint"' --include=package.json
      --include=mise.toml --include='*.yml'` shows no stale references to
      the renamed scripts under their old meaning).
- [ ] `grep -n "new Date()\|Date\.now()" tools/docs-shots/*.mjs
      tools/ge/agents.mjs tools/ge/drive.mjs tools/lib/factory-runs.mjs`
      returns zero matches (or only matches inside comments/tests, not
      live code paths).
- [ ] Relevant golden tests (Step 1) still pass, byte-exact, after Step 3.
- [ ] `REFACTOR-HANDOFF.md`'s TIMEOUTS item reads as a decision with named
      unlock conditions, not an open question.
- [ ] `bun run docs:gate` green.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Adding Biome instead of oxlint (or both) without re-opening the decision
  in 6a explicitly — if you disagree with the recommendation, say why in
  the PR, don't silently switch tools.
- Hand-tuning oxlint rule severities beyond the default config as part of
  this workstream — that's a second decision (which rules matter to this
  codebase), out of scope for "there is no linter yet."
- Making `ci` fail on day one against a large pre-existing-findings backlog
  without stating that tradeoff explicitly (advisory-first is fine, silent
  full-block is not).
- Building the actual TIMEOUTS taxonomy as a side effect of "deciding" on
  it — the decision in 6c is do-later-with-named-conditions by default;
  building it now is a legitimate but SEPARATE, larger effort requiring its
  own justification, not something to fold into this S/M-effort
  workstream.
- Editing `REFACTOR-HANDOFF.md`'s silent-catch item (§7 item 2) — that
  line is WS5's, not this workstream's.

---
Worker protocol (inherited from `00-orchestration.md`): worktree forks from
origin/main; commit incrementally with the repo's trailer convention; never
push, never stash; final report is raw data — branch, `git log --oneline`,
each DoD item with its actual output, deviations each justified in one
line. A separate reviewer re-runs the DoD before merge.
