# Real-System Twins and the Quality Flywheel — build plan

> **Status (2026-07-17).** Phases 0–2 have a safety-reviewed implementation;
> Phases 3 and 4 remain deferred or were superseded. This folder preserves the
> original design record, so its "ground truth" table is the 2026-07-06
> baseline rather than current operator documentation. Use the CLI reference
> and BYO skill for current commands and safety requirements.

## Thesis

One enterprise system import should produce every surface the factory
needs: a stateful twin, a live connector path, a replay corpus, evals,
and an operating skill. Today the factory synthesizes twins from static
inputs (natural language, OpenAPI files, sample rows) and proves agents
against them — but it never touches, records, or compares against the
real system, and the artifacts that would close the loop (mutation
semantics, live traces, failure-to-fix mapping) don't exist.

This plan builds that loop in five phases, ordered by dependency, plus a
parallel track of cheap wins.

## Ground truth (what exists vs. what's missing)

Verified against the tree on 2026-07-06:

| Surface | State today | Evidence |
|---|---|---|
| `ge systems synth` | NL / OpenAPI / samples → Python subprocess (`synthesize_cli.py` via stdin JSON) → overlay or promoted corpus | `packages/byo-systems/src/index.mjs:232`, `apps/factory/mcp-service/synthesis.py` |
| Simulator pack | Six-file corpus format; loader also accepts canonical `pack.json` (zero corpus usages) and inline | `packages/simulator-runtime/simulator_runtime/pack_loader.py` |
| Runtime primitives | search/get/create/submit, approvals (`approvalBlockers`), async jobs, audit events, idempotency, latency/rate-limit, failure/chaos profiles, virtual clock, webhooks | `simulator_runtime/generic.py:1052`, `idempotency.py`, `audit.py`, `failures.py`, `chaos.py` |
| `ge systems bind` | Persists `twin\|mcp\|rest` × `twin_first\|live_first\|twin_only` to `.ge/systems/bindings.json` — **stored metadata only; no code routes through a binding** | `packages/byo-systems/src/bindings.mjs:26,29`; no consumer of `mode` anywhere |
| `--connector` | Informational string, never resolved or executed | `tools/ge/systems.mjs:130` |
| Live proof | `ge drive --record/--record-cassette`, `ge prove --live` with policy-based baselines, drift detection, promotion gates | `tools/lib/live/prove-live.mjs:141-160`, `tools/lib/gates/live-gate.mjs` |
| Evals | Compile from interview-spec envelopes (not OKF markdown) with set-cover selection, coverage, imports | `tools/lib/evals/compile-command.mjs`, `packages/evalkit` |
| Failure→fix loop | None at runtime. Build-time harness review/refine exists; OKF enrichment proposes static blueprint patches | `apps/factory/src/harness-runner.js`, `registry.mjs` `okf.enrich.*` |
| Skill generation | None. `skills/` are hand-authored operator skills; no per-agent SKILL.md is rendered from a contract | `apps/factory/src/skill-registry.js` |
| Live-system profiling / recording / realism comparison | None. `simulator_runtime/replay.py` records the *simulator's own* envelopes; `tools/lib/live/` records *agent conversations* | — |

## Sequence

1. [Phase 0 — Make bindings real: dispatch seam + connector core](phase-0-binding-dispatch.md)
2. [Phase 1 — MutationModel: formalize write semantics](phase-1-mutation-model.md)
3. [Phase 2 — SystemProfile, ReplayCorpus, realism compare](phase-2-system-profile.md)
4. [Phase 3 — Failure analysis and refine on top of live proof](phase-3-analyze-refine.md)
5. [Phase 4 — The operating skill](phase-4-operating-skill.md)
6. [Parallel track and deferred items](parallel-and-deferred.md) — `ge byo lock` (early), domain packs appliable, impact-aware selection, library upgrade orchestration (deferred)

Dependency shape:

```
Phase 0 (dispatch seam, new risk level)
  ├─→ Phase 2 (profile/record/compare need a live-call path + risk level)
  │      └─→ Phase 3 traces get richer, mutation replay becomes possible
  └─→ (live_first routing for deployed agents, later)
Phase 1 (mutation model)         — independent of 0/2; static inputs only
Phase 3 (analyze/refine)         — needs traceability chain; benefits from 2
Phase 4 (operating skill)        — independent; richer after 1–3
Parallel track (byo lock)        — independent; land any time
```

