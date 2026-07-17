// Live-proof contract over cassettes: metric grid, baseline lifecycle
// (created → matched → drifted), cost caps, and seeded failures. All state
// goes through the injectable outRoot — never the checkout's .ge/.
import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  proveLive,
  tokenF1,
  timingClass,
  evaluateCaseMetrics,
  isAddressableCitationExpectation,
  baselineSummaryOf,
  diffBaseline,
  baselineDirFor,
} from "./prove-live.mjs";
import { evaluateLiveGate, DEFAULT_LIVE_GATE_POLICY } from "../gates/live-gate.mjs";

const STATE_ROOT = mkdtempSync(join(tmpdir(), "ge-prove-live-state-"));

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const SUCCESS = join(FIXTURES, "success.ndjson");
const MISMATCH = join(FIXTURES, "responder-mismatch.ndjson");

// An evalset whose references match the success cassette's recorded answers.
function writeSuccessEvalset(dir, { withExpectations = false } = {}) {
  const path = join(dir, "benefits.evalset.json");
  writeFileSync(path, JSON.stringify({
    evalSetId: "benefits-live",
    evalCases: [
      {
        evalId: "life-event-change",
        conversation: [
          {
            invocationId: "i-0",
            userContent: { role: "user", parts: [{ text: "Can I change my plan after having a child?" }] },
            finalResponse: { role: "model", parts: [{ text: "Yes — the birth of a child is a qualifying life event, so you can change your plan within the special enrollment window." }] },
          },
          {
            invocationId: "i-1",
            userContent: { role: "user", parts: [{ text: "How many days do I have?" }] },
            finalResponse: { role: "model", parts: [{ text: "You have 30 days from the date of birth to submit the change." }] },
          },
        ],
        ...(withExpectations ? { geMetadata: { expected: { mustCall: ["lookup_life_events"], mustCite: ["auth-qle-policy"] } } } : {}),
      },
    ],
  }, null, 2));
  return path;
}

test("tokenF1: identical text scores 1, disjoint scores 0, punctuation ignored", () => {
  expect(tokenF1("thirty days to submit", "thirty days to submit")).toBe(1);
  expect(tokenF1("alpha beta", "gamma delta")).toBe(0);
  expect(tokenF1("Thirty days!", "thirty days")).toBe(1);
  expect(tokenF1("", "anything")).toBe(0);
});

test("timingClass buckets ttft deterministically", () => {
  expect(timingClass(400)).toBe("fast");
  expect(timingClass(2500)).toBe("fast");
  expect(timingClass(4200)).toBe("slow");
  expect(timingClass(9000)).toBe("stalled");
  expect(timingClass(null)).toBe("no-text");
});

test("proveLive over the success cassette: pass, baseline created, artifacts written", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-prove-live-"));
  const evalset = writeSuccessEvalset(dir, { withExpectations: true });
  const result = await proveLive({}, { evalset, cassette: SUCCESS, targetAgent: "agent-benefits", outRoot: STATE_ROOT });
  expect(result.status).toBe("passed");
  expect(result.passRate).toBe(1);
  expect(result.cases[0].ok).toBe(true);
  expect(result.cases[0].conformance).toBe("created");
  expect(result.source.replay).toBe(true);
  const byMetric = Object.fromEntries(result.cases[0].metrics.map((metric) => [metric.metric, metric]));
  expect(byMetric.transport.status).toBe("pass");
  expect(byMetric.session_threading.status).toBe("pass");
  expect(byMetric.responder_identity.status).toBe("pass");
  expect(byMetric.response_match.status).toBe("pass");
  expect(byMetric.tool_trajectory.status).toBe("pass");
  expect(byMetric.grounding_citations.status).toBe("pass");
  // Artifacts land under the state root.
  expect(existsSync(join(STATE_ROOT, "proof", "live-proof-result.json"))).toBe(true);
  const matrix = JSON.parse(readFileSync(join(STATE_ROOT, "proof", "eval-matrix.json"), "utf8"));
  expect(matrix.rows[0].caseId).toBe("life-event-change");

  // Second run: baseline matches; tampering with it reports drift.
  const again = await proveLive({}, { evalset, cassette: SUCCESS, targetAgent: "agent-benefits", outRoot: STATE_ROOT });
  expect(again.cases[0].conformance).toBe("matched");
  expect(again.conformance.baseline).toBe("matched");
  const baselinePath = join(baselineDirFor("benefits-live", { root: join(STATE_ROOT, "live-baselines") }), "life-event-change.json");
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  baseline.invocationTools = ["something_else"];
  writeFileSync(baselinePath, JSON.stringify(baseline));
  const drifted = await proveLive({}, { evalset, cassette: SUCCESS, targetAgent: "agent-benefits", outRoot: STATE_ROOT });
  expect(drifted.conformance.baseline).toBe("drifted");
  expect(drifted.conformance.drift[0].drift.map((d) => d.field)).toContain("invocationTools");
  expect(drifted.verdict.passed).toBe(false); // drift blocks the verdict
  // --update-baseline accepts the new behavior.
  const updated = await proveLive({}, { evalset, cassette: SUCCESS, targetAgent: "agent-benefits", updateBaseline: true, outRoot: STATE_ROOT });
  expect(updated.conformance.baseline).toBe("created");
  expect(updated.verdict.passed).toBe(true);
});

