// The shipped agent-spec quality validators, moved VERBATIM from
// apps/factory/src/agent-spec-registry.js (WS2 Step 4).
//
// Their `{ ok, maturity, gaps }` output — every gap string and maturity
// value — is a byte-stable contract consumed downstream (audit tooling, the
// interviewing-specs skill, @ge/std/spec-gaps gap codes) and is pinned by
// tests/parity.test.mjs over the full on-disk corpus. Do NOT rewrite this as
// zod safeParse + error mapping: the zod schemas in ./schema.ts are the
// shape/type authority for NEW consumers; these imperative checks are the
// shipped gate.

import { REQUIRED_BEHAVIOR_FIELDS } from "./constants.mjs";

export function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item != null);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

export function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateGenerationSpec(spec) {
  const gaps = [];
  if (!spec || typeof spec !== "object") {
    return { ok: false, maturity: "missing_spec", gaps: ["missing_generation_spec"] };
  }

  const sourceSystems = asArray(spec.sourceSystems);
  const entities = asArray(spec.entities);
  const documents = asArray(spec.documents);
  const apis = asArray(spec.apis);
  const anomalies = asArray(spec.anomalies);
  const behavior = spec.behaviorContract || null;
  const toolIntents = asArray(behavior?.toolIntents);
  const rowPolicy = spec.rowPolicy || null;

  if (!spec.version) gaps.push("missing_generation_spec_version");
  if (!rowPolicy) {
    gaps.push("missing_row_policy");
  } else {
    if (!Number.isFinite(Number(rowPolicy.defaultRowsPerEntity))) gaps.push("row_policy_missing_defaultRowsPerEntity");
    if (!Number.isFinite(Number(rowPolicy.minimumRowsPerEntity))) gaps.push("row_policy_missing_minimumRowsPerEntity");
    if (!nonEmptyString(rowPolicy.rationale)) gaps.push("row_policy_missing_rationale");
  }
  if (!sourceSystems.length) gaps.push("missing_source_systems");
  if (!entities.length) gaps.push("missing_schema_contracts");
  if (!documents.length) gaps.push("missing_documents");
  if (!anomalies.length) gaps.push("missing_mock_data_anomalies");
  if (!spec.datastorePackaging || typeof spec.datastorePackaging !== "object") gaps.push("missing_datastore_packaging");
  if (!spec.validation?.smokePrompt) gaps.push("missing_validation_smoke_prompt");
  if (!Array.isArray(spec.validation?.assertions) || spec.validation.assertions.length < 2) gaps.push("validation_assertions_thin");

  if (!behavior) {
    gaps.push("missing_behavior_contract");
  } else {
    for (const field of REQUIRED_BEHAVIOR_FIELDS) {
      const value = behavior[field];
      const empty = value == null
        || (Array.isArray(value) && value.length === 0)
        || (typeof value === "string" && value.trim().length === 0);
      if (empty) gaps.push(`behavior_missing_${field}`);
    }
    if (nonEmptyString(behavior.primaryObjective) && behavior.primaryObjective.length < 60) {
      gaps.push("behavior_objective_too_short");
    }
    if (!toolIntents.length) {
      gaps.push("behavior_missing_toolIntents");
    } else {
      if (!toolIntents.some((intent) => intent.kind === "query")) gaps.push("behavior_missing_query_intent");
      if (!toolIntents.some((intent) => intent.kind === "evidence_lookup")) gaps.push("behavior_missing_evidence_lookup");
      if (toolIntents.length < 3) gaps.push("behavior_tool_intents_thin");
    }
    if (asArray(behavior.inScope).length < 2) gaps.push("behavior_in_scope_thin");
    if (asArray(behavior.outOfScope).length < 2) gaps.push("behavior_out_of_scope_thin");
    if (asArray(behavior.evidenceRequirements).length < 1) gaps.push("behavior_missing_evidence_requirements");
    if (asArray(behavior.escalationRules).length < 2) gaps.push("behavior_escalation_rules_thin");
    if (asArray(behavior.refusalRules).length < 2) gaps.push("behavior_refusal_rules_thin");
    if (asArray(behavior.goldenEvals).length < 1) gaps.push("behavior_missing_golden_evals");
  }

  const sourceSystemIds = new Set(sourceSystems.map((system) => system.id).filter(Boolean));
  for (const system of sourceSystems) {
    const id = system?.id || "unknown";
    if (!system.id) gaps.push("source_system_missing_id");
    if (!system.name) gaps.push(`source_system_missing_name:${id}`);
    if (!asArray(system.owns).length) gaps.push(`source_system_missing_owns:${id}`);
    if (!nonEmptyString(system.protocol)) gaps.push(`source_system_missing_protocol:${id}`);
    if (!asArray(system.localBacking).length) gaps.push(`source_system_missing_local_backing:${id}`);
    if (!asArray(system.toolNames).length) gaps.push(`source_system_missing_tool_names:${id}`);
    if (!asArray(system.evidence).length) gaps.push(`source_system_missing_evidence:${id}`);
  }
  for (const entity of entities) {
    if (!entity.name) gaps.push("entity_missing_name");
    if (!entity.primaryKey) gaps.push(`entity_missing_pk:${entity.name || "unknown"}`);
    if (!Array.isArray(entity.columns) || entity.columns.length < 3) gaps.push(`entity_columns_thin:${entity.name || "unknown"}`);
    if (!entity.datastore) gaps.push(`entity_missing_datastore:${entity.name || "unknown"}`);
    if (!Number.isFinite(Number(entity.rowCount))) gaps.push(`entity_missing_row_count:${entity.name || "unknown"}`);
    if (entity.sourceSystemId && sourceSystemIds.size && !sourceSystemIds.has(entity.sourceSystemId)) {
      gaps.push(`entity_unknown_source_system:${entity.name || "unknown"}`);
    }
  }
  for (const document of documents) {
    const id = document?.id || "unknown";
    if (!document.id) gaps.push("document_missing_id");
    if (!document.title) gaps.push(`document_missing_title:${id}`);
    if (!asArray(document.requiredSections).length) gaps.push(`document_missing_required_sections:${id}`);
    if (!asArray(document.citationAnchors).length) gaps.push(`document_missing_citation_anchors:${id}`);
    if (!Number.isFinite(Number(document.minimumWordCount))) gaps.push(`document_missing_minimum_word_count:${id}`);
  }
  for (const api of apis) {
    const id = api?.id || "unknown";
    if (!api.method) gaps.push(`api_missing_method:${id}`);
    if (!api.path) gaps.push(`api_missing_path:${id}`);
    if (!api.requestSchema || !api.responseSchema) gaps.push(`api_missing_schema:${id}`);
  }
  for (const anomaly of anomalies) {
    const id = anomaly?.id || "unknown";
    if (!anomaly.description) gaps.push(`anomaly_missing_description:${id}`);
    if (!asArray(anomaly.affectedEntities).length) gaps.push(`anomaly_missing_affected_entities:${id}`);
    if (!asArray(anomaly.expectedEvidence).length) gaps.push(`anomaly_missing_expected_evidence:${id}`);
  }
  for (const intent of toolIntents) {
    if (!intent.name) gaps.push("tool_intent_missing_name");
    if (!intent.kind) gaps.push(`tool_intent_missing_kind:${intent.name || "unknown"}`);
    if (!intent.description) gaps.push(`tool_intent_missing_description:${intent.name || "unknown"}`);
    if (!asArray(intent.requiredInputs).length) gaps.push(`tool_intent_missing_required_inputs:${intent.name || "unknown"}`);
    if (!asArray(intent.produces).length) gaps.push(`tool_intent_missing_produces:${intent.name || "unknown"}`);
    if (!asArray(intent.evidenceEmitted).length) gaps.push(`tool_intent_missing_evidence_emitted:${intent.name || "unknown"}`);
    if (intent.sourceSystemId && sourceSystemIds.size && !sourceSystemIds.has(intent.sourceSystemId)) {
      gaps.push(`tool_intent_unknown_source_system:${intent.name || "unknown"}`);
    }
  }

  return {
    ok: gaps.length === 0,
    maturity: gaps.length === 0 ? "explicit_production_spec" : "explicit_but_weak_spec",
    gaps,
  };
}

