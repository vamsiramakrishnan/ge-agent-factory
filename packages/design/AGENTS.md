# @ge/design

Single source design system for every GE front-end (`apps/console`, `apps/presentation`).

- `src/design-tokens.ts` — style-map tokens (LAYER_STYLES, TRIGGER_STYLES, HITL_STYLES,
  CATEGORY_STYLES, PIPELINE_STYLES, DOMAIN_COLORS, LANE_STYLES, NODE_STYLES).
- `src/tokens.css` — the Tailwind v4 entry: `@import "tailwindcss"` + `@theme` + base/component
  layer (`.glass-panel`, `.glass-card`).

Boundary: presentation tokens only — no React, no fs/process, no app logic. Both apps import from
here; do not re-add a local copy (the two were byte-identical and were deduped into this package).
