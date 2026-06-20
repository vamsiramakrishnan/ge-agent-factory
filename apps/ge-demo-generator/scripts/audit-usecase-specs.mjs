#!/usr/bin/env node
/**
 * Audit upstream TSX use-case specs and report maturity.
 *
 * Classifies each use case under src/components/slides/use-cases into one of:
 *   - explicit_production_spec   : explicit generationSpec + behaviorContract that
 *                                  meets the check-usecase-spec validator's bar.
 *   - explicit_but_weak_spec     : explicit generationSpec present but missing
 *                                  one or more production-grade pieces.
 *   - synthesized_only           : no explicit generationSpec, would fall through
 *                                  to synthesizeGenerationSpec in the sync script.
 *
 * Per use case we also surface specific gaps:
 *   - missing_source_systems, missing_behavior_contract,
 *     missing_schema_contracts, missing_documents,
 *     missing_action_or_api_intents
 *
 * Suggestions reuse the slide's declared systems / architecture / kpis so the
 * factory and human reviewers can scaffold a real spec quickly.
 *
 * Outputs:
 *   apps/ge-demo-generator/artifacts/usecase-spec-audit.json
 *   apps/ge-demo-generator/artifacts/usecase-spec-audit.md
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { loadInterviewSpecEntries } from "../src/agent-spec-registry.js";
import { buildWorkflowFromPipeline } from "./ge-mock/agent-workflow.mjs";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const monorepoRoot = resolve(repoRoot, "..", "..");
const sourceRoot = resolve(monorepoRoot, "apps", "presentation", "src", "components", "slides", "use-cases");
const artifactsDir = join(repoRoot, "artifacts");
const jsonPath = join(artifactsDir, "usecase-spec-audit.json");
const markdownPath = join(artifactsDir, "usecase-spec-audit.md");

// ─── Parse helpers (mirror sync-use-cases-from-slides.mjs) ──────────────

function propString(source, name) {
  const match = source.match(new RegExp(`${name}=\\{?"([^"]+)"\\}?`));
  return match?.[1] || "";
}

function propArray(source, name) {
  const match = source.match(new RegExp(`${name}=\\{\\[([\\s\\S]*?)\\]\\}`));
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

function propKpis(source) {
  const match = source.match(/kpis=\{\[([\s\S]*?)\]\}/);
  if (!match) return [];
  return [...match[1].matchAll(/\{\s*label:\s*"([^"]+)",\s*before:\s*"([^"]+)",\s*after:\s*"([^"]+)"/g)]
    .map(([, label, before, after]) => ({ label, before, after }));
}

function architectureConnections(source) {
  const match = source.match(/connections:\s*\[([\s\S]*?)\],\s*pipeline:/);
  if (!match) return [];
  return [...match[1].matchAll(/\{\s*system:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)]
    .map(([, system, description]) => ({ system, description }));
}

function architecturePipeline(source) {
  const match = source.match(/pipeline:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
  if (!match) return [];
  return [...match[1].matchAll(/\{\s*label:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)]
    .map(([, label, description]) => ({ label, description }));
}

function extractConstObject(source, name) {
  const marker = source.match(new RegExp(`const\\s+${name}(?:\\s*:[^=]+)?\\s*=\\s*\\{`));
  if (!marker) return null;
  const start = marker.index + marker[0].lastIndexOf("{");
  let depth = 0;
  let inString = null;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return null;
}

function evalSlideConst(source, targetName) {
  const constNames = [...source.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?\s*=\s*\{/g)]
    .map((match) => match[1]);
  const bindings = [];
  for (const name of constNames) {
    if (name === targetName) continue;
    const literal = extractConstObject(source, name);
    if (literal) bindings.push(`const ${name} = (${literal});`);
  }
  const targetLiteral = extractConstObject(source, targetName);
  if (!targetLiteral) return null;
  bindings.push(`const ${targetName} = (${targetLiteral});`);
  bindings.push(`return ${targetName};`);
  try {
    return Function(`"use strict"; ${bindings.join("\n")}`)();
  } catch {
    return null;
  }
}

// ─── Classification ─────────────────────────────────────────────────────

const REQUIRED_BEHAVIOR_FIELDS = [
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

function hasExplicitGenerationSpec(source) {
  return /const\s+generationSpec(?:\s*:\s*UseCaseGenerationSpec)?\s*=\s*\{/.test(source);
}

function classify(useCase, spec, source) {
  const gaps = [];
  // Non-blocking advisories (don't affect maturity) — currently the "spec should
  // carry a behaviorContract.workflow" hint for multi-stage pipelines.
  const warnings = [];
  const suggestions = {};

  if (!hasExplicitGenerationSpec(source)) {
    return {
      maturity: "synthesized_only",
      gaps: [
        "missing_explicit_generation_spec",
        "missing_source_systems",
        "missing_behavior_contract",
        "missing_schema_contracts",
        "missing_documents",
        "missing_action_or_api_intents",
      ],
      warnings: [],
      suggestions: buildSuggestions(useCase),
    };
  }

  // Has explicit spec — now grade it.
  const sourceSystems = Array.isArray(spec?.sourceSystems) ? spec.sourceSystems : [];
  const entities = Array.isArray(spec?.entities) ? spec.entities : [];
  const documents = Array.isArray(spec?.documents) ? spec.documents : [];
  const apis = Array.isArray(spec?.apis) ? spec.apis : [];
  const behavior = spec?.behaviorContract || null;
  const toolIntents = Array.isArray(behavior?.toolIntents) ? behavior.toolIntents : [];

  if (sourceSystems.length === 0) gaps.push("missing_source_systems");
  if (entities.length === 0) gaps.push("missing_schema_contracts");
  if (documents.length === 0) gaps.push("missing_documents");

  if (!behavior) {
    gaps.push("missing_behavior_contract");
  } else {
    for (const field of REQUIRED_BEHAVIOR_FIELDS) {
      const value = behavior[field];
      const empty = value == null || (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.length === 0);
      if (empty) gaps.push(`behavior_missing_${field}`);
    }
    if (behavior?.primaryObjective && behavior.primaryObjective.length < 60) {
      gaps.push("behavior_objective_too_short");
    }
    if (toolIntents.length > 0) {
      const hasQuery = toolIntents.some((intent) => intent.kind === "query");
      const hasEvidence = toolIntents.some((intent) => intent.kind === "evidence_lookup");
      const hasAction = toolIntents.some((intent) => intent.kind === "action");
      if (!hasQuery) gaps.push("behavior_missing_query_intent");
      if (!hasEvidence) gaps.push("behavior_missing_evidence_lookup");
      // action is only required if workflow changes external state — heuristic:
      // KPI labels mentioning enrollment/submit/ticket/sync imply external action.
      const writesState = /(submit|enroll|ticket|sync|create|approve|notify|publish|deploy|update|escalat|trigger)/i.test(
        JSON.stringify(useCase.kpis || []).concat(JSON.stringify(useCase.agentification || []))
      );
      if (writesState && !hasAction) gaps.push("missing_action_or_api_intents");
    } else {
      gaps.push("behavior_missing_toolIntents");
    }

    // ── Workflow alignment ────────────────────────────────────────────
    // A multi-stage pipeline (>=2 stages) backed by an explicit behavior
    // contract SHOULD carry a self-describing behaviorContract.workflow so the
    // spec and the multi-agent generator stay aligned (single source of truth).
    // Missing workflow → warning. Any workflow step referencing a tool that is
    // not a declared toolIntents[].name → error (the generated agent could wire
    // a sub-agent to a tool that does not exist).
    const pipelineStages = Array.isArray(useCase.architecture?.pipeline)
      ? useCase.architecture.pipeline
      : [];
    if (pipelineStages.length >= 2) {
      // The effective workflow is the one the spec already carries, or the one the
      // shared builder will inject at catalog-sync time (single source of truth).
      // Authoring the workflow into the slide TSX is optional — what matters is
      // that a real multi-stage pipeline resolves to a workflow somewhere.
      const derived = buildWorkflowFromPipeline({ behaviorContract: behavior, architecture: useCase.architecture });
      const workflow = (behavior.workflow?.steps?.length ? behavior.workflow : null) || derived;
      if (!workflow || !Array.isArray(workflow.steps) || workflow.steps.length === 0) {
        // Only warn when the pipeline is a genuine multi-stage narrative whose
        // tool-bearing stages clear the generator's threshold (derived non-null);
        // trivial pipelines legitimately stay single-agent with no workflow.
        if (derived) warnings.push("behavior_missing_workflow");
      } else {
        const declaredNames = new Set(toolIntents.map((intent) => intent.name).filter(Boolean));
        for (const step of workflow.steps) {
          for (const tool of (Array.isArray(step.tools) ? step.tools : [])) {
            if (!declaredNames.has(tool)) {
              gaps.push(`workflow_tool_not_in_toolIntents:${tool}`);
            }
          }
        }
      }
    }
  }

  // APIs are only required when at least one action intent exists.
  const hasActionIntent = toolIntents.some((intent) => intent.kind === "action");
  if (hasActionIntent && apis.length === 0) gaps.push("missing_action_or_api_intents");

  if (entities.length > 0) {
    for (const entity of entities) {
      if ((entity.rowCount || 0) < (spec?.rowPolicy?.minimumRowsPerEntity || 25)) {
        gaps.push(`entity_rows_too_low:${entity.name}`);
      }
      if (!entity.primaryKey) gaps.push(`entity_missing_pk:${entity.name}`);
      if (!Array.isArray(entity.columns) || entity.columns.length < 3) {
        gaps.push(`entity_columns_thin:${entity.name}`);
      }
    }
  }

  const maturity = gaps.length === 0 ? "explicit_production_spec" : "explicit_but_weak_spec";
  if (gaps.length > 0) {
    Object.assign(suggestions, buildSuggestions(useCase));
  }
  return { maturity, gaps, warnings, suggestions };
}

// ─── Suggestions: turn slide-level UI content into spec hints ───────────

function systemId(system) {
  return String(system || "source_system")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "source_system";
}

function buildSuggestions(useCase) {
  const systems = useCase.systems?.length
    ? useCase.systems
    : (useCase.architecture?.connections || []).map((conn) => conn.system);
  const physicalSystems = systems.filter(
    (system) => !/vertex|gemini|llm|ml|ai$/i.test(system)
  );
  const suggestedSourceSystems = physicalSystems.map((system) => {
    const id = systemId(system);
    return {
      id,
      name: system,
      toolNames: [`query_${id}_records`],
      reason: "Derived from slide-level systems",
    };
  });
  const suggestedEntities = physicalSystems.map((system) => {
    const id = systemId(system);
    return {
      name: `${id}_records`,
      sourceSystemId: id,
      requiredColumns: ["id", "source_record_id", "status", "created_at"],
      reason: "Derived from slide-level systems",
    };
  });
  const writesState = /(submit|enroll|ticket|sync|create|approve|notify|publish|deploy|update|escalat|trigger)/i.test(
    JSON.stringify(useCase.kpis || []).concat(JSON.stringify(useCase.agentification || []))
  );
  const suggestedActions = writesState && physicalSystems.length
    ? [
        {
          name: `action_${systemId(physicalSystems[0])}_apply`,
          sourceSystemId: systemId(physicalSystems[0]),
          reason: "KPIs/agentification imply state change — declare an action intent + API + audit trail",
        },
      ]
    : [];
  const suggestedDocuments = [
    {
      id: `${useCase.id}-evidence-guide`,
      type: useCase.department === "finance" ? "policy" : "sop",
      title: `${useCase.title} Evidence Guide`,
      reason: "Every behavior contract should be able to cite at least one workflow document",
    },
  ];
  const suggestedBehaviorIntents = [
    { kind: "query", reason: "At least one read-only lookup is required" },
    { kind: "evidence_lookup", reason: "At least one document citation path is required" },
    ...(writesState
      ? [{ kind: "action", reason: "Workflow changes external state — declare and implement an action tool" }]
      : []),
  ];
  return {
    sourceSystems: suggestedSourceSystems,
    entities: suggestedEntities,
    documents: suggestedDocuments,
    actions: suggestedActions,
    behaviorIntents: suggestedBehaviorIntents,
  };
}

// ─── Walk + run ─────────────────────────────────────────────────────────

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const files = await walk(sourceRoot);
const useCases = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const title = propString(source, "title");
  if (!title) continue;
  const department = relative(sourceRoot, file).split(/[\\/]/)[0];
  const useCase = {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    title,
    department,
    sourcePath: relative(monorepoRoot, file),
    subtitle: propString(source, "subtitle"),
    persona: propString(source, "persona"),
    layer: propString(source, "layer"),
    systems: propArray(source, "systems"),
    kpis: propKpis(source),
    statusQuo: propArray(source, "statusQuo"),
    agentification: propArray(source, "agentification"),
    architecture: {
      connections: architectureConnections(source),
      pipeline: architecturePipeline(source),
    },
  };

  const explicit = hasExplicitGenerationSpec(source);
  const spec = explicit ? evalSlideConst(source, "generationSpec") : null;
  const { maturity, gaps, warnings, suggestions } = classify(useCase, spec, source);

  // Effective workflow = explicit on the spec, or the one catalog-sync will
  // inject via the shared builder (single source of truth). Report against that
  // so the audit reflects what downstream actually consumes from the catalog.
  const explicitWf = spec?.behaviorContract?.workflow?.steps?.length ? spec.behaviorContract.workflow : null;
  const derivedWf = (spec?.behaviorContract?.toolIntents?.length)
    ? buildWorkflowFromPipeline({ behaviorContract: spec.behaviorContract, architecture: useCase.architecture })
    : null;
  const effectiveWf = explicitWf || derivedWf;

  useCases.push({
    ...useCase,
    sourceKind: "slide",
    maturity,
    hasExplicitGenerationSpec: explicit,
    hasBehaviorContract: Boolean(spec?.behaviorContract?.toolIntents?.length),
    hasWorkflow: Boolean(effectiveWf?.steps?.length),
    gaps,
    warnings: warnings || [],
    suggestions,
    specSummary: spec ? {
      sourceSystemCount: spec.sourceSystems?.length || 0,
      entityCount: spec.entities?.length || 0,
      documentCount: spec.documents?.length || 0,
      apiCount: spec.apis?.length || 0,
      toolIntentCount: spec.behaviorContract?.toolIntents?.length || 0,
      goldenEvalCount: spec.behaviorContract?.goldenEvals?.length || 0,
      workflowStepCount: effectiveWf?.steps?.length || 0,
    } : null,
  });
}

for (const entry of await loadInterviewSpecEntries({ repoRoot })) {
  const entryContract = entry.generationSpec?.behaviorContract || null;
  const entryGaps = [...(entry.registry?.quality?.gaps || [])];
  const entryWarnings = [];
  const entryPipeline = Array.isArray(entry.architecture?.pipeline) ? entry.architecture.pipeline : [];
  // Effective workflow = explicit on the spec, or the one catalog-sync injects via
  // the shared builder (single source of truth) — same rule as slide specs.
  const entryExplicitWf = entryContract?.workflow?.steps?.length ? entryContract.workflow : null;
  const entryDerivedWf = entryContract?.toolIntents?.length
    ? buildWorkflowFromPipeline({ behaviorContract: entryContract, architecture: entry.architecture })
    : null;
  const entryWorkflow = entryExplicitWf || entryDerivedWf;
  if (entryContract?.toolIntents?.length && entryPipeline.length >= 2) {
    if (!entryWorkflow?.steps?.length) {
      if (entryDerivedWf) entryWarnings.push("behavior_missing_workflow");
    } else {
      const declaredNames = new Set((entryContract.toolIntents || []).map((intent) => intent.name).filter(Boolean));
      for (const step of entryWorkflow.steps) {
        for (const tool of (Array.isArray(step.tools) ? step.tools : [])) {
          if (!declaredNames.has(tool)) entryGaps.push(`workflow_tool_not_in_toolIntents:${tool}`);
        }
      }
    }
  }
  useCases.push({
    id: entry.id,
    title: entry.title,
    department: entry.department,
    sourceKind: "interview",
    sourcePath: entry.sourcePath,
    subtitle: entry.subtitle,
    persona: entry.persona,
    layer: entry.layer,
    systems: entry.systems,
    kpis: entry.kpis,
    statusQuo: entry.statusQuo,
    agentification: entry.agentification,
    architecture: entry.architecture,
    maturity: entry.registry?.quality?.maturity || "explicit_but_weak_spec",
    hasExplicitGenerationSpec: Boolean(entry.generationSpec),
    hasBehaviorContract: entry.hasBehaviorContract,
    hasWorkflow: Boolean(entryWorkflow?.steps?.length),
    gaps: entryGaps,
    warnings: entryWarnings,
    suggestions: entry.registry?.quality?.ok ? {} : buildSuggestions(entry),
    specSummary: entry.generationSpec ? {
      sourceSystemCount: entry.generationSpec.sourceSystems?.length || 0,
      entityCount: entry.generationSpec.entities?.length || 0,
      documentCount: entry.generationSpec.documents?.length || 0,
      apiCount: entry.generationSpec.apis?.length || 0,
      toolIntentCount: entry.generationSpec.behaviorContract?.toolIntents?.length || 0,
      goldenEvalCount: entry.generationSpec.behaviorContract?.goldenEvals?.length || 0,
      workflowStepCount: entryWorkflow?.steps?.length || 0,
    } : null,
    registry: entry.registry,
  });
}

useCases.sort((a, b) => a.department.localeCompare(b.department) || a.title.localeCompare(b.title));

const totals = {
  total: useCases.length,
  byMaturity: useCases.reduce((acc, item) => {
    acc[item.maturity] = (acc[item.maturity] || 0) + 1;
    return acc;
  }, {}),
  byDepartment: useCases.reduce((acc, item) => {
    acc[item.department] = acc[item.department] || { total: 0, explicit_production_spec: 0, explicit_but_weak_spec: 0, synthesized_only: 0 };
    acc[item.department].total += 1;
    acc[item.department][item.maturity] += 1;
    return acc;
  }, {}),
  bySource: useCases.reduce((acc, item) => {
    const sourceKind = item.sourceKind || "unknown";
    acc[sourceKind] = (acc[sourceKind] || 0) + 1;
    return acc;
  }, {}),
  gapFrequency: useCases.reduce((acc, item) => {
    for (const gap of item.gaps) {
      const key = gap.split(":")[0];
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {}),
  warningFrequency: useCases.reduce((acc, item) => {
    for (const warning of (item.warnings || [])) {
      const key = warning.split(":")[0];
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {}),
  // Workflow alignment: how many explicit-contract specs carry a self-describing
  // behaviorContract.workflow vs. how many of the multi-stage ones still lack one.
  workflow: useCases.reduce((acc, item) => {
    const hasContract = Boolean(item.hasBehaviorContract);
    if (!hasContract) return acc;
    acc.explicitContractSpecs += 1;
    if (item.hasWorkflow) acc.withWorkflow += 1;
    else acc.withoutWorkflow += 1;
    const stages = Array.isArray(item.architecture?.pipeline) ? item.architecture.pipeline.length : 0;
    if (stages >= 2) {
      acc.multiStageSpecs += 1;
      if (!item.hasWorkflow) acc.multiStageMissingWorkflow += 1;
    }
    return acc;
  }, { explicitContractSpecs: 0, withWorkflow: 0, withoutWorkflow: 0, multiStageSpecs: 0, multiStageMissingWorkflow: 0 }),
};

function gapWeight(item) {
  if (item.maturity === "synthesized_only") return 1000;
  if (item.maturity === "explicit_but_weak_spec") return 500 + item.gaps.length;
  return item.gaps.length;
}

const weakest = [...useCases]
  .filter((item) => item.maturity !== "explicit_production_spec")
  .sort((a, b) => gapWeight(b) - gapWeight(a) || a.department.localeCompare(b.department))
  .slice(0, 25);

await mkdir(artifactsDir, { recursive: true });
await writeFile(
  jsonPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), totals, weakest, useCases }, null, 2),
  "utf8"
);

const md = [];
md.push("# Use Case Spec Audit");
md.push("");
md.push(`Generated: ${new Date().toISOString()}`);
md.push("");
md.push(`Total use cases: **${totals.total}**`);
md.push("");
md.push("## Maturity breakdown");
md.push("");
md.push("| Maturity | Count |");
md.push("|---|---|");
for (const [maturity, count] of Object.entries(totals.byMaturity)) {
  md.push(`| ${maturity} | ${count} |`);
}
md.push("");
md.push("## By department");
md.push("");
md.push("| Department | Total | Production | Weak | Synthesized |");
md.push("|---|---|---|---|---|");
for (const [dept, stats] of Object.entries(totals.byDepartment).sort()) {
  md.push(`| ${dept} | ${stats.total} | ${stats.explicit_production_spec} | ${stats.explicit_but_weak_spec} | ${stats.synthesized_only} |`);
}
md.push("");
md.push("## Workflow alignment");
md.push("");
md.push("| Metric | Count |");
md.push("|---|---:|");
md.push(`| Explicit-contract specs | ${totals.workflow.explicitContractSpecs} |`);
md.push(`| ...with behaviorContract.workflow | ${totals.workflow.withWorkflow} |`);
md.push(`| ...without workflow | ${totals.workflow.withoutWorkflow} |`);
md.push(`| Multi-stage (pipeline ≥2) specs | ${totals.workflow.multiStageSpecs} |`);
md.push(`| ...multi-stage missing workflow (warning) | ${totals.workflow.multiStageMissingWorkflow} |`);
md.push("");
md.push("## By source");
md.push("");
md.push("| Source | Count |");
md.push("|---|---:|");
for (const [sourceKind, count] of Object.entries(totals.bySource).sort()) {
  md.push(`| ${sourceKind} | ${count} |`);
}
md.push("");
md.push("## Gap frequency");
md.push("");
md.push("| Gap | Use cases affected |");
md.push("|---|---|");
for (const [gap, count] of Object.entries(totals.gapFrequency).sort((a, b) => b[1] - a[1])) {
  md.push(`| ${gap} | ${count} |`);
}
md.push("");
md.push("## Top 25 weakest use cases");
md.push("");
for (const item of weakest) {
  md.push(`### ${item.title} — \`${item.department}\``);
  md.push("");
  md.push(`- **Source:** \`${item.sourcePath}\``);
  md.push(`- **Source kind:** ${item.sourceKind || "unknown"}`);
  md.push(`- **Maturity:** ${item.maturity}`);
  md.push(`- **Systems (slide):** ${item.systems.join(", ") || "—"}`);
  md.push(`- **Gaps:** ${item.gaps.join(", ") || "—"}`);
  if (item.suggestions?.sourceSystems?.length) {
    md.push(`- **Suggested source systems:** ${item.suggestions.sourceSystems.map((s) => `${s.name} (\`${s.id}\`)`).join(", ")}`);
  }
  if (item.suggestions?.entities?.length) {
    md.push(`- **Suggested entities:** ${item.suggestions.entities.map((e) => e.name).join(", ")}`);
  }
  if (item.suggestions?.actions?.length) {
    md.push(`- **Suggested actions:** ${item.suggestions.actions.map((a) => a.name).join(", ")}`);
  }
  md.push("");
}

await writeFile(markdownPath, md.join("\n"), "utf8");

console.log(`Audited ${useCases.length} use cases`);
console.log(`  ${JSON.stringify(totals.byMaturity)}`);
console.log(`  workflow: ${JSON.stringify(totals.workflow)}`);
if (totals.warningFrequency.behavior_missing_workflow) {
  console.log(`  warning (behavior_missing_workflow): ${totals.warningFrequency.behavior_missing_workflow} multi-stage spec(s) without a workflow`);
}
if (totals.gapFrequency.workflow_tool_not_in_toolIntents) {
  console.log(`  ERROR (workflow_tool_not_in_toolIntents): ${totals.gapFrequency.workflow_tool_not_in_toolIntents} spec(s) reference an undeclared tool`);
}
console.log(`  JSON: ${relative(monorepoRoot, jsonPath)}`);
console.log(`  MD:   ${relative(monorepoRoot, markdownPath)}`);
