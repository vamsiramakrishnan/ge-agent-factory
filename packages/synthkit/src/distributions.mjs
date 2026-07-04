/**
 * distributions.mjs — seeded statistical distributions for synthetic data.
 * (Formerly apps/factory/scripts/lib/synth-distributions.mjs.)
 *
 * Zero-dependency companion to recipe.mjs. Every sampler takes an explicit
 * `rng` (a mulberry32 closure from `makeRng` / `rngFor`) so identical (seed) =>
 * identical byte output; nothing here reads Math.random(), Date.now(), or the
 * wall clock. Date math only converts already-drawn epoch milliseconds to ISO
 * strings, which is pure.
 *
 * Samplers: normal (Box-Muller), logNormal, poisson (Knuth / normal approx),
 * pareto, triangular, mixture, zipfWeights + weightedChoice.
 * Temporal helpers: businessHoursTimestamp (weekday/business-hours biased) and
 * eventSequence (monotone lifecycle timestamps).
 */

import { makeRng } from "./recipe.mjs";

// FNV-1a, duplicated from recipe.mjs (not exported there) so per-label
// sub-streams fold the same way across both libraries.
function hashLabel(value) {
  let hash = 0x811c9dc5;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Derive an independent deterministic rng for (seed, ...labels). */
export function rngFor(seed, ...labels) {
  return makeRng((Number(seed) >>> 0) ^ hashLabel(labels.join("|")));
}

// ── continuous distributions ──────────────────────────────────────────────────

/** Standard/parameterized normal via Box-Muller. `1 - rng()` keeps u1 in (0,1] so log() is finite. */
export function normal(rng, { mean = 0, stdDev = 1 } = {}) {
  const u1 = 1 - rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}

/**
 * Log-normal sample. Accepts either `mu` (log-space mean) or the more intuitive
 * `median` (median = exp(mu)); `sigma` is log-space standard deviation.
 */
export function logNormal(rng, { mu, median, sigma = 1 } = {}) {
  const resolvedMu = mu !== undefined ? mu : Math.log(median !== undefined ? median : Math.E);
  return Math.exp(normal(rng, { mean: resolvedMu, stdDev: sigma }));
}

/**
 * Poisson sample. Knuth's product method for small lambda; for large lambda the
 * product underflows/slows, so switch to the standard normal approximation.
 */
export function poisson(rng, lambda) {
  const rate = Number(lambda);
  if (!(rate > 0)) return 0;
  if (rate < 30) {
    const threshold = Math.exp(-rate);
    let k = 0;
    let p = 1;
    do {
      k += 1;
      p *= rng();
    } while (p > threshold);
    return k - 1;
  }
  return Math.max(0, Math.round(normal(rng, { mean: rate, stdDev: Math.sqrt(rate) })));
}

/** Pareto (heavy-tailed) sample; xMin is the scale floor, alpha the tail index. */
export function pareto(rng, { xMin = 1, alpha = 1.5 } = {}) {
  // rng() in [0,1) => 1-rng() in (0,1], so the power and division are finite.
  return xMin / Math.pow(1 - rng(), 1 / alpha);
}

/** Triangular sample on [min, max] with peak at mode (inverse-CDF method). */
export function triangular(rng, { min = 0, mode, max = 1 } = {}) {
  const peak = mode === undefined ? (min + max) / 2 : mode;
  if (!(max > min)) return min;
  const u = rng();
  const cut = (peak - min) / (max - min);
  if (u < cut) return min + Math.sqrt(u * (max - min) * (peak - min));
  return max - Math.sqrt((1 - u) * (max - min) * (max - peak));
}

/**
 * Mixture model: components are [{ weight, sample(rng) }]. One component is
 * chosen by weight, then its sampler is called with the same rng.
 */
export function mixture(rng, components) {
  if (!Array.isArray(components) || components.length === 0) {
    throw new Error("mixture: at least one { weight, sample } component is required");
  }
  const weights = components.map((c) => Number(c.weight) || 0);
  const component = weightedChoice(rng, components, weights);
  if (typeof component.sample !== "function") {
    throw new Error("mixture: each component needs a sample(rng) function");
  }
  return component.sample(rng);
}

// ── discrete / categorical ───────────────────────────────────────────────────

/** Zipf weights for ranks 1..n with exponent s, normalized to sum 1 (head-heavy). */
export function zipfWeights(n, s = 1) {
  const count = Math.max(0, Math.floor(Number(n) || 0));
  const raw = [];
  let total = 0;
  for (let k = 1; k <= count; k += 1) {
    const w = 1 / Math.pow(k, s);
    raw.push(w);
    total += w;
  }
  return raw.map((w) => w / total);
}

/** Pick one of `items` proportionally to `weights` (same length, nonnegative). */
export function weightedChoice(rng, items, weights) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("weightedChoice: items must be a non-empty array");
  }
  if (!Array.isArray(weights) || weights.length !== items.length) {
    throw new Error("weightedChoice: weights must match items length");
  }
  const total = weights.reduce((sum, w) => sum + Math.max(0, Number(w) || 0), 0);
  if (!(total > 0)) return items[0];
  let target = rng() * total;
  for (let i = 0; i < items.length; i += 1) {
    target -= Math.max(0, Number(weights[i]) || 0);
    if (target < 0) return items[i];
  }
  return items[items.length - 1];
}

