# WS2 — Make the registry an honest, complete single source for MCP and console routes

**Status:** `[ ]` open
**Write-set:** `packages/capability-registry/src/registry.mjs` (integration-owned
— shared conceptually with WS3, but on disjoint lines: WS3 only touches the
single `mcp:` legacy-command line in `apps/factory/scripts/factory/registry.mjs`,
a different file) · `tools/mcp-server.mjs` · `tools/lib/factory-core.mjs`
(new re-exports only) · `apps/console/src/server/ge-api.mjs` (one new route
row) · `packages/capability-registry/src/surface-parity.test.mjs` (extend) ·
NEW `tools/ge/console.test.mjs` · `tools/ge/runs.mjs` (delete one export)
**Depends on:** nothing (scheduled Wave 2 for merge hygiene — see
`00-orchestration.md`). **Blocks:** nothing.

## Problem (verified 2026-07-05 — re-verify line numbers before editing)

Five independent gaps, all in the same "registry claims to be the single
source of truth for MCP + console routing" surface
(`packages/capability-registry/src/registry.mjs`, established by
`docs/plans/taste-campaign/01-registry-single-source.md`, done 2026-07-02).

### 2a. Three `okf.enrich.*` commands have no `mcp` block

`registry.mjs` entries for the enriching-okf-blueprints skill's six verbs
(~line 624-833, comment block "OKF blueprint quality + enrichment"):
`okf.enrich.plan` (~753) HAS an `mcp` block (`factory_enrich_plan`, the only
enrich handler in `tools/mcp-server.mjs:268`). `okf.enrich.generate`
(~780), `okf.enrich.apply` (~798, `risk: "writes-repo"`), and
`okf.enrich.shard` (~816, `risk: "writes-repo"`) have `argv` functions
(so the CLI/console-job path already works) but no `mcp` block at all —
`tools/mcp-server.mjs` is registry-derived
(`for (const command of Object.values(GE_COMMANDS)) { if (!command.mcp)
continue; ... }`), so the missing block IS the entire gap; nothing else to
wire.

Their CLI flags (`tools/ge/okf.mjs:117-119`, transcribe verbatim, do not
invent new params):
- `enrichGenerate`: `spec` (string, required), `target` (string, default
  `"L4"`), `root` (string, default `"okf"`), `pack-root` (string, default
  `"domain-packs"`), `out` (string, optional — write patch JSON here),
  `max-evals` (string, default `"5"`).
- `enrichApply`: `patch` (string, required), `root` (string, default
  `"okf"`), `write` (boolean), `force` (boolean).
- `enrichShard`: `plan` (string, required), `out` (string, required).

