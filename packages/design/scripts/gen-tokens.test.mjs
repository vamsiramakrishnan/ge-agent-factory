import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTE } from "../src/palette.mjs";
import {
  TARGETS,
  TOKEN_TABLE,
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
  // setup.scss shipped $green-200: #1e8e3e before palette.mjs (wrongly)
  // documented it as matching --color-tertiary (#34a853). The hex has since
  // landed in PALETTE as tertiarySwatchDark (the deliberately-darker
  // tip-callout accent) and TOKEN_TABLE's raw pin was swapped for that key —
  // this guards that the rendered value still matches the shipped bytes and
  // that the trace is to a real palette entry, not a raw literal.
  expect(renderRegion("setup.scss")).toContain("$green-200: #1e8e3e;");
  expect(PALETTE.tertiarySwatchDark).toBe("#1e8e3e");
  const row = TOKEN_TABLE.find((r) => r.name === "$green-200");
  expect(row?.key).toBe("tertiarySwatchDark");
  expect(row?.raw).toBeUndefined();
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
    writeFileSync(setupPath, readFileSync(setupPath, "utf8").replace("$blue-200: #1a73e8;", "$blue-200: #ff0000;"));

    const drifted = checkTokens(tmp);
    expect(drifted.ok).toBe(false);
    expect(drifted.findings.map((f) => f.file)).toEqual(["docs/_sass/custom/setup.scss"]);
    const report = formatCheckReport(drifted);
    expect(report).toContain("-$blue-200: #ff0000;");
    expect(report).toContain("+$blue-200: #1a73e8;");

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
