import { describe, expect, test } from "bun:test";
import { modelsDoctor } from "./models-doctor.mjs";

// Offline unit coverage: every probe is injected, so this proves the check's
// structural behavior (pass/warn/fail per condition) without shelling out to
// gcloud, touching the real filesystem, or making any network/paid call.
const ALL_GREEN_CFG = { project: "demo-project", refinementModel: "gemini-3.5-flash", judgeModel: "gemini-3.5-flash" };
const ALL_GREEN_PROBES = {
  gcloudOnPath: () => true,
  pathExists: () => true,
  adcExists: () => true,
};

function checkById(report, id) {
  return report.checks.find((check) => check.id === id);
}

describe("modelsDoctor", () => {
  test("all-green case: every check passes and ok is true", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, { env: {}, probes: ALL_GREEN_PROBES });
    expect(report.ok).toBe(true);
    for (const check of report.checks) {
      expect(check.status, `${check.id}: ${check.detail}`).toBe("pass");
      expect(check.fix).toBeUndefined();
    }
    // ids present at least once, shape matches {id, status, detail, fix?}
    expect(report.checks.map((c) => c.id)).toEqual([
      "vertex.project", "vertex.gcloud", "harness.python", "model.refinement", "model.judge", "adc",
    ]);
  });

  test("no project configured → vertex.project fails, names the fix, overall ok is false", () => {
    const report = modelsDoctor({ ...ALL_GREEN_CFG, project: undefined }, { env: {}, probes: ALL_GREEN_PROBES });
    expect(report.ok).toBe(false);
    const check = checkById(report, "vertex.project");
    expect(check.status).toBe("fail");
    expect(check.detail).toMatch(/no GCP project/);
    expect(check.fix).toMatch(/ge init/);
  });

  test("gcloud not on PATH → vertex.gcloud fails with the install fix", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: {},
      probes: { ...ALL_GREEN_PROBES, gcloudOnPath: () => false },
    });
    expect(report.ok).toBe(false);
    const check = checkById(report, "vertex.gcloud");
    expect(check.status).toBe("fail");
    expect(check.detail).toMatch(/not found on PATH/);
    expect(check.fix).toMatch(/cloud\.google\.com\/sdk\/docs\/install/);
  });

  test("unknown model family → warn, not fail (overall ok stays true — warn doesn't gate)", () => {
    const report = modelsDoctor(
      { ...ALL_GREEN_CFG, refinementModel: "some-mystery-model", judgeModel: "another-one" },
      { env: {}, probes: ALL_GREEN_PROBES },
    );
    expect(report.ok).toBe(true);
    const refinement = checkById(report, "model.refinement");
    expect(refinement.status).toBe("warn");
    expect(refinement.detail).toMatch(/does not match a known family/);
    expect(refinement.fix).toMatch(/ge config explain/);
    const judge = checkById(report, "model.judge");
    expect(judge.status).toBe("warn");
    expect(judge.detail).toContain("another-one");
  });

  test("known model families (gemini-*, claude-*, gpt-*) pass with an info-style detail", () => {
    const report = modelsDoctor(
      { ...ALL_GREEN_CFG, refinementModel: "claude-x-1", judgeModel: "gpt-4.1" },
      { env: {}, probes: ALL_GREEN_PROBES },
    );
    expect(checkById(report, "model.refinement")).toMatchObject({ status: "pass" });
    expect(checkById(report, "model.judge")).toMatchObject({ status: "pass" });
  });

  test("unresolved model (empty string) → warn, not a thrown error", () => {
    const report = modelsDoctor({ ...ALL_GREEN_CFG, refinementModel: "" }, { env: {}, probes: ALL_GREEN_PROBES });
    const check = checkById(report, "model.refinement");
    expect(check.status).toBe("warn");
    expect(check.detail).toMatch(/unresolved/);
  });

  test("missing ADC and no GOOGLE_APPLICATION_CREDENTIALS → warn with the gcloud login fix", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: {},
      probes: { ...ALL_GREEN_PROBES, adcExists: () => false },
    });
    expect(report.ok).toBe(true); // warn, not fail — gates nothing by itself
    const check = checkById(report, "adc");
    expect(check.status).toBe("warn");
    expect(check.detail).toMatch(/no GOOGLE_APPLICATION_CREDENTIALS/);
    expect(check.fix).toBe("gcloud auth application-default login");
  });

  test("GOOGLE_APPLICATION_CREDENTIALS set and resolvable → adc passes and names the path", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: { GOOGLE_APPLICATION_CREDENTIALS: "/opt/sa.json" },
      probes: { ...ALL_GREEN_PROBES, pathExists: (p) => p === "/opt/sa.json" },
    });
    const check = checkById(report, "adc");
    expect(check.status).toBe("pass");
    expect(check.detail).toContain("/opt/sa.json");
  });

  test("GOOGLE_APPLICATION_CREDENTIALS set but file missing → adc warns", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: { GOOGLE_APPLICATION_CREDENTIALS: "/opt/missing.json" },
      probes: { ...ALL_GREEN_PROBES, pathExists: () => false },
    });
    const check = checkById(report, "adc");
    expect(check.status).toBe("warn");
  });

  test("harness python: GE_HARNESS_PYTHON override resolves and passes", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: { GE_HARNESS_PYTHON: "/opt/venv/bin/python3" },
      probes: { ...ALL_GREEN_PROBES, pathExists: () => false },
    });
    const check = checkById(report, "harness.python");
    expect(check.status).toBe("pass");
    expect(check.detail).toContain("/opt/venv/bin/python3");
    expect(check.detail).toMatch(/env:GE_HARNESS_PYTHON/);
  });

  test("harness python: repo .venv found (no override) resolves and passes", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: {},
      probes: { ...ALL_GREEN_PROBES, pathExists: () => true },
    });
    const check = checkById(report, "harness.python");
    expect(check.status).toBe("pass");
    expect(check.detail).toMatch(/repo \.venv/);
  });

  test("harness python: no override and no .venv → warn (falls back to bare python3)", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: {},
      probes: { ...ALL_GREEN_PROBES, pathExists: () => false },
    });
    expect(report.ok).toBe(true); // warn, not fail
    const check = checkById(report, "harness.python");
    expect(check.status).toBe("warn");
    expect(check.detail).toMatch(/fallback/);
    expect(check.fix).toMatch(/mise run deps/);
  });

  test("never throws even if a probe throws", () => {
    const report = modelsDoctor(ALL_GREEN_CFG, {
      env: {},
      probes: {
        gcloudOnPath: () => { throw new Error("boom"); },
        pathExists: () => { throw new Error("boom"); },
        adcExists: () => { throw new Error("boom"); },
      },
    });
    expect(report.ok).toBe(false);
    expect(checkById(report, "vertex.gcloud").status).toBe("fail");
  });

  test("defaults (no env/probes passed) run against the real environment without throwing", () => {
    expect(() => modelsDoctor(ALL_GREEN_CFG)).not.toThrow();
  });
});
