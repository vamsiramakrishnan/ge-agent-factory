// Bench contract: percentile/budget math is exact, guards are hard caps,
// cassette replay produces the recorded latencies deterministically, and the
// k6 export is snapshot-stable.
import { test, expect } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { percentile, percentiles, histogram } from "./histogram.mjs";
import { evaluateBudgets, DEFAULT_LIVE_BUDGETS, DEFAULT_BENCH_GUARDS } from "./budgets.mjs";
import { runBench, applyBenchGuards } from "./runner.mjs";
import { renderK6Script } from "./k6.mjs";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "..", "live", "fixtures");
const SUCCESS = join(FIXTURES, "success.ndjson");
const SLOW = join(FIXTURES, "slow-ttft.ndjson");

test("percentile: nearest-rank, deterministic, real samples only", () => {
  const samples = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  expect(percentile(samples, 50)).toBe(500);
  expect(percentile(samples, 95)).toBe(1000);
  expect(percentile(samples, 99)).toBe(1000);
  expect(percentile([42], 95)).toBe(42);
  expect(percentile([], 95)).toBe(null);
  // Never invents a value between samples.
  expect([100, 200]).toContain(percentile([200, 100], 50));
});

test("percentiles and histogram shapes", () => {
  const p = percentiles([1, 2, 3]);
  expect(p).toEqual({ count: 3, p50: 2, p95: 3, p99: 3 });
  const buckets = histogram([100, 300, 2600, 40000]);
  expect(buckets[0].count).toBe(1); // <250
  expect(buckets[1].count).toBe(1); // 250-500
  expect(buckets.at(-1).count).toBe(1); // open-ended
  expect(buckets.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(4);
});

test("budget evaluation: pass, fail, and responder budgets only when asserted", () => {
  const samples = { ttftMs: [400, 600], fullResponseMs: [1200, 2000], interChunkGapMs: [100, 200] };
  const pass = evaluateBudgets({ samples, counts: { turns: 2, errors: 0, sessions: 2, responderUnknown: 2, responderMismatch: 0 }, budgets: DEFAULT_LIVE_BUDGETS, responderAsserted: false });
  expect(pass.passed).toBe(true); // unknown responders don't count when nothing was asserted
  const strict = evaluateBudgets({ samples, counts: { turns: 2, errors: 0, sessions: 2, responderUnknown: 2, responderMismatch: 0 }, budgets: DEFAULT_LIVE_BUDGETS, responderAsserted: true });
  expect(strict.passed).toBe(false);
  expect(strict.verdicts.find((verdict) => verdict.budget === "responderUnknownRateMax").ok).toBe(false);
  const slow = evaluateBudgets({ samples: { ...samples, ttftMs: [4000, 5000] }, counts: { turns: 2, errors: 0, sessions: 2, responderUnknown: 0, responderMismatch: 0 }, budgets: DEFAULT_LIVE_BUDGETS });
  expect(slow.verdicts.find((verdict) => verdict.budget === "ttftMsP95").ok).toBe(false);
});

test("guards are hard caps that throw GELIVE008", () => {
  expect(() => applyBenchGuards({ sessions: 500, turnsPerSession: 2, concurrency: [1], guards: DEFAULT_BENCH_GUARDS })).toThrow(/guard rails/);
  let thrown;
  try {
    applyBenchGuards({ sessions: 5, turnsPerSession: 2, concurrency: [64], guards: DEFAULT_BENCH_GUARDS });
  } catch (error) {
    thrown = error;
  }
  expect(thrown.code).toBe("GELIVE008");
  // Within limits: no throw.
  applyBenchGuards({ sessions: 5, turnsPerSession: 2, concurrency: [1, 2, 4], guards: DEFAULT_BENCH_GUARDS });
});

test("cassette bench replays recorded latencies deterministically and passes default budgets", async () => {
  const outRoot = mkdtempSync(join(tmpdir(), "ge-bench-"));
  const result = await runBench({}, { cassette: SUCCESS, sessions: 4, turnsPerSession: 2, concurrency: [1, 2], targetAgent: "agent-benefits", outRoot });
  expect(result.status).toBe("passed");
  expect(result.counts.sessions).toBe(8); // 4 sessions × 2 concurrency levels
  expect(result.counts.turns).toBe(16);
  // The recorded offsets, verbatim: turn 0 ttft 412, turn 1 ttft 380 → the
  // 16 samples are eight of each.
  expect(result.percentiles.ttftMs.p50).toBe(380);
  expect(result.percentiles.ttftMs.p95).toBe(412);
  expect(result.errors.total).toBe(0);
  expect(result.verdict.passed).toBe(true);
  // Deterministic across runs.
  const again = await runBench({}, { cassette: SUCCESS, sessions: 4, turnsPerSession: 2, concurrency: [1, 2], targetAgent: "agent-benefits", outRoot });
  expect(again.percentiles).toEqual(result.percentiles);
});

test("slow cassette fails the ttft and stall budgets with named blockers", async () => {
  const outRoot = mkdtempSync(join(tmpdir(), "ge-bench-"));
  const result = await runBench({}, { cassette: SLOW, sessions: 2, turnsPerSession: 1, concurrency: [1], outRoot });
  expect(result.status).toBe("failed");
  const failing = result.budgetVerdicts.filter((verdict) => !verdict.ok).map((verdict) => verdict.budget);
  expect(failing).toContain("ttftMsP95"); // recorded ttft 4200 > 2500
  expect(failing).toContain("interChunkGapMsP99"); // recorded stall 3500 > 3000
  expect(result.verdict.blockers[0].code).toBe("GELIVE008");
});

test("k6 export is snapshot-stable and self-documenting", () => {
  const script = renderK6Script({
    target: { url: "https://discoveryengine.googleapis.com/v1/projects/p/locations/global/collections/default_collection/engines/e/assistants/default_assistant:streamAssist" },
    sessions: 5,
    turnsPerSession: 2,
    turnTexts: ["hello"],
    budgets: DEFAULT_LIVE_BUDGETS,
  });
  expect(script).toContain("GOOGLE_OAUTH_ACCESS_TOKEN");
  expect(script).toContain(":streamAssist");
  expect(script).toContain('http_req_duration: ["p(95)<15000"]');
  expect(script).toContain("iterations: 5");
  // Stable output for the same input.
  expect(renderK6Script({ target: { url: "https://x" }, sessions: 1, turnsPerSession: 1, turnTexts: ["a"], budgets: {} })).toBe(renderK6Script({ target: { url: "https://x" }, sessions: 1, turnsPerSession: 1, turnTexts: ["a"], budgets: {} }));
});
