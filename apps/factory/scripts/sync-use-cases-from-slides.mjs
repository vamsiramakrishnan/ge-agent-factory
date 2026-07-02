#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import {
  loadInterviewSpecEntries,
  mergeAgentSpecEntries,
  normalizeAgentSpecEntry,
  registrySummary,
} from "../src/agent-spec-registry.js";
import { buildWorkflowFromPipeline } from "./factory/agent-workflow.mjs";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const sourceRoot = resolve(repoRoot, "..", "presentation", "src", "components", "slides", "use-cases");
// The catalog is a build artifact (git-ignored), loaded lazily via src/use-cases.js.
// It is no longer a committed 12 MB JS module.
const outPath = join(repoRoot, "generated", "use-cases.generated.json");
// The registry is TRACKED in git, so its bytes must be a pure function of the
// slide/interview inputs — no wall-clock timestamps (see
// tools/check-generated-drift.mjs, which regenerates it and byte-compares).
// GE_AGENT_SPEC_REGISTRY_OUT redirects the write so that checker can
// regenerate to a temp path without touching the tracked file.
const registryOutPath = process.env.GE_AGENT_SPEC_REGISTRY_OUT
  || join(repoRoot, "src", "agent-spec-registry.generated.json");

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

function pipeline(source) {
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

function propObject(source, name) {
  const literal = extractConstObject(source, name);
  if (!literal) return null;
  try {
    return Function(`"use strict"; return (${literal});`)();
  } catch (error) {
    console.warn(`Could not parse ${name}: ${error.message}`);
    return null;
  }
}

// Evaluate a slide-level `const` literal with all sibling const literals in
// scope. Needed because newer slides reference shared objects (e.g.
// `behaviorContract`) via shorthand inside `generationSpec`, and a bare
// Function eval of `generationSpec` alone would throw ReferenceError.
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
  } catch (error) {
    console.warn(`Could not parse ${targetName} (with siblings): ${error.message}`);
    return propObject(source, targetName);
  }
}

function systemId(system) {
  return String(system || "source_system")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "source_system";
}

function synthesizeGenerationSpec(item) {
  const systems = item.systems?.length ? item.systems : item.architecture.connections.map((conn) => conn.system);
  const sourceSystems = systems
    .filter((system) => !/vertex|gemini/i.test(system))
    .map((system) => {
      const id = systemId(system);
      return {
        id,
        name: system,
        owns: [`${id}_records`],
        protocol: item.architecture.connections.find((conn) => conn.system === system)?.protocol || "fixture",
        localBacking: ["json-api"],
        toolNames: [`query_${id}_records`],
        evidence: ["source_system_record", "generated_audit_trail"],
      };
    });
  return {
    version: 1,
    synthesized: true,
    rowPolicy: {
      defaultRowsPerEntity: 50,
      minimumRowsPerEntity: 25,
      seed: 42,
      rationale: "Synthesized from slide-level systems and architecture. Replace with explicit TSX generationSpec for production-grade data contracts.",
    },
    sourceSystems,
    entities: sourceSystems.map((system) => ({
      name: `${system.id}_records`,
      sourceSystemId: system.id,
      datastore: "alloydb",
      rowCount: 50,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "source_record_id", type: "seq", required: true },
        { name: "status", type: "enum", values: ["active", "pending", "closed"], required: true },
        { name: "created_at", type: "date", required: true },
        { name: "notes", type: "lorem.sentence", required: true },
      ],
    })),
    relationships: [],
    documents: [{
      id: `${item.id}-evidence-guide`,
      sourceSystemId: sourceSystems[0]?.id || "source_system",
      type: "guide",
      title: `${item.title} Evidence Guide`,
      requiredSections: ["Overview", "Workflow evidence", "Audit trail"],
      linkedEntities: sourceSystems.map((system) => `${system.id}_records`),
      minimumWordCount: 250,
      citationAnchors: ["overview", "evidence", "audit"],
    }],
    apis: [],
    anomalies: [{
      id: `${item.id}-kpi-gap`,
      description: item.kpis?.[0] ? `${item.kpis[0].label}: ${item.kpis[0].before} -> ${item.kpis[0].after}` : "Seed one KPI gap for the agent to discover.",
      affectedEntities: sourceSystems.map((system) => `${system.id}_records`),
      discoveryPath: ["Inspect source-system records", "Compare against KPI target", "Generate recommendation"],
      expectedEvidence: ["source-system record", "generated audit trail"],
      expectedRecommendation: "Explain the gap and recommend the next operational action.",
    }],
    datastorePackaging: {
      alloydb: { database: item.id.replace(/-/g, "_"), schemas: sourceSystems.map((system) => system.id) },
      bigquery: { dataset: `${item.department}_${item.id.replace(/-/g, "_")}`, tables: ["kpi_summary"] },
      cloudStorage: { bucketSuffix: `${item.id}-evidence`, prefixes: ["documents", "audit-trails"] },
      apis: { serviceName: `${item.id}-source-adapters`, deploymentTarget: "cloud_run" },
    },
    // Synthesized specs intentionally have no behaviorContract — the absence is
    // a load-bearing signal that the slide needs a real, domain-specific
    // contract before the factory should emit an ADK agent.
    behaviorContract: null,
    validation: {
      smokePrompt: `Run the ${item.title} workflow and cite source-system evidence.`,
      expectedAnswer: ["uses source-system tools", "cites evidence", "states next action"],
      assertions: ["canonical source-system tool names", "minimum row policy met", "audit trail returned"],
    },
  };
}

