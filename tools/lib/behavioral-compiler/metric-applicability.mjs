// Which eval metrics apply on which rail.
//
// Two rails run the compiled suite: local ADK eval (full harness control,
// reference answers available) and live stream-assist (real deployment in
// the loop — GE owns transport-level facts the local rail can't even see).
// This table is the single answer to "can metric X grade rail Y", kept as
// data so both docs and gating code read the same source.
import { writeJson } from "@ge/std/json-io";

export const METRIC_APPLICABILITY = [
  {
    metric: "exact tool trajectory",
    family: "tool_use",
    localAdk: "yes",
    liveStreamAssist: "conditional",
    notes: "live grading needs tool-call metadata surfaced in the stream-assist transcript; text-only transcripts cannot be graded for trajectory",
  },
  {
    metric: "response match",
    family: "response_quality",
    localAdk: "yes",
    liveStreamAssist: "yes",
    notes: "applies on either rail whenever the case carries a reference answer",
  },
  {
    metric: "final response LLM judge",
    family: "response_quality",
    localAdk: "yes",
    liveStreamAssist: "yes",
    notes: "reference-free rubric judging works on any final response",
  },
  {
    metric: "hallucination",
    family: "grounding",
    localAdk: "yes",
    liveStreamAssist: "yes",
    notes: "needs grounding evidence (retrieved context or cited records) alongside the response on both rails",
  },
  {
    metric: "safety",
    family: "safety",
    localAdk: "yes",
    liveStreamAssist: "yes",
    notes: "response-only classification; rail-independent",
  },
  {
    metric: "multi-turn task success",
    family: "multi_turn",
    localAdk: "yes",
    liveStreamAssist: "yes",
    notes: "judged over the whole conversation; both rails replay the case's full turn list",
  },
  {
    metric: "multi-turn trajectory quality",
    family: "multi_turn",
    localAdk: "yes",
    liveStreamAssist: "yes",
    notes: "conversation-level rubric (clarifies, recovers, stays on task) applies on both rails",
  },
  {
    metric: "latency budgets",
    family: "operational",
    localAdk: "no",
    liveStreamAssist: "yes",
    notes: "GE-owned: only the live rail observes real transport and time-to-first-token",
  },
  {
    metric: "responder identity",
    family: "operational",
    localAdk: "no",
    liveStreamAssist: "yes",
    notes: "GE-owned: verifies the deployed agent (not a fallback/proxy) answered; meaningless locally",
  },
  {
    metric: "session threading",
    family: "operational",
    localAdk: "no",
    liveStreamAssist: "yes",
    notes: "GE-owned: checks turns land in one live session/thread; the local harness threads by construction",
  },
];

/** Persist the table as { metrics: [...] }. */
export function writeMetricApplicability(path) {
  writeJson(path, { metrics: METRIC_APPLICABILITY });
  return { path, metricCount: METRIC_APPLICABILITY.length };
}

/** Render the table as GitHub-flavored markdown (one row per metric). */
export function renderMetricApplicabilityMarkdown() {
  const lines = [
    "| Metric | Family | Local ADK | Live stream-assist | Notes |",
    "| --- | --- | --- | --- | --- |",
    ...METRIC_APPLICABILITY.map(
      (row) => `| ${row.metric} | ${row.family} | ${row.localAdk} | ${row.liveStreamAssist} | ${row.notes} |`,
    ),
  ];
  return lines.join("\n") + "\n";
}
