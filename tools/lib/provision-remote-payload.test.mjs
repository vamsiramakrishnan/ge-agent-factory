// Root-cause gate for the "config resolved but not consumed on some build path"
// class (blindspot audit, class: config-not-consumed).
//
// The centralized build-affecting config fields (agentModel, judgeModel,
// refinementModel, harnessAgent) must reach the generator/harness on BOTH the
// local and remote build paths. Resolution (flag→env→file→default) is unit-
// tested elsewhere; this asserts *consumption* on the remote path, which was
// enforced only by code comments — and where harnessAgent silently no-op'd
// until it was added to the remote payload. Each field got remote-parity
// forwarding retrofitted one at a time; this test makes a dropped field on the
// remote path fail by construction so the whole class can't recur.
import { describe, expect, test } from "bun:test";
import { createProvisionOps } from "./provision.mjs";

// Minimal injected deps: capture the payload the remote path POSTs to the
// gateway, stub everything with side effects to no-ops.
function opsCapturingPayload() {
  const payloads = [];
  const ops = createProvisionOps({
    run: () => ({ ok: true, out: "", err: "" }),
    gcloud: () => ({ ok: true, out: "", err: "" }),
    ensureGcloud: () => {},
    ensureBin: () => {},
    withGateway: async (cfg, fn) => fn("https://gateway.example", { headers: {} }),
    postJson: async (_url, _path, payload) => {
      payloads.push(payload);
      return { ok: true, json: { ok: true, runId: "run-1", workspaceId: "ws-1" } };
    },
    loadCatalog: async () => [
      { id: "asc-1", title: "Agent One", department: "finance", subtitle: "x", systems: [] },
    ],
    runLedger: async () => ({}),
    ledgerWrite: async (fn) => fn({ recordRemoteSubmission: () => {} }),
    readJson: () => ({ completed: {}, failed: {} }),
    writeJson: () => {},
    localPreflight: () => {},
    ensureLocalUv: () => {},
    repoRoot: "/nonexistent",
    configPath: "/nonexistent/.ge.json",
    factoryHarnessDir: "/nonexistent/.harness",
    factoryDataRoot: "/nonexistent/.data",
    genDir: "/nonexistent/generated",
  });
  return { ops, payloads };
}

const BASE_CFG = { project: "p", region: "us-central1", geAppId: "eng-1", bucket: "b", projectNumber: "123" };

describe("remote provision payload consumes build-affecting config", () => {
  // field on cfg → key expected on the top-level remote payload.
  const CASES = [
    { field: "agentModel", value: "gemini-x", payloadKey: "model" },
    { field: "judgeModel", value: "judge-x", payloadKey: "judgeModel" },
    { field: "refinementModel", value: "refine-x", payloadKey: "refinementModel" },
    { field: "harnessAgent", value: "claude", payloadKey: "harnessProvider" },
  ];

  for (const { field, value, payloadKey } of CASES) {
    test(`cfg.${field} reaches the remote payload as ${payloadKey}`, async () => {
      const { ops, payloads } = opsCapturingPayload();
      await ops.provision({ ...BASE_CFG, [field]: value }, { scope: "all" });
      expect(payloads).toHaveLength(1);
      expect(payloads[0][payloadKey]).toBe(value);
    });
  }
});
