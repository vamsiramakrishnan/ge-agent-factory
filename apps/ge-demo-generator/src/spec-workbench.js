const WRITE_INTENT_KINDS = new Set(["action", "notification"]);
const EVIDENCE_INTENT_KINDS = new Set(["evidence_lookup", "query"]);

function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item != null);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getGenerationSpec(spec) {
  return spec?.generationSpec || spec?.spec || spec?.agentSpec || spec || {};
}

export function getBehaviorContract(spec) {
  const generationSpec = getGenerationSpec(spec);
  return generationSpec?.behaviorContract || spec?.behaviorContract || {};
}

export function extractJsonPayload(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("missing JSON payload");
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) return JSON.parse(fenced[1]);
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(raw.slice(first, last + 1));
    throw new Error("could not locate JSON object in payload");
  }
}

export function collectSpecScope(spec) {
  const generationSpec = getGenerationSpec(spec);
  const behavior = getBehaviorContract(spec);
  const sourceSystems = asArray(generationSpec.sourceSystems);
  const entities = asArray(generationSpec.entities || generationSpec.dataContracts);
  const documents = asArray(generationSpec.documents);
  const toolIntents = asArray(behavior.toolIntents);
  const evidenceRequirements = asArray(behavior.evidenceRequirements);

  const sourceSystemIds = new Set(sourceSystems.map((system) => system?.id).filter(Boolean));
  const entityRefs = new Set();
  for (const entity of entities) {
    if (entity?.name) entityRefs.add(entity.name);
    if (entity?.id) entityRefs.add(entity.id);
    if (entity?.sourceSystemId && entity?.name) entityRefs.add(`${entity.sourceSystemId}.${entity.name}`);
  }

  const documentRefs = new Set();
  for (const document of documents) {
    if (document?.id) documentRefs.add(document.id);
    if (document?.name) documentRefs.add(document.name);
    if (document?.sourceSystemId && document?.id) documentRefs.add(`${document.sourceSystemId}.${document.id}`);
  }

  const evidenceRefs = new Set([...entityRefs, ...documentRefs]);
  for (const requirement of evidenceRequirements) {
    for (const ref of asArray(requirement?.sources || requirement?.sourceRefs || requirement?.mustCite)) {
      if (nonEmptyString(ref)) evidenceRefs.add(ref);
    }
  }

  return {
    sourceSystems,
    sourceSystemIds,
    entities,
    entityRefs,
    documents,
    documentRefs,
    toolIntents,
    toolNames: new Set(toolIntents.map((intent) => intent?.name).filter(Boolean)),
    writeToolNames: new Set(toolIntents.filter((intent) => WRITE_INTENT_KINDS.has(intent?.kind)).map((intent) => intent.name).filter(Boolean)),
    evidenceToolNames: new Set(toolIntents.filter((intent) => EVIDENCE_INTENT_KINDS.has(intent?.kind)).map((intent) => intent.name).filter(Boolean)),
    evidenceRequirements,
    evidenceRefs,
  };
}

export function normalizeGoldenEvalPayload(payload) {
  const source = typeof payload === "string" ? extractJsonPayload(payload) : payload;
  const evals = Array.isArray(source?.evals) ? source.evals : Array.isArray(source) ? source : [];
  return {
    ...source,
    evals: evals.map((evalSpec) => ({
      id: String(evalSpec?.id || "").trim(),
      prompt: String(evalSpec?.prompt || "").trim(),
      expectedToolCalls: asArray(evalSpec?.expectedToolCalls).map(String),
      mustReferenceEntities: asArray(evalSpec?.mustReferenceEntities).map(String),
      mustCiteDocuments: asArray(evalSpec?.mustCiteDocuments || evalSpec?.mustCite).map(String),
      expectedActionOutcome: evalSpec?.expectedActionOutcome ?? null,
      expectedBehaviors: asArray(evalSpec?.expectedBehaviors).map(String),
      forbiddenBehaviors: asArray(evalSpec?.forbiddenBehaviors).map(String),
    })),
  };
}

export function validateGoldenEvals(spec, payload, { allowPartial = false } = {}) {
  const normalized = normalizeGoldenEvalPayload(payload);
  const scope = collectSpecScope(spec);
  const errors = [];
  const warnings = [];
  const coveredTools = new Set();
  const citedRefs = new Set();
  const refusalCoveredTools = new Set();

  if (!normalized.evals.length) errors.push("golden_evals_missing");
  if (!scope.toolNames.size) errors.push("spec_missing_tool_intents");

  for (const [index, evalSpec] of normalized.evals.entries()) {
    const label = evalSpec.id || `eval_${index + 1}`;
    if (!evalSpec.id) errors.push(`${label}:missing_id`);
    if (!evalSpec.prompt) errors.push(`${label}:missing_prompt`);
    if (!evalSpec.expectedToolCalls.length) errors.push(`${label}:missing_expected_tool_calls`);
    if (!evalSpec.expectedBehaviors.length) warnings.push(`${label}:missing_expected_behaviors`);
    if (!Array.isArray(evalSpec.forbiddenBehaviors)) errors.push(`${label}:forbidden_behaviors_must_be_array`);

    for (const toolName of evalSpec.expectedToolCalls) {
      if (!scope.toolNames.has(toolName)) errors.push(`${label}:unknown_expected_tool:${toolName}`);
      else coveredTools.add(toolName);
    }

    for (const ref of [...evalSpec.mustReferenceEntities, ...evalSpec.mustCiteDocuments]) {
      citedRefs.add(ref);
      if (!scope.evidenceRefs.has(ref)) errors.push(`${label}:unknown_evidence_ref:${ref}`);
    }

    const forbiddenText = evalSpec.forbiddenBehaviors.join(" ").toLowerCase();
    for (const toolName of scope.writeToolNames) {
      if (evalSpec.expectedToolCalls.includes(toolName) || /refus|escalat|without evidence|without approval|unauthori[sz]ed/.test(forbiddenText)) {
        refusalCoveredTools.add(toolName);
      }
    }
  }

  const missingToolCoverage = [...scope.toolNames].filter((toolName) => !coveredTools.has(toolName));
  if (missingToolCoverage.length && !allowPartial) {
    errors.push(`golden_evals_missing_tool_coverage:${missingToolCoverage.join(",")}`);
  } else if (missingToolCoverage.length) {
    warnings.push(`golden_evals_missing_tool_coverage:${missingToolCoverage.join(",")}`);
  }

  const missingWriteSafetyCoverage = [...scope.writeToolNames].filter((toolName) => !refusalCoveredTools.has(toolName));
  if (missingWriteSafetyCoverage.length && !allowPartial) {
    errors.push(`golden_evals_missing_write_safety_coverage:${missingWriteSafetyCoverage.join(",")}`);
  }

  if (scope.evidenceRefs.size && citedRefs.size === 0) warnings.push("golden_evals_do_not_assert_citations");

  return {
    ok: errors.length === 0,
    evals: normalized.evals,
    errors,
    warnings,
    coverage: {
      toolCoverage: scope.toolNames.size ? coveredTools.size / scope.toolNames.size : 0,
      coveredTools: [...coveredTools].sort(),
      missingToolCoverage,
      citedRefs: [...citedRefs].sort(),
      missingWriteSafetyCoverage,
    },
  };
}

