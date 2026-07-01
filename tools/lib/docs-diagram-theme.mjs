// Shared visual theme for docs diagrams (tools/gen-docs-diagrams.mjs), derived
// from the same Google Cloud Console palette the console/presentation apps use
// (packages/design/src/tokens.css) so the docs site and the product UI read as
// one system instead of a generic canned theme.
//
// Values come from packages/design/src/palette.mjs (the single JS source of
// truth for the brand palette) rather than hardcoded hex literals, so this
// file can't silently drift from tokens.css / ge.scss — see
// tools/check-design-tokens.mjs, which cross-checks all three.
import { PALETTE } from "../../packages/design/src/palette.mjs";

export const DIAGRAM_THEME = {
  bg: PALETTE.surface,
  fg: PALETTE.onSurface, // --color-on-surface
  accent: PALETTE.primary, // --color-primary
  line: PALETTE.secondary, // --color-secondary
  muted: "#80868b",
  surface: PALETTE.surfaceContainer, // --color-surface-container
  border: PALETTE.outlineVariant, // --color-outline-variant
  font: "Inter",
};

// Secondary accent (--color-tertiary) for classDef use in flowcharts that
// need to distinguish a second category of node (e.g. release/cloud stages).
export const DIAGRAM_TERTIARY = PALETTE.tertiary;
