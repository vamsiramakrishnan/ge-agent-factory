# Refactor session — handoff & status

> **Historical (2026-07-01).** The queued work in §7 and the recommendations
> in §8 have since been executed and superseded by the **taste campaign** —
> see [`docs/plans/taste-campaign/`](docs/plans/taste-campaign/)
> (`00-orchestration.md` for the record of what shipped, `08-next-horizon.md`
> and `09-cloud-factory.md` for what's queued next). Kept for the §6
> "deliberately NOT done" list, which remains binding.

**Branch:** `claude/elite-engineers-top-areas-g994w3` (pushed, in sync with origin)
**Test baseline:** judge by distinct fail **names**, not count — the only real failure is the pre-existing environmental `skill registry maps harness capabilities…` (no gcloud/agents-cli/uv/Python/`.ge.json`/Firestore in this sandbox). The subprocess-heavy golden/workflow tests produce flaky **timeout** fails that inflate the count run-to-run; identical before and after every change (verified by stash-compares). No regressions introduced. Latest: factory.mjs decomposition (see §9).
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

1. **Canonicalize GCP env-resolution.** **DELIVERED (user-approved behavior change).** All remaining project-resolution sites now route through `@ge/std/gcp-config.mjs`'s `resolveGcpProject`: `factory/lifecycle/deploy.mjs` (`getGcloudProject` + deploy-status), `factory/harness/harness.mjs` (3 sites, already dual-var — pure consolidation), `factory/integration/source-integration.mjs`, `apps/factory/src/factory.js` (`resolveCloudTopology` — the originally-named bug: it only honored `GOOGLE_CLOUD_PROJECT`), `apps/factory/src/auth.js` (process-env layer only; file-env → auth.project precedence preserved), `apps/presentation/src/server/{firebase-auth.mjs,factory-bridge.js}` (mirrors the console twins), and `tools/lib/doctor.mjs`. `tools/lib/config-schema.mjs` (ge's own precedence, `GCP_PROJECT_ID` first — documented + tested) gained `GCLOUD_PROJECT` as a trailing fallback only, locked by a new test assertion. Behavior delta: environments setting only `GCLOUD_PROJECT` now resolve everywhere instead of silently misresolving at these sites. Per-site defaults (`null` / `"<GCP_PROJECT>"` / gcloud-config fallback) and all **location** resolution untouched — location defaults (`"global"` vs region) are deliberate per-service semantics, not part of this fix. Deploy-path sites (`deploy.mjs`) are parse+test-verified only (no gcloud here); flagged for a canary deploy before trusting in anger.
2. **`TIMEOUTS` taxonomy** (factory.mjs, ~24 bare timeout literals). Deferred because the **same value serves different operations** (`60000` = gcloud-mutate / agents-info-read / scaffold / IAM-grant), so any purpose-name lies at half its sites and a per-value bucket is just the number renamed. Needs a deliberate timeout-policy design, not a find-replace.
3. **`RUN_STATUSES` stringly-typed dispatch** (run-ledger reduce.mjs/store.mjs). `status.mjs` exports an *array*, not `STATUS.DONE` constants; in untyped `.mjs` a constant gives **no typo protection**. The genuine fix is the `RunStatus` **union type** the `.d.ts` implies → a TypeScript migration of the package.

---

