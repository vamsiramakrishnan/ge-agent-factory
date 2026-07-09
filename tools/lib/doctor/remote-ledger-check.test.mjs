import { describe, expect, test } from "bun:test";
import { remoteLedgerCheck } from "./engine.mjs";

// Offline unit coverage for the "one-command live verification" doctor probe
// (ADR 0001 phase 2): a fake reader stands in for the real Firestore ledger
// reader (createFirestoreLedgerReader), so this proves the check's structural
// behavior — ok/empty/error, and the no-project skip — without any real GCP
// credentials or network access. Never throws in any of these cases.
const GCP_ENV_VARS = ["GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT", "GE_PROJECT", "GCP_PROJECT_ID"];
function withoutGcpEnv(fn) {
  const saved = Object.fromEntries(GCP_ENV_VARS.map((k) => [k, process.env[k]]));
  for (const k of GCP_ENV_VARS) delete process.env[k];
  return Promise.resolve().then(fn).finally(() => {
    for (const k of GCP_ENV_VARS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });
}

describe("remoteLedgerCheck", () => {
  test("no project configured → warn (skipped), names the fix, never throws", async () => {
    await withoutGcpEnv(async () => {
      const check = await remoteLedgerCheck({}, { createReader: async () => { throw new Error("must not be called"); } });
      expect(check).toMatchObject({ name: "remote ledger (Firestore)", status: "warn" });
      expect(check.detail).toMatch(/skipped/i);
      expect(check.fix).toMatch(/ge (mode remote|init)/);
    });
  });

  test("project configured, reader connects, run(s) exist → pass (ok), names the latest run", async () => {
    const createReader = async ({ projectId }) => {
      expect(projectId).toBe("demo-project");
      return { listRuns: async ({ limit }) => { expect(limit).toBe(1); return [{ id: "remote-build-x", status: "done" }]; } };
    };
    const check = await remoteLedgerCheck({ project: "demo-project" }, { createReader });
    expect(check.status).toBe("pass");
    expect(check.detail).toMatch(/^ok —/);
    expect(check.detail).toContain("remote-build-x");
    expect(check.fix).toBeNull();
  });

  test("project configured, reader connects, zero runs → pass (empty), not a failure", async () => {
    const createReader = async () => ({ listRuns: async () => [] });
    const check = await remoteLedgerCheck({ project: "demo-project" }, { createReader });
    expect(check.status).toBe("pass");
    expect(check.detail).toMatch(/empty/i);
  });

  test("reader construction fails (e.g. missing ADC) → fail (error), structural detail, never throws", async () => {
    const createReader = async () => { throw new Error("Could not load the default credentials"); };
    const check = await remoteLedgerCheck({ project: "demo-project" }, { createReader });
    expect(check.status).toBe("fail");
    expect(check.detail).toMatch(/^error —/);
    expect(check.detail).toMatch(/default credentials/);
    expect(check.fix).toMatch(/gcloud auth/);
  });

  test("reader connects but the read itself fails (e.g. permission denied) → fail (error), never throws", async () => {
    const createReader = async () => ({ listRuns: async () => { throw new Error("PERMISSION_DENIED"); } });
    const check = await remoteLedgerCheck({ project: "demo-project" }, { createReader });
    expect(check.status).toBe("fail");
    expect(check.detail).toMatch(/PERMISSION_DENIED/);
  });

  test("falls back to env-resolved project when cfg.project is unset", async () => {
    await withoutGcpEnv(async () => {
      process.env.GE_PROJECT = "env-project";
      const createReader = async ({ projectId }) => {
        expect(projectId).toBe("env-project");
        return { listRuns: async () => [] };
      };
      const check = await remoteLedgerCheck({}, { createReader });
      expect(check.status).toBe("pass");
    });
  });
});
