# Deferred work — audit-fix wave

A greppable record of things that are genuinely deferred (real, verified
gaps with a stated reason and unlock condition) vs. labels this session
could not map to any verified gap in the codebase. Written from the
2026-07-05 read-only audit; owned by WS5
(`docs/plans/audit-fix-wave/05-doc-plan-truthing.md`) — keep it current if
implementation surfaces new information. This file exists because the
audit's own finding was: *"if these are real deferrals, write them down
somewhere greppable; today they exist only in session memory."*

## Real, verified deferrals

### Connector runtime SDK

**Status:** genuinely deferred, already partially documented.
**Evidence:** `tools/ge/systems.mjs:130` and
`packages/capability-registry/src/registry.mjs:644`'s `systems.bind` entry
both expose a `--connector`/`connector` param described as *"informational
only (no connector SDK yet)"*
(`docs/cookbooks/bring-your-own-systems.md:61` carries the same caveat).
The binding mechanism (kind: twin|mcp|rest, validated URL shapes) works
today without a connector SDK — `connector` is accepted and persisted but
not executed against.
**Unlock condition:** building a real connector SDK (a runtime that
actually loads and executes the named connector module/package against a
binding) is its own project — larger than any workstream in this wave.
Unlocks when: BYO-system integrations need connector-specific behavior
beyond generic twin/mcp/rest dispatch (e.g. custom auth flows, protocol
translation) that the current binding model can't express. Until then, the
cookbook's caveat is the accurate, sufficient documentation — no code
change needed to "finish" this; it is deliberately not a code gap.

### GE_HARNESS_PYTHON resolver quadruplication

**Status:** deferred by default, decision recorded in WS5
(`05-doc-plan-truthing.md` §5f) — this is a live decision point in this
wave, not a distant future one. See that doc for the annotate-vs-extract
call and its criteria. Not re-duplicated here to avoid the two documents
drifting apart; if you're reading this looking for the current status,
`05-doc-plan-truthing.md` is the source of truth for this item, this entry
is a pointer.

### TIMEOUTS taxonomy (`factory.mjs`, ~24 bare timeout literals)

**Status:** deferred by default, decision recorded in WS6
(`06-tooling.md` §6c). Same note as above — that doc is the source of
truth; this is a pointer so a `deferred.md` grep still surfaces it.

## Explicitly NOT deferred — already done, sometimes mislabeled as pending

### Live-fire

**Status:** DONE, not a deferral. `tools/lib/live/prove-live.mjs` + tests,
`ge prove --live`, the MCP tool `factory_prove_live`
(`docs/MCP.md:63`), and the cookbook `docs/cookbooks/prove-live.md` all
exist and are wired. If a prompt or plan elsewhere lists "live-fire items"
as an open deferral, that reference is stale — correct it at the source
(this session found no such stale reference in `docs/plans/**` or
`REFACTOR-HANDOFF.md`; if one surfaces later, it's a one-line strike, same
shape as WS5's B2/B5/B6/B9 fixes).

## Labels this session could not map to a verified gap

The following four labels were named as candidate "session-only
deferrals" going into this audit. None of them match any doc, plan, ADR, or
code comment anywhere in the repo (`grep -rn` for each exact phrase across
`docs/`, `REFACTOR-HANDOFF.md`, and code comments returns nothing), and
each has existing, working functionality nearby that already covers the
apparent intent. Recorded here — not deleted — so a human with more context
than this audit can either (a) confirm one of these names a real,
distinct gap and redirect this entry into a proper unlock-conditioned
deferral, or (b) confirm the nearby functionality already covers it and
strike the label as a naming artifact with no underlying gap.

- **"Cloud handoff-package consume path"** — nearest live functionality:
  `ge handoff package` (`tools/ge/handoff.mjs`) already builds and can
  upload a handoff package; `tools/lib/handoff-package.mjs` exists and (per
  WS3 of this wave) gets its tar-exclude list consolidated. If a *cloud
  worker* consuming an uploaded package remotely is the intended meaning,
  that's closer to `createFirestoreEventMirror`'s dormant-until-cloud
  status (see WS5 §5d) — but no doc names a "consume path" as a distinct,
  separate piece of work. Unverifiable as named.
- **"Workspace-generator adapters"** — no file, symbol, or doc uses this
  phrase. The nearest concept is `packages/run-ledger`'s `LedgerAdapter`
  contract (SQLite/Firestore adapters, typed by WS7 of the taste campaign)
  or the workspace-scaffolding path in `apps/factory/scripts/factory.mjs`'s
  generators — neither is "deferred," both are live and working. Unverifiable
  as named.
- **"Workflow-import"** — no file, symbol, or doc uses this phrase. Nearest
  concepts: `ge evals import` (`packages/capability-registry/src/registry.mjs`'s
  `evals.import` entry, imports a BYO ADK evalset — fully wired, has an mcp
  block and a console route) and OKF workflow concepts
  (`workflow/*.md` in an OKF bundle, `spec-to-okf.mjs`'s workflow-step
  mapping). Neither is a "workflow-import" gap. Unverifiable as named.
- **"Data-plane bind"** — nearest live functionality: `ge systems bind`
  (`systems.bind` in the registry, WS2 of this wave adds its console
  route) binds a contract system to a live twin/mcp/rest target — this
  already IS a bind operation against what could be called a "data plane."
  If a distinct, additional binding surface was intended, it isn't named
  anywhere in the repo. Unverifiable as named.

**If you are the human resolving this section:** the most likely
explanation is that these four labels were carried into this planning
session from an external prompt or an even-earlier conversation this audit
had no access to, and do not correspond to anything actually missing from
`ge-agent-factory` today. Treat them as noise unless you have direct
knowledge otherwise — do not let them spawn phantom workstreams in a future
wave without first re-deriving what they were supposed to mean.