## 6. Deliberately NOT done — would change behavior or over-abstract (rejected on principle)
A reviewer should treat these as **intentional**, not oversights:
- **slugify** for the id-slugs — transliterates/strips (`AT&T`→`at-and-t`) and several slugs are **persisted registry keys**; would re-key data.
- **c12 for `findNearestConfig`** — c12 doesn't walk parent dirs for a custom JSON file (verified empirically); would change discovery semantics.
- **Typing the 8 remaining citty commands** — each has a concrete blocker (`mcp` needs subcommands; `batch-audit` forwards arbitrary flags; deploy-path commands can't be execution-verified here; `--soft` is passed *with a value* by factory-worker so it can't be a citty boolean). **Correction:** `test` was previously listed here with a `"flag" in flags` presence-detection rationale, but `cmdTest` actually reads `flags.out`/`flags["run"]`/`flags["include-integration"]` — the same shape as the already-typed `eval` command. The `"flag" in flags` hazard is real elsewhere in factory.mjs (`shouldRunFlag`/`wantsVertex`/`shouldRunHarnessReview`), just not in `cmdTest`; retyping `test` remains deferred, but as its own decision, not because of that blocker.
- **Unifying JSON multi-object extractors** (`batch-generate-agents`, `factory.js`) — adding repair-tolerance would change what they accept.
- **Merging `uniq`/`asArray` variants** — three different filtering semantics (keep-`0` vs drop-all-falsy vs dedup-by-`.id`); a parameterized `uniq(v,{dropFalsy,byKey})` reads worse than the local one-liners.
- **Relocating single-use `sleep`/`compactText`** — not duplicated; moving them is churn, not dedup.
- **Routing factory.mjs progress through the ledger** / timestamp-injection refactors / FNV-loop "clever" rewrites — verifier rejected as architecture-change or cleverness.

---

## 7. Queued work (bigger, each deserves its own checkpoint)

