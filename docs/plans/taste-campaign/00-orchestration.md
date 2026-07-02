# Taste campaign — orchestration guide

Prescriptive implementation documents for finishing the architecture-taste
campaign. Written to be executed by an orchestrating agent driving many
worker agents in parallel. Each numbered doc in this directory is one
**workstream**: self-contained, with an exact write-set, verification
protocol, and definition of done. Read this file first; it is the contract
every worker inherits.

Status legend used in every doc: `[ ]` open · `[x]` done · `[~]` partially
landed (verify before starting).

## Non-negotiable house rules (inherited by every workstream)

1. **Green at every commit.** Before each commit run:
   ```bash
   node tools/source-hygiene.mjs && node tools/check-no-app-imports.mjs && node apps/factory/scripts/gen-harness-schemas.mjs --check && node tools/check-design-tokens.mjs
   ```
   and `bun run test:gated` (judge by *names* against
   `tools/known-test-failures.json`, never by raw count — subprocess-heavy
   golden tests produce flaky timeout counts). If you touched `docs/`, also
   `bun run docs:gate`. If you touched `docs/` top-level pages, also
   `bun run docs:site:build` (fails loudly on unmapped pages / broken links).
2. **Oracle first, extraction second.** Any change to code that emits
   artifacts (Python, YAML, JSON, CSV, SSE frames) must be gated by a
   byte-exact or behavior parity test that exists and passes BEFORE the
   change. The house pattern is `apps/factory/tests/*-golden.test.js` +
   `tests/golden-test-helpers.mjs` (`runGoldenOracle`, pinned
   `GE_SOURCE_DATE=2026-01-01`). If an oracle doesn't cover your seam, build
   the oracle as your first commit.
3. **Behavior-preserving unless the doc explicitly flags otherwise.** Where a
   doc marks a step `BEHAVIOR-CHANGE`, it must land as its own commit with
   the change named in the commit subject.
4. **Never blind-ship into the deploy path.** `cmdTest` / `cmdRegister` /
   `cmdDeploy` and anything that shells to `uv`/`pytest`/`gcloud`/Agent
   Registry can only be *parse-verified* in a sandbox. Do not decompose or
   "improve" them beyond what a doc explicitly prescribes.
5. **Never `git stash`.** Worktrees share one stash stack across concurrent
   sessions. Shelve on a throwaway branch instead.
6. **Golden fixtures are correct until proven otherwise.** If a
   `*-golden`/`parity-oracle` test fails after your change, your change broke
   determinism. Do not regenerate fixtures without proving the new output is
   right.
7. **Return/throw, don't print/exit** from `tools/lib/*` and command
   handlers. Rendering happens only at the `emit()` / `dispatch()` boundary.
8. **No new hand-mirrored constants.** If a value exists in a registry,
   schema, or palette, consume it or generate from it; a checker comparing
   two hand-written copies is a last resort, not a pattern to extend.

## Workstreams, dependency order, and parallelism

| WS | Doc | Theme | Depends on | Parallel-safe with |
|---|---|---|---|---|
| 1 | `01-registry-single-source.md` | Registry drives MCP + console routes; read-only commands enter the registry | — | 2, 3, 7 |
| 2 | `02-agent-spec-package.md` | One zod home for the agent-spec shape | — | 1, 3, 7 |
| 3 | `03-factory-mjs-finish.md` | Extract the data-gen + pipeline-state residue out of `scripts/factory.mjs` | — | 1, 2, 7 |
| 4 | `04-tools-lib-topology.md` | Folder the `tools/lib` clusters; resolve the doctor naming collision | **1 merged** (both touch `tools/lib`) | 2, 3 |
| 5 | `05-generated-truth.md` | CLI reference, stage-graph diagram, design tokens, spec-schema docs — generated from source | **1 merged** (CLI ref reads the enlarged registry); track C also after 2 | 3, 4 |
| 6 | `06-error-tier-and-orphans.md` | Finish the silent-catch sweep; resolve the three zero-importer packages | — | run LAST (touches many files thinly; cheap rebases) |
| 7 | `07-type-de-theater.md` | Real types for `run-ledger` store + `runtime` normalizers | — | 1, 2, 3 |

