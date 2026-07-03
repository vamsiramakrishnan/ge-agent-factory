// `ge evals compile` core: BYO spec files and the captured-spec registry both
// resolve, artifacts land where pointed, and the failure modes carry literal
// next commands.
import { test, expect } from "bun:test";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileEvals } from "./compile-command.mjs";
import { normalizeEvalset } from "../evals/evalset.mjs";
import { isDxError } from "../errors/dx-error.mjs";

const FIXTURE_SPEC = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");

test("compiles a bring-your-own spec file into the full artifact set", async () => {
  const outDir = mkdtempSync(join(tmpdir(), "ge-evals-compile-"));
  const result = await compileEvals({ spec: FIXTURE_SPEC, outDir, maxCases: 12 });
  expect(result.counts.selected).toBeLessThanOrEqual(12);
  expect(result.counts.candidates).toBeGreaterThan(result.counts.selected);
  for (const key of ["graph", "coverage", "selectedCases", "benchProfile", "adkEvalset", "agentsCliDataset"]) {
    expect(existsSync(join(outDir, result.artifacts[key].split("/").at(-1)))).toBe(true);
  }
  // The emitted evalset is loadable by the shared evalset module (the same
  // loader ge prove --live uses) — the compile → prove loop is closed.
  const evalset = normalizeEvalset(JSON.parse(readFileSync(join(outDir, result.artifacts.adkEvalset.split("/").at(-1)), "utf8")));
  expect(evalset.cases.length).toBe(result.counts.selected);
  expect(result.next).toContain("ge prove --live --evalset");
});

test("registry resolution: the single registered catalog spec wins by default", async () => {
  const outDir = mkdtempSync(join(tmpdir(), "ge-evals-compile-"));
  const result = await compileEvals({ outDir });
  expect(result.subject.agentId).toBe("help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr");
  expect(result.coverageGaps).toEqual([]);
});

test("missing spec file fails with the four-field error", async () => {
  let thrown;
  try {
    await compileEvals({ spec: "/nonexistent/spec.json" });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.what).toContain("spec not found");
});

test("unknown registry id names the failure and the fix", async () => {
  let thrown;
  try {
    await compileEvals({ id: "not-a-real-spec" });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.why).toContain("not-a-real-spec");
});