export function validateCatalogParity(raw, generationSpec = raw?.generationSpec || raw?.spec || raw?.agentSpec || null) {
  const gaps = [];
  if (!nonEmptyString(raw?.subtitle)) gaps.push("missing_subtitle");
  if (!nonEmptyString(raw?.persona || raw?.ownerPersona || raw?.stakeholder)) gaps.push("missing_persona");
  if (asArray(raw?.kpis).length < 2) gaps.push("kpis_thin");
  for (const [index, kpi] of asArray(raw?.kpis).entries()) {
    if (!kpi?.label || !kpi?.before || !kpi?.after) gaps.push(`kpi_missing_before_after:${index + 1}`);
  }
  if (asArray(raw?.statusQuo || raw?.asIs || raw?.currentState).length < 2) gaps.push("status_quo_thin");
  if (asArray(raw?.agentification || raw?.toBe || raw?.futureState).length < 2) gaps.push("agentification_thin");
  if (asArray(raw?.architecture?.connections || raw?.connections).length < Math.min(2, Math.max(1, asArray(generationSpec?.sourceSystems).length))) gaps.push("architecture_connections_thin");
  if (asArray(raw?.architecture?.pipeline || raw?.pipeline).length < 3) gaps.push("architecture_pipeline_thin");
  return gaps;
}

export function validateAgentSpecQuality(raw) {
  const generationSpec = raw?.generationSpec || raw?.spec || raw?.agentSpec || null;
  const generation = validateGenerationSpec(generationSpec);
  const parityGaps = validateCatalogParity(raw, generationSpec);
  const gaps = [...generation.gaps, ...parityGaps];
  return {
    ok: gaps.length === 0,
    maturity: gaps.length === 0 ? "factory_grade_catalog_spec" : "explicit_but_not_catalog_grade",
    gaps,
  };
}
