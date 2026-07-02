// THE canonical source of the Google Cloud Console-derived brand palette.
// Every other copy is generated or imports this file directly:
//   - packages/design/src/tokens.css   (--color-* @theme block — GENERATED
//     region, run `bun run docs:tokens` after editing values here)
//   - docs/_sass/color_schemes/ge.scss (Jekyll Sass variables — GENERATED)
//   - docs/_sass/custom/setup.scss     (just-the-docs swatch ramp — GENERATED)
//   - tools/lib/docs-diagram-theme.mjs (Mermaid diagram theme, imports PALETTE)
// The name↔value pairing lives in packages/design/scripts/gen-tokens.mjs's
// TOKEN_TABLE; tools/check-design-tokens.mjs byte-compares the generated
// regions against this file and fails the gate on drift.
//
// Plain ESM, zero dependencies, so it can be imported from both Node tooling
// and, if ever needed, bundled by Vite.

export const PALETTE = {
  // --color-primary — main brand blue, links/buttons/active states.
  primary: "#1a73e8",

  // --color-primary-container — lighter/secondary blue accent (gradients,
  // hover states). Also reused verbatim as docs/_sass/custom/setup.scss's
  // $blue-000 (brightest swatch in the just-the-docs blue ramp).
  primaryContainer: "#4285f4",

  // --color-background — page background.
  background: "#f8fafd",

  // --color-surface / --color-surface-container-lowest / --color-surface-bright
  // — flat white surface (all three tokens share this value in tokens.css).
  surface: "#ffffff",

  // --color-surface-container — muted blue-tinted card/panel surface.
  surfaceContainer: "#eef3f9",

  // --color-surface-container-low — slightly lighter muted surface.
  surfaceContainerLow: "#f5f8fc",

  // --color-surface-container-high — more saturated muted surface.
  surfaceContainerHigh: "#e8eef7",

  // --color-on-surface — primary ink/text color on light surfaces.
  onSurface: "#202124",

  // --color-secondary — secondary ink/icon color (Google grey).
  secondary: "#5f6368",

  // --color-secondary-container — pale blue chip/badge background.
  secondaryContainer: "#e8f0fe",

  // --color-tertiary — secondary brand accent, Google green.
  tertiary: "#34a853",

  // --color-tertiary-container — pale green chip/badge background.
  tertiaryContainer: "#e6f4ea",

  // --color-outline-variant — hairline border/divider color.
  outlineVariant: "#dadce0",

  // Not a --color-* custom property: a literal "secondary ink" text color
  // used directly in tokens.css's .use-case-detail contrast guardrails
  // (kept AA-contrast on white without going all the way to --color-secondary)
  // and reused verbatim in ge.scss for $body-text-color / $nav-child-link-color
  // / $search-result-preview-color.
  secondaryInk: "#3c4043",

  // Derived swatches: NOT literal --color-* custom properties in tokens.css.
  // docs/_sass/custom/setup.scss re-tints just-the-docs' built-in blue/green
  // swatch ramps to this palette; these are hand-picked shades along the
  // primary/tertiary hue that only exist in that file. primaryContainer above
  // doubles as $blue-000; the remaining rungs are listed here so the whole
  // ramp traces to one source instead of living only in Sass.

  // $blue-100 — mid-light blue swatch, one step darker than primaryContainer.
  primaryContainerDark: "#2f6fdb",

  // $blue-200 — matches --color-primary exactly (kept distinct for the ramp).
  primarySwatch: "#1a73e8",

  // $blue-300 — darkest blue swatch, used for hover/active link states.
  primaryDark: "#1558b0",

  // $green-000 — brightest green swatch in the tertiary ramp.
  tertiaryContainerBright: "#7cd6a3",

  // $green-100 — mid-light green swatch.
  tertiaryContainerDark: "#46b579",

  // --color-tertiary reused in the ramp (kept distinct for ramp semantics).
  tertiarySwatch: "#34a853",

  // $green-200 — the ramp's callout green: deliberately darker than
  // --color-tertiary (shipped this way since the first docs-theme commit;
  // AA-stronger on white for the tip-callout accent).
  tertiarySwatchDark: "#1e8e3e",

  // $green-300 — darkest green swatch.
  tertiaryDark: "#146c2e",
};
