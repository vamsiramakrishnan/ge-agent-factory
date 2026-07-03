// End-to-end behavioral compile: spec envelope → graph → selected suite →
// bench profile, with an optional artifact drop for downstream emitters.
//
// This is the one function operator surfaces call; the per-stage modules
// stay importable on their own for tests and for emitters that only need a
// slice (e.g. re-selecting against a custom coverage policy).
import { join } from "node:path";
import { writeJson } from "@ge/std/json-io";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { selectCases } from "./select-cases.mjs";

export const DEFAULT_REQUIRED_COVERAGE = ["capability:*", "claim:*", "write_tool:*", "refusal:*", "escalation:*"];

// Lower median: deterministic and integer for the bench harness.
function medianTurns(cases) {
  if (cases.length === 0) return 1;
  const lengths = cases.map((kase) => kase.turns.length).sort((a, b) => a - b);
  return lengths[Math.floor((lengths.length - 1) / 2)];
}

// Load mix: read-only happy-path traffic only. Writes are excluded because a
// load profile replays cases at volume, and replayed writes would hammer
// mutation paths that need confirmation semantics, not throughput.
function buildLoadMix(selected, tools) {
  const writeTools = new Set(tools.filter((tool) => tool.operation === "write").map((tool) => tool.toolName));
  return selected
    .filter((kase) => kase.intent === "happy_path")
    .filter((kase) => !(kase.coverage || []).some((tag) => tag.startsWith("write_tool:")))
    .filter((kase) => !(kase.expected?.mustCall || []).some((name) => writeTools.has(name)))
    .map((kase) => ({ caseId: kase.id, weight: kase.riskWeight ?? 1 }));
}

/**
 * Compile a spec envelope into { graph, selection, benchProfile }; when
 * outDir is given, also persist the four artifacts (graph.json,
 * coverage.json, selected-cases.json, bench-profile.json) via writeJson.
 */
export function compileBehavioralSuite(envelope, { sourcePath, maxCases = 40, outDir } = {}) {
  const graph = compileBehavioralGraph(envelope, { sourcePath });
  const selection = selectCases({
    cases: graph.conversations,
    requiredCoverage: DEFAULT_REQUIRED_COVERAGE,
    maxCases,
  });
  const benchProfile = {
    id: `profile-${graph.subject.agentId}`,
    source: "contract",
    sessions: 10,
    turnsPerSession: medianTurns(selection.selected),
    concurrency: [1, 2, 4],
    mix: buildLoadMix(selection.selected, graph.tools),
    mode: "mixed",
  };
  if (outDir) {
    writeJson(join(outDir, "graph.json"), graph);
    writeJson(join(outDir, "coverage.json"), selection.coverage);
    writeJson(join(outDir, "selected-cases.json"), { cases: selection.selected, dropped: selection.dropped });
    writeJson(join(outDir, "bench-profile.json"), benchProfile);
  }
  return { graph, selection, benchProfile };
}
