// Unit tests for the harness-as-judge helpers: input normalization (bare case
// arrays, live transcripts) and the deterministic metric aggregation that
// gates against the standard thresholds.
import { describe, expect, test } from "bun:test";
import { aggregateJudgeMetrics, normalizeJudgeCases } from "./harness.mjs";

describe("normalizeJudgeCases", () => {
  test("accepts a bare array of prompt/response cases", () => {
    const cases = normalizeJudgeCases([
      { id: "c1", prompt: "Summarize aging", response: "30d bucket is $12k", toolCalls: ["query_invoices"] },
      { prompt: "Second", output: "answer two" },
      { note: "no prompt or response — dropped" },
    ]);
    expect(cases).toHaveLength(2);
    expect(cases[0]).toEqual({ id: "c1", prompt: "Summarize aging", response: "30d bucket is $12k", toolCalls: ["query_invoices"] });
    expect(cases[1].id).toBe("case-2");
    expect(cases[1].response).toBe("answer two");
  });

  test("accepts a live transcript's turns", () => {
    const cases = normalizeJudgeCases({
      turns: [
        { index: 0, user: { text: "hello" }, assistant: { text: "hi there" }, invocationTools: [{ name: "lookup_policy" }] },
        { index: 1, user: { text: "and totals?" }, assistant: { text: "totals are ..." } },
      ],
    });
    expect(cases).toHaveLength(2);
    expect(cases[0]).toEqual({ id: "turn-1", prompt: "hello", response: "hi there", toolCalls: ["lookup_policy"] });
    expect(cases[1].id).toBe("turn-2");
  });

  test("returns [] for unrecognized shapes", () => {
    expect(normalizeJudgeCases(null)).toEqual([]);
    expect(normalizeJudgeCases({ foo: 1 })).toEqual([]);
  });
});

describe("aggregateJudgeMetrics", () => {
  const thresholds = { toolUseThreshold: 0.8, finalResponseThreshold: 0.7 };

  test("means per metric, thresholds applied, behavior judge held to the stricter threshold", () => {
    const metrics = aggregateJudgeMetrics([
      { tool_use_quality: 1, final_response_quality: 0.5, behavior_contract_score: 0.75 },
      { tool_use_quality: 0.8, final_response_quality: 1, behavior_contract_score: 0.9 },
    ], thresholds);
    expect(metrics.tool_use_quality).toEqual({ meanScore: 0.9, threshold: 0.8, pass: true, cases: 2 });
    expect(metrics.final_response_quality).toEqual({ meanScore: 0.75, threshold: 0.7, pass: true, cases: 2 });
    expect(metrics.ge_behavior_contract_judge.threshold).toBe(0.7);
    expect(metrics.ge_behavior_contract_judge.pass).toBe(true);
  });

  test("no cases means no pass", () => {
    const metrics = aggregateJudgeMetrics([], thresholds);
    expect(metrics.tool_use_quality.pass).toBe(false);
    expect(metrics.tool_use_quality.cases).toBe(0);
  });
});
