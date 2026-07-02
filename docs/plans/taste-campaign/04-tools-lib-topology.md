# WS4 — `tools/lib` topology: folder the clusters, resolve the doctor collision

**Status:** `[ ]` open
**Write-set:** file moves inside `tools/lib/**` (EXCLUDING
`ge-command-registry.mjs`, which WS1 owns) · import-path lines in every
importer · `tools/lib/factory-core.export-surface.json` only if a move forces
a path note (export NAMES must not change)
**Depends on:** WS1 merged (both touch `tools/lib`; avoid cross-branch moves).

## Problem (verified 2026-07-02)

`tools/lib` is 50+ modules flat (plus `daemon/`, the one folder — created by
the runtime-daemon decomposition and the precedent to follow). Prefix clusters
hide real domains, and two files collide on a name:

- `factory-*`: `factory-core`, `factory-plane`, `factory-exec`,
  `factory-doctor`, `factory-catalog`, `factory-catalog-search`,
  `factory-local-ops`, `factory-autopilot-mission`, `factory-ledger`,
  `factory-runs`
- `mission-*`: `mission-nodes`, `mission-node-registry`,
  `mission-node-summary`, `mission-plan`, `mission-artifacts`
- planes: `data-plane`, `mcp-plane`, `factory-plane`, `tool-plane-checks`
- ledgers: `run-ledger`, `run-ledger-firestore`, `factory-ledger`
- **Collision:** `doctor.mjs` (17.5 KB, the doctor engine) vs
  `factory-doctor.mjs` (1.4 KB) vs `workspace-doctor.mjs` — readers must open
  files to learn scope.

## Target layout (exact)

```
tools/lib/
  daemon/            (exists — unchanged)
  mission/           mission-nodes.mjs, mission-node-registry.mjs,
                     mission-node-summary.mjs, mission-plan.mjs,
                     mission-artifacts.mjs (+ their .test.mjs siblings)
  planes/            data-plane.mjs, mcp-plane.mjs, factory-plane.mjs,
                     tool-plane-checks.mjs
  ledger/            run-ledger.mjs, run-ledger-firestore.mjs,
                     factory-ledger.mjs
  doctor/            doctor.mjs → doctor/engine.mjs,
                     factory-doctor.mjs → doctor/factory-summary.mjs,
                     workspace-doctor.mjs → doctor/workspace.mjs,
                     fleet-health.mjs → doctor/fleet-health.mjs
  (everything else stays flat — factory-core.mjs and its facade family,
   exec-stream, events, provision, reconcile, spec-review, register-spec,
   gcp, net, state-paths, docs tooling, etc. Do NOT create a `factory/`
   folder in this workstream: factory-core's facade family is mid-flight
   and WS1/WS5 touch its neighbors.)
```

Before renaming inside `doctor/`: read all three files' headers and confirm
the roles match the names above; if `factory-doctor.mjs` is not a summary
view, pick a name that states its actual role and record the decision in the
commit message. Naming rule: the path carries the domain, the filename carries
the role — no more `<domain>-<domain>-<role>.mjs`.

## Procedure (mechanical, one commit per folder)

1. Build the importer map first — for each file to move:
   ```bash
   grep -rln "lib/mission-nodes" apps tools packages scripts --include='*.mjs' --include='*.js' --include='*.ts' | grep -v node_modules
   ```
2. `git mv` the cluster, fix every importer path in the same commit. **No
   re-export shims** — this repo's moves update importers (see the daemon/
   and transport/ precedents in git log).
3. Tests move with their subjects (`.test.mjs` sits beside its module —
   house style).
4. After each commit: full gate + `bun test tools`. The export-surface lock
   (`factory-core.export-surface.test.mjs`) must stay green — moves must not
   change any exported NAME.
5. Check hidden path references beyond imports: some code builds paths as
   strings (`join(HERE, "lib", …)`), and `apps/console/vite.config.ts`
   aliases tools paths. Grep for each moved basename as a plain string, not
   just as an import specifier.

## Definition of done

- [ ] `ls tools/lib/*.mjs | wc -l` ≤ 40 (from 50+); `mission/`, `planes/`,
      `ledger/`, `doctor/` exist and are complete per the table.
- [ ] `ls tools/lib | grep -c doctor` → 0 at top level (all under `doctor/`).
- [ ] `grep -rn "lib/mission-nodes\|lib/data-plane\|lib/run-ledger\.mjs\|lib/doctor\.mjs\|lib/factory-doctor\|lib/workspace-doctor\|lib/fleet-health" apps tools packages scripts --include='*.mjs' --include='*.js' --include='*.ts' | grep -v node_modules`
      → no matches (all importers repointed).
- [ ] Export-surface lock green; full gate + `bun run test:gated` green.
- [ ] WS1's `tools/check-app-import-surface.mjs` allowlist updated for the
      new paths of files apps import (path updates only — no new entries).

## Forbidden

- Renaming any EXPORTED symbol (paths move, names don't).
- Touching `ge-command-registry.mjs` or `mcp-server.mjs` (WS1's write-set).
- Re-export shims / `index.mjs` barrels for the new folders.
- Creating folders beyond the four listed (no speculative taxonomy).
