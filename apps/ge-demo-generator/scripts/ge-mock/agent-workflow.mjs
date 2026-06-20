// Shared, single-source-of-truth mapping from an upstream pipeline narrative
// (architecture.pipeline = [{ label, description }]) to an ordered set of agent
// workflow steps and the tool intents each step references.
//
// Two consumers use this module:
//   1. Spec generation (emit-baseline-specs.mjs, sync-use-cases-from-slides.mjs)
//      calls `buildWorkflowFromPipeline` to WRITE a self-describing
//      `behaviorContract.workflow` into the spec at authoring time. Its steps
//      carry toolIntent NAMES (the names declared on behaviorContract.toolIntents)
//      — not the canonical Python tool names — because the canonical names only
//      exist after the generator resolves intents against the materialized tables.
//   2. Build time (ge-mock.mjs `deriveAgentWorkflow`) calls `matchPipelineSteps`
//      to derive the multi-agent topology, resolving intents to canonical tool
//      names against the manifest tables.
//
// Both share `matchPipelineSteps` so the stage→intent matching exists in exactly
// one place and can never drift between authoring and build.

import { safePyName, snakeCase } from "./core/naming.mjs";

// The threshold below which a pipeline is NOT considered a "real" multi-agent
// pipeline (it stays a single agent). Mirrors deriveAgentWorkflow's decision:
// >=2 tool-bearing stages and >=2 distinct tools covered collectively.
const MIN_TOOL_BEARING_STEPS = 2;
const MIN_DISTINCT_TOOLS = 2;

// Verb-ish prefixes that are NOT meaningful business-object words when split out
// of a canonical tool name during stage matching.
const VERB_WORDS = new Set(["query", "action", "lookup", "notify", "calc", "calculate"]);

// Decide whether a tool intent belongs to a pipeline stage. A tool intent
// belongs to a stage when the stage's text mentions the intent's resolved tool
// name, its source system id, or one of the business-object words derived from
// the tool name. `resolvedName` is whatever name the caller wants to match on
// (canonical tool name at build time; the intent name at authoring time).
function intentMatchesStage({ intent, resolvedName }, haystack) {
  const needles = new Set();
  needles.add(resolvedName);
  if (intent.sourceSystemId) {
    needles.add(snakeCase(intent.sourceSystemId));
    for (const word of String(intent.sourceSystemId).split(/[^a-zA-Z0-9]+/)) {
      if (word.length >= 3) needles.add(word.toLowerCase());
    }
  }
  // Business-object words from the resolved name (drop verb prefixes).
  for (const word of String(resolvedName).split("_")) {
    if (word.length >= 4 && !VERB_WORDS.has(word)) needles.add(word);
  }
  return Array.from(needles).some((needle) => needle && haystack.includes(needle));
}

/**
 * Core stage→tool matcher shared by both consumers.
 *
 * @param {object} args
 * @param {Array<{label?:string, description?:string}>} args.pipeline upstream stages
 * @param {Array<object>} args.toolIntents behaviorContract.toolIntents
 * @param {(intent:object) => string|null} args.resolveName maps a tool intent to
 *   the name used both for matching and as the step's emitted tool reference.
 *   Intents that resolve to a falsy name are ignored.
 * @returns {{
 *   rawSteps: Array<{ id:string, label:string, description:string, toolNames:string[], parallel:boolean }>,
 *   validNames: Set<string>,
 * }} steps in source order (one per pipeline stage, before any threshold/normalization).
 */
export function matchPipelineSteps({ pipeline, toolIntents, resolveName }) {
  const intents = Array.isArray(toolIntents) ? toolIntents : [];
  const stages = Array.isArray(pipeline) ? pipeline : [];

  // Resolve every intent up front so matching and the valid-name set agree.
  const resolved = [];
  const validNames = new Set();
  for (const intent of intents) {
    const name = resolveName(intent);
    if (!name) continue;
    resolved.push({ intent, resolvedName: name });
    validNames.add(name);
  }

  const rawSteps = stages.map((stage, index) => {
    const haystack = `${stage?.label || ""} ${stage?.description || ""}`.toLowerCase();
    const matched = [];
    for (const entry of resolved) {
      if (intentMatchesStage(entry, haystack)) matched.push(entry.resolvedName);
    }
    return {
      id: safePyName(stage?.label || `stage_${index + 1}`, `stage_${index + 1}`),
      label: stage?.label || `Stage ${index + 1}`,
      description: stage?.description || "",
      toolNames: Array.from(new Set(matched)),
      parallel: false,
    };
  });

  return { rawSteps, validNames };
}

/**
 * Apply the "real pipeline" threshold to a set of tool-bearing steps. Returns
 * true when the pipeline warrants a multi-agent topology (and therefore an
 * explicit workflow), false when it should stay a single agent.
 */
export function isRealPipeline(toolBearingSteps) {
  const distinct = new Set();
  for (const step of toolBearingSteps) for (const name of step.toolNames) distinct.add(name);
  return toolBearingSteps.length >= MIN_TOOL_BEARING_STEPS && distinct.size >= MIN_DISTINCT_TOOLS;
}

/**
 * Authoring-time builder: turn a use case's pipeline + behaviorContract into a
 * SPEC-SHAPE workflow so the generated spec is self-describing.
 *
 *   { mode: "sequential"|"parallel",
 *     steps: [{ id, label, description, tools: [<toolIntent name>...] }] }
 *
 * Tools are toolIntent NAMES (not canonical Python names) — build time resolves
 * and intersects them against the tools it actually emits. Returns null when the
 * pipeline is trivial (fewer than 2 stages, or fewer than 2 tool-bearing stages /
 * 2 distinct tools) so simple specs stay single-agent and never gain a workflow.
 *
 * `mode` is "parallel" only when the source explicitly marks parallelism
 * (architecture.parallel === true, or every stage carries parallel: true);
 * otherwise "sequential".
 */
export function buildWorkflowFromPipeline({ behaviorContract, architecture } = {}) {
  const toolIntents = Array.isArray(behaviorContract?.toolIntents) ? behaviorContract.toolIntents : [];
  const pipeline = Array.isArray(architecture?.pipeline) ? architecture.pipeline : [];
  if (pipeline.length < 2) return null;
  if (!toolIntents.length) return null;

  // Author-time resolution: match on the declared intent name (canonical tool
  // names don't exist yet). Steps emit intent names; build time maps them to the
  // canonical tools it generates.
  const resolveName = (intent) => (intent?.name ? safePyName(intent.name) : null);
  // Preserve the original declared name so the emitted spec references the exact
  // toolIntents[].name (audit cross-checks against that), while matching uses the
  // normalized form.
  const nameByResolved = new Map();
  for (const intent of toolIntents) {
    const resolved = resolveName(intent);
    if (resolved && !nameByResolved.has(resolved)) nameByResolved.set(resolved, intent.name);
  }

  const { rawSteps } = matchPipelineSteps({ pipeline, toolIntents, resolveName });

  const toolBearing = rawSteps.filter((step) => step.toolNames.length > 0);
  if (!isRealPipeline(toolBearing)) return null;

  const explicitParallel = architecture?.parallel === true
    || (pipeline.length > 0 && pipeline.every((stage) => stage?.parallel === true));
  const mode = explicitParallel ? "parallel" : "sequential";

  const steps = toolBearing.map((step) => ({
    id: step.id,
    label: step.label,
    description: step.description,
    // Emit the declared toolIntent names (fall back to the resolved form).
    tools: step.toolNames.map((name) => nameByResolved.get(name) || name),
  }));

  return { mode, steps };
}
