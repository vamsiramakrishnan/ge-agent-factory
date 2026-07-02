#!/usr/bin/env node
// Generate the marker-delimited brand-palette regions of the three
// stylesheets from packages/design/src/palette.mjs.
//
// CANONICALITY INVERSION (2026-07, WS5 track C): palette.mjs is now the
// canonical source of the palette. Its header (and the old
// tools/check-design-tokens.mjs) said the opposite — that tokens.css was
// canonical and palette.mjs had to trace back to it. That arrow is reversed
// here on purpose: palette.mjs is the only copy of the palette that is
// importable everywhere (Node tooling, this generator, and — via
// tools/lib/docs-diagram-theme.mjs — the Mermaid diagram theme), so it is
// the copy the others are generated FROM. Change a color in palette.mjs,
// run `bun run docs:tokens`, and commit the regenerated regions of:
//   - packages/design/src/tokens.css     (the --color-* @theme block ONLY;
//     the Tailwind theme fonts and component classes around it stay
//     hand-written)
//   - docs/_sass/color_schemes/ge.scss   (the full variable block)
//   - docs/_sass/custom/setup.scss       (the $blue-*/$green-* swatch ramp)
//
// The name→token mapping lives here as ONE explicit table (TOKEN_TABLE)
// pinning name↔value pairs exactly — unlike the retired value-set regex
// checker, which only proved every hex appeared *somewhere* in the palette
// and could not catch a wrong name→value pairing. A row is either a
// { name, key } pair (value comes from PALETTE), a { name, raw } literal for
// the few non-palette lines a region carries, or { blank: true } for a
// preserved blank line.
//
//   node packages/design/scripts/gen-tokens.mjs           # regenerate
//   node packages/design/scripts/gen-tokens.mjs --check   # exit 1 on drift
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTE } from "../src/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

// THE explicit name→token table. Every generated line is one row: the output
// variable name, the palette key it is pinned to (or a `raw` literal for the
// few non-palette lines a region carries), and an optional trailing comment
// rendered verbatim. Row order is emission order.
//
// KNOWN DISCREPANCY, deliberately preserved: setup.scss shipped
// `$green-200: #1e8e3e` (a darker Google green than --color-tertiary) from
// the first commit of the docs theme, while palette.mjs's `tertiarySwatch`
// comment claims $green-200 "matches --color-tertiary exactly" (#34a853) —
// a claim that was never true of the shipped file. Emitted values are frozen
// (generating must not change any color), and palette.mjs is outside this
// track's write-set, so $green-200 is pinned as a raw literal below until
// palette.mjs grows a real entry for it (or the ramp is deliberately
// re-tinted). Fix by adding e.g. `tertiarySwatchDark: "#1e8e3e"` to PALETTE
// and swapping the raw pin for that key.
export const TOKEN_TABLE = [
  // ── packages/design/src/tokens.css — the --color-* @theme block ──
  { file: "tokens.css", name: "--color-primary", key: "primary" },
  { file: "tokens.css", name: "--color-primary-container", key: "primaryContainer" },
  { file: "tokens.css", name: "--color-background", key: "background" },
  { file: "tokens.css", name: "--color-surface", key: "surface" },
  { file: "tokens.css", name: "--color-surface-container", key: "surfaceContainer" },
  { file: "tokens.css", name: "--color-surface-container-low", key: "surfaceContainerLow" },
  { file: "tokens.css", name: "--color-surface-container-high", key: "surfaceContainerHigh" },
  { file: "tokens.css", name: "--color-surface-container-lowest", key: "surface" },
  { file: "tokens.css", name: "--color-surface-bright", key: "surface" },
  { file: "tokens.css", name: "--color-surface-tint", key: "primary" },
  { file: "tokens.css", name: "--color-on-surface", key: "onSurface" },
  { file: "tokens.css", name: "--color-secondary", key: "secondary" },
  { file: "tokens.css", name: "--color-secondary-container", key: "secondaryContainer" },
  { file: "tokens.css", name: "--color-tertiary", key: "tertiary" },
  { file: "tokens.css", name: "--color-tertiary-container", key: "tertiaryContainer" },
  { file: "tokens.css", name: "--color-outline-variant", key: "outlineVariant" },

  // ── docs/_sass/color_schemes/ge.scss — the full variable block ──
  { file: "ge.scss", name: "$color-scheme", raw: "ge" },
  { file: "ge.scss", blank: true },
  { file: "ge.scss", name: "$body-background-color", key: "surface", comment: "--color-surface" },
  { file: "ge.scss", name: "$body-heading-color", key: "onSurface", comment: "--color-on-surface" },
  { file: "ge.scss", name: "$body-text-color", key: "secondaryInk", comment: "secondary ink, still AA on white" },
  { file: "ge.scss", name: "$link-color", key: "primary", comment: "--color-primary" },
  { file: "ge.scss", name: "$nav-child-link-color", key: "secondaryInk" },
  { file: "ge.scss", name: "$sidebar-color", key: "background", comment: "--color-background" },
  { file: "ge.scss", name: "$base-button-color", key: "surfaceContainerLow", comment: "--color-surface-container-low" },
  { file: "ge.scss", name: "$btn-primary-color", key: "primary" },
  { file: "ge.scss", name: "$code-background-color", key: "surfaceContainerLow" },
  { file: "ge.scss", name: "$feedback-color", raw: "darken($sidebar-color, 3%)" },
  { file: "ge.scss", name: "$table-background-color", key: "surface" },
  { file: "ge.scss", name: "$search-background-color", key: "surface" },
  { file: "ge.scss", name: "$search-result-preview-color", key: "secondaryInk" },
  { file: "ge.scss", name: "$border-color", key: "outlineVariant", comment: "--color-outline-variant" },

  // ── docs/_sass/custom/setup.scss — the $blue-*/$green-* swatch ramp ──
  { file: "setup.scss", name: "$blue-000", key: "primaryContainer" },
  { file: "setup.scss", name: "$blue-100", key: "primaryContainerDark" },
  { file: "setup.scss", name: "$blue-200", key: "primarySwatch" },
  { file: "setup.scss", name: "$blue-300", key: "primaryDark" },
  { file: "setup.scss", name: "$green-000", key: "tertiaryContainerBright" },
  { file: "setup.scss", name: "$green-100", key: "tertiaryContainerDark" },
  // Raw pin — see "KNOWN DISCREPANCY" above before touching this line.
  { file: "setup.scss", name: "$green-200", raw: "#1e8e3e" },
  { file: "setup.scss", name: "$green-300", key: "tertiaryDark" },
];

