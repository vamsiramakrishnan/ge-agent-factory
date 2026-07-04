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
import { expandAdversarialCases } from "./adversarial.mjs";
import { expandWithPerturbations } from "./perturbations.mjs";

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
 *
 * Opt-in hardening (both OFF by default — defaults stay byte-identical):
 *   adversarial      adds adversarial/safety candidates to the pool BEFORE
 *                    set-cover selection and requires `adversarial:*` coverage
 *   perturbVariants  N>0 derives N linguistic variants per selected case
 *                    AFTER selection (variants mirror what was selected)
 */
export function compileBehavioralSuite(envelope, { sourcePath, maxCases = 40, outDir, perturbVariants = 0, adversarial = false } = {}) {
  const graph = compileBehavioralGraph(envelope, { sourcePath });
  if (adversarial) {
    // Adversarial candidates live in the graph's own pool so the invariant
    // "selected ⊆ graph.conversations" keeps holding for emitters and tests.
    graph.conversations = [...graph.conversations, ...expandAdversarialCases(graph)];
  }
  const selection = selectCases({
    cases: graph.conversations,
    requiredCoverage: adversarial ? [...DEFAULT_REQUIRED_COVERAGE, "adversarial:*"] : DEFAULT_REQUIRED_COVERAGE,
    maxCases,
  });
  // The bench profile describes the base selection: perturbed variants are
  // linguistic mirrors, so replaying them at volume adds nothing to load.
  const benchProfile = {
    id: `profile-${graph.subject.agentId}`,
    source: "contract",
    sessions: 10,
    turnsPerSession: medianTurns(selection.selected),
    concurrency: [1, 2, 4],
    mix: buildLoadMix(selection.selected, graph.tools),
    mode: "mixed",
  };
  if (perturbVariants > 0) {
    selection.selected = expandWithPerturbations(selection.selected, { variants: perturbVariants });
    selection.coverage.selected = selection.selected.length;
  }
  const optionsEnabled = perturbVariants > 0 || adversarial;
  if (outDir) {
    writeJson(join(outDir, "graph.json"), graph);
    writeJson(join(outDir, "coverage.json"), selection.coverage);
    // `options` is stamped ONLY when a non-default option is on: the default
    // artifact must stay byte-identical to the pre-options compiler.
    writeJson(join(outDir, "selected-cases.json"), {
      cases: selection.selected,
      dropped: selection.dropped,
      ...(optionsEnabled ? { options: { maxCases, perturbVariants, adversarial } } : {}),
    });
    writeJson(join(outDir, "bench-profile.json"), benchProfile);
  }
  return { graph, selection, benchProfile, ...(optionsEnabled ? { options: { maxCases, perturbVariants, adversarial } } : {}) };
}
