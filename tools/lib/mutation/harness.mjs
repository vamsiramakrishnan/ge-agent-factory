// Eval mutation-testing harness — does the live proof actually have teeth?
//
// For a matched (evalset, cassette) pair whose baseline is green, the harness
// derives one behavioral mutant per declared expectation, applies it to the
// cassette, and re-runs the REAL live proof (`proveLive`, offline, zero
// cloud). A load-bearing expectation KILLS its mutant (the proof flips red);
// a mutant that SURVIVES is an ornamental eval — the proof declares an
// expectation it does not enforce.
//
// It also reports untested guards: expectations the evalset does NOT declare,
// whose corresponding violation would therefore sail through the proof. An
// absent guard is a coverage gap, not a machinery bug, so it is a warning,
// not a hard failure.
//
// Library contract (per AGENTS.md): returns a structured result, throws on an
// un-attributable baseline. No console output, no process.exit — the boundary
// (tools/check-eval-mutants.mjs) renders and sets the exit code.
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { proveLive, isAddressableCitationExpectation } from "../live/prove-live.mjs";
import {
  dropRequiredTool,
  injectForbiddenTool,
  stripCitations,
  replaceRequiredCitation,
  corruptAnswer,
  toNdjson,
  cassetteHasCitations,
} from "./cassette-mutations.mjs";

