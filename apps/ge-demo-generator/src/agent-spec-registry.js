import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";

export const AGENT_SPEC_SCHEMA_VERSION = 1;
export const INTERVIEW_SPEC_DIR = "catalog/interview-specs";

export const REQUIRED_BEHAVIOR_FIELDS = [
  "role",
  "primaryObjective",
  "inScope",
  "outOfScope",
  "toolIntents",
  "evidenceRequirements",
  "escalationRules",
  "refusalRules",
  "goldenEvals",
];

export function slug(value, max = 96) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);
}

export function sourceSystemId(system) {
  return String(system || "source_system")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "source_system";
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item != null);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function nonEmptyString(value) {
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

export function normalizeAgentSpecEntry(raw, {
  sourceKind = "unknown",
  sourcePath = null,
  repoRoot = process.cwd(),
  registeredAt = null,
} = {}) {
  const generationSpec = raw.generationSpec || raw.spec || raw.agentSpec || null;
  const id = slug(raw.id || raw.useCaseId || raw.title);
  if (!id) throw new Error("agent spec entry requires id or title");
  if (!nonEmptyString(raw.title)) throw new Error(`agent spec ${id} requires title`);
  if (!nonEmptyString(raw.department)) throw new Error(`agent spec ${id} requires department`);

  const systems = asArray(raw.systems?.length ? raw.systems : generationSpec?.sourceSystems?.map((system) => system.name || system.id));
  const quality = validateAgentSpecQuality(raw);
  const variant = normalizeVariantMetadata(raw, id);
  const relativeSourcePath = sourcePath
    ? (sourcePath.startsWith("..") || sourcePath.startsWith(".") ? sourcePath : relative(repoRoot, sourcePath))
    : raw.sourcePath || null;

  return {
    id,
    title: raw.title.trim(),
    department: raw.department.trim(),
    sourcePath: relativeSourcePath,
    subtitle: raw.subtitle || "",
    persona: raw.persona || raw.ownerPersona || raw.stakeholder || "",
    layer: raw.layer || "Layer 3: Custom ADK",
    triggerType: raw.triggerType || raw.trigger || "on-demand",
    domainId: raw.domainId || raw.domain || null,
    systems,
    kpis: asArray(raw.kpis),
    statusQuo: asArray(raw.statusQuo || raw.asIs || raw.currentState),
    agentification: asArray(raw.agentification || raw.toBe || raw.futureState),
    architecture: {
      connections: asArray(raw.architecture?.connections || raw.connections),
      pipeline: asArray(raw.architecture?.pipeline || raw.pipeline),
    },
    generationSpec,
    hasBehaviorContract: Boolean(generationSpec?.behaviorContract?.toolIntents?.length),
    registry: {
      schemaVersion: AGENT_SPEC_SCHEMA_VERSION,
      sourceKind,
      sourcePath: relativeSourcePath,
      familyId: raw.familyId || raw.registry?.familyId || variant.familyId,
      variant,
      lineage: normalizeLineage(raw, variant),
      registeredAt: registeredAt || raw.registry?.registeredAt || null,
      build: {
        enabled: quality.ok,
        reason: quality.ok ? "production spec passed registry quality gates" : "spec is retained but not buildable until gaps are fixed",
      },
      quality,
      provenance: {
        interviewId: raw.interviewId || raw.registry?.provenance?.interviewId || null,
        author: raw.author || raw.registry?.provenance?.author || null,
        sourceArtifact: raw.sourceArtifact || raw.registry?.provenance?.sourceArtifact || null,
      },
    },
  };
}

function normalizeVariantMetadata(raw, id) {
  const variant = raw.variant || raw.registry?.variant || {};
  const familyId = slug(raw.familyId || raw.registry?.familyId || variant.familyId || raw.baseUseCaseId || raw.baseId || id);
  const variantId = slug(variant.variantId || raw.variantId || id);
  return {
    familyId,
    variantId,
    variantOf: slug(variant.variantOf || raw.variantOf || raw.baseUseCaseId || raw.baseId || ""),
    label: variant.label || raw.variantLabel || (variant.variantOf || raw.variantOf || raw.baseUseCaseId ? "Derived variant" : "Canonical"),
    dimensions: {
      logic: asArray(variant.dimensions?.logic || raw.logicChanges),
      systems: asArray(variant.dimensions?.systems || raw.systemChanges),
      persona: asArray(variant.dimensions?.persona || raw.personaChanges),
      jurisdiction: asArray(variant.dimensions?.jurisdiction || raw.jurisdictionChanges),
      dataShape: asArray(variant.dimensions?.dataShape || raw.dataShapeChanges),
      policy: asArray(variant.dimensions?.policy || raw.policyChanges),
    },
    invariants: asArray(variant.invariants || raw.invariants),
    changeSummary: asArray(variant.changeSummary || raw.changeSummary),
  };
}

function normalizeLineage(raw, variant) {
  const lineage = raw.lineage || raw.registry?.lineage || {};
  return {
    baseUseCaseId: slug(lineage.baseUseCaseId || raw.baseUseCaseId || raw.baseId || variant.variantOf || ""),
    baseSpecVersion: lineage.baseSpecVersion || raw.baseSpecVersion || null,
    refinementMethod: lineage.refinementMethod || raw.refinementMethod || (variant.variantOf ? "spec_refinement" : "original_authoring"),
    refinementPromptPath: lineage.refinementPromptPath || raw.refinementPromptPath || null,
    sourceDiffPath: lineage.sourceDiffPath || raw.sourceDiffPath || null,
    compatibility: {
      preserveBehaviorContract: lineage.compatibility?.preserveBehaviorContract ?? raw.preserveBehaviorContract ?? false,
      preserveEvalIds: lineage.compatibility?.preserveEvalIds ?? raw.preserveEvalIds ?? false,
      preserveSourceSystemIds: lineage.compatibility?.preserveSourceSystemIds ?? raw.preserveSourceSystemIds ?? false,
    },
  };
}

export function mergeAgentSpecEntries(entries) {
  const seen = new Map();
  const merged = [];
  for (const entry of entries) {
    const prior = seen.get(entry.id);
    if (prior) {
      throw new Error(`duplicate agent spec id "${entry.id}" from ${entry.sourcePath || entry.registry?.sourceKind}; already used by ${prior.sourcePath || prior.registry?.sourceKind}`);
    }
    seen.set(entry.id, entry);
    merged.push(entry);
  }
  return sortAgentSpecEntries(merged);
}

export function sortAgentSpecEntries(entries) {
  return [...entries].sort((a, b) => (
    String(a.department || "").localeCompare(String(b.department || ""))
    || String(a.title || "").localeCompare(String(b.title || ""))
  ));
}

async function walkJson(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return out;
    throw error;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walkJson(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out.sort();
}

export async function loadInterviewSpecEntries({ repoRoot, dir = join(repoRoot, INTERVIEW_SPEC_DIR) } = {}) {
  const files = await walkJson(dir);
  const entries = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(file, "utf8"));
    entries.push(normalizeAgentSpecEntry(raw, {
      sourceKind: "interview",
      sourcePath: file,
      repoRoot,
      registeredAt: raw.registry?.registeredAt || raw.registeredAt || null,
    }));
  }
  return entries;
}

