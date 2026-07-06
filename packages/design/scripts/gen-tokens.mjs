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
//   - packages/design/src/tokens.css     (the --color-* @theme block and the
//     status-ramp block ONLY; the Tailwind theme fonts and component classes
//     around them stay hand-written)
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
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTE } from "../src/palette.mjs";
import { STATUS_RAMP, STATUS_ACCENTS } from "../src/status-ramp.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

// THE explicit name→token table. Every generated line is one row: the output
// variable name, the palette key it is pinned to (or a `raw` literal for the
// few non-palette lines a region carries), and an optional trailing comment
// rendered verbatim. Row order is emission order.
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
];

const CSS_BEGIN = "  /* BEGIN GENERATED: palette — do not edit; run `bun run docs:tokens` */";
const CSS_END = "  /* END GENERATED: palette */";
const STATUS_CSS_BEGIN = "  /* BEGIN GENERATED: status-ramp — do not edit; run `bun run docs:tokens` */";
const STATUS_CSS_END = "  /* END GENERATED: status-ramp */";

// The status-ramp region rows come from status-ramp.mjs (the CLI colorizer
// reads the same table — see its header), not TOKEN_TABLE: statuses carry an
// ansi column and a base/-ink pair per name, which TOKEN_TABLE's flat
// name→palette-key shape has no room for.
function statusRampRows() {
  const rows = [];
  for (const [tone, entry] of Object.entries(STATUS_RAMP)) {
    rows.push({ name: `--color-status-${tone}`, value: entry.cssValue || entry.hex });
    rows.push({ name: `--color-status-${tone}-ink`, value: entry.ink });
  }
  for (const [accent, entry] of Object.entries(STATUS_ACCENTS)) {
    rows.push({ name: `--color-accent-${accent}`, value: entry.hex });
    rows.push({ name: `--color-accent-${accent}-ink`, value: entry.ink });
  }
  return rows;
}

export const TARGETS = [
  {
    id: "tokens.css",
    relPath: "packages/design/src/tokens.css",
    begin: CSS_BEGIN,
    end: CSS_END,
    renderLine: (row) => `  ${row.name}: ${valueOf(row)};`,
  },
  {
    id: "status-ramp.css",
    relPath: "packages/design/src/tokens.css",
    begin: STATUS_CSS_BEGIN,
    end: STATUS_CSS_END,
    rows: statusRampRows,
    renderLine: (row) => `  ${row.name}: ${row.value};`,
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
  const rows = target.rows ? target.rows() : TOKEN_TABLE.filter((row) => row.file === targetId);
  return rows
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

// apps/docs/src/styles/custom.css is hand-written prose, not a generated
// region — it has no @ge/design dependency and instead documents, inline,
// which of its hex values are verbatim copies of a tokens.css --color-*
// token (a comment like `/* --color-primary */` or `/* IS --color-primary:
// ... */`). Those self-declared anchors are exactly the seam a palette
// change could silently desync, since nothing else in this file watches
// apps/docs/. Reuse TOKEN_TABLE's existing tokens.css name→PALETTE-key
// pairs (no new hand-mirrored mapping) to verify every anchor line's hex
// still matches.
const DOCS_CUSTOM_CSS_REL = "apps/docs/src/styles/custom.css";
const TOKENS_CSS_NAME_TO_KEY = new Map(
  TOKEN_TABLE.filter((row) => row.file === "tokens.css" && row.key).map((row) => [row.name, row.key]),
);
const ANCHOR_LINE_RE = /^\s*(--[\w-]+):\s*(#[0-9a-fA-F]{6});\s*\/\*\s*(?:IS\s+)?(--color-[\w-]+)/;

export function checkDocsCustomCssAnchors(root = ROOT) {
  const path = join(root, DOCS_CUSTOM_CSS_REL);
  if (!existsSync(path)) return []; // not every check root is a full repo checkout (e.g. isolated test fixtures)
  const lines = readFileSync(path, "utf8").split("\n");
  const findings = [];
  lines.forEach((line, i) => {
    const m = line.match(ANCHOR_LINE_RE);
    if (!m) return;
    const [, name, hexInFile, colorToken] = m;
    const key = TOKENS_CSS_NAME_TO_KEY.get(colorToken);
    if (!key) {
      findings.push({ file: DOCS_CUSTOM_CSS_REL, anchorLine: i + 1, name, message: `references unknown token ${colorToken} (not in TOKEN_TABLE's tokens.css rows)` });
      return;
    }
    const expectedHex = PALETTE[key];
    if (hexInFile.toLowerCase() !== expectedHex.toLowerCase()) {
      findings.push({ file: DOCS_CUSTOM_CSS_REL, anchorLine: i + 1, name, message: `${name}: ${hexInFile} claims to match ${colorToken} (${expectedHex}) but has drifted` });
    }
  });
  return findings;
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
  findings.push(...checkDocsCustomCssAnchors(root));
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
    return `Design token check passed: all ${TARGETS.length} generated palette regions match packages/design/src/palette.mjs (via TOKEN_TABLE), and ${DOCS_CUSTOM_CSS_REL}'s annotated anchors match.`;
  }
  const lines = [
    `Design token check failed: ${result.findings.length} finding${result.findings.length === 1 ? "" : "s"} drifted from packages/design/src/palette.mjs.`,
  ];
  for (const finding of result.findings) {
    if (finding.message) {
      lines.push("", `${finding.file}:${finding.anchorLine} — ${finding.message}`);
      continue;
    }
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
  lines.push("", "Edit packages/design/src/palette.mjs (or the TOKEN_TABLE in packages/design/scripts/gen-tokens.mjs) and run: bun run docs:tokens", `For a ${DOCS_CUSTOM_CSS_REL} finding: hand-edit its hex to match, since that file is prose, not generated.`);
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
