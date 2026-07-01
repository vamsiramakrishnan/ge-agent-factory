// Shared visual theme for docs diagrams (tools/gen-docs-diagrams.mjs), derived
// from the same Google Cloud Console palette the console/presentation apps use
// (packages/design/src/tokens.css) so the docs site and the product UI read as
// one system instead of a generic canned theme.
export const DIAGRAM_THEME = {
  bg: "#ffffff",
  fg: "#202124", // --color-on-surface
  accent: "#1a73e8", // --color-primary
  line: "#5f6368", // --color-secondary
  muted: "#80868b",
  surface: "#eef3f9", // --color-surface-container
  border: "#dadce0", // --color-outline-variant
  font: "Inter",
};

// Secondary accent (--color-tertiary) for classDef use in flowcharts that
// need to distinguish a second category of node (e.g. release/cloud stages).
export const DIAGRAM_TERTIARY = "#34a853";
