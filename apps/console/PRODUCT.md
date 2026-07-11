# Product

Strategic design context for the operator console (`apps/console`,
Vite + React). Written by `/impeccable init`; visual specifics live in the
canonical design sources, not here — see "Design sources" at the bottom.

## Register

product

The console is an operator surface: users are mid-task (running pipelines,
watching fleets, triaging repairs) and design serves the work. Familiarity,
density, and state legibility beat spectacle everywhere.

## Users

Platform / AI engineers operating the GE Agent Factory — usually with a
terminal open beside the browser. They run the spec→deploy pipeline, watch
runs and repair queues, interview stakeholders into specs, and verify live
agents. Every console action mirrors a `ge` CLI command; the console is the
instrument panel over the same machinery.

## Product Purpose

The factory compiles enterprise intent into governed agent contracts, eval
suites, and proof packs. The console is where an operator sees the machine's
state at a glance and drives it with confidence. Success is an operator
trusting a status color enough to act on it without opening a log.

## Brand Personality

Precise, calm, engineered — "less, but better." The design identity is
Modernist Functionalism (`Modernist Functionalism Design System.zip` and
`packages/design/src/palette.mjs`): a Dieter Rams / Braun instrument chassis.
Warm achromatic greys and off-white panels form the housing; Braun blue means
interactive, active, or running; signal red is reserved for stop/error states.
Dot-matrix grille texture marks apparatus or purposeful empty zones. Hierarchy
comes from Hanken Grotesk in weight and scale; JetBrains Mono is reserved for
commands, ids, timestamps, logs, and numeric readouts.

## Anti-references

- Stock Material/Google-console styling and Tailwind default hues — every
  color must trace to `palette.mjs` or `status-ramp.mjs`.
- SaaS dashboard grammar: gradient washes, glassy cards, glowing metrics,
  decorative motion.
- Side-stripe accents, badge walls, and cool-slate "AI tool" darkness. State
  is shown by indicator dots and labels, like lights on a chassis.

## Design Principles

1. **The lit dot means on.** The single vermilion signal carries interaction
   and liveness; if something is orange-red, you can click it or it is
   working right now.
2. **One system, three surfaces.** Console, CLI, and docs share one palette
   and one status vocabulary from TTY to UI.
3. **The housing recedes, the state reads.** Chassis greys and hairline
   dividers exist so status hues and data are the only loud things.
4. **Texture is functional.** The dot-matrix grille marks apparatus (shell
   chrome, idle/empty zones), never sits behind body text.
5. **Weniger, aber besser.** Prefer removing an element to styling it; one
   family, one radius language, motion only where it encodes state.

## Accessibility & Inclusion

WCAG 2.1 AA. The vermilion signal is 4.9:1 on white and every status hue
carries a darker `-ink` shade for text-on-tint. Status is never color-alone:
dots pair with labels (StatusPill) and icons. All motion respects
`prefers-reduced-motion`; the only looping animations encode live work.

## Design sources (read before styling anything)

- `packages/design/src/palette.mjs` — THE canonical chrome palette.
- `packages/design/src/status-ramp.mjs` — the status→color vocabulary.
- `packages/design/src/tokens.css` — fonts, radius scale, grille utilities.
- `packages/ui/` — the shared component recipes (Button, StatusPill, …).
