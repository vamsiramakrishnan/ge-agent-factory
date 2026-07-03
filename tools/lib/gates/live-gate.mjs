// The live promotion gate — turn a LiveProofResult (and optionally a
// LiveBenchResult) into a gate verdict against configured policy.
//
// Policy lives in .ge.json under `promotion.gates.live` (additionalProperties
// is sanctioned there) with the staged defaults: local proof is required
// everywhere; live proof and load budgets are opt-in until an operator turns
// them on for release/production promotion.
import { readJson } from "@ge/std/json-io";
import { STATE_PATHS } from "../state-paths.mjs";

export const DEFAULT_LIVE_GATE_POLICY = {
  required: false,
  minPassRate: 1.0,
  strictResponder: true,
  allowBaselineDrift: false,
};

export function liveGatePolicy(configFile = STATE_PATHS.config) {
  const file = readJson(configFile, {}) || {};
  return { ...DEFAULT_LIVE_GATE_POLICY, ...(file.promotion?.gates?.live || {}) };
}

// Returns a GateResult: { gate, required, passed, blockers, artifacts, next }.
export function evaluateLiveGate(proofResult, policy = DEFAULT_LIVE_GATE_POLICY) {
  const blockers = [];
  if (!proofResult) {
    return {
      gate: "live-proof",
      required: policy.required,
      passed: !policy.required,
      blockers: policy.required ? [{ code: null, what: "no live proof result found", retryable: false, fix: "ge prove --live" }] : [],
      artifacts: [],
      next: "ge prove --live",
    };
  }
  if (proofResult.status !== "passed") {
    blockers.push(...(proofResult.verdict?.blockers || []));
    if (!blockers.length) blockers.push({ code: null, what: `live proof ${proofResult.status}`, retryable: false, fix: "ge prove --live" });
  }
  if (typeof proofResult.passRate === "number" && proofResult.passRate < policy.minPassRate) {
    blockers.push({
      code: "GELIVE008",
      what: `live pass rate ${proofResult.passRate} below the gate's minimum ${policy.minPassRate}`,
      retryable: false,
      fix: "ge prove --live",
    });
  }
  if (policy.strictResponder) {
    const unverified = (proofResult.cases || []).filter((kase) => kase.metrics?.some((metric) => metric.metric === "responder_identity" && (metric.status === "warning" || metric.status === "fail")));
    if (unverified.length) {
      blockers.push({
        code: "GELIVE006",
        what: `responder identity not verified for ${unverified.length} case(s) and the gate requires strict identity`,
        retryable: false,
        fix: "ge prove --live --strict-responder",
      });
    }
  }
  if (!policy.allowBaselineDrift && proofResult.conformance?.baseline === "drifted") {
    blockers.push({
      code: null,
      what: `live behavior drifted from baseline in ${proofResult.conformance.drift.length} case(s)`,
      retryable: false,
      fix: "ge prove --live --update-baseline",
    });
  }
  return {
    gate: "live-proof",
    required: policy.required,
    passed: blockers.length === 0,
    blockers,
    artifacts: [proofResult.artifacts?.proofResult, proofResult.artifacts?.matrix].filter(Boolean),
    next: blockers.length ? blockers[0].fix || "ge prove --live" : "ge bench",
  };
}
