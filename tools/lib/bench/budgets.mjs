// Live budgets — the NFR side of the contract, evaluated as a verdict.
//
// Budgets live in .ge.json under `live.budgets` (extra keys there are
// sanctioned — additionalProperties is true by design) and can be overridden
// per run. Bench output is pass/fail against these numbers first; charts are
// derived, not the deliverable.
import { readJson } from "@ge/std/json-io";
import { STATE_PATHS } from "../state-paths.mjs";
import { percentile } from "./histogram.mjs";

export const DEFAULT_LIVE_BUDGETS = {
  ttftMsP95: 2500,
  fullResponseMsP95: 15000,
  interChunkGapMsP99: 3000,
  errorRateMax: 0.01,
  responderUnknownRateMax: 0,
  responderMismatchRateMax: 0,
};

// Cost guards — hard caps a bench run refuses to exceed, so a typo can't buy
// an accidental load test against a paid surface.
export const DEFAULT_BENCH_GUARDS = {
  maxSessions: 25,
  maxTurnsPerSession: 5,
  maxConcurrency: 8,
  maxDurationSeconds: 120,
};

export function loadLiveBudgets({ configFile = STATE_PATHS.config, overrides = {} } = {}) {
  const file = readJson(configFile, {}) || {};
  return { ...DEFAULT_LIVE_BUDGETS, ...(file.live?.budgets || {}), ...overrides };
}

export function loadBenchGuards({ configFile = STATE_PATHS.config, overrides = {} } = {}) {
  const file = readJson(configFile, {}) || {};
  return { ...DEFAULT_BENCH_GUARDS, ...(file.live?.bench || {}), ...overrides };
}

// samples: { ttftMs: number[], fullResponseMs: number[], interChunkGapMs: number[] }
// counts:  { turns, errors, responderUnknown, responderMismatch, sessions }
// Responder-rate budgets only apply when identity was actually asserted
// (an expected agent was configured) — a not_applicable run can't fail them.
export function evaluateBudgets({ samples, counts, budgets, responderAsserted = false }) {
  const verdicts = [];
  const add = (budget, observed, limit, { lowerIsBetter = true } = {}) => {
    if (observed === null || limit === null || limit === undefined) {
      verdicts.push({ budget, observed, limit: limit ?? null, ok: true, skipped: true });
      return;
    }
    verdicts.push({ budget, observed, limit, ok: lowerIsBetter ? observed <= limit : observed >= limit, skipped: false });
  };
  add("ttftMsP95", percentile(samples.ttftMs, 95), budgets.ttftMsP95);
  add("fullResponseMsP95", percentile(samples.fullResponseMs, 95), budgets.fullResponseMsP95);
  add("interChunkGapMsP99", percentile(samples.interChunkGapMs, 99), budgets.interChunkGapMsP99);
  const errorRate = counts.turns ? counts.errors / counts.turns : 0;
  add("errorRateMax", Number(errorRate.toFixed(4)), budgets.errorRateMax);
  if (responderAsserted) {
    const unknownRate = counts.sessions ? counts.responderUnknown / counts.sessions : 0;
    const mismatchRate = counts.sessions ? counts.responderMismatch / counts.sessions : 0;
    add("responderUnknownRateMax", Number(unknownRate.toFixed(4)), budgets.responderUnknownRateMax);
    add("responderMismatchRateMax", Number(mismatchRate.toFixed(4)), budgets.responderMismatchRateMax);
  }
  return { verdicts, passed: verdicts.every((verdict) => verdict.ok) };
}
