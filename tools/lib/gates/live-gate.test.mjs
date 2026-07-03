// The live gate policy resolution contract. The CLI --strict-responder flag
// may only TIGHTEN the configured gate — omitting it must never relax a gate
// that .ge.json (or the default) set to strict, or a configured release gate
// is silently bypassed (PR #20 P1).
import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveLiveGatePolicy, liveGatePolicy, evaluateLiveGate, DEFAULT_LIVE_GATE_POLICY } from "./live-gate.mjs";

function configWith(live) {
  const dir = mkdtempSync(join(tmpdir(), "ge-live-gate-"));
  const path = join(dir, ".ge.json");
  writeFileSync(path, JSON.stringify({ promotion: { gates: { live } } }));
  return path;
}

test("default policy is strict-responder", () => {
  expect(DEFAULT_LIVE_GATE_POLICY.strictResponder).toBe(true);
});

test("omitting --strict-responder does NOT relax a configured/default strict gate", () => {
  // No config file → defaults apply (strict). Flag omitted.
  const policy = resolveLiveGatePolicy({ configFile: "/nonexistent/.ge.json", strictResponderFlag: false });
  expect(policy.strictResponder).toBe(true);
});

test("omitting the flag preserves an explicitly-configured strict gate", () => {
  const configFile = configWith({ required: true, strictResponder: true });
  const policy = resolveLiveGatePolicy({ configFile, strictResponderFlag: false });
  expect(policy.strictResponder).toBe(true);
  expect(policy.required).toBe(true);
});

test("--strict-responder tightens a config that left it off", () => {
  const configFile = configWith({ strictResponder: false });
  expect(liveGatePolicy(configFile).strictResponder).toBe(false);
  expect(resolveLiveGatePolicy({ configFile, strictResponderFlag: true }).strictResponder).toBe(true);
});

test("a config that turns strict off, with the flag omitted, stays off (explicit operator choice honored)", () => {
  const configFile = configWith({ strictResponder: false });
  expect(resolveLiveGatePolicy({ configFile, strictResponderFlag: false }).strictResponder).toBe(false);
});

test("end to end: unknown responder under a configured strict gate blocks even without the flag", () => {
  const configFile = configWith({ strictResponder: true });
  const proofResult = {
    status: "passed",
    passRate: 1,
    cases: [{ metrics: [{ metric: "responder_identity", status: "warning" }] }],
    conformance: { baseline: "matched", drift: [] },
    verdict: { blockers: [] },
    artifacts: {},
  };
  const gate = evaluateLiveGate(proofResult, resolveLiveGatePolicy({ configFile, strictResponderFlag: false }));
  expect(gate.passed).toBe(false);
  expect(gate.blockers.some((blocker) => blocker.code === "GELIVE006")).toBe(true);
});
