# WS5 — Strike done items from stale plans; record real vs. unverifiable deferrals

**Status:** `[ ]` open
**Write-set:** `docs/plans/taste-campaign/08-next-horizon.md` (strike
B2/B5/B6/B9 only) · `REFACTOR-HANDOFF.md` (§7 item 2's sentence only —
**shared with WS6, disjoint lines: WS6 edits the TIMEOUTS item, a different
numbered item in the same list**) · `docs/plans/audit-fix-wave/deferred.md`
(already drafted this session — keep current, this is this wave's own file)
· `apps/factory/src/factory-worker.js` (a comment near line 227-229, no
behavior change) · `packages/run-ledger/src/firestore.mjs` (a header
comment on `createFirestoreEventMirror`'s export only — **shared with WS1,
disjoint region: WS1 edits inside `recordEvent`'s body, this workstream
edits the export's doc comment**) · `apps/factory/src/harness-python.js` ·
`packages/byo-systems/src/index.mjs` · `apps/console/src/server/systems.mjs`
· `tools/lib/models-doctor.mjs` · `tools/lib/doctor/engine.mjs` (comment
annotations only, unless the extraction path is chosen — see 5f)
**Depends on:** nothing. **Blocks:** nothing.

## Problem (verified 2026-07-05 — re-verify before editing; docs drift fast)

Five small, independent truthing/annotation items — none behavior-changing,
all correcting a doc or adding a decision-recording comment where one is
missing.

### 5a. `08-next-horizon.md` cites four items that are already done or deleted

- **B2** (`docs/plans/taste-campaign/08-next-horizon.md:92-104`): cites
  `toMcpSchema`/`buildCloudDataArtifacts`... wait, actually cites
  `toMcpSchema`/`buildCliArgsForConfig` at `tools/lib/config-schema.mjs:228,240`.
  Verified: `tools/lib/config-schema.mjs` exports neither symbol today
  (`grep -n "toMcpSchema\|buildCliArgsForConfig"
  tools/lib/config-schema.mjs` → no match); the only remaining reference
  anywhere in the repo is the B2 paragraph itself. The deletion already
  happened (by some earlier, untracked cleanup); the doc just never caught
  up.
- **B5** (`08-next-horizon.md:121-125`, "Shell completions from the citty
  tree"): `tools/ge/completions.mjs` (132 lines) exists, renders
  bash/zsh/fish, registered in `tools/ge.mjs:62`. Verified done. B5's own
  text already half-admits this is now moot ("citty 0.2.2 has no completion
  support... a `ge completions bash|zsh|fish` generator is the same walk");
  it was written as a proposal and has since been implemented.
- **B6** (`08-next-horizon.md:127-132`, "`llms.txt` + `llms-full.txt`"):
  `apps/docs/src/pages/llms.txt.js`, `llms-full.txt.js`,
  `apps/docs/src/lib/llms.mjs`, and a test
  (`apps/docs/tests/llms-txt.test.mjs`) all exist. Verified done.
- **B9** (`08-next-horizon.md:153-162`, "Run replay — the flagship
  experience item"): `ge runs replay` (`tools/ge/runs.mjs:215`) and a
  console scrubber (`apps/console/src/hooks/useRunScrubber.ts`, wired in
  `RunDrawer.tsx:19-95`) both exist. Verified done.

### 5b. `REFACTOR-HANDOFF.md` §7 item 2 says the silent-catch sweep is "still
open" — it isn't

`REFACTOR-HANDOFF.md:127`: *"The broad sweep over the remaining catches is
still open."* Verified: `tools/check-silent-catches.mjs` exists, is wired
into `package.json`'s `source:hygiene` chain, and running it today
(`node tools/check-silent-catches.mjs`) prints `✓ no undocumented silent
catches (9 deploy-path site(s) allowlisted)` — clean. The sweep landed
2026-07-02 (per the taste-campaign's own WS6 doc,
`docs/plans/taste-campaign/06-error-tier-and-orphans.md`, if that's the
originating workstream — verify which doc claims it before citing). §7's
numbered item 2 needs its final sentence corrected to reflect this; item 3
in the same §7 list ("The broad error-handling sweep over the remaining
silent catches") in the "Recommended next step" section a few lines further
down is the SAME stale claim repeated — check whether it needs the same
fix (read the surrounding paragraph before editing; don't fix one and miss
its restatement).

### 5c. `allowUnpromoted`: a naming collision between a config field and a
payload field, not a bug — worth one clarifying comment

Two different `allowUnpromoted` values exist and are easy to conflate:
- `tools/lib/config-schema.mjs:115-118` — a `.ge.json`/env/flag-resolved
  **config** field (`CONFIG_FIELDS.allowUnpromoted`), guarded by a
  regression test (`tools/lib/config-schema.test.mjs:229-239`, which
  itself documents that `cfg.allowUnpromoted` is intentionally NOT read
  anywhere in JS — "Python and process.env read the env var directly").
- `apps/factory/src/factory-worker.js:227,229` — a **payload** field,
  `payload.options?.allowUnpromoted`, read from a per-run request object
  (job payload), completely unrelated to the config resolver above; its
  presence adds `--force` to a harness invocation when a run's harness
  verdicts haven't passed.
Same name, two different data paths (persistent config vs. one-shot
payload), no shared code, no actual bug — but a future reader grepping
`allowUnpromoted` will find both and reasonably wonder if they're the same
thing. Add a one-line comment at the payload site (`factory-worker.js:227`)
noting the distinction and pointing at `config-schema.mjs`'s entry, so the
next person who greps doesn't have to re-derive this. Do not rename either
field — renaming the payload field is a legitimate alternative (the audit
allows either), but renaming touches every caller that constructs a job
payload with `options.allowUnpromoted`, which is a wider, riskier change
for a naming-clarity-only problem; the comment is the S-effort fix, a
rename is not what this workstream signs up for. If a future worker
decides the rename is worth it, that's a new, separately-scoped decision.

### 5d. `createFirestoreEventMirror` needs a "dormant until cloud" annotation

`packages/run-ledger/src/firestore.mjs:232`'s `createFirestoreEventMirror`
is real, working code (WS1 fixes a real bug inside it) with exactly two
non-test consumers: a re-export at
`tools/lib/ledger/run-ledger-firestore.mjs:8` and a compile-time-only
reference in `packages/run-ledger/typecheck.ts:40,201`. No runtime
invocation exists in `apps/console` or `apps/factory` today.
`docs/adr/0001-remote-control-plane.md:132,177` documents it as intended
cloud wiring (a future cloud-worker consumer, not dead code). Add a header
comment on the export (in `firestore.mjs`, above `export async function
createFirestoreEventMirror`) stating: real, wired for a future
cloud-worker consumer per ADR 0001 (link the two line numbers), currently
invoked only by its own tests + the re-export + typecheck — not yet called
from any running server. This is the KEEP-BUT-DOCUMENT action the audit
asked for; do not wire a runtime consumer as part of this (that's a
product decision belonging to whoever builds the cloud worker, out of
scope here).

### 5f. `GE_HARNESS_PYTHON` resolution: four implementations, three deliberate — annotate or extract, decide which

Verified four resolvers of the harness Python interpreter:
- `apps/factory/src/harness-python.js:26` `resolveHarnessPython()` — the
  canonical implementation (GE_HARNESS_PYTHON → repo `.venv` → `python3`).
- `packages/byo-systems/src/index.mjs:61-66` — its own comment already
  says *"mirroring resolveHarnessPython()"* — a deliberate, commented copy
  (this package can't import `apps/factory/src/*` per the layering rule).
- `apps/console/src/server/systems.mjs:19,31` — its comment says
  *"mirroring resolveHarnessPython()"* too, but READ the actual code: it
  **delegates** to a shared resolution rather than re-implementing (verify
  this at implementation time — the audit's finding distinguishes "mirrors
  the comment" from "mirrors the code," and console's file is closer to
  the former in spirit but may already just be a thin wrapper; confirm
  before writing the annotation, since the accurate description differs
  for a delegate vs. a copy).
- `tools/lib/models-doctor.mjs:62-70` `resolveHarnessPythonStructural` —
  explicitly commented as citing the `tools/lib` ↛ `apps` layering rule
  (this file can't import `apps/factory/src/harness-python.js` either,
  same reason as `byo-systems`).
- `tools/lib/doctor/engine.mjs:124-150` — inline venv resolution, comment
  at ~125 references `harness-python.js`'s `resolveHarnessPython` by name.

Three of four are ALREADY commented as deliberate mirrors/delegations
citing the real layering constraint (`tools/lib` and `packages/byo-systems`
genuinely cannot import from `apps/factory/src`). The audit's suggested fix
is optional: extract the shared 3-step resolution logic (GE_HARNESS_PYTHON
env → repo `.venv` → `python3` probe) into `@ge/std` (`packages/std/src/`,
already a dependency-free layer both `apps/*` and `tools/lib/*` can import
— see its existing `naming.mjs`/`gcp-config.mjs` for the house pattern of
"one canonical helper, multiple deliberate consumers").

**Decision the worker must make and record:** (a) extract a
`packages/std/src/harness-python.mjs` with the shared resolution steps,
have all four/five sites import it (removing the "mirroring" comments in
favor of an actual shared import — this closes the layering gap properly),
or (b) leave the four implementations as-is and simply verify/tighten the
existing comments so each site's relationship to the canonical
implementation is accurate (mirror vs. delegate vs. structural
re-implementation — get the verb right per site). Extraction (a) is the
architecturally cleaner fix and is genuinely aligned with `@ge/std`'s
stated purpose; annotation (b) is the lower-risk, smaller-effort fix. This
workstream defaults to (b) given its S-effort budget — if you have budget
and confidence for (a), it's a legitimate upgrade, but state explicitly
that you're doing more than this doc's baseline asks.

### 5e. `deferred.md` — session-only deferrals, verified honestly

This wave's own file, already written (see it in this directory). Keep it
current if anything here changes during implementation; it is this
workstream's write-set, not a new deliverable to draft from scratch.

## Target

Every plan doc this wave touches says only things that are true today.
Every naming collision or dormant-code question the audit raised has
either a recorded decision (a comment) or an honest "could not verify"
note — nothing is silently left ambiguous.

## Step 1 — verification net

None of this is behavior-changing, so the "oracle" is `bun run docs:gate`
and `node tools/docs-check.mjs` staying green (these docs are outside
`SKIP_DIRS`/`EXCLUDED_DOC_DIRS`, unlike `docs/plans/**` itself — verify
`REFACTOR-HANDOFF.md` and `08-next-horizon.md`'s directory status before
assuming either gate applies or doesn't; `08-next-horizon.md` lives under
`docs/plans/taste-campaign/`, which — like this wave's own directory — IS
in both `SKIP_DIRS` and `EXCLUDED_DOC_DIRS`, so only `REFACTOR-HANDOFF.md`
at repo root is actually gated by `docs:gate`'s link/tone checks). Run both
green before editing, to isolate any failures this workstream introduces
from pre-existing ones.

## Step 2 — 5a: strike B2/B5/B6/B9

In `08-next-horizon.md`, mark each of B2, B5, B6, B9 as done/struck (match
the file's own convention — it doesn't currently have a "done" marker
convention distinct from its numbered-item prose; add one, e.g. a `**DONE
— struck 2026-0X-0X, see docs/plans/audit-fix-wave/01-...**` prefix, or
move struck items to a trailing "Resolved" section — pick whichever reads
better against the existing doc's structure, state which you picked). Do
not delete the prose outright — historical record of what was proposed and
why is useful; mark it resolved, don't erase it.

## Step 3 — 5b: fix the silent-catch staleness in `REFACTOR-HANDOFF.md`

Update §7 item 2's final sentence and its restatement further down (verify
both exist and both need the fix — re-read Problem 5b). State the current
count (9 deploy-path allowlisted sites, run `node
tools/check-silent-catches.mjs` yourself for the current number — it may
have drifted from 9 since 2026-07-05).

## Step 4 — 5c: the `allowUnpromoted` clarifying comment

Add the one-line comment at `factory-worker.js:227` per Problem 5c.

## Step 5 — 5d: the `createFirestoreEventMirror` annotation

Add the header comment per Problem 5d. Coordinate with WS1 (same file,
disjoint region) — if WS1 has already landed, rebase past its `recordEvent`
change; your comment goes on the export above it, not inside it.

## Step 6 — 5f: `GE_HARNESS_PYTHON` decision

Read all five sites listed in Problem 5f before writing anything — confirm
the "mirror" vs. "delegate" vs. "structural re-implementation" verb is
accurate per site (don't copy the audit's characterization blind). Then
either (a) extract `packages/std/src/harness-python.mjs` and repoint the
four consumers (a small `BEHAVIOR-PRESERVING` refactor — the resolution
logic doesn't change, only where it lives; verify with each site's existing
tests before/after), or (b) tighten each site's comment to accurately
describe its relationship to `apps/factory/src/harness-python.js`'s
canonical resolver. State which you did and why in the PR description.

## Definition of done

- [ ] `grep -n "B2\|B5\|B6\|B9" docs/plans/taste-campaign/08-next-horizon.md`
      shows all four marked resolved/struck, not silently deleted.
- [ ] `REFACTOR-HANDOFF.md`'s silent-catch claim(s) match
      `node tools/check-silent-catches.mjs`'s actual current output.
- [ ] `apps/factory/src/factory-worker.js:227` has the clarifying comment;
      `tools/lib/config-schema.mjs`'s `allowUnpromoted` entry is unchanged
      (no rename).
- [ ] `packages/run-ledger/src/firestore.mjs`'s `createFirestoreEventMirror`
      has the dormant-until-cloud header comment, citing
      `docs/adr/0001-remote-control-plane.md`'s specific lines.
- [ ] `bun run docs:gate` and `node tools/docs-check.mjs` green.
- [ ] Each of the five `GE_HARNESS_PYTHON` sites (Problem 5f) either
      imports the new `@ge/std` helper (path a) or carries an accurate,
      verified (not copy-pasted) comment describing its actual relationship
      to the canonical resolver (path b) — state which path in the PR.
- [ ] Full gate + `bun run test:gated` green (no test-affecting changes
      expected outside 5f's path (a) if chosen, but the standing rule
      applies to every commit regardless).

## Forbidden

- Renaming `payload.options.allowUnpromoted` or
  `CONFIG_FIELDS.allowUnpromoted` — comment-only clarification, per 5c's
  reasoning.
- Wiring a runtime consumer for `createFirestoreEventMirror` — annotation
  only; consuming it is a product decision for whoever builds the cloud
  worker.
- Deleting struck items from `08-next-horizon.md` outright — mark
  resolved, keep the historical record.
- Touching any `08-next-horizon.md` item other than B2/B5/B6/B9 (its Part
  A anti-patterns, and B1/B3/B4/B7/B8 are explicitly WS6's or out of this
  wave's scope — see `00-orchestration.md`'s write-set matrix).
- Editing `REFACTOR-HANDOFF.md`'s TIMEOUTS queued-work item — that line is
  WS6's, not this workstream's.
- If path (a) is chosen for 5f: changing the actual resolution algorithm
  (env → `.venv` → `python3` probe order) while extracting it — verbatim
  move only, this is not the workstream to also fix/improve the resolution
  logic itself.

---
Worker protocol (inherited from `00-orchestration.md`): worktree forks from
origin/main; commit incrementally with the repo's trailer convention; never
push, never stash; final report is raw data — branch, `git log --oneline`,
each DoD item with its actual output, deviations each justified in one
line. A separate reviewer re-runs the DoD before merge.
