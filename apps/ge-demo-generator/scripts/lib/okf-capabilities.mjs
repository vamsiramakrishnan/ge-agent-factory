// okf-capabilities.mjs
//
// Derivers that make OKF the SPINE of the spec loop: they turn a
// behaviorContract into the two capability concepts OKF cares about —
//   - Query Capabilities: the questions/requests an agent can answer, each
//     with the tools that serve it and the workflow stage it runs in.
//   - Test Mechanisms: for each golden eval, the tools a test MUST exercise
//     (the write/query tools its query needs).
//
// Everything is ADDITIVE: an explicit `behaviorContract.answerableQueries` or
// per-eval `mechanisms` is always preferred; these derivers only fill the gap
// for specs authored before those fields existed, so old specs gain queries/
// tests without re-authoring.

import { slug } from "@ge/okf";

/** Tool-intent names of the given kinds (used to map a stage/eval to tools). */
function toolNamesByKind(toolIntents, kinds) {
  const set = new Set(kinds);
  return (toolIntents || []).filter((t) => t && t.name && set.has(t.kind)).map((t) => t.name);
}

/** All evidence-bearing strings a tool emits (for a query's `evidence`). */
function toolEvidence(toolIntents, names) {
  const byName = new Map((toolIntents || []).map((t) => [t.name, t]));
  const out = [];
  for (const name of names || []) {
    const tool = byName.get(name);
    for (const ev of (tool && tool.evidenceEmitted) || []) if (ev && !out.includes(ev)) out.push(ev);
  }
  return out;
}

/**
 * Derive the answerable queries (Query Capabilities) for a behaviorContract.
 *
 * Strategy (prefer explicit, else derive):
 *   - If `behaviorContract.answerableQueries` is present, normalize + return it.
 *   - Else if a workflow is present: one capability per workflow STAGE, whose
 *     tools are the stage's tools (a stage is a thing the agent "does"), and
 *     whose request comes from the stage label/description.
 *   - Else: one capability per `inScope` item, served by ALL the contract's
 *     query/evidence tools (the read surface that answers in-scope questions).
 *
 * Returns: [{ id, request, tools:[toolName], evidence:[...], stage?:<stepId> }]
 */
export function deriveAnswerableQueries(behaviorContract = {}) {
  const bc = behaviorContract || {};
  const toolIntents = bc.toolIntents || [];

  if (Array.isArray(bc.answerableQueries) && bc.answerableQueries.length) {
    return bc.answerableQueries.map((q, i) => {
      const request = q.request || q.prompt || q.question || q.label || `Capability ${i + 1}`;
      const tools = Array.isArray(q.tools) ? q.tools.filter(Boolean) : [];
      return {
        id: q.id || slug(request).slice(0, 64) || `query-${i + 1}`,
        request,
        tools,
        evidence: Array.isArray(q.evidence) && q.evidence.length ? q.evidence : toolEvidence(toolIntents, tools),
        stage: q.stage || undefined,
      };
    });
  }

  const workflow = bc.workflow && Array.isArray(bc.workflow.steps) ? bc.workflow : null;
  if (workflow) {
    return workflow.steps.map((step, i) => {
      const tools = (step.tools || []).filter(Boolean);
      const request = step.description || step.label || step.id || `Stage ${i + 1}`;
      return {
        id: slug(step.id || step.label || `stage-${i + 1}`),
        request,
        tools,
        evidence: toolEvidence(toolIntents, tools),
        stage: step.id || slug(step.label || `stage-${i + 1}`),
      };
    });
  }

  // No workflow: every in-scope item is answered by the read surface.
  const readTools = toolNamesByKind(toolIntents, ["query", "evidence_lookup", "calculation"]);
  const inScope = (bc.inScope || []).filter((x) => x && String(x).trim());
  const items = inScope.length ? inScope : [bc.primaryObjective].filter(Boolean);
  return items.map((request, i) => ({
    id: slug(request).slice(0, 64) || `query-${i + 1}`,
    request,
    tools: readTools,
    evidence: toolEvidence(toolIntents, readTools),
    stage: undefined,
  }));
}

/**
 * Resolve the mechanisms (tool names that MUST fire) for a single golden eval.
 *
 * Prefer explicit `eval.mechanisms`; else fall back to the eval's referenced
 * tools: `expectedToolCalls` (the write/query tools its query needs).
 */
export function evalMechanisms(evalSpec) {
  if (!evalSpec || typeof evalSpec !== "object") return [];
  if (Array.isArray(evalSpec.mechanisms) && evalSpec.mechanisms.length) {
    return evalSpec.mechanisms.filter(Boolean);
  }
  return (evalSpec.expectedToolCalls || evalSpec.expected_tool_calls || []).filter(Boolean);
}

/**
 * Derive the test mechanisms for every golden eval. Returns one record per
 * eval: { id, prompt, mechanisms:[toolName], validates?:<queryId> }.
 *
 * `validates` links a test back to the Query Capability it exercises: when the
 * eval names a stage/query that aligns with a derived query, that id is used.
 */
export function deriveTestMechanisms(behaviorContract = {}) {
  const bc = behaviorContract || {};
  const evals = bc.goldenEvals || [];
  const queries = deriveAnswerableQueries(bc);
  // Index query ids and their tool sets so a test can claim the query whose
  // tools it most overlaps with (best-effort link; never throws).
  const queryByTool = new Map(); // toolName -> [queryId]
  for (const q of queries) {
    for (const t of q.tools || []) {
      if (!queryByTool.has(t)) queryByTool.set(t, []);
      queryByTool.get(t).push(q.id);
    }
  }

  return evals.map((evalSpec, i) => {
    const prompt = typeof evalSpec === "string"
      ? evalSpec
      : evalSpec.prompt || evalSpec.input || evalSpec.question || `Eval ${i + 1}`;
    const mechanisms = evalMechanisms(evalSpec);
    // Pick the query that the most mechanisms point at.
    const counts = new Map();
    for (const m of mechanisms) {
      for (const qid of queryByTool.get(m) || []) counts.set(qid, (counts.get(qid) || 0) + 1);
    }
    let validates;
    let best = 0;
    for (const [qid, c] of counts) if (c > best) { best = c; validates = qid; }
    return {
      id: (typeof evalSpec === "object" && evalSpec.id) || slug(prompt).slice(0, 64) || `test-${i + 1}`,
      prompt,
      mechanisms,
      rubric: (typeof evalSpec === "object" && (evalSpec.expectedActionOutcome || evalSpec.rubric || evalSpec.expected)) || undefined,
      mustReferenceEntities: (typeof evalSpec === "object" && evalSpec.mustReferenceEntities) || [],
      mustCiteDocuments: (typeof evalSpec === "object" && evalSpec.mustCiteDocuments) || [],
      validates,
    };
  });
}

/** Source documents declared on the spec (generationSpec.documents). */
export function specDocuments(spec = {}) {
  const gen = spec.generationSpec || spec || {};
  const docs = gen.documents || spec.documents || [];
  return (docs || []).filter((d) => d && (d.id || d.title)).map((d, i) => ({
    id: d.id || slug(d.title) || `document-${i + 1}`,
    title: d.title || d.id,
    type: d.type || "document",
    description: d.description || d.summary || undefined,
    anchors: d.anchors || d.citationAnchors || [],
  }));
}
