import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTE } from "../src/palette.mjs";
import {
  TARGETS,
  TOKEN_TABLE,
  checkDocsCustomCssAnchors,
  checkTokens,
  formatCheckReport,
  renderRegion,
  splitRegion,
  writeTokens,
} from "./gen-tokens.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

test("every keyed TOKEN_TABLE row points at a real PALETTE entry", () => {
  for (const row of TOKEN_TABLE) {
    if (row.blank || row.raw !== undefined) continue;
    expect(typeof PALETTE[row.key], `${row.name} → PALETTE.${row.key}`).toBe("string");
  }
});

test("every TOKEN_TABLE row belongs to a known target", () => {
  const ids = new Set(TARGETS.map((t) => t.id));
  for (const row of TOKEN_TABLE) {
    expect(ids.has(row.file), `row ${row.name ?? "(blank)"} targets unknown file ${row.file}`).toBe(true);
  }
});

test("the checked-in stylesheets match the generator (repo is not stale)", () => {
  const result = checkTokens(ROOT);
  expect(result.findings).toEqual([]);
  expect(result.ok).toBe(true);
});

test("$green-200 keeps its shipped value, now traced to PALETTE.tertiarySwatchDark", () => {
  // setup.scss ships $green-200 darker than --color-tertiary on purpose (the
  // tip-callout accent); palette.mjs carries it as tertiarySwatchDark and
  // TOKEN_TABLE maps the ramp entry to that key — no raw hex pins remain
  // anywhere in the table.
  expect(renderRegion("setup.scss")).toContain("$green-200: #0d6d3a;");
  expect(PALETTE.tertiarySwatchDark).toBe("#0d6d3a");
  const row = TOKEN_TABLE.find((r) => r.name === "$green-200");
  expect(row?.key).toBe("tertiarySwatchDark");
  expect(row?.raw).toBeUndefined();
  expect(TOKEN_TABLE.some((r) => r.raw && /^#/.test(r.raw))).toBe(false);
});

test("splitRegion throws on missing, reversed, and duplicated markers", () => {
  const target = TARGETS.find((t) => t.id === "setup.scss");
  expect(() => splitRegion("$blue-000: #4285f4;\n", target)).toThrow(/missing generated-region marker/);
  expect(() => splitRegion(`${target.end}\nx\n${target.begin}\n`, target)).toThrow(/END marker precedes BEGIN/);
  expect(() => splitRegion(`${target.begin}\n${target.end}\n${target.begin}\n`, target)).toThrow(/duplicated/);
});

test("checkTokens flags a hand-edited hex inside a marked region and writeTokens repairs it", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-tokens-test-"));
  try {
    for (const target of TARGETS) {
      const dest = join(tmp, target.relPath);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, readFileSync(join(ROOT, target.relPath), "utf8"));
    }
    const setupPath = join(tmp, "docs/_sass/custom/setup.scss");
    writeFileSync(setupPath, readFileSync(setupPath, "utf8").replace("$blue-200: #2953ff;", "$blue-200: #ff0000;"));

    const drifted = checkTokens(tmp);
    expect(drifted.ok).toBe(false);
    expect(drifted.findings.map((f) => f.file)).toEqual(["docs/_sass/custom/setup.scss"]);
    const report = formatCheckReport(drifted);
    expect(report).toContain("-$blue-200: #ff0000;");
    expect(report).toContain("+$blue-200: #2953ff;");

    const { changed } = writeTokens(tmp);
    expect(changed).toEqual(["docs/_sass/custom/setup.scss"]);
    expect(checkTokens(tmp).ok).toBe(true);
    // The repaired copy is byte-identical to the checked-in file.
    expect(readFileSync(setupPath, "utf8")).toBe(readFileSync(join(ROOT, "docs/_sass/custom/setup.scss"), "utf8"));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("writeTokens is a no-op on an up-to-date tree", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-tokens-test-"));
  try {
    for (const target of TARGETS) {
      const dest = join(tmp, target.relPath);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, readFileSync(join(ROOT, target.relPath), "utf8"));
    }
    expect(writeTokens(tmp).changed).toEqual([]);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("checkDocsCustomCssAnchors returns no findings when the file is absent (isolated fixture roots)", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-tokens-test-"));
  try {
    expect(checkDocsCustomCssAnchors(tmp)).toEqual([]);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("checkDocsCustomCssAnchors flags a drifted annotated anchor in apps/docs/src/styles/custom.css", () => {
  const tmp = mkdtempSync(join(tmpdir(), "gen-tokens-test-"));
  try {
    const dest = join(tmp, "apps/docs/src/styles/custom.css");
    mkdirSync(dirname(dest), { recursive: true });
    const original = readFileSync(join(ROOT, "apps/docs/src/styles/custom.css"), "utf8");
    writeFileSync(dest, original.replace("--sl-color-accent: #2953ff; /* --color-primary */", "--sl-color-accent: #123456; /* --color-primary */"));

    const findings = checkDocsCustomCssAnchors(tmp);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].message).toContain("drifted");
    expect(findings[0].file).toBe("apps/docs/src/styles/custom.css");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("the checked-in apps/docs/src/styles/custom.css has no drifted anchors", () => {
  expect(checkDocsCustomCssAnchors(ROOT)).toEqual([]);
});