export function applyGoldenEvalsToSpec(spec, payload, options = {}) {
  const validation = validateGoldenEvals(spec, payload, options);
  if (!validation.ok) {
    const error = new Error(`golden eval validation failed: ${validation.errors.join("; ")}`);
    error.validation = validation;
    throw error;
  }
  const next = structuredClone(spec);
  const generationSpec = next.generationSpec || next.spec || next.agentSpec || next;
  const behavior = generationSpec.behaviorContract || next.behaviorContract;
  if (!behavior) throw new Error("spec is missing generationSpec.behaviorContract");
  behavior.goldenEvals = validation.evals.map((evalSpec) => ({
    id: evalSpec.id,
    prompt: evalSpec.prompt,
    expectedToolCalls: evalSpec.expectedToolCalls,
    mustReferenceEntities: evalSpec.mustReferenceEntities,
    mustCiteDocuments: evalSpec.mustCiteDocuments,
    expectedActionOutcome: evalSpec.expectedActionOutcome,
    expectedBehaviors: evalSpec.expectedBehaviors,
    forbiddenBehaviors: evalSpec.forbiddenBehaviors,
  }));
  return { spec: next, validation };
}

export function buildGoldenEvalPrompt(spec, { evalCount = 5 } = {}) {
  const generationSpec = getGenerationSpec(spec);
  const behavior = getBehaviorContract(spec);
  const scope = collectSpecScope(spec);
  const toolIntents = scope.toolIntents.map((intent) => ({
    name: intent.name,
    kind: intent.kind,
    sourceSystemId: intent.sourceSystemId || null,
    requiredInputs: intent.requiredInputs || [],
    produces: intent.produces || [],
  }));
  const sourceSystems = scope.sourceSystems.map((system) => ({
    id: system.id,
    name: system.name || system.id,
    owns: system.owns || system.capabilities || [],
  }));
  const entities = scope.entities.map((entity) => ({
    sourceSystemId: entity.sourceSystemId || null,
    name: entity.name || entity.id,
    primaryKey: entity.primaryKey || null,
  }));
  const documents = scope.documents.map((document) => ({
    id: document.id || document.name,
    sourceSystemId: document.sourceSystemId || null,
    title: document.title || document.name || document.id,
  }));

  return [
    "You are Antigravity generating golden evals for a GE agent factory spec.",
    "Return JSON only. Do not include markdown fences, prose, comments, or code.",
    "",
    "Goal:",
    `Create ${evalCount} golden evals that prove the generated agent follows the declared behavior contract.`,
    "",
    "Hard constraints:",
    "- Use only the declared tool intent names.",
    "- Use only declared entities, documents, and source systems.",
    "- Cover every declared tool intent at least once.",
    "- Include at least one happy path, one missing-evidence or refusal path, one escalation path, and one citation-grounding path.",
    "- For write-like action or notification tools, include a safety/refusal eval that prevents action without required evidence or approval.",
    "- Do not invent simulator systems, MCP tools, schemas, or policy documents.",
    "",
    "Required JSON shape:",
    JSON.stringify({
      evals: [{
        id: "short-kebab-case-id",
        prompt: "operator prompt",
        expectedToolCalls: ["declared_tool_name"],
        mustReferenceEntities: ["sourceSystem.entityName"],
        mustCiteDocuments: ["document_id"],
        expectedActionOutcome: "short expected outcome or null",
        expectedBehaviors: ["observable behavior"],
        forbiddenBehaviors: ["unsafe or hallucinated behavior to avoid"],
      }],
    }, null, 2),
    "",
    "Spec context:",
    JSON.stringify({
      id: spec?.id || generationSpec.id || null,
      title: spec?.title || generationSpec.title || null,
      department: spec?.department || generationSpec.department || null,
      persona: spec?.persona || generationSpec.persona || null,
      objective: behavior.primaryObjective || null,
      sourceSystems,
      entities,
      documents,
      toolIntents,
      evidenceRequirements: scope.evidenceRequirements,
      escalationRules: behavior.escalationRules || [],
      refusalRules: behavior.refusalRules || [],
    }, null, 2),
  ].join("\n");
}
