// Known-value contracts for the advisory statistics: Wilson bounds, seeded
// bootstrap determinism, the unbiased pass@k estimator, and flake detection.
import { test, expect } from "bun:test";
import { wilsonInterval, bootstrapCI, passAtK, flakiness, mulberry32 } from "./eval-stats.mjs";
import { isDxError } from "../errors/dx-error.mjs";

test("wilsonInterval(9, 10): the textbook 95% bounds", () => {
  const { low, high, rate } = wilsonInterval(9, 10);
  expect(rate).toBe(0.9);
  expect(low).toBeCloseTo(0.596, 3);
  expect(high).toBeCloseTo(0.982, 3);
});

test("wilsonInterval extremes: perfect and zero runs never touch impossible mass", () => {
  const perfect = wilsonInterval(10, 10);
  expect(perfect.high).toBeCloseTo(1, 9);
  expect(perfect.low).toBeGreaterThan(0.7); // 10/10 is NOT proof of 1.0
  const zero = wilsonInterval(0, 10);
  expect(zero.low).toBeCloseTo(0, 9);
  expect(zero.high).toBeLessThan(0.3);
  expect(wilsonInterval(0, 0)).toEqual({ low: 0, high: 1, rate: 0 });
});

test("mulberry32 is a deterministic PRNG in [0, 1)", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  const seqA = [a(), a(), a()];
  const seqB = [b(), b(), b()];
  expect(seqA).toEqual(seqB);
  for (const value of seqA) {
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  }
  expect(mulberry32(43)()).not.toBe(mulberry32(42)());
});

test("bootstrapCI: fixed seed → byte-identical interval; bounds bracket the statistic", () => {
  const values = [0.2, 0.5, 0.9, 1, 0.4, 0.7, 0.65, 0.35];
  const first = bootstrapCI(values, { seed: 7 });
  const second = bootstrapCI(values, { seed: 7 });
  expect(first).toEqual(second);
  expect(first.iterations).toBe(2000);
  expect(first.low).toBeLessThanOrEqual(first.statistic);
  expect(first.high).toBeGreaterThanOrEqual(first.statistic);
  expect(first.statistic).toBeCloseTo(0.5875, 10);
  // A different seed may move the percentile cut, but stays a valid interval.
  const other = bootstrapCI(values, { seed: 8 });
  expect(other.low).toBeLessThanOrEqual(other.high);
});

test("bootstrapCI supports custom statistics and rejects empty samples", () => {
  const max = (values) => Math.max(...values);
  const result = bootstrapCI([1, 2, 3], { seed: 1, iterations: 200, statistic: max });
  expect(result.statistic).toBe(3);
  expect(result.high).toBe(3);
  let thrown;
  try {
    bootstrapCI([]);
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
});

test("passAtK: known values from the unbiased estimator", () => {
  // one case, 2 passes in 4 runs: pass@1 = 1 - C(2,1)/C(4,1) = 0.5
  expect(passAtK([[true, false, true, false]], 1)).toBeCloseTo(0.5, 12);
  // pass@2 = 1 - C(2,2)/C(4,2) = 1 - 1/6
  expect(passAtK([[true, false, true, false]], 2)).toBeCloseTo(1 - 1 / 6, 12);
  expect(passAtK([[false, false]], 2)).toBe(0);
  expect(passAtK([[true, true]], 1)).toBe(1);
  // averaged across cases; k larger than the run count clamps to the runs.
  expect(passAtK([[true, false], [false, false]], 5)).toBeCloseTo(0.5, 12);
  expect(passAtK([], 1)).toBe(0);
});

test("flakiness reports only cases whose repeated verdicts disagree", () => {
  const report = flakiness({
    "case-stable-pass": [true, true, true],
    "case-flaky": [true, false, true],
    "case-stable-fail": [false, false],
    "case-single-run": [true],
    "case-also-flaky": [false, true],
  });
  expect(report.map((entry) => entry.caseId)).toEqual(["case-also-flaky", "case-flaky"]);
  expect(report[1]).toEqual({ caseId: "case-flaky", runs: 3, passes: 2, passRate: 2 / 3 });
  expect(flakiness({})).toEqual([]);
});