test("maxTurns caps each case (cost guard)", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-prove-live-"));
  const evalset = writeSuccessEvalset(dir);
  const result = await proveLive({}, { evalset, cassette: SUCCESS, maxTurns: 1, outRoot: STATE_ROOT });
  expect(result.cases[0].turns).toBe(1);
});

test("responder mismatch cassette fails the case and the gate", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-prove-live-"));
  const evalset = join(dir, "one.evalset.json");
  writeFileSync(evalset, JSON.stringify({
    evalSetId: "mismatch-suite",
    evalCases: [{ evalId: "who-answered", conversation: [{ userContent: { parts: [{ text: "Can I change my plan after having a child?" }] } }] }],
  }));
  const result = await proveLive({}, { evalset, cassette: MISMATCH, targetAgent: "agent-benefits", outRoot: STATE_ROOT });
  expect(result.status).toBe("failed");
  expect(result.cases[0].blockers.map((blocker) => blocker.code)).toContain("GELIVE006");
  const gate = evaluateLiveGate(result, DEFAULT_LIVE_GATE_POLICY);
  expect(gate.passed).toBe(false);
});

test("seeded metric failure: wrong reference answer fails response_match", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-prove-live-"));
  const evalset = join(dir, "wrong.evalset.json");
  writeFileSync(evalset, JSON.stringify({
    evalSetId: "wrong-suite",
    evalCases: [{
      evalId: "wrong-reference",
      conversation: [{
        userContent: { parts: [{ text: "Can I change my plan after having a child?" }] },
        finalResponse: { parts: [{ text: "Submit form 27B stroke 6 to the regional office by fax." }] },
      }],
    }],
  }));
  const result = await proveLive({}, { evalset, cassette: SUCCESS, outRoot: STATE_ROOT });
  expect(result.status).toBe("failed");
  const match = result.cases[0].metrics.find((metric) => metric.metric === "response_match");
  expect(match.status).toBe("fail");
  // A failing first run must NOT mint a baseline.
  expect(result.cases[0].conformance).toBe("not_configured");
});

test("evaluateCaseMetrics: tool trajectory unavailable without live tool metadata", () => {
  const kase = { id: "c", turns: [{ user: "q", reference: null }], raw: { geMetadata: { expected: { mustCall: ["some_tool"] } } } };
  const transcript = {
    invocationTools: [],
    session: { continued: false },
    responder: { assertion: "not_applicable", observedAgentId: null },
    turns: [{ assistant: { text: "hi" }, citations: [] }],
    verdict: { blockers: [] },
  };
  const metrics = evaluateCaseMetrics(kase, transcript);
  expect(metrics.find((metric) => metric.metric === "tool_trajectory").status).toBe("unavailable");
});

test("evaluateCaseMetrics: under replay a zero-tool transcript FAILS a mustCall (authoritative)", () => {
  const kase = { id: "c", turns: [{ user: "q", reference: null }], raw: { geMetadata: { expected: { mustCall: ["some_tool"] } } } };
  const transcript = {
    invocationTools: [],
    session: { continued: false },
    responder: { assertion: "not_applicable", observedAgentId: null },
    turns: [{ assistant: { text: "hi" }, citations: [] }],
    verdict: { blockers: [] },
  };
  const trajectory = evaluateCaseMetrics(kase, transcript, { replay: true }).find((metric) => metric.metric === "tool_trajectory");
  expect(trajectory.status).toBe("fail");
  expect(trajectory.detail).toContain("some_tool");
});

