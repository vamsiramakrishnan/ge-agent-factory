# 08 — Next horizon: anti-patterns found while executing WS1–WS7, and scanner-verified modernizations

The handoff register for the crew after this one. Part A is what the campaign
*itself* surfaced — every item was hit by a worker or reviewer during
execution, with the evidence cited. Part B is a read-only modernization scan
(2026-07-02) with file:line facts. Each item carries a mechanistic fix, its
oracle, and effort (S/M/L). Author new workstream docs from these using
`TEMPLATE.md` in this directory; the orchestration rules in
`00-orchestration.md` still bind.

## Part A — Anti-patterns surfaced by running the campaign

### A1. Non-deterministic generated file tracked in git — `S`
**Evidence:** `apps/factory/src/agent-spec-registry.generated.json` was
byte-rewritten (same length, different bytes) by ordinary test/install cycles
in FOUR independent worker sessions (WS3 §5, WS4 §3, WS5-C §7, WS5-A/B §4);
each had to `git checkout --` it.
**Fix:** find the writer (`apps/factory/scripts/sync-agent-spec-registry-db.mjs`
or the sync path), make serialization deterministic (stable key order, stable
number/date formatting), then add a hygiene check: regenerate → `git diff
--exit-code` on the file. Oracle: the check itself, run twice in a row.
**Generalize:** apply the same regenerate-is-a-no-op check to every
`*.generated.*` tracked file.

### A2. The flake tax on `test:gated` — `M`
**Evidence:** every worker re-ran `test:gated` 2–3× because subprocess-heavy
golden tests transiently fail under load (`factory core spec review` named in
four reports; passes in isolation every time). Cost compounds per commit,
per engineer, forever.
**Fix (layered):** (1) hermeticize the two known leaks — the skill-registry
test reads machine-global `~/.agents/skills`
(`tools/known-test-failures.json` notes it), and two factory-core tests need
the gitignored `use-cases.generated.json` a fresh clone lacks (WS4 §deviation
3 had to run `use-cases:sync` by hand — make the test bootstrap it or skip
with a named reason); (2) teach `check-test-results.mjs` to auto-retry only
the failing files once before judging; (3) run golden oracles in-process
where the subprocess adds nothing.
**Oracle:** 10 consecutive clean `test:gated` runs on an untouched tree.

### A3. `known-test-failures.json` has no expiry mechanism — `S`
**Evidence:** a real product bug (spec-to-okf id-mangling, two entries) lives
beside environment-caused entries, structurally indistinguishable.
**Fix:** add `addedAt` and `kind: "env" | "bug"` fields per entry (the
`notes` prose already distinguishes them — make it data); the checker warns
when a `bug` entry ages past N days and reports `env` entries that pass
locally. Fix the spec-to-okf bug itself as its own workstream (it has a
paying customer: the round-trip oracle).

### A4. Aspirational code kept on life support — `S`
**Evidence (WS7 report):** `packages/run-ledger` `pgAdapter`'s async
`all`/`get` cannot work with `createRunLedger`'s synchronous read — the
implementation comment admits it; `store.mjs`'s `backfill` passes a `status`
argument `startRun` silently ignores. Both now *documented* in the new types,
neither fixed.
**Fix:** delete `pgAdapter` (or finish it behind the now-typed
`LedgerAdapter` contract) and remove the dead argument. `BEHAVIOR-CHANGE`
commits; the ledger tests + typecheck harness are the net.

### A5. Prose state mirrors code state, then lies — `S each, ongoing class`
**Evidence:** `$green-200: #1e8e3e` traced to nothing in `palette.mjs` — the
old value-set checker couldn't see mispairings (WS5-C §finding 1, needs a
palette decision); `packages/design/src/palette.mjs` header still declares
tokens.css canonical after WS5-C inverted it (§finding 2); glossary
documented a renamed filesystem path (fixed by the jargon workstream).
**Fix:** the campaign's standing rule (generate, don't mirror) plus: settle
the `#1e8e3e` question in `palette.mjs`, rewrite the palette header. When
you find prose describing code, ask "can this be emitted instead?"

### A6. DoD targets must be derived, not estimated — process lesson
**Evidence:** WS3's `≤1,950 lines` target was arithmetically impossible from
the doc's own cluster inventory (~350 movable lines from 2,513); the worker
proved it and reported instead of stretching scope (WS3 §deviation 1).
**Fix:** template now requires each numeric DoD to show its arithmetic.

### A7. Generators are also linters — pattern to exploit
**Evidence:** WS5-A's "never invent prose" rule mechanically exposed **31
undocumented CLI flags**, fixed at source, improving `--help` for free.
**Exploit next:** the spec-reference generator (track D, in flight) will
expose undocumented spec fields the same way; a future
`mise`-task-table generator would expose undocumented tasks.

## Part B — Scanner-verified modernizations (all facts 2026-07-02)

### B1. There is no linter — greenfield Biome/oxlint — `S`
`bun run --filter '*' lint` matches exactly two workspaces and both run
`tsc --noEmit` (apps/console + apps/presentation `package.json:12`); zero
eslint/biome configs exist anywhere. **Fix:** one root Biome (or oxlint)
config — zero plugin-migration cost because there is nothing to migrate;
rename today's `lint` scripts to `typecheck` truthfully (WS7 already
introduced per-package `typecheck`). Gate via `ci`.

