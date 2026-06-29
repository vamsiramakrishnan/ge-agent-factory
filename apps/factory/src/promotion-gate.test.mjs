import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPromotionGate } from "./promotion-packet.js";

const made = [];

// A workspace whose artifacts all indicate "promotable". Pass overrides to mutate
// individual artifacts for the negative cases.
function workspace({ validation = { ok: true }, trace = { ok: true }, feedback = { okToPromote: true, specToCodeScore: 5 }, refine = { spec_to_code_fidelity: "pass" } } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "ge-promote-"));
  made.push(dir);
  mkdirSync(join(dir, "artifacts"), { recursive: true });
  const write = (name, value) => value !== null && writeFileSync(join(dir, "artifacts", name), JSON.stringify(value));
  write("validation-report.json", validation);
  write("spec-code-trace.json", trace);
  write("generator-feedback.json", feedback);
  write("harness-refine.json", refine);
  return dir;
}

afterEach(() => { while (made.length) rmSync(made.pop(), { recursive: true, force: true }); });

describe("readPromotionGate", () => {
  test("passes when validation, trace, and both harness verdicts are clean", async () => {
    const gate = await readPromotionGate(workspace());
    expect(gate.ok).toBe(true);
    expect(gate.blockers).toEqual([]);
    expect(gate.specToCodeFidelity).toBe("pass");
  });

  test("blocks when validation is not passing", async () => {
    const gate = await readPromotionGate(workspace({ validation: { ok: false } }));
    expect(gate.ok).toBe(false);
    expect(gate.blockers).toContain("validation report is not passing");
  });

  test("blocks when the review verdict is not ok_to_promote", async () => {
    const gate = await readPromotionGate(workspace({ feedback: { okToPromote: false, specToCodeScore: 5 } }));
    expect(gate.ok).toBe(false);
    expect(gate.blockers).toContain("harness review verdict: ok_to_promote is false");
  });

  test("blocks when refine spec-to-code fidelity is not pass", async () => {
    const gate = await readPromotionGate(workspace({ refine: { spec_to_code_fidelity: "partial" } }));
    expect(gate.ok).toBe(false);
    expect(gate.blockers).toContain("refine spec-to-code fidelity: partial");
  });

  test("does not over-block when refine artifact is absent (refine skipped)", async () => {
    const gate = await readPromotionGate(workspace({ refine: null }));
    expect(gate.ok).toBe(true);
    expect(gate.specToCodeFidelity).toBeNull();
  });
});