// Make explicit specs self-describing: when a use case carries a real
// behaviorContract (with toolIntents) and a multi-stage architecture.pipeline
// but no hand-authored workflow, derive one so the spec aligns with the
// multi-agent generator. Single source of truth: scripts/factory/agent-workflow.mjs.
// Trivial pipelines yield null and stay single-agent (no workflow added).
// Mutates the use case in place; safe to call on slide and interview entries.
function injectWorkflow(useCase) {
  const contract = useCase?.generationSpec?.behaviorContract;
  if (!contract?.toolIntents?.length || contract.workflow) return;
  const workflow = buildWorkflowFromPipeline({
    behaviorContract: contract,
    architecture: useCase.architecture,
  });
  if (!workflow) return;
  // Insert workflow right after toolIntents to keep the contract readable.
  const rebuilt = {};
  for (const [key, value] of Object.entries(contract)) {
    rebuilt[key] = value;
    if (key === "toolIntents") rebuilt.workflow = workflow;
  }
  if (!("workflow" in rebuilt)) rebuilt.workflow = workflow;
  useCase.generationSpec.behaviorContract = rebuilt;
}

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
files.sort();
const useCases = [];
// Two slides with the same title (e.g. finance + IT "Regulatory Change
// Monitor") derive the same id from the title. Track seen ids so later
// collisions get a department suffix BEFORE generationSpec synthesis, which
// derives resource names (alloydb db, bigquery dataset, bucket suffix) from
// the id — those would otherwise collide too.
const seenIds = new Set();

for (const file of files) {
  const source = await readFile(file, "utf8");
  const title = propString(source, "title");
  if (!title) continue;
  const department = relative(sourceRoot, file).split(/[\\/]/)[0];
  const useCase = {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    title,
    department,
    sourcePath: relative(repoRoot, file),
    subtitle: propString(source, "subtitle"),
    persona: propString(source, "persona"),
    layer: propString(source, "layer"),
    triggerType: propString(source, "triggerType"),
    domainId: propString(source, "domainId"),
    systems: propArray(source, "systems"),
    kpis: propKpis(source),
    statusQuo: propArray(source, "statusQuo"),
    agentification: propArray(source, "agentification"),
    architecture: {
      connections: architectureConnections(source),
      pipeline: pipeline(source),
    },
  };
  if (seenIds.has(useCase.id)) {
    useCase.id = `${useCase.id}-${department}`;
  }
  seenIds.add(useCase.id);
  useCase.generationSpec = evalSlideConst(source, "generationSpec") || synthesizeGenerationSpec(useCase);
  injectWorkflow(useCase);
  // Surface contract presence at the top level so downstream tools (factory,
  // workspace validators, harness skills) can fail fast on shallow slides
  // without re-walking the nested spec.
  useCase.hasBehaviorContract = Boolean(useCase.generationSpec?.behaviorContract?.toolIntents?.length);
  useCases.push(normalizeAgentSpecEntry(useCase, {
    sourceKind: "slide",
    sourcePath: file,
    repoRoot,
  }));
}

const interviewUseCases = await loadInterviewSpecEntries({ repoRoot });
// Interview specs are authored elsewhere; apply the same workflow injection so
// catalog entries are uniformly self-describing regardless of source.
for (const entry of interviewUseCases) injectWorkflow(entry);
const mergedUseCases = mergeAgentSpecEntries([...useCases, ...interviewUseCases]);

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(mergedUseCases, null, 2)}\n`, "utf8");

await writeFile(
  registryOutPath,
  `${JSON.stringify({
    kind: "ge.agent_spec.registry",
    version: 1,
    // Deliberately no generatedAt: a wall-clock timestamp made every ordinary
    // catalog/test run rewrite this tracked file (taste-campaign 08 §A1), and
    // nothing consumed the field. Regeneration over unchanged inputs must be a
    // byte no-op.
    sources: {
      slides: relative(repoRoot, sourceRoot),
      interviews: "catalog/interview-specs",
    },
    summary: registrySummary(mergedUseCases),
    entries: mergedUseCases.map((entry) => ({
      id: entry.id,
      title: entry.title,
      department: entry.department,
      domainId: entry.domainId,
      systems: entry.systems,
      hasBehaviorContract: entry.hasBehaviorContract,
      registry: entry.registry,
    })),
  }, null, 2)}\n`,
  "utf8",
);

console.log(`Synced ${mergedUseCases.length} use cases to ${relative(repoRoot, outPath)}`);
console.log(`Registry: ${relative(repoRoot, registryOutPath)}`);
