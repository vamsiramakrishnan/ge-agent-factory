import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { computeProofBinding } from "../../../packages/admission/src/index.mjs";
import { REPO_ROOT } from "../state-paths.mjs";
import { admissionGatePolicy, shouldAdmit } from "./admission-ops.mjs";

// Policy resolution and the handoff enforcement rule are pure — test in
// process. The stateful loop (emit → verify → admit over a real workspace
// dir) runs through the CLI in a subprocess with its own GE_STATE_ROOT, the
// same isolation pattern as tools/ge/status-board.test.mjs.

describe("admissionGatePolicy", () => {
  test("defaults to audit mode and merges .ge.json promotion.gates.admission", () => {
    const dir = mkdtempSync(join(tmpdir(), "ge-admission-cfg-"));
    const configFile = join(dir, ".ge.json");
    expect(admissionGatePolicy(configFile).required).toBe(false);
    writeFileSync(configFile, JSON.stringify({ promotion: { gates: { admission: { required: true, maxAgeDays: 7 } } } }));
    const policy = admissionGatePolicy(configFile);
    expect(policy.required).toBe(true);
    expect(policy.maxAgeDays).toBe(7);
    expect(policy.requireLiveProof).toBe(false);
    expect(policy.requireFreshProofBinding).toBe(true);
  });
});

describe("shouldAdmit (the handoff enforcement rule)", () => {
  test("audit mode admits with blockers; required denies; force is break-glass", () => {
    const denied = { allowed: false, required: false };
    expect(shouldAdmit(denied)).toBe(true); // audit mode: record, don't refuse
    expect(shouldAdmit({ allowed: false, required: true })).toBe(false);
    expect(shouldAdmit({ allowed: false, required: true }, { force: true })).toBe(true);
    expect(shouldAdmit({ allowed: true, required: true })).toBe(true);
  });
});

describe("passport loop via the CLI", () => {
  const stateRoot = mkdtempSync(join(tmpdir(), "ge-admission-state-"));

  function runGe(argv) {
    return spawnSync("bun", ["tools/ge.mjs", ...argv, "--json"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      timeout: 60000,
      env: { ...process.env, GE_STATE_ROOT: stateRoot, NO_COLOR: "1", GE_LEDGER: "0" },
    });
  }

  function prepareWorkspace(id, { proofBinding = "fresh" } = {}) {
    const workspace = join(stateRoot, "factory", "workspaces", id);
    mkdirSync(join(workspace, "mock_systems"), { recursive: true });
    mkdirSync(join(workspace, "artifacts"), { recursive: true });
    mkdirSync(join(workspace, "app"), { recursive: true });
    writeFileSync(join(workspace, "mock_systems", "usecase-spec.json"), JSON.stringify({ behaviorContract: { role: "demo" } }));
    writeFileSync(join(workspace, "app", "agent.py"), "print('hi')\n");

    const packet = { workspace: { useCaseId: "demo" }, promotionGate: { ok: true, blockers: [] } };
    if (proofBinding !== "missing") {
      packet.proofBinding = computeProofBinding(workspace);
      if (proofBinding === "stale") {
        packet.proofBinding.workspace = { ...packet.proofBinding.workspace, hex: "0".repeat(64) };
      }
    }
    const packetPath = join(workspace, "artifacts", "promotion-packet.json");
    writeFileSync(packetPath, JSON.stringify(packet));
    return { workspace, packetPath, passportPath: join(workspace, "artifacts", "agent-passport.json") };
  }

  test("emit → verify → admit round-trips, and tampering is caught", () => {
    const { workspace } = prepareWorkspace("demo-agent");

    const emitted = runGe(["passport", "emit", "demo-agent"]);
    expect(emitted.status).toBe(0);
    expect(JSON.parse(emitted.stdout).subject.digest.sha256).toMatch(/^[0-9a-f]{64}$/);

    const verified = runGe(["passport", "verify", "demo-agent"]);
    expect(verified.status).toBe(0);
    expect(JSON.parse(verified.stdout).ok).toBe(true);

    const admitted = runGe(["passport", "admit", "demo-agent"]);
    expect(admitted.status).toBe(0);
    const decision = JSON.parse(admitted.stdout);
    expect(decision.kind).toBe("AdmissionDecision");
    expect(decision.allowed).toBe(true);

    // tamper with shipped bytes → digest binding breaks
    writeFileSync(join(workspace, "app", "agent.py"), "print('tampered')\n");
    const reAdmitted = runGe(["passport", "admit", "demo-agent"]);
    expect(reAdmitted.status).toBe(0); // gate not required by default — audit mode
    const deniedDecision = JSON.parse(reAdmitted.stdout);
    expect(deniedDecision.allowed).toBe(false);
    expect(deniedDecision.blockers.map((b) => b.code)).toContain("GEADM003");
  }, 120000);

  test("emit rejects a promotion packet with no stored proof binding", () => {
    const { packetPath, passportPath } = prepareWorkspace("missing-binding-agent", { proofBinding: "missing" });
    const packetBefore = readFileSync(packetPath, "utf8");

    const emitted = runGe(["passport", "emit", "missing-binding-agent"]);

    expect(emitted.status).toBe(1);
    expect(JSON.parse(emitted.stdout).error.why).toBe("missing proof binding");
    expect(readFileSync(packetPath, "utf8")).toBe(packetBefore);
    expect(existsSync(passportPath)).toBe(false);
  });

  test("emit rejects rather than replacing a stale stored proof binding", () => {
    const { packetPath, passportPath } = prepareWorkspace("stale-binding-agent", { proofBinding: "stale" });
    const packetBefore = readFileSync(packetPath, "utf8");

    const emitted = runGe(["passport", "emit", "stale-binding-agent"]);

    expect(emitted.status).toBe(1);
    expect(JSON.parse(emitted.stdout).error.why).toContain("stale proof binding: workspace");
    expect(readFileSync(packetPath, "utf8")).toBe(packetBefore);
    expect(existsSync(passportPath)).toBe(false);
  });
});