**Scheduling prescription for the orchestrator:**

- Wave 1 (parallel worktrees): WS1, WS2, WS3, WS7.
- Wave 2 (after WS1 merges): WS4, WS5 tracks A/B/D (+ track C after WS2).
- Wave 3: WS6.
- Each workstream = one branch (`taste/ws<N>-<slug>`), one PR, merged in
  wave order. Workers must not touch files outside their doc's write-set;
  if a needed change falls outside it, report back instead of editing.

## Write-set matrix (conflict control)

| WS | May write |
|---|---|
| 1 | `tools/lib/ge-command-registry.mjs`, `tools/mcp-server.mjs`, `apps/console/src/server/ge-api.mjs` (+ its tests), `apps/console/src/services/geClient.ts` (risk union only), NEW `tools/mcp-registry-parity.test.mjs`, NEW `tools/check-app-import-surface.mjs`, `package.json` (`source:hygiene` line only) |
| 2 | NEW `packages/agent-spec/**`, `apps/factory/src/agent-spec-registry.js`, `apps/console/src/components/interview/artifacts/specArtifact.ts`, `apps/presentation/src/types/architecture.ts` (re-export shim), `docs/reference/spec-schema.md` (checklist rows), root `package.json` (workspace dep) |
| 3 | `apps/factory/scripts/factory.mjs`, NEW files under `apps/factory/scripts/factory/{data,core}/`, their tests |
| 4 | `tools/lib/**` moves (EXCLUDING files in WS1's write-set), every importer's import-path lines, `tools/lib/factory-core.export-surface.json` only if a move forces it |
| 5 | NEW `tools/gen-cli-reference.mjs`, NEW `apps/factory/scripts/gen-stage-diagram.mjs`, NEW `packages/design/scripts/gen-tokens.mjs`, NEW `packages/agent-spec/scripts/gen-spec-reference.mjs`, `tools/ge.mjs` (export + entry-guard), marked regions in `docs/reference/{cli,spec-schema,architecture}.md` + `packages/design/src/tokens.css` + `docs/_sass/**`, `docs/diagrams-src/factory-stages.mmd`, `package.json` (`docs:*` scripts), `tools/check-design-tokens.mjs` + `tools/lib/design-tokens.mjs` (flip to generated-check) |
| 6 | Individual `catch` sites repo-wide (one-line edits), NEW `tools/check-silent-catches.mjs`, root `package.json` (`workspaces` + `source:hygiene`), `packages/{agent-workspace,factory-install,simulator-packs}/**` (integrate-or-delete), `docs/modularization-audit.md` |
| 7 | `packages/run-ledger/src/*.d.ts` + `store.mjs` (types only), `packages/runtime/src/*.d.ts` |

## Verification protocol for the orchestrator (per PR)

1. Worker's own doc checklist is fully checked in the PR description.
2. Full gate + `bun run test:gated` green in the worktree.
3. A **separate reviewer agent** re-runs the doc's "Definition of done"
   commands from scratch and diffs the claimed vs. actual outputs. Workers
   report; reviewers verify. No self-certified merges.
4. For docs-affecting workstreams (5): `bun run docs:site:build` and a
   screenshot of the regenerated page.

## What is deliberately OUT of this campaign

- **action-kinds reconciliation** (`packages/contracts/src/action-kinds.ts`)
  — behavior-changing UI/daemon vocabulary unification; has its own spec
  (`docs/design-specs/specs/2026-06-14-console-presentation-unification.md`).
- **The presentation slide mass** (363 × ~1,400-line TSX) — product decision
  pending on template-vs-bespoke; do not refactor.
- **TypeScript migration of `.mjs` packages** beyond WS7's declared scope.
- Anything on REFACTOR-HANDOFF.md's "deliberately NOT done" list (§6) —
  those are decisions, not oversights.
