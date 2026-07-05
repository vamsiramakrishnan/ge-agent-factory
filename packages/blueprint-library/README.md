# @ge/blueprint-library

The Agent Library package manager core: **every OKF bundle under `okf/` is a
buildable agent blueprint, and this package is the only thing that knows how
to turn one into the other.** `ge library` and `ge create --from-library` are
thin CLI renderers over it.

- **`generateLibraryIndex()` / `readLibraryIndex()`** — derive
  `AgentBlueprint` metadata (taxonomy, behavior contract, inventory counts,
  target readiness) from every OKF bundle under `okf/`, and maintain the
  generated `okf/library/index.json` search index (`AgentBlueprintJsonSchema` /
  `LibraryIndexJsonSchema`, `LIBRARY_SCHEMA_VERSION`).
- **`searchBlueprints()` / `resolveBlueprint()` / `blueprintStatus()` /
  `relatedBlueprints()`** — the read paths behind `ge library search|inspect|
  status|related`.
- **`createFromLibrary()`** — materializes a receipt-backed agent workspace
  (OKF contract copy, stub app/twins/evals/proof scaffolding, `ge.lock.json`)
  from a resolved blueprint; the core behind `ge create --from-library`.

Pure return/throw: no `console.log`/`process.exit`. Its only non-builtin
dependency is `yaml` (OKF bundle front matter). No `apps/*` or `tools/*`
imports.

Test: `bun test packages/blueprint-library/src`.
