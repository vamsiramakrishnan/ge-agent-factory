// `ge evals coverage` core: reads the coverage.json a prior `ge evals compile`
// wrote and adds the derived per-dimension/overall/gap-list view; a missing
// report or a named-but-absent evalset both fail with a literal next command.
import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeJson } from "@ge/std/json-io";
import { evalsCoverage } from "./coverage-command.mjs";
import { importEvalset } from "./import-command.mjs";
import { isDxError } from "../errors/dx-error.mjs";

// Shape matches coverageSummary() in packages/evalkit/src/select-cases.mjs —
// the exact bytes `ge evals compile` writes to .ge/behavioral/coverage.json.
const COVERAGE_FIXTURE = {
  dimensions: {
    intent: { required: ["intent:enroll", "intent:cancel"], covered: ["intent:enroll"], gaps: ["intent:cancel"] },
    tone: { required: ["tone:frustrated"], covered: ["tone:frustrated"], gaps: [] },
  },
  totalCandidates: 9,
  selected: 4,
};

function writeCoverageFixture() {
  const dir = mkdtempSync(join(tmpdir(), "ge-evals-coverage-"));
  writeJson(join(dir, "coverage.json"), COVERAGE_FIXTURE);
  return dir;
}

test("reports per-dimension, overall, and flattened gaps from a compiled coverage.json", () => {
  const dir = writeCoverageFixture();
  const result = evalsCoverage({ dir });
  expect(result.totalCandidates).toBe(9);
  expect(result.selected).toBe(4);
  expect(result.summary.dimensions.intent).toEqual({ required: 2, covered: 1, gapCount: 1 });
  expect(result.summary.dimensions.tone).toEqual({ required: 1, covered: 1, gapCount: 0 });
  expect(result.summary.totals).toEqual({ required: 3, covered: 2, gaps: 1 });
  expect(result.summary.gaps).toEqual([{ dimension: "intent", gap: "intent:cancel" }]);
});

test("missing coverage.json fails with a fix pointing at `ge evals compile`", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-evals-coverage-empty-"));
  let thrown;
  try {
    evalsCoverage({ dir });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toBe("ge evals compile");
});

test("an --id with a matching <id>.evalset.json includes evalset case counts", () => {
  const dir = writeCoverageFixture();
  writeFileSync(join(dir, "benefits.evalset.json"), JSON.stringify({
    evalSetId: "benefits",
    evalCases: [{ evalId: "c1", conversation: [{ userContent: { parts: [{ text: "hi" }] } }] }],
  }));
  const result = evalsCoverage({ id: "benefits", dir });
  expect(result.evalset).toEqual({ path: expect.stringContaining("benefits.evalset.json"), cases: 1 });
});

test("an --id with no matching evalset artifact fails with a literal fix", () => {
  const dir = writeCoverageFixture();
  let thrown;
  try {
    evalsCoverage({ id: "not-imported", dir });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toContain("ge evals import");
});

test("coverage + import compose: an imported evalset is visible to coverage by id", () => {
  const dir = writeCoverageFixture();
  const fixture = join(dir, "source.evalset.json");
  writeFileSync(fixture, JSON.stringify({
    evalSetId: "imported-set",
    evalCases: [{ evalId: "c1", conversation: [{ userContent: { parts: [{ text: "hi" }] } }] }],
  }));
  importEvalset({ evalset: fixture, out: dir });
  const result = evalsCoverage({ id: "imported-set", dir });
  expect(result.evalset.cases).toBe(1);
});