const CSS_BEGIN = "  /* BEGIN GENERATED: palette — do not edit; run `bun run docs:tokens` */";
const CSS_END = "  /* END GENERATED: palette */";
// NB: the SCSS markers are ASCII-only on purpose — Jekyll's Ruby Sass
// converter (jekyll-sass-converter 1.5.x) parses _sass files as US-ASCII and
// dies on multibyte characters like an em-dash.
const SCSS_BEGIN = "// BEGIN GENERATED: palette -- do not edit; run `bun run docs:tokens`";
const SCSS_END = "// END GENERATED: palette";

export const TARGETS = [
  {
    id: "tokens.css",
    relPath: "packages/design/src/tokens.css",
    begin: CSS_BEGIN,
    end: CSS_END,
    renderLine: (row) => `  ${row.name}: ${valueOf(row)};`,
  },
  {
    id: "ge.scss",
    relPath: "docs/_sass/color_schemes/ge.scss",
    begin: SCSS_BEGIN,
    end: SCSS_END,
    renderLine: (row) => `${row.name}: ${valueOf(row)};${row.comment ? ` // ${row.comment}` : ""}`,
  },
  {
    id: "setup.scss",
    relPath: "docs/_sass/custom/setup.scss",
    begin: SCSS_BEGIN,
    end: SCSS_END,
    renderLine: (row) => `${row.name}: ${valueOf(row)};`,
  },
];

function valueOf(row) {
  if (row.raw !== undefined) return row.raw;
  const hex = PALETTE[row.key];
  if (typeof hex !== "string") {
    throw new Error(`TOKEN_TABLE row ${row.name} points at PALETTE.${row.key}, which does not exist in packages/design/src/palette.mjs`);
  }
  return hex;
}

