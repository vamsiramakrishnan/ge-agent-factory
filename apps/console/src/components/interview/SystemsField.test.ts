import { test, expect } from "bun:test";
import {
  MIN_DESCRIPTION_LENGTH,
  sourceLabel,
  summarizeSynthResult,
  toolNames,
  type SynthResult,
} from "./SystemsField";

const base: SynthResult = {
  ok: true,
  id: "parts_ledger",
  displayName: "PartsLedger",
  source: "nl-llm",
  tools: [
    { name: "list_parts", description: "List parts" },
    { name: "create_requisition" },
    "approve_requisition",
  ],
  collections: { parts: 12, requisitions: 4 },
  registered: false,
  valid: true,
  validationErrors: [],
  repairs: 0,
};

test("toolNames flattens string + object tools and drops blanks", () => {
  expect(toolNames(base.tools)).toEqual(["list_parts", "create_requisition", "approve_requisition"]);
  expect(toolNames([{ name: "" }, "ok", { description: "no name" } as any])).toEqual(["ok"]);
  expect(toolNames(undefined as any)).toEqual([]);
});

test("sourceLabel maps known tiers and passes through unknowns", () => {
  expect(sourceLabel("nl-llm")).toBe("LLM (Vertex)");
  expect(sourceLabel("nl-llm-repaired")).toBe("LLM (Vertex, self-repaired)");
  expect(sourceLabel("nl-heuristic")).toBe("Heuristic (offline)");
  expect(sourceLabel("samples")).toBe("From samples");
  expect(sourceLabel("openapi")).toBe("From OpenAPI");
  expect(sourceLabel("something-new")).toBe("something-new");
  expect(sourceLabel(undefined)).toBe("synthesized");
});

test("summarizeSynthResult: valid result is addable with correct counts", () => {
  const s = summarizeSynthResult(base);
  expect(s.valid).toBe(true);
  expect(s.canAdd).toBe(true);
  expect(s.toolCount).toBe(3);
  expect(s.collectionCount).toBe(2);
  expect(s.totalRows).toBe(16);
  expect(s.sourceLabel).toBe("LLM (Vertex)");
  expect(s.errors).toEqual([]);
  expect(s.repairs).toBe(0);
  expect(s.id).toBe("parts_ledger");
});

test("summarizeSynthResult: invalid result is NOT addable and surfaces errors", () => {
  const invalid: SynthResult = {
    ...base,
    valid: false,
    validationErrors: ["missing primary key on requisitions", "tool create_requisition has no params"],
  };
  const s = summarizeSynthResult(invalid);
  expect(s.valid).toBe(false);
  expect(s.canAdd).toBe(false);
  expect(s.errors).toHaveLength(2);
  expect(s.errors[0]).toContain("primary key");
});

test("summarizeSynthResult: missing valid flag is treated as ok (back-compat)", () => {
  const { valid, ...withoutValid } = base;
  const s = summarizeSynthResult(withoutValid as SynthResult);
  expect(s.valid).toBe(true);
  expect(s.canAdd).toBe(true);
});

test("summarizeSynthResult: valid but no id cannot be added", () => {
  const s = summarizeSynthResult({ ...base, id: "" });
  expect(s.valid).toBe(true);
  expect(s.canAdd).toBe(false);
});

test("summarizeSynthResult: repairs count and label reflected", () => {
  const s = summarizeSynthResult({ ...base, source: "nl-llm-repaired", repairs: 2 });
  expect(s.repairs).toBe(2);
  expect(s.sourceLabel).toBe("LLM (Vertex, self-repaired)");
});

test("summarizeSynthResult: tolerates missing/empty collections + tools", () => {
  const s = summarizeSynthResult({ ...base, tools: [], collections: {} as Record<string, number> });
  expect(s.toolCount).toBe(0);
  expect(s.collectionCount).toBe(0);
  expect(s.totalRows).toBe(0);
});

test("summarizeSynthResult: non-numeric row counts coerce to 0", () => {
  const s = summarizeSynthResult({ ...base, collections: { parts: NaN as any, jobs: 3 } });
  expect(s.totalRows).toBe(3);
});

test("summarizeSynthResult: filters blank validation errors", () => {
  const s = summarizeSynthResult({ ...base, valid: false, validationErrors: ["real", "", null as any] });
  expect(s.errors).toEqual(["real"]);
});

test("MIN_DESCRIPTION_LENGTH is a sane positive threshold", () => {
  expect(MIN_DESCRIPTION_LENGTH).toBeGreaterThan(0);
});
