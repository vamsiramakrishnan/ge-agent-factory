# Audit-fix wave — orchestration guide

Prescriptive implementation documents for closing out the 2026-07-05 read-only
audit (three sub-audits — stale/dead code, incomplete initiatives, half-wired
surfaces — synthesized into one report with a TOP-10 and a count summary: 2
delete-candidates, 14 finish-candidates, 9 keep-but-document, 7
false-positives). This directory follows the same contract as
`docs/plans/taste-campaign/`: read `docs/plans/taste-campaign/TEMPLATE.md`
first — every numbered doc here uses its shape (Status/Write-set/Depends/
Blocks, a verified Problem section, a Step-1 verification net, prescriptive
steps, a derived-not-estimated Definition of Done, a Forbidden list). This
file is the contract every worker inherits.

Status legend (same as taste-campaign): `[ ]` open · `[x]` done · `[~]`
partially landed (verify before starting).

## Non-negotiable house rules (inherited from `docs/plans/taste-campaign/00-orchestration.md`, unchanged)

1. **Green at every commit.** Before each commit:
   ```bash
   node tools/source-hygiene.mjs && node tools/check-no-app-imports.mjs && node apps/factory/scripts/gen-harness-schemas.mjs --check && node tools/check-design-tokens.mjs
   ```
   and `bun run test:gated` (judge by test *names* against
   `tools/known-test-failures.json`, never raw counts). If you touched
   `docs/`, also `bun run docs:gate`. Plans under `docs/plans/**` are in
   `SKIP_DIRS` for `apps/docs/scripts/sync-content.mjs` (no `PAGE_MAP` entry
   needed — links to unpublished trees become GitHub blob URLs) and in
   `EXCLUDED_DOC_DIRS` for `tools/lang-gate.mjs` (working-document tone is
   fine), so `docs:gate` and `docs:site:build` do not gate this directory
   itself — they still gate any *other* doc a workstream edits (e.g.
   `REFACTOR-HANDOFF.md`, `docs/plans/taste-campaign/08-next-horizon.md`).
