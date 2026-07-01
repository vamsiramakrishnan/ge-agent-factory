import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkDesignTokens,
  findUntracedValues,
  formatDesignTokensReport,
  paletteHexValues,
  parseCssCustomProperties,
  parseSassVariables,
} from "./design-tokens.mjs";
import { PALETTE } from "../../packages/design/src/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

test("parseCssCustomProperties extracts --color-* hex custom properties", () => {
  const css = `
    @theme {
      --font-sans: "Space Grotesk", sans-serif;
      --color-primary: #1a73e8;
      --color-on-surface: #202124;
    }
  `;
  expect(parseCssCustomProperties(css)).toEqual({
    "--color-primary": "#1a73e8",
    "--color-on-surface": "#202124",
  });
});

test("parseSassVariables extracts $name: #hex; assignments and ignores function calls", () => {
  const scss = `
    $link-color: #1a73e8; // --color-primary
    $feedback-color: darken($sidebar-color, 3%);
    $border-color: #DADCE0;
  `;
  expect(parseSassVariables(scss)).toEqual({
    "$link-color": "#1a73e8",
    "$border-color": "#dadce0",
  });
});

test("paletteHexValues lowercases and dedupes hex values from the palette object", () => {
  const hexes = paletteHexValues({ a: "#ABCDEF", b: "#abcdef", c: "#111111" });
  expect(hexes).toEqual(new Set(["#abcdef", "#111111"]));
});

test("findUntracedValues flags names whose hex isn't in the palette set", () => {
  const paletteHexes = new Set(["#1a73e8"]);
  const findings = findUntracedValues("some.css", { "--color-primary": "#1a73e8", "--color-rogue": "#ff0000" }, paletteHexes);
  expect(findings).toEqual([{ source: "some.css", name: "--color-rogue", hex: "#ff0000" }]);
});

test("checkDesignTokens passes when every value traces to the palette", () => {
  const tokensCssText = "@theme { --color-primary: #1a73e8; }";
  const sassText = "$link-color: #1a73e8;";
  const result = checkDesignTokens({ tokensCssText, sassText, palette: { primary: "#1A73E8" } });
  expect(result.ok).toBe(true);
  expect(result.findings).toEqual([]);
});

test("checkDesignTokens fails and reports a stray hex value not in the palette", () => {
  const tokensCssText = "@theme { --color-rogue: #ff0000; }";
  const sassText = "";
  const result = checkDesignTokens({ tokensCssText, sassText, palette: { primary: "#1a73e8" } });
  expect(result.ok).toBe(false);
  expect(result.findings).toEqual([
    { source: "packages/design/src/tokens.css", name: "--color-rogue", hex: "#ff0000" },
  ]);
});

test("formatDesignTokensReport renders a pass and a fail report", () => {
  const passReport = formatDesignTokensReport({ ok: true, findings: [], cssCount: 3, sassCount: 2 });
  expect(passReport).toContain("passed");

  const failReport = formatDesignTokensReport({
    ok: false,
    findings: [{ source: "ge.scss", name: "$link-color", hex: "#ff0000" }],
  });
  expect(failReport).toContain("Design token drift check failed");
  expect(failReport).toContain("$link-color");
});

test("the real tokens.css and ge.scss trace cleanly to packages/design/src/palette.mjs", () => {
  const tokensCssText = readFileSync(join(ROOT, "packages/design/src/tokens.css"), "utf8");
  const sassText = readFileSync(join(ROOT, "docs/_sass/color_schemes/ge.scss"), "utf8");
  const result = checkDesignTokens({ tokensCssText, sassText, palette: PALETTE });
  expect(result.findings).toEqual([]);
  expect(result.ok).toBe(true);
});
