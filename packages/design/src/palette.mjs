// THE canonical source of the brand chrome palette ("Punktraster": a
// Braun-era instrument chassis after Dieter Rams — warm achromatic greys,
// off-white panels, one reserved signal color: the vermilion power dot.
// All other color budget lives in the status ramp in tokens.css, not here).
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
  // --color-primary — the one reserved interactive signal: links, focus,
  // primary actions, active nav, and (via the status ramp) "running". The
  // Braun power-dot vermilion — an orange-red no stock Material/Tailwind
  // ramp carries, and 4.9:1 on white so it survives as link text.
  primary: "#cc3d0d",

  // --color-primary-container — lighter hover/active variant of primary.
  primaryContainer: "#e05a26",

  // --color-background — page background: the Braun chassis grey. A true
  // near-achromatic warm grey (chroma ≈ 0), not cream, not cool slate.
  background: "#e9e9e6",

  // --color-surface / --color-surface-container-lowest / --color-surface-bright
  // — panel off-white (all three tokens share this value in tokens.css).
  // Braun panels are off-white lacquer, never bare #fff.
  surface: "#f7f7f5",

  // --color-surface-container — recessed chassis-grey card/panel surface.
  surfaceContainer: "#e3e3df",

  // --color-surface-container-low — slightly lighter muted surface.
  surfaceContainerLow: "#efefec",

  // --color-surface-container-high — deeper chassis grey.
  surfaceContainerHigh: "#dbdbd6",

  // --color-on-surface — primary ink: the warm near-black of a Braun
  // control legend, not pure black, not Material grey-black.
  onSurface: "#1a1a18",

  // --color-secondary — secondary ink/icon color ("graphite").
  secondary: "#55554f",

  // --color-secondary-container — pale signal-tint chip/badge background,
  // paired with the vermilion primary.
  secondaryContainer: "#f6ddd1",

  // --color-tertiary — the "passed / certified" green: the muted indicator
  // green of a Braun function key. Doubles as the status ramp's `passed`
  // base (see tokens.css) so there is one green, not two.
  tertiary: "#2e7a47",

  // --color-tertiary-container — pale green chip/badge background.
  tertiaryContainer: "#dfeadf",

  // --color-outline-variant — hairline border/divider color ("line").
  outlineVariant: "#d4d4cf",

  // Not a --color-* custom property: a literal "secondary ink" text color
  // used directly in tokens.css's .use-case-detail contrast guardrails
  // (kept AA-contrast on the off-white surface without going all the way to
  // --color-secondary) and reused verbatim in ge.scss for $body-text-color
  // / $nav-child-link-color / $search-result-preview-color.
  secondaryInk: "#3a3a35",

  // Derived swatches: NOT literal --color-* custom properties in tokens.css.
  // docs/_sass/custom/setup.scss re-tints just-the-docs' built-in blue/green
  // swatch ramps to this palette; these are hand-picked shades along the
  // primary/tertiary hue that only exist in that file. primaryContainer above
  // doubles as $blue-000; the remaining rungs are listed here so the whole
  // ramp traces to one source instead of living only in Sass.

  // $blue-100 — mid signal swatch, one step darker than primaryContainer.
  primaryContainerDark: "#a83208",

  // $blue-200 — matches --color-primary exactly (kept distinct for the ramp).
  primarySwatch: "#cc3d0d",

  // $blue-300 — darkest signal swatch, used for hover/active link states.
  primaryDark: "#7e2506",

  // $green-000 — brightest green swatch in the tertiary ramp.
  tertiaryContainerBright: "#a5cdaf",

  // $green-100 — mid-light green swatch.
  tertiaryContainerDark: "#5da273",

  // --color-tertiary reused in the ramp (kept distinct for ramp semantics).
  tertiarySwatch: "#2e7a47",

  // $green-200 — the ramp's callout green: deliberately darker than
  // --color-tertiary (shipped this way since the first docs-theme commit;
  // AA-stronger on white for the tip-callout accent). Also the status ramp's
  // `passed` ink (text-on-tint) shade — see tokens.css.
  tertiarySwatchDark: "#266b3d",

  // $green-300 — darkest green swatch.
  tertiaryDark: "#1d5330",
};
