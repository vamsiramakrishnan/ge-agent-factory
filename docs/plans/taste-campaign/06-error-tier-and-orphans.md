# WS6 — Finish the silent-catch sweep; resolve the three unintegrated packages

**Status:** `[~]` partially landed (main merged a 25-site warn sweep; 58
silent sites remain as of 2026-07-02)
**Write-set:** individual `catch` sites repo-wide (one-line edits) · NEW
`tools/check-silent-catches.mjs` · root `package.json` (`workspaces` +
`source:hygiene` line) · `packages/{agent-workspace,factory-install,simulator-packs}/**` ·
`docs/modularization-audit.md`
**Depends on:** nothing. **Schedule LAST** (touches many files thinly; every
other workstream's rebase gets cheaper this way).

## Part 1 — Silent catches

Inventory command (the campaign's counting rule — keep it exact so numbers
are comparable):

```bash
grep -rnE 'catch\s*(\([^)]*\))?\s*\{\s*\}|\.catch\(\(\)\s*=>' apps tools packages \
  --include='*.mjs' --include='*.js' --include='*.ts' \
  | grep -v node_modules | grep -v '.test.'
```

58 sites at campaign start. The tier policy (already established by the main
merge — match it, don't invent a new one; read commits `ccce2c6`, `175e672`,
`1dc8a5d` for the house form):

| Situation | Required form |
|---|---|
| Failure is impossible-or-irrelevant by construction (e.g. `JSON.parse` of a value produced two lines up) | `catch { /* best-effort: <why> */ }` — comment mandatory |
| Failure means degraded output the operator should know about | `catch (e) { console.warn("<what failed>:", e?.message || e); }` — or the module's `log`/event callback where one exists (`makeEvent` level `"warn"`) |
| Failure invalidates the operation | stop swallowing: rethrow or return an error result (flag as `BEHAVIOR-CHANGE`, own commit) |
| Site is in the deploy path (`cmdTest`/`cmdRegister`/`cmdDeploy`, gcloud/pytest shell-outs) | **leave untouched**, list in the checker allowlist with reason `deploy-path` |

Procedure: classify all 58 into a table in the PR description (file:line →
tier), then sweep in per-app commits (`fix(tools): …`, `fix(console): …` —
match the merged commits' message style).

**Checker** — NEW `tools/check-silent-catches.mjs`, appended to
`source:hygiene`: fails on any `catch`-with-empty-body or `.catch(() =>` site
whose body/line lacks `best-effort:` and which is not in its embedded
allowlist (`{ file, line-independent match, reason }` entries; deploy-path
sites only). Style-match `check-no-app-imports.mjs` (scan, report, exit 1).
The allowlist is shrink-only — say so in the failure message.

## Part 2 — The three unintegrated packages

Facts: `@ge/agent-workspace`, `@ge/factory-install`, `@ge/simulator-packs`
have **zero importers** anywhere (apps, tools, scripts, package.json bins,
cloudbuild — verified twice, before and after the main merge).
`docs/modularization-audit.md` now carries truthful per-package integration
status.

Decision procedure per package (in this order, no third option):

1. Read its row in `docs/modularization-audit.md` and its README/AGENTS
   pointer. **If** the audit names a concrete first consumer (a specific file
   that should import it), implement exactly that one integration in this
   workstream (S-effort: one import site + its test), and update the audit
   row to "integrated (first consumer: <file>)".
2. **Else delete**: `git rm -r packages/<name>`, remove any reference from
   root `package.json`, update the audit row to
   "removed <date> — scaffolded in the first package wave, never integrated;
   recoverable from git history (`git log -- packages/<name>`)". Deleting a
   never-imported package is not destructive — history keeps it — but it IS
   user-visible: list the three deletions prominently in the PR description
   so the reviewer confirms intent.

Do not leave a package in the workspace "for later" — that is the state this
workstream exists to end.

## Definition of done

- [ ] Inventory grep returns only sites carrying `best-effort:` comments or
      listed in the checker allowlist; checker green and wired into
      `source:hygiene`.
- [ ] Any tier-3 (rethrow) change is its own `BEHAVIOR-CHANGE` commit.
- [ ] Zero packages in `packages/` with zero importers (either integrated or
      removed); `bun install` clean; `docs/modularization-audit.md` rows
      updated.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Blanket `console.warn` on tier-1 sites (noise is its own taste failure).
- Touching deploy-path files beyond adding allowlist entries.
- A new logging framework/abstraction — the event-level convention
  (`makeEvent`, `level:` tags) is the house tier; use it where it exists.