## Decisions carried in from the design review

These were argued once; phase files assume them rather than re-litigating.

1. **No new pack-loader shapes.** The pack loader already juggles three
   shapes (legacy six-file, canonical, inline). Profiles, replay corpora,
   redaction reports, and realism reports are *provenance and QA
   artifacts* that live beside the pack under `.ge/`, not inside the
   runtime contract. Mutation semantics extend the existing workflows
   section rather than adding a `mutations.json` file.
2. **No second capability model.** Every new command is a
   `@ge/capability-registry` entry (route + CLI + risk + `argv(body)` +
   optional `mcp` block), dispatched through the existing console job
   runner and MCP server. No `Capability<I,O>` type with
   `localExecutor`/`cloudExecutor` — that is the killed run-plane
   abstraction returning. The run-plane stays read-only observation.
3. **One new risk level: `calls-live-readonly`.** Touching a production
   system read-only is a risk class the current vocabulary
   (`read-only` / `starts-local-workloads` / `starts-workloads` /
   `writes-repo`) cannot express. It gates permission UX on every
   surface. Added once in Phase 0, used by Phases 0 and 2.
4. **Read production, simulate mutation.** No phase issues a mutation
   against a system the operator has not explicitly marked sandbox or
   dry-run. Write semantics come from OpenAPI inference, samples,
   historical traces, and operator-provided examples.
5. **Redaction before disk.** Anything captured from a live system passes
   the redaction module before any byte is written — including request
   headers (bearer tokens). Auth is stored by reference (`env:VAR`),
   never by value. The redaction module is safety-critical and gets its
   own golden fixtures.
6. **JS/Python split rule.** Live profiling, recording, redaction, and
   dispatch live in JS packages (`tools/lib` / `packages/*`) where
   secrets handling, network policy, and the registry live. Compilation
   *into* pack sections stays in Python beside the simulator runtime,
   invoked the way `synthesize_cli.py` already is.
7. **Extend existing nouns before minting new ones.** Failure analysis
   and refinement land under `evals`/`prove`. A `flywheel` command group
   is reconsidered only after `analyze`/`refine` exist and demonstrably
   need their own noun.
8. **One parameterized operating skill first.** Per-blueprint skill
   generation (514 bundles) is a drift liability; it arrives only as a
   deterministic, `--check`-gated renderer, and only where domain packs
   contribute content a generic skill cannot.
9. **Local/cloud parity means artifact parity, not infra parity.**
   Profiles, corpora, twin packs, realism reports, proposals, and skills
   have one schema everywhere. Execution differs (local files + memory
   overlay vs. worker + Firestore/AlloyDB overlay + Secret Manager), and
   overlay durability must be an explicit choice for BYO twins — no
   silent memory-vs-firestore defaults for anything an operator intends
   to keep.

## Gates every phase must pass

- `bun run source:hygiene && node tools/check-design-tokens.mjs` — the
  standing pre-commit gate (layering, silent-catch policy, schema drift).
- `bun run test:gated` — no new names outside
  `tools/known-test-failures.json`.
- `tools/mcp-registry-parity.test.mjs` — every new registry entry with an
  `mcp` block stays in parity with the served tool surface.
- Golden/parity-oracle tests untouched unless the *new* output is proven
  right; regenerating a fixture requires that proof in the PR.
- `bun run docs:gate` when reference docs or generated regions change
  (new `ge` subcommands regenerate the CLI reference via
  `bun run docs:cli`; new console routes regenerate the API registry
  table via `bun run docs:console-api`).

## Merge strategy

- One tracking issue for the initiative; one PR per phase, split further
  where a phase file marks a natural seam (schema first, consumer
  second).
- Every phase lands with its registry entries, parity tests, and doctor
  checks in the same PR as the behavior — a command without a doctor
  check and a `fix:` line is not done.
- Behavior-preserving default: unbound and `twin_only` systems must be
  byte-identical to today after every phase. New behavior is opt-in via
  bindings, flags, or new commands.