**The dryRun guardrail decision (state it, don't skip it):** `enrichApply`'s
CLI default (`--write` unset) is already a dry run — `applyEnrichmentPatch`
classifies actions without executing until `--write` is passed. The MCP
param descriptor should expose `write` (optional boolean) mapping straight
to `--write`, defaulting to falsy — so an MCP-invoked `factory_okf_enrich_apply`
call is a dry run by default unless the caller explicitly sets
`write: true`. This is not a new guardrail invention; it's carrying the
CLI's own default-safe behavior across the MCP boundary unchanged. Do not
add a separate `confirm`/`yes` flag that doesn't exist in the CLI — that
would widen the surface beyond what `argv` already accepts.

### 2b. Five commands lack console routes despite being registry-complete otherwise

- `systems.bind` (~629), `systems.unbind` (~669): `risk:
  "starts-local-workloads"`, `method: null, path: null`, already have `mcp`
  blocks. The registry already has a generic POST job-sentinel route in
  `ge-api.mjs` (~line 346): `{ method: "POST", match: (p) =>
  commandForRoute("POST", p) ? {} : null, handle: ... }` — this picks up
  **any** registry entry with `method: "POST"` and a matching `path`
  automatically. No new `ge-api.mjs` code is needed for these two: just set
  `method: "POST", path: "/api/ge/systems/bind"` and
  `"/api/ge/systems/unbind"` on the two entries.
- `systems.bindings` (~655), `byo.doctor` (~683), `evals.coverage` (~460ish,
  after `evals.import`): all `risk: "read-only"`, already have `mcp` blocks
  (verified: 9 of the 12 entries in the ~624-833 comment block already have
  `mcp`, confirming finding 2c below), but there is **no generic GET route**
  in `ge-api.mjs` — only bespoke per-endpoint GET rows (`/api/ge/status`,
  `/api/ge/commands`, `/api/ge/position`, etc., ~line 18-284) and the one
  generic POST catch-all. You must add ONE new generic GET catch-all row,
  mirroring the POST one's shape, that resolves via `commandForRoute("GET",
  parts)` — `commandForRoute` (`registry.mjs:1452`) is already
  method-agnostic, it just has never been called with `"GET"` from
  `ge-api.mjs`.
  Unlike the POST catch-all (which returns a `{ job: ... }` sentinel for
  the transport to spawn `ge <argv>` async), these three commands are fast
  (`expectedDuration: "under 10s"`) and read-only — return JSON directly,
  in-process, not via a spawned job. The underlying functions already exist
  and are what `tools/mcp-server.mjs` itself calls (reuse them, don't
  re-implement or shell out):
  - `systems.bindings` → `tools/mcp-server.mjs:236-239` calls
    `(await import("@ge/byo-systems")).readBindings({ dir:
    byoSystems.defaultBindingsDir(REPO_ROOT) })`.
  - `byo.doctor` → `tools/mcp-server.mjs:246-250` calls
    `loadByoManifest`/`planByoApply` from `tools/lib/byo-manifest.mjs`.
  - `evals.coverage` → `tools/mcp-server.mjs:123` calls `evalsCoverage({ id:
    a.id })` from `tools/lib/evals/coverage-command.mjs`.
  `tools/lib/factory-core.mjs` (the module `apps/console/src/server/
  transport.mjs:15` re-exports as `core`) does not currently export any of
  these three (`grep -n "evalsCoverage\|byo-manifest\|byo-systems"
  tools/lib/factory-core.mjs` returns nothing as of 2026-07-05) — add thin
  re-exports there (same pattern as its existing exports), then have the new
  GET route call `core.evalsCoverage(...)` / `core.byoDoctor(...)` /
  `core.systemsBindings(...)`. Give the three new `ge-api.mjs`-facing
  wrapper functions names distinct from any MCP-internal helper to avoid
  confusion, but delegate to the exact same underlying library calls MCP
  uses — no parallel re-implementation.

### 2c. Stale registry comment

The comment at `registry.mjs:624-628` (immediately before `systems.bind`)
reads: *"CLI-only for now (method/path null, no mcp blocks — widening MCP
is a separate deliberate act...)"*. Verified: of the 12 entries this
comment covers (`systems.bind`, `systems.bindings`, `systems.unbind`,
`byo.doctor`, `byo.apply`, `models.doctor`, `okf.quality.audit`,
`okf.enrich.plan`, `okf.enrich.generate`, `okf.enrich.apply`,
`okf.enrich.shard`, `okf.eval.verify`), **9 already have `mcp` blocks** —
only the three `okf.enrich.*` ones from 2a lack them. The comment is
false as written. Fix: rewrite it to describe the actual state (e.g. "most
of these have mcp blocks; okf.enrich.generate/apply/shard don't yet — being
added, see docs/plans/audit-fix-wave/02-registry-mcp-completion.md") or
simply delete the "no mcp blocks" clause once 2a lands and the clause is no
longer true for any entry in the block.

### 2d. `pipeline.run` has no remote surface at all — decision needed, not just a fix

`registry.mjs:1090` `pipeline.run`: `method: null, path: null`, no `mcp`
block anywhere in `tools/mcp-server.mjs` (zero `pipeline` references), and
its `argv` function ignores `body` entirely (verified: re-grep the entry at
implementation time, the audit found `argv` takes no params from the
request body). This is a first-class resumable pipeline command
(spec/data/simulator/build/eval/preview gates) with zero remote surface.
**Decision the worker must make and record in the PR description:** either
(a) add param descriptors mirroring its actual CLI flags + an `mcp` block +
a console route (treat it like any other long-running command), or (b)
explicitly document it as CLI-only by strengthening the comment above it to
say so and why (e.g. it's a meta-command that dispatches to already-exposed
sub-commands, so exposing it again would be redundant — verify this claim
against `tools/ge/pipeline.mjs` before asserting it). Do not leave it
silently ambiguous.

### 2e. Dead export + missing test

- `tools/ge/runs.mjs:26`: `export const runsResumeCmd =
  runtimeLeaves.resume;` has zero importers repo-wide (`runs.mjs:296`'s
  `subCommands` table re-derives `resume: runtimeLeaves.resume` inline
  instead of using the export). Delete the export.
- No `tools/ge/console.test.mjs` exists (verified: `ls
  tools/ge/console.test.mjs` → not found) even though `ge console
  deploy`/`doctor` are fully wired
  (`tools/ge/console.mjs:13-39,41-54` → `tools/lib/planes/factory-plane.mjs`)
  with plane-level tests but no command-layer test. Add a thin
  arg-parsing/render test mirroring the shape of another `tools/ge/*.test.mjs`
  file for a similarly-thin command wrapper (pick one via `ls tools/ge/*.test.mjs`
  and copy its structure, don't invent a new test-style).

## Target

Every registry entry with an `mcp` block is genuinely reachable from
`tools/mcp-server.mjs` (unchanged from before — this workstream is
additive-only for that count, `+3` exactly). Every registry entry whose CLI
command is read-only-and-fast or local-mutating-and-fast has a console
route through one of the two generic catch-alls (POST job-sentinel,
existing; GET direct-return, new). The one false/stale comment reads true.
The one dead export is gone. `pipeline.run`'s remote-surface status is a
recorded decision, not silence.

## Step 1 — snapshot before touching anything (verification net)

```bash
grep -c 'mcp: {' packages/capability-registry/src/registry.mjs   # record N
grep -c 'server.tool\|command.mcp' tools/mcp-server.mjs           # sanity: registry-derived loop, not hand-written
bun test packages/capability-registry/src/surface-parity.test.mjs  # must be green before you start (it's the existing oracle)
```
`surface-parity.test.mjs`'s two tests (`every entry satisfies the
@ge/core-api capability contract`, `every declared console route resolves
through commandForRoute`) are your regression net for 2b/2c — extend them,
don't bypass them.

## Step 2 — 2a: add the three `okf.enrich.*` mcp blocks

Add `mcp` blocks to `okf.enrich.generate`, `okf.enrich.apply`,
`okf.enrich.shard` in `registry.mjs`, mirroring `okf.enrich.plan`'s
existing block shape (`tool: "factory_okf_enrich_<verb>"` — pick the exact
naming convention already used elsewhere for multi-word enrich tools, e.g.
`factory_enrich_plan` not `factory_okf_enrich_plan`; grep
`tools/mcp-server.mjs`'s existing `factory_*` names before inventing new
ones). Params transcribe the CLI flags listed in Problem 2a field-for-field,
`optional: true` for everything except `enrichGenerate`'s `spec` and
`enrichApply`'s `patch` and `enrichShard`'s `plan`+`out` (all required per
the CLI's `required: true`). Add corresponding handler bodies to
`tools/mcp-server.mjs`'s registry-derived loop area (near
`"okf.enrich.plan": async (a) => {` at line 268) calling the same
underlying functions the CLI uses (`generateEnrichmentPatch`,
`applyEnrichmentPatch`, `shardEnrichmentPlan` — grep `tools/ge/okf.mjs` for
their exact import paths).

## Step 3 — 2b: five console routes

- `systems.bind`, `systems.unbind`: set `method: "POST"` +
  `path: "/api/ge/systems/bind"` / `"/api/ge/systems/unbind"`. No
  `ge-api.mjs` change needed — verify with
  `bun test apps/console/src/server/ge-api.test.mjs` after the registry
  change (the existing table-driven matrix should pick these up if it
  iterates `GE_COMMAND_LIST`; if it doesn't, that's the extension to make).
- `systems.bindings`, `byo.doctor`, `evals.coverage`: set `method: "GET"` +
  a `path` (`/api/ge/systems/bindings`, `/api/ge/byo/doctor`,
  `/api/ge/evals/coverage`). Add re-exports to `tools/lib/factory-core.mjs`
  for the three underlying calls (Problem 2b lists the exact functions to
  delegate to). Add ONE new row to `ge-api.mjs`'s `ROUTES` array, placed
  near the POST catch-all (~line 346), shape:
  ```js
  {
    method: "GET",
    match: (p) => commandForRoute("GET", p) ? {} : null,
    handle: async ({ core, req }) => {
      const command = commandForRoute("GET", req.path.split("/").filter(Boolean));
      // dispatch by id to the three new core.* wrappers; extend this map
      // as more GET-routed commands are added — do not special-case paths.
      const GET_HANDLERS = {
        "systems.bindings": () => core.systemsBindings(),
        "byo.doctor": (q) => core.byoDoctor(q),
        "evals.coverage": (q) => core.evalsCoverage(q),
      };
      const fn = GET_HANDLERS[command.id];
      if (!fn) return { status: 501, json: { error: `no GET handler wired for ${command.id}` } };
      return { status: 200, json: await fn(req.query || {}) };
    },
  },
  ```
  (Adjust to match `ge-api.mjs`'s actual `match(parts)`/`handle(ctx)`
  calling convention exactly — read the POST row's real signature first,
  the sketch above is illustrative, not verbatim.)

## Step 4 — 2c: fix the stale comment

Rewrite `registry.mjs:624-628` once Step 2 lands (so "no mcp blocks" is no
longer true for any of the 12 entries it's false for today, except
possibly if you decide not to add all three — reconcile the comment with
whatever the end state actually is).

## Step 5 — 2d: record the `pipeline.run` decision

Read `tools/ge/pipeline.mjs` to understand what `ge pipeline run` actually
does end-to-end before deciding. Implement (a) or (b) from Problem 2d and
state which, and why, in the registry comment right above the entry and in
the PR description.

## Step 6 — 2e: delete the dead export, add the console test

`tools/ge/runs.mjs`: delete the `runsResumeCmd` export line. Add
`tools/ge/console.test.mjs` per Problem 2e's guidance.

## Definition of done

- [ ] `grep -c 'mcp: {' packages/capability-registry/src/registry.mjs`
      equals the Step-1 snapshot **+3**.
- [ ] `bun test packages/capability-registry/src/surface-parity.test.mjs`
      green, including any extension you added.
- [ ] `bun test apps/console/src/server/ge-api.test.mjs` green, with new
      cases covering the 5 routes from Step 3 (both the 404-parity-style
      negative case and a positive dispatch case per route).
- [ ] `grep -n "runsResumeCmd" tools/ge/runs.mjs` → no match.
- [ ] `bun test tools/ge/console.test.mjs` green (new file).
- [ ] The `registry.mjs:624-628` comment, re-read, is true of every entry
      it covers.
- [ ] `pipeline.run`'s decision (2d) is recorded in-repo (a comment, or a
      shipped mcp block + route) — not left as this doc's open question.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Widening the MCP tool surface beyond the three named `okf.enrich.*`
  blocks and whatever `pipeline.run` decision you make — no new tools for
  `up`/`data.up`/`daemon.start`/`agents.build.local`/`mission.run` (still
  not exposed today per `01-registry-single-source.md`'s original
  Forbidden list, unchanged).
- Adding a `confirm`/`force`-style guardrail to `okf.enrich.apply`'s MCP
  params beyond what its CLI already accepts (`write`, `force`) — the CLI
  is the contract, don't invent MCP-only safety knobs.
- Rewriting any existing `mcp` block's description "better" — only the
  three new ones and the stale comment fix are in scope.
- Shelling out to `ge <argv>` from the new GET route instead of reusing the
  in-process functions MCP already calls — that would be a second,
  divergent implementation of the same read.
- Touching `tools/lib` files other than `factory-core.mjs`'s new
  re-exports (broader `tools/lib` topology is out of scope for this wave).

---
Worker protocol (inherited from `00-orchestration.md`): worktree forks from
origin/main; merge Wave 1 (WS1, WS5) first if not already in main; commit
incrementally with the repo's trailer convention; never push, never stash;
final report is raw data — branch, `git log --oneline`, each DoD item with
its actual output, deviations each justified in one line. A separate
reviewer re-runs the DoD before merge.
