// THE canonical source of the brand chrome palette ("Modernist Functionalism":
// a Braun/Dieter-Rams-inspired instrument-panel chrome — warm neutral paper,
// one reserved navy signal color, hairlines over shadows — all other color
// budget lives in the status ramp in tokens.css, not here).
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
//
// 2026-07: rebased onto the "Modernist Functionalism" design system (Braun
// blue #00408b, warm off-white paper) supplied for the docs site. Two of the
// new spec's tokens were deliberately NOT adopted verbatim — see the
// `secondary`/`secondaryInk` and `tertiary`/`tertiaryContainer` entries below
// for why.

export const PALETTE = {
  // --color-primary — the one reserved interactive signal: links, focus,
  // primary actions, active nav, and (via the status ramp) "running". Braun
  // Blue — a deep, saturated navy distinct from any stock Material/Tailwind
  // blue on purpose.
  primary: "#00408b",

  // --color-primary-container — lighter hover/active variant of primary.
  primaryContainer: "#0057b8",

  // --color-background — page background ("paper"): warm off-white, evoking
  // matte instrument-panel plastics rather than a cool corporate neutral.
  background: "#fcf9f8",

  // --color-surface / --color-surface-container-lowest / --color-surface-bright
  // — flat surface (all three tokens share this value in tokens.css).
  surface: "#fcf9f8",

  // --color-surface-container — neutral warm card/panel surface.
  surfaceContainer: "#f0eded",

  // --color-surface-container-low — slightly lighter muted surface.
  surfaceContainerLow: "#f6f3f2",

  // --color-surface-container-high — more saturated muted surface.
  surfaceContainerHigh: "#eae7e7",

  // --color-on-surface — primary ink: a warm near-black, not pure black, not
  // Material grey-black.
  onSurface: "#1b1c1c",

  // --color-secondary — secondary ink/icon color ("graphite"). Deliberately
  // KEPT at its pre-2026-07 value rather than the new spec's reserved
  // "stop/warning" red: this token is consumed as plain muted body/caption
  // text in ~530 sites across apps/console and apps/presentation (`text-
  // secondary`), so retinting it red would turn routine secondary copy into
  // warning-colored text app-wide. The status ramp's `failed` hue already
  // covers the "stop/critical" role the new spec's secondary was for.
  secondary: "#565e6c",

  // --color-secondary-container — pale accent chip/badge background, paired
  // with primary. Kept for the same reason as `secondary` above (the new
  // spec's secondary-container is a solid saturated red, meant to pair with
  // its red secondary — not a fit for this token's pale-accent-chip role).
  secondaryContainer: "#e6ebff",

  // --color-tertiary — the "passed / certified" green. Doubles as the status
  // ramp's `passed` base (see tokens.css) so there is one green, not two.
  // Deliberately KEPT rather than the new spec's tertiary (a brown/rust —
  // the spec's own mockups don't use it for status either, reaching for raw
  // Tailwind green/emerald utility classes instead of a token for "passed").
  tertiary: "#16874a",

  // --color-tertiary-container — pale green chip/badge background.
  tertiaryContainer: "#e1f3e7",

  // --color-outline-variant — hairline border/divider color ("line").
  outlineVariant: "#c2c6d4",

  // Not a --color-* custom property: a literal "secondary ink" text color
  // used directly in tokens.css's .use-case-detail contrast guardrails
  // (kept AA-contrast on white without going all the way to --color-secondary)
  // and reused verbatim in ge.scss for $body-text-color / $nav-child-link-color
  // / $search-result-preview-color. Kept alongside `secondary` above.
  secondaryInk: "#383e47",

  // Derived swatches: NOT literal --color-* custom properties in tokens.css.
  // docs/_sass/custom/setup.scss re-tints just-the-docs' built-in blue/green
  // swatch ramps to this palette; these are hand-picked shades along the
  // primary/tertiary hue that only exist in that file. primaryContainer above
  // doubles as $blue-000; the remaining rungs are listed here so the whole
  // ramp traces to one source instead of living only in Sass.

  // $blue-100 — mid-light blue swatch, one step darker than primaryContainer.
  primaryContainerDark: "#004493",

  // $blue-200 — matches --color-primary exactly (kept distinct for the ramp).
  primarySwatch: "#00408b",

  // $blue-300 — darkest blue swatch, used for hover/active link states.
  primaryDark: "#001a41",

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
