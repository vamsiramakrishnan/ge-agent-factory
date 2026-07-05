# WS3 — Consolidate diverged constants; finish two partial conversions

**Status:** `[ ]` open
**Write-set:** `tools/lib/handoff-package.mjs` · `tools/lib/provision.mjs` ·
`skills/operating-console/scripts/audit-console-surface.mjs` ·
`packages/run-ledger/src/status.mjs` · `packages/run-ledger/src/reduce.mjs` ·
`packages/run-ledger/src/store.mjs` ·
`apps/factory/scripts/factory/registry.mjs` (the `mcp:` legacy-command
entry only, ~line 396) · NEW `tools/ge/mcp.test.mjs`-equivalent parse test
if one doesn't already cover the citty conversion (check `tools/ge/*.test.mjs`
first) · their tests
**Depends on:** nothing. **Blocks:** nothing.

## Problem (verified 2026-07-05 — re-verify line numbers before editing)

Four unrelated but similarly-shaped gaps: things that were done twice
(diverged), done partially (typed but unused), or done once and then
forgotten (auditing a view that no longer exists).

### 3a. Three diverged tar/rsync exclude lists

- `tools/lib/handoff-package.mjs:44-52` exports `HANDOFF_TAR_EXCLUDES`
  (7 items: `.venv`, `node_modules`, `__pycache__`, `.pytest_cache`, `runs`,
  `versions`, `.ge-harness`) with a header comment that already says the
  quiet part: *"provision.mjs still carries its own inline copy of this
  list rather than importing it from here... the two lists must be kept in
  sync by hand until that reconciliation happens."* This workstream IS that
  reconciliation.