2. **Oracle first, extraction second.** Any change to code that emits
   artifacts must be gated by a byte-exact or behavior-parity test that
   exists and passes BEFORE the change. If a workstream's seam has no oracle,
   building the oracle is its first commit (WS1's two golden-ish assertions
   and WS4's Hono-route parity both work this way).
3. **Behavior-preserving unless the doc explicitly flags otherwise.** A step
   marked `BEHAVIOR-CHANGE` lands as its own commit, named in the subject.
4. **Never blind-ship into the deploy path.** Anything that shells to
   `uv`/`pytest`/`gcloud`/Agent Registry (WS3's `mcp` citty conversion, WS4's
   `factory-bridge.js`/`server.js` HTTP paths) is *parse-verified only* in
   this sandbox — note the constraint in the PR, do not claim runtime
   verification you didn't do.
5. **Never `git stash`.** Shelve on a throwaway branch instead.
6. **Golden fixtures are correct until proven otherwise.** A failing
   `*-golden`/`parity-oracle` test after your change means your change broke
   determinism, not that the fixture needs regenerating.
7. **Return/throw, don't print/exit** from `tools/lib/*` and command
   handlers.
8. **No new hand-mirrored constants.** WS3's tar-exclude consolidation and
   WS3's `RUN_STATUSES` routing exist to *retire* mirrored constants, not add
   new ones.
9. **Additivity snapshot for registry/surface changes.** Before touching
   `packages/capability-registry/src/registry.mjs` or `tools/mcp-server.mjs`
   (WS2), snapshot the current `mcp`-block set (`grep -c 'mcp: {'
   packages/capability-registry/src/registry.mjs`) and the current MCP tool
   count so the DoD can assert the change is additive-only where the doc
   says so (WS2 Forbidden: no widening beyond the named entries).

## Workstreams, dependency order, and parallelism

| WS | Doc | Theme | Effort | Depends on | Parallel-safe with |
|---|---|---|---|---|---|
| 1 | `01-correctness-bugs.md` | Fix the two real behavior bugs the audit surfaced: a stale test assertion masquerading as a spec-to-okf id-mangling bug, and a genuine Firestore-mirror data-loss divergence | M | — | 2, 3, 5, 6 |
| 2 | `02-registry-mcp-completion.md` | Registry is the complete, honest single source for MCP + console routes: 3 missing `okf.enrich.*` mcp blocks, 5 missing console routes, 1 stale comment, 1 dead export, 1 missing test | M | nothing (scheduled Wave 2 — see below) | 3, 6 |
| 3 | `03-packaging-exec-hygiene.md` | Consolidate diverged constants and finish two partial conversions: tar/rsync excludes, `RUN_STATUSES`, the console-surface audit script, `factory.mjs`'s `mcp` citty conversion | M | — | 1, 2, 5, 6 |
| 4 | `04-http-blocking-io-hono.md` | Remove blocking sync I/O from HTTP request paths; finish the Hono strangler's last ~6 branches | L | — (scheduled Wave 3: largest risk, deploy-adjacent) | none — run alone |
| 5 | `05-doc-plan-truthing.md` | Strike done items from stale plan docs; write down the real vs. unverifiable session deferrals; three small annotation/naming decisions | S | — | 1, 2, 3, 6 |
| 6 | `06-tooling.md` | Adopt a minimal linter; route `tools/` clocks through source-clock; close the TIMEOUTS-taxonomy question with an explicit decision | M | — | 1, 2, 3, 5 |

**Scheduling prescription for the orchestrator:**

- **Wave 1 (parallel worktrees, independent-first):** WS1, WS5. Both are
  small/contained, touch no shared registry surface, and de-risk everything
  downstream — WS1 by turning two `kind:bug` `known-test-failures.json`
  entries into passing tests (so later waves inherit a cleaner gate), WS5 by
  correcting the planning record itself before more plans get layered on top
  of stale claims.
- **Wave 2 (after Wave 1 merges):** WS2, WS3, WS6 in parallel worktrees. WS2
  is scheduled here (not Wave 1) because it makes three judgment calls
  (the `okf.enrich.apply` dryRun default, the GET-route wiring pattern, the
  `pipeline.run` CLI-only-or-not decision) that are cheaper to make against
  a settled registry than to redo if WS1's fixes had touched shared files —
  in fact WS1 does not touch the registry, so this ordering is a
  merge-hygiene choice, not a hard dependency. WS3 and WS6 share no files
  with WS2 (see the write-set matrix) so all three run genuinely in
  parallel.
- **Wave 3 (after Wave 2 merges):** WS4 alone. It is the largest, riskiest
  workstream (production HTTP paths, the Hono strangler's trickiest
  remaining branches — SSE/streaming/proxying) and benefits from landing on
  stable ground; nothing downstream depends on it.
- Each workstream = one branch, one PR, merged in wave order. Workers must
  not touch files outside their doc's write-set; if a needed change falls
  outside it, report back instead of editing.

## Write-set matrix (conflict control)

| WS | May write |
|---|---|
| 1 | `apps/factory/scripts/spec-to-okf.test.mjs`, `tools/known-test-failures.json` (trim only, after both fixes are green), `packages/run-ledger/src/firestore.mjs` (the `recordEvent` function only), `packages/run-ledger/src/adapter-parity.test.mjs` (retire the stage-blanking sub-test only — the seq-divergence sub-test in the same `describe("KNOWN DIVERGENCE")` block stays, it documents an accepted design difference, not a bug) |
| 2 | `packages/capability-registry/src/registry.mjs` (**shared with WS3's comment context, disjoint lines — see below**), `tools/mcp-server.mjs`, `tools/lib/factory-core.mjs` (new re-exports only: `evalsCoverage`, `byoDoctor`, `systemsBindings`), `apps/console/src/server/ge-api.mjs` (one new GET route + 3 registry `path`/`method` field changes' worth of routing, no rewrite of existing rows), `packages/capability-registry/src/surface-parity.test.mjs` (extend, don't rewrite), NEW `tools/ge/console.test.mjs`, `tools/ge/runs.mjs` (delete the dead export only) |
| 3 | `tools/lib/handoff-package.mjs`, `tools/lib/provision.mjs`, `skills/operating-console/scripts/audit-console-surface.mjs` (rewrite or delete — decision in the doc), `packages/run-ledger/src/status.mjs`, `packages/run-ledger/src/reduce.mjs`, `packages/run-ledger/src/store.mjs`, `apps/factory/scripts/factory/registry.mjs` (the `mcp:` legacy-command line only), NEW `tools/ge/mcp-plan.test.mjs`-equivalent parse-only test if the citty conversion needs one (mirror `tools/ge/mcp.mjs`'s existing test, if any, first) |
| 4 | `apps/presentation/src/server/factory-bridge.js` (`submitFactoryRun`'s `IS_PROD` branch only), `apps/factory/src/server.js` (the legacy if-ladder, lines ~1264-1386 as of 2026-07-05), NEW `apps/factory/src/routes/*.mjs` modules for the routes converted out of the ladder, their tests |
| 5 | `docs/plans/taste-campaign/08-next-horizon.md` (strike B2/B5/B6/B9 only), `REFACTOR-HANDOFF.md` (the silent-catch line in §7 item 2 only — **shared with WS6, disjoint lines, see below**), `docs/plans/audit-fix-wave/deferred.md` (this wave's own file — already drafted, keep it current), `apps/factory/src/factory-worker.js` (a comment near `options.allowUnpromoted`, no behavior change), `packages/run-ledger/src/firestore.mjs` (a header comment on `createFirestoreEventMirror` only — **shared with WS1, disjoint region: WS1 edits inside `recordEvent`'s body, WS5 edits the export's doc comment**) |
| 6 | NEW lint config (`.oxlintrc.json` or `biome.json` — pick one, justify in the doc), `package.json` (new `lint` script + `source:hygiene` wiring), `tools/docs-shots/*.mjs`, `tools/ge/agents.mjs`, `tools/ge/drive.mjs`, `tools/lib/factory-runs.mjs` (route `Date.now()`/`new Date()` through `apps/factory/src/source-clock.js`), `REFACTOR-HANDOFF.md` (the TIMEOUTS queued-work item near line 106 only — disjoint from WS5's line) |

Two files are touched by two workstreams each, always on disjoint
lines/functions — call this out explicitly in both PRs and rebase rather
than fight it:
- `packages/run-ledger/src/firestore.mjs`: WS1 edits `recordEvent`'s body
  (the forward-only stage guard); WS5 edits `createFirestoreEventMirror`'s
  header comment (dormant-until-cloud annotation). Land WS1 first (Wave 1);
  WS5 rebases onto it (also Wave 1, but WS1's PR should merge first if both
  land same day).
- `REFACTOR-HANDOFF.md`: WS5 edits §7 item 2 (silent-catch sweep — mark
  done); WS6 edits the TIMEOUTS queued-work item (a different numbered
  item in the same §7 list). Both in Wave 2/1 respectively; whichever
  merges second does a two-line rebase.

## Definition of done for the whole wave

- [ ] All six workstream PRs merged in wave order (1, 5 → 2, 3, 6 → 4).
- [ ] `tools/known-test-failures.json` has zero `kind: "bug"` entries (both
      were WS1's; confirm with
      `node -e "console.log(JSON.parse(require('fs').readFileSync('tools/known-test-failures.json','utf8')).failures.filter(f=>f.kind==='bug').length)"`
      → prints `0`).
- [ ] `packages/run-ledger/src/adapter-parity.test.mjs`'s
      `describe("KNOWN DIVERGENCE", ...)` block contains only the
      seq-value test (the stage-blanking test is gone or now asserts
      parity); `bun test packages/run-ledger/src/adapter-parity.test.mjs`
      green.
- [ ] `grep -c 'mcp: {' packages/capability-registry/src/registry.mjs`
      increased by exactly 3 from the Wave-1-end snapshot (the three
      `okf.enrich.*` blocks) and by no more.
- [ ] `node tools/check-app-import-surface.mjs`, `node
      tools/check-no-app-imports.mjs`, `node tools/check-silent-catches.mjs`,
      `node tools/check-design-tokens.mjs` all green.
- [ ] `bun run source:hygiene && node tools/check-design-tokens.mjs` green
      (the committed pre-commit gate from `AGENTS.md`).
- [ ] `bun run test:gated` green, judged by name against
      `tools/known-test-failures.json` (which is now smaller by 2 entries
      than it was before this wave).
- [ ] `bun run docs:gate` and `node tools/docs-check.mjs` green (this
      directory and any other `docs/*.md` touched by WS5/WS6).
- [ ] `runsResumeCmd` has zero grep hits repo-wide outside git history.
- [ ] `skills/operating-console/scripts/audit-console-surface.mjs` either
      passes against the current console (needles rewritten) or is deleted
      and its purpose is covered by `bun run docs:console-api`'s generated
      registry gate — not both silently, one deliberately.
- [ ] Every workstream's own DoD checklist is independently re-run by a
      separate reviewer (per taste-campaign's verification protocol) before
      merge — no self-certified merges.

## What is deliberately OUT of this wave

Carried over verbatim from the audit's false-positive and out-of-scope
findings — do not "fix" these:
- `packages/run-ledger` `pgAdapter` — does not exist; if a stale doc still
  claims it does, that doc is WS5's problem, not a code problem.
- `apps/presentation` — alive and wired; the audit's only note is a CI
  coverage gap (no GH Actions workflow tests it), which is not this wave's
  job to close.
- `GE_HARNESS_PYTHON` quadruplication — 3 of 4 implementations are
  deliberate delegation/mirroring with load-bearing comments; the audit
  marks this KEEP-BUT-DOCUMENT with an optional `@ge/std` extraction. WS5's
  doc gives the annotate-vs-extract decision criteria; do not silently pick
  extraction without stating why.
- Action-kind reconciliation (`packages/contracts/src/action-kinds.ts`) —
  explicitly a later, behavior-changing wave per the file's own header and
  `docs/design-specs/specs/2026-06-14-console-presentation-unification.md`.
  Not touched here.
- The connector runtime SDK, and anything under "session-only deferrals" in
  `deferred.md` that the audit could not verify as a real, named gap — see
  that file for the honest accounting of what is real vs. unverifiable.
