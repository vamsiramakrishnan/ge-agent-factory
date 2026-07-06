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

test("the palette region renders keyed values and carries no raw hex pins", () => {
  // Every row traces to a PALETTE key rather than a hardcoded hex; the
  // generated region prints the resolved value.
  expect(renderRegion("tokens.css")).toContain("--color-primary: #00408b;");
  expect(PALETTE.primary).toBe("#00408b");
  expect(TOKEN_TABLE.some((r) => r.raw && /^#/.test(r.raw))).toBe(false);
});

test("splitRegion throws on missing, reversed, and duplicated markers", () => {
  const target = TARGETS.find((t) => t.id === "tokens.css");
  expect(() => splitRegion("--color-primary: #00408b;\n", target)).toThrow(/missing generated-region marker/);
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
    const cssPath = join(tmp, "packages/design/src/tokens.css");
    writeFileSync(cssPath, readFileSync(cssPath, "utf8").replace("--color-primary: #00408b;", "--color-primary: #ff0000;"));

    const drifted = checkTokens(tmp);
    expect(drifted.ok).toBe(false);
    expect(drifted.findings.map((f) => f.file)).toEqual(["packages/design/src/tokens.css"]);
    const report = formatCheckReport(drifted);
    expect(report).toContain("-  --color-primary: #ff0000;");
    expect(report).toContain("+  --color-primary: #00408b;");

    const { changed } = writeTokens(tmp);
    expect(changed).toEqual(["packages/design/src/tokens.css"]);
    expect(checkTokens(tmp).ok).toBe(true);
    // The repaired copy is byte-identical to the checked-in file.
    expect(readFileSync(cssPath, "utf8")).toBe(readFileSync(join(ROOT, "packages/design/src/tokens.css"), "utf8"));
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
    writeFileSync(dest, original.replace("--sl-color-accent: #00408b; /* --color-primary */", "--sl-color-accent: #123456; /* --color-primary */"));

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
