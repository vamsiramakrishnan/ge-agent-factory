# WS5 — Generated truth: reference docs, diagrams, and tokens emitted from source

**Status:** `[ ]` open — four independent tracks (A–D), each assignable to a
separate worker; their write-sets are disjoint.
**Depends on:** WS1 merged (track A reads the enlarged registry); WS2 merged
(track D only).

Principle (house rule 8): a drift-checker comparing two hand-written copies is
a stopgap; the fix is a generator plus a `--check` that byte-compares the
generated region. Every track follows the same pattern: **marker-delimited
generated regions, a generator script, a `--check` mode wired into
`docs:gate`/`source:hygiene`, hand-written prose untouched outside markers.**

Marker convention (all tracks, exact strings):

```
<!-- BEGIN GENERATED: <track-id> — do not edit; run `bun run <script>` -->
…
<!-- END GENERATED: <track-id> -->
```

The docs website sync (`apps/docs/scripts/sync-content.mjs`) passes HTML
comments through untouched — no site work needed. After any track lands, run
`bun run docs:site:build` to prove the page still renders.

---

## Track A — `ge` CLI reference generated from the citty tree

**Write-set:** `tools/ge.mjs` (export + entry-guard only) · NEW
`tools/gen-cli-reference.mjs` · `docs/reference/cli.md` (generated region) ·
`package.json` (scripts)

Current facts: every command group in `tools/ge/*.mjs` is
`defineCommand({ meta: {name, description}, args: {…}, subCommands })`;
`tools/ge.mjs` assembles the root `defineCommand` with ~20 `subCommands`.
The tree is plain-object-walkable. `docs/reference/cli.md` is entirely
hand-written today.

