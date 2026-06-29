# Refactor session — handoff & status

**Branch:** `claude/elite-engineers-top-areas-g994w3` (pushed, in sync with origin)
**Test baseline:** `598 pass / 12 fail / 2 errors` — the 12 fails + 2 errors are **pre-existing environmental** (no gcloud/agents-cli/uv/Python/`.ge.json`/Firestore in this sandbox), identical before and after every change (verified by stash-compares). No regressions introduced.
**PR:** none opened yet (deliberately — awaiting go-ahead).

This document is the source of truth for what shipped, what was deliberately **not** done (and why), and what's queued. It's written for a reviewing agent.

---

## 1. Operating principles held all session

These are the rules every change was held to. A reviewer should check work against them:

1. **Green at every commit** — full suite + `source:hygiene` (layering guard, export-surface, harness-schema drift) pass on each commit. No "fix it in the next commit."
2. **Behavior-preserving unless explicitly flagged** — verified by tests / parity checks / byte-diffs, not assertion.
3. **Never blind-ship into the deploy path** — `deploy`/`register`/`harness`/`gcloud`/Python code can only have its *parsing* verified here, not execution; such changes are deferred, not guessed.
4. **Verify, don't trust** — confirmed dead deps had zero importers, confirmed `@ge/std` resolved from root before deleting originals, ran residual-greps before every deletion. Caught two real defects this way (see §4).
5. **Decline unsafe "improvements"** — several plausible-looking refactors were **rejected** because they'd silently change behavior or over-abstract. That list (§6) is as important as what shipped.

---

## 2. Shipped this session (21 commits)

### A. Library replacements (stop hand-rolling)
| Commit | Change |
|---|---|
| `844045d` | **jsonrepair** → LLM-JSON extraction; tolerates trailing commas / single quotes / truncated tails. **Throw on no-object preserved.** |
| `1060b7c` | **execa** → replaced bespoke `spawn` wrapper `runCommand` (24 call sites, all contract branches re-verified). |
| `5b68a95` | **execa** → `execStream` (live line-event streaming + friendly ENOENT preserved). |
| `ce39f8e` | `createLineBuffer` → reuse `@ge/runtime` `splitLines` (deduped). |
| `52c968f` | **c12** → `.ge.json` loading in harness-runner (sync→async, value precedence unchanged). |

### B. Naming consolidation
| Commit | Change |
|---|---|
| `71a8ab4` | **change-case** → one canonical `snakeCase`; converged **3 mutually-inconsistent** copies (`salesforce__c_r_m` / `_c_r_m` / `_crm` → `salesforce_crm`). Golden-corpus test added. |
| `a7ae0a7` | One shared `slug()` (parameterized) replacing **5** divergent copies; byte-parity test. |
| `31bea24` | Folded simulator-seed `snakeCase` (data-recipe + materialize) onto canonical; documented the two intentionally-separate ones. |

### C. CLI / citty
| Commit | Change |
|---|---|
| `5debd69` | **16 scripts** + 3 `boolFlag` copies → existing `tools/lib/cli-args.mjs`; parser-parity test. |
| `ff4a87b` | Typed the 2 safely-typeable legacy commands (`tools`, `from-usecase`); the other 8 annotated with the concrete reason each can't be typed. |
| `c2c967f` | **citty `runMain`** routing — real per-command `--help`/usage/`--version`. Fixed the footgun where `factory init --help` *executed* init. |

