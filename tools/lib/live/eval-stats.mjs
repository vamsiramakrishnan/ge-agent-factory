// Statistical treatment for live-proof results — advisory, never gating.
//
// A pass rate over n cases is a point estimate; these helpers say how much
// to trust it: Wilson score intervals for binomial rates, a seeded bootstrap
// for arbitrary statistics, pass@k for repeated-run suites, and a flakiness
// detector for cases whose repeated verdicts disagree.
//
// Determinism contract: the bootstrap uses a locally-implemented mulberry32
// PRNG seeded by the caller — same seed, byte-identical intervals. Nothing
// here reads a clock or global randomness.
import { DxError } from "../errors/dx-error.mjs";

/**
 * Wilson score interval for a binomial proportion. Returns { low, high,
 * rate }. n = 0 yields the vacuous interval { low: 0, high: 1, rate: 0 } —
 * no evidence constrains nothing.
 */
export function wilsonInterval(passes, n, z = 1.96) {
  if (!Number.isFinite(n) || n <= 0) return { low: 0, high: 1, rate: 0 };
  const p = passes / n;
  const z2 = z * z;
  const denominator = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denominator;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denominator;
  return { low: Math.max(0, center - margin), high: Math.min(1, center + margin), rate: p };
}

/**
 * mulberry32 — tiny seeded PRNG (implemented locally: tools/lib must not
 * import from apps/*). Returns a () => float in [0, 1).
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

/**
 * Seeded bootstrap confidence interval (percentile method, 95%). Resamples
 * `values` with replacement `iterations` times, applies `statistic` (default
 * mean), and returns { low, high, statistic, iterations, seed }. Same seed →
 * byte-identical result. Empty input throws — there is nothing to resample.
 */
export function bootstrapCI(values, { iterations = 2000, seed = 42, statistic = mean } = {}) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new DxError("bootstrapCI needs at least one value", {
      where: "eval-stats.bootstrapCI",
      why: "an empty sample cannot be resampled",
      fix: "guard the call site: only compute intervals once at least one case has run",
    });
  }
  const random = mulberry32(seed);
  const stats = new Array(iterations);
  const sample = new Array(values.length);
  for (let i = 0; i < iterations; i += 1) {
    for (let j = 0; j < values.length; j += 1) sample[j] = values[Math.floor(random() * values.length)];
    stats[i] = statistic(sample);
  }
  stats.sort((a, b) => a - b);
  const at = (q) => stats[Math.min(iterations - 1, Math.max(0, Math.floor(q * (iterations - 1))))];
  return { low: at(0.025), high: at(0.975), statistic: statistic(values), iterations, seed };
}

// n-choose-k with early exit — sized for run counts, not combinatorics.
function choose(n, k) {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = (result * (n - k + i)) / i;
  return result;
}

/**
 * Unbiased pass@k over repeated runs (the Codex estimator): for each case
 * with n runs and c passes, P(at least one pass in k draws) =
 * 1 − C(n−c, k)/C(n, k); the suite value is the mean over cases.
 * `passesPerCase` is an array of boolean arrays (one inner array per case,
 * one boolean per run). Cases with fewer than k runs use k = runs.
 */
export function passAtK(passesPerCase, k) {
  const perCase = (passesPerCase || []).filter((runs) => Array.isArray(runs) && runs.length > 0);
  if (!perCase.length) return 0;
  const estimates = perCase.map((runs) => {
    const n = runs.length;
    const c = runs.filter(Boolean).length;
    const kEff = Math.min(k, n);
    if (n - c < kEff) return 1;
    return 1 - choose(n - c, kEff) / choose(n, kEff);
  });
  return mean(estimates);
}

/**
 * Flakiness report: which cases' repeated verdicts disagree. Input is
 * { [caseId]: boolean[] } (verdict per run); output is a caseId-sorted array
 * of { caseId, runs, passes, passRate } — only the disagreeing cases.
 */
export function flakiness(runsPerCase) {
  const flaky = [];
  for (const [caseId, runs] of Object.entries(runsPerCase || {})) {
    if (!Array.isArray(runs) || runs.length < 2) continue;
    const passes = runs.filter(Boolean).length;
    if (passes === 0 || passes === runs.length) continue;
    flaky.push({ caseId, runs: runs.length, passes, passRate: passes / runs.length });
  }
  return flaky.sort((a, b) => (a.caseId < b.caseId ? -1 : a.caseId > b.caseId ? 1 : 0));
}