function parseNdjson(text) {
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

function slug(id) {
  return id.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

// Union the declared expectations across every case in the evalset. The
// harness targets one (evalset, cassette) pair describing the same
// conversation, so aggregating is faithful: prove-live itself folds tool
// calls across turns into a single transcript.invocationTools set.
export function readExpectations(evalsetJson) {
  const cases = evalsetJson.evalCases || evalsetJson.eval_cases || evalsetJson.cases || [];
  const mustCall = new Set();
  const mustNotCall = new Set();
  const mustCite = new Set();
  let hasReference = false;
  for (const kase of cases) {
    const expected = kase.geMetadata?.expected || kase.expected || {};
    (expected.mustCall || []).forEach((tool) => mustCall.add(tool));
    (expected.mustNotCall || []).forEach((tool) => mustNotCall.add(tool));
    (expected.mustCite || []).forEach((cite) => mustCite.add(cite));
    for (const invocation of kase.conversation || []) {
      if (invocation.finalResponse || invocation.final_response || invocation.reference) hasReference = true;
    }
  }
  return {
    mustCall: [...mustCall],
    mustNotCall: [...mustNotCall],
    mustCite: [...mustCite],
    hasReference,
  };
}

// One mutant per declared expectation: each mutant is the smallest behavioral
// change that should trip exactly the metric that guards that expectation.
export function planMutants(expected) {
  const plan = [];
  for (const tool of expected.mustCall) {
    plan.push({ id: `drop_required_tool:${tool}`, metric: "tool_trajectory", guard: "mustCall", apply: (records) => dropRequiredTool(records, tool) });
  }
  for (const tool of expected.mustNotCall) {
    plan.push({ id: `inject_forbidden_tool:${tool}`, metric: "tool_trajectory", guard: "mustNotCall", apply: (records) => injectForbiddenTool(records, tool) });
  }
  // Always probe the minimum citation-presence contract. When mustCite names a
  // concrete resource/URI, also replace that source while preserving another
  // citation-shaped record; this proves identity matching rather than merely
  // proving that the stream contained some evidence.
  if (expected.mustCite.length) {
    plan.push({ id: "strip_citations", metric: "grounding_citations", guard: "mustCite", apply: stripCitations });
    for (const cite of expected.mustCite.filter(isAddressableCitationExpectation)) {
      plan.push({ id: `replace_required_citation:${cite}`, metric: "grounding_citations", guard: "mustCite", apply: (records) => replaceRequiredCitation(records, cite) });
    }
  }
  if (expected.hasReference) {
    plan.push({ id: "corrupt_answer", metric: "response_match", guard: "reference", apply: corruptAnswer });
  }
  return plan;
}

// Guards the evalset does NOT declare — the violation each would catch is
// therefore invisible to the proof. Reported as coverage gaps.
export function untestedGuards(expected, cassetteRecords) {
  const gaps = [];
  if (!expected.mustCall.length) {
    gaps.push({ guard: "mustCall", metric: "tool_trajectory", note: "no required-tool guard declared — an agent that skips its evidence lookups would pass the proof" });
  }
  if (!expected.mustNotCall.length) {
    gaps.push({ guard: "mustNotCall", metric: "tool_trajectory", note: "no forbidden-tool guard declared — an agent that calls a disallowed (e.g. write) tool would pass the proof" });
  }
  if (!expected.mustCite.length && cassetteHasCitations(cassetteRecords)) {
    gaps.push({ guard: "mustCite", metric: "grounding_citations", note: "agent cites evidence but no mustCite guard is declared — an ungrounded answer would pass the proof" });
  }
  const symbolicCitations = expected.mustCite.filter((cite) => !isAddressableCitationExpectation(cite));
  if (symbolicCitations.length) {
    gaps.push({
      guard: "mustCiteIdentity",
      metric: "grounding_citations",
      note: `logical citation id(s) are presence-only until the transcript maps claims to sources: ${symbolicCitations.join(", ")}`,
    });
  }
  return gaps;
}

async function proveOnce(proveLiveImpl, evalset, cassette, outRoot) {
  const result = await proveLiveImpl({}, { evalset, cassette, outRoot });
  const failingMetrics = [
    ...new Set(
      (result.cases || []).flatMap((kase) => (kase.metrics || []).filter((metric) => metric.status === "fail").map((metric) => metric.metric)),
    ),
  ];
  const blockers = (result.verdict?.blockers || []).map((blocker) => blocker.code);
  return {
    passed: result.verdict?.passed === true && result.status === "passed",
    status: result.status,
    failingMetrics,
    blockers,
  };
}

// Run the full mutation sweep. `proveLiveImpl` is injectable for tests.
export async function runEvalMutants({ evalset, cassette }, { proveLiveImpl = proveLive } = {}) {
  const evalsetJson = JSON.parse(readFileSync(evalset, "utf8"));
  const expected = readExpectations(evalsetJson);
  const baseRecords = parseNdjson(readFileSync(cassette, "utf8"));
  const work = mkdtempSync(join(tmpdir(), "ge-eval-mutants-"));
  try {
    const baseline = await proveOnce(proveLiveImpl, evalset, cassette, join(work, "baseline"));
    if (!baseline.passed) {
      throw new Error(
        `mutation harness needs a GREEN baseline to attribute kills, but the unmutated proof did not pass ` +
          `(status=${baseline.status}, failing metrics: ${baseline.failingMetrics.join(", ") || "none"}, ` +
          `blockers: ${baseline.blockers.join(", ") || "none"}). ` +
          `Fix: pair the cassette with an evalset whose expectations the recording already satisfies.`,
      );
    }

    const plan = planMutants(expected);
    const mutants = [];
    for (const mutant of plan) {
      const mutatedPath = join(work, `${slug(mutant.id)}.ndjson`);
      writeFileSync(mutatedPath, toNdjson(mutant.apply(baseRecords)));
      const proof = await proveOnce(proveLiveImpl, evalset, mutatedPath, join(work, slug(mutant.id)));
      mutants.push({
        id: mutant.id,
        metric: mutant.metric,
        guard: mutant.guard,
        killed: !proof.passed,
        caughtBy: proof.failingMetrics,
        // A kill is only meaningful if the metric that fired is the one that
        // guards this expectation — otherwise the mutant tripped something
        // incidental and the intended guard is still unproven.
        killedByIntendedGuard: !proof.passed && proof.failingMetrics.includes(mutant.metric),
      });
    }

    const survived = mutants.filter((mutant) => !mutant.killed);
    const misattributed = mutants.filter((mutant) => mutant.killed && !mutant.killedByIntendedGuard);
    return {
      subject: { evalset, cassette },
      baseline,
      expected,
      gaps: untestedGuards(expected, baseRecords),
      mutants,
      survived,
      misattributed,
      score: {
        generated: mutants.length,
        killed: mutants.length - survived.length,
        survived: survived.length,
      },
      // Ornamental if any declared expectation went unenforced, or a kill was
      // credited to the wrong metric (the intended guard is still unproven).
      ornamental: survived.length > 0 || misattributed.length > 0,
    };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
