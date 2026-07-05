# @ge/byo-systems

Bring-your-own-system core, shared by every surface that lists or
synthesizes simulator system twins:

- **`listKnownSystems`** — read the generator's `registry.json` corpus of
  built-in simulated systems (id/displayName/maturity/family).
- **`buildSynthesisSpec`** — validate a synthesis request (natural-language
  description, `{collection: [rows]}` samples, or an OpenAPI spec;
  `MAX_DESCRIPTION_BYTES` guard) into the spec `synthesize_cli.py` accepts.
- **`runSynthesis` / `synthesizeSystem`** — spawn the generator's
  `synthesize_cli.py` with that spec (`--stdin --include-contract`,
  optionally `--promote` to graduate the result into the curated corpus).
- **`resolveSynthesisPython` / `probeInterpreter` / `checkToolchain`** —
  interpreter resolution (`GE_HARNESS_PYTHON` → nearest `.venv` → `python3`)
  and the structured toolchain doctor behind `ge systems doctor`.

Every filesystem/interpreter path is injected (`{repoRoot}` or explicit
overrides) — the package never derives paths from its own location, so the
console, CLI, and MCP server each bind their own roots. Consumers:
`apps/console/src/server/systems.mjs` (the `/api/systems/*` routes),
`tools/ge/systems.mjs` (`ge systems list|synth|doctor`), and
`tools/mcp-server.mjs` (`factory_systems_*` tools).

Leaf package: node builtins only — no `apps/*`, `tools/*`, or third-party
imports. Test: `bun test packages/byo-systems/src`.