### D. `@ge/std` — the keystone (Wave 1, 4 commits)
A neutral leaf package (`packages/std`) importable by **both** `apps/*` and `tools/*` without a layering cycle. This ended the tools↔apps layering-driven duplication for good.
| Commit | Change |
|---|---|
| `a13bf8a` | Scaffold `@ge/std` — verbatim copies of naming, cli-args, json-io + extracted json-repair. Declared in root + apps/factory + apps/presentation package.json. |
| `3d85707` | Codemod repathed **46 importers** by filename-suffix (caught the critic's 4 "missed" importers structurally); factory.mjs uses `@ge/std/json-repair`. |
| `464a4fd` | `mission-node-registry` snakeCase unified onto `@ge/std` — the duplicate the layering guard had forced. Gated by a **divergence-probe test**. |
| `5198ff5` | Deleted the canonical originals; `@ge/std` is now the single source. |

### E. Other consolidations
| Commit | Change |
|---|---|
| `ef985c4` | json-io safe subset (6 files) → `tools/lib/json-io.mjs` (later moved to `@ge/std`). |
| `52dd6be` | **csv-io** (Wave 2 STEP-A) — `toCsv`×2 + `parseCsv` → `@ge/std/csv-io`, byte-identical (round-trip test). Library swap (STEP-B) deferred behind golden-diff gate. |
| `e8bfe6f` | **Dead deps removed** (Wave 4) — `zod-to-json-schema` (superseded by zod v4 native), `express`×2 (both servers use `Bun.serve`). All zero-importer verified. |
| `2f7d48c` | Quick win: 5 `path.substring(0,lastIndexOf("/"))` → `dirname()`. |
| `9b389e6` | Quick win: 3 sync-swallow `readJson` dups → `@ge/std/json-io`. |
| `83ff01b` | Quick win: `parseList()` in `@ge/std/list` — collapsed **26** `split/trim/filter(Boolean)` sites. |

### `@ge/std` now contains (single source of truth)
`naming` · `cli-args` · `json-io` · `json-repair` · `csv-io` · `list` — each with its own test file.

---

## 3. Multi-agent work products (for review)

Two read-only orchestration fleets were run (background workflows). Their full outputs are on disk:

- **Reuse-at-scale plan** — 8 scouts → dependency-ordered/file-partitioned plan → adversarial critic. The critic caught 2 build-breakers + 2 behavior/test gaps before any edit. Drove Waves 1–4.
  Output: `/tmp/claude-0/-home-user-ge-agent-factory/d18549c3-5436-5b8f-8956-11db7e940277/tasks/w3gkuxyrj.output`
- **Code-elegance audit** — 8 auditors (god-files, error-handling, logging, magic values, control-flow, state/purity, abstraction, async/IO) → synthesis → adversarial verifier. ~250 raw instances → **13 confirmed keepers**; verifier corrected 2 false synthesis claims and rejected nitpicks/cleverness/deliberate-good.
  Output: `/tmp/claude-0/-home-user-ge-agent-factory/d18549c3-5436-5b8f-8956-11db7e940277/tasks/wuegcujlj.output`

### Audit verdict: SOLID core, two concentrated debt centers
1. **`factory.mjs` is the gravitational center** — `cmdTools()` ~534 lines, `deriveSchemaFromUseCase()` (two welded paths), `deriveColumnsForEntity()` (13-branch data-as-control-flow), + `startMissionTask` (runtime-daemon ~320), `startAgentRun` (server.js ~249).
2. **Silent failure as default** — ~71 empty `catch{}`/`.catch(()=>{})` with no consistent DEBUG/WARN/throw tier, routing *around* the existing ledger/event observability seam.
Plus: **blocking I/O on HTTP request paths** (`factory-bridge.js` `execFileSync('bun'/'tar')`, sync-fs in `server.js` handlers).

---

## 4. Defects caught at the gates (process working as intended)
- **`@ge/std` root-link gap** — package resolved from `apps/factory` but not repo root, so `tools/*` couldn't import it. The plan assumed auto-linking. Fixed by declaring `@ge/std` in **root** `package.json`.
- **Sibling-import codemod gap** — `contract-schema.mjs` (inside `factory/core/`) imported `./naming.mjs` (no `/core/` segment), so the suffix codemod skipped it; the delete step's residual-grep gate surfaced it before it broke the build.

---

## 5. Pending DECISIONS (need user sign-off — not blockers, judgment calls)

These are real but each requires a choice because the "clean" version changes behavior:

1. **Canonicalize GCP env-resolution.** ~14 sites resolve project/location with **genuinely divergent** chains (factory.js checks only `GOOGLE_CLOUD_PROJECT`; preflight checks 2 vars→`null`; harness-runner checks 3 + `.ge.json`→`null`; auth.js uses merged-env→`auth.project`; defaults differ: `null`/`"global"`/`"<GCP_PROJECT>"`). Unifying = **behavior change** (e.g. factory.js would start honoring `GCLOUD_PROJECT`) — likely a bug-fix, but must be opt-in, not a silent "reuse" refactor.
2. **`TIMEOUTS` taxonomy** (factory.mjs, ~24 bare timeout literals). Deferred because the **same value serves different operations** (`60000` = gcloud-mutate / agents-info-read / scaffold / IAM-grant), so any purpose-name lies at half its sites and a per-value bucket is just the number renamed. Needs a deliberate timeout-policy design, not a find-replace.
3. **`RUN_STATUSES` stringly-typed dispatch** (run-ledger reduce.mjs/store.mjs). `status.mjs` exports an *array*, not `STATUS.DONE` constants; in untyped `.mjs` a constant gives **no typo protection**. The genuine fix is the `RunStatus` **union type** the `.d.ts` implies → a TypeScript migration of the package.

---

## 6. Deliberately NOT done — would change behavior or over-abstract (rejected on principle)
A reviewer should treat these as **intentional**, not oversights:
- **slugify** for the id-slugs — transliterates/strips (`AT&T`→`at-and-t`) and several slugs are **persisted registry keys**; would re-key data.
- **c12 for `findNearestConfig`** — c12 doesn't walk parent dirs for a custom JSON file (verified empirically); would change discovery semantics.
- **Typing the 8 remaining citty commands** — each has a concrete blocker (`test` uses `"flag" in flags` presence detection that citty's default-filling breaks; `mcp` needs subcommands; `batch-audit` forwards arbitrary flags; deploy-path commands can't be execution-verified here; `--soft` is passed *with a value* by factory-worker so it can't be a citty boolean).
- **Unifying JSON multi-object extractors** (`batch-generate-agents`, `factory.js`) — adding repair-tolerance would change what they accept.
- **Merging `uniq`/`asArray` variants** — three different filtering semantics (keep-`0` vs drop-all-falsy vs dedup-by-`.id`); a parameterized `uniq(v,{dropFalsy,byKey})` reads worse than the local one-liners.
- **Relocating single-use `sleep`/`compactText`** — not duplicated; moving them is churn, not dedup.
- **Routing factory.mjs progress through the ledger** / timestamp-injection refactors / FNV-loop "clever" rewrites — verifier rejected as architecture-change or cleverness.

---

## 7. Queued work (bigger, each deserves its own checkpoint)

**Highest value, behavior-sensitive (audit-confirmed):**
1. **`factory.mjs` god-function split** — `cmdTools` → focused generators + thin assembler; `deriveSchemaFromUseCase` → two functions + if/else; **`deriveColumnsForEntity` → declarative `ENTITY_COLUMN_SCHEMAS` lookup** (the same file already models this pattern at `SYSTEM_TABLE_PATTERNS`). Most self-contained: `deriveColumnsForEntity`.
2. **Error-handling tier** — establish DEBUG/WARN/throw discipline over the ~71 silent catches. Best first concrete piece: the silent daemon→local fallback in `transport.mjs` (add a "fell back to local" event + WARN — behavior-preserving).
3. **Blocking I/O on HTTP paths** — `factory-bridge.js submitFactoryRun` (sync→job-based; not purely behavior-preserving — flag it).

**Larger / env-gated:**
4. **Hono migration** of the ~60 remaining legacy factory `server.js` routes (strangler already started; needs runnable server to verify streaming/POST).
5. **`mcp` → citty subcommands** (`mcp deploy|doctor|…`).
6. **Python services** (`mcp-service`, `simulator-runtime`) — typer (CLI), tenacity (retry), structlog (logging), httpx; pydantic already v2.
7. **action-kind reconciliation** — `packages/contracts/src/action-kinds.ts` documents 5 divergent vocabularies awaiting a behavior-changing unification (biggest architectural debt).

**CSV STEP-B:** swap `@ge/std/csv-io` internals to `csv-parse`/`csv-stringify` once a GE_SOURCE_DATE golden-diff run proves byte-identical output.

---

## 8. Recommended next step
`deriveColumnsForEntity → ENTITY_COLUMN_SCHEMAS` (declarative lookup) — smallest, fully offline-verifiable slice of the `factory.mjs` god-module work, with the pattern already modeled in-file. Then the `transport.mjs` silent-fallback trace. Both behavior-preserving; both green-gateable here.
