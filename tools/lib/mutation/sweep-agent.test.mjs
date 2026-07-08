// Tests for the real-agent mutation sweep and cassette synthesizer.
//
// The pure synthesizer and the OKF→evalset compile are fast and always run.
// The full behavioral sweep over the shrink bundle drives ~30 offline proofs,
// so it is gated behind GE_MUTATION_E2E to keep the default test gate quick
// (same pattern as the repo's GE_E2E suites).
import { test, expect, describe } from "bun:test";
import { synthesizeCassetteRecords, syntheticTarget } from "./synthesize-cassette.mjs";
import { cassetteInvocationTools, cassetteHasCitations } from "./cassette-mutations.mjs";
import { compileAgentEvalset, sweepAgentBundle } from "./sweep-agent.mjs";

const BUNDLE = "okf/shrink-anomaly-analyzer";

describe("cassette synthesizer", () => {
  test("meta + per-turn records satisfy the declared guards", () => {
    const target = syntheticTarget("demo");
    const records = synthesizeCassetteRecords(
      [{ user: "first" }, { user: "second" }],
      { mustCall: ["tool_a", "tool_b"], mustCite: ["doc-1"] },
      { target, agentId: "agent-demo" },
    );
    expect(records[0].type).toBe("meta");
    expect(records[0].target.engine).toContain("demo-engine");
    expect(cassetteInvocationTools(records).sort()).toEqual(["tool_a", "tool_b"]);
    expect(cassetteHasCitations(records)).toBe(true);
  });

  test("session threading: turn 0 opens a session, later turns reuse it", () => {
    const records = synthesizeCassetteRecords(
      [{ user: "a" }, { user: "b" }],
      { mustCall: ["t"] },
      { target: syntheticTarget("demo"), agentId: "agent-demo" },
    );
    const requests = records.filter((record) => record.type === "request");
    expect(requests[0].session).toBeNull();
    expect(requests[1].session).toBeTruthy();
  });

  test("no citation is synthesized when the case declares none", () => {
    const records = synthesizeCassetteRecords([{ user: "a" }], { mustCall: ["t"] }, { target: syntheticTarget("demo") });
    expect(cassetteHasCitations(records)).toBe(false);
  });
});

describe("OKF → evalset compile", () => {
  test("compiles the shrink bundle and exposes its declared guards", async () => {
    const { agentId, evalset } = await compileAgentEvalset(BUNDLE);
    expect(agentId).toBe("shrink-anomaly-analyzer");
    expect(evalset.evalCases.length).toBeGreaterThan(0);
    // Documented coverage gap: the analyzer's suite enforces no citations.
    const withCite = evalset.evalCases.filter((kase) => (kase.geMetadata?.expected?.mustCite || []).length);
    expect(withCite.length).toBe(0);
  });
});

describe.skipIf(!process.env.GE_MUTATION_E2E)("real agent sweep (GE_MUTATION_E2E)", () => {
  test("shrink-anomaly-analyzer has ornamental guards on its write-tool cases", async () => {
    const result = await sweepAgentBundle(BUNDLE);
    expect(result.ornamental).toBe(true);
    const ornamentalIds = result.ornamentalCases.map((entry) => entry.caseId);
    // The POS write-tool confirmation/duplicate cases cannot tell a compliant
    // agent from one that never calls the write tool (the "unavailable" hole).
    expect(ornamentalIds).toContain("case-tool-action-oracle-xstore-pos-file-confirmation");
    expect(ornamentalIds).toContain("case-tool-action-oracle-xstore-pos-file-duplicate");
  }, 120000);
});