- `tools/lib/provision.mjs:62-71` (`copyWorkspaces`'s rsync call): 9 items
  — the same 7 plus `*.pyc` and `.adk`/`.google-agents-cli`.
- `tools/lib/provision.mjs:~542` (a `tar` invocation inside a different
  function): the same 7 as `handoff-package.mjs`, hardcoded again,
  independently.
Zero of the three import from each other.

**The `.pyc`/`.adk` decision (state it, don't skip it):** `provision.mjs`'s
rsync list has two extra excludes the other two lack. Before consolidating,
decide: are `*.pyc` and `.adk`/`.google-agents-cli` universally safe to
exclude everywhere (add them to the canonical list, all three call sites
get them), or specific to the rsync-copy path (keep them as an
`EXTRA_RSYNC_EXCLUDES` addendum layered on top of the canonical list at
that one call site)? Read what `.adk`/`.google-agents-cli` actually are
(grep the repo for where they're written — likely harness-tool scratch
dirs) before deciding; if they can appear in a `tar`-packaged handoff too,
they belong in the canonical list, not a copy-only addendum.

### 3b. `RUN_STATUSES` exported but never consumed

`packages/run-ledger/src/status.mjs:10` exports `RUN_STATUSES = ["pending",
"running", "blocked", "done", "failed"]` and a `STATUS_MAP` normalizer, with
a `status.d.ts` type consumed only by `typecheck.ts`. But
`packages/run-ledger/src/reduce.mjs` (lines ~42, 63, 65, 86, 103) and
`store.mjs` (lines ~156, 204, 235, 317) all compare raw string literals
(`"pending"`, `"blocked"`, `"failed"`, `"done"`, `"running"`) directly,
never importing `RUN_STATUSES`/`STATUS_MAP`. The const and the literals
have not drifted (all comparisons above are literals that already appear in
`RUN_STATUSES`) — this is not a live bug, but it is exactly the "hand-mirrored
constant" the house rules forbid (see `00-orchestration.md` rule 8):
one file declares the vocabulary, five call sites re-assert it by string
literal with no import-time guarantee they stay aligned.

### 3c. `audit-console-surface.mjs` silently audits nothing

`skills/operating-console/scripts/audit-console-surface.mjs:14` checks
`apps/console/src/views/Autopilot.tsx` for needles (`"Mission Contract"`,
`"Mode Contract"`, `"Start Autopilot"`) and `ge-api.mjs`/`transport.mjs`/
`job-store.mjs`/`geClient.ts` for autopilot-era strings
(`autopilotStart`, `startAutopilotRun`, `resumeAutopilotRun`, `mission:`,
etc.). Verified: `apps/console/src/views/Autopilot.tsx` does not exist;
`grep -rn "autopilot\|mission" apps/console/src` hits only
`lib/startInterview.ts` — the console surface this script audits was
renamed/removed and the script was never updated. It currently reports
"ok" or "fail" against a view that isn't there, giving false assurance
either way (a `missing: ["file"]` result for that one row, buried among
five other rows that may still pass).

### 3d. `mcp` command still legacy, not citty

`apps/factory/scripts/factory/registry.mjs:324-326` (comment) + `:396`
(`mcp: legacy("mcp", "MCP tool-plane operations", handlers.mcp, true, {...})`)
— explicitly flagged in its own surrounding comment as needing citty
subcommands (`plan|list|enable|disable`), unlike `deploy`/`register`/
`batch-audit`/`harness-review`/`harness-refine`/`quality-gate` which stay
legacy for concrete, still-valid reasons documented right there. `ge`'s own
`mcp` command (`tools/ge/mcp.mjs`, already citty: `defineCommand({ meta:
{name:"mcp"...}, subCommands: {deploy, doctor} })`) is the pattern to copy
— it only has 2 sub-actions (`deploy`/`doctor`, a different tool-plane
surface than factory's `mcp` which does `plan|list|enable|disable` against
GCP APIs/Agent Registry, read `apps/factory/scripts/factory/lifecycle/deploy.mjs:181`
`cmdMcp` before assuming the shapes match — they don't, factory's `mcp` is
richer). `cmdMcp` shells to `gcloud services list/enable` and `gcloud alpha
agent-registry` — this is a deploy-path command per house rule 4: convert
the *dispatch shape* (legacy string-flag → citty subcommands with typed
args), do not attempt to runtime-verify the gcloud calls themselves.

## Target

One canonical tar-exclude constant, imported at all three call sites (no
independent copies). `RUN_STATUSES`/`STATUS_MAP` are the thing `reduce.mjs`/
`store.mjs` compare against, not a parallel literal vocabulary.
`audit-console-surface.mjs` either audits the console surface that
currently exists, or is retired in favor of `bun run docs:console-api`'s
generated registry gate (pick one, don't leave both half-covering the same
ground). `factory`'s `mcp` command is a citty subcommand tree, parse-verified
identical to today's dispatch for every existing invocation shape.

## Step 1 — verification net first

- 3a: no existing byte-exact oracle for the packaged archive's file list;
  write one. NEW test (co-locate with `tools/lib/handoff-package.test.mjs`
  if it exists, else add a `describe` block there) that asserts the
  canonical exclude list is imported (not re-declared) at all three call
  sites — a simple `grep`-based structural test is fine here (the pattern
  `check-no-app-imports.mjs`/`check-silent-catches.mjs` use: read the
  source files as text, assert an import statement exists, assert no
  sibling array literal with the same 7+ string set exists elsewhere).
- 3b: `packages/run-ledger`'s existing test suite (`store.test.mjs`,
  `reduce.test.mjs` if present — `ls packages/run-ledger/src/*.test.mjs`)
  is the regression net; run it green before touching comparisons.
- 3c: no oracle exists (it's a broken script); Step 4 below either builds
  one (rewritten needles, still hand-maintained but now correct) or retires
  the file — the decision IS the oracle question.
- 3d: `apps/factory/scripts/factory/registry.mjs`'s own parse-level tests
  (grep `registry.test.mjs` or wherever `legacy()`/citty dispatch is
  tested) — run green first, they're your parity net for the conversion.

## Step 2 — 3a: consolidate tar/rsync excludes

1. Decide the `.pyc`/`.adk`/`.google-agents-cli` question (Problem 3a).
2. In `tools/lib/handoff-package.mjs`, extend `HANDOFF_TAR_EXCLUDES` if the
   decision folds them in, and update the header comment to state the
   reconciliation is done (remove the "kept in sync by hand" caveat).
3. In `tools/lib/provision.mjs`, replace both inline copies
   (`copyWorkspaces`'s rsync list at ~line 62-71, and the `tar` invocation
   at ~line 542) with imports of the canonical constant from
   `handoff-package.mjs`. If the decision was "addendum, not universal,"
   layer `[...HANDOFF_TAR_EXCLUDES, "*.pyc", ".adk", ".google-agents-cli"]`
   at the rsync call site only, still importing the base list rather than
   re-typing it.
4. Run the new structural test from Step 1; confirm it fails against the
   OLD (three-copy) state if you check it out on a clean stash-free branch
   first (negative-test check), then passes after this step.

## Step 3 — 3b: route status comparisons through the const

In `packages/run-ledger/src/reduce.mjs` and `store.mjs`, replace each raw
string-literal comparison against a `RUN_STATUSES` member (lines listed in
Problem 3b) with `RUN_STATUSES.includes(...)`/direct references to the
imported constant, or `STATUS_MAP` where a mapping (not a set-membership
check) is what's actually happening — read each call site's intent before
mechanically swapping; some are equality checks (`existing.status ===
"blocked"`), some are effectively normalizations (`ev.status === "blocked"
|| ev.status === "pending_approval" ? "blocked" : "failed"` — this second
one is arguably itself a `STATUS_MAP`-shaped normalization already;
consider whether it belongs IN `STATUS_MAP` instead of re-implemented
inline). Import `RUN_STATUSES`/`STATUS_MAP` from `./status.mjs` in both
files.

## Step 4 — 3c: rewrite or delete `audit-console-surface.mjs`

Read `bun run docs:console-api`'s generated registry gate first (it exists
per the audit's own finding and is the stated alternative) — determine
whether it already covers what `audit-console-surface.mjs` was trying to
catch (mission/autopilot surface presence). If yes: delete the script and
its skill-doc references (grep
`skills/operating-console/**` for mentions), and note in
`docs/plans/audit-fix-wave/deferred.md`'s cross-reference (WS5 owns that
file; leave a one-line pointer here in your PR description for WS5 to pick
up, do not edit `deferred.md` yourself — it's outside this workstream's
write-set) that the script is gone and why. If the console-api gate does
NOT cover it: rewrite the needles against the CURRENT console surface
(grep `apps/console/src` for whatever mission-control/autopilot successor
view exists today, or if there is none, retarget the checks at whatever
feature replaced it) and keep the script.

## Step 5 — 3d: `mcp` → citty subcommands in `factory.mjs`

Read `apps/factory/scripts/factory/lifecycle/deploy.mjs:181` `cmdMcp` in
full — it dispatches on `flags.action || flags._sub || "list"` with actions
`plan` (delegates to `cmdSourceIntegrationPlan`), `list`/`ls`, `enable`
(requires `--service`), and (per the surrounding code, verify) `disable`.
Convert `apps/factory/scripts/factory/registry.mjs:396`'s single `legacy()`
call into a citty `subCommands` tree — one subcommand per action
(`plan`, `list`, `enable`, `disable`), each with typed `args` matching what
`cmdMcp` actually reads for that branch (`--service`, `--project`,
`--region`, etc.) — mirroring `tools/ge/mcp.mjs`'s shape (import
`defineCommand`, one `defineCommand` per leaf, compose with
`subCommands`). Preserve `cmdMcp`'s existing default (`flags.action ||
flags._sub || "list"` → citty's positional-subcommand dispatch already
gives you this for free, verify the default still resolves to `list` when
no subcommand is given). `BEHAVIOR-PRESERVING check`: every existing
invocation shape (`factory mcp`, `factory mcp list`, `factory mcp enable
--service X`, `factory mcp plan`) must produce identical `argv`/dispatch as
before — this is parse-verified only (deploy-path, house rule 4); do not
claim to have run the actual `gcloud` calls.

## Definition of done

- [ ] `grep -rn "\.venv.*node_modules.*__pycache__" tools/lib/provision.mjs`
      (or equivalent) returns zero inline array literals — both call sites
      import the canonical constant.
- [ ] New structural test from Step 1 passes; reverting Step 2 makes it
      fail (negative-test check, then re-apply).
- [ ] `bun test packages/run-ledger` green after Step 3, with
      `reduce.mjs`/`store.mjs` importing from `./status.mjs`
      (`grep -n "RUN_STATUSES\|STATUS_MAP" packages/run-ledger/src/reduce.mjs
      packages/run-ledger/src/store.mjs` shows imports, not just literals).
- [ ] `audit-console-surface.mjs` either passes
      (`node skills/operating-console/scripts/audit-console-surface.mjs`
      exits 0) against the CURRENT console, or is deleted with its
      replacement gate named in the PR description.
- [ ] `factory mcp --help`, `factory mcp list --help`, `factory mcp enable
      --help` render real per-subcommand flag info (citty's generated
      help), and a parse-level test proves argv identity with the old
      legacy dispatch for at least the 4 invocation shapes listed above.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Deciding the `.pyc`/`.adk` question by just concatenating both possible
  lists everywhere "to be safe" without checking what those directories
  actually are — verify, then decide.
- Rewriting `RUN_STATUSES`/`STATUS_MAP` in `status.mjs` "for consistency"
  — this workstream routes callers through the existing const, it does not
  redesign the vocabulary.
- Leaving `audit-console-surface.mjs` half-fixed (needles updated for some
  rows, stale for others) — either every row is verified current, or the
  file is deleted.
- Attempting to runtime-verify `factory mcp enable`/`list` against real
  `gcloud`/Agent Registry in this sandbox.
- Touching any other `legacy()` entry in `registry.mjs` (`quality-gate`,
  `harness-review`, `harness-refine`, `deploy`, `register`, `batch-audit`,
  `test`) — each has its own documented, still-valid reason to stay
  legacy; not this workstream's ground.

---
Worker protocol (inherited from `00-orchestration.md`): worktree forks from
origin/main; commit incrementally with the repo's trailer convention; never
push, never stash; final report is raw data — branch, `git log --oneline`,
each DoD item with its actual output, deviations each justified in one
line. A separate reviewer re-runs the DoD before merge.