### B2. **DONE — struck 2026-07-05.** Package manifest hygiene: publint/ATTW + undeclared deps — `S/M`
All packages are `private: true` and Bun-consumed, so nothing is *broken*,
but: `@ge/std` ships no types at all (90 importers); most TS packages export
`.ts` source directly (Bun-only); `@ge/agent-spec` relies on adjacent
`.d.mts` without `types` conditions; `@ge/run-ledger` imports
`@google-cloud/firestore` while declaring zero dependencies, and
`apps/factory` imports `hono` undeclared — both riding root hoisting.
**Fix:** declare the two undeclared deps (S); add `knip` + `publint` as an
advisory CI step (M); two confirmed-dead exports to delete:
`toMcpSchema` and `buildCliArgsForConfig` in
`tools/lib/config-schema.mjs:228,240` — but see B3 before deleting the
former's idea. Verified 2026-07-05: `toMcpSchema` and `buildCliArgsForConfig`
do not exist in config-schema.mjs; deletion already completed.

### B3. `.ge.json` gets a `$schema` — `S`
`tools/lib/config-schema.mjs:10-83` `CONFIG_FIELDS` is already a declarative
single source (flag/env/file-key/default/requiredFor per field). Emit
`.ge.schema.json` from it (~30-line generator, same marker/`--check` pattern
as WS5), reference it from `ge init`'s written config, and operators get
editor autocomplete + validation on the file they touch most.

### B4. Stable error codes at two boundaries — `S`
`FactoryCommandError` is an empty Error subclass
(`apps/factory/scripts/factory/core/pipeline.mjs:69`); the `ge` boundary
(`tools/ge/shared.mjs:61-70` `guarded()`) prints free text, exit 1.
**Fix:** `code` field on `FactoryCommandError`/`fail()`, rendered by
`guarded()` and `factory/registry.mjs`'s `dispatch()` as `GE####` with a
docs-site deep link (the runbook anchors exist). Registry of codes lives
beside the error class; docs page generated from it (WS5 pattern).

### B5. **DONE — struck 2026-07-05.** Shell completions from the citty tree — `M`
citty 0.2.2 has no completion support (verified in dist). But WS5-A's
`rootCommand` export makes the tree walkable — a `ge completions
bash|zsh|fish` generator is the same walk as `gen-cli-reference.mjs` with a
different renderer. No new runtime dependency needed. Verified 2026-07-05:
`tools/ge/completions.mjs` exists (132 lines), renders bash/zsh/fish, and is
registered in `tools/ge.mjs:62`.

### B6. **DONE — struck 2026-07-05.** `llms.txt` + `llms-full.txt` from the docs site — `S`
Nothing emits them today. Either the `starlight-llms-txt` community plugin
(one-line integration in `apps/docs/astro.config.mjs`) or a custom Astro
endpoint concatenating the synced content — everything already flows through
`sync-content.mjs`. For a repo whose product is agents, being one-fetch
legible to agents is table stakes. Verified 2026-07-05: `apps/docs/src/pages/llms.txt.js`,
`llms-full.txt.js`, `apps/docs/src/lib/llms.mjs`, and test `apps/docs/tests/llms-txt.test.mjs`
all exist.

### B7. Determinism preload — `S`
`apps/factory/src/source-clock.js` is already the centralized clock (sole
non-test `GE_SOURCE_DATE` reader) and `bunfig.toml` already preloads
`bunfig.test-preload.mjs` (currently only a timeout workaround for
bun#7789). **Fix:** pin `GE_SOURCE_DATE` (and a faker seed hook) in the
preload for all tests; make `scripts/plan-mock-data.mjs` honor source-clock
instead of its golden test masking timestamps
(`tests/plan-mock-data-golden.test.js:11`); move `tools/` generators onto
source-clock.

### B8. Typed console↔server client — `M/L, sequenced`
`hono/client` RPC is NOT wireable today: the console server is the (new,
tidy) `ROUTES` table in `ge-api.mjs`, not a Hono app, and Hono lives only in
`apps/factory`. Realistic sequence: finish the factory Hono strangler (~19
legacy branches, WS-queued), then EITHER convert `ge-api.mjs` to a typed
Hono app (TS conversion, medium) OR keep extending the `@ge/contracts`
zod-shared-shape pattern that `geClient.ts` already half-uses. Do not start
with the client.

### B9. **DONE — struck 2026-07-05.** Run replay — the flagship experience item — `M`
The console already has the ⌘K palette (hand-rolled,
`apps/console/src/components/shell/CommandPalette.tsx`, wired in
`App.tsx:82`) and a single-source tab registry
(`apps/console/src/lib/routes.ts:26-32`) — do not rebuild those. What's
missing is `ge run replay <id>` / a console scrubber: the durable ledger
records everything, SSE already emits `id:` for resume
(`transport/sse.mjs:7`), and `@ge/run-ledger`'s pure frames→state reducer
(`reduce.mjs`) is exactly the primitive a timeline scrubber needs. Mostly UI
work on existing, now-typed foundations. Verified 2026-07-05: `ge runs replay`
exists (`tools/ge/runs.mjs:215`) and console scrubber (`apps/console/src/hooks/useRunScrubber.ts`)
is wired in `RunDrawer.tsx:19-95`.

## Sequencing suggestion

Wave N+1 (independent, all S): A1, A3, B1, B3, B4, B6, B7 + A4/A5 cleanups.
Wave N+2: A2 (flake tax), B2, B5. Wave N+3: B9 (replay), then B8 after the
Hono strangler finishes. The spec-to-okf bug (A3's tenant) deserves its own
oracle-first workstream whenever a worker is free.
