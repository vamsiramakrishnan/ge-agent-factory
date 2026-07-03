// Selection contract: greedy set-cover satisfies every required tag that
// exists in the pool, deterministically; maxCases trims lowest-weight cover
// picks (reported as dropped); impossible requirements surface as gaps.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { selectCases } from "./select-cases.mjs";
import { DEFAULT_REQUIRED_COVERAGE } from "./compile.mjs";
import { CoverageSummarySchema } from "./graph.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));
const graph = compileBehavioralGraph(envelope, { sourcePath: FIXTURE });

// Small hand-built pool where the optimal picks are known.
const makeCase = (id, coverage, riskWeight = 1) => ({ id, coverage, riskWeight });
const tinyPool = [
  makeCase("case-a", ["capability:one", "intent:happy_path"], 1),
  makeCase("case-b", ["capability:two", "intent:happy_path"], 1),
  makeCase("case-c", ["capability:one", "capability:two", "intent:clarification"], 2),
  makeCase("case-d", ["refusal:three", "capability:three"], 2),
  makeCase("case-e", ["intent:failure"], 3),
];

test("covers every required tag present in the pool", () => {
  const { selected, coverage } = selectCases({
    cases: tinyPool,
    requiredCoverage: ["capability:*", "refusal:*"],
    maxCases: 3,
  });
  expect(coverage.dimensions.capability.gaps).toEqual([]);
  expect(coverage.dimensions.refusal.gaps).toEqual([]);
  // case-c covers both capabilities at once; greedy must prefer it over a+b.
  const ids = selected.map((kase) => kase.id);
  expect(ids).toContain("case-c");
  expect(ids).toContain("case-d");
});

test("tops up to maxCases with the heaviest leftovers", () => {
  const { selected } = selectCases({ cases: tinyPool, requiredCoverage: ["refusal:*"], maxCases: 2 });
  expect(selected.map((kase) => kase.id)).toEqual(["case-d", "case-e"]);
});

test("maxCases trims lowest-weight cover picks and reports them as dropped", () => {
  const { selected, dropped, coverage } = selectCases({
    cases: tinyPool,
    requiredCoverage: ["capability:*", "refusal:*", "intent:failure"],
    maxCases: 2,
  });
  expect(selected).toHaveLength(2);
  expect(dropped.length).toBeGreaterThan(0);
  // Whatever was dropped weighs no more than anything kept.
  const minKept = Math.min(...selected.map((kase) => kase.riskWeight));
  for (const drop of dropped) expect(drop.riskWeight).toBeLessThanOrEqual(minKept);
  const gapCount = Object.values(coverage.dimensions).flatMap((dim) => dim.gaps).length;
  expect(gapCount).toBeGreaterThan(0);
});

test("an exact required tag missing from the pool is reported as a gap", () => {
  const { coverage } = selectCases({ cases: tinyPool, requiredCoverage: ["claim:auth-nope"] });
  expect(coverage.dimensions.claim.required).toEqual(["claim:auth-nope"]);
  expect(coverage.dimensions.claim.gaps).toEqual(["claim:auth-nope"]);
});

test("a wildcard over an absent dimension requires nothing", () => {
  const { coverage } = selectCases({ cases: tinyPool, requiredCoverage: ["escalation:*"] });
  expect(coverage.dimensions.escalation.required).toEqual([]);
  expect(coverage.dimensions.escalation.gaps).toEqual([]);
});

test("riskWeights per-case overrides reorder trimming", () => {
  const { selected } = selectCases({
    cases: tinyPool,
    requiredCoverage: [],
    maxCases: 1,
    riskWeights: { "case-a": 10 },
  });
  expect(selected.map((kase) => kase.id)).toEqual(["case-a"]);
});

test("satisfies the default required coverage on the compiled fixture pool", () => {
  const { selected, coverage } = selectCases({
    cases: graph.conversations,
    requiredCoverage: DEFAULT_REQUIRED_COVERAGE,
    maxCases: 40,
  });
  expect(selected.length).toBeLessThanOrEqual(40);
  expect(CoverageSummarySchema.safeParse(coverage).success).toBe(true);
  for (const dimension of Object.values(coverage.dimensions)) expect(dimension.gaps).toEqual([]);
  expect(coverage.totalCandidates).toBe(graph.conversations.length);
  expect(coverage.selected).toBe(selected.length);
});

test("selection is deterministic across runs", () => {
  const run = () =>
    selectCases({ cases: graph.conversations, requiredCoverage: DEFAULT_REQUIRED_COVERAGE, maxCases: 25 });
  expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
});
