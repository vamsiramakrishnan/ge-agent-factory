// The language gate must catch a seeded violation (CS-7/CS-11 of the
// Language & DX refactor) — a gate that can't fail is decoration.
import { test, expect } from "bun:test";
import { scanZoneText, scanCopyText, OPERATOR_TERMS, BANNED_PHRASES } from "./lang-gate.mjs";
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

test("URLs and paths are addresses, not register — but their visible text is policed", () => {
  // Link/image targets and src/href values are exempt…
  expect(scanZoneText('See [the flow](docs/assets/signature-pipeline.svg) here.')).toEqual([]);
  expect(scanZoneText('<img src="assets/signature-pipeline.svg" alt="from capture to handoff">')).toEqual([]);
  // …but alt text and link text still count.
  expect(scanZoneText('<img src="a.svg" alt="the pipeline stages">').map((f) => f.term)).toEqual(["pipeline"]);
  expect(scanZoneText('[the pipeline view](docs/a.md)').map((f) => f.term)).toEqual(["pipeline"]);
});

test("every operator term in the policy list is actually detected", () => {
  for (const term of OPERATOR_TERMS) {
    expect(scanZoneText(`leading with ${term} here`).map((f) => f.term)).toEqual([term]);
  }
});

test("every banned copy phrase in the policy list is actually detected", () => {
  for (const phrase of BANNED_PHRASES) {
    expect(scanCopyText(`This sentence uses ${phrase} in running prose.`).map((f) => f.term)).toEqual([phrase]);
  }
});

test("copy scan exempts fenced code blocks — quoted output is not the docs' voice", () => {
  const text = "Clean prose.\n```text\nold output said: evidence, not vibes\n```\nStill clean.\n";
  expect(scanCopyText(text)).toEqual([]);
  expect(scanCopyText("evidence, not vibes").map((f) => f.term)).toEqual(["vibes"]);
});

test("the ge --help Golden path section speaks the golden register today", () => {
  const section = renderGoldenPathSection(rootCommand, { colors: false });
  expect(section.length).toBeGreaterThan(0);
  expect(scanZoneText(section)).toEqual([]);
});
