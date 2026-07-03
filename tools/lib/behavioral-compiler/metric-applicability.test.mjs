// Metric applicability table: complete row set, closed vocabulary, and a
// markdown rendering with exactly one row per metric.
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { METRIC_APPLICABILITY, writeMetricApplicability, renderMetricApplicabilityMarkdown } from "./metric-applicability.mjs";

const ANSWERS = new Set(["yes", "no", "conditional"]);

test("covers the agreed metric set with valid rail answers", () => {
  const metrics = METRIC_APPLICABILITY.map((row) => row.metric);
  expect(metrics).toEqual([
    "exact tool trajectory",
    "response match",
    "final response LLM judge",
    "hallucination",
    "safety",
    "multi-turn task success",
    "multi-turn trajectory quality",
    "latency budgets",
    "responder identity",
    "session threading",
  ]);
  for (const row of METRIC_APPLICABILITY) {
    expect(ANSWERS.has(row.localAdk)).toBe(true);
    expect(ANSWERS.has(row.liveStreamAssist)).toBe(true);
    expect(row.family.length).toBeGreaterThan(0);
    expect(row.notes.length).toBeGreaterThan(0);
  }
});

test("GE-owned operational metrics are live-only", () => {
  for (const metric of ["latency budgets", "responder identity", "session threading"]) {
    const row = METRIC_APPLICABILITY.find((entry) => entry.metric === metric);
    expect(row.localAdk).toBe("no");
    expect(row.liveStreamAssist).toBe("yes");
  }
});

test("markdown renders a header plus one row per metric", () => {
  const markdown = renderMetricApplicabilityMarkdown();
  const rows = markdown.trim().split("\n");
  expect(rows).toHaveLength(2 + METRIC_APPLICABILITY.length);
  for (const row of METRIC_APPLICABILITY) expect(markdown).toContain(`| ${row.metric} |`);
});

test("writeMetricApplicability persists { metrics }", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-metric-applicability-"));
  const path = join(dir, "metric-applicability.json");
  const receipt = writeMetricApplicability(path);
  expect(receipt.metricCount).toBe(METRIC_APPLICABILITY.length);
  const loaded = JSON.parse(readFileSync(path, "utf8"));
  expect(loaded.metrics).toEqual(METRIC_APPLICABILITY);
});
