// The `ge evals compile` core — resolve a spec source, compile the behavioral
// suite, and emit every executable artifact in one deterministic pass.
//
// Spec sources, in priority order (the same authorities the generator engine
// builds from, so compiled evals can never drift from what gets built):
//   1. --spec <path>   any GenerationSpecEnvelope JSON (bring your own)
//   2. --id <spec-id>  a captured/registered interview spec
//   3. exactly one registered spec → it wins by default
import { readFileSync, existsSync } from "node:fs";
import { relative } from "node:path";
import { writeJson } from "@ge/std/json-io";
import { DxError } from "../errors/dx-error.mjs";
import { join } from "node:path";
import { REPO_ROOT, statePath } from "../state-paths.mjs";
import { loadInterviewSpecEntries } from "../factory-catalog.mjs";
import { compileBehavioralSuite } from "./compile.mjs";
import { emitAdkEvalset } from "./emit-adk-evalset.mjs";
import { emitAgentsCliDataset } from "./emit-agents-cli-dataset.mjs";
import { writeMetricApplicability } from "./metric-applicability.mjs";

async function resolveSpecEnvelope({ spec, id, repoRoot = REPO_ROOT }) {
  if (spec) {
    if (!existsSync(spec)) {
      throw new DxError(`spec not found: ${spec}`, {
        where: spec,
        why: "the --spec file does not exist",
        fix: "pass a GenerationSpecEnvelope JSON ({ id, title, generationSpec })",
      });
    }
    return { envelope: JSON.parse(readFileSync(spec, "utf8")), sourcePath: spec };
  }
  // The registry root is the generator app, not the repo root — the same
  // convention spec-review uses (catalog/interview-specs lives under it).
  const entries = await loadInterviewSpecEntries({ repoRoot: join(repoRoot, "apps", "factory") });
  if (!entries.length) {
    throw new DxError("no captured specs to compile", {
      where: "interview-spec registry",
      why: "evals compile from a captured agent contract, and none are registered yet",
      fix: "ge capture   (or pass --spec <envelope.json>)",
    });
  }
  const entry = id ? entries.find((candidate) => candidate.id === id) : entries.length === 1 ? entries[0] : null;
  if (!entry) {
    throw new DxError(id ? `spec not found in the registry: ${id}` : `multiple specs registered — pick one with --id`, {
      where: "interview-spec registry",
      why: id ? `no registered spec has id "${id}"` : `found ${entries.length} specs: ${entries.map((candidate) => candidate.id).join(", ")}`,
      fix: id ? "ge evals compile   (lists the registered ids in this error when --id is wrong)" : `ge evals compile --id ${entries[0].id}`,
    });
  }
  return { envelope: entry, sourcePath: entry.registry?.sourcePath || "<registry>" };
}

export async function compileEvals({
  spec,
  id,
  maxCases = 40,
  perturbVariants = 0,
  adversarial = false,
  outDir,
  repoRoot = REPO_ROOT,
} = {}) {
  const { envelope, sourcePath } = await resolveSpecEnvelope({ spec, id, repoRoot });
  const dir = outDir || statePath("behavioral");
  const { graph, selection, benchProfile, options } = compileBehavioralSuite(envelope, { sourcePath, maxCases, outDir: dir, perturbVariants, adversarial });

  const evalsetPath = `${dir}/${graph.subject.agentId}.evalset.json`;
  const evalset = emitAdkEvalset(graph, selection.selected, { evalSetId: graph.subject.agentId });
  writeJson(evalsetPath, evalset);
  const datasetPath = `${dir}/${graph.subject.agentId}.agents-cli-dataset.json`;
  writeJson(datasetPath, { cases: emitAgentsCliDataset(graph, selection.selected) });
  const applicabilityPath = statePath("proof", "metric-applicability.json");
  writeMetricApplicability(applicabilityPath);

  const rel = (path) => relative(repoRoot, path).replaceAll("\\", "/");
  const gaps = Object.entries(selection.coverage.dimensions).flatMap(([dimension, entry]) => entry.gaps.map((gap) => `${dimension}: ${gap}`));
  return {
    subject: graph.subject,
    counts: {
      capabilities: graph.capabilities.length,
      tools: graph.tools.length,
      authority: graph.authority.length,
      candidates: selection.coverage.totalCandidates,
      selected: selection.selected.length,
      dropped: selection.dropped.length,
    },
    coverageGaps: gaps,
    // Present only when a non-default option was used — the default report
    // (and every default artifact) stays byte-identical to the pre-options CLI.
    ...(options ? { options } : {}),
    artifacts: {
      graph: rel(`${dir}/graph.json`),
      coverage: rel(`${dir}/coverage.json`),
      selectedCases: rel(`${dir}/selected-cases.json`),
      benchProfile: rel(`${dir}/bench-profile.json`),
      adkEvalset: rel(evalsetPath),
      agentsCliDataset: rel(datasetPath),
      metricApplicability: rel(applicabilityPath),
    },
    benchProfile: { id: benchProfile.id, sessions: benchProfile.sessions, turnsPerSession: benchProfile.turnsPerSession },
    next: `ge prove --live --evalset ${rel(evalsetPath)} --max-cases 3`,
  };
}
