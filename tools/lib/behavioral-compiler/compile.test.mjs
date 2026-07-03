// End-to-end suite compile: the four artifacts land on disk, parse, and
// validate; the selection is a subset of the graph's own pool; the bench
// profile only load-mixes read-path cases.
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralSuite } from "./compile.mjs";
import { validateBehavioralGraph, CoverageSummarySchema, ConversationCaseSchema } from "./graph.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));

const outDir = mkdtempSync(join(tmpdir(), "ge-behavioral-compile-"));
const result = compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 40, outDir });

test("writes the four artifacts and each one parses and validates", () => {
  const graphJson = JSON.parse(readFileSync(join(outDir, "graph.json"), "utf8"));
  expect(validateBehavioralGraph(graphJson).ok).toBe(true);

  const coverageJson = JSON.parse(readFileSync(join(outDir, "coverage.json"), "utf8"));
  expect(CoverageSummarySchema.safeParse(coverageJson).success).toBe(true);

  const selectedJson = JSON.parse(readFileSync(join(outDir, "selected-cases.json"), "utf8"));
  expect(Array.isArray(selectedJson.cases)).toBe(true);
  for (const kase of selectedJson.cases) expect(ConversationCaseSchema.safeParse(kase).success).toBe(true);

  const profileJson = JSON.parse(readFileSync(join(outDir, "bench-profile.json"), "utf8"));
  expect(profileJson).toEqual(result.benchProfile);
});

test("selected cases are a subset of the graph's conversation pool", () => {
  const poolIds = new Set(result.graph.conversations.map((kase) => kase.id));
  expect(result.selection.selected.length).toBeGreaterThan(0);
  expect(result.selection.selected.length).toBeLessThanOrEqual(40);
  for (const kase of result.selection.selected) expect(poolIds.has(kase.id)).toBe(true);
});

test("default coverage policy is fully satisfied on the fixture", () => {
  for (const [dimension, entry] of Object.entries(result.selection.coverage.dimensions)) {
    expect({ dimension, gaps: entry.gaps }).toEqual({ dimension, gaps: [] });
  }
});

test("bench profile shape and load mix exclude write-path cases", () => {
  const { benchProfile } = result;
  expect(benchProfile.id).toBe(`profile-${result.graph.subject.agentId}`);
  expect(benchProfile.source).toBe("contract");
  expect(benchProfile.sessions).toBe(10);
  expect(benchProfile.concurrency).toEqual([1, 2, 4]);
  expect(benchProfile.mode).toBe("mixed");
  expect(Number.isInteger(benchProfile.turnsPerSession)).toBe(true);
  expect(benchProfile.mix.length).toBeGreaterThan(0);

  const writeTools = new Set(result.graph.tools.filter((tool) => tool.operation === "write").map((tool) => tool.toolName));
  const byId = new Map(result.selection.selected.map((kase) => [kase.id, kase]));
  for (const entry of benchProfile.mix) {
    const kase = byId.get(entry.caseId);
    expect(kase.intent).toBe("happy_path");
    expect(kase.coverage.some((tag) => tag.startsWith("write_tool:"))).toBe(false);
    expect((kase.expected.mustCall || []).some((name) => writeTools.has(name))).toBe(false);
    expect(entry.weight).toBeGreaterThan(0);
  }
});

test("suite compile is deterministic end to end", () => {
  const again = compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 40 });
  expect(JSON.stringify(again.graph)).toBe(JSON.stringify(result.graph));
  expect(JSON.stringify(again.selection)).toBe(JSON.stringify(result.selection));
  expect(JSON.stringify(again.benchProfile)).toBe(JSON.stringify(result.benchProfile));
});