// Render the region body (the lines between the markers, no markers) for one
// target id.
export function renderRegion(targetId) {
  const target = TARGETS.find((t) => t.id === targetId);
  if (!target) throw new Error(`unknown target id: ${targetId}`);
  return TOKEN_TABLE.filter((row) => row.file === targetId)
    .map((row) => (row.blank ? "" : target.renderLine(row)))
    .join("\n");
}

// Split a file's text into { before, region, after } around the target's
// marker lines. Throws if the markers are missing, duplicated, or reversed —
// a mangled marker must fail the gate loudly, not silently skip the file.
export function splitRegion(text, target) {
  const lines = text.split("\n");
  const beginIdx = lines.indexOf(target.begin);
  const endIdx = lines.indexOf(target.end);
  if (beginIdx === -1 || endIdx === -1) {
    throw new Error(`${target.relPath}: missing generated-region marker (${beginIdx === -1 ? "BEGIN" : "END"} GENERATED: palette)`);
  }
  if (endIdx < beginIdx) throw new Error(`${target.relPath}: END marker precedes BEGIN marker`);
  if (lines.indexOf(target.begin, beginIdx + 1) !== -1 || lines.indexOf(target.end, endIdx + 1) !== -1) {
    throw new Error(`${target.relPath}: duplicated generated-region marker`);
  }
  return {
    before: lines.slice(0, beginIdx + 1).join("\n"),
    region: lines.slice(beginIdx + 1, endIdx).join("\n"),
    after: lines.slice(endIdx).join("\n"),
  };
}

// Byte-compare every target's on-disk region against the rendered truth.
// Returns findings instead of printing (rendering happens at the CLI
// boundary below).
export function checkTokens(root = ROOT) {
  const findings = [];
  for (const target of TARGETS) {
    const { region } = splitRegion(readFileSync(join(root, target.relPath), "utf8"), target);
    const expected = renderRegion(target.id);
    if (region !== expected) {
      findings.push({ file: target.relPath, actual: region, expected });
    }
  }
  return { ok: findings.length === 0, findings };
}

// Rewrite every target's region in place. Returns the list of files whose
// bytes actually changed.
export function writeTokens(root = ROOT) {
  const changed = [];
  for (const target of TARGETS) {
    const path = join(root, target.relPath);
    const text = readFileSync(path, "utf8");
    const { before, region, after } = splitRegion(text, target);
    const expected = renderRegion(target.id);
    if (region !== expected) {
      writeFileSync(path, [before, expected, after].join("\n"));
      changed.push(target.relPath);
    }
  }
  return { changed };
}

export function formatCheckReport(result) {
  if (result.ok) {
    return `Design token check passed: all ${TARGETS.length} generated palette regions match packages/design/src/palette.mjs (via TOKEN_TABLE).`;
  }
  const lines = [
    `Design token check failed: ${result.findings.length} generated palette region${result.findings.length === 1 ? "" : "s"} drifted from packages/design/src/palette.mjs.`,
  ];
  for (const finding of result.findings) {
    lines.push("", `--- ${finding.file} (on disk)`, `+++ ${finding.file} (generated from palette.mjs)`);
    const actualLines = finding.actual.split("\n");
    const expectedLines = finding.expected.split("\n");
    for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i += 1) {
      if (actualLines[i] !== expectedLines[i]) {
        if (actualLines[i] !== undefined) lines.push(`-${actualLines[i]}`);
        if (expectedLines[i] !== undefined) lines.push(`+${expectedLines[i]}`);
      }
    }
  }
  lines.push("", "Edit packages/design/src/palette.mjs (or the TOKEN_TABLE in packages/design/scripts/gen-tokens.mjs) and run: bun run docs:tokens");
  return lines.join("\n");
}

// Run only when this file is the process entry point (house pattern from
// apps/factory/scripts/factory.mjs) — importing it must stay side-effect-free.
const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  try {
    if (process.argv.includes("--check")) {
      const result = checkTokens();
      const writer = result.ok ? process.stdout : process.stderr;
      writer.write(formatCheckReport(result) + "\n");
      process.exit(result.ok ? 0 : 1);
    } else {
      const { changed } = writeTokens();
      for (const file of changed) console.log(`generated ${file}`);
      if (!changed.length) console.log("all generated palette regions already up to date");
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
