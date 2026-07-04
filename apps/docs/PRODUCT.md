# Product

Strategic design context for the docs website (`apps/docs`, Astro/Starlight).
Written by `/impeccable init`; inferred from the repo's own documentation
(README, AGENTS.md, `docs/DESIGN.md`, `packages/design/src/palette.mjs`).
Visual specifics live in the canonical design sources, not here — see
"Design sources" at the bottom.

## Register

product

The primary surface is documentation: readers are mid-task (installing,
operating, or repairing the factory) and design serves the reading. The
landing page is the one deliberate brand moment; interior pages stay quiet.

## Users

Platform / AI engineers evaluating or operating the GE Agent Factory, and —
first-class here — their coding agents (Claude Code, Gemini CLI, Codex, MCP
clients), which consume the same site via `/llms.txt` and `/llms-full.txt`.
Human readers arrive with a job: bootstrap the repo, capture a workflow into
a contract, prove an agent against simulations, or triage a failing stage.
They read reference tables, copy shell commands, and follow multi-step
cookbooks — often while a terminal is open in the other half of the screen.

## Product Purpose

The factory compiles enterprise intent into governed agent contracts,
source-system twins, eval suites, ADK workspaces, and proof packs. The docs
site is where that promise has to feel credible: it must read as the product
does — precise, evidence-driven, engineered. Success is a reader reaching
their first proof (`ge devex smoke`) without stalling, and trusting the
platform because the documentation itself feels certified.

## Brand Personality

Precise, instrumented, calm — "less, but better." The design identity is
"Punktraster" (`packages/design/src/palette.mjs`): a Dieter Rams / Braun
instrument chassis — warm achromatic greys and off-white panels, with one
reserved signal color. Vermilion `#cc3d0d` — the lit power dot — means
"live/interactive", one green means "passed", the dot-matrix grille texture
marks apparatus zones, and all other color budget is semantic status, not
decoration. Tone of voice in copy is expert and direct, never salesy.

## Anti-references

- Stock Material/Google-console blue (`#1a73e8`) and cool-slate "AI tool"
  chrome — the palettes this system deliberately moved away from.
- SaaS landing-page grammar: gradient text, gradient glows, badge walls,
  hero-metric strips, cream/parchment backgrounds.
- Ad-hoc per-component colors (stock Tailwind rose/emerald/amber). Every hue
  must trace to `palette.mjs` or `status-ramp.mjs` — one signal, one green,
  one meaning, from TTY to UI to docs.

## Design Principles

1. **One system, three surfaces.** Docs, console, and CLI share one palette
   and one status vocabulary; the docs site must never fork its own.
2. **The tool disappears into the task.** Interior pages optimize for long
   reference tables, code blocks, and scanability — density is a feature.
3. **Color is semantics.** Accent marks interactive/live; status hues mark
   state; nothing is colored for decoration.
4. **Practice what you preach.** A contract-and-proof product earns trust
   through disciplined, certified-feeling presentation.
5. **Agents are readers too.** Structure (headings, tables, link text) must
   survive being flattened to plain markdown for `/llms-full.txt`.

## Accessibility & Inclusion

WCAG 2.1 AA. Body text ≥ 4.5:1 in both themes (light body ink is
`secondaryInk #3a3a35` on the off-white surface, chosen for exactly this).
Dark mode is a
first-class theme, not an inversion. Respect `prefers-reduced-motion`; the
site has no orchestrated motion by design. Diagrams are authored on white
and framed in dark mode rather than recolored.

## Design sources (read before styling anything)

- `packages/design/src/palette.mjs` — THE canonical chrome palette.
- `packages/design/src/status-ramp.mjs` — the status→color vocabulary.
- `docs/DESIGN.md` — authoring conventions (diagrams, callouts, links).
- `apps/docs/src/styles/custom.css` — the Starlight theme layer; derives
  everything from the two files above and must not invent values.
