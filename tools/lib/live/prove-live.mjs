// Live proof — run evalset cases through the deployed assist surface (or a
// cassette replay) and produce a LiveProofResult: per-case transcripts,
// metric grid, conformance-vs-baseline, and a gate-ready verdict.
//
// Metric policy (docs/reference/metric-applicability.md): GE owns transport,
// session threading, responder identity, latency, and structural
// expectation checks; judgment metrics (LLM-judged quality, hallucination,
// safety) belong to the platform graders and are reported as delegated or
// unavailable — never silently passed.
import { existsSync } from "node:fs";
import { readJson, writeJson } from "@ge/std/json-io";
import { statePath, relativeToRepo } from "../state-paths.mjs";
import { loadEvalset } from "../evals/evalset.mjs";
import { prepareDrive, saveTranscript } from "./drive-session.mjs";
import { runConversation } from "./conversation.mjs";

export const LIVE_PROOF_API_VERSION = "ge.dev/v1";
export const LIVE_PROOF_KIND = "LiveProofResult";

// ── metrics ─────────────────────────────────────────────────────────────────

// Deterministic token-overlap F1 — the structural stand-in for response
// match when a reference answer exists. Judged quality stays delegated.
export function tokenF1(reference, candidate) {
  const tokens = (text) => String(text || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  const ref = tokens(reference);
  const cand = tokens(candidate);
  if (!ref.length || !cand.length) return 0;
  const counts = new Map();
  for (const token of ref) counts.set(token, (counts.get(token) || 0) + 1);
  let overlap = 0;
  for (const token of cand) {
    const remaining = counts.get(token) || 0;
    if (remaining > 0) {
      overlap += 1;
      counts.set(token, remaining - 1);
    }
  }
  if (!overlap) return 0;
  const precision = overlap / cand.length;
  const recall = overlap / ref.length;
  return (2 * precision * recall) / (precision + recall);
}

// Evaluate the GE-owned metrics for one case. `expected` comes from the
// compiled case metadata (geMetadata.expected) when present.
export function evaluateCaseMetrics(kase, transcript, { minResponseMatch = 0.35 } = {}) {
  const metrics = [];
  const expected = kase.raw?.geMetadata?.expected || kase.raw?.expected || {};
  const blockCodes = (transcript.verdict?.blockers || []).map((blocker) => blocker.code);

  metrics.push({
    metric: "transport",
    runner: "ge",
    status: blockCodes.includes("GELIVE004") ? "fail" : "pass",
    detail: blockCodes.includes("GELIVE004") ? "stream failed or ended in a terminal FAILED state" : "stream completed",
  });
  metrics.push({
    metric: "session_threading",
    runner: "ge",
    status: blockCodes.includes("GELIVE005") ? "fail" : "pass",
    detail: transcript.session.continued ? "multi-turn session threaded" : "single turn",
  });
  const responder = transcript.responder.assertion;
  metrics.push({
    metric: "responder_identity",
    runner: "ge",
    status: responder === "mismatched" ? "fail" : responder === "unknown" ? "warning" : responder === "matched" ? "pass" : "not_applicable",
    detail: responder === "not_applicable" ? "no expected agent configured" : `assertion: ${responder}${transcript.responder.observedAgentId ? ` (observed ${transcript.responder.observedAgentId})` : ""}`,
  });

  const references = kase.turns.map((turn) => turn.reference).filter(Boolean);
  if (references.length) {
    const scores = kase.turns.map((turn, index) => (turn.reference ? tokenF1(turn.reference, transcript.turns[index]?.assistant.text) : null)).filter((score) => score !== null);
    const score = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    metrics.push({
      metric: "response_match",
      runner: "ge",
      status: score >= minResponseMatch ? "pass" : "fail",
      score: Number(score.toFixed(3)),
      detail: `token-F1 ${score.toFixed(3)} vs threshold ${minResponseMatch} (structural check; judged quality is delegated)`,
    });
  } else {
    metrics.push({ metric: "response_match", runner: "ge", status: "not_applicable", detail: "no reference answers recorded for this case" });
  }

  if (expected.mustCall?.length || expected.mustNotCall?.length) {
    if (!transcript.invocationTools.length && expected.mustCall?.length) {
      metrics.push({ metric: "tool_trajectory", runner: "ge", status: "unavailable", detail: "live stream exposed no tool metadata — trajectory is checkable locally only" });
    } else {
      const missing = (expected.mustCall || []).filter((tool) => !transcript.invocationTools.includes(tool));
      const forbidden = (expected.mustNotCall || []).filter((tool) => transcript.invocationTools.includes(tool));
      metrics.push({
        metric: "tool_trajectory",
        runner: "ge",
        status: missing.length || forbidden.length ? "fail" : "pass",
        detail: missing.length || forbidden.length ? [missing.length ? `missing: ${missing.join(", ")}` : "", forbidden.length ? `forbidden called: ${forbidden.join(", ")}` : ""].filter(Boolean).join("; ") : `observed: ${transcript.invocationTools.join(", ") || "none"}`,
      });
    }
  } else {
    metrics.push({ metric: "tool_trajectory", runner: "ge", status: "not_applicable", detail: "case declares no tool expectations" });
  }

  if (expected.mustCite?.length) {
    const cited = transcript.turns.flatMap((turn) => turn.citations || []);
    metrics.push({
      metric: "grounding_citations",
      runner: "ge",
      status: cited.length ? "pass" : "fail",
      detail: cited.length ? `${cited.length} citation(s) in the stream` : "case requires citations but the stream carried none",
    });
  } else {
    metrics.push({ metric: "grounding_citations", runner: "ge", status: "not_applicable", detail: "case declares no citation expectations" });
  }

  return metrics;
}

// ── conformance baselines ───────────────────────────────────────────────────
// Baselines compare by POLICY, not bytes: identity, threading, tool set,
// citation presence, and timing class — the exact transcript is stored
// separately for archaeology.

export function timingClass(ttftMs) {
  if (ttftMs === null || ttftMs === undefined) return "no-text";
  if (ttftMs <= 2500) return "fast";
  if (ttftMs <= 8000) return "slow";
  return "stalled";
}

export function baselineSummaryOf(transcript) {
  return {
    responder: transcript.responder.assertion,
    threaded: transcript.session.continued,
    invocationTools: [...transcript.invocationTools].sort(),
    citedSources: [...new Set(transcript.turns.flatMap((turn) => (turn.citations || []).map((citation) => citation.source)))].sort(),
    timingClasses: transcript.turns.map((turn) => timingClass(turn.stream.ttftMs)),
    turnStates: transcript.turns.map((turn) => turn.assistant.state || "unknown"),
  };
}

export function diffBaseline(baseline, observed) {
  const drift = [];
  for (const key of Object.keys(observed)) {
    const before = JSON.stringify(baseline?.[key]);
    const after = JSON.stringify(observed[key]);
    if (before !== after) drift.push({ field: key, baseline: baseline?.[key] ?? null, observed: observed[key] });
  }
  return drift;
}

export function baselineDirFor(evalsetId, { root = statePath("live-baselines") } = {}) {
  return `${root}/${evalsetId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

// ── the proof run ───────────────────────────────────────────────────────────

export async function proveLive(cfg, {
  evalset,
  cassette,
  maxCases,
  maxTurns,
  strictResponder = false,
  updateBaseline = false,
  targetAgent,
  minResponseMatch,
  // Injectable state root: tests (and any caller with its own layout) pass a
  // temp dir instead of relying on GE_STATE_ROOT being read at module load.
  outRoot,
  log = () => {},
} = {}) {
  const suite = loadEvalset(evalset);
  const selected = typeof maxCases === "number" && maxCases > 0 ? suite.cases.slice(0, maxCases) : suite.cases;
  const skipped = suite.cases.length - selected.length;
  if (skipped > 0) log(`case cap: running ${selected.length} of ${suite.cases.length} case(s) (--max-cases)`);

  const { runner, target } = await prepareDrive(cfg, { cassette, targetAgent });
  const baselineDir = baselineDirFor(suite.id, outRoot ? { root: `${outRoot}/live-baselines` } : {});
  const transcriptsDir = outRoot ? `${outRoot}/transcripts` : undefined;
  const proofDir = outRoot ? `${outRoot}/proof` : statePath("proof");
  const caseResults = [];
  const transcriptPaths = [];
  const driftSummaries = [];

  try {
    for (const kase of selected) {
      const turns = (typeof maxTurns === "number" && maxTurns > 0 ? kase.turns.slice(0, maxTurns) : kase.turns).map((turn) => ({ text: turn.user }));
      log(`case ${kase.id}: ${turns.length} turn(s)`);
      const { transcript } = await runConversation(runner, turns, {
        target,
        id: `prove-${suite.id}-${kase.id}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
        strictResponder,
        startedAt: new Date().toISOString(),
      });
      const transcriptPath = saveTranscript(transcript, transcriptsDir ? { dir: transcriptsDir } : {});
      transcriptPaths.push(transcriptPath);

      const metrics = evaluateCaseMetrics(kase, transcript, { minResponseMatch });
      const failedMetrics = metrics.filter((metric) => metric.status === "fail");
      const blockers = transcript.verdict.blockers;

      // Conformance: compare against the per-case baseline when one exists;
      // otherwise a green run (or --update-baseline) creates it. A failing
      // first run does NOT become a baseline — baselines are known-good.
      const baselinePath = `${baselineDir}/${kase.id.replace(/[^a-zA-Z0-9_-]/g, "-")}.json`;
      const observed = baselineSummaryOf(transcript);
      const caseOk = !failedMetrics.length && !blockers.length;
      let conformance = "not_configured";
      if (existsSync(baselinePath) && !updateBaseline) {
        const drift = diffBaseline(readJson(baselinePath, {}), observed);
        conformance = drift.length ? "drifted" : "matched";
        if (drift.length) driftSummaries.push({ caseId: kase.id, drift });
      } else if (caseOk || updateBaseline) {
        writeJson(baselinePath, observed);
        conformance = "created";
      }

      caseResults.push({
        id: kase.id,
        ok: caseOk,
        turns: turns.length,
        metrics,
        blockers,
        conformance,
        transcript: transcriptPath,
      });
    }
  } finally {
    await runner.close?.();
  }

  const failedCases = caseResults.filter((kase) => !kase.ok);
  const passRate = caseResults.length ? (caseResults.length - failedCases.length) / caseResults.length : 0;
  const status = caseResults.length === 0 ? "blocked" : failedCases.length ? "failed" : "passed";
  const conformanceStates = caseResults.map((kase) => kase.conformance);
  const baselineState = conformanceStates.includes("drifted") ? "drifted"
    : conformanceStates.includes("created") ? "created"
    : conformanceStates.includes("matched") ? "matched"
    : "not_configured";

  const result = {
    apiVersion: LIVE_PROOF_API_VERSION,
    kind: LIVE_PROOF_KIND,
    status,
    evalset: { id: suite.id, path: evalset, cases: suite.cases.length, selected: selected.length },
    target: { project: target.project, location: target.location, engine: target.engine, assistant: target.assistant, expectedAgentId: target.expectedAgentId ?? null },
    source: { runner: cassette ? "cassette" : "streamassist", replay: !!cassette },
    cases: caseResults,
    passRate: Number(passRate.toFixed(3)),
    conformance: {
      baseline: baselineState,
      baselineDir: relativeToRepo(baselineDir),
      drift: driftSummaries,
    },
    verdict: {
      gate: "live",
      passed: status === "passed" && baselineState !== "drifted",
      blockers: failedCases.flatMap((kase) => kase.blockers),
    },
    artifacts: { transcripts: transcriptPaths },
    next: status === "passed"
      ? (baselineState === "drifted" ? "ge prove --live --update-baseline" : "ge bench")
      : `ge drive --cassette ${cassette || "<record one>"}`,
  };

  // The proof pack artifacts: the result itself plus the case × metric grid
  // the console renders as the eval matrix.
  const resultPath = `${proofDir}/live-proof-result.json`;
  writeJson(resultPath, result);
  const matrixPath = `${proofDir}/eval-matrix.json`;
  writeJson(matrixPath, {
    evalsetId: suite.id,
    columns: ["ge"],
    rows: caseResults.map((kase) => ({
      caseId: kase.id,
      ok: kase.ok,
      conformance: kase.conformance,
      cells: kase.metrics.map((metric) => ({ metric: metric.metric, runner: metric.runner, status: metric.status, score: metric.score ?? null, detail: metric.detail })),
      transcript: kase.transcript,
    })),
  });
  result.artifacts.proofResult = relativeToRepo(resultPath);
  result.artifacts.matrix = relativeToRepo(matrixPath);
  return result;
}
