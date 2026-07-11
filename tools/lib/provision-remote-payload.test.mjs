// Root-cause gate for the "config resolved but not consumed on some build path"
// class (blindspot audit, class: config-not-consumed).
//
// The centralized build-affecting config fields (agentModel, judgeModel,
// evalJudgeSamples, refinementModel, harnessAgent) must reach the generator/harness on BOTH the
// local and remote build paths. Resolution (flag→env→file→default) is unit-
// tested elsewhere; this asserts *consumption* on the remote path, which was
// enforced only by code comments — and where harnessAgent silently no-op'd
// until it was added to the remote payload. Each field got remote-parity
// forwarding retrofitted one at a time; this test makes a dropped field on the
// remote path fail by construction so the whole class can't recur.
import { describe, expect, test } from "bun:test";
import { DEFAULT_REMOTE_SUBMIT_CONCURRENCY, createProvisionOps, defaultRemoteSubmitConcurrency, normalizeRemoteFactoryStage } from "./provision.mjs";

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
    { field: "evalJudgeSamples", value: "1", payloadKey: "evalJudgeSamples" },
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

  test("remote submission fanout defaults above the old serial-ish value and honors env override", () => {
    expect(DEFAULT_REMOTE_SUBMIT_CONCURRENCY).toBe(8);
    expect(defaultRemoteSubmitConcurrency({})).toBe(8);
    expect(defaultRemoteSubmitConcurrency({ GE_REMOTE_SUBMIT_CONCURRENCY: "12" })).toBe(12);
    expect(() => defaultRemoteSubmitConcurrency({ GE_REMOTE_SUBMIT_CONCURRENCY: "0" })).toThrow(/between/);
  });

  test("remote submission returns a deterministic fanout plan", async () => {
    const { ops } = opsCapturingPayload();
    const result = await ops.provision(BASE_CFG, { scope: "all" });
    expect(result.fanout).toMatchObject({ kind: "stage_fanout", stage: "submit", total: 1 });
    expect(result.results[0].fanoutKey.startsWith("remote-build-")).toBe(true);
    expect(result.results[0].fanoutKey.endsWith(":asc-1:submit:1")).toBe(true);
    expect(result.results[0].taskId).toMatch(/asc-1-submit-1-[a-f0-9]{10}$/);
  });
});

describe("exact remote resume", () => {
  test("posts the tracked run to the gateway resume endpoint and advances local tracking", async () => {
    const posts = [];
    const writes = [];
    const ledgerCalls = [];
    const ops = createProvisionOps({
      run: () => ({ ok: true, out: "", err: "" }),
      gcloud: () => ({ ok: true, out: "", err: "" }),
      ensureGcloud: () => {},
      ensureBin: () => {},
      withGateway: async (_cfg, fn) => fn("https://gateway.example", { headers: { authorization: "Bearer token" } }),
      postJson: async (url, path, payload, headers) => {
        posts.push({ url, path, payload, headers });
        return { ok: true, json: { ok: true, runId: "run-new", workspaceId: "ws-asc-1", resumeOf: "run-old" } };
      },
      loadCatalog: async () => [{ id: "asc-1", department: "finance" }],
      runLedger: async () => ({}),
      ledgerWrite: async (fn) => fn({ recordRemoteSubmission: (input) => ledgerCalls.push(input) }),
      readJson: () => ({ completed: { "asc-1": { runId: "run-old", workspaceId: "ws-asc-1" } }, failed: {} }),
      writeJson: (_path, value) => writes.push(structuredClone(value)),
      localPreflight: () => {},
      ensureLocalUv: () => {},
      repoRoot: "/nonexistent",
      configPath: "/nonexistent/.ge.json",
      factoryHarnessDir: "/nonexistent/.harness",
      factoryDataRoot: "/nonexistent/.data",
      genDir: "/nonexistent/generated",
    });

    const result = await ops.resumeRemote({
      ...BASE_CFG,
      mcpServices: { finance: "https://finance-mcp.example" },
      agentIdentityPrincipalSet: "principalSet://agent-identity",
    }, { ids: "asc-1", targetStage: "published" });

    expect(result).toMatchObject({ submitted: 1, failed: 0, targetStage: "publish_enterprise" });
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      url: "https://gateway.example",
      path: "/api/factory/runs/run-old/resume",
      headers: { authorization: "Bearer token" },
      payload: {
        targetStage: "publish_enterprise",
        target: {
          projectId: "p",
          mcpServiceUrl: "https://finance-mcp.example",
          agentIdentityPrincipalSet: "principalSet://agent-identity",
        },
      },
    });
    expect(writes.at(-1).completed["asc-1"]).toMatchObject({ runId: "run-new", resumeOf: "run-old" });
    expect(ledgerCalls[0]).toMatchObject({ mode: "remote", kind: "resume", targetStage: "publish_enterprise" });
  });

  test("normalizes ledger stage aliases to executable cloud stages", () => {
    expect(normalizeRemoteFactoryStage("previewed")).toBe("preview");
    expect(normalizeRemoteFactoryStage("deployed")).toBe("poll_runtime");
    expect(normalizeRemoteFactoryStage("registered")).toBe("register_tools");
    expect(normalizeRemoteFactoryStage("published")).toBe("publish_enterprise");
    expect(normalizeRemoteFactoryStage("verify_live")).toBe("verify_live");
  });
});
