---
title: Design
nav_order: 9
layout: default
---

# Docs design system

The style guide for anyone (human or agent) adding a page or a diagram to this
site. Reference page, not an essay — if you're about to add a `.mmd` file or a
callout, read the relevant section below first.

> The public website now renders these same `docs/` pages through
> Astro/Starlight (`apps/docs` — see its README). Everything on this page
> about authoring in `docs/` (diagrams, callouts, links) still governs; the
> sync step translates callouts and links for the website automatically. A
> **new top-level** `docs/*.md` page additionally needs a `PAGE_MAP` entry in
> `apps/docs/scripts/sync-content.mjs` to get a place in the site's sidebar.
{: .status }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Theme

The site is Jekyll + [just-the-docs](https://just-the-docs.com), rendered
directly from GitHub via `remote_theme` (no local build step needed to view
it — `docs/_config.yml`). The color scheme (`color_scheme: ge`) and fonts are
derived from the product's own design tokens
(`packages/design/src/tokens.css`) so the docs site and the console/presentation
apps read as one system:

- **Colors** — `docs/_sass/color_schemes/ge.scss` re-tints just-the-docs'
  stock purple theme to the Google Cloud Console-derived palette: primary
  `#1a73e8`, on-surface `#202124`, body text `#3c4043`, border `#dadce0`,
  sidebar `#f8fafd`. `docs/_sass/custom/setup.scss` re-tints the built-in
  blue/green swatches used by callouts to the same palette (`$blue-200:
  #1a73e8`, `$green-200: #1e8e3e`).
- **Fonts** — `docs/_sass/custom/custom.scss` sets `Space Grotesk` for
  headings, nav, and site chrome (`$ge-display-font`); body copy stays on the
  theme's system-ui reading face for long-form legibility. Code uses `Geist
  Mono` (`docs/_sass/custom/setup.scss`, `$mono-font-family`) — the same
  monospace family as the product UI.

Don't hand-roll colors or fonts in a page. If something needs a new color,
add it to `ge.scss` or `setup.scss`, not inline `style=`.

## Diagrams

### Where they live, how to regenerate

Diagram source is Mermaid, one `.mmd` file per diagram in
`docs/diagrams-src/`. Rendering goes through
[`beautiful-mermaid`](https://www.npmjs.com/package/beautiful-mermaid) via
`tools/gen-docs-diagrams.mjs`, themed by `tools/lib/docs-diagram-theme.mjs`
(`DIAGRAM_THEME` — white background, `#1a73e8` accent, `#5f6368` lines, Inter
font), so every diagram in the site shares one visual system instead of
hand-drawn ASCII art of varying quality. Output SVGs land in
`docs/assets/diagrams/*.svg`, one per source file, same basename.

```bash
node tools/gen-docs-diagrams.mjs          # regenerate all diagrams from source
node tools/gen-docs-diagrams.mjs --check  # fail if any .svg is stale vs its .mmd
```

`bun run docs:diagrams` / `bun run docs:diagrams:check` are the same two
commands via `package.json`. Always regenerate after touching a `.mmd` file —
the checked-in SVG is a build artifact, not hand-edited, and `--check` (run in
CI) fails the build on drift.

### The classDef/class semicolon bug — read this before writing a new diagram

**Never end a `classDef` or `class` line with a semicolon `;`.** The
renderer's `class` statement regex is `^class\s+([\w,-]+)\s+(\w+)$` — it
requires end-of-line immediately after the class name. A trailing `;` doesn't
error; it silently fails to match *and* creates a phantom node literally named
`class` floating in the rendered diagram. This has already happened once.

```
# correct — no semicolons
classDef cloudbuild fill:#e6f4ea,stroke:#34a853,color:#202124
class validate,preview cloudbuild

# wrong — silently broken, adds a phantom "class" node
classDef cloudbuild fill:#e6f4ea,stroke:#34a853,color:#202124;
class validate,preview cloudbuild;
```

### Shape vocabulary

Standard Mermaid flowchart node shapes, used consistently across
`docs/diagrams-src/*.mmd`:

| Shape | Syntax | Meaning |
|---|---|---|
| Rectangle | `A["rect"]` | default — a step, component, or artifact |
| Stadium | `A(["stadium"])` | start / end of a flow |
| Diamond | `A{"diamond"}` | decision / branch |
| Cylinder | `A[("cylinder")]` | data store |
| Circle | `A(("circle"))` | rare — a single focal point |
| Hexagon | `A{{"hexagon"}}` | rare — a gate/condition distinct from a decision |

Multi-line labels use a literal `\n` inside the quoted string (see
`write-guard-flow.mmd`'s `"before_tool_callback\nenforce_tool_contract"`), not
an actual newline.

Use `flowchart TD` (top-down) or `flowchart LR` (left-right) for anything that
is a pipeline, decision tree, or component graph — the large majority of
diagrams here. Reach for `sequenceDiagram` only when the point is
*message/call order between named actors over time* (request/response,
polling loops) rather than structure — this repo doesn't currently have one,
but it's the right tool if a future diagram needs to show, e.g., the
gateway/queue/worker request lifecycle turn by turn.

For a flowchart with distinct stages or planes, group with `subgraph` and set
`direction LR` (or `TD`) inside it independently of the outer flowchart
direction — see `factory-line.mmd`'s three subgraphs (`Author and Build`,
`Validate and Refine`, `Release`), each `direction LR` inside an outer
`flowchart TD`. This is also the main lever for fixing an SVG that renders too
tall or too wide: switch the outer direction, or add/adjust a subgraph's own
`direction`.

