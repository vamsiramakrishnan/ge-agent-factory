// THE canonical source of the brand chrome palette ("Proof Instrument": an
// achromatic instrument-panel chrome with one reserved signal color — all
// other color budget lives in the status ramp in tokens.css, not here).
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
  // primary actions, active nav, and (via the status ramp) "running". A
  // cobalt distinct from any stock Material/Tailwind blue on purpose.
  primary: "#2953ff",

  // --color-primary-container — lighter hover/active variant of primary.
  primaryContainer: "#5578ff",

  // --color-background — page background ("paper"): cool neutral, not warm
  // cream, not pure white.
  background: "#f3f4f7",

  // --color-surface / --color-surface-container-lowest / --color-surface-bright
  // — flat white surface (all three tokens share this value in tokens.css).
  surface: "#ffffff",

  // --color-surface-container — neutral (not blue-tinted) card/panel surface.
  surfaceContainer: "#eceef2",

  // --color-surface-container-low — slightly lighter muted surface.
  surfaceContainerLow: "#f6f7f9",

  // --color-surface-container-high — more saturated muted surface.
  surfaceContainerHigh: "#e4e7ec",

  // --color-on-surface — primary ink: a cool near-black, not pure black, not
  // Material grey-black.
  onSurface: "#14171c",

  // --color-secondary — secondary ink/icon color ("graphite").
  secondary: "#565e6c",

  // --color-secondary-container — pale accent chip/badge background, paired
  // with the new primary.
  secondaryContainer: "#e6ebff",

  // --color-tertiary — the "passed / certified" green. Doubles as the status
  // ramp's `passed` base (see tokens.css) so there is one green, not two.
  tertiary: "#16874a",

  // --color-tertiary-container — pale green chip/badge background.
  tertiaryContainer: "#e1f3e7",

  // --color-outline-variant — hairline border/divider color ("line").
  outlineVariant: "#dfe2e8",

  // Not a --color-* custom property: a literal "secondary ink" text color
  // used directly in tokens.css's .use-case-detail contrast guardrails
  // (kept AA-contrast on white without going all the way to --color-secondary)
  // and reused verbatim in ge.scss for $body-text-color / $nav-child-link-color
  // / $search-result-preview-color.
  secondaryInk: "#383e47",

  // Derived swatches: NOT literal --color-* custom properties in tokens.css.
  // docs/_sass/custom/setup.scss re-tints just-the-docs' built-in blue/green
  // swatch ramps to this palette; these are hand-picked shades along the
  // primary/tertiary hue that only exist in that file. primaryContainer above
  // doubles as $blue-000; the remaining rungs are listed here so the whole
  // ramp traces to one source instead of living only in Sass.

  // $blue-100 — mid-light blue swatch, one step darker than primaryContainer.
  primaryContainerDark: "#1f44d1",

  // $blue-200 — matches --color-primary exactly (kept distinct for the ramp).
  primarySwatch: "#2953ff",

  // $blue-300 — darkest blue swatch, used for hover/active link states.
  primaryDark: "#17339e",

  // $green-000 — brightest green swatch in the tertiary ramp.
  tertiaryContainerBright: "#8fe0ac",

  // $green-100 — mid-light green swatch.
  tertiaryContainerDark: "#4bbf7a",

  // --color-tertiary reused in the ramp (kept distinct for ramp semantics).
  tertiarySwatch: "#16874a",

  // $green-200 — the ramp's callout green: deliberately darker than
  // --color-tertiary (shipped this way since the first docs-theme commit;
  // AA-stronger on white for the tip-callout accent). Also the status ramp's
  // `passed` ink (text-on-tint) shade — see tokens.css.
  tertiarySwatchDark: "#0d6d3a",

  // $green-300 — darkest green swatch.
  tertiaryDark: "#0a5730",
};
