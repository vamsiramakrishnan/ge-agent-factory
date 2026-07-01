// Library logic for tools/check-design-tokens.mjs: parses the two
// hand-maintained copies of the brand palette (packages/design/src/tokens.css
// and docs/_sass/color_schemes/ge.scss) and cross-checks their hex values
// against packages/design/src/palette.mjs, the single JS source of truth
// added to stop the three from silently drifting.
//
// This is intentionally a handful of regexes, not a real CSS/Sass parser —
// both files are small, hand-written, and only ever contain simple
// `--name: #hex;` / `$name: #hex;` declarations.
import { readFileSync } from "node:fs";

// Matches `--color-foo: #rrggbb;` (and similar --custom-property: #hex;
// declarations) inside a CSS file. Ignores non-color custom properties
// (fonts, etc.) since only #hex values are relevant to the palette.
const CSS_CUSTOM_PROPERTY_RE = /(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;

// Matches `$name: #hex;` Sass variable assignments. Ignores Sass function
// calls like `darken($sidebar-color, 3%)` since those aren't literal hex
// values to trace.
const SASS_VARIABLE_RE = /^\s*(\$[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/gm;

export function parseCssCustomProperties(cssText) {
  const values = {};
  for (const match of cssText.matchAll(CSS_CUSTOM_PROPERTY_RE)) {
    const [, name, hex] = match;
    values[name] = hex.toLowerCase();
  }
  return values;
}

export function parseSassVariables(scssText) {
  const values = {};
  for (const match of scssText.matchAll(SASS_VARIABLE_RE)) {
    const [, name, hex] = match;
    values[name] = hex.toLowerCase();
  }
  return values;
}

// The set of hex values that packages/design/src/palette.mjs actually
// exports (case-insensitive), used as the ground truth every CSS custom
// property / Sass variable must trace back to.
export function paletteHexValues(palette) {
  return new Set(Object.values(palette).map((hex) => hex.toLowerCase()));
}

// Cross-check a { name: hex } map (parsed from tokens.css or ge.scss)
// against the palette's hex values. Returns one finding per name whose hex
// value doesn't appear anywhere in the palette.
export function findUntracedValues(sourceLabel, values, paletteHexes) {
  const findings = [];
  for (const [name, hex] of Object.entries(values)) {
    if (!paletteHexes.has(hex)) {
      findings.push({ source: sourceLabel, name, hex });
    }
  }
  return findings;
}

export function checkDesignTokens({ tokensCssText, sassText, palette }) {
  const paletteHexes = paletteHexValues(palette);
  const cssValues = parseCssCustomProperties(tokensCssText);
  const sassValues = parseSassVariables(sassText);

  const findings = [
    ...findUntracedValues("packages/design/src/tokens.css", cssValues, paletteHexes),
    ...findUntracedValues("docs/_sass/color_schemes/ge.scss", sassValues, paletteHexes),
  ];

  return {
    ok: findings.length === 0,
    findings,
    cssCount: Object.keys(cssValues).length,
    sassCount: Object.keys(sassValues).length,
  };
}

export function formatDesignTokensReport(result) {
  if (result.ok) {
    return `Design token drift check passed: ${result.cssCount} tokens.css custom properties and ${result.sassCount} ge.scss variables all trace to packages/design/src/palette.mjs.`;
  }
  const lines = [
    `Design token drift check failed: ${result.findings.length} value${result.findings.length === 1 ? "" : "s"} in tokens.css / ge.scss don't trace back to packages/design/src/palette.mjs.`,
    "",
  ];
  for (const finding of result.findings) {
    lines.push(`- ${finding.source}: ${finding.name} = ${finding.hex}`);
  }
  lines.push("");
  lines.push("Either add/update the matching entry in packages/design/src/palette.mjs, or fix the stray hex value — the three copies of this palette must agree.");
  return lines.join("\n");
}

export function readFileUtf8(path) {
  return readFileSync(path, "utf8");
}