### Brand color convention

Use `classDef` sparingly, to mark one or two meaningful categories of node —
not every node:

| Meaning | classDef |
|---|---|
| Primary / local emphasis, data | `fill:#e8f0fe,stroke:#1a73e8,color:#202124` |
| Cloud / release / passing | `fill:#e6f4ea,stroke:#34a853,color:#202124` |
| Blocked / error | `fill:#fce8e6,stroke:#c5221f,color:#202124` |

Example (`docs/diagrams-src/write-guard-flow.mmd`):

```
classDef blocked fill:#fce8e6,stroke:#c5221f,color:#202124
classDef pass fill:#e6f4ea,stroke:#34a853,color:#202124
class D blocked
class C,E pass
```

### Embedding a diagram in a page

```html
<p align="center">
  <img src="assets/diagrams/system-map.svg" alt="describe the flow in words" width="800">
</p>
```

- Path is relative to the page (`assets/diagrams/...` at the top level of
  `docs/`, `../assets/diagrams/...` from one directory down — e.g.
  `docs/concepts/*.md`).
- Always set `width` on the `<img>`, sized to the diagram's actual aspect
  ratio (700–800 is typical for a wide flowchart). **Never use `style="..."`**
  — GitHub's markdown sanitizer strips inline `style` attributes, and several
  docs pages are read directly on GitHub (not just through the styled Jekyll
  site), so a `style`-based width silently reverts to the image's native
  (often huge) pixel size there. `width` as a plain HTML attribute survives
  both renderers.
- Always write a real `alt` describing the flow, not the filename.

## Callouts

Five types, configured in `docs/_config.yml` under `callouts:`, colors
resolved in `docs/_sass/custom/setup.scss` / just-the-docs' callout module:

| Type | Class | Color | Use for |
|---|---|---|---|
| Note | `{: .note }` | blue | Supplementary context, not required to proceed |
| Warning | `{: .warning }` | yellow | Something that will cause a subtle problem if missed |
| Important | `{: .important }` | red | A hard requirement or destructive/irreversible action |
| Tip | `{: .tip }` | green | An optional shortcut or better way to do something |
| Status | `{: .status }` | purple | Point-in-time state of a rollout/migration (e.g. "cutover stage 2 of 4") |

Syntax: a blockquote, then the class line **immediately after with no blank
line in between**:

```markdown
> `private-ranges-only` keeps public egress (Vertex, GCS, Firestore) on the
> default path and only sends RFC-1918 + Google internal through the VPC.
{: .note }
```

A callout may also live *inside* a list item — indent the blockquote and the
class line to the item's continuation depth (see the step-level gotchas in
`docs/cookbooks/run-evals.md`). The website's sync converts indented callouts
to asides too, keeping them attached to their step.

The callout box auto-renders its own label (`NOTE`, `WARNING`, etc., styled in
the site's display font). Don't also hand-write a redundant lead-in like
`**Note:**` inside the blockquote text — remove it; the box already says it.

## Cookbook scope strips

Every cookbook opens with a one-line scope strip directly under the H1:

```markdown
**Scope:** local-only — no cloud project or credentials required.
```

The shape is `**Scope:** <label> — <description>` (an em dash separates the
two). It answers the reader's first question — "will this touch my cloud
project?" — before anything else on the page. Labels in use: `local-only`,
`cloud`, `local or remote`, `local by default`, `repo change`. On GitHub and
the Jekyll site it renders as plain bold text; the website's sync
(`apps/docs/scripts/lib/enrich.mjs`) upgrades it to a Starlight badge —
green for `local-only`, orange for `cloud`, neutral otherwise. The same sync
wraps a cookbook's `## Steps` ordered list in Starlight's `<Steps>` component,
so keep Steps sections as a single numbered list where possible, and turns a
section index's link-plus-description tables (like the cookbooks' recipe
table) into a card grid — tables whose first content column is prose are
left as tables.

## In-page table of contents

Add a TOC to a page once it has **7 or more `##` headings** — shorter pages
don't need one. Convention (see `docs/reference/cli.md`):

```markdown
## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}
```

`docs/_config.yml` sets `kramdown: toc_levels: 2..3`, so the generated TOC
lists only `##`/`###` headings — the page's own `#` H1 title is excluded from
listing itself as the first entry.

## Scope discipline for diagrams

Add a diagram only where a flow, architecture, or decision is currently
prose-only *and* a picture would genuinely resolve it faster than reading —
not for every table, command list, or file layout, which read fine as text.
Before adding a new one, check the existing set (19 diagrams as of this
writing, see filenames in `docs/diagrams-src/`) so a new diagram doesn't
duplicate an existing concept from a slightly different angle — extend or
reference the existing one instead where possible.