test("evaluateCaseMetrics: concrete citation sources are exact, logical ids remain presence-only", () => {
  const first = "projects/demo/locations/global/dataStores/benefits/documents/qle-policy";
  const second = "gs://benefits/policies/enrollment.pdf";
  const baseTranscript = {
    invocationTools: [],
    session: { continued: false },
    responder: { assertion: "not_applicable", observedAgentId: null },
    verdict: { blockers: [] },
  };
  const metricFor = (mustCite, citations) =>
    evaluateCaseMetrics(
      { id: "c", turns: [{ user: "q", reference: null }], raw: { geMetadata: { expected: { mustCite } } } },
      { ...baseTranscript, turns: [{ assistant: { text: "hi" }, citations }] },
      { replay: true },
    ).find((metric) => metric.metric === "grounding_citations");
  expect(metricFor([first], [{ source: first }]).status).toBe("pass");
  expect(metricFor([second], [{ source: "document-name", uri: second }]).status).toBe("pass");
  expect(metricFor([first, second], [{ source: first }]).status).toBe("fail");
  expect(metricFor([first], [{ source: "projects/demo/documents/unrelated" }]).detail).toContain(first);
  expect(metricFor(["auth-qle-policy"], [{ source: "any-grounded-document" }]).detail).toContain("presence only");
});

test("citation expectation classifier only treats explicit resource names and URIs as concrete", () => {
  expect(isAddressableCitationExpectation("projects/demo/documents/policy")).toBe(true);
  expect(isAddressableCitationExpectation("gs://bucket/policy.pdf")).toBe(true);
  expect(isAddressableCitationExpectation("https://docs.example/policy")).toBe(true);
  expect(isAddressableCitationExpectation("urn:policy:benefits:qle")).toBe(true);
  expect(isAddressableCitationExpectation("auth-qle-policy")).toBe(false);
  expect(isAddressableCitationExpectation("policy/eligibility-window")).toBe(false);
});

test("gate policy: pass-rate floor, strict responder, and missing-result handling", () => {
  const base = {
    status: "passed",
    passRate: 0.8,
    cases: [{ metrics: [{ metric: "responder_identity", status: "warning" }] }],
    conformance: { baseline: "matched", drift: [] },
    verdict: { blockers: [] },
    artifacts: {},
  };
  const gate = evaluateLiveGate(base, { ...DEFAULT_LIVE_GATE_POLICY, minPassRate: 1.0, strictResponder: true });
  expect(gate.passed).toBe(false);
  expect(gate.blockers.some((blocker) => blocker.code === "GELIVE008")).toBe(true);
  expect(gate.blockers.some((blocker) => blocker.code === "GELIVE006")).toBe(true);
  expect(evaluateLiveGate(null, { ...DEFAULT_LIVE_GATE_POLICY, required: false }).passed).toBe(true);
  expect(evaluateLiveGate(null, { ...DEFAULT_LIVE_GATE_POLICY, required: true }).passed).toBe(false);
});

test("advisory similarity and stats ride along without touching verdicts", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-prove-live-"));
  const evalset = writeSuccessEvalset(dir, { withExpectations: true });
  const result = await proveLive({}, { evalset, cassette: SUCCESS, targetAgent: "agent-benefits", outRoot: STATE_ROOT });

  // response_match carries advisory lexical-similarity fields; the gating
  // score/status stay the tokenF1 contract.
  const match = result.cases[0].metrics.find((metric) => metric.metric === "response_match");
  expect(match.status).toBe("pass");
  for (const key of ["lexicalSimilarity", "rougeL", "trigramCosine"]) {
    expect(match.advisory[key]).toBeGreaterThan(0);
    expect(match.advisory[key]).toBeLessThanOrEqual(1);
  }
  expect(match.detail).toContain("token-F1");

  // The stats block reports the Wilson interval over case pass rate and
  // per-metric status counts — advisory only, the verdict shape is unchanged.
  expect(result.stats.cases).toEqual({ n: 1, passes: 1, wilson95: { low: expect.any(Number), high: 1, rate: 1 } });
  expect(result.stats.cases.wilson95.low).toBeLessThan(1);
  expect(result.stats.metrics.response_match.pass).toBe(1);
  expect(result.stats.metrics.transport.pass).toBe(1);
  expect(result.verdict).toEqual({ gate: "live", passed: true, blockers: [] });
});

test("baseline summary/diff are policy-level, not byte-level", () => {
  const transcript = {
    responder: { assertion: "matched" },
    session: { continued: true },
    invocationTools: ["b", "a"],
    turns: [{ stream: { ttftMs: 400 }, assistant: { state: "SUCCEEDED" }, citations: [{ source: "s1" }] }],
  };
  const summary = baselineSummaryOf(transcript);
  expect(summary.invocationTools).toEqual(["a", "b"]); // sorted → order-insensitive
  expect(summary.timingClasses).toEqual(["fast"]);
  expect(diffBaseline(summary, summary)).toEqual([]);
  expect(diffBaseline(summary, { ...summary, responder: "unknown" }).map((d) => d.field)).toEqual(["responder"]);
});
