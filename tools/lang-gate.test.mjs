// The language gate must catch a seeded violation (CS-7/CS-11 of the
// Language & DX refactor) — a gate that can't fail is decoration.
import { test, expect } from "bun:test";
import { scanZoneText, OPERATOR_TERMS } from "./lang-gate.mjs";
import { renderGoldenPathSection } from "./ge/help.mjs";
import { rootCommand } from "./ge.mjs";

test("a seeded operator-register sentence is caught, with line numbers", () => {
  const findings = scanZoneText("Clean line.\nThe daemon drives the pipeline for the fleet.\n");
  expect(findings.map((f) => f.term).sort()).toEqual(["daemon", "fleet", "pipeline"]);
  expect(findings[0].line).toBe(2);
});

test("matching is word-bounded — 'model' and 'remodel' are not 'mode'", () => {
  expect(scanZoneText("The mental model, remodeled.")).toEqual([]);
  expect(scanZoneText("switch the mode here").map((f) => f.term)).toEqual(["mode"]);
});

test("<details> blocks are exempt — collapsing IS the sanctioned disclosure", () => {
  const text = "Golden intro.\n<details><summary>Under the hood</summary>\nge devex smoke builds one canary via the harness\n</details>\nStill golden.\n";
  expect(scanZoneText(text)).toEqual([]);
  // …but the same sentence outside the block is a violation.
  expect(scanZoneText("ge devex smoke builds one canary via the harness").length).toBeGreaterThan(0);
});

test("every operator term in the policy list is actually detected", () => {
  for (const term of OPERATOR_TERMS) {
    expect(scanZoneText(`leading with ${term} here`).map((f) => f.term)).toEqual([term]);
  }
});

test("the ge --help Golden path section speaks the golden register today", () => {
  const section = renderGoldenPathSection(rootCommand, { colors: false });
  expect(section.length).toBeGreaterThan(0);
  expect(scanZoneText(section)).toEqual([]);
});
