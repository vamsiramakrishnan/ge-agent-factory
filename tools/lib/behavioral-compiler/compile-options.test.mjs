// Opt-in compiler options: defaults stay byte-identical to the pre-options
// compiler (no new tags, no options stamp, same selection), and each option
// changes exactly what it advertises — adversarial candidates enter the pool
// before selection, perturbation variants mirror the selection after it.
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralSuite, DEFAULT_REQUIRED_COVERAGE } from "./compile.mjs";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { selectCases } from "./select-cases.mjs";
import { ConversationCaseSchema } from "./graph.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));

test("default options produce byte-identical artifacts to the un-optioned pipeline", () => {
  const outA = mkdtempSync(join(tmpdir(), "ge-compile-default-"));
  const outB = mkdtempSync(join(tmpdir(), "ge-compile-explicit-"));
  compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 40, outDir: outA });
  compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 40, outDir: outB, perturbVariants: 0, adversarial: false });
  for (const artifact of ["graph.json", "coverage.json", "selected-cases.json", "bench-profile.json"]) {
    expect(readFileSync(join(outB, artifact), "utf8")).toBe(readFileSync(join(outA, artifact), "utf8"));
  }
  // The default selected-cases artifact is exactly the pre-options shape:
  // { cases, dropped } from a plain set-cover over the plain expansion pool.
  const selected = JSON.parse(readFileSync(join(outA, "selected-cases.json"), "utf8"));
  expect(Object.keys(selected).sort()).toEqual(["cases", "dropped"]);
  const graph = compileBehavioralGraph(envelope, { sourcePath: FIXTURE });
  const reference = selectCases({ cases: graph.conversations, requiredCoverage: DEFAULT_REQUIRED_COVERAGE, maxCases: 40 });
  expect(JSON.stringify(selected.cases)).toBe(JSON.stringify(reference.selected));
  const tags = selected.cases.flatMap((kase) => kase.coverage);
  expect(tags.some((tag) => tag.startsWith("adversarial:") || tag.startsWith("perturbation:"))).toBe(false);
});

test("adversarial: candidates join the pool before selection and adversarial:* becomes required", () => {
  const result = compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 60, adversarial: true });
  const poolTags = new Set(result.graph.conversations.flatMap((kase) => kase.coverage));
  expect(poolTags.has("adversarial:prompt_injection")).toBe(true);
  const dimension = result.selection.coverage.dimensions.adversarial;
  expect(dimension.required.sort()).toEqual([
    "adversarial:authority_spoofing",
    "adversarial:data_exfiltration",
    "adversarial:prompt_injection",
    "adversarial:scope_creep",
    "adversarial:tool_result_injection",
  ]);
  expect(dimension.gaps).toEqual([]);
  // Selection still draws from the graph's own pool (adversarial included).
  const poolIds = new Set(result.graph.conversations.map((kase) => kase.id));
  for (const kase of result.selection.selected) expect(poolIds.has(kase.id)).toBe(true);
  expect(result.options).toEqual({ maxCases: 60, perturbVariants: 0, adversarial: true });
});

test("perturbation variants mirror the selection, referencing parent ids", () => {
  const base = compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 20 });
  const result = compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 20, perturbVariants: 2 });
  const baseIds = new Set(base.selection.selected.map((kase) => kase.id));
  expect(result.selection.selected).toHaveLength(base.selection.selected.length * 3);
  for (const kase of result.selection.selected) {
    if (!kase.id.includes(".p")) {
      expect(baseIds.has(kase.id)).toBe(true);
      continue;
    }
    const parentId = kase.id.replace(/\.p\d+$/, "");
    expect(baseIds.has(parentId)).toBe(true);
    expect(kase.coverage.some((tag) => tag.startsWith("perturbation:"))).toBe(true);
    expect(ConversationCaseSchema.safeParse(kase).success).toBe(true);
  }
  // Variants never enter the graph pool or the bench profile — they mirror
  // the selection, and load replay uses the base cases only.
  const poolIds = new Set(result.graph.conversations.map((kase) => kase.id));
  expect(result.selection.selected.some((kase) => poolIds.has(kase.id) && kase.id.includes(".p"))).toBe(false);
  expect(JSON.stringify(result.benchProfile)).toBe(JSON.stringify(base.benchProfile));
  expect(result.selection.coverage.selected).toBe(result.selection.selected.length);
});

test("selected-cases.json records the options used when a non-default option is on", () => {
  const outDir = mkdtempSync(join(tmpdir(), "ge-compile-options-"));
  compileBehavioralSuite(envelope, { sourcePath: FIXTURE, maxCases: 60, outDir, perturbVariants: 1, adversarial: true });
  const selected = JSON.parse(readFileSync(join(outDir, "selected-cases.json"), "utf8"));
  expect(selected.options).toEqual({ maxCases: 60, perturbVariants: 1, adversarial: true });
});

test("optioned compiles stay deterministic end to end", () => {
  const options = { sourcePath: FIXTURE, maxCases: 60, perturbVariants: 2, adversarial: true };
  const first = compileBehavioralSuite(envelope, options);
  const second = compileBehavioralSuite(envelope, options);
  expect(JSON.stringify(first.graph)).toBe(JSON.stringify(second.graph));
  expect(JSON.stringify(first.selection)).toBe(JSON.stringify(second.selection));
});
