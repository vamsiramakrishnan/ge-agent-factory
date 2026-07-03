import { describe, expect, test } from "bun:test";

import { makeRng } from "./data-recipe.mjs";
import {
  rngFor,
  normal,
  logNormal,
  poisson,
  pareto,
  triangular,
  mixture,
  zipfWeights,
  weightedChoice,
  businessHoursTimestamp,
  eventSequence,
} from "./synth-distributions.mjs";

function samples(n, fn) {
  const out = [];
  for (let i = 0; i < n; i += 1) out.push(fn());
  return out;
}

function mean(values) {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

describe("synth-distributions: determinism", () => {
  test("same seed produces identical sample streams for every sampler", () => {
    const draw = (seed) => {
      const rng = makeRng(seed);
      return [
        samples(50, () => normal(rng, { mean: 10, stdDev: 2 })),
        samples(50, () => logNormal(rng, { median: 2500, sigma: 1.1 })),
        samples(50, () => poisson(rng, 4)),
        samples(50, () => pareto(rng, { xMin: 1, alpha: 2 })),
        samples(50, () => triangular(rng, { min: 0, mode: 25, max: 100 })),
        samples(50, () => weightedChoice(rng, ["a", "b", "c"], zipfWeights(3, 1))),
        eventSequence(rng, { startIso: "2025-01-01T00:00:00Z", endIso: "2025-12-31T00:00:00Z", steps: 4 }),
        businessHoursTimestamp(rng, { startIso: "2025-01-01T00:00:00Z", endIso: "2025-12-31T00:00:00Z" }),
      ];
    };
    expect(JSON.stringify(draw(1234))).toBe(JSON.stringify(draw(1234)));
    expect(JSON.stringify(draw(1234))).not.toBe(JSON.stringify(draw(4321)));
  });

  test("rngFor derives independent streams per label", () => {
    const a = rngFor(42, "incidents", "priority");
    const b = rngFor(42, "incidents", "priority");
    const c = rngFor(42, "incidents", "state");
    const streamA = samples(10, a);
    expect(streamA).toEqual(samples(10, b));
    expect(streamA).not.toEqual(samples(10, c));
  });
});

describe("synth-distributions: statistical sanity", () => {
  test("logNormal median lands near the configured median", () => {
    const rng = makeRng(7);
    const values = samples(2000, () => logNormal(rng, { median: 2500, sigma: 1.1 }));
    const m = median(values);
    expect(m).toBeGreaterThan(1800);
    expect(m).toBeLessThan(3400);
    for (const v of values) expect(v).toBeGreaterThan(0);
  });

  test("normal mean/spread are in the expected ballpark", () => {
    const rng = makeRng(11);
    const values = samples(2000, () => normal(rng, { mean: 100, stdDev: 15 }));
    expect(Math.abs(mean(values) - 100)).toBeLessThan(2);
  });

  test("poisson mean approximates lambda (Knuth and normal-approx branches)", () => {
    const rngSmall = makeRng(13);
    const small = samples(2000, () => poisson(rngSmall, 6));
    expect(Math.abs(mean(small) - 6)).toBeLessThan(0.5);
    for (const v of small) expect(Number.isInteger(v)).toBe(true);

    const rngLarge = makeRng(17);
    const large = samples(2000, () => poisson(rngLarge, 100));
    expect(Math.abs(mean(large) - 100)).toBeLessThan(3);
  });

  test("zipf head is heavier than the tail (weights and realized draws)", () => {
    const weights = zipfWeights(6, 1.1);
    expect(weights.length).toBe(6);
    expect(weights[0]).toBeGreaterThan(weights[5]);
    expect(Math.abs(weights.reduce((s, w) => s + w, 0) - 1)).toBeLessThan(1e-9);

    const rng = makeRng(19);
    const items = ["s1", "s2", "s3", "s4", "s5", "s6"];
    const counts = Object.fromEntries(items.map((i) => [i, 0]));
    for (let i = 0; i < 2000; i += 1) counts[weightedChoice(rng, items, weights)] += 1;
    expect(counts.s1).toBeGreaterThan(counts.s6 * 2);
  });

  test("pareto respects the floor, triangular respects the bounds", () => {
    const rng = makeRng(23);
    for (const v of samples(500, () => pareto(rng, { xMin: 10, alpha: 1.5 }))) {
      expect(v).toBeGreaterThanOrEqual(10);
    }
    for (const v of samples(500, () => triangular(rng, { min: 5, mode: 10, max: 50 }))) {
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(50);
    }
  });

  test("mixture draws from its components by weight", () => {
    const rng = makeRng(29);
    const values = samples(1000, () => mixture(rng, [
      { weight: 0.9, sample: () => 1 },
      { weight: 0.1, sample: () => 1000 },
    ]));
    const big = values.filter((v) => v === 1000).length;
    expect(big).toBeGreaterThan(30);
    expect(big).toBeLessThan(250);
  });
});

describe("synth-distributions: temporal helpers", () => {
  test("eventSequence is strictly increasing and starts inside the window", () => {
    const rng = makeRng(31);
    const seq = eventSequence(rng, { startIso: "2025-03-01T00:00:00Z", endIso: "2025-09-01T00:00:00Z", steps: 6 });
    expect(seq.length).toBe(6);
    expect(Date.parse(seq[0])).toBeGreaterThanOrEqual(Date.parse("2025-03-01T00:00:00Z"));
    for (let i = 1; i < seq.length; i += 1) {
      expect(Date.parse(seq[i])).toBeGreaterThan(Date.parse(seq[i - 1]));
    }
  });

  test("eventSequence accepts an array of step labels and returns that many stamps", () => {
    const rng = makeRng(37);
    const seq = eventSequence(rng, {
      startIso: "2025-01-01T00:00:00Z",
      endIso: "2025-02-01T00:00:00Z",
      steps: ["created", "updated", "resolved", "closed"],
    });
    expect(seq.length).toBe(4);
  });

  test("businessHoursTimestamp biases toward weekday business hours and stays in range", () => {
    const rng = makeRng(41);
    const start = Date.parse("2025-01-01T00:00:00Z");
    const end = Date.parse("2025-12-31T00:00:00Z");
    let weekdayBusiness = 0;
    const n = 400;
    for (let i = 0; i < n; i += 1) {
      const iso = businessHoursTimestamp(rng, { startIso: "2025-01-01T00:00:00Z", endIso: "2025-12-31T00:00:00Z" });
      const ts = Date.parse(iso);
      expect(ts).toBeGreaterThanOrEqual(start);
      expect(ts).toBeLessThanOrEqual(end);
      const d = new Date(ts);
      const dow = d.getUTCDay();
      const hour = d.getUTCHours();
      if (dow >= 1 && dow <= 5 && hour >= 7 && hour <= 19) weekdayBusiness += 1;
    }
    // Uniform sampling would land here ~38% of the time; the bias should dominate.
    expect(weekdayBusiness / n).toBeGreaterThan(0.6);
  });

  test("invalid ranges throw instead of silently producing garbage", () => {
    const rng = makeRng(43);
    expect(() => eventSequence(rng, { startIso: "2025-06-01T00:00:00Z", endIso: "2025-01-01T00:00:00Z", steps: 2 })).toThrow();
    expect(() => businessHoursTimestamp(rng, { startIso: "nope", endIso: "2025-01-01T00:00:00Z" })).toThrow();
  });
});