// ── temporal helpers ──────────────────────────────────────────────────────────

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const HOURS = Array.from({ length: 24 }, (_, h) => h);
// Business-hours bias: 9-17 dominate, shoulders (7-8, 18-19) light, night rare.
const HOUR_WEIGHTS = HOURS.map((h) => {
  if (h >= 9 && h <= 17) return 10;
  if (h === 7 || h === 8 || h === 18 || h === 19) return 3;
  return 1;
});

function parseRange(startIso, endIso, fn) {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error(`${fn}: invalid ISO range ${startIso}..${endIso}`);
  }
  return { start, end };
}

/**
 * Deterministic timestamp in [startIso, endIso] biased toward weekday business
 * hours in the given fixed UTC offset. Weekend days are re-drawn (bounded
 * attempts keep it deterministic); a small fraction survives so off-hours
 * activity still exists, like real systems.
 */
export function businessHoursTimestamp(rng, { startIso, endIso, timezoneOffsetHours = 0 } = {}) {
  const { start, end } = parseRange(startIso, endIso, "businessHoursTimestamp");
  const tzMs = Number(timezoneOffsetHours) * HOUR_MS;
  let localMidnight = 0;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const local = start + rng() * (end - start) + tzMs;
    localMidnight = local - (local % DAY_MS);
    const dow = new Date(localMidnight).getUTCDay();
    if (dow >= 1 && dow <= 5) break;
    if (rng() < 0.15) break;
  }
  const hour = weightedChoice(rng, HOURS, HOUR_WEIGHTS);
  const minute = Math.floor(rng() * 60);
  const second = Math.floor(rng() * 60);
  const utc = localMidnight + hour * HOUR_MS + minute * 60_000 + second * 1000 - tzMs;
  return new Date(Math.min(Math.max(utc, start), end)).toISOString();
}

/**
 * Monotonically increasing ISO timestamps for an entity lifecycle
 * (created -> updated -> resolved -> closed). `steps` is a count or an array
 * (its length is used). Draws are sorted, then bumped to at least one minute
 * apart so the sequence is strictly increasing; the bump means late steps can
 * exceed endIso by up to steps minutes in degenerate ranges — callers pass
 * multi-day windows in practice.
 */
export function eventSequence(rng, { startIso, endIso, steps } = {}) {
  const count = Array.isArray(steps) ? steps.length : Math.floor(Number(steps) || 0);
  if (count <= 0) return [];
  const { start, end } = parseRange(startIso, endIso, "eventSequence");
  const draws = [];
  for (let i = 0; i < count; i += 1) draws.push(rng());
  draws.sort((a, b) => a - b);
  const out = [];
  let prev = -Infinity;
  for (const u of draws) {
    let ts = Math.floor(start + u * (end - start));
    if (ts <= prev) ts = prev + 60_000;
    prev = ts;
    out.push(new Date(ts).toISOString());
  }
  return out;
}