export async function writeInterviewSpecEntry({ repoRoot, entry, dir = join(repoRoot, INTERVIEW_SPEC_DIR), allowDraft = false } = {}) {
  const normalized = normalizeAgentSpecEntry(entry, {
    sourceKind: "interview",
    sourcePath: join(dir, `${slug(entry.id || entry.title)}.json`),
    repoRoot,
    registeredAt: new Date().toISOString(),
  });
  if (!allowDraft && !normalized.registry.quality.ok) {
    throw new Error(`interview spec is not buildable: ${normalized.registry.quality.gaps.join(", ")}`);
  }
  const outPath = join(dir, `${normalized.id}.json`);
  await mkdir(dir, { recursive: true });
  await writeFile(outPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return { entry: normalized, path: outPath, file: basename(outPath) };
}

export function registrySummary(entries) {
  return {
    total: entries.length,
    buildable: entries.filter((entry) => entry.registry?.build?.enabled).length,
    bySource: entries.reduce((acc, entry) => {
      const source = entry.registry?.sourceKind || "unknown";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {}),
    byDepartment: entries.reduce((acc, entry) => {
      const department = entry.department || "unknown";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {}),
    families: entries.reduce((acc, entry) => {
      const family = entry.registry?.familyId || entry.id;
      acc[family] = (acc[family] || 0) + 1;
      return acc;
    }, {}),
  };
}

export function defaultInterviewSpecPath(repoRoot) {
  return resolve(repoRoot, INTERVIEW_SPEC_DIR);
}
