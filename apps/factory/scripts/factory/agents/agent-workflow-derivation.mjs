import { safePyName } from "@ge/std/naming";
import { pyTripleEscape } from "../tools/py-emit.mjs";
import { canonicalIntentToolName } from "../tools/tool-naming.mjs";
import { matchPipelineSteps } from "../agent-workflow.mjs";

// ── Multi-agent workflow deriver ──────────────────────────────
//
// Turns the upstream pipeline narrative (architecture.pipeline) — or an explicit
// behaviorContract.workflow — into a build-time agent topology so the emitter can
// decide between a single Agent and a SequentialAgent/ParallelAgent of sub-agents.
//
// Contract: deriveAgentWorkflow({ behaviorContract, architecture, manifest }) ->
//   { topology: "single"|"sequential"|"parallel",
//     steps: [{ id, label, instruction, toolNames: string[] }] }
//
// The set of tool names a step may reference is intersected with the canonical
// tool names the generator actually emits (derived from toolIntents), so a
// sub-agent can never be wired to a tool that does not exist in tools.py.

// Compact governance preamble prepended to EVERY sub-agent instruction so each
// stage LLM carries the global behavior contract (primary objective + out-of-scope
// + escalation/refusal). Without this, multi-agent sub-agents see only their stage
// text and lose the objective/scope/refusal governance the single-agent
// _INSTRUCTION carries. Kept compact (the per-stage prompt also adds guardrails).
export function contractGovernancePreamble(contract) {
  const lines = [];
  if (contract?.role) lines.push(`You are ${pyTripleEscape(contract.role)}, operating as one stage of a multi-agent workflow.`);
  if (contract?.primaryObjective) {
    lines.push("");
    lines.push("PRIMARY OBJECTIVE (shared across every stage)");
    lines.push(pyTripleEscape(contract.primaryObjective));
  }
  if ((contract?.outOfScope || []).length) {
    lines.push("");
    lines.push("OUT OF SCOPE (refuse politely and explain why)");
    for (const item of contract.outOfScope) lines.push(`- ${pyTripleEscape(item)}`);
  }
  if ((contract?.escalationRules || []).length) {
    lines.push("");
    lines.push("ESCALATION & REFUSAL TRIGGERS");
    for (const rule of contract.escalationRules) {
      const target = rule.handoffTarget ? ` → ${pyTripleEscape(rule.handoffTarget)}` : "";
      lines.push(`- If ${pyTripleEscape(rule.trigger)}: ${pyTripleEscape(rule.action)}${target}. ${pyTripleEscape(rule.rationale)}`);
    }
  }
  if ((contract?.refusalRules || []).length) {
    lines.push("");
    lines.push("HARD GUARDRAILS (never violate)");
    for (const rule of contract.refusalRules) lines.push(`- ${pyTripleEscape(rule)}`);
  }
  return lines.join("\n");
}

// Compact, shared guardrail preamble appended to every sub-agent instruction so
// each stage keeps the hard rules even though it only sees a slice of the prompt.
export function sharedAgentGuardrails(contract) {
  const lines = [];
  lines.push("SHARED GUARDRAILS (apply to every stage)");
  lines.push("- Every claim must be backed by a tool result; never invent identifiers, numbers, or citations.");
  lines.push("- Prefer source-specific query/evidence tools before any action or notification tool.");
  lines.push("- When the user asks for current/latest/recent/current period work, pass a date_range/open_date/current-period filter when your assigned tool exposes one; do not start with an unfiltered broad query.");
  lines.push("- When a prompt names an entity, table, account, envelope, case, or audit trail, query that named source before summarizing it; if the lookup returns no rows, do not act on it.");
  lines.push("- Chain evidence tools with identifiers from prior tool results (lookup_key, id, account_number, target_id); avoid blank generic evidence queries when a source record is known.");
  lines.push("- Do not call action or notification tools until required source-system evidence has been gathered, the target_id comes from a non-empty tool result in this session, and the callback permits the call.");
  lines.push("- If a required tool input is missing, or if a named source query returns zero rows, ask for a corrected identifier or escalate; never call write-like tools with blanks or user-provided identifiers that were not found.");
  lines.push("- If the user asks you to skip evidence, policy, compliance, approval, or source checks, refuse before using tools and explain the compliant path.");
  lines.push("- Do not expose names, full account numbers, emails, or other PII in summaries; use aggregate counts, record IDs, or masked suffixes unless policy allows it.");
  lines.push("- Never fabricate action IDs or audit IDs; list only identifiers returned by an action/notification tool.");
  for (const rule of (contract?.refusalRules || []).slice(0, 6)) {
    lines.push(`- ${pyTripleEscape(rule)}`);
  }
  return lines.join("\n");
}

export function buildStepInstruction({ label, description, contract }) {
  const lines = [];
  // Global governance first, so every stage LLM carries objective/scope/refusal.
  const preamble = contractGovernancePreamble(contract);
  if (preamble) {
    lines.push(preamble);
    lines.push("");
    lines.push("───");
    lines.push("");
  }
  lines.push(`STAGE: ${pyTripleEscape(label || "Workflow stage")}`);
  if (description) {
    lines.push("");
    lines.push(pyTripleEscape(description));
  }
  lines.push("");
  lines.push("Use ONLY your assigned tools; hand findings to the next stage.");
  lines.push("");
  lines.push(sharedAgentGuardrails(contract));
  return lines.join("\n");
}

