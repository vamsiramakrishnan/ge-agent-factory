// Evalset contract: ADK-compatible on read (camelCase and snake_case), strict
// about what a live run needs (user text per invocation), and round-trip safe
// on append — unknown ADK-owned fields must survive byte-for-byte.
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEvalset, normalizeEvalset, appendRecordedCase } from "./evalset.mjs";
import { isDxError } from "../errors/dx-error.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "adk-minimal.evalset.json");

test("accepts the minimal ADK evalset fixture", () => {
  const evalset = loadEvalset(FIXTURE);
  expect(evalset.id).toBe("benefits-minimal");
  expect(evalset.cases).toHaveLength(1);
  const kase = evalset.cases[0];
  expect(kase.id).toBe("eligible-life-event-change");
  expect(kase.turns.map((turn) => turn.user)).toEqual([
    "Can I change my plan after having a child?",
    "How many days do I have?",
  ]);
  expect(kase.turns[0].reference).toContain("qualifying life event");
  expect(kase.turns[1].reference).toBe(null);
});

test("accepts snake_case spellings", () => {
  const evalset = normalizeEvalset({
    eval_set_id: "s",
    eval_cases: [{ eval_id: "c", conversation: [{ user_content: { parts: [{ text: "hi" }] } }] }],
  });
  expect(evalset.id).toBe("s");
  expect(evalset.cases[0].turns[0].user).toBe("hi");
});

test("rejects an invented GE-only shape with the four-field error", () => {
  let thrown;
  try {
    normalizeEvalset({ suite: "nope", scenarios: [] });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toContain("ge drive --record");
});

test("rejects an invocation without user text", () => {
  expect(() => normalizeEvalset({ evalCases: [{ evalId: "c", conversation: [{ finalResponse: { parts: [{ text: "only reference" }] } }] }] })).toThrow(/no user text/);
});

test("appendRecordedCase creates a new evalset file", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-evalset-"));
  const path = join(dir, "recorded.evalset.json");
  appendRecordedCase(path, { caseId: "recorded-1", turns: [{ user: "hello", reference: null }], metadata: { source: "ge drive" } });
  const evalset = loadEvalset(path);
  expect(evalset.cases[0].id).toBe("recorded-1");
  expect(evalset.cases[0].turns[0].user).toBe("hello");
});

test("appendRecordedCase round-trips unknown ADK-owned fields untouched", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-evalset-"));
  const path = join(dir, "roundtrip.evalset.json");
  const original = JSON.parse(readFileSync(FIXTURE, "utf8"));
  writeFileSync(path, JSON.stringify(original, null, 2) + "\n");
  appendRecordedCase(path, { caseId: "recorded-2", turns: [{ user: "again" }] });
  const after = JSON.parse(readFileSync(path, "utf8"));
  // Everything ADK owns is untouched; GE only appended one case.
  expect(after.creationTimestamp).toBe(original.creationTimestamp);
  expect(after.evalCases[0]).toEqual(original.evalCases[0]);
  expect(after.evalCases).toHaveLength(original.evalCases.length + 1);
  expect(after.evalCases.at(-1).evalId).toBe("recorded-2");
});

test("appendRecordedCase refuses a duplicate case id", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-evalset-"));
  const path = join(dir, "dup.evalset.json");
  appendRecordedCase(path, { caseId: "one", turns: [{ user: "a" }] });
  expect(() => appendRecordedCase(path, { caseId: "one", turns: [{ user: "b" }] })).toThrow(/already exists/);
});