**Highest value, behavior-sensitive (audit-confirmed):**
1. ~~**`factory.mjs` god-function split**~~ — **DONE this session (see §9).** `cmdTools` 462→109 lines (thin orchestrator); `deriveSchemaFromUseCase` + `deriveColumnsForEntity` (the latter landed via PR #4) both extracted. 8 renderer/writer modules, all gated by a new byte-exact parity oracle.
2. **Error-handling tier** — establish DEBUG/WARN/throw discipline over the ~71 silent catches. The first concrete pieces landed this session (transport.mjs daemon→local fallback trace; harness-journal + factory-core silent catches). The broad sweep over the remaining catches is still open.
3. **Blocking I/O on HTTP paths** — `factory-bridge.js submitFactoryRun` (sync→job-based; not purely behavior-preserving — flag it).

**Larger / env-gated:**
4. **Hono migration** of the ~60 remaining legacy factory `server.js` routes (strangler already started; needs runnable server to verify streaming/POST).
5. **`mcp` → citty subcommands** (`mcp deploy|doctor|…`).
6. **Python services** (`mcp-service`, `simulator-runtime`) — typer (CLI), tenacity (retry), structlog (logging), httpx; pydantic already v2.
7. **action-kind reconciliation** — `packages/contracts/src/action-kinds.ts` documents 5 divergent vocabularies awaiting a behavior-changing unification (biggest architectural debt).

**CSV STEP-B:** swap `@ge/std/csv-io` internals to `csv-parse`/`csv-stringify` once a GE_SOURCE_DATE golden-diff run proves byte-identical output.

---

## 8. Recommended next step
The god-function split (§9) and the first error-handling pieces are done. The next offline-verifiable slices, in order of value/safety:
1. ~~`deriveAgentWorkflow` + its instruction helpers (`contractGovernancePreamble`, `sharedAgentGuardrails`, `buildStepInstruction`) → an `agent-workflow` module.~~ **DONE** — see `factory/agents/agent-workflow-derivation.mjs` (`factory.mjs` imports `deriveAgentWorkflow`/`buildStepInstruction`/`sharedAgentGuardrails` from it).
2. ~~`buildCloudDataArtifacts` → `factory/data/`~~ **DONE** — see `factory/data/build-cloud-data-artifacts.mjs` (plus `factory/data/render-cloud-data-plan.mjs` for the pure renderers).
3. The broad error-handling sweep over the remaining silent catches.

**Do NOT** decompose `cmdTest` / `cmdRegister` / `cmdDeploy` offline — they shell out to uv/pytest/gcloud/Agent Registry and can only be parse-checked here, so any change ships without a runtime net.

---

## 9. cmdTools / factory.mjs decomposition (this session)

The `factory.mjs` god-function split (queued item §7.1). **factory.mjs: 4849 → 3816 lines (−1033, −21%).** `cmdTools` (the deploy-path function that emits every agent's `tools.py` + `agent.py`): **462 → 109 lines**, now a flat orchestrator.

### The keystone: a byte-exact parity oracle (built FIRST)
`apps/factory/tests/factory-tools-golden.test.js` + `fixtures/tools-golden/`. Regenerates from a real manifest (asc-606-contract-analyzer) under `GE_SOURCE_DATE` and asserts byte-identical output for **9 deterministic artifacts**: `tools.py`, `agent.py`, `evals/golden.json`, the agents-cli evalset, `eval_config.json`, `optimization_config.json`, `pyproject.toml`, `agents-cli-manifest.yaml`, `.agent_engine_config.json`. This is what made parallel-safe, fast extraction possible — the bottleneck was always *verification*, not editing. Verified the oracle catches drift (perturb a renderer → fail; revert → green). Regeneration instructions are in the test header. (Note: oracle tests spawn `node` per case, so flaky subprocess **timeouts** inflate the fail *count* — judge by distinct fail *names*; only `skill registry…` is a real pre-existing environmental failure.)

### Modules extracted (each a verbatim move, gated green)
| Commit | Module | What |
|---|---|---|
| `7c6bb9e` | `factory/tools/py-emit.mjs`, `factory/tools/tool-naming.mjs` | shared Python-emit + tool-naming primitives (the dependency that was blocking renderer extraction) |
| `c5b0e0d` | `factory/tools/render-query-tools.mjs`, `factory/agents/render-agent-py.mjs` | per-table query tools; the ~230-line agent.py emitter (single + multi-agent) |
| `69cf2da` | `factory/tools/render-tools-py.mjs` (`renderToolsPy`), `factory/tools/render-contract-tools.mjs` | full tools.py assembly + behavior-contract tools |
| `79ccb2f` | `factory/agents/okf-artifacts.mjs` | OKF knowledge-bundle + coverage-sidecar writer |
| `1d3c0ae` | `factory/evals/render-eval-artifacts.mjs` | the 4 eval-artifact renderers (oracle extended to pin them) |
| `5a45f72` | `factory/runtime/agents-cli-metadata.mjs` | pyproject/manifest/engine-config writer (oracle extended to pin them) |
| `99bf0d4` | `factory/use-case/schema-derivation.mjs` | legacy `deriveSchemaFromUseCase` + its private cluster |

### Verification beyond the oracle
- New offline unit tests: `factory-render-agent-py.test.js` (locks the multi-agent `SequentialAgent`/`ParallelAgent` branch the single-agent golden can't reach), `factory-render-tools-py.test.js`.
- For moves the oracle doesn't cover (OKF bundle, schema derivation), proved byte-parity with **stash-diff harnesses** against the inline baseline before landing — schema-derivation verified on BOTH the heuristic path (24,464 B) and the generationSpec delegation branch (5,630 B).
- `buildAgentQualityPlan` is **injected** into `deriveSchemaFromUseCase` / `deriveSchemaFromGenerationSpec` (it also drives the agent.py emitter, so it stays in factory.mjs); `__test` binds it to keep the test-facing 2-arg signature.

### Update: further decomposition since this section was written
`factory.mjs` is now **2505 lines**, not the 3816 above — commit `6a52cea` (later than this session) extracted the cloud-facing lifecycle stages the same way, via dependency injection rather than import-back: `cmdMcp`/`cmdDeploy`/`cmdDeployStatus`/`cmdVerifyLive`/`cmdRegister`/`cmdPublish` → `factory/lifecycle/deploy.mjs`; `cmdHarnessReview`/`cmdHarnessRefine` → `factory/harness/harness.mjs`; the `cmdDataPlan` file-writing orchestration → `factory/data/build-cloud-data-artifacts.mjs` (see §8.2). `factory.mjs` retains the core local pipeline commands (init/schema/generate/tools/test/status/reset/quickstart/from-usecase/batch-audit/quality-gate/promotion-gate) and the shared pipeline-state helpers.