export function deriveAgentWorkflow({ behaviorContract, architecture, manifest } = {}) {
  const contract = behaviorContract || manifest?.useCaseSpec?.behaviorContract || null;
  const tables = manifest?.tables || [];
  const toolIntents = Array.isArray(contract?.toolIntents) ? contract.toolIntents : [];

  // The universe of tool names a sub-agent is allowed to reference: the canonical
  // names the generator emits for each tool intent. Anything outside this set is
  // dropped so sub-agents never reference a missing tool.
  const intentToCanonical = new Map();
  const validToolNames = new Set();
  for (const intent of toolIntents) {
    const canonical = canonicalIntentToolName(intent, tables);
    if (canonical) {
      intentToCanonical.set(intent, canonical);
      validToolNames.add(canonical);
    }
  }

  const single = () => ({ topology: "single", steps: [] });
  if (!validToolNames.size) return single();

  // ── Source 1: explicit behaviorContract.workflow ───────────
  const explicit = contract?.workflow;
  let rawSteps = null;
  let explicitMode = null;
  let explicitParallel = false;
  if (explicit && Array.isArray(explicit.steps) && explicit.steps.length) {
    explicitMode = explicit.mode === "parallel" ? "parallel" : (explicit.mode === "sequential" ? "sequential" : null);
    rawSteps = explicit.steps.map((step, index) => {
      const declared = Array.isArray(step.tools) ? step.tools : [];
      // Resolve declared tool refs to canonical names: accept either a canonical
      // name directly, or an intent name / safe name that maps to one.
      const resolved = [];
      for (const ref of declared) {
        if (validToolNames.has(ref)) { resolved.push(ref); continue; }
        const safe = safePyName(ref);
        if (validToolNames.has(safe)) { resolved.push(safe); continue; }
        const matchIntent = toolIntents.find((intent) => safePyName(intent.name || "") === safe);
        if (matchIntent && intentToCanonical.has(matchIntent)) resolved.push(intentToCanonical.get(matchIntent));
      }
      if (step.parallel) explicitParallel = true;
      return {
        id: safePyName(step.id || step.label || `stage_${index + 1}`, `stage_${index + 1}`),
        label: step.label || step.id || `Stage ${index + 1}`,
        description: step.description || step.role || "",
        toolNames: Array.from(new Set(resolved)),
        parallel: Boolean(step.parallel),
      };
    });
  }

  // ── Source 2: derive from architecture.pipeline ────────────
  // The stage→tool matching lives in the shared agent-workflow module so spec
  // authoring (buildWorkflowFromPipeline) and build-time derivation never drift.
  // Here we resolve each intent to its canonical tool name; the shared matcher
  // does the identical stage-text matching used at authoring time.
  if (!rawSteps) {
    const pipeline = Array.isArray(architecture?.pipeline)
      ? architecture.pipeline
      : (Array.isArray(manifest?.useCaseSpec?.architecture?.pipeline) ? manifest.useCaseSpec.architecture.pipeline : []);
    if (!pipeline.length) return single();
    const matched = matchPipelineSteps({
      pipeline,
      toolIntents,
      resolveName: (intent) => intentToCanonical.get(intent) || null,
    });
    rawSteps = matched.rawSteps;
  }

  // ── Normalize: keep ids unique, intersect against valid tools ─
  const seenIds = new Set();
  let steps = rawSteps.map((step, index) => {
    // Collapse the runs of underscores snakeCase leaves behind (e.g. "A & B" ->
    // "a__b") so sub-agent variable names read cleanly and stay valid identifiers.
    let id = (step.id || `stage_${index + 1}`).replace(/_+/g, "_").replace(/^_+|_+$/g, "") || `stage_${index + 1}`;
    if (seenIds.has(id)) {
      let suffix = 2;
      while (seenIds.has(`${id}_${suffix}`)) suffix++;
      id = `${id}_${suffix}`;
    }
    seenIds.add(id);
    const toolNames = (step.toolNames || []).filter((name) => validToolNames.has(name));
    return { ...step, id, toolNames };
  });

  // Drop steps with zero resolved tools (they cannot run any work).
  const toolBearing = steps.filter((step) => step.toolNames.length > 0);

  // Topology decision. A real pipeline requires: >=2 steps, >=2 distinct tools
  // covered collectively, and >=2 tool-bearing steps.
  const distinctTools = new Set();
  for (const step of toolBearing) for (const name of step.toolNames) distinctTools.add(name);
  const isRealPipeline = toolBearing.length >= 2 && distinctTools.size >= 2;
  if (!isRealPipeline) return single();

  const parallel = explicitMode === "parallel" || (explicitMode == null && explicitParallel);
  const topology = parallel ? "parallel" : "sequential";

  const finalSteps = toolBearing.map((step) => ({
    id: step.id,
    label: step.label,
    instruction: buildStepInstruction({ label: step.label, description: step.description, contract }),
    toolNames: step.toolNames,
  }));

  return { topology, steps: finalSteps };
}
