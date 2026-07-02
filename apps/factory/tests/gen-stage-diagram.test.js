// Tests for apps/factory/scripts/gen-stage-diagram.mjs — the generator that
// emits docs/diagrams-src/factory-stages.mmd from FACTORY_STAGE_GRAPH.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateMermaid, OWNER_STYLES } from "../scripts/gen-stage-diagram.mjs";
import { FACTORY_STAGE_GRAPH } from "../src/factory-orchestration.js";
import { PALETTE } from "../../../packages/design/src/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const MMD_PATH = join(HERE, "..", "..", "..", "docs", "diagrams-src", "factory-stages.mmd");

test("renders one node per stage and linear edges in array order", () => {
  const mmd = generateMermaid();
  for (const stage of FACTORY_STAGE_GRAPH) {
    expect(mmd).toContain(`  ${stage.id}["${stage.label}"]`);
  }
  for (let i = 0; i + 1 < FACTORY_STAGE_GRAPH.length; i += 1) {
    expect(mmd).toContain(`  ${FACTORY_STAGE_GRAPH[i].id} --> ${FACTORY_STAGE_GRAPH[i + 1].id}`);
  }
  expect(mmd.startsWith("%% GENERATED from apps/factory/src/factory-orchestration.js")).toBe(true);
});

// docs/DESIGN.md renderer landmine: a trailing `;` on a classDef/class line
// silently fails to match beautiful-mermaid's regex and renders a phantom
// node literally named `class`. This must never regress.
test("no classDef or class line ends with a semicolon", () => {
  const mmd = generateMermaid();
  const styleLines = mmd.split("\n").filter((l) => l.trim().startsWith("classDef ") || l.trim().startsWith("class "));
  expect(styleLines.length).toBeGreaterThan(0);
  for (const line of styleLines) {
    expect(line.endsWith(";")).toBe(false);
  }
});

test("one classDef per owner, every stage assigned, hexes from PALETTE only", () => {
  const mmd = generateMermaid();
  const owners = [...new Set(FACTORY_STAGE_GRAPH.map((s) => s.owner))];
  const paletteHexes = new Set(Object.values(PALETTE));
  for (const owner of owners) {
    expect(mmd).toContain(`classDef ${owner} `);
    expect(paletteHexes.has(OWNER_STYLES[owner].fill)).toBe(true);
    expect(paletteHexes.has(OWNER_STYLES[owner].stroke)).toBe(true);
  }
  for (const hex of mmd.match(/#[0-9a-f]{6}/gi) ?? []) {
    expect(paletteHexes.has(hex)).toBe(true);
  }
  const classed = mmd
    .split("\n")
    .filter((l) => l.trim().startsWith("class "))
    .flatMap((l) => l.trim().split(/\s+/)[1].split(","));
  expect(classed.sort()).toEqual(FACTORY_STAGE_GRAPH.map((s) => s.id).sort());
});

test("checked-in factory-stages.mmd matches FACTORY_STAGE_GRAPH (no drift)", () => {
  expect(readFileSync(MMD_PATH, "utf8")).toBe(generateMermaid());
});