1. **Make the root importable without running the CLI.** In `tools/ge.mjs`,
   export the root command (`export const rootCommand = …`) and guard
   execution with the entry-point pattern already used by
   `apps/factory/scripts/factory.mjs` (`__isEntryPoint`, L~2502 — copy that
   mechanism, don't invent one). BEHAVIOR-PRESERVING: `ge …` invocations are
   unchanged; verify `ge --help` and `ge doctor --json` byte-identical
   before/after.
2. **`tools/gen-cli-reference.mjs`**: import `rootCommand`, walk
   `subCommands` recursively (citty allows lazy `() => import(…)` subcommands
   — `await` them if encountered), and render per group:
   a `###` heading per command path (`ge agents build`), the
   `meta.description`, then an args table `| Flag | Type | Description |`
   (positionals listed first, `required` marked, `alias` shown as
   `--project / --gcp-project`). Skip the shared `common` flags per-command;
   render them once in a "Shared flags" subsection (they come from
   `tools/ge/shared.mjs`'s `common` — import it and diff each command's args
   against it). Flags with no `description` render an empty cell — **do not
   invent prose**; missing descriptions are a finding to fix in
   `tools/ge/*.mjs` `args` (allowed: adding `description` strings to args is
   in-scope and improves `--help` too).
3. Replace the hand-written `ge` sections of `docs/reference/cli.md`
   (subsections "Status board" through "Declarative reconcile") with one
   generated region `ge-command-tree`. The `factory` CLI and `mise` sections
   stay hand-written (the 8 legacy passthrough factory commands aren't
   introspectable). Fold any hand-written fact the generator can't produce
   (risk notes, typical duration) into `meta.description` strings rather than
   losing them.
4. Wire up: `"docs:cli": "node tools/gen-cli-reference.mjs"`,
   `"docs:cli:check": "node tools/gen-cli-reference.mjs --check"` (regenerate
   in-memory, byte-compare the marked region, exit 1 on drift + print a
   diff), and append `docs:cli:check` to the `docs:gate` script.

Done when: `bun run docs:cli:check` green in CI; deleting a flag from
`tools/ge/agents.mjs` makes it fail (prove once, revert); `ge --help` output
unchanged; `bun run docs:site:build` green.

## Track B — Stage-graph diagram generated from `FACTORY_STAGE_GRAPH`

**Write-set:** NEW `apps/factory/scripts/gen-stage-diagram.mjs` · NEW
`docs/diagrams-src/factory-stages.mmd` (generated) · one `<img>` insertion in
`docs/reference/architecture.md` · `package.json` (scripts)

Current facts: `apps/factory/src/factory-orchestration.js` exports
`FACTORY_STAGE_GRAPH` — ordered array of 14
`{ id, label, retry, owner, artifacts[] }`; order IS the edge list
(`nextFactoryStage` = index+1). `owner` ∈ `control_plane`,
`cloud_run_service`, `cloud_build`, `cloud_tasks`.

1. Generator lives in `apps/factory/scripts/` (it imports app source; putting
   it in `tools/` would cross the layering guard). It emits
   `docs/diagrams-src/factory-stages.mmd`: `flowchart LR`, one node per stage
   (`id["label"]`), linear edges from array order, one `classDef` per owner
   using ONLY palette hexes already in `packages/design/src/palette.mjs`
   (import `PALETTE` — packages are importable from apps).
2. **Renderer landmine** (docs/DESIGN.md): `classDef`/`class` lines must NOT
   end with `;` — a trailing semicolon silently fails to match and renders a
   phantom node named `class`. The generator must emit these lines
   semicolon-free, and its test must assert no generated `classDef`/`class`
   line ends with `;`.
3. Header comment inside the `.mmd`: `%% GENERATED from
   apps/factory/src/factory-orchestration.js — run bun run docs:stage-diagram`.
4. Render via the existing pipeline: `bun run docs:diagrams` (the `.mmd` →
   `.svg` drift gate `docs:diagrams:check` then covers the SVG for free).
   Add `"docs:stage-diagram": "node apps/factory/scripts/gen-stage-diagram.mjs"`
   and a `--check` mode; append to `docs:gate`.
5. Embed the SVG in `docs/reference/architecture.md` (stages section) with
   the `<p align="center"><img …>` house pattern and real alt text. Do NOT
   delete `factory-line.mmd`/`.svg` — that is the *conceptual* three-movement
   diagram; this is the *literal* stage graph. Both earn their place.

Done when: adding a fake stage to `FACTORY_STAGE_GRAPH` flips
`docs:stage-diagram --check` red (prove once, revert); `bun run docs:gate`
green; page renders on the site.

## Track C — Design tokens generated from `palette.mjs`

**Write-set:** NEW `packages/design/scripts/gen-tokens.mjs` · marked regions in
`packages/design/src/tokens.css`, `docs/_sass/color_schemes/ge.scss`,
`docs/_sass/custom/setup.scss` · `tools/check-design-tokens.mjs` +
`tools/lib/design-tokens.mjs` (flip to generator-check) · `package.json`

Current facts: `PALETTE` (flat `{ camelCaseKey: "#hex" }`) is hand-mirrored
into tokens.css and ge.scss (both gated by `check-design-tokens.mjs`, which
does **value-set membership only** — it cannot catch a wrong name→value
pairing) and setup.scss (ungated). `tools/lib/docs-diagram-theme.mjs` already
imports `PALETTE` — that is the model consumer.

1. **Decision, recorded in the generator header:** `palette.mjs` becomes the
   canonical source (today's comments call tokens.css canonical while
   requiring palette.mjs to mirror it — invert this; palette.mjs is the only
   copy that is importable everywhere).
2. `gen-tokens.mjs` owns three marked regions (CSS/SCSS comment markers,
   `/* BEGIN GENERATED: palette */`): the `--color-*` custom-property block in
   tokens.css (ONLY that block — the Tailwind theme and component classes
   around it stay hand-written), the full variable block of ge.scss, and the
   `$blue-*`/`$green-*` ramp in setup.scss. Name→token mapping lives in the
   generator as one explicit table (e.g. `primary → --color-primary` /
   `$link-color` / `$blue-200`), which — unlike the current checker — pins
   name↔value pairs exactly.
3. Rewrite `check-design-tokens.mjs` to call the generator's `--check`
   (byte-compare regions) instead of regex value-set membership. Keep the
   script name and its place in the gate so `AGENTS.md`/CI wiring is
   untouched. Delete the now-dead regex machinery in
   `tools/lib/design-tokens.mjs` (keep the file if other exports live there —
   read it first).
4. Out of scope: `apps/docs/src/styles/custom.css` (Starlight vars are a
   semantic mapping incl. a dark palette that has no PALETTE source — leave
   hand-written with its existing comment pointing at tokens.css).

Done when: changing `PALETTE.primary` + running `bun run docs:tokens`
propagates to all three files; `node tools/check-design-tokens.mjs` fails on
a manual edit inside any marked region (prove once, revert); Jekyll + site
builds green.

## Track D — Spec-schema reference generated from `@ge/agent-spec` *(after WS2)*

**Write-set:** NEW `packages/agent-spec/scripts/gen-spec-reference.mjs` ·
generated region in `docs/reference/spec-schema.md` · `package.json`

1. Use zod v4's native `z.toJSONSchema(GenerationSpecSchema)` and render the
   field tables (name, type, required, constraints like `min(2)`, enum
   values) between markers — replacing the hand-written field tables ONLY.
   The prose sections, the consumer checklist, and the round-trip notes stay
   hand-written.
2. Enum values (`toolIntents[].kind`, `escalationRules[].action`, …) now
   render from the schema — delete their hand-written duplicates inside the
   generated region.
3. `--check` into `docs:gate`, same pattern as tracks A–C.

Done when: adding a field to `ToolIntentSchema` flips the check red (prove
once, revert); site builds green.

## Forbidden (all tracks)

- Generating whole files that carry hand-written prose — marked regions only.
- Inventing descriptions the source doesn't contain (empty cell + fix the
  source instead).
- New dependencies for TOML/markdown/JSON-schema rendering — string
  templates and existing deps only.
- Touching `apps/docs/scripts/sync-content.mjs` (nothing here needs it).
