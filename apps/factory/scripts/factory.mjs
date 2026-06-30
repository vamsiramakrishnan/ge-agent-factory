#!/usr/bin/env node
/**
 * factory — Unified mock system pipeline CLI
 *
 * End-to-end: init → generate → tools → test → serve → deploy → register → publish
 *
 * Each command advances the pipeline and records state in pipeline.json.
 * The LLM calls one command at a time; the CLI tracks where you are.
 *
 * USAGE:
 *   factory init     --name <name> --domain <domain> --dir <workspace-dir>
 *   factory schema   --dir <dir> --add-table <json>
 *   factory generate --dir <dir> [--seed N] [--rows N]
 *   factory tools    --dir <dir>
 *   factory test     --dir <dir>
 *   factory serve    --dir <dir> [--port N]
 *   factory deploy   --dir <dir> --project <gcp-project> --region <region>
 *   factory register --dir <dir> [--as mcp|a2a]
 *   factory publish  --dir <dir> --app-id <gemini-enterprise-app-id>
 *   factory status   --dir <dir>
 *   factory reset    --dir <dir> --step <step>
 */
import { readFile, writeFile, mkdir, stat, readdir } from "node:fs/promises";
import { parseList } from "@ge/std/list";
import { parseCommandArgs } from "@ge/std/cli-args";
import { existsSync } from "node:fs";
import { join, resolve, basename, relative, dirname } from "node:path";
import { execa } from "execa";
import { stringify as stringifyYaml } from "yaml";
import { defineCommand, runMain } from "citty";
import { faker } from "@faker-js/faker";
import { extractFirstJsonObject } from "@ge/std/json-repair";
import { toCsv } from "@ge/std/csv-io";
import { buildFactoryCommandTree } from "./factory/registry.mjs";
import { renderToolsPreambleLines, renderDocumentToolLines } from "./factory/tools/render-tools-py.mjs";
import { deriveColumnsForEntity, matchEntityColumnSchema } from "./factory/use-case/entity-column-schemas.mjs";
import { deriveSchemaFromGenerationSpec } from "./factory/use-case/schema-from-generation-spec.mjs";
import { harnessRefineSchema, harnessReviewSchema } from "./schemas/harness-schemas.mjs";

// Non-fatal: validate parsed harness output against its zod source of truth.
// Warns (keeps the output) so a contract drift surfaces without breaking a run.
function validateHarnessOutput(schema, value, label) {
  const result = schema.safeParse(value);
  if (!result.success) {
    console.error(`⚠  ${label} output failed schema validation (kept anyway): ${result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ")}`);
  }
  return result.success;
}
import { runHarnessTask } from "../src/harness-runner.js";
import { buildHarnessRefinePrompt, buildHarnessRunSummary, buildHarnessWorkItem, writeHarnessWorkItem } from "../src/harness-work-item.js";
import { canonicalSystemId, safePyName, shortAgentName, snakeCase, titleCase, validPythonIdentifierName } from "@ge/std/naming";
import { CONTRACT_INTENT_KINDS, CONTRACT_TOOL_KINDS, ensureContractQueryTables, inferEvalToolArgs, tablePrimaryKey } from "./factory/core/contract-schema.mjs";
import { MANAGED_MCP_SERVICES, buildSourceIntegrationPlan } from "./factory/integration/source-integration.mjs";
import { renderToolsModule } from "./factory/runtime/tools-backend.mjs";
import { findSimulatorForSystem, loadSimulatorRegistry, simulatorBindingForTool } from "./factory/simulators/registry.mjs";
import { matchPipelineSteps } from "./factory/agent-workflow.mjs";
import { buildBundle as buildOkfBundle } from "./spec-to-okf.mjs";
import { renderConcept as renderOkfConcept } from "@ge/okf";
import { deriveAnswerableQueries, deriveTestMechanisms } from "./lib/okf-capabilities.mjs";
import { buildSemanticModel } from "./factory/data/semantic-model.mjs";
import { applyScenarioBindings, enrichScenarioSpec } from "./factory/packs/index.mjs";
import { analyzePackCoverage } from "./factory/packs/coverage.mjs";
import { getUseCases } from "../src/use-cases.js";
import { readPromotionGate } from "../src/promotion-packet.js";
import { DOMAIN_CATALOG } from "../src/domains.generated.js";
import { APP_ROOT, GENERATOR_DATA_ROOT } from "../src/state-paths.js";
import { DEFAULT_AGENT_MODEL, assertKnownModel } from "../src/known-models.js";
import { sourceTimestamp } from "../src/source-clock.js";

// Model for all generated agents. Override with GE_AGENT_MODEL. Validated against
// the known-models allowlist so an invalid id fails generation here rather than
// 404-ing at agent runtime after cloud resources are provisioned.
const AGENT_MODEL = assertKnownModel(process.env.GE_AGENT_MODEL || DEFAULT_AGENT_MODEL);

// max_output_tokens for generated agents. We deliberately do NOT ship a hardcoded
// number: right-sizing the output budget is a use-case decision the Antigravity
// harness review owns. Unset (null) means the agent falls back to the model's own
// default budget. An operator can force a value with GE_AGENT_MAX_OUTPUT_TOKENS;
// anything that isn't a positive integer is treated as unset.
const AGENT_MAX_OUTPUT_TOKENS = (() => {
  const raw = process.env.GE_AGENT_MAX_OUTPUT_TOKENS;
  if (raw == null || String(raw).trim() === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(`GE_AGENT_MAX_OUTPUT_TOKENS must be a positive integer (got "${raw}")`);
  }
  return n;
})();

// Captured once per run so every artifact this run emits shares one timestamp.
// Set GE_SOURCE_DATE for byte-reproducible generation (CI golden-diff gate).
const GENERATED_AT = sourceTimestamp();
const REPO_ROOT = APP_ROOT;
const HARNESS_DATA_ROOT = GENERATOR_DATA_ROOT;

const STEPS = ["init", "schema", "generate", "tools", "test", "harnessReview", "harnessRefine", "sourceIntegration", "serve", "deploy", "register", "publish"];

const parseArgs = (argv) => parseCommandArgs(argv, "help");

function pipelinePath(dir) { return join(dir, "mock_systems", "pipeline.json"); }
function schemaPath(dir) { return join(dir, "mock_systems", "schema.json"); }
function fixturesDir(dir) { return join(dir, "fixtures"); }
function manifestPath(dir) { return join(dir, "fixtures", "manifest.json"); }
function cloudDataDir(dir) { return join(dir, "mock_data", "cloud"); }
function deployPlanPath(dir) { return join(dir, "artifacts", "deploy-plan.json"); }

async function readJson(path, fallback) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { return fallback; }
}

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true }).catch(() => {});
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function writeText(path, data) {
  await mkdir(dirname(path), { recursive: true }).catch(() => {});
  await writeFile(path, data, "utf8");
}

async function loadPipeline(dir) {
  return readJson(pipelinePath(dir), {
    name: basename(dir),
    domain: "general",
    createdAt: null,
    steps: {},
    currentStep: null,
  });
}

async function savePipeline(dir, pipeline) {
  await writeJson(pipelinePath(dir), pipeline);
}

function markStep(pipeline, step, status, meta = {}) {
  pipeline.steps[step] = { status, completedAt: new Date().toISOString(), ...meta };
  pipeline.currentStep = step;
}

function requireStep(pipeline, step) {
  if (!pipeline.steps[step] || pipeline.steps[step].status !== "done") {
    console.error(`Step "${step}" has not been completed yet. Run "factory ${step}" first.`);
    process.exit(1);
  }
}

function ok(data) { console.log(JSON.stringify({ ok: true, ...data }, null, 2)); }
function fail(msg) { console.error(JSON.stringify({ ok: false, error: msg }, null, 2)); process.exit(1); }

// Run a child process via execa, preserving the historical contract callers
// rely on: resolves to { code, stdout, stderr }; throws `${cmd} exited N: …`
// (with .code/.stdout/.stderr attached) on a non-zero exit unless opts.allowFail;
// throws Error("timeout") (with partial .stdout/.stderr) when opts.timeout fires;
// re-throws the raw spawn error (e.g. ENOENT) on launch failure. opts.stream
// echoes the child's stdout/stderr to the parent while still capturing them.
async function runCommand(cmd, args, opts = {}) {
  const execaOpts = {
    cwd: opts.cwd,
    // execa extends process.env by default, matching the old { ...process.env, ...opts.env }.
    env: opts.env,
    shell: opts.shell || false,
    timeout: opts.timeout || undefined,
    reject: false,
    // Keep the trailing newline so captured output is byte-identical to the old spawn path.
    stripFinalNewline: false,
  };
  if (opts.stdio) {
    execaOpts.stdio = opts.stdio;
  } else if (opts.stream) {
    // "pipe" captures into result.stdout/stderr; "inherit" echoes to the parent — both at once.
    execaOpts.stdout = ["pipe", "inherit"];
    execaOpts.stderr = ["pipe", "inherit"];
  }

  const r = await execa(cmd, args, execaOpts);
  const stdout = r.stdout ?? "";
  const stderr = r.stderr ?? "";

  if (r.timedOut) {
    const error = new Error("timeout");
    error.stdout = stdout;
    error.stderr = stderr;
    throw error;
  }
  // A launch failure (ENOENT etc.) has no numeric exitCode — re-throw the raw error
  // the way the old "error" handler did.
  if (typeof r.exitCode !== "number") {
    const launchError = r.cause || r.originalError || new Error(r.shortMessage || r.message || `failed to launch ${cmd}`);
    throw launchError;
  }
  const code = r.exitCode;
  if (code !== 0 && !opts.allowFail) {
    const error = new Error(`${cmd} exited ${code}: ${stderr.slice(0, 500)}`);
    error.code = code;
    error.stdout = stdout;
    error.stderr = stderr;
    throw error;
  }
  return { code, stdout, stderr };
}

// ── Introspection helpers ────────────────────────────────────

function classifyColumn(col) {
  const name = (col.name || "").toLowerCase();
  const type = col.type || "string";
  if (type === "ref") return { dataKind: "structured", role: "foreign_key", ref: col.ref };
  if (type === "seq") return { dataKind: "structured", role: "primary_key" };
  if (type === "enum") return { dataKind: "structured", role: "categorical", cardinality: (col.values || []).length };
  if (type === "number" || type === "float") return { dataKind: "structured", role: "metric" };
  if (type === "date") return { dataKind: "structured", role: "temporal" };
  if (type === "boolean") return { dataKind: "structured", role: "flag" };
  if (type === "lorem.paragraph" || type === "lorem.sentence" || type === "text") return { dataKind: "unstructured", role: "text" };
  if (name.includes("description") || name.includes("notes") || name.includes("comment") || name.includes("body")) return { dataKind: "unstructured", role: "text" };
  if (name.includes("url") || name.includes("link") || name.includes("path")) return { dataKind: "semi_structured", role: "reference" };
  if (name.includes("json") || name.includes("payload") || name.includes("metadata")) return { dataKind: "semi_structured", role: "nested" };
  if (type.startsWith("person.") || type.startsWith("internet.") || type.startsWith("location.")) return { dataKind: "structured", role: "entity_attribute" };
  return { dataKind: "structured", role: "attribute" };
}

function classifyTable(tableDef) {
  const columns = tableDef.columns || [];
  const classified = columns.map((c) => ({ ...c, classification: classifyColumn(c) }));
  const unstructuredCount = classified.filter((c) => c.classification.dataKind === "unstructured").length;
  const structuredCount = classified.filter((c) => c.classification.dataKind === "structured").length;
  const hasRefs = classified.some((c) => c.classification.role === "foreign_key");
  const hasPK = classified.some((c) => c.classification.role === "primary_key");

  let tableKind = "structured";
  if (unstructuredCount > structuredCount) tableKind = "unstructured";
  else if (unstructuredCount > 0) tableKind = "mixed";

  return {
    name: tableDef.name,
    rows: tableDef.rows,
    sourceSystem: tableDef._sourceSystem || tableDef.sourceSystem || null,
    sourceSystemId: tableDef._sourceSystemId || tableDef.sourceSystemId || null,
    tableKind,
    hasPrimaryKey: hasPK,
    hasForeignKeys: hasRefs,
    columnCount: columns.length,
    structuredColumns: structuredCount,
    unstructuredColumns: unstructuredCount,
    columns: classified.map((c) => ({ name: c.name, type: c.type, ...c.classification })),
    suggestedMockType: tableKind === "unstructured" ? "document_store" : hasRefs ? "relational" : "flat_table",
    suggestedExposure: tableKind === "unstructured" ? "mcp" : "adk_function_tool",
  };
}

function systemKindFromConnection(conn = {}) {
  const protocol = String(conn.protocol || "").toLowerCase();
  const category = String(conn.category || "").toLowerCase();
  const system = String(conn.system || "").toLowerCase();
  if (system.includes("vertex") || system.includes("gemini")) return "reasoning_runtime";
  if (category === "analytics" || system.includes("bigquery") || system.includes("looker")) return "olap";
  if (/rest|graphql|grpc|soap|sftp|api|rfc|bapi/.test(protocol)) return "api";
  if (category === "collaboration") return "api";
  if (category === "clm" || category === "erp" || category === "hris") return "oltp";
  return "source_system";
}

function buildUseCaseSpec(useCase, rows) {
  const connections = useCase.architecture?.connections || [];
  const canonicalSystems = (useCase.systems || []).filter(Boolean);
  const sourceSystems = canonicalSystems.length
    ? canonicalSystems.map((system) => {
        const conn = connections.find((item) => String(item.system || "").toLowerCase() === String(system).toLowerCase())
          || connections.find((item) => String(item.description || "").toLowerCase().includes(String(system).toLowerCase()))
          || { system, protocol: "fixture", direction: "read", category: null, description: `Source records owned by ${system}` };
        return { ...conn, system };
      })
    : connections;
  const systems = sourceSystems
    .filter((conn) => !String(conn.system || "").toLowerCase().includes("vertex") && !String(conn.system || "").toLowerCase().includes("gemini"))
    .map((conn) => ({
      id: canonicalSystemId(conn.system),
      name: conn.system,
      kind: systemKindFromConnection(conn),
      protocol: conn.protocol || "fixture",
      direction: conn.direction || "read",
      category: conn.category || null,
      responsibility: conn.description || `Source records owned by ${conn.system}`,
    }))
    .filter((system, index, all) => all.findIndex((item) => item.id === system.id) === index);

  return {
    id: useCase.id,
    title: useCase.title,
    department: useCase.department || "general",
    rowPolicy: {
      requestedRows: rows,
      minimumRowsPerEntity: Math.max(12, Math.min(rows, 25)),
      defaultRowsPerEntity: rows,
    },
    systems,
    dataContracts: [],
    evidenceRequired: ["sql_result", "source_system_record", "generated_audit_trail"],
    documentRequirements: [
      "Every generated document must have a title, source system, linked entity IDs, and citation anchors.",
      "Documents must contain policy or operating-detail content specific enough for an agent answer to cite.",
    ],
    integrityRules: [
      "Every table has a stable primary key.",
      "Every foreign key column must reference an existing generated row.",
      "Every data table maps back to one canonical source system.",
    ],
    // The multi-step workflow narrative (architecture.pipeline) is the only place
    // the pipeline structure lives upstream. Persist it onto the spec so the agent
    // emitter can derive a sequential/parallel topology at build time (the manifest
    // is the emitter's only input; without this it sees a flat tool list only).
    architecture: useCase.architecture ? { pipeline: Array.isArray(useCase.architecture.pipeline) ? useCase.architecture.pipeline : [] } : null,
    behaviorContract: null,
  };
}

// ── COMMANDS ─────────────────────────────────────────────────

async function cmdInit(dir, flags) {
  const name = flags.name || basename(dir);
  const domain = flags.domain || "general";
  await mkdir(join(dir, "mock_systems", "scenarios"), { recursive: true });
  await mkdir(join(dir, "fixtures", "tables"), { recursive: true });
  await mkdir(join(dir, "fixtures", "documents"), { recursive: true });
  await mkdir(join(dir, "app"), { recursive: true });
  await mkdir(join(dir, "tests"), { recursive: true });

  const schema = { seed: 42, domain, tables: [] };
  await writeJson(schemaPath(dir), schema);

  const pipeline = await loadPipeline(dir);
  pipeline.name = name;
  pipeline.domain = domain;
  pipeline.createdAt = new Date().toISOString();
  markStep(pipeline, "init", "done", { name, domain });
  await savePipeline(dir, pipeline);
  ok({ step: "init", name, domain, dir, schemaPath: schemaPath(dir) });
}

async function cmdSchema(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "init");
  const schema = await readJson(schemaPath(dir), { seed: 42, domain: "general", tables: [] });

  if (flags["add-table"]) {
    const tableDef = JSON.parse(flags["add-table"]);
    const existing = schema.tables.findIndex((t) => t.name === tableDef.name);
    if (existing >= 0) schema.tables[existing] = tableDef;
    else schema.tables.push(tableDef);
    await writeJson(schemaPath(dir), schema);
    const analysis = classifyTable(tableDef);
    markStep(pipeline, "schema", "done", { tables: schema.tables.length });
    await savePipeline(dir, pipeline);
    ok({ step: "schema", action: "add-table", table: tableDef.name, analysis, totalTables: schema.tables.length });
    return;
  }

  if (flags["from-file"]) {
    const imported = JSON.parse(await readFile(flags["from-file"], "utf8"));
    if (imported.tables) schema.tables = imported.tables;
    if (imported.seed) schema.seed = imported.seed;
    if (imported.domain) schema.domain = imported.domain;
    await writeJson(schemaPath(dir), schema);
    markStep(pipeline, "schema", "done", { tables: schema.tables.length });
    await savePipeline(dir, pipeline);
    ok({ step: "schema", action: "import", tables: schema.tables.length });
    return;
  }

  const analysis = schema.tables.map(classifyTable);
  ok({ step: "schema", tables: analysis, totalTables: schema.tables.length, schemaPath: schemaPath(dir) });
}

async function cmdGenerate(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "init");
  const schema = ensureContractQueryTables(await readJson(schemaPath(dir), null));
  if (!schema || !schema.tables?.length) fail("No schema found. Run 'factory schema --add-table ...' first.");

  const seed = Number(flags.seed) || schema.seed || 42;
  const defaultRows = Number(flags.rows) || 50;
  faker.seed(seed);

  const outDir = fixturesDir(dir);
  await mkdir(join(outDir, "tables"), { recursive: true });
  await mkdir(join(outDir, "documents"), { recursive: true });

  const generatedTables = {};
  const manifestTables = [];

  for (const tableDef of schema.tables) {
    const rows = [];
    const count = tableDef.rows || defaultRows;
    const columns = tableDef.columns || [];

    for (let i = 0; i < count; i++) {
      const row = {};
      for (const col of columns) {
        row[col.name] = generateValue(col, i, generatedTables);
      }
      rows.push(row);
    }

    generatedTables[tableDef.name] = rows;
    const jsonPath = join("tables", `${tableDef.name}.json`);
    const csvPath = join("tables", `${tableDef.name}.csv`);
    await writeFile(join(outDir, jsonPath), JSON.stringify(rows, null, 2), "utf8");
    await writeFile(join(outDir, csvPath), toCsv(rows), "utf8");

    manifestTables.push({
      name: tableDef.name,
      path: csvPath,
      jsonPath,
      sourceSystem: tableDef._sourceSystem || tableDef.sourceSystem || null,
      sourceSystemId: tableDef._sourceSystemId || tableDef.sourceSystemId || (tableDef._sourceSystem ? canonicalSystemId(tableDef._sourceSystem) : null),
      sourceDescription: tableDef._sourceDescription || tableDef.sourceDescription || null,
      primaryKey: columns.find((c) => c.type === "seq")?.name || columns[0]?.name || "id",
      columns: Object.keys(rows[0] || {}).map((k) => ({
        name: k,
        type: typeof rows[0][k] === "number" ? "number" : typeof rows[0][k] === "boolean" ? "boolean" : "string",
      })),
      rowCount: rows.length,
    });
  }

  applyScenarioBindings(schema, generatedTables);
  for (const tableDef of schema.tables) {
    const rows = generatedTables[tableDef.name] || [];
    const jsonPath = join("tables", `${tableDef.name}.json`);
    const csvPath = join("tables", `${tableDef.name}.csv`);
    await writeFile(join(outDir, jsonPath), JSON.stringify(rows, null, 2), "utf8");
    await writeFile(join(outDir, csvPath), toCsv(rows), "utf8");
  }

  // Generate documents if defined in schema
  const manifestDocs = [];
  const schemaDocs = schema.documents || [];
  for (const docDef of schemaDocs) {
    const doc = generateDocument(docDef, schema.domain, generatedTables);
    const docPath = join("documents", `${docDef.id || docDef.name || "doc"}.md`);
    await writeFile(join(outDir, docPath), doc.content, "utf8");
    manifestDocs.push({
      id: docDef.id || docDef.name,
      path: docPath,
      title: doc.title,
      type: docDef.type || "document",
      sourceSystem: docDef.sourceSystem || null,
      sourceSystemId: docDef.sourceSystemId || (docDef.sourceSystem ? canonicalSystemId(docDef.sourceSystem) : null),
      linkedEntities: docDef.linkedEntities || Object.keys(generatedTables),
      requiredSections: docDef.requiredSections || [],
      citationAnchors: docDef.citationAnchors || [],
      minimumWordCount: docDef.minimumWordCount || null,
      wordCount: doc.content.split(/\s+/).length,
    });
  }

  // Auto-generate domain-appropriate docs if none defined but domain is set
  if (schemaDocs.length === 0 && schema.domain && schema.domain !== "general") {
    const autoDocs = generateDomainDocuments(schema.domain, generatedTables);
    for (const doc of autoDocs) {
      const docPath = join("documents", `${doc.id}.md`);
      await writeFile(join(outDir, docPath), doc.content, "utf8");
      manifestDocs.push({
        id: doc.id,
        path: docPath,
        title: doc.title,
        type: doc.type,
        linkedEntities: Object.keys(generatedTables),
        wordCount: doc.content.split(/\s+/).length,
      });
    }
  }

  const manifest = {
    id: pipeline.name || "generated",
    generatedAt: GENERATED_AT,
    domain: schema.domain || "general",
    seed,
    systems: schema.systems || [],
    useCaseSpec: schema.useCaseSpec || null,
    tables: manifestTables,
    documents: manifestDocs,
    totalRows: manifestTables.reduce((s, t) => s + t.rowCount, 0),
  };
  await writeJson(manifestPath(dir), manifest);

  // Semantic / metadata model for NL→SQL (table/column descriptions, joins, measures,
  // glossary + ready-to-apply BigQuery descriptions). Consumed by the BigQuery MCP at
  // load_data and by the agent's describe_data_model() tool.
  await writeJson(join(dir, "mock_data", "metadata", "semantic-model.json"), buildSemanticModel(manifest, { agentId: manifest.id }));

  markStep(pipeline, "generate", "done", { tables: manifestTables.length, totalRows: manifest.totalRows, seed });
  await savePipeline(dir, pipeline);
  ok({ step: "generate", tables: manifestTables.map((t) => ({ name: t.name, rows: t.rowCount })), totalRows: manifest.totalRows, manifest: manifestPath(dir) });
}

// ── Behavior-contract codegen helpers ─────────────────────────
//
// The behavior contract on the use case spec is what makes the generated ADK
// agent task-specific instead of a hello/list/query shell. These helpers turn
// each ToolIntentSpec into a Python function and shape the agent instruction
// from the contract's role, scope, evidence, and escalation rules.

function pyEscape(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function pyTripleEscape(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"');
}

function buildAgentQualityPlan({ useCase, contract, systems = [], tables = [], documents = [] }) {
  const agentName = validPythonIdentifierName(`${useCase?.id || "generated"}_agent`);
  const toolIntents = Array.isArray(contract?.toolIntents) ? contract.toolIntents : [];
  const hasWriteIntent = toolIntents.some((intent) => ["action", "notification"].includes(intent.kind));
  const hasEvidenceIntent = toolIntents.some((intent) => intent.kind === "evidence_lookup") || documents.length > 0;
  const hasCalculationIntent = toolIntents.some((intent) => intent.kind === "calculation");
  const multiSystem = systems.length > 1;
  const needsSourceAdapters = systems.length > 0 || tables.length > 0;

  return {
    naming: {
      agentName,
      displayName: `${titleCase(useCase?.title || useCase?.id || "Generated Agent")}`,
      rule: "Use snake_case Python identifiers for agent and tools; use title case only for display labels.",
      toolNamePattern: "<verb>_<source_system_id>_<business_object>",
      forbiddenPatterns: ["helper", "do_task", "process_data", "tool1", "generic_agent"],
    },
    adkCapabilities: {
      agentClass: "google.adk.agents.Agent",
      model: AGENT_MODEL,
      generateContentConfig: {
        temperature: 0.2,
        // null ⇒ omitted from the generated agent; the harness review sizes it per
        // use case (or leaves it unset). Never the 2048 boilerplate.
        maxOutputTokens: AGENT_MAX_OUTPUT_TOKENS,
        reason: AGENT_MAX_OUTPUT_TOKENS == null
          ? "Output budget left to the model default; the harness review sets a bound only when the use case warrants one."
          : `Output budget pinned to ${AGENT_MAX_OUTPUT_TOKENS} via GE_AGENT_MAX_OUTPUT_TOKENS.`,
      },
      outputKey: "last_response",
      callbacks: [
        "before_agent_callback initializes session state from the generated spec.",
        "before_tool_callback enforces idempotency keys for write-like tool intents.",
        "after_tool_callback records tool evidence and audit trails in session state.",
      ],
      stateKeys: [
        "scenario_id",
        "primary_objective",
        "expected_tools",
        "evidence_log",
        "audit_trails",
      ],
      useSubAgentsWhen: multiSystem
        ? "Split into source-specific researcher/verifier sub-agents when live APIs replace fixtures or when one prompt needs parallel evidence collection."
        : "Keep a single root agent while fixtures are local; add sub-agents only when an independent specialist has its own tools and evals.",
      useAgentToolWhen: "Expose specialist agents through AgentTool when the coordinator must retain control over final synthesis.",
      useCodeExecutorWhen: hasCalculationIntent
        ? "Allowed for deterministic calculations over retrieved rows; keep inputs and outputs captured in evidence_log."
        : "Not required unless future specs add deterministic calculation or modeling work.",
      useMemoryWhen: "Only persist user preferences or repeated workflow context after the user explicitly asks for memory; keep generated demos session-scoped by default.",
    },
    toolDesign: {
      expectedToolCount: toolIntents.length + tables.length + 1 + (documents.length ? 3 : 0),
      sourceAdapters: needsSourceAdapters ? systems.map((system) => system.id || canonicalSystemId(system.name || system.system)) : [],
      writeSafety: hasWriteIntent
        ? "All write-like tools require explicit inputs and return deterministic audit_trail values; callbacks block missing idempotency_key/idempotencyKey when present in args."
        : "Read-only unless a behaviorContract tool intent explicitly declares an action or notification.",
      evidence: hasEvidenceIntent
        ? "Evidence lookup tools and document search must run before recommendations or write actions."
        : "Fixture table query tools are the source of truth; do not fabricate unavailable evidence.",
    },
    evalPlan: {
      unitTests: [
        "Import generated app.tools and app.agent.",
        "Verify fixture tables exist and contain rows.",
        "Verify generated agent instruction contains objective, tool playbook, and guardrails.",
        "Statically verify advanced ADK config: callbacks, generate_content_config, output_key, and description.",
      ],
      agentEvals: [
        "tool_trajectory_avg_score with ANY_ORDER for contract tool usage.",
        "rubric_based_tool_use_quality_v1 for source-before-action reasoning.",
        "rubric_based_final_response_quality_v1 for grounded final answers.",
        "hallucinations_v1 and safety_v1 for cited evidence and guardrail adherence.",
      ],
      goldenEvalMinimum: 1,
      addMoreEvalsWhen: [
        "A tool intent writes external state.",
        "A source adapter has bidirectional sync semantics.",
        "A workflow has escalation/refusal branches.",
        "A document citation is mandatory for final answers.",
      ],
    },
    mockDataQuality: {
      minimumRowsPerEntity: Math.max(12, Number(useCase?.rowPolicy?.minimumRowsPerEntity || 25)),
      requirements: [
        "Every generated row has a stable primary key.",
        "Foreign keys must resolve to generated parent rows.",
        "Each table declares sourceSystem and sourceSystemId in fixtures/manifest.json.",
        "Documents include citation anchors and linked entity ids when document evidence is needed.",
        "Action-oriented workflows include at least one anomaly or edge-case fixture.",
      ],
    },
  };
}

function renderContractToolPython(intent) {
  const fnName = safePyName(intent.name || `${intent.kind || "tool"}_tool`);
  const sourceSystemId = pyEscape(intent.sourceSystemId || "unknown");
  const kind = pyEscape(intent.kind || "action");
  const description = pyTripleEscape(intent.description || `${intent.kind || "Tool"} for ${intent.sourceSystemId || "source system"}`);
  const evidenceFallback = intent.kind === "evidence_lookup" ? ["document_reference"] : ["api_response", "generated_audit_trail"];
  const evidenceLiteral = JSON.stringify((intent.evidenceEmitted && intent.evidenceEmitted.length) ? intent.evidenceEmitted : evidenceFallback);
  const producesList = intent.produces && intent.produces.length ? intent.produces : [];

  if (intent.kind === "evidence_lookup") {
    const anchorParam = (intent.requiredInputs || []).find((input) => /anchor|section|topic/i.test(input)) || "citation_anchor";
    const safeAnchor = safePyName(anchorParam, "citation_anchor");
    const producedFieldLines = producesList
      .filter((produce) => snakeCase(produce) !== "citation_anchor")
      .map((produce) => {
        const safeProduce = safePyName(produce, "result_field");
        if (snakeCase(produce).includes("section")) return `    ${safeProduce} = best.get("snippet", "")`;
        if (snakeCase(produce).includes("document")) return `    ${safeProduce} = best.get("snippet", "")`;
        return `    ${safeProduce} = best.get("${pyEscape(produce)}") or best.get("snippet", "")`;
      });
    const producedDictLines = producesList
      .filter((produce) => snakeCase(produce) !== "citation_anchor")
      .map((produce) => `        "${pyEscape(produce)}": ${safePyName(produce, "result_field")},`);
    return [
      `def ${fnName}(${safeAnchor}: str = "", document_id: str = "") -> dict[str, Any]:`,
      `    """${description}"""`,
      `    candidates = [d for d in _CONTRACT_DOCUMENTS if d.get("source_system_id") == "${sourceSystemId}"]`,
      `    if document_id:`,
      `        candidates = [d for d in candidates if d.get("id") == document_id]`,
      `    if not candidates:`,
      `        return {"error": "no_document_for_source", "source_system_id": "${sourceSystemId}", "tool_kind": "${kind}"}`,
      `    best = None`,
      `    for doc in candidates:`,
      `        path = FIXTURES / doc.get("path", "")`,
      `        if not path.exists():`,
      `            continue`,
      `        text = path.read_text(encoding="utf-8")`,
      `        if ${safeAnchor} and ${safeAnchor}.lower() in text.lower():`,
      `            idx = text.lower().find(${safeAnchor}.lower())`,
      `            snippet = text[max(0, idx - 160):idx + 320].strip()`,
      `            best = {"id": doc.get("id"), "title": doc.get("title"), "snippet": snippet, "anchor_matched": True}`,
      `            break`,
      `        if best is None:`,
      `            best = {"id": doc.get("id"), "title": doc.get("title"), "snippet": text[:400].strip(), "anchor_matched": False}`,
      `    if best is None:`,
      `        return {"error": "documents_unavailable", "source_system_id": "${sourceSystemId}", "tool_kind": "${kind}"}`,
      ...(producedFieldLines.length ? [
        `    # Contract outputs: expose produced fields as top-level keys so`,
        `    # validators and downstream harnesses can trace spec-to-code coverage.`,
        ...producedFieldLines,
      ] : []),
      `    return {`,
      `        "source_system_id": "${sourceSystemId}",`,
      `        "tool_kind": "${kind}",`,
      `        "citation_anchor": ${safeAnchor},`,
      ...producedDictLines,
      `        "document": best,`,
      `        "evidence": ${evidenceLiteral},`,
      `    }`,
      ``,
    ].join("\n");
  }

  const safeInputs = (intent.requiredInputs || []).map((input) => ({ raw: input, safe: safePyName(input, "arg") }));
  const params = safeInputs.map(({ safe }) => `${safe}: str = ""`).join(", ");
  const requiredList = safeInputs.map(({ raw, safe }) => `("${pyEscape(raw)}", ${safe})`).join(", ");
  const requiredCheck = requiredList
    ? [
        `    missing = [name for name, value in [${requiredList}] if not value]`,
        `    if missing:`,
        `        return {"error": "missing_required_inputs", "missing": missing, "tool_kind": "${kind}", "escalation": "request_more_info"}`,
      ].join("\n")
    : "";
  const auditFmt = safeInputs.map(({ raw, safe }) => `${raw}={${safe}}`).join(", ");
  const auditFmtArgs = safeInputs.map(({ safe }) => `${safe}=${safe}`).join(", ");
  const auditLine = safeInputs.length
    ? `    audit_trail = "${pyEscape(intent.name || "intent")}(${auditFmt})".format(${auditFmtArgs})`
    : `    audit_trail = "${pyEscape(intent.name || "intent")}()"`;

  const actionProducesList = producesList.length ? producesList : ["result_id"];
  const generatedProduces = actionProducesList.filter((produce) => snakeCase(produce) !== "audit_trail");
  const producesAssignments = generatedProduces.map((produce) => {
    const safe = safePyName(produce, "result_field");
    const prefix = pyEscape(produce).toUpperCase().slice(0, 8) || "OUT";
    const idArgs = [`"${pyEscape(intent.name || "intent")}"`, ...safeInputs.map(({ safe }) => safe)].join(", ");
    return `    ${safe} = _deterministic_id("${prefix}", ${idArgs})`;
  }).join("\n");
  const producesDict = generatedProduces
    .map((produce) => `        "${pyEscape(produce)}": ${safePyName(produce, "result_field")},`)
    .join("\n");

  return [
    `def ${fnName}(${params}) -> dict[str, Any]:`,
    `    """${description}"""`,
    requiredCheck,
    auditLine,
    producesAssignments,
    `    result = {`,
    `        "source_system_id": "${sourceSystemId}",`,
    `        "tool_kind": "${kind}",`,
    `        "status": "submitted",`,
    producesDict,
    `        "audit_trail": audit_trail,`,
    `        "evidence": ${evidenceLiteral},`,
    `        "produces": ${JSON.stringify(actionProducesList)},`,
    `    }`,
    `    _append_action_event("${fnName}", result)`,
    `    return result`,
    ``,
  ].filter((line) => line !== "").join("\n");
}

function renderAgentInstruction(contract, manifest) {
  if (!contract) {
    return `You are the ${pyEscape(manifest?.id || "mock")} agent.\n\nNo behavior contract was provided on the upstream slide, so this agent only exposes read-only source adapters. Refuse to take actions and tell the operator the slide's generationSpec.behaviorContract must be filled in before this workflow can be demoed.`;
  }
  const qualityPlan = buildAgentQualityPlan({
    useCase: {
      id: manifest?.id || "generated",
      title: manifest?.useCaseSpec?.title || manifest?.id || "Generated Agent",
      rowPolicy: manifest?.useCaseSpec?.rowPolicy || {},
    },
    contract,
    systems: manifest?.systems || [],
    tables: manifest?.tables || [],
    documents: manifest?.documents || [],
  });
  const lines = [];
  lines.push(`You are ${pyTripleEscape(contract.role)}.`);
  lines.push("");
  lines.push("PRIMARY OBJECTIVE");
  lines.push(pyTripleEscape(contract.primaryObjective));
  lines.push("");
  // NOTE: build-time design (agent name, model/temperature, session-state keys,
  // callbacks, sub-agent guidance) is intentionally NOT in the runtime prompt —
  // the model can't act on it and it wastes tokens. It's emitted as a developer
  // comment header in agent.py (see renderAgentDesignNotes / the agent assembly).
  lines.push("TOOL DISCIPLINE");
  lines.push(`- Tool names follow ${qualityPlan.naming.toolNamePattern}; never invent aliases or generic helper names.`);
  lines.push("- Prefer source-specific query tools before action/notification tools.");
  lines.push("- If a required tool input is missing, ask for it or escalate; do not call write-like tools with blanks.");
  lines.push("");
  if ((contract.inScope || []).length) {
    lines.push("IN SCOPE");
    for (const item of contract.inScope) lines.push(`- ${pyTripleEscape(item)}`);
    lines.push("");
  }
  if ((contract.outOfScope || []).length) {
    lines.push("OUT OF SCOPE (refuse politely and explain why)");
    for (const item of contract.outOfScope) lines.push(`- ${pyTripleEscape(item)}`);
    lines.push("");
  }
  if ((contract.toolIntents || []).length) {
    lines.push("TOOL PLAYBOOK (always call by canonical name)");
    for (const intent of contract.toolIntents) {
      lines.push(`- ${pyTripleEscape(intent.name)} [${pyTripleEscape(intent.kind)}, ${pyTripleEscape(intent.sourceSystemId)}]: ${pyTripleEscape(intent.description)}`);
    }
    lines.push("");
  }
  if ((contract.evalEnrichment?.packHints || []).length) {
    lines.push("PACK-SPECIFIC QUALITY GATES");
    for (const hint of contract.evalEnrichment.packHints) {
      lines.push(`- ${pyTripleEscape(hint.packId)}: reference ${(hint.mustReferenceEntities || []).join(", ") || "the relevant source entities"}; success requires ${(hint.successCriteria || []).join("; ")}`);
    }
    lines.push("");
  }
  if ((contract.evidenceRequirements || []).length) {
    lines.push("EVIDENCE YOU MUST CITE");
    for (const req of contract.evidenceRequirements) {
      lines.push(`- For "${pyTripleEscape(req.claim)}": cite ${(req.mustCite || []).join(", ")} (from ${(req.sourceSystemIds || []).join(", ")}).`);
    }
    lines.push("");
  }
  if ((contract.escalationRules || []).length) {
    lines.push("ESCALATION & REFUSAL TRIGGERS");
    for (const rule of contract.escalationRules) {
      const target = rule.handoffTarget ? ` → ${pyTripleEscape(rule.handoffTarget)}` : "";
      lines.push(`- If ${pyTripleEscape(rule.trigger)}: ${pyTripleEscape(rule.action)}${target}. ${pyTripleEscape(rule.rationale)}`);
    }
    lines.push("");
  }
  if ((contract.refusalRules || []).length) {
    lines.push("HARD GUARDRAILS (never violate)");
    for (const rule of contract.refusalRules) lines.push(`- ${pyTripleEscape(rule)}`);
    lines.push("");
  }
  lines.push("RESPONSE CONTRACT");
  lines.push("- Every claim must be backed by a tool result; never invent identifiers, numbers, or citations.");
  lines.push("- For any action tool, echo the returned audit_trail line verbatim in the user-facing reply.");
  lines.push("- When a tool returns an error or escalation, surface it to the user instead of guessing.");
  lines.push("- Mention which source systems or documents support the final answer.");
  return lines.join("\n");
}

function renderGoldenEvals(contract, manifest) {
  if (!contract?.goldenEvals?.length) return null;
  return {
    generatedAt: GENERATED_AT,
    agentId: manifest?.id || "mock",
    role: contract.role,
    primaryObjective: contract.primaryObjective,
    evals: contract.goldenEvals.map((evalSpec) => ({
      id: evalSpec.id,
      prompt: evalSpec.prompt,
      expectedToolCalls: evalSpec.expectedToolCalls || [],
      mustReferenceEntities: evalSpec.mustReferenceEntities || [],
      mustCiteDocuments: evalSpec.mustCiteDocuments || [],
      expectedActionOutcome: evalSpec.expectedActionOutcome || null,
      forbiddenBehaviors: evalSpec.forbiddenBehaviors || [],
    })),
    packEvalHints: contract.evalEnrichment?.packHints || [],
    refusalRules: contract.refusalRules || [],
    escalationTriggers: (contract.escalationRules || []).map((rule) => ({
      trigger: rule.trigger,
      action: rule.action,
      rationale: rule.rationale,
    })),
  };
}

function renderAgentsCliEvalSet(contract, manifest) {
  if (!contract?.goldenEvals?.length) return null;
  const tables = manifest?.tables || [];
  const intentsByName = new Map((contract.toolIntents || []).map((intent) => [safePyName(intent.name), intent]));
  const availableToolNames = new Set([
    "list_systems",
    ...(tables.map((table) => `query_${tableToolName(table)}`)),
    ...((contract.toolIntents || [])
      .filter((intent) => intent?.name && CONTRACT_TOOL_KINDS.has(intent.kind))
      .map((intent) => canonicalIntentToolName(intent, tables))),
  ]);
  // OKF is the test spine: each Eval Scenario's "mechanisms" are the tools the
  // test MUST exercise. Prefer them over raw expectedToolCalls so the eval
  // trajectory is exactly what the OKF tests/ concepts assert (derive falls back
  // to expectedToolCalls when no explicit mechanisms exist — byte-identical then).
  const mechanismsById = new Map(deriveTestMechanisms(contract).map((t) => [t.id, t.mechanisms]));
  return {
    eval_set_id: "ge_behavior_contract",
    name: "GE Behavior Contract",
    description: `Behavior-contract evals for ${manifest?.id || "generated agent"}. Generated from the enriched use-case spec.`,
    eval_cases: contract.goldenEvals.map((evalSpec) => {
      const mechanisms = mechanismsById.get(evalSpec.id);
      const expectedToolCalls = ((mechanisms && mechanisms.length ? mechanisms : evalSpec.expectedToolCalls) || []).filter(Boolean);
      const runnableToolCalls = expectedToolCalls
        .map((name) => canonicalExpectedToolCallName(name, contract.toolIntents || [], tables))
        .filter((name) => availableToolNames.has(name));
      return {
        eval_id: evalSpec.id,
        conversation: [
          {
            invocation_id: `${evalSpec.id || "eval"}_turn_1`,
            user_content: { parts: [{ text: evalSpec.prompt }] },
            intermediate_data: runnableToolCalls.length
              ? {
                  tool_uses: runnableToolCalls.map((name) => ({ name, args: inferEvalToolArgs(evalSpec, intentsByName.get(name) || intentsByName.get(safePyName(name))) })),
                }
              : undefined,
          },
        ],
        session_input: {
          app_name: "app",
          user_id: "ge_eval_user",
          state: {},
        },
        // NOTE: ADK's EvalSet/EvalCase pydantic schema forbids extra fields
        // (extra_forbidden). Custom annotations like mustReferenceEntities must
        // NOT live on the eval_case or `adk eval` fails to load the file.
      };
    }),
  };
}

// Eval criteria the generated agents can actually be held to. We deliberately
// avoid response_match_score: the evalset has no hand-authored reference answer,
// so a lexical match would always fail. Instead:
//   - tool_trajectory_avg_score (ANY_ORDER): the agent must invoke its contract
//     tools; extra tool calls are tolerated.
//   - rubric_based_final_response_quality_v1: reference-free LLM-judge gate that
//     encodes the behavior contract's intent (grounded, cites evidence, acts).
function renderEvalConfig(contract = null) {
  const packRubrics = (contract?.evalEnrichment?.packHints || []).slice(0, 8).map((hint) => ({
    rubric_id: `pack_${safePyName(hint.packId)}`,
    rubric_content: { text_property: `For ${hint.packId}, the agent satisfies these pack-specific checks: ${(hint.successCriteria || []).join("; ")}` },
  }));
  return {
    criteria: {
      tool_trajectory_avg_score: { threshold: 1.0, match_type: "ANY_ORDER" },
      rubric_based_tool_use_quality_v1: {
        threshold: 0.75,
        rubrics: [
          { rubric_id: "source_before_action", rubric_content: { text_property: "The agent queries or searches source-system evidence before making recommendations or invoking write-like action tools." } },
          { rubric_id: "canonical_tool_names", rubric_content: { text_property: "The agent uses the generated canonical tool names and does not invent unavailable tools." } },
          { rubric_id: "safe_write_inputs", rubric_content: { text_property: "The agent does not call action or notification tools with missing required business identifiers." } },
        ],
      },
      rubric_based_final_response_quality_v1: {
        threshold: 0.78,
        rubrics: [
          { rubric_id: "grounded", rubric_content: { text_property: "The response is grounded in the source-system/tool results it retrieved and does not fabricate data." } },
          { rubric_id: "evidence", rubric_content: { text_property: "The response cites or references the source-system evidence it used." } },
          { rubric_id: "next_action", rubric_content: { text_property: "The response states a clear next action or outcome." } },
          ...packRubrics,
        ],
      },
      hallucinations_v1: { threshold: 0.8 },
      safety_v1: { threshold: 0.8 },
    },
  };
}

function renderOptimizationConfig(contract = null) {
  return {
    eval_config: renderEvalConfig(contract),
    train_dataset: "tests/eval/evalsets/ge_behavior_contract.evalset.json",
    validation_dataset: "tests/eval/evalsets/ge_behavior_contract.evalset.json",
    log_level: "WARNING",
    print_detailed_results: false,
    optimizer_config: {},
  };
}

// [project].dependencies for generated workspaces. Beyond the ADK basics, the
// agents-cli-scaffolded app/agent_runtime_app.py imports vertexai, google.cloud.logging,
// dotenv and pickles with cloudpickle; google-api-core backs the mcp backend path.
// Missing any of these → `agents-cli deploy` fails ModuleNotFoundError at runtime.
const RUNTIME_DEPS = [
  "google-adk",
  "pydantic>=2",
  "pytest>=8",
  "google-cloud-aiplatform[agent-engines]>=1.95",
  "google-cloud-logging>=3",
  "python-dotenv>=1",
  "cloudpickle>=3",
  "google-api-core>=2",
];

async function ensureAgentsCliPyprojectMetadata(dir, manifest, { deploymentTarget = "none" } = {}) {
  const pyprojectPath = join(dir, "pyproject.toml");
  let text = existsSync(pyprojectPath) ? await readFile(pyprojectPath, "utf8") : "";
  const freshlyGenerated = !text.trim();
  if (!text.trim()) {
    text = [
      `[project]`,
      // agents-cli (scaffold enhance / deploy) enforces a <=26-char project name;
      // shortAgentName keeps it readable + deterministic + unique within that bound.
      `name = "${shortAgentName(manifest?.id || "generated_agent")}"`,
      `version = "0.1.0"`,
      `requires-python = ">=3.11"`,
      // Agent Engine runtime deps: the agents-cli-scaffolded app/agent_runtime_app.py
      // imports vertexai (google-cloud-aiplatform[agent-engines]), google.cloud.logging,
      // dotenv, cloudpickle; google-api-core is needed by the mcp backend path.
      `dependencies = [${RUNTIME_DEPS.map((d) => `"${d}"`).join(", ")}]`,
      ``,
      `[project.optional-dependencies]`,
      `eval = ["google-adk[eval]"]`,
      `lint = ["ruff>=0.14.0"]`,
      ``,
      `[tool.pytest.ini_options]`,
      `pythonpath = ["."]`,
      `testpaths = ["tests"]`,
      ``,
      // Generated code uses one-liner if/def bodies (E701) and a mid-module import
      // for the runtime backend switch (E402); default ruff would fail the validate stage.
      `[tool.ruff.lint]`,
      `ignore = ["E701", "E402"]`,
      ``,
    ].join("\n");
  }
  // Reconcile [project].dependencies on an EXISTING pyproject so backfilled
  // workspaces also get the Agent Engine runtime deps (Fix 1, second half).
  // Skip when freshly generated — that branch already wrote RUNTIME_DEPS, and the
  // dep strings carry `[extras]` brackets that a regexp array-matcher would mangle.
  if (!freshlyGenerated) {
    // Locate the dependencies array start, then scan to its matching `]`,
    // ignoring any `[`/`]` that appear inside quoted strings (e.g. `pkg[extra]`).
    const startMatch = text.match(/(^|\n)(\s*dependencies\s*=\s*)\[/);
    if (startMatch) {
      const arrayOpen = startMatch.index + startMatch[0].length - 1; // index of '['
      let i = arrayOpen + 1;
      let depth = 1;
      let quote = "";
      while (i < text.length && depth > 0) {
        const ch = text[i];
        if (quote) {
          if (ch === quote) quote = "";
        } else if (ch === '"' || ch === "'") {
          quote = ch;
        } else if (ch === "[") depth += 1;
        else if (ch === "]") depth -= 1;
        i += 1;
      }
      if (depth === 0) {
        const arrayClose = i - 1; // index of matching ']'
        const current = text.slice(arrayOpen + 1, arrayClose);
        // Compare on the bare package name (before any version/extras spec) so we
        // don't duplicate a dep that's pinned differently in the existing file.
        const baseName = (d) => d.replace(/\[.*?\]/, "").split(/[<>=!~ ]/)[0];
        const currentBases = new Set(
          Array.from(current.matchAll(/["']([^"']+)["']/g)).map((m) => baseName(m[1])),
        );
        const missing = RUNTIME_DEPS.filter((d) => !currentBases.has(baseName(d)));
        if (missing.length) {
          const trimmed = current.replace(/\s+$/, "");
          const sep = trimmed.endsWith(",") || trimmed.trim() === "" ? "" : ",";
          const appended = `${trimmed}${sep} ${missing.map((d) => `"${d}"`).join(", ")}`;
          text = `${text.slice(0, arrayOpen + 1)}${appended}${text.slice(arrayClose)}`;
        }
      }
    }
  }
  // Generated code needs E701/E402 ignored (Fix 3). Add the ruff config if absent.
  if (!/\[tool\.ruff\.lint\]/.test(text)) {
    text += [
      ``,
      `[tool.ruff.lint]`,
      `ignore = ["E701", "E402"]`,
      ``,
    ].join("\n");
  }
  // agents-cli eval runs `uv sync --extra eval`; the project must declare the
  // extra or the validate stage fails with "Extra `eval` is not defined".
  if (!/\[project\.optional-dependencies\]/.test(text)) {
    text += [
      ``,
      `[project.optional-dependencies]`,
      `eval = ["google-adk[eval]"]`,
      `lint = ["ruff>=0.14.0"]`,
      ``,
    ].join("\n");
  } else if (!/^\s*eval\s*=/m.test(text)) {
    text = text.replace(/\[project\.optional-dependencies\]\n/, `[project.optional-dependencies]\neval = ["google-adk[eval]"]\n`);
  }
  if (/\[project\.optional-dependencies\]/.test(text) && !/^\s*lint\s*=/m.test(text)) {
    text = text.replace(/\[project\.optional-dependencies\]\n/, `[project.optional-dependencies]\nlint = ["ruff>=0.14.0"]\n`);
  }
  if (!/\[tool\.agents-cli\]/.test(text)) {
    text += [
      ``,
      `[tool.agents-cli]`,
      `agent_directory = "app"`,
      `region = "us-central1"`,
      ``,
    ].join("\n");
  } else if (!/agent_directory\s*=/.test(text.split(/\[tool\.agents-cli\]/)[1]?.split(/\n\[/)[0] || "")) {
    text = text.replace(/\[tool\.agents-cli\]\n/, `[tool.agents-cli]\nagent_directory = "app"\n`);
  }
  if (!/\[tool\.agents-cli\.create_params\]/.test(text)) {
    text += [
      ``,
      `[tool.agents-cli.create_params]`,
      `deployment_target = "${deploymentTarget}"`,
      ``,
    ].join("\n");
  } else if (/deployment_target\s*=/.test(text)) {
    text = text.replace(/deployment_target\s*=\s*"[^"]*"/, `deployment_target = "${deploymentTarget}"`);
  }
  await writeFile(pyprojectPath, text.endsWith("\n") ? text : `${text}\n`, "utf8");

  // Write agents-cli-manifest.yaml — the current agents-cli reads this FIRST and
  // only warns "Legacy configuration detected in pyproject.toml" when it has to
  // fall back to [tool.agents-cli]. The factory always targets agent_runtime.
  const projectName = shortAgentName(manifest?.id || "generated_agent");
  const target = deploymentTarget && deploymentTarget !== "none" ? deploymentTarget : "agent_runtime";
  const manifestYaml = stringifyYaml({
    name: projectName,
    agent_directory: "app",
    region: "us-central1",
    create_params: { deployment_target: target, is_a2a: false },
  });
  await writeFile(join(dir, "agents-cli-manifest.yaml"), manifestYaml, "utf8");

  // Enable Agent Runtime agent identity (Preview) at deploy. agents-cli / adk deploy
  // reads this; ADC then returns the per-agent SPIFFE token to app/tools.py at runtime.
  // Absent → the attached runtime SA carries the same roles (identical code path).
  await writeFile(join(dir, ".agent_engine_config.json"), JSON.stringify({ identity_type: "AGENT_IDENTITY" }, null, 2) + "\n", "utf8");
}

async function cmdTools(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "generate");
  const manifest = await readJson(manifestPath(dir), null);
  if (!manifest) fail("No manifest found. Run 'factory generate' first.");

  const tables = manifest.tables || [];
  const behaviorContract = manifest?.useCaseSpec?.behaviorContract || null;
  const contractIntents = (behaviorContract?.toolIntents || []).filter((intent) => intent && intent.name && intent.kind);
  const contractToolKinds = new Set(["action", "notification", "evidence_lookup", "calculation"]);
  const emittedContractIntents = contractIntents.filter((intent) => contractToolKinds.has(intent.kind));
  const outPath = flags.out || join(dir, "app", "tools.py");

  const lines = renderToolsPreambleLines({ manifest, tables });

  for (const t of tables) {
    const fn = tableToolName(t);
    const matchingQueryIntent = contractIntents.find((intent) => intent.kind === "query" && canonicalIntentToolName(intent, tables) === `query_${fn}`);
    const requiredFilters = new Set((matchingQueryIntent?.requiredInputs || []).map((input) => snakeCase(input)));
    const genericFilters = [...requiredFilters]
      .filter((input) => !["employee_id"].includes(input))
      .filter((input) => !(t.columns || []).some((column) => snakeCase(column.name) === input))
      .map((input) => ({ param: input, column: null }));
    const filterSpecs = (t.columns || [])
      .filter((c) => c.name === tablePrimaryKey(t) || requiredFilters.has(snakeCase(c.name)) || (c.type !== "number" && !["name", "email"].includes(c.name)))
      .slice(0, 6)
      .map((c) => ({ param: snakeCase(c.name), column: c.name }));
    if (requiredFilters.has("employee_id") && !filterSpecs.some((spec) => spec.param === "employee_id")) {
      filterSpecs.unshift({ param: "employee_id", column: tablePrimaryKey(t) });
    }
    const params = [...genericFilters, ...filterSpecs]
      .filter((spec, index, all) => all.findIndex((item) => item.param === spec.param) === index)
      .map((spec) => `${spec.param}: str = ""`)
      .join(", ");
    const hasJson = t.jsonPath;
    const produces = matchingQueryIntent?.produces?.length ? matchingQueryIntent.produces : [`${snakeCase(t.name)}_records`, `${snakeCase(t.name)}_summary`];
    const evidence = matchingQueryIntent?.evidenceEmitted?.length ? matchingQueryIntent.evidenceEmitted : ["source_system_record"];
    lines.push(
      `def query_${fn}(${params}${params ? ", " : ""}limit: int = 20) -> dict[str, Any]:`,
      `    """Query ${t.sourceSystem || "source system"} ${t.name}. Columns: ${(t.columns || []).map((c) => c.name).join(", ")}."""`,
      `    rows = ${hasJson ? `_json("${t.jsonPath}")` : `_csv("${t.path}")`}`,
    );
    if (genericFilters.some((spec) => spec.param === "lookup_key")) {
      lines.push(
        `    if lookup_key:`,
        `        needle = lookup_key.lower()`,
        `        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]`,
      );
    }
    if (genericFilters.some((spec) => spec.param === "date_range")) {
      lines.push(
        `    if date_range:`,
        `        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]`,
      );
    }
    for (const spec of filterSpecs) {
      lines.push(`    if ${spec.param}: rows = [r for r in rows if str(r.get("${spec.column}","")).lower() == ${spec.param}.lower()]`);
    }
    lines.push(`    return {"source_system": ${JSON.stringify(t.sourceSystem || null)}, "source_system_id": ${JSON.stringify(t.sourceSystemId || null)}, "table": "${t.name}", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ${JSON.stringify(produces)}, "evidence": ${JSON.stringify(evidence)}}`, ``);
  }

  // Document tools
  const docs = manifest.documents || [];
  if (docs.length > 0) {
    lines.push(...renderDocumentToolLines(docs));
  }

  const contractToolFunctionNames = [];
  if (emittedContractIntents.length) {
    lines.push(`# ── Behavior-contract tools (action / notification / evidence / calculation) ──`);
    for (const intent of emittedContractIntents) {
      lines.push(renderContractToolPython(intent));
      contractToolFunctionNames.push(safePyName(intent.name || `${intent.kind || "tool"}_tool`));
    }
  }

  const docToolNames = docs.length > 0 ? ", FunctionTool(func=list_documents), FunctionTool(func=read_document), FunctionTool(func=search_documents)" : "";
  const contractToolList = contractToolFunctionNames.length
    ? `, ${contractToolFunctionNames.map((name) => `FunctionTool(func=${name})`).join(", ")}`
    : "";
  const department = manifest?.useCaseSpec?.department || manifest?.department || "general";
  // The Agent Registry server id this agent registers as — MUST match cmdRegister's
  // serverName so the runtime resolves exactly the registered toolset by name.
  const mcpServerName = snakeCase(pipeline.name || manifest?.id || "mock-agent").replace(/_/g, "-");

  lines.push(
    `source_adapters_fixtures = [FunctionTool(func=list_systems), FunctionTool(func=describe_data_model), ${tables.map((t) => `FunctionTool(func=query_${tableToolName(t)})`).join(", ")}${docToolNames}${contractToolList}]`,
  );
  // Append the GE_DATA_BACKEND switch (fixtures | mcp). mcp resolves tools from Agent
  // Registry by server name; defines source_adapters + mock_tools alias.
  lines.push(renderToolsModule({ agentId: manifest.id, department, mcpServerName }));

  await mkdir(dirname(outPath), { recursive: true }).catch(() => {});
  await writeFile(outPath, lines.join("\n"), "utf8");

  const agentPath = join(dir, "app", "agent.py");
  const forceAgent = flags["force-agent"] === "true" || flags["force-agent"] === true;
  if (forceAgent || !existsSync(agentPath)) {
    const instruction = renderAgentInstruction(behaviorContract, manifest);
    const qualityPlan = buildAgentQualityPlan({
      useCase: {
        id: manifest?.id || "generated",
        title: manifest?.useCaseSpec?.title || manifest?.id || "Generated Agent",
        rowPolicy: manifest?.useCaseSpec?.rowPolicy || {},
      },
      contract: behaviorContract,
      systems: manifest?.systems || [],
      tables: manifest?.tables || [],
      documents: manifest?.documents || [],
    });
    const writeToolNames = (behaviorContract?.toolIntents || [])
      .filter((intent) => ["action", "notification"].includes(intent?.kind))
      .map((intent) => safePyName(intent.name));
    const evidenceMinSystemsByTool = Object.fromEntries((behaviorContract?.toolIntents || [])
      .filter((intent) => ["action", "notification"].includes(intent?.kind))
      .map((intent) => {
        const toolName = safePyName(intent.name);
        const ruleText = [
          intent?.description,
          ...(behaviorContract?.escalationRules || []).map((rule) => `${rule?.trigger || ""} ${rule?.action || ""} ${rule?.rationale || ""}`),
          ...(behaviorContract?.hardGuardrails || []).map((rule) => typeof rule === "string" ? rule : JSON.stringify(rule)),
        ].join(" ");
        const minSystems = /(?:at least\s+)?two(?:-|\s+)system|two\s+systems|2\s+systems/i.test(ruleText) ? 2 : 0;
        return [toolName, minSystems];
      })
      .filter(([, minSystems]) => minSystems > 0));
    const requiredInputsByTool = Object.fromEntries((behaviorContract?.toolIntents || [])
      .filter((intent) => intent?.name)
      .map((intent) => [safePyName(intent.name), (intent.requiredInputs || []).map((input) => snakeCase(input))]));

    // Derive the agent topology from the upstream pipeline / explicit workflow.
    // topology === "single" emits byte-identical output to the legacy single-agent
    // path (default, must never regress). sequential/parallel emit a workflow of
    // sub-agents, each scoped to its stage's tools.
    const workflow = deriveAgentWorkflow({ behaviorContract, architecture: manifest?.useCaseSpec?.architecture, manifest });
    const isMultiAgent = workflow.topology !== "single";
    const workflowAgentClass = workflow.topology === "parallel" ? "ParallelAgent" : "SequentialAgent";

    // Common header: imports + build-time design notes. The single-agent path keeps
    // the exact legacy import line and design note; the multi-agent path adds the
    // orchestration import and records the derived topology.
    const importLine = isMultiAgent
      ? `from google.adk.agents import Agent, ${workflowAgentClass}`
      : `from google.adk.agents import Agent`;
    const subAgentNote = isMultiAgent
      ? `# Topology   : ${workflow.topology} (${workflow.steps.length} stages, derived from architecture.pipeline)`
      : `# Sub-agents : ${String(qualityPlan.adkCapabilities.useSubAgentsWhen || "single agent").replace(/\s+/g, " ").slice(0, 200)}`;

    const headerLines = [
      importLine,
      `from google.adk.apps import App`,
      `from google.adk.agents.callback_context import CallbackContext`,
      `from google.genai import types as genai_types`,
      `from .tools import source_adapters`,
      ``,
      `# === Agent design (build-time notes — NOT part of the runtime prompt) ===`,
      `# Agent name : ${qualityPlan.naming.agentName}  (keep stable for evals / deployment metadata / GE registration)`,
      `# Model      : ${AGENT_MODEL} @ temperature ${qualityPlan.adkCapabilities.generateContentConfig.temperature}`,
      `# Session    : scenario_id, primary_objective, expected_tools, evidence_log, audit_trails`,
      `# Callbacks  : initialize_workflow_state, enforce_tool_contract, capture_tool_evidence`,
      subAgentNote,
      ``,
      `_INSTRUCTION = """${pyTripleEscape(instruction)}"""`,
      `_SCENARIO_ID = "${pyEscape(manifest?.id || "generated")}"`,
      `_PRIMARY_OBJECTIVE = """${pyTripleEscape(behaviorContract?.primaryObjective || "Fixture-backed generated agent.")}"""`,
      `_EXPECTED_TOOLS = ${JSON.stringify((behaviorContract?.toolIntents || []).map((intent) => canonicalIntentToolName(intent, manifest?.tables || [])).filter(Boolean))}`,
      `_WRITE_TOOLS = ${JSON.stringify(writeToolNames)}`,
      `_REQUIRED_INPUTS_BY_TOOL = ${JSON.stringify(requiredInputsByTool)}`,
      `_EVIDENCE_MIN_SYSTEMS_BY_TOOL = ${JSON.stringify(evidenceMinSystemsByTool)}`,
      ``,
      `async def initialize_workflow_state(callback_context: CallbackContext) -> None:`,
      `    """Initialize session-scoped state used by evals, callbacks, and audit review."""`,
      `    state = callback_context.state`,
      `    state.setdefault("scenario_id", _SCENARIO_ID)`,
      `    state.setdefault("primary_objective", _PRIMARY_OBJECTIVE)`,
      `    state.setdefault("expected_tools", _EXPECTED_TOOLS)`,
      `    state.setdefault("evidence_log", [])`,
      `    state.setdefault("audit_trails", [])`,
      ``,
      `# ADK injects tool-callback args by keyword. before_tool_callback signature is`,
      `# (tool, args, tool_context); after_tool_callback adds tool_response. We accept`,
      `# **kwargs for forward-compatibility across ADK versions (result vs tool_response).`,
      `async def enforce_tool_contract(tool=None, args: dict = None, tool_context=None, **kwargs) -> dict | None:`,
      `    """Block unsafe write-like tool calls before they can mutate external state."""`,
      `    args = args or {}`,
      `    tool_name = getattr(tool, "name", tool)`,
      `    if tool_name in _WRITE_TOOLS:`,
      `        required = _REQUIRED_INPUTS_BY_TOOL.get(tool_name, [])`,
      `        missing = [key for key in required if args.get(key) in ("", None)]`,
      `        missing.extend([key for key, value in args.items() if value in ("", None) and key not in missing])`,
      `        idempotency = args.get("idempotency_key") or args.get("idempotencyKey")`,
      `        if missing:`,
      `            return {"error": "missing_required_inputs", "missing": missing, "tool": tool_name, "escalation": "request_more_info"}`,
      `        if ("idempotency_key" in args or "idempotencyKey" in args) and not idempotency:`,
      `            return {"error": "missing_idempotency_key", "tool": tool_name, "escalation": "request_confirmation"}`,
      `        min_systems = _EVIDENCE_MIN_SYSTEMS_BY_TOOL.get(tool_name, 0)`,
      `        if min_systems:`,
      `            state = getattr(tool_context, "state", {}) or {}`,
      `            evidence_log = state.get("evidence_log", [])`,
      `            systems = set()`,
      `            for entry in evidence_log:`,
      `                if not isinstance(entry, dict):`,
      `                    continue`,
      `                source = entry.get("source_system_id") or entry.get("source_system")`,
      `                if source:`,
      `                    systems.add(str(source).lower().replace(" ", "").replace("_", "").replace("/", ""))`,
      `            if len(systems) < min_systems:`,
      `                return {"error": "insufficient_evidence", "tool": tool_name, "required_source_systems": min_systems, "actual_source_systems": sorted(systems), "escalation": "refuse", "rationale": "Single-system evidence is insufficient to authorize external state changes without manual review."}`,
      `    return None`,
      ``,
      `async def capture_tool_evidence(tool=None, args: dict = None, tool_context=None, tool_response=None, **kwargs) -> dict | None:`,
      `    """Record source evidence and audit trails in session state without changing the tool result."""`,
      `    tool_name = getattr(tool, "name", tool)`,
      `    result = tool_response if tool_response is not None else kwargs.get("result")`,
      `    state = getattr(tool_context, "state", None)`,
      `    if state is None:`,
      `        return None`,
      `    evidence_log = state.setdefault("evidence_log", [])`,
      `    if isinstance(result, dict):`,
      `        evidence_log.append({`,
      `            "tool": tool_name,`,
      `            "source_system": result.get("source_system") or result.get("source_system_id"),`,
      `            "evidence": result.get("evidence"),`,
      `            "table": result.get("table"),`,
      `            "total": result.get("total"),`,
      `        })`,
      `        if result.get("audit_trail"):`,
      `            state.setdefault("audit_trails", []).append(result["audit_trail"])`,
      `    return None`,
      ``,
    ];

    // generate_content_config body shared by single + multi (sub-)agents. Inline
    // comment preserved so the single-agent path stays byte-identical to legacy.
    const generateConfigLines = [
      `    generate_content_config=genai_types.GenerateContentConfig(`,
      `        temperature=${qualityPlan.adkCapabilities.generateContentConfig.temperature},`,
      // Emit max_output_tokens only when the use case warrants a bound; otherwise
      // omit it so the agent uses the model's default budget (never the 2048 boilerplate).
      ...(qualityPlan.adkCapabilities.generateContentConfig.maxOutputTokens != null
        ? [`        max_output_tokens=${qualityPlan.adkCapabilities.generateContentConfig.maxOutputTokens},`]
        : []),
      `    ),`,
    ];

    let agentTail;
    if (!isMultiAgent) {
      // ── Single-agent path: byte-identical to the legacy emitter. ──
      agentTail = [
        `root_agent = Agent(`,
        `    name="${qualityPlan.naming.agentName}",`,
        `    model="${AGENT_MODEL}",`,
        `    description="${pyEscape(qualityPlan.naming.displayName)}: ${pyEscape((behaviorContract?.primaryObjective || "Fixture-backed generated agent.").slice(0, 180))}",`,
        `    instruction=_INSTRUCTION,`,
        ...generateConfigLines,
        `    output_key="${qualityPlan.adkCapabilities.outputKey}",`,
        `    before_agent_callback=initialize_workflow_state,`,
        `    before_tool_callback=enforce_tool_contract,`,
        `    after_tool_callback=capture_tool_evidence,`,
        `    tools=source_adapters,`,
        `)`,
        ``,
        `app = App(root_agent=root_agent, name="app")`,
        ``,
      ];
    } else {
      // ── Multi-agent path: SequentialAgent/ParallelAgent of stage sub-agents. ──
      // Each sub-agent is scoped to its stage's tools via _pick(); tools.py is
      // unchanged (source_adapters stays the full list). The orchestration agent
      // (SequentialAgent/ParallelAgent) takes name/description/sub_agents only.
      const scenario = pyEscape(manifest?.id ? safePyName(manifest.id) : "generated");
      const subAgentVars = workflow.steps.map((step) => `${scenario}_${step.id}`);
      agentTail = [];
      // name -> tool object map + picker, so a sub-agent can request a tool subset
      // by name without re-deriving the FunctionTool list.
      agentTail.push(
        `# Resolve each tool by its runtime name (FunctionTool.name or the wrapped`,
        `# function's __name__) so stage sub-agents can claim a subset of source_adapters.`,
        `_TOOLS_BY_NAME = {getattr(t, "name", None) or getattr(getattr(t, "func", None), "__name__", None): t for t in source_adapters}`,
        ``,
        ``,
        `def _pick(*names):`,
        `    """Return the source_adapters tools matching the given names, preserving order."""`,
        `    return [_TOOLS_BY_NAME[n] for n in names if n in _TOOLS_BY_NAME]`,
        ``,
        ``,
      );
      workflow.steps.forEach((step, index) => {
        const varName = subAgentVars[index];
        const pickArgs = step.toolNames.map((name) => `"${pyEscape(name)}"`).join(", ");
        agentTail.push(
          `${varName} = Agent(`,
          `    name="${pyEscape(varName)}",`,
          `    model="${AGENT_MODEL}",`,
          `    description="${pyEscape(step.label).slice(0, 180)}",`,
          `    instruction="""${pyTripleEscape(step.instruction)}""",`,
          ...generateConfigLines,
          // Distinct per-stage output_key so sequential stages don't clobber each
          // other and parallel branches don't collide on a shared key.
          `    output_key="${pyEscape(safePyName(`${step.id}_output`) || `${qualityPlan.adkCapabilities.outputKey}_${index}`)}",`,
          // initialize_workflow_state seeds shared session state. It is wired on
          // EVERY sub-agent: ParallelAgent branches do NOT share state, so each
          // branch must seed evidence_log/expected_tools itself (setdefault is
          // idempotent, so this is also safe for the sequential topology).
          `    before_agent_callback=initialize_workflow_state,`,
          `    before_tool_callback=enforce_tool_contract,`,
          `    after_tool_callback=capture_tool_evidence,`,
          `    tools=_pick(${pickArgs}),`,
          `)`,
          ``,
          ``,
        );
      });
      agentTail.push(
        `root_agent = ${workflowAgentClass}(`,
        `    name="${qualityPlan.naming.agentName}",`,
        `    description="${pyEscape(qualityPlan.naming.displayName)}: ${pyEscape((behaviorContract?.primaryObjective || "Fixture-backed generated agent.").slice(0, 180))}",`,
        `    sub_agents=[${subAgentVars.join(", ")}],`,
        `)`,
        ``,
        `app = App(root_agent=root_agent, name="app")`,
        ``,
      );
    }

    await writeFile(agentPath, [...headerLines, ...agentTail].join("\n"), "utf8");

    // Persist the derived workflow as a sidecar so downstream validators (the
    // Antigravity harness review/refine) can check the emitted agent.py topology +
    // per-stage tools against the spec without re-deriving from the manifest.
    await writeJson(join(dir, "artifacts", "agent-workflow.json"), {
      generatedAt: GENERATED_AT,
      agentId: manifest?.id || "generated",
      topology: workflow.topology,
      expectedTools: (behaviorContract?.toolIntents || [])
        .map((intent) => canonicalIntentToolName(intent, manifest?.tables || [])).filter(Boolean),
      steps: workflow.steps.map((step) => ({ id: step.id, label: step.label, toolNames: step.toolNames })),
    });
  }

  const goldenEvals = renderGoldenEvals(behaviorContract, manifest);
  const agentsCliEvalSet = renderAgentsCliEvalSet(behaviorContract, manifest);
  let goldenPath = null;
  if (goldenEvals) {
    goldenPath = join(dir, "evals", "golden.json");
    await mkdir(join(dir, "evals"), { recursive: true }).catch(() => {});
    await writeJson(goldenPath, goldenEvals);
  }
  let agentsCliEvalSetPath = null;
  if (agentsCliEvalSet) {
    agentsCliEvalSetPath = join(dir, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json");
    await mkdir(join(dir, "tests", "eval", "evalsets"), { recursive: true }).catch(() => {});
    await writeJson(agentsCliEvalSetPath, agentsCliEvalSet);
    // eval_config.json so `agents-cli eval run` uses achievable criteria
    // instead of the default response_match (which needs a reference answer).
    await writeJson(join(dir, "tests", "eval", "eval_config.json"), renderEvalConfig(behaviorContract));
    await writeJson(join(dir, "tests", "eval", "optimization_config.json"), renderOptimizationConfig(behaviorContract));
  }

  // OKF grounding artifact: emit the agent's spec AS an OKF v0.1 Knowledge
  // Bundle into the workspace (app/knowledge/), so the DEPLOYED agent can read
  // what it answers (queries/), how each is tested (tests/), and its source
  // documents (documents/) as portable, typed concepts. Additive — generation
  // proceeds even if conversion fails; the agent/tools output is unaffected.
  let okfBundleDir = null;
  if (behaviorContract) {
    try {
      const okfSpec = {
        id: manifest?.id || "generated",
        title: manifest?.useCaseSpec?.title || manifest?.id || "generated",
        subtitle: manifest?.useCaseSpec?.subtitle,
        persona: manifest?.useCaseSpec?.persona,
        department: manifest?.domain,
        kpis: manifest?.useCaseSpec?.kpis || [],
        architecture: manifest?.useCaseSpec?.architecture,
        generationSpec: {
          behaviorContract,
          sourceSystems: manifest?.systems || [],
          entities: manifest?.tables || [],
          documents: manifest?.documents || [],
        },
      };
      const concepts = buildOkfBundle(okfSpec);
      okfBundleDir = join(dir, "app", "knowledge");
      for (const concept of concepts) {
        const abs = join(okfBundleDir, `${concept.relPath}.md`);
        await mkdir(join(abs, ".."), { recursive: true }).catch(() => {});
        await writeFile(abs, renderOkfConcept(concept.fields, concept.body), "utf8");
      }
    } catch (error) {
      // Non-fatal: knowledge bundle is grounding, not a build gate.
      okfBundleDir = null;
    }

    // OKF coverage sidecar: the canonical tool name each Query Capability and
    // each Eval Scenario's mechanisms require — so the Antigravity refine step
    // can verify the built agent COVERS every query (tools reachable) and that
    // every test's mechanisms are callable. Topology-independent (unlike the
    // agent-workflow sidecar, which only exists for multi-stage agents).
    try {
      const canon = (name) => {
        const intent = (behaviorContract.toolIntents || []).find((i) => i.name === name);
        return intent ? canonicalIntentToolName(intent, manifest?.tables || []) : name;
      };
      const queries = deriveAnswerableQueries(behaviorContract).map((q) => ({
        id: q.id,
        request: q.request,
        stage: q.stage,
        tools: (q.tools || []).map(canon).filter(Boolean),
      }));
      const tests = deriveTestMechanisms(behaviorContract).map((t) => ({
        id: t.id,
        validates: t.validates,
        mechanisms: (t.mechanisms || []).map(canon).filter(Boolean),
      }));
      if (queries.length || tests.length) {
        await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});
        await writeJson(join(dir, "artifacts", "okf-coverage.json"), {
          generatedAt: GENERATED_AT,
          agentId: manifest?.id || "generated",
          queries,
          tests,
        });
      }
    } catch {
      // Non-fatal.
    }
  }

  const initPath = join(dir, "app", "__init__.py");
  await writeFile(initPath, `from .agent import app, root_agent\n\n__all__ = ["app", "root_agent"]\n`, "utf8");

  await ensureAgentsCliPyprojectMetadata(dir, manifest);

  const fns = [
    "list_systems",
    ...tables.map((t) => `query_${tableToolName(t)}`),
    ...contractToolFunctionNames,
  ];
  markStep(pipeline, "tools", "done", {
    output: outPath,
    functions: fns.length,
    behaviorContract: behaviorContract ? "present" : "missing",
    contractTools: contractToolFunctionNames.length,
    goldenEvals: goldenEvals ? goldenEvals.evals.length : 0,
    agentsCliEvalSet: agentsCliEvalSetPath,
    okfKnowledgeBundle: okfBundleDir,
  });
  await savePipeline(dir, pipeline);
  ok({
    step: "tools",
    output: outPath,
    functions: fns,
    behaviorContract: behaviorContract ? "present" : "missing",
    contractTools: contractToolFunctionNames,
    goldenEvalsPath: goldenPath,
    agentsCliEvalSetPath,
    okfKnowledgeBundle: okfBundleDir,
    agentGenerated: !existsSync(agentPath) || true,
  });
}

function tableToolName(table) {
  const source = snakeCase(table.sourceSystemId || "source");
  const tableName = snakeCase(table.name || "records");
  const dedupedTable = tableName === source || tableName.startsWith(`${source}_`)
    ? tableName.slice(source.length).replace(/^_+/, "") || "records"
    : tableName;
  return snakeCase(`${source}_${dedupedTable}`);
}

function queryIntentTableName(intent) {
  const source = snakeCase(intent?.sourceSystemId || "");
  const name = snakeCase(intent?.name || "").replace(/^query_/, "");
  if (source && name.startsWith(`${source}_`)) return name.slice(source.length + 1) || "records";
  return name || "records";
}

function canonicalIntentToolName(intent, tables = []) {
  if (!intent?.name) return "";
  if (intent.kind !== "query") return safePyName(intent.name);
  const source = snakeCase(intent.sourceSystemId || "");
  const tableName = queryIntentTableName(intent);
  // Materialized contract tables are now source-qualified (e.g. "workday_records"),
  // so accept either the bare tail or the source-qualified form when matching by
  // name — both alongside a matching sourceSystemId.
  const qualifiedName = source && tableName !== source && !tableName.startsWith(`${source}_`)
    ? snakeCase(`${source}_${tableName}`)
    : tableName;
  const nameMatches = (table) => {
    const tn = snakeCase(table.name || "");
    return tn === tableName || tn === qualifiedName;
  };
  const matchingTable = tables.find((table) => (
    snakeCase(table.sourceSystemId || "") === source && nameMatches(table)
  ));
  if (matchingTable) return `query_${tableToolName(matchingTable)}`;
  // Fallback by name only is allowed ONLY when it does not cross source systems:
  // require the candidate's sourceSystemId to match the intent's, so a same-tail
  // table from a DIFFERENT system can never claim this intent's tool name.
  const sameNameTables = tables.filter((table) => (
    nameMatches(table) && snakeCase(table.sourceSystemId || "") === source
  ));
  if (sameNameTables.length === 1) return `query_${tableToolName(sameNameTables[0])}`;
  return safePyName(intent.name);
}

function canonicalExpectedToolCallName(name, intents = [], tables = []) {
  const safeName = safePyName(name);
  const intent = intents.find((candidate) => safePyName(candidate?.name || "") === safeName);
  return intent ? canonicalIntentToolName(intent, tables) : safeName;
}

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
function contractGovernancePreamble(contract) {
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
function sharedAgentGuardrails(contract) {
  const lines = [];
  lines.push("SHARED GUARDRAILS (apply to every stage)");
  lines.push("- Every claim must be backed by a tool result; never invent identifiers, numbers, or citations.");
  lines.push("- Prefer source-specific query/evidence tools before any action or notification tool.");
  lines.push("- If a required tool input is missing, ask for it or escalate; never call write-like tools with blanks.");
  for (const rule of (contract?.refusalRules || []).slice(0, 6)) {
    lines.push(`- ${pyTripleEscape(rule)}`);
  }
  return lines.join("\n");
}

function buildStepInstruction({ label, description, contract }) {
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

function deriveAgentWorkflow({ behaviorContract, architecture, manifest } = {}) {
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

async function cmdTest(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "tools");
  const manifest = await readJson(manifestPath(dir), null);
  if (!manifest) fail("No manifest. Run 'factory generate' first.");

  const testPath = flags.out || join(dir, "tests", "test_smoke.py");
  const tables = manifest.tables || [];
  const lines = [
    `"""Auto-generated smoke tests for: ${manifest.id}"""`,
    `import json, csv, os`,
    `from pathlib import Path`,
    `import pytest`,
    ``,
    `FIX = Path(os.environ.get("FIXTURES_ROOT", str(Path(__file__).resolve().parent.parent / "fixtures")))`,
    ``,
    `class TestFixtures:`,
    `    def test_manifest(self):`,
    `        m = json.loads((FIX / "manifest.json").read_text())`,
    `        assert m["id"] == "${manifest.id}"`,
    ``,
  ];

  for (const t of tables) {
    const fn = tableToolName(t);
    lines.push(
      `    def test_${snakeCase(t.name)}_exists(self):`,
      `        p = FIX / "${t.jsonPath || t.path}"`,
      `        assert p.exists()`,
      `        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))`,
      `        assert len(data) > 0`,
      ``,
    );
  }

  const behaviorContract = manifest?.useCaseSpec?.behaviorContract || null;
  const contractToolKinds = new Set(["action", "notification", "evidence_lookup", "calculation"]);
  const contractIntents = (behaviorContract?.toolIntents || []).filter((intent) => intent && intent.name && contractToolKinds.has(intent.kind));
  const allContractIntents = (behaviorContract?.toolIntents || []).filter((intent) => intent && intent.name && CONTRACT_INTENT_KINDS.has(intent.kind));
  const contractToolFnNames = contractIntents.map((intent) => canonicalIntentToolName(intent, tables));
  const allContractToolFnNames = allContractIntents.map((intent) => canonicalIntentToolName(intent, tables));
  const firstWriteIntent = allContractIntents.find((intent) => ["action", "notification"].includes(intent.kind));
  const minAdapters = tables.length + 1 + contractToolFnNames.length;

  lines.push(
    `class TestTools:`,
    `    def test_import(self):`,
    `        from app.tools import source_adapters`,
    `        assert len(source_adapters) >= ${minAdapters}`,
    ``,
    `    def test_list_systems(self):`,
    `        from app.tools import list_systems`,
    `        r = list_systems()`,
    `        assert len(r["tables"]) == ${tables.length}`,
    ``,
  );

  for (const t of tables) {
    const fn = tableToolName(t);
    lines.push(
      `    def test_query_${fn}(self):`,
      `        from app.tools import query_${fn}`,
      `        r = query_${fn}(limit=5)`,
      `        assert r["total"] > 0`,
      `        assert r.get("source_system")`,
      ``,
    );
  }

  if (contractToolFnNames.length) {
    lines.push(
      `class TestBehaviorContract:`,
      `    def test_contract_tools_importable(self):`,
      `        from app import tools as tools_module`,
      `        for fn in ${JSON.stringify(allContractToolFnNames)}:`,
      `            assert hasattr(tools_module, fn), f"Contract tool {fn} missing from app.tools"`,
      ``,
      `    def test_agent_instruction_is_task_specific(self):`,
      `        from app.agent import root_agent`,
      `        # Single-agent carries the full instruction; multi-agent (SequentialAgent/`,
      `        # ParallelAgent) has no .instruction — the contract is distributed across`,
      `        # stage sub-agents. Combine whatever instructions exist.`,
      `        agents = [root_agent, *list(getattr(root_agent, "sub_agents", []) or [])]`,
      `        text = "\\n".join((getattr(a, "instruction", "") or "") for a in agents)`,
      `        assert "ADK RUNTIME DESIGN" not in text, "build-time design notes leaked into the runtime prompt"`,
      `        assert len(text) > 400, "Agent instruction is too short to be task-specific"`,
      `        assert ("PRIMARY OBJECTIVE" in text and "TOOL PLAYBOOK" in text) or "STAGE:" in text, "instruction lacks objective/playbook (single) or stage structure (multi)"`,
      ``,
      `    def test_agent_uses_advanced_adk_configuration(self):`,
      `        source = (Path(__file__).resolve().parent.parent / "app" / "agent.py").read_text()`,
      `        assert "generate_content_config=" in source`,
      `        assert "output_key=" in source`,
      `        assert "before_agent_callback=initialize_workflow_state" in source`,
      `        assert "before_tool_callback=enforce_tool_contract" in source`,
      `        assert "after_tool_callback=capture_tool_evidence" in source`,
      `        assert "description=" in source`,
      ``,
      `    def test_tool_callbacks_accept_adk_signature(self):`,
      `        """Invoke the callbacks the way ADK does (by keyword) so a signature`,
      `        mismatch fails here, deterministically, instead of at runtime."""`,
      `        import asyncio`,
      `        from app.agent import enforce_tool_contract, capture_tool_evidence`,
      `        class _Tool:  # minimal stand-in for an ADK BaseTool`,
      `            name = "list_systems"`,
      `        class _Ctx:`,
      `            def __init__(self): self.state = {}`,
      `        # ADK: before_tool_callback(tool, args, tool_context)`,
      `        before = asyncio.run(enforce_tool_contract(tool=_Tool(), args={}, tool_context=_Ctx()))`,
      `        assert before is None or isinstance(before, dict)`,
      `        # ADK: after_tool_callback(tool, args, tool_context, tool_response)`,
      `        ctx = _Ctx()`,
      `        after = asyncio.run(capture_tool_evidence(tool=_Tool(), args={}, tool_context=ctx, tool_response={"source_system": "x", "audit_trail": "a"}))`,
      `        assert after is None or isinstance(after, dict)`,
      `        assert ctx.state.get("evidence_log") is not None`,
      ``,
    );
    if (firstWriteIntent) {
      const fn = safePyName(firstWriteIntent.name);
      const sampleArgs = Object.fromEntries((firstWriteIntent.requiredInputs || []).map((input) => {
        const key = snakeCase(input);
        if (key === "employee_id") return [key, "EMP-0007"];
        if (key === "plan_id") return [key, "PLAN-STANDARD-PPO-FAMILY"];
        if (key === "coverage_tier") return [key, "family"];
        if (key === "enrollment_id") return [key, "ENROLLME-TEST"];
        if (key === "audit_trail") return [key, "AUDIT_TR-TEST"];
        return [key, `test_${key}`];
      }));
      lines.push(
        `    def test_write_tools_emit_action_events(self, tmp_path, monkeypatch):`,
        `        monkeypatch.setenv("ACTION_EVENTS_PATH", str(tmp_path / "action-events.jsonl"))`,
        `        from app import tools as tools_module`,
        `        result = getattr(tools_module, "${fn}")(**${JSON.stringify(sampleArgs)})`,
        `        assert result.get("audit_trail")`,
        `        event_path = tmp_path / "action-events.jsonl"`,
        `        assert event_path.exists()`,
        `        assert "${fn}" in event_path.read_text()`,
        ``,
      );
      const ruleText = [
        firstWriteIntent?.description,
        ...(behaviorContract?.escalationRules || []).map((rule) => `${rule?.trigger || ""} ${rule?.action || ""} ${rule?.rationale || ""}`),
        ...(behaviorContract?.hardGuardrails || []).map((rule) => typeof rule === "string" ? rule : JSON.stringify(rule)),
      ].join(" ");
      if (/(?:at least\s+)?two(?:-|\s+)system|two\s+systems|2\s+systems/i.test(ruleText)) {
        lines.push(
          `    def test_write_tool_requires_multi_system_evidence(self):`,
          `        import asyncio`,
          `        from app.agent import enforce_tool_contract`,
          `        class _Tool:`,
          `            name = "${fn}"`,
          `        class _Ctx:`,
          `            def __init__(self, evidence_log): self.state = {"evidence_log": evidence_log}`,
          `        args = ${JSON.stringify(sampleArgs)}`,
          `        blocked = asyncio.run(enforce_tool_contract(tool=_Tool(), args=args, tool_context=_Ctx([])))`,
          `        assert blocked and blocked.get("error") == "insufficient_evidence"`,
          `        allowed = asyncio.run(enforce_tool_contract(tool=_Tool(), args=args, tool_context=_Ctx([{"source_system_id": "system_a"}, {"source_system_id": "system_b"}])))`,
          `        assert allowed is None`,
          ``,
        );
      }
    }
  }

  const goldenPath = join(dir, "evals", "golden.json");
  if (existsSync(goldenPath)) {
    lines.push(
      `class TestGoldenEvals:`,
      `    def test_golden_evals_present(self):`,
      `        path = Path(__file__).resolve().parent.parent / "evals" / "golden.json"`,
      `        data = json.loads(path.read_text())`,
      `        assert data.get("primaryObjective"), "golden.json must echo the contract primaryObjective"`,
      `        assert data.get("evals"), "evals/golden.json must contain at least one eval"`,
      `        for ev in data["evals"]:`,
      `            assert ev.get("prompt"), "Each golden eval needs a prompt"`,
      `            assert ev.get("expectedToolCalls"), f"Eval {ev.get('id')} must declare expectedToolCalls"`,
      ``,
    );
  }

  if (existsSync(join(dir, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json"))) {
    lines.push(
      `class TestAgentsCliEvals:`,
      `    def test_agents_cli_eval_assets_present(self):`,
      `        root = Path(__file__).resolve().parent.parent`,
      `        evalset = root / "tests" / "eval" / "evalsets" / "ge_behavior_contract.evalset.json"`,
      `        config = root / "tests" / "eval" / "eval_config.json"`,
      `        optimization = root / "tests" / "eval" / "optimization_config.json"`,
      `        assert evalset.exists(), "agents-cli evalset missing"`,
      `        assert config.exists(), "agents-cli eval config missing"`,
      `        assert optimization.exists(), "agents-cli optimization config missing"`,
      `        data = json.loads(evalset.read_text())`,
      `        opt = json.loads(optimization.read_text())`,
      `        assert data.get("eval_cases"), "agents-cli evalset must include eval_cases"`,
      `        assert opt.get("train_dataset") == "tests/eval/evalsets/ge_behavior_contract.evalset.json"`,
      ``,
    );
  }

  await mkdir(dirname(testPath), { recursive: true }).catch(() => {});
  await writeFile(testPath, lines.join("\n"), "utf8");

  let testResult = { ran: false };
  if (flags["run"] !== "false") {
    try {
      const relTestPath = relative(dir, testPath);
      const includeIntegration = flags["include-integration"] === "true";
      const pytestTarget = includeIntegration ? "tests/" : relTestPath;
      console.error(`Running: uv run pytest ${pytestTarget} -v`);
      const r = await runCommand("uv", ["run", "pytest", pytestTarget, "-v", "--tb=short"], { cwd: dir, stream: true, allowFail: true, timeout: 120000 });
      testResult = { ran: true, passed: r.code === 0, exitCode: r.code };
    } catch (e) {
      testResult = { ran: true, passed: false, error: e.message };
    }
  }

  const testStatus = testResult.ran ? (testResult.passed ? "done" : "failed") : "created";
  markStep(pipeline, "test", testStatus, { output: testPath, ...testResult });
  await savePipeline(dir, pipeline);
  ok({ step: "test", output: testPath, tests: tables.length * 2 + 2, ...testResult });
}

async function cmdEval(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "tools");
  const manifest = await readJson(manifestPath(dir), null);
  if (!manifest) fail("No manifest. Run 'factory generate' first.");
  await ensureAgentsCliPyprojectMetadata(dir, manifest);

  const behaviorContract = manifest?.useCaseSpec?.behaviorContract || null;
  const evalSet = renderAgentsCliEvalSet(behaviorContract, manifest);
  const evalSetPath = join(dir, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json");
  if (evalSet) {
    await mkdir(join(dir, "tests", "eval", "evalsets"), { recursive: true }).catch(() => {});
    await writeJson(evalSetPath, evalSet);
    await writeJson(join(dir, "tests", "eval", "eval_config.json"), renderEvalConfig(behaviorContract));
    await writeJson(join(dir, "tests", "eval", "optimization_config.json"), renderOptimizationConfig(behaviorContract));
  }

  if (!evalSet && flags.run !== "false") {
    fail("No behaviorContract.goldenEvals found; cannot run agents-cli evals for this workspace.");
  }

  let evalResult = { ran: false, evalSetPath: evalSet ? evalSetPath : null };
  if (flags.run !== "false" && evalSet) {
    try {
      const args = ["eval", "run", "--all"];
      if (flags["eval-timeout"]) args.push("--timeout", String(flags["eval-timeout"]));
      console.error(`Running: agents-cli ${args.join(" ")}`);
      const r = await runCommand("agents-cli", args, { cwd: dir, stream: true, allowFail: true, timeout: Number(flags["timeout-ms"] || 900000) });
      evalResult = { ran: true, passed: r.code === 0, exitCode: r.code, evalSetPath };
    } catch (e) {
      evalResult = { ran: true, passed: false, error: e.message, evalSetPath };
    }
  }

  const evalStatus = evalResult.ran ? (evalResult.passed ? "done" : "failed") : (pipeline.steps?.test?.status || "created");
  markStep(pipeline, "test", evalStatus, {
    ...(pipeline.steps?.test || {}),
    agentsCliEval: evalResult,
  });
  await savePipeline(dir, pipeline);
  ok({ step: "eval", ...evalResult });
}

function shouldRunFlag(flags, key, fallback = true) {
  if (!(key in flags)) return fallback;
  return !["false", "0", "no", "off"].includes(String(flags[key]).toLowerCase());
}

function truthyFlag(value) {
  return ["true", "1", "yes", "on"].includes(String(value || "").toLowerCase());
}

function falsyFlag(value) {
  return ["false", "0", "no", "off"].includes(String(value || "").toLowerCase());
}

function wantsVertex(flags = {}) {
  if (truthyFlag(flags["no-vertex"])) return false;
  if ("vertex" in flags) return !falsyFlag(flags.vertex);
  return true;
}

function shouldRunHarnessReview(flags = {}, fallback = false) {
  if ("harness-review" in flags) return truthyFlag(flags["harness-review"]);
  if ("review" in flags) return truthyFlag(flags.review);
  if (fallback) return true;
  return Boolean(
    process.env.GEMINI_API_KEY
    || truthyFlag(flags.vertex)
    || truthyFlag(process.env.ANTIGRAVITY_USE_VERTEXAI)
    || truthyFlag(process.env.GOOGLE_GENAI_USE_VERTEXAI)
  );
}

function shouldRunHarnessRefine(flags = {}, fallback = false) {
  if ("harness-refine" in flags) return truthyFlag(flags["harness-refine"]);
  if ("refine" in flags) return truthyFlag(flags.refine);
  return shouldRunHarnessReview(flags, fallback);
}

async function runLifecycleCommand({ dir, name, args, timeout = 180000, artifact = null, allowFail = false }) {
  console.error(`Running: agents-cli ${args.join(" ")}`);
  const result = await runCommand("agents-cli", args, { cwd: dir, stream: false, allowFail: true, timeout });
  if (artifact) {
    await writeText(join(dir, "artifacts", artifact), [
      `# agents-cli ${name}`,
      "",
      `Command: agents-cli ${args.join(" ")}`,
      `Exit: ${result.code}`,
      "",
      "## stdout",
      "```",
      result.stdout || "",
      "```",
      "",
      "## stderr",
      "```",
      result.stderr || "",
      "```",
      "",
    ].join("\n"));
  }
  if (result.code !== 0 && !allowFail) {
    const error = new Error(`agents-cli ${args.join(" ")} failed with exit ${result.code}`);
    error.result = result;
    throw error;
  }
  return { name, command: ["agents-cli", ...args], exitCode: result.code, ok: result.code === 0, stdout: result.stdout?.slice(-8000) || "", stderr: result.stderr?.slice(-8000) || "" };
}

async function cmdQualityGate(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "tools");
  const manifest = await readJson(manifestPath(dir), null);
  if (!manifest) fail("No manifest. Run 'factory generate' first.");
  await ensureAgentsCliPyprojectMetadata(dir, manifest);
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});

  const startedAt = new Date().toISOString();
  const results = [];
  const runEvals = shouldRunFlag(flags, "evals", true);
  const runPreview = shouldRunFlag(flags, "preview", true);
  const runLint = shouldRunFlag(flags, "lint", true);
  const runOptimize = shouldRunFlag(flags, "optimize", false);
  const runHarness = shouldRunHarnessReview(flags, false);
  const runRefine = shouldRunHarnessRefine(flags, false);
  const prompt = flags.prompt || "hello";

  try {
    results.push(await runLifecycleCommand({ dir, name: "install", args: ["install"], timeout: 180000, artifact: "agents-cli-install.log.md" }));
    const info = await runLifecycleCommand({ dir, name: "info", args: ["info", "--json"], timeout: 60000, artifact: "agents-cli-info.log.md" });
    results.push(info);
    if (info.stdout?.trim()) {
      await writeText(join(dir, "artifacts", "agents-cli-info.json"), `${info.stdout.trim()}\n`);
    }
    if (runLint) {
      const lintArgs = ["lint"];
      if (flags["lint-fix"] === "true") lintArgs.push("--fix");
      if (flags["lint-mypy"] === "true") lintArgs.push("--mypy");
      if (shouldRunFlag(flags, "skip-codespell", true)) lintArgs.push("--skip-codespell");
      if (shouldRunFlag(flags, "skip-ty", true)) lintArgs.push("--skip-ty");
      results.push(await runLifecycleCommand({ dir, name: "lint", args: lintArgs, timeout: 180000, artifact: "agents-cli-lint.log.md" }));
    }
    if (runEvals && existsSync(join(dir, "tests", "eval", "evalsets"))) {
      const evalArgs = ["eval", "run", "--all"];
      if (existsSync(join(dir, "tests", "eval", "eval_config.json"))) evalArgs.push("--config", "tests/eval/eval_config.json");
      results.push(await runLifecycleCommand({ dir, name: "eval", args: evalArgs, timeout: Number(flags["eval-timeout-ms"] || 900000), artifact: "agents-cli-eval.log.md" }));
    }
    if (runOptimize) {
      const optimizeConfig = flags["optimize-config"] || "tests/eval/optimization_config.json";
      if (!existsSync(join(dir, optimizeConfig))) {
        throw new Error(`Optimization requested but ${optimizeConfig} does not exist`);
      }
      const optimizeArgs = ["eval", "optimize", "--config", optimizeConfig];
      if (flags["target-metric"]) optimizeArgs.push("--target-metric", flags["target-metric"]);
      if (flags.dataset) optimizeArgs.push("--dataset", flags.dataset);
      results.push(await runLifecycleCommand({ dir, name: "optimize", args: optimizeArgs, timeout: Number(flags["optimize-timeout-ms"] || 1800000), artifact: "agents-cli-optimize.log.md" }));
    }
    if (runPreview) {
      results.push(await runLifecycleCommand({ dir, name: "run", args: ["run", prompt, "--start-server"], timeout: Number(flags["preview-timeout-ms"] || 120000), artifact: "agents-cli-run.log.md" }));
    }
    let harnessReview = null;
    if (runHarness) {
      harnessReview = await cmdHarnessReview(dir, flags);
      results.push({ name: "harness-review", command: ["factory", "harness-review"], exitCode: 0, ok: true, stdout: JSON.stringify(harnessReview), stderr: "" });
    }
    let harnessRefine = null;
    if (runRefine) {
      harnessRefine = await cmdHarnessRefine(dir, flags);
      results.push({ name: "harness-refine", command: ["factory", "harness-refine"], exitCode: 0, ok: true, stdout: JSON.stringify(harnessRefine), stderr: "" });
    }

    const report = {
      kind: "ge.agents_cli.quality_gate",
      ok: results.every((item) => item.ok),
      startedAt,
      completedAt: new Date().toISOString(),
      prompt,
      harnessReview,
      harnessRefine,
      commands: results.map((item) => ({ name: item.name, command: item.command, exitCode: item.exitCode, ok: item.ok })),
    };
    await writeJson(join(dir, "artifacts", "agents-cli-quality-gate.json"), report);
    markStep(pipeline, "qualityGate", report.ok ? "done" : "failed", {
      output: "artifacts/agents-cli-quality-gate.json",
      commands: report.commands,
    });
    await savePipeline(dir, pipeline);
    ok({ step: "quality-gate", ...report });
  } catch (e) {
    const report = {
      kind: "ge.agents_cli.quality_gate",
      ok: false,
      startedAt,
      completedAt: new Date().toISOString(),
      prompt,
      error: e.message,
      commands: results.map((item) => ({ name: item.name, command: item.command, exitCode: item.exitCode, ok: item.ok })),
    };
    await writeJson(join(dir, "artifacts", "agents-cli-quality-gate.json"), report);
    markStep(pipeline, "qualityGate", "failed", { output: "artifacts/agents-cli-quality-gate.json", error: e.message });
    await savePipeline(dir, pipeline);
    fail(`Quality gate failed: ${e.message}`);
  }
}

// extractFirstJsonObject now lives in @ge/std/json-repair (imported above) so the
// harness parsers and any other consumer share one repair-tolerant extractor.

async function readWorkspaceReviewContext(dir) {
  const files = [
    "mock_systems/usecase-spec.json",
    "fixtures/manifest.json",
    "app/agent.py",
    "app/tools.py",
    "evals/golden.json",
    "tests/eval/eval_config.json",
    "tests/eval/evalsets/ge_behavior_contract.evalset.json",
    "artifacts/validation-report.json",
    "README.md",
  ];
  const parts = [];
  for (const rel of files) {
    const path = join(dir, rel);
    if (!existsSync(path)) continue;
    const text = await readFile(path, "utf8").catch(() => "");
    parts.push([
      `## ${rel}`,
      "```",
      text.slice(0, 24000),
      text.length > 24000 ? "\n[truncated]" : "",
      "```",
    ].join("\n"));
  }
  return parts.join("\n\n");
}

async function cmdHarnessReview(dir, flags) {
  const manifest = await readJson(manifestPath(dir), null);
  const spec = await readJson(join(dir, "mock_systems", "usecase-spec.json"), null);
  if (!manifest && !spec) fail("No generated workspace context found. Run 'factory from-usecase' or 'factory tools' first.");
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});

  const provider = flags.agent || flags.provider || "antigravity-sdk";
  const context = await readWorkspaceReviewContext(dir);
  const message = [
    "Review this generated GE ADK agent workspace for spec-to-code generation quality. Do not edit files.",
    "",
    "Source of truth: mock_systems/usecase-spec.json and fixtures/manifest.json.",
    "Your job is to audit whether the generated code and eval assets faithfully implement that spec, not whether the workspace merely imports.",
    "",
    "Required checks:",
    "- Every behaviorContract.toolIntent resolves to a canonical implemented Python tool; non-query intents are included in source_adapters.",
    "- app/agent.py renders the behavior contract into role, objective, scope, tool playbook, evidence requirements, escalation/refusal triggers, and hard guardrails.",
    "- app/tools.py uses source-system-specific names and returns evidence/audit fields promised by the contract.",
    "- Required inputs and produced IDs from toolIntents are represented in function signatures and results.",
    "- evals/golden.json and tests/eval/evalsets/ge_behavior_contract.evalset.json mirror goldenEvals and expected tool trajectories.",
    "- ADK runtime details are real: root_agent, generation config, output_key, callback wiring, and callback signatures compatible with ADK keyword invocation.",
    "- Validation artifacts either pass or explain a concrete generator/harness gap.",
    "",
    "Return only a single JSON object with this schema:",
    JSON.stringify({
      ok_to_promote: false,
      agent_quality_score: 0,
      spec_to_code_score: 0,
      spec_gaps: [],
      agent_logic_gaps: [],
      tool_gaps: [],
      mock_data_gaps: [],
      eval_gaps: [],
      adk_capability_gaps: [],
      recommended_generator_changes: [],
      recommended_pack_changes: [],
      required_follow_up_commands: [],
    }, null, 2),
    "",
    context,
  ].join("\n");

  const result = await runHarnessTask({
    repoRoot: REPO_ROOT,
    dataRoot: HARNESS_DATA_ROOT,
    workspaceDir: dir,
    agentId: provider,
    message,
    stages: ["review", "validate", "eval", "adk"],
    permissionProfile: flags["permission-profile"] || "review",
    model: flags.model || "default",
    vertex: wantsVertex(flags),
    project: flags.project || flags["gcp-project"] || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
    location: flags.location || flags.region || process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_GENAI_LOCATION || null,
    responseSchemaFile: harnessResponseSchemaFile("harness-review"),
    ...reviewFanoutOptions(),
    timeoutSec: Number(flags["timeout-sec"] || 300),
  });

  await writeText(join(dir, "artifacts", `${provider}-harness-review.raw.txt`), result.text || result.stdout || "");
  await writeJson(join(dir, "artifacts", `${provider}-harness-review.events.json`), {
    ok: result.ok,
    status: result.status,
    code: result.code,
    signal: result.signal,
    stderr: result.stderr,
    runtime: {
      adapterId: result.plan.adapterId,
      permissionProfile: result.plan.permissionProfile.id,
      requestedCapabilities: result.plan.requestedCapabilities,
      skills: result.plan.skills.map((skill) => ({
        id: skill.id,
        path: skill.relativePath,
        workspacePath: skill.workspaceRelativePath,
        capability: skill.capability,
      })),
    },
    events: result.events,
    diagnostics: result.summary?.diagnostics || [],
    runSummary: result.summary || null,
  });

  let review = null;
  let parseError = null;
  try {
    review = extractFirstJsonObject(result.text || result.stdout || "");
    validateHarnessOutput(harnessReviewSchema, review, "harness review");
    await writeJson(join(dir, "artifacts", `${provider}-harness-review.json`), review);
    await writeJson(join(dir, "artifacts", "harness-review.json"), {
      provider,
      ...review,
    });
    await applyHarnessReviewFeedback(dir, provider, review);
  } catch (error) {
    parseError = error.message;
  }
  const soft = truthyFlag(flags.soft);
  if (!result.ok || !review) {
    const reason = !result.ok
      ? `harness run failed: ${result.stderr || result.status}`
      : `did not return parseable JSON: ${parseError}`;
    if (soft) {
      const summary = { step: "harness-review", provider, skipped: true, degraded: true, reason };
      console.error(`⚠  ${provider} harness review degraded (deterministic code kept): ${reason}`);
      ok(summary);
      return summary;
    }
    fail(`${provider} harness review ${reason}`);
  }
  const pipeline = await loadPipeline(dir);
  markStep(pipeline, "harnessReview", "done", {
    provider,
    output: `artifacts/${provider}-harness-review.json`,
    okToPromote: review.ok_to_promote,
    score: review.agent_quality_score,
    specToCodeScore: review.spec_to_code_score,
  });
  await savePipeline(dir, pipeline);
  const summary = {
    step: "harness-review",
    provider,
    output: `artifacts/${provider}-harness-review.json`,
    okToPromote: review.ok_to_promote,
    score: review.agent_quality_score,
    specToCodeScore: review.spec_to_code_score,
  };
  ok(summary);
  return summary;
}

// Resolve the bundled response-schema asset for a harness stage. Returns null
// when structured output is disabled (GE_HARNESS_NO_RESPONSE_SCHEMA), so the
// harness falls back to its prompt-instructed JSON convention.
function harnessResponseSchemaFile(name) {
  const off = String(process.env.GE_HARNESS_NO_RESPONSE_SCHEMA || "").toLowerCase();
  if (off === "1" || off === "true" || off === "yes" || off === "on") return null;
  return new URL(`./schemas/${name}.schema.json`, import.meta.url).pathname;
}

function envOff(name) {
  return ["1", "true", "yes", "on"].includes(String(process.env[name] || "").toLowerCase());
}

// Subagent fan-out for the read-only review/validation stage: turn capabilities
// (and thus subagents) on while removing every write/exec builtin, so the
// validator can delegate independent checks to subagents but still cannot mutate
// the workspace. Disabled by the same opt-out as the refine fan-out.
function reviewFanoutOptions() {
  if (envOff("GE_HARNESS_NO_SUBAGENT_FANOUT")) return {};
  return {
    enableSubagents: true,
    disableTools: ["CREATE_FILE", "EDIT_FILE", "DELETE_FILE", "WRITE_FILE", "RUN_COMMAND"],
  };
}

// Resumable refine: a stable session id + save dir so a re-run of refine on the
// same work item resumes the persisted conversation instead of starting over.
function refineSessionId(dir, workItem) {
  const base = workItem.runId && workItem.itemId
    ? `${workItem.runId}-${workItem.itemId}`
    : `refine-${basename(dir)}`;
  return base.replace(/[^A-Za-z0-9._-]/g, "_");
}

async function refineResumeOptions(dir, workItem) {
  if (envOff("GE_HARNESS_NO_RESUME")) return {};
  const id = refineSessionId(dir, workItem);
  const saveDir = join(HARNESS_DATA_ROOT, "harness-sessions", id);
  await mkdir(saveDir, { recursive: true }).catch(() => {});
  return { conversationId: id, saveDir };
}

// Promotion gate enforcement. Refuse to deploy a workspace whose validation /
// spec-code trace / harness verdicts haven't passed, unless explicitly forced
// (--force or GE_ALLOW_UNPROMOTED). This is what makes the harness verdicts
// (ok_to_promote, spec_to_code_fidelity) actually gate the deploy instead of
// only being reported.
async function assertPromotable(dir, flags) {
  const gate = await readPromotionGate(dir);
  if (gate.ok) return gate;
  const override = truthyFlag(flags.force) || envOff("GE_ALLOW_UNPROMOTED");
  const lines = gate.blockers.map((b) => `  - ${b}`).join("\n");
  if (override) {
    console.error(`⚠ promotion gate has ${gate.blockers.length} blocker(s); overridden by --force / GE_ALLOW_UNPROMOTED:\n${lines}`);
    return gate;
  }
  fail(`Promotion gate blocked — refusing to deploy (${gate.blockers.length} blocker(s)):\n${lines}\nResolve the blockers, or re-run with --force (or GE_ALLOW_UNPROMOTED=1) to override.`);
}

async function cmdPromotionGate(dir, flags) {
  const gate = await readPromotionGate(dir);
  const base = { step: "promotion-gate", ok: gate.ok, specToCodeScore: gate.specToCodeScore, specToCodeFidelity: gate.specToCodeFidelity, blockers: gate.blockers };
  if (gate.ok) { ok(base); return gate; }
  if (truthyFlag(flags.force) || envOff("GE_ALLOW_UNPROMOTED")) {
    console.error(`⚠ promotion gate blocked but overridden (${gate.blockers.length} blocker(s))`);
    ok({ ...base, overridden: true });
    return gate;
  }
  fail(`Promotion gate blocked (${gate.blockers.length} blocker(s)):\n${gate.blockers.map((b) => `  - ${b}`).join("\n")}`);
}

async function applyHarnessReviewFeedback(dir, provider, review) {
  const feedback = {
    kind: "ge.harness_review.feedback",
    provider,
    generatedAt: GENERATED_AT,
    okToPromote: review.ok_to_promote === true,
    score: Number(review.agent_quality_score || 0),
    specToCodeScore: Number(review.spec_to_code_score || 0),
    specGaps: Array.isArray(review.spec_gaps) ? review.spec_gaps : [],
    agentLogicGaps: Array.isArray(review.agent_logic_gaps) ? review.agent_logic_gaps : [],
    toolGaps: Array.isArray(review.tool_gaps) ? review.tool_gaps : [],
    mockDataGaps: Array.isArray(review.mock_data_gaps) ? review.mock_data_gaps : [],
    evalGaps: Array.isArray(review.eval_gaps) ? review.eval_gaps : [],
    adkCapabilityGaps: Array.isArray(review.adk_capability_gaps) ? review.adk_capability_gaps : [],
    recommendedGeneratorChanges: Array.isArray(review.recommended_generator_changes) ? review.recommended_generator_changes : [],
    recommendedPackChanges: Array.isArray(review.recommended_pack_changes) ? review.recommended_pack_changes : [],
    requiredFollowUpCommands: Array.isArray(review.required_follow_up_commands) ? review.required_follow_up_commands : [],
  };
  await writeJson(join(dir, "artifacts", "generator-feedback.json"), feedback);
  const specPath = join(dir, "mock_systems", "usecase-spec.json");
  const spec = await readJson(specPath, null);
  if (spec) {
    spec.agentQualityPlan = {
      ...(spec.agentQualityPlan || {}),
      harnessFeedback: feedback,
    };
    await writeJson(specPath, spec);
  }
  return feedback;
}

async function cmdHarnessRefine(dir, flags) {
  const manifest = await readJson(manifestPath(dir), null);
  const spec = await readJson(join(dir, "mock_systems", "usecase-spec.json"), null);
  if (!manifest && !spec) fail("No generated workspace context found. Run 'factory from-usecase' or 'factory tools' first.");
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});

  const provider = flags.agent || flags.provider || "antigravity-sdk";
  const workItem = buildHarnessWorkItem({
    runId: flags["run-id"] || process.env.GE_AGENT_FACTORY_RUN_ID || null,
    itemId: flags["item-id"] || process.env.GE_AGENT_FACTORY_ITEM_ID || null,
    workspaceDir: dir,
    stage: "harness_refine",
    adapter: provider,
    locality: flags.locality || process.env.GE_HARNESS_LOCALITY || (process.env.K_SERVICE ? "remote" : "local"),
    project: flags.project || flags["gcp-project"] || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
    location: flags.location || flags.region || process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_GENAI_LOCATION || null,
    targetGate: flags["target-gate"] || "validate",
    permissionProfile: flags["permission-profile"] || "workspace_write",
    model: flags.model || "default",
    soft: truthyFlag(flags.soft),
  });
  await writeHarnessWorkItem(dir, workItem);
  const reviewPath = join(dir, "artifacts", `${provider}-harness-review.json`);
  const feedbackPath = join(dir, "artifacts", "generator-feedback.json");
  const review = await readJson(reviewPath, null);
  const feedback = await readJson(feedbackPath, null);
  const context = await readWorkspaceReviewContext(dir);
  const message = await buildHarnessRefinePrompt({ workItem, workspaceContext: context, review, feedback });
  const resumeOpts = await refineResumeOptions(dir, workItem);

  const result = await runHarnessTask({
    repoRoot: REPO_ROOT,
    dataRoot: HARNESS_DATA_ROOT,
    workspaceDir: dir,
    agentId: provider,
    message,
    stages: ["implementation", "repair", "validate", "eval", "adk"],
    permissionProfile: workItem.permissionProfile,
    model: workItem.model,
    vertex: wantsVertex(flags),
    project: flags.project || flags["gcp-project"] || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
    location: flags.location || flags.region || process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_GENAI_LOCATION || null,
    responseSchemaFile: harnessResponseSchemaFile("harness-refine"),
    protectFiles: ["tools.py"],
    // Refine fixes generated code in place; it never deletes workspace files or
    // generates images. Remove those builtins from the model's context entirely.
    disableTools: ["DELETE_FILE", "GENERATE_IMAGE"],
    // Resumable session: re-running refine on the same work item resumes rather
    // than starting from scratch.
    ...resumeOpts,
    timeoutSec: Number(flags["timeout-sec"] || 600),
  });

  await writeText(join(dir, "artifacts", `${provider}-harness-refine.raw.txt`), result.text || result.stdout || "");
  await writeJson(join(dir, "artifacts", `${provider}-harness-refine.events.json`), {
    workItem,
    ok: result.ok,
    status: result.status,
    code: result.code,
    signal: result.signal,
    stderr: result.stderr,
    runtime: {
      adapterId: result.plan.adapterId,
      permissionProfile: result.plan.permissionProfile.id,
      requestedCapabilities: result.plan.requestedCapabilities,
      skills: result.plan.skills.map((skill) => ({
        id: skill.id,
        path: skill.relativePath,
        workspacePath: skill.workspaceRelativePath,
        capability: skill.capability,
      })),
    },
    events: result.events,
    diagnostics: result.summary?.diagnostics || [],
    runSummary: result.summary || null,
  });
  if (!result.ok) {
    const reason = `harness run failed: ${result.stderr || result.status}`;
    if (truthyFlag(flags.soft)) {
      const summary = { step: "harness-refine", provider, skipped: true, degraded: true, reason };
      console.error(`⚠  ${provider} harness refine degraded (deterministic code kept): ${reason}`);
      ok(summary);
      return summary;
    }
    fail(`${provider} harness refine ${reason}`);
  }

  let refine = null;
  try {
    refine = extractFirstJsonObject(result.text || result.stdout || "");
  } catch {
    refine = {
      changed_files: [],
      summary: String(result.text || result.stdout || "").slice(0, 4000),
      verification_commands: [],
      remaining_gaps: ["Harness did not return parseable JSON completion packet."],
    };
  }
  validateHarnessOutput(harnessRefineSchema, refine, "harness refine");
  await writeJson(join(dir, "artifacts", `${provider}-harness-refine.json`), refine);
  await writeJson(join(dir, "artifacts", "harness-refine.json"), {
    provider,
    workItem,
    ...refine,
  });
  await writeJson(join(dir, "artifacts", "harness-run-summary.json"), await buildHarnessRunSummary({
    workItem,
    result,
    provider,
    output: `artifacts/${provider}-harness-refine.json`,
    changedFiles: refine.changed_files || [],
  }));
  const pipeline = await loadPipeline(dir);
  markStep(pipeline, "harnessRefine", "done", {
    provider,
    output: `artifacts/${provider}-harness-refine.json`,
    changedFiles: refine.changed_files || [],
  });
  await savePipeline(dir, pipeline);
  const summary = {
    step: "harness-refine",
    provider,
    output: `artifacts/${provider}-harness-refine.json`,
    changedFiles: refine.changed_files || [],
  };
  ok(summary);
  return summary;
}

async function cmdServe(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "tools");
  const port = flags.port || "8080";

  console.error(`Starting: uv run adk web --port ${port} .`);
  markStep(pipeline, "serve", "running", { port });
  await savePipeline(dir, pipeline);

  try {
    await runCommand("uv", ["run", "adk", "web", "--host", "127.0.0.1", "--port", port, "."], { cwd: dir, stream: true, timeout: 600000 });
  } catch (e) {
    if (!e.message.includes("timeout")) {
      markStep(pipeline, "serve", "stopped", { error: e.message });
      await savePipeline(dir, pipeline);
    }
  }
}

// ── Cloud data packaging ─────────────────────────────────────

// Field names that conceptually carry decimals even if a small sample happens
// to be whole numbers (e.g. an `amount` whose first few rows are round). Used
// only as a backstop — value-based inference below is the primary signal.
const DECIMAL_NAME_HINT = /(amount|amt|rate|pct|percent|ratio|price|cost|value|metric|balance|total|avg|average|score|variance|tax|fee|spend|revenue|margin)/i;

function isIntegerValue(v) {
  return typeof v === "number" && Number.isFinite(v) && Number.isInteger(v);
}

// Decide a BigQuery numeric type for a "number"/"float" column. Sampling the
// actual generated values is the real fix for the "first row was whole" trap:
// a field is INT64 only when EVERY sampled value is an integer; any decimal
// (or a decimal-ish field name) forces FLOAT64 so `bq load` accepts the data.
function bigQueryNumericType(col, sampledValues = []) {
  const type = String(col?.type || "").toLowerCase();
  if (type === "float") return "FLOAT64";
  const name = String(col?.name || "");
  const numbers = sampledValues.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (numbers.some((v) => !Number.isInteger(v))) return "FLOAT64";
  // Backstop: decimal-ish names go FLOAT64 unless the sample proves integer-only
  // AND there is enough of a sample to trust it.
  if (DECIMAL_NAME_HINT.test(name) && numbers.length === 0) return "FLOAT64";
  if (DECIMAL_NAME_HINT.test(name) && numbers.length > 0 && numbers.every(isIntegerValue)) {
    // Name says decimal but every sampled value is whole — trust the data only
    // when the sample is meaningful; otherwise stay FLOAT64 to be safe.
    return numbers.length >= 8 ? "INT64" : "FLOAT64";
  }
  return "INT64";
}

function bigQueryType(col, sampledValues = []) {
  const type = String(col?.type || "string").toLowerCase();
  if (type === "number" || type === "float") return bigQueryNumericType(col, sampledValues);
  if (type === "boolean") return "BOOL";
  if (type === "date") return "DATE";
  // Schema may not declare a numeric type (e.g. columns rebuilt from generated
  // rows collapse to "number"); fall back to the sampled values to catch decimals.
  if (sampledValues.some((v) => typeof v === "number" && Number.isFinite(v))) {
    return bigQueryNumericType(col, sampledValues);
  }
  return "STRING";
}

function bigQuerySafeName(name) {
  return snakeCase(name || "table").replace(/^([^a-zA-Z_])/, "_$1").slice(0, 1024);
}

function rowsToNdjson(rows) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
}

async function buildCloudDataArtifacts(dir, flags = {}) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "generate");
  const manifest = await readJson(manifestPath(dir), null);
  if (!manifest) fail("No fixture manifest. Run 'factory generate' first.");

  const project = flags.project || "<gcp-project>";
  const location = flags.location || flags.region || "US";
  const scenario = bigQuerySafeName(manifest.id || pipeline.name || basename(dir));
  const dataset = bigQuerySafeName(flags.dataset || `ge_mock_${scenario}`);
  const bucket = flags.bucket || `${project}-factory-${scenario}`.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  const prefix = (flags.prefix || `factory/${scenario}`).replace(/^\/+|\/+$/g, "");
  const outDir = cloudDataDir(dir);

  await mkdir(join(outDir, "bigquery", "schemas"), { recursive: true });
  await mkdir(join(outDir, "bigquery", "ndjson"), { recursive: true });
  await mkdir(join(outDir, "storage"), { recursive: true });

  const tables = [];
  for (const table of manifest.tables || []) {
    const tableId = bigQuerySafeName(table.name);
    const sourcePath = table.jsonPath || table.path;
    const rows = await readJson(join(fixturesDir(dir), sourcePath), null);
    if (!Array.isArray(rows)) fail(`Cloud data packaging requires JSON fixture rows for ${table.name}`);
    const schema = (table.columns || []).map((col) => {
      // Sample the actual generated values for this column so decimal-bearing
      // fields are typed FLOAT64 even when the schema collapsed them to "number".
      const sampledValues = rows.map((r) => r?.[col.name]).filter((v) => v != null);
      return {
        name: bigQuerySafeName(col.name),
        type: bigQueryType(col, sampledValues),
        mode: "NULLABLE",
        description: `Generated mock field from ${manifest.id || "scenario"} fixture ${table.name}.${col.name}`,
      };
    });
    const schemaPathRel = `mock_data/cloud/bigquery/schemas/${tableId}.schema.json`;
    const ndjsonPathRel = `mock_data/cloud/bigquery/ndjson/${tableId}.jsonl`;
    await writeJson(join(dir, schemaPathRel), schema);
    await writeText(join(dir, ndjsonPathRel), rowsToNdjson(rows));
    tables.push({
      name: table.name,
      tableId,
      rowCount: rows.length,
      primaryKey: table.primaryKey || "id",
      schemaPath: schemaPathRel,
      ndjsonPath: ndjsonPathRel,
      gcsUri: `gs://${bucket}/${prefix}/tables/${tableId}.jsonl`,
      bigQueryTable: `${project}.${dataset}.${tableId}`,
      loadCommand: `bq load --location=${location} --replace --source_format=NEWLINE_DELIMITED_JSON ${project}:${dataset}.${tableId} gs://${bucket}/${prefix}/tables/${tableId}.jsonl ${schemaPathRel}`,
    });
  }

  const documentRows = (manifest.documents || []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type || "document",
    source_path: doc.path,
    gcs_uri: `gs://${bucket}/${prefix}/${doc.path}`,
    word_count: doc.wordCount || null,
    linked_entities: Array.isArray(doc.linkedEntities) ? doc.linkedEntities.join(",") : "",
  }));
  const documentManifestSchema = [
    { name: "id", type: "STRING", mode: "REQUIRED" },
    { name: "title", type: "STRING", mode: "NULLABLE" },
    { name: "type", type: "STRING", mode: "NULLABLE" },
    { name: "source_path", type: "STRING", mode: "NULLABLE" },
    { name: "gcs_uri", type: "STRING", mode: "NULLABLE" },
    { name: "word_count", type: "INT64", mode: "NULLABLE" },
    { name: "linked_entities", type: "STRING", mode: "NULLABLE" },
  ];
  await writeJson(join(outDir, "bigquery", "schemas", "documents_manifest.schema.json"), documentManifestSchema);
  await writeText(join(outDir, "bigquery", "ndjson", "documents_manifest.jsonl"), rowsToNdjson(documentRows));

  const commands = [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    `PROJECT="${"${GOOGLE_CLOUD_PROJECT:-"}${project}${"}"}"`,
    `LOCATION="${"${GOOGLE_CLOUD_LOCATION:-"}${location}${"}"}"`,
    `DATASET="${"${BQ_DATASET:-"}${dataset}${"}"}"`,
    `BUCKET="${"${GCS_BUCKET:-"}${bucket}${"}"}"`,
    `PREFIX="${"${GCS_PREFIX:-"}${prefix}${"}"}"`,
    "",
    "if [ \"${GE_SKIP_SERVICE_ENABLE:-0}\" != \"1\" ]; then",
    "  gcloud services enable storage.googleapis.com bigquery.googleapis.com --project \"${PROJECT}\"",
    "else",
    "  echo \"Skipping API enablement; factory provision owns required APIs.\"",
    "fi",
    "if [ \"${GE_SKIP_BUCKET_CREATE:-0}\" = \"1\" ]; then",
    "  echo \"Skipping bucket creation/check; factory provision owns gs://${BUCKET}.\"",
    "elif ! gcloud storage buckets describe \"gs://${BUCKET}\" >/dev/null 2>&1; then",
    "  gcloud storage buckets create \"gs://${BUCKET}\" --project \"${PROJECT}\" --location \"${LOCATION}\"",
    "fi",
    `bq --location="\${LOCATION}" mk --dataset --description ${JSON.stringify(`GE mock data for ${scenario}`)} "\${PROJECT}:\${DATASET}" >/dev/null 2>&1 || true`,
    "",
    "gcloud storage cp mock_data/cloud/bigquery/ndjson/*.jsonl \"gs://${BUCKET}/${PREFIX}/tables/\"",
    "if [ -d fixtures/documents ]; then gcloud storage cp --recursive fixtures/documents \"gs://${BUCKET}/${PREFIX}/documents\"; fi",
    "",
    "# Publish this agent's MCP tool manifest to the shared agent-data bucket so the",
    "# per-department MCP service can resolve it at runtime via ?agent=<id>. The worker",
    "# sets GE_AGENT_DATA_BUCKET + GE_AGENT_ID; skipped (degrades) when unset (local runs).",
    "if [ -n \"${GE_AGENT_DATA_BUCKET:-}\" ] && [ -n \"${GE_AGENT_ID:-}\" ] && [ -f mock_data/cloud/mcp-tools.json ]; then",
    "  gcloud storage cp mock_data/cloud/mcp-tools.json \"gs://${GE_AGENT_DATA_BUCKET}/agents/${GE_AGENT_ID}/mcp-tools.json\"",
    "  echo \"Published MCP tool manifest → gs://${GE_AGENT_DATA_BUCKET}/agents/${GE_AGENT_ID}/mcp-tools.json\"",
    "else",
    "  echo \"Skipping MCP tool manifest publish (needs GE_AGENT_DATA_BUCKET + GE_AGENT_ID + mock_data/cloud/mcp-tools.json)\"",
    "fi",
    "",
    ...tables.map((table) => `bq load --location="\${LOCATION}" --replace --source_format=NEWLINE_DELIMITED_JSON "\${PROJECT}:\${DATASET}.${table.tableId}" "gs://\${BUCKET}/\${PREFIX}/tables/${table.tableId}.jsonl" "${table.schemaPath}"`),
    `bq load --location="\${LOCATION}" --replace --source_format=NEWLINE_DELIMITED_JSON "\${PROJECT}:\${DATASET}.documents_manifest" "gs://\${BUCKET}/\${PREFIX}/tables/documents_manifest.jsonl" "mock_data/cloud/bigquery/schemas/documents_manifest.schema.json"`,
    "",
    `echo "Loaded GE mock data to BigQuery dataset \${PROJECT}:\${DATASET} and Cloud Storage gs://\${BUCKET}/\${PREFIX}"`,
    "",
  ];
  const scriptPath = join(outDir, "load-to-google-cloud.sh");
  await writeText(scriptPath, commands.join("\n"));

  const plan = {
    id: `${scenario}-cloud-data`,
    generatedAt: GENERATED_AT,
    mode: "mock_data_cloud_plan",
    target: {
      structured: "BigQuery native tables",
      unstructured: "Cloud Storage objects plus BigQuery documents_manifest table",
      reason: "BigQuery is the right deploy target for deterministic relational mock tables; Cloud Storage keeps source documents inspectable and portable.",
    },
    googleCloud: {
      project,
      location,
      dataset,
      bucket,
      prefix,
      requiredApis: ["storage.googleapis.com", "bigquery.googleapis.com"],
    },
    artifacts: {
      directory: "mock_data/cloud",
      loadScript: "mock_data/cloud/load-to-google-cloud.sh",
      deployPlan: "artifacts/deploy-plan.json",
      mcpToolManifest: "mock_data/cloud/mcp-tools.json",
    },
    tables,
    documents: {
      count: documentRows.length,
      manifestTable: `${project}.${dataset}.documents_manifest`,
      manifestNdjsonPath: "mock_data/cloud/bigquery/ndjson/documents_manifest.jsonl",
      manifestSchemaPath: "mock_data/cloud/bigquery/schemas/documents_manifest.schema.json",
      storageUriPrefix: `gs://${bucket}/${prefix}/documents/`,
    },
    validation: {
      deterministicSeed: manifest.seed,
      totalRows: manifest.totalRows,
      sourceManifest: "fixtures/manifest.json",
    },
  };

  await writeJson(join(outDir, "cloud-data-manifest.json"), plan);

  // Per-agent MCP tool manifest in the shape mcp-service/server.py expects
  // ({ tools: [{name,description,inputSchema}] }). load_data uploads this to
  // gs://<dataBucket>/agents/<id>/mcp-tools.json so the dept MCP service can
  // serve this agent's tools at runtime (resolved via ?agent=<id>).
  await writeJson(join(outDir, "mcp-tools.json"), {
    id: `${scenario}_mcp_tools`,
    generatedAt: plan.generatedAt,
    agentId: manifest.id || scenario,
    simulatorRegistry: {
      path: "apps/factory/simulator-systems/registry.json",
      version: loadSimulatorRegistry().version,
    },
    tools: mcpToolDescriptors(manifest),
  });
  await writeJson(deployPlanPath(dir), {
    ...plan,
    nextCommands: [
      `bash mock_data/cloud/load-to-google-cloud.sh`,
      `factory deploy --dir ${dir} --project ${project} --region ${flags.region || "us-central1"} --target agent_runtime`,
    ],
  });

  manifest.cloud = {
    status: "plan_ready",
    target: "bigquery_and_cloud_storage",
    dataset,
    bucket,
    prefix,
    manifestPath: "mock_data/cloud/cloud-data-manifest.json",
    loadScript: "mock_data/cloud/load-to-google-cloud.sh",
  };
  await writeJson(manifestPath(dir), manifest);

  pipeline.steps.cloudDataPlan = {
    status: "done",
    completedAt: plan.generatedAt,
    target: "bigquery_and_cloud_storage",
    dataset,
    bucket,
    prefix,
  };
  await savePipeline(dir, pipeline);
  return plan;
}

async function cmdDataPlan(dir, flags) {
  const plan = await buildCloudDataArtifacts(dir, flags);
  const integrationPlan = await buildSourceIntegrationPlan(dir, flags, { cloudPlan: plan });
  ok({
    step: "data-plan",
    target: plan.target,
    googleCloud: plan.googleCloud,
    tables: plan.tables.map((table) => ({ table: table.bigQueryTable, rows: table.rowCount, schema: table.schemaPath })),
    documents: plan.documents,
    loadScript: plan.artifacts.loadScript,
    deployPlan: plan.artifacts.deployPlan,
    sourceIntegrationPlan: integrationPlan.artifacts.plan,
  });
}

async function cmdSourceIntegrationPlan(dir, flags) {
  const plan = await buildSourceIntegrationPlan(dir, flags);
  ok({
    step: "source-integration-plan",
    output: plan.artifacts.plan,
    toolRegistryPlan: plan.artifacts.toolRegistryPlan,
    sources: plan.sources.length,
    requiredApis: plan.googleCloud.requiredApis,
    firstPartyMcpServices: plan.registries.toolRegistry.firstPartyMcpServices.map((service) => service.id),
    customMcpServers: plan.registries.toolRegistry.customMcpServers.length,
  });
}

function snowfakeryFakeForColumn(col) {
  const name = String(col.name || "").toLowerCase();
  const type = String(col.type || "string").toLowerCase();
  if (type === "ref") return { reference: col.ref ? bigQuerySafeName(col.ref.split(".")[0]) : "Unknown" };
  if (type === "number") return { random_number: { min: col.min ?? 0, max: col.max ?? 1000 } };
  if (type === "float") return { random_number: { min: col.min ?? 0, max: col.max ?? 1000 } };
  if (type === "boolean") return "${{random_choice(true, false)}}";
  if (type === "date") return { date_between: { start_date: col.min || "2024-01-01", end_date: col.max || "2026-12-31" } };
  if (type === "enum") return `\${{random_choice(${(col.values || ["A", "B", "C"]).map((v) => JSON.stringify(v)).join(", ")} )}}`;
  if (type.startsWith("person.") || name.includes("name")) return { fake: "Name" };
  if (type.startsWith("internet.email") || name.includes("email")) return { fake: "Email" };
  if (name.includes("company") || name.includes("vendor") || name.includes("supplier") || type.startsWith("company.")) return { fake: "Company" };
  if (name.includes("city")) return { fake: "City" };
  if (name.includes("state")) return { fake: "State" };
  if (name.includes("address")) return { fake: "StreetAddress" };
  if (name.includes("phone")) return { fake: "PhoneNumber" };
  if (name.includes("description") || name.includes("notes") || name.includes("body") || type.includes("paragraph")) return { fake: "Paragraph" };
  if (name.includes("title") || type.includes("sentence")) return { fake: "Sentence" };
  if (type === "seq") return `\${{unique_id}}`;
  return { fake: "Word" };
}

function renderYamlValue(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (typeof value === "string") return `${pad}${JSON.stringify(value)}`;
  if (typeof value === "number" || typeof value === "boolean") return `${pad}${value}`;
  if (!value || typeof value !== "object") return `${pad}null`;
  const lines = [];
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object" && !Array.isArray(child)) {
      lines.push(`${pad}${key}:`);
      lines.push(renderYamlValue(child, indent + 2));
    } else {
      lines.push(`${pad}${key}: ${JSON.stringify(child)}`);
    }
  }
  return lines.join("\n");
}

async function cmdSnowfakeryRecipe(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "schema");
  const schema = await readJson(schemaPath(dir), null);
  if (!schema?.tables?.length) fail("No schema tables found. Run 'factory schema' first.");
  const scenario = snakeCase(pipeline.name || basename(dir));
  const outDir = join(dir, "mock_data", "snowfakery");
  const recipePath = join(outDir, `${scenario}.recipe.yml`);
  const lines = [
    "# Generated Snowfakery recipe for structured mock rows.",
    "# Snowfakery is the GE YAML control plane for OLTP and OLAP rows; datastore packagers own cloud load semantics.",
    "- snowfakery_version: 3",
  ];
  for (const table of schema.tables) {
    lines.push(`- object: ${bigQuerySafeName(table.name)}`);
    lines.push(`  count: ${Number(table.rows || flags.rows || 10)}`);
    lines.push("  fields:");
    for (const col of table.columns || []) {
      const value = snowfakeryFakeForColumn(col);
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        lines.push(`    ${bigQuerySafeName(col.name)}: ${renderYamlValue(value).trim()}`);
      } else {
        lines.push(`    ${bigQuerySafeName(col.name)}:`);
        lines.push(renderYamlValue(value, 6));
      }
    }
  }
  await writeText(recipePath, lines.join("\n") + "\n");
  const manifest = {
    generatedAt: GENERATED_AT,
    backend: "snowfakery",
    status: "recipe_only",
    recipePath: relative(dir, recipePath),
    reason: "Structured row recipe for OLTP, OLTP NoSQL, and OLAP synthetic data generation.",
    runCommand: `snowfakery ${relative(dir, recipePath)} --output-format csv --output-folder mock_data/snowfakery/output`,
    note: "factory writes the recipe and packager plan. Install/run Snowfakery only when materializing rows through the external Snowfakery engine.",
  };
  await writeJson(join(outDir, "manifest.json"), manifest);
  pipeline.steps.snowfakeryRecipe = { status: "done", completedAt: manifest.generatedAt, recipePath: manifest.recipePath };
  await savePipeline(dir, pipeline);
  ok({ step: "snowfakery-recipe", ...manifest });
}

// ── gcloud helpers ───────────────────────────────────────────

async function getGcloudProject(flags) {
  const p = flags.project || process.env.GOOGLE_CLOUD_PROJECT;
  if (p) return p;
  try {
    const r = await runCommand("gcloud", ["config", "get-value", "project"], { timeout: 10000 });
    const val = r.stdout.trim();
    if (val && val !== "(unset)") return val;
  } catch {}
  return null;
}

async function getGcloudProjectNumber(project) {
  if (process.env.GOOGLE_CLOUD_PROJECT_NUMBER) return process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
  if (!project || project.includes("<")) return null;
  try {
    const r = await runCommand("gcloud", ["projects", "describe", project, "--format=value(projectNumber)"], { timeout: 15000, allowFail: true });
    return r.stdout.trim() || null;
  } catch {
    return null;
  }
}

async function getGcloudRegion(flags) {
  return flags.region || process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
}

function parseAgentRuntimeId(meta, fallback = null) {
  const candidates = [
    meta?.remote_agent_runtime_id,
    meta?.agent_runtime_id,
    meta?.resource_name,
    meta?.reasoning_engine,
    fallback,
    process.env.AGENT_RUNTIME_ID,
  ].filter(Boolean).map(String);
  const valid = candidates.find((value) => value && value !== "None" && value.includes("/reasoningEngines/"));
  return valid || candidates.find((value) => value && value !== "None") || null;
}

function agentRuntimeRunUrl(runtimeId) {
  const text = String(runtimeId || "");
  const parts = text.split("/");
  const project = parts[parts.indexOf("projects") + 1];
  const location = parts[parts.indexOf("locations") + 1];
  const engine = parts[parts.indexOf("reasoningEngines") + 1];
  if (!project || !location || !engine) return null;
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/reasoningEngines/${engine}`;
}

async function hydrateDeployStepFromMetadata(dir, pipeline, flags = {}) {
  if (pipeline.steps?.deploy?.status === "done") return pipeline.steps.deploy;
  const metaPath = join(dir, "deployment_metadata.json");
  const meta = await readJson(metaPath, null);
  const runtimeId = parseAgentRuntimeId(meta, pipeline.steps?.deploy?.runtimeId);
  if (!runtimeId) return pipeline.steps?.deploy || null;

  const project = flags.project || process.env.GOOGLE_CLOUD_PROJECT || runtimeId.match(/^projects\/([^/]+)/)?.[1] || null;
  const region = flags.region || flags.location || process.env.GOOGLE_CLOUD_LOCATION || runtimeId.match(/\/locations\/([^/]+)/)?.[1] || null;
  markStep(pipeline, "deploy", "done", {
    ...(pipeline.steps?.deploy || {}),
    project,
    region,
    target: meta?.deployment_target || pipeline.steps?.deploy?.target || "agent_runtime",
    runtimeId,
    isA2a: meta?.is_a2a || false,
    deploymentMetadata: metaPath,
    hydratedFromMetadata: true,
  });
  await savePipeline(dir, pipeline);
  return pipeline.steps.deploy;
}

function parseOperationId(output) {
  const text = String(output || "");
  return text.match(/projects\/[^ \n]+\/locations\/[^ \n]+\/[^ \n]*operations\/[A-Za-z0-9_-]+/)?.[0]
    || text.match(/Operation:\s*([^\s]+)/)?.[1]
    || text.match(/operation(?: name)?:\s*([^\s]+)/i)?.[1]
    || null;
}

function safeAgentsCliProjectName(value) {
  const normalized = String(value || "ge-agent")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const prefixed = /^[a-z]/.test(normalized) ? normalized : `ge-${normalized}`;
  return (prefixed || "ge-agent").slice(0, 26).replace(/-+$/g, "") || "ge-agent";
}

function normalizeGeminiEnterpriseAppResource(value, project, location = "global") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.startsWith("projects/") && raw.includes("/engines/")) return raw;
  if (raw.includes("/engines/")) {
    const idx = raw.indexOf("projects/");
    return idx >= 0 ? raw.slice(idx) : raw;
  }
  if (project && /^[a-z][a-z0-9_-]*$/i.test(raw) && !/\s/.test(raw)) {
    return `projects/${project}/locations/${location}/collections/default_collection/engines/${raw}`;
  }
  return raw;
}

function parseGeminiEnterpriseApps(text) {
  const apps = [];
  for (const line of String(text || "").split("\n")) {
    const resource = line.match(/projects\/[^ \t│]+\/locations\/[^ \t│]+\/collections\/[^ \t│]+\/engines\/[^ \t│]+/)?.[0];
    if (!resource) continue;
    const cells = line.split("│").map((cell) => cell.trim()).filter(Boolean);
    const displayName = cells.find((cell) => !cell.startsWith("projects/") && !["Display Name", "Location", "Resource"].includes(cell)) || null;
    const id = resource.match(/\/engines\/([^/]+)$/)?.[1] || null;
    apps.push({ displayName, id, resource });
  }
  return apps;
}

async function resolveGeminiEnterpriseAppId(rawAppId, { project, projectNumber, location }) {
  const raw = String(rawAppId || "").trim();
  if (!raw) return { appId: null, matched: null };
  if (raw.startsWith("projects/") && raw.includes("/engines/")) return { appId: raw, matched: "full_resource" };

  try {
    const listArgs = ["publish", "gemini-enterprise", "--list"];
    if (projectNumber) listArgs.push("--project-number", projectNumber);
    const listed = await runCommand("agents-cli", listArgs, { timeout: 30000, allowFail: true, env: { COLUMNS: "240" } });
    const apps = parseGeminiEnterpriseApps(`${listed.stdout}\n${listed.stderr}`);
    const exact = apps.find((app) => app.id === raw || app.displayName === raw || app.resource === raw);
    if (exact?.resource) return { appId: exact.resource, matched: exact.displayName === raw ? "display_name" : "engine_id", apps };
  } catch {}

  if (project) {
    try {
      const discovered = await runCommand("gcloud", [
        "discovery-engine", "engines", "list",
        `--project=${project}`,
        `--location=${location || "global"}`,
        "--collection=default_collection",
        "--format=json(name,displayName)",
      ], { timeout: 30000, allowFail: true });
      const parsed = discovered.stdout.trim() ? JSON.parse(discovered.stdout) : [];
      const match = parsed.find((app) => app.name === raw || app.displayName === raw || app.name?.endsWith(`/engines/${raw}`));
      if (match?.name) return { appId: match.name, matched: match.displayName === raw ? "display_name" : "engine_id", apps: parsed };
    } catch {}
  }

  return { appId: normalizeGeminiEnterpriseAppResource(raw, project, location), matched: "constructed_or_raw" };
}

// ── MCP Server Management ────────────────────────────────────

async function cmdMcp(dir, flags) {
  const pipeline = await loadPipeline(dir);
  const action = flags.action || flags._sub || "list";

  if (action === "plan") {
    return cmdSourceIntegrationPlan(dir, flags);
  }

  const project = await getGcloudProject(flags);
  if (!project) fail("--project required (or set GOOGLE_CLOUD_PROJECT / gcloud config)");

  if (action === "list" || action === "ls") {
    console.error(`Listing managed MCP servers for project ${project}...`);
    const results = [];
    for (const svc of MANAGED_MCP_SERVICES) {
      try {
        const r = await runCommand("gcloud", ["services", "list", "--enabled", "--filter", `name:${svc.api}`, "--project", project, "--format=value(name)"], { timeout: 15000 });
        results.push({ ...svc, enabled: r.stdout.trim().includes(svc.api) });
      } catch {
        results.push({ ...svc, enabled: false, error: "check failed" });
      }
    }
    try {
      console.error("Checking Agent Registry services...");
      const r = await runCommand("gcloud", ["alpha", "agent-registry", "services", "list", "--project", project, "--location", await getGcloudRegion(flags), "--format=json"], { timeout: 15000, allowFail: true });
      const registryServices = r.stdout.trim() ? JSON.parse(r.stdout) : [];
      ok({ step: "mcp", action: "list", project, managedServices: results, registryServices });
    } catch {
      ok({ step: "mcp", action: "list", project, managedServices: results, registryServices: [] });
    }
    return;
  }

  if (action === "enable") {
    const serviceId = flags.service;
    if (!serviceId) fail("--service required (e.g., bigquery, maps, spanner)");
    const svc = MANAGED_MCP_SERVICES.find((s) => s.id === serviceId);
    if (!svc) fail(`Unknown service: ${serviceId}. Available: ${MANAGED_MCP_SERVICES.map((s) => s.id).join(", ")}`);

    console.error(`Enabling ${svc.api} in project ${project}; Agent Registry auto-discovers supported first-party MCP tools for enabled Google Cloud APIs...`);
    try {
      await runCommand("gcloud", ["services", "enable", svc.api, `--project=${project}`], { stream: true, timeout: 60000 });
      markStep(pipeline, "register", "done", { mode: "mcp", service: svc.id, project });
      await savePipeline(dir, pipeline);
      ok({
        step: "mcp",
        action: "enable",
        service: svc.id,
        api: svc.api,
        project,
        registryBehavior: "First-party Google MCP servers are automatically registered in Agent Registry when the supported API is enabled.",
        adkUsage: `from google.adk.tools import ApiRegistry\ntools = ApiRegistry.get_toolset("${svc.api}")`,
      });
    } catch (e) {
      fail(`Failed to enable ${svc.api}: ${e.message}`);
    }
    return;
  }

  if (action === "disable") {
    const serviceId = flags.service;
    if (!serviceId) fail("--service required");
    const svc = MANAGED_MCP_SERVICES.find((s) => s.id === serviceId);
    if (!svc) fail(`Unknown service: ${serviceId}`);
    console.error(`Disabling MCP for ${svc.api}...`);
    try {
      await runCommand("gcloud", ["beta", "services", "mcp", "disable", svc.api, `--project=${project}`], { stream: true, timeout: 60000 });
      ok({ step: "mcp", action: "disable", service: svc.id });
    } catch (e) {
      fail(`Failed to disable: ${e.message}`);
    }
    return;
  }

  fail(`Unknown mcp action: ${action}. Use: plan, list, enable, disable`);
}

// ── Deploy (Agent Runtime or Cloud Run) ──────────────────────

async function cmdDeploy(dir, flags) {
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "tools");
  await assertPromotable(dir, flags);
  const project = await getGcloudProject(flags);
  const region = await getGcloudRegion(flags);
  if (!project) fail("--project required (or set GOOGLE_CLOUD_PROJECT)");
  const target = flags.target || "agent_runtime";

  console.error(`Enhancing scaffold for ${target} deployment...`);
  try {
    const projectName = safeAgentsCliProjectName(pipeline.name || basename(dir));
    await runCommand("agents-cli", ["scaffold", "enhance", ".", "--name", projectName, "--deployment-target", target, "--agent-directory", "app", "--yes"], { cwd: dir, stream: true, timeout: 60000 });
    await runCommand("uv", ["lock"], { cwd: dir, stream: true, timeout: 120000 });
  } catch (e) {
    console.error(`Scaffold enhance: ${e.message}`);
  }

  if (target === "cloud_run") {
    console.error(`Deploying to Cloud Run in ${project} / ${region}...`);
    try {
      const serviceName = snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
      await runCommand("gcloud", [
        "run", "deploy", serviceName,
        "--source", ".",
        "--project", project,
        "--region", region,
        "--allow-unauthenticated",
        "--set-env-vars", `GOOGLE_CLOUD_PROJECT=${project}`,
      ], { cwd: dir, stream: true, timeout: 300000 });

      const urlResult = await runCommand("gcloud", [
        "run", "services", "describe", serviceName,
        "--project", project, "--region", region,
        "--format=value(status.url)",
      ], { timeout: 15000 });
      const serviceUrl = urlResult.stdout.trim();

      markStep(pipeline, "deploy", "done", { project, region, target, serviceName, serviceUrl });
      await savePipeline(dir, pipeline);
      ok({ step: "deploy", target, project, region, serviceName, serviceUrl });
    } catch (e) {
      markStep(pipeline, "deploy", "failed", { error: e.message });
      await savePipeline(dir, pipeline);
      fail(`Cloud Run deploy failed: ${e.message}`);
    }
    return;
  }

  console.error(`Deploying to Agent Runtime in ${project} / ${region}...`);
  try {
    const noWait = flags.wait === "true" ? false : true;
    const deployArgs = ["deploy", "--project", project, "--region", region, "--no-confirm-project"];
    if (noWait) deployArgs.push("--no-wait");
    const timeoutMs = Number(flags["deploy-timeout-ms"] || process.env.GE_DEPLOY_TIMEOUT_MS || (noWait ? 180000 : 900000));
    const deployResult = await runCommand("agents-cli", deployArgs, { cwd: dir, stream: true, timeout: timeoutMs });

    const metaPath = join(dir, "deployment_metadata.json");
    const meta = await readJson(metaPath, null);
    const runtimeId = parseAgentRuntimeId(meta);
    const operation = parseOperationId(`${deployResult.stdout}\n${deployResult.stderr}`);

    if (noWait && !runtimeId) {
      markStep(pipeline, "deploy", "running", {
        project,
        region,
        target,
        operation,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      await savePipeline(dir, pipeline);
      ok({
        step: "deploy",
        status: "running",
        target,
        project,
        region,
        operation,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      return;
    }

    markStep(pipeline, "deploy", "done", {
      project, region, target,
      runtimeId,
      isA2a: meta?.is_a2a || false,
    });
    await savePipeline(dir, pipeline);
    ok({ step: "deploy", target, project, region, runtimeId, deploymentMetadata: metaPath });
  } catch (e) {
    if (e.message === "timeout") {
      const operation = parseOperationId(`${e.stdout || ""}\n${e.stderr || ""}`);
      markStep(pipeline, "deploy", "running", {
        project,
        region,
        target,
        operation,
        timeoutMs: Number(flags["deploy-timeout-ms"] || process.env.GE_DEPLOY_TIMEOUT_MS || 900000),
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      await savePipeline(dir, pipeline);
      ok({
        step: "deploy",
        status: "running",
        target,
        project,
        region,
        operation,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      return;
    }
    markStep(pipeline, "deploy", "failed", { error: e.message });
    await savePipeline(dir, pipeline);
    fail(`Deploy failed: ${e.message}`);
  }
}

async function cmdDeployStatus(dir, flags) {
  const pipeline = await loadPipeline(dir);
  const project = await getGcloudProject(flags);
  const region = await getGcloudRegion(flags);
  if (!project) fail("--project required (or set GOOGLE_CLOUD_PROJECT)");
  console.error(`Checking Agent Runtime deploy status in ${project} / ${region}...`);
  try {
    const statusResult = await runCommand("agents-cli", ["deploy", "--status", "--project", project, "--region", region, "--no-confirm-project"], { cwd: dir, stream: true, timeout: 180000 });
    const metaPath = join(dir, "deployment_metadata.json");
    const meta = await readJson(metaPath, null);
    const runtimeId = parseAgentRuntimeId(meta);
    if (!runtimeId) {
      markStep(pipeline, "deploy", "running", {
        project,
        region,
        target: "agent_runtime",
        operation: parseOperationId(`${statusResult.stdout}\n${statusResult.stderr}`) || pipeline.steps.deploy?.operation || null,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      await savePipeline(dir, pipeline);
      ok({ step: "deploy-status", status: "running", project, region, runtimeId: null });
      return;
    }
    markStep(pipeline, "deploy", "done", { project, region, target: "agent_runtime", runtimeId, isA2a: meta?.is_a2a || false });
    await savePipeline(dir, pipeline);
    ok({ step: "deploy-status", status: "done", project, region, runtimeId, deploymentMetadata: metaPath });
  } catch (e) {
    markStep(pipeline, "deploy", "failed", { error: e.message, project, region, target: "agent_runtime" });
    await savePipeline(dir, pipeline);
    fail(`Deploy status failed: ${e.message}`);
  }
}

async function cmdVerifyLive(dir, flags) {
  const pipeline = await loadPipeline(dir);
  await hydrateDeployStepFromMetadata(dir, pipeline, flags);
  requireStep(pipeline, "deploy");
  const deployStep = pipeline.steps.deploy || {};
  const meta = await readJson(join(dir, "deployment_metadata.json"), null);
  const runtimeId = parseAgentRuntimeId(meta, deployStep.runtimeId);
  const target = flags.url || deployStep.serviceUrl || agentRuntimeRunUrl(runtimeId);
  const mode = flags.mode || (runtimeId ? "adk" : "a2a");
  const prompt = flags.prompt || "hello";
  if (!target) fail("No deployed URL or Agent Runtime metadata found. Run deploy-status first or pass --url.");

  try {
    await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});
    const args = ["run", prompt, "--url", target, "--mode", mode];
    if (flags["app-name"]) args.push("--app-name", flags["app-name"]);
    const result = await runLifecycleCommand({
      dir,
      name: "verify-live",
      args,
      timeout: Number(flags["timeout-ms"] || 180000),
      artifact: "agents-cli-verify-live.log.md",
    });
    const report = {
      kind: "ge.agents_cli.verify_live",
      ok: result.ok,
      generatedAt: GENERATED_AT,
      target,
      mode,
      prompt,
      runtimeId,
      command: result.command,
      exitCode: result.exitCode,
      stdoutTail: result.stdout,
      stderrTail: result.stderr,
    };
    await writeJson(join(dir, "artifacts", "agents-cli-verify-live.json"), report);
    markStep(pipeline, "verifyLive", result.ok ? "done" : "failed", {
      output: "artifacts/agents-cli-verify-live.json",
      target,
      mode,
      exitCode: result.exitCode,
    });
    await savePipeline(dir, pipeline);
    ok({ step: "verify-live", ...report });
  } catch (e) {
    markStep(pipeline, "verifyLive", "failed", { error: e.message, target, mode });
    await savePipeline(dir, pipeline);
    fail(`Live verification failed: ${e.message}`);
  }
}

// ── Register (Agent Registry via gcloud alpha agent-registry) ─

// Compute the agent's MCP tool descriptors from its fixture manifest. Single
// source of truth for BOTH the Agent Registry tool spec (buildToolSpec) and the
// per-agent GCS manifest the department MCP service reads at runtime
// (mock_data/cloud/mcp-tools.json → gs://<dataBucket>/agents/<id>/mcp-tools.json).
// Shape matches mcp-service/server.py: [{ name, description, inputSchema }].
function mcpToolDescriptors(manifest) {
  const tables = manifest?.tables || [];
  const simulatorRegistry = loadSimulatorRegistry();
  const tools = [
    {
      name: "list_systems",
      description: `List all tables and documents in the ${manifest?.id || "mock"} scenario.`,
      inputSchema: { type: "object", properties: {} },
    },
  ];
  for (const t of tables) {
    const props = {};
    const filterCols = (t.columns || []).filter((c) => c.type === "string" && !["id", "name", "email"].includes(c.name)).slice(0, 3);
    for (const c of filterCols) {
      props[c.name] = { type: "string", description: `Filter by ${c.name}` };
    }
    props.limit = { type: "integer", description: "Max rows to return (default 20)" };
    tools.push({
      name: `query_${snakeCase(t.name)}`,
      description: `Query ${t.name} table. ${t.rowCount || "N"} rows. Columns: ${(t.columns || []).map((c) => c.name).join(", ")}.`,
      inputSchema: { type: "object", properties: props },
    });
  }
  const behaviorContract = manifest?.useCaseSpec?.behaviorContract || null;
  const contractToolKinds = new Set(["action", "notification", "evidence_lookup", "calculation"]);
  for (const intent of behaviorContract?.toolIntents || []) {
    if (!intent?.name || !contractToolKinds.has(intent.kind)) continue;
    const name = safePyName(intent.name);
    const props = {};
    for (const input of intent.requiredInputs || []) {
      props[input] = { type: "string", description: `Required input: ${input}` };
    }
    const tool = {
      name,
      description: `[${intent.kind}/${intent.sourceSystemId}] ${intent.description || intent.name}`,
      inputSchema: {
        type: "object",
        properties: props,
        required: intent.requiredInputs || [],
      },
    };
    const simulator = simulatorBindingForTool({
      sourceSystemId: intent.sourceSystemId,
      sourceSystem: intent.sourceSystem,
      toolName: name,
    }, simulatorRegistry);
    if (simulator) tool.simulator = simulator;
    tools.push(tool);
  }
  const existingToolNames = new Set(tools.map((tool) => tool.name));
  for (const system of manifest?.systems || []) {
    const simulator = findSimulatorForSystem(system.id || system.name, simulatorRegistry);
    if (!simulator?.toolCatalog?.tools?.length) continue;
    for (const toolSpec of simulator.toolCatalog.tools) {
      if (!toolSpec?.name || existingToolNames.has(toolSpec.name)) continue;
      tools.push({
        name: toolSpec.name,
        description: toolSpec.description || `${simulator.displayName} simulator tool ${toolSpec.name}`,
        inputSchema: toolSpec.inputSchema || { type: "object", properties: {} },
        simulator: {
          system_id: simulator.id,
          tool: toolSpec.name,
        },
      });
      existingToolNames.add(toolSpec.name);
    }
  }
  return tools;
}

async function buildToolSpec(dir, manifest) {
  const maxBytes = 10 * 1024;
  const tools = mcpToolDescriptors(manifest);
  const specPath = join(dir, "mock_systems", "toolspec.json");
  let spec = { tools };
  let content = JSON.stringify(spec, null, 2) + "\n";
  if (Buffer.byteLength(content, "utf8") > maxBytes) {
    const compactTools = tools.map((tool) => ({
      name: tool.name,
      description: String(tool.description || tool.name).slice(0, 160),
      ...(tool.simulator ? { simulator: tool.simulator } : {}),
      inputSchema: tool.inputSchema?.properties ? {
        type: "object",
        properties: Object.fromEntries(Object.entries(tool.inputSchema.properties).slice(0, 4).map(([key, value]) => [
          key,
          { type: value?.type || "string" },
        ])),
        ...(tool.inputSchema.required?.length ? { required: tool.inputSchema.required.slice(0, 4) } : {}),
      } : { type: "object", properties: {} },
    }));
    spec = { tools: compactTools };
    content = JSON.stringify(spec, null, 2) + "\n";
  }
  if (Buffer.byteLength(content, "utf8") > maxBytes) {
    const baseTools = spec.tools.slice(0, Math.max(1, spec.tools.findIndex((tool) => String(tool.name || "").startsWith("query_"))));
    const queryTools = spec.tools.filter((tool) => String(tool.name || "").startsWith("query_")).slice(0, 20);
    const actionTools = spec.tools.filter((tool) => !String(tool.name || "").startsWith("query_") && tool.name !== "list_systems").slice(0, 20);
    spec = { tools: [...baseTools, ...queryTools, ...actionTools] };
    content = JSON.stringify(spec, null, 2) + "\n";
  }
  if (Buffer.byteLength(content, "utf8") > maxBytes) {
    fail(`Generated toolspec.json exceeds 10 KB Agent Registry limit after compaction (${Buffer.byteLength(content, "utf8")} bytes). Reduce exposed tools or split the MCP server by source system.`);
  }
  await writeText(specPath, content);
  return specPath;
}

async function testServiceReachability(url) {
  console.error(`Testing reachability of Cloud Run service at ${url}...`);
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const res = await fetch(url, { signal: controller.signal, method: "GET" });
    clearTimeout(id);
    console.error(`Reachability check result: HTTP ${res.status} (${res.statusText})`);
    return { ok: true, status: res.status, statusText: res.statusText };
  } catch (e) {
    console.error(`Warning: Reachability check failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function normalizeAgentRegistryProtocol(protocolInput) {
  const value = String(protocolInput || "sse").toLowerCase().replace(/_/g, "-");
  if (value === "sse" || value === "jsonrpc" || value === "json-rpc") return "JSONRPC";
  if (value === "http-json" || value === "httpjson") return "HTTP_JSON";
  if (value === "grpc") return "GRPC";
  return String(protocolInput || "JSONRPC").toUpperCase().replace(/-/g, "_");
}

function assertSupportedAgentRegistryLocation(location) {
  const value = String(location || "").toLowerCase();
  if (value === "us" || value === "eu") {
    fail("Manual Agent Registry MCP registration is not supported in the us or eu multi-region locations. Use a supported region or global.");
  }
}

async function cmdRegister(dir, flags) {
  const pipeline = await loadPipeline(dir);
  await hydrateDeployStepFromMetadata(dir, pipeline, flags);
  requireStep(pipeline, "deploy");
  const project = await getGcloudProject(flags);
  const region = await getGcloudRegion(flags);
  const mode = flags.as || "adk";
  const deployStep = pipeline.steps.deploy || {};
  const manifest = await readJson(manifestPath(dir), null);
  const serverName = snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
  const displayName = flags["display-name"] || pipeline.name || "Mock Agent";

  if (mode === "mcp") {
    assertSupportedAgentRegistryLocation(region);
    // Per-department multi-tenant MCP service: register this agent at the dept URL
    // scoped by ?agent=<id>. --service-url comes from .ge.json mcpServices[<dept>]
    // (the worker passes it); fall back to a per-agent deploy serviceUrl if present.
    const agentId = flags["agent-id"] || snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
    let serviceUrl = flags["service-url"] || deployStep.serviceUrl;
    if (!serviceUrl) fail("No --service-url (department MCP) and no deploy serviceUrl. Run `ge mcp deploy` and pass --service-url.");
    const u = new URL(serviceUrl.endsWith("/mcp") ? serviceUrl : `${serviceUrl.replace(/\/$/, "")}/mcp`);
    u.searchParams.set("agent", agentId);
    serviceUrl = u.toString();

    const protocolInput = flags.protocol || "jsonrpc";
    const protocolBinding = normalizeAgentRegistryProtocol(protocolInput);

    // Warm-up and Reachability Check
    const reachability = await testServiceReachability(serviceUrl);

    console.error(`Building tool spec from manifest...`);
    const specPath = await buildToolSpec(dir, manifest);

    console.error(`Registering "${serverName}" as MCP service in Agent Registry...`);
    console.error(`Project: ${project} | Region: ${region}`);
    console.error(`URL: ${serviceUrl} | ProtocolBinding: ${protocolBinding}`);
    try {
      await runCommand("gcloud", [
        "alpha", "agent-registry", "services", "create", serverName,
        `--project=${project}`,
        `--location=${region}`,
        `--display-name=${displayName}`,
        "--mcp-server-spec-type=tool-spec",
        `--mcp-server-spec-content=${specPath}`,
        `--interfaces=url=${serviceUrl},protocolBinding=${protocolBinding}`,
      ], { stream: true, timeout: 60000 });

      // Authorize the agent identity to call this MCP server (governed agent→MCP egress).
      // Per gemini-enterprise-agent-platform/govern/policies/assign-identity-iam#agent-to-mcp-server,
      // the role is roles/iap.egressor bound on the mcpServer (optionally read-only conditioned).
      let principalSet = flags["agent-principalset"] || flags.principalset || "";
      if (!principalSet) {
        const pn = await runCommand("gcloud", ["projects", "describe", project, "--format=value(projectNumber)"], { stream: false });
        const num = (pn.stdout || "").trim();
        const orgId = flags["agent-identity-org-id"] || flags["agent-org-id"] || process.env.GE_AGENT_IDENTITY_ORG_ID || "";
        if (num && orgId) principalSet = `principalSet://agents.global.org-${orgId}.system.id.goog/attribute.platformContainer/aiplatform/projects/${num}`;
      }
      let egressGranted = false;
      if (principalSet) {
        const egress = ["beta", "iap", "web", "add-iam-policy-binding",
          `--project=${project}`, `--region=${region}`, `--mcpServer=${serverName}`,
          `--member=${principalSet}`, "--role=roles/iap.egressor"];
        if (flags["read-only"]) egress.push("--condition=expression=request.auth.type == 'MCP' && mcp.tool.isReadOnly,title=read-only-egress");
        else egress.push("--condition=None");
        console.error(`Granting roles/iap.egressor (agent→MCP) on mcpServer ${serverName}${flags["read-only"] ? " [read-only]" : ""}…`);
        const g = await runCommand("gcloud", egress, { stream: false });
        egressGranted = g.code === 0;
        console.error(egressGranted
          ? `  ✓ iap.egressor → ${principalSet}`
          : `  ⚠ iap.egressor grant failed (verify 'gcloud beta iap web add-iam-policy-binding --mcpServer' on your authed host): ${(g.stderr || "").split("\n")[0]}`);
      } else {
        console.error("  ⚠ skipped iap.egressor grant: no agent principalSet (pass --agent-principalset or set GE_AGENT_IDENTITY_ORG_ID)");
      }

      markStep(pipeline, "register", "done", { mode: "mcp", serverName, serviceUrl, protocol: protocolInput, specPath, reachability, egressGranted });
      await savePipeline(dir, pipeline);
      ok({
        step: "register",
        mode: "mcp",
        serverName,
        serviceUrl,
        protocol: protocolInput,
        toolSpec: specPath,
        reachability,
        adkUsage: [
          `# Authentic ADK code with GCP Authentication for Agent Registry:`,
          `import os`,
          `from google.adk.agents.llm_agent import LlmAgent`,
          `from google.adk.auth.credential_manager import CredentialManager`,
          `from google.adk.integrations.agent_identity import GcpAuthProvider`,
          `from google.adk.integrations.agent_registry import AgentRegistry`,
          ``,
          `# 1. Register the GCP auth provider for automatic credential binding`,
          `CredentialManager.register_auth_provider(GcpAuthProvider())`,
          ``,
          `# 2. Initialize the registry client using ADC`,
          `registry = AgentRegistry(`,
          `    project_id=os.environ.get("GOOGLE_CLOUD_PROJECT", "${project}"),`,
          `    location=os.environ.get("GOOGLE_CLOUD_LOCATION", "${region}"),`,
          `)`,
          ``,
          `# 3. Retrieve the authenticated MCP toolset (bindings are resolved automatically)`,
          `mcp_tools = registry.get_mcp_toolset(`,
          `    mcp_server_name="projects/${project}/locations/${region}/mcpServers/${serverName}"`,
          `)`,
          ``,
          `# 4. Compose your agent with the toolset`,
          `agent = LlmAgent(`,
          `    name="orchestrator_agent",`,
          `    model="${AGENT_MODEL}",`,
          `    instruction="Use the registered MCP tools to answer questions.",`,
          `    tools=[mcp_tools]`,
          `)`,
        ].join("\n"),
        gcloudCommand: `gcloud alpha agent-registry services describe ${serverName} --project=${project} --location=${region}`,
      });
    } catch (e) {
      fail(`Agent Registry registration failed: ${e.message}`);
    }
    return;
  }

  if (mode === "a2a") {
    const serviceUrl = deployStep.serviceUrl;
    if (!serviceUrl) fail("No serviceUrl from deploy. Deploy with --target cloud_run first.");

    const a2aUrl = serviceUrl.endsWith("/") ? `${serviceUrl}.well-known/agent.json` : `${serviceUrl}/.well-known/agent.json`;
    
    // Warm-up and Reachability Check
    const reachability = await testServiceReachability(a2aUrl);

    console.error(`Registering "${serverName}" as A2A agent in Agent Registry...`);
    try {
      await runCommand("gcloud", [
        "alpha", "agent-registry", "services", "create", serverName,
        `--project=${project}`,
        `--location=${region}`,
        `--display-name=${displayName}`,
        `--interfaces=url=${a2aUrl},protocolBinding=HTTP_JSON`,
      ], { stream: true, timeout: 60000 });

      markStep(pipeline, "register", "done", { mode: "a2a", serverName, serviceUrl, reachability });
      await savePipeline(dir, pipeline);
      ok({
        step: "register",
        mode: "a2a",
        serverName,
        serviceUrl,
        reachability,
        adkUsage: [
          `# Authentic ADK code with GCP Authentication for Agent Registry (A2A):`,
          `import os`,
          `import httpx`,
          `import google.auth`,
          `from google.auth.transport.requests import Request`,
          `from google.adk.integrations.agent_registry import AgentRegistry`,
          `from google.adk.agents.llm_agent import LlmAgent`,
          ``,
          `class GoogleAuth(httpx.Auth):`,
          `    def __init__(self):`,
          `        self.creds, _ = google.auth.default()`,
          `    def auth_flow(self, request):`,
          `        if not self.creds.valid:`,
          `            self.creds.refresh(Request())`,
          `        request.headers["Authorization"] = f"Bearer {self.creds.token}"`,
          `        yield request`,
          ``,
          `# Initialize the registry client`,
          `registry = AgentRegistry(`,
          `    project_id=os.environ.get("GOOGLE_CLOUD_PROJECT", "${project}"),`,
          `    location=os.environ.get("GOOGLE_CLOUD_LOCATION", "${region}"),`,
          `)`,
          ``,
          `# Configure the HTTP client with GoogleAuth and a timeout`,
          `httpx_client = httpx.AsyncClient(auth=GoogleAuth(), timeout=httpx.Timeout(60.0))`,
          ``,
          `# Retrieve the remote A2A agent`,
          `remote_agent = registry.get_remote_a2a_agent(`,
          `    agent_name="projects/${project}/locations/${region}/agents/${serverName}",`,
          `    httpx_client=httpx_client`,
          `)`,
          ``,
          `# Compose your orchestrator`,
          `orchestrator = LlmAgent(`,
          `    name="orchestrator_agent",`,
          `    model="${AGENT_MODEL}",`,
          `    instruction="Delegate tasks to the remote A2A agent when needed.",`,
          `    tools=[remote_agent]`,
          `)`,
        ].join("\n"),
      });
    } catch (e) {
      fail(`A2A registration failed: ${e.message}`);
    }
    return;
  }

  // mode === "adk" — Agent Runtime, ready for Gemini Enterprise publish
  const meta = await readJson(join(dir, "deployment_metadata.json"), null);
  const runtimeId = parseAgentRuntimeId(meta, deployStep.runtimeId);
  if (!runtimeId) fail("No runtime ID. Deploy with --target agent_runtime first, or use --as mcp/a2a for Cloud Run services.");

  markStep(pipeline, "register", "done", { mode: "adk", runtimeId });
  await savePipeline(dir, pipeline);
  ok({
    step: "register",
    mode: "adk",
    runtimeId,
    nextStep: `factory publish --dir ${dir} --app-id <GEMINI_ENTERPRISE_APP_ID>`,
  });
}

// ── Publish (Gemini Enterprise) ──────────────────────────────

async function cmdPublish(dir, flags) {
  const pipeline = await loadPipeline(dir);
  await hydrateDeployStepFromMetadata(dir, pipeline, flags);
  requireStep(pipeline, "deploy");
  const project = await getGcloudProject(flags);
  const location = flags.location || flags.region || process.env.GEMINI_ENTERPRISE_LOCATION || "global";
  const projectNumber = flags["project-number"] || await getGcloudProjectNumber(project);
  const rawAppId = flags["app-id"] || process.env.GEMINI_ENTERPRISE_APP_ID || process.env.ID;
  if (!rawAppId) fail("--app-id required (or set GEMINI_ENTERPRISE_APP_ID)");
  const resolvedApp = await resolveGeminiEnterpriseAppId(rawAppId, { project, projectNumber, location });
  const appId = resolvedApp.appId;

  const meta = await readJson(join(dir, "deployment_metadata.json"), null);
  const regType = meta?.is_a2a ? "a2a" : "adk";
  const runtimeId = parseAgentRuntimeId(meta, pipeline.steps.deploy?.runtimeId);
  if (regType === "adk" && !runtimeId) {
    fail("No valid Agent Runtime ID found. Run factory deploy-status until deployment writes deployment_metadata.json before publishing.");
  }
  const displayName = flags["display-name"] || pipeline.name || "Mock Demo Agent";
  const description = flags.description || `Generated mock agent for ${pipeline.domain} domain`;

  console.error(`Publishing to Gemini Enterprise (${regType})...`);
  try {
    const publishArgs = ["publish", "gemini-enterprise",
      "--gemini-enterprise-app-id", appId,
      "--display-name", displayName,
      "--description", description,
      "--tool-description", description,
      "--registration-type", regType];
    if (project) publishArgs.push("--project-id", project);
    if (projectNumber) publishArgs.push("--project-number", projectNumber);
    if (runtimeId && regType === "adk") publishArgs.push("--agent-runtime-id", runtimeId);
    await runCommand("agents-cli", publishArgs, { cwd: dir, stream: true, timeout: 180000 });

    const registration = {
      generatedAt: GENERATED_AT,
      appId,
      rawAppId,
      appIdResolution: resolvedApp.matched,
      project,
      projectNumber,
      location,
      regType,
      runtimeId,
      displayName,
      description,
    };
    await writeJson(join(dir, "gemini_enterprise_registration.json"), registration);
    markStep(pipeline, "publish", "done", registration);
    await savePipeline(dir, pipeline);
    ok({ step: "publish", appId, rawAppId, appIdResolution: resolvedApp.matched, projectNumber, regType, runtimeId, displayName, registration: join(dir, "gemini_enterprise_registration.json") });
  } catch (e) {
    markStep(pipeline, "publish", "failed", { error: e.message });
    await savePipeline(dir, pipeline);
    fail(`Publish failed: ${e.message}`);
  }
}

async function cmdStatus(dir) {
  const pipeline = await loadPipeline(dir);
  const schema = await readJson(schemaPath(dir), null);
  const manifest = await readJson(manifestPath(dir), null);

  const status = STEPS.map((step) => {
    const s = pipeline.steps[step];
    return { step, status: s?.status || "pending", completedAt: s?.completedAt || null };
  });

  const nextStep = status.find((s) => s.status === "pending" || s.status === "failed")?.step || "done";

  const analysis = schema?.tables?.map(classifyTable) || [];
  const structuredTables = analysis.filter((t) => t.tableKind === "structured").length;
  const mixedTables = analysis.filter((t) => t.tableKind === "mixed").length;
  const unstructuredTables = analysis.filter((t) => t.tableKind === "unstructured").length;

  ok({
    name: pipeline.name,
    domain: pipeline.domain,
    pipeline: status,
    cloudDataPlan: pipeline.steps.cloudDataPlan || null,
    sourceIntegrationPlan: pipeline.steps.sourceIntegration || null,
    nextStep,
    nextCommand: nextStep !== "done" ? `factory ${nextStep} --dir ${dir}` : null,
    schema: schema ? {
      tables: schema.tables.length,
      structured: structuredTables,
      mixed: mixedTables,
      unstructured: unstructuredTables,
      analysis,
    } : null,
    fixtures: manifest ? { tables: manifest.tables?.length, totalRows: manifest.totalRows } : null,
  });
}

async function cmdReset(dir, flags) {
  const pipeline = await loadPipeline(dir);
  const step = flags.step;
  if (!step) fail("--step required");
  const idx = STEPS.indexOf(step);
  if (idx < 0) fail(`Unknown step: ${step}. Valid: ${STEPS.join(", ")}`);
  for (let i = idx; i < STEPS.length; i++) {
    delete pipeline.steps[STEPS[i]];
  }
  pipeline.currentStep = idx > 0 ? STEPS[idx - 1] : null;
  await savePipeline(dir, pipeline);
  ok({ step: "reset", resetFrom: step, currentStep: pipeline.currentStep });
}

async function cmdSources(flags) {
  const script = new URL("./analyze-usecase-sources.mjs", import.meta.url).pathname;
  const jsonPath = flags.json || "src/use-case-source-map.generated.json";
  const mdPath = flags.md || "docs/use-case-data-source-map.md";
  const args = [script];
  if (flags.slides) args.push("--slides", flags.slides);
  else args.push("--slides", "../presentation/src/components/slides/use-cases");
  args.push("--json", jsonPath);
  args.push("--md", mdPath);
  await runCommand("node", args, { cwd: resolve("."), allowFail: false, timeout: 120000 });
  const sourceMap = await readJson(resolve(jsonPath), null);
  ok({
    step: "sources",
    useCases: sourceMap?.useCases?.length || 0,
    json: resolve(jsonPath),
    markdown: resolve(mdPath),
  });
}

async function cmdPlanData(dir, flags) {
  const script = new URL("./plan-mock-data.mjs", import.meta.url).pathname;
  const args = [script, "--dir", dir];
  if (flags.usecase) args.push("--usecase", flags.usecase);
  if (flags["source-map"]) args.push("--sourceMap", flags["source-map"]);
  await runCommand("node", args, { cwd: resolve("."), allowFail: false, timeout: 120000 });
  const plan = await readJson(join(dir, "mock_data", "plan", "data-plan.json"), null);
  const integrationPlan = await buildSourceIntegrationPlan(dir, flags, { dataPlan: plan });
  ok({
    step: "plan-data",
    usecase: plan?.id || flags.usecase,
    datastores: (plan?.datastores || []).map((item) => ({
      id: item.id,
      class: item.class,
      systems: item.systems?.length || 0,
      entities: item.entities?.length || 0,
      packager: item.packager,
    })),
    plan: join(dir, "mock_data", "plan", "data-plan.yaml"),
    snowfakery: join(dir, "mock_data", "snowfakery", "structured.recipe.yml"),
    packageIndex: join(dir, "mock_data", "package-index.yaml"),
    sourceIntegrationPlan: integrationPlan.artifacts.plan,
    toolRegistryPlan: integrationPlan.artifacts.toolRegistryPlan,
  });
}

// ── From Use Case (bridge enterprise catalog → pipeline) ─────

const SYSTEM_TABLE_PATTERNS = {
  "workday": { prefix: "WD", entities: ["employees", "jobs", "compensation", "org_structure"] },
  "benefitfocus": { prefix: "BEN", entities: ["benefit_plans", "enrollments", "eligibility_rules", "carrier_sync_events"] },
  "benefits platform": { prefix: "BEN", entities: ["benefit_plans", "enrollments", "eligibility_rules", "carrier_sync_events"] },
  "sap": { prefix: "SAP", entities: ["transactions", "gl_entries", "vendors", "purchase_orders"] },
  "bigquery": { prefix: "BQ", entities: ["analytics", "historical_data", "metrics"] },
  "servicenow": { prefix: "SN", entities: ["tickets", "incidents", "requests", "approvals"] },
  "salesforce": { prefix: "SF", entities: ["accounts", "opportunities", "contacts", "cases"] },
  "kronos": { prefix: "KR", entities: ["time_entries", "schedules", "attendance"] },
  "coupa": { prefix: "CP", entities: ["requisitions", "purchase_orders", "invoices", "contracts"] },
  "ariba": { prefix: "AR", entities: ["suppliers", "sourcing_events", "contracts"] },
  "blackline": { prefix: "BL", entities: ["reconciliations", "matching_rules", "certifications"] },
  "looker": { prefix: "LK", entities: ["dashboard_data", "cached_queries", "metrics"] },
  "sharepoint": { prefix: "SP", entities: ["documents", "policies", "audit_trails"] },
  "google drive": { prefix: "GD", entities: ["documents", "policies", "plan_documents", "audit_trails"] },
  "google docs": { prefix: "GDOC", entities: ["documents", "comments", "review_threads"] },
  "google chat": { prefix: "GCHAT", entities: ["messages", "spaces", "notifications", "audit_trails"] },
  "slack": { prefix: "SL", entities: ["messages", "channels", "threads"] },
  "lattice": { prefix: "LT", entities: ["reviews", "goals", "feedback", "engagement"] },
  "google calendar": { prefix: "GC", entities: ["events", "meetings", "schedules"] },
  "marketo": { prefix: "MK", entities: ["campaigns", "leads", "engagement_scores"] },
  "hubspot": { prefix: "HS", entities: ["contacts", "deals", "activities"] },
};

function matchSystem(systemName) {
  const lower = systemName.toLowerCase();
  for (const [key, val] of Object.entries(SYSTEM_TABLE_PATTERNS)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

function deriveSchemaFromUseCase(useCase, defaultRows = 30) {
  if (useCase.generationSpec?.entities?.length) {
    return deriveSchemaFromGenerationSpec(useCase, defaultRows, { buildAgentQualityPlan });
  }

  const tables = [];
  const seenEntities = new Set();
  const connections = useCase.architecture?.connections || [];
  const useCaseSpec = buildUseCaseSpec(useCase, defaultRows);
  const systemsByName = new Map((useCaseSpec.systems || []).map((system) => [String(system.name).toLowerCase(), system]));
  const canonicalSystemNames = (useCase.systems || []).filter(Boolean);
  const systemsToDerive = canonicalSystemNames.length
    ? canonicalSystemNames.map((system) => {
        const matchingConnection = connections.find((conn) => String(conn.system || "").toLowerCase() === String(system).toLowerCase())
          || connections.find((conn) => String(conn.description || "").toLowerCase().includes(String(system).toLowerCase()));
        return {
          system,
          description: matchingConnection?.description || `Source records owned by ${system}`,
          protocol: matchingConnection?.protocol || "fixture",
          category: matchingConnection?.category || null,
          direction: matchingConnection?.direction || "read",
        };
      })
    : connections.map((conn) => ({
        system: conn.system,
        description: conn.description,
        protocol: conn.protocol,
        category: conn.category,
        direction: conn.direction,
      }));

  for (const conn of systemsToDerive) {
    if (conn.system.toLowerCase().includes("vertex") || conn.system.toLowerCase().includes("gemini")) continue;
    const pattern = matchSystem(conn.system);
    const prefix = pattern?.prefix || conn.system.slice(0, 3).toUpperCase();
    const entities = pattern?.entities || [snakeCase(conn.system)];
    const sourceSystem = systemsByName.get(String(conn.system).toLowerCase()) || {
      id: canonicalSystemId(conn.system),
      name: conn.system,
      kind: systemKindFromConnection(conn),
      protocol: conn.protocol || "fixture",
      responsibility: conn.description || `Source records owned by ${conn.system}`,
    };

    for (const entity of entities.slice(0, 2)) {
      if (seenEntities.has(entity)) continue;
      seenEntities.add(entity);
      tables.push({
        name: entity,
        rows: defaultRows,
        columns: deriveColumnsForEntity(entity, prefix),
        _sourceSystem: sourceSystem.name,
        _sourceSystemId: sourceSystem.id,
        _sourceKind: sourceSystem.kind,
        _sourceProtocol: sourceSystem.protocol,
        _sourceDescription: conn.description,
      });
    }
  }

  if (tables.length === 0) {
    for (const sys of useCase.systems || []) {
      if (sys.toLowerCase().includes("vertex") || sys.toLowerCase().includes("gemini")) continue;
      const pattern = matchSystem(sys);
      const prefix = pattern?.prefix || sys.slice(0, 3).toUpperCase();
      const entity = pattern?.entities?.[0] || snakeCase(sys);
      const sourceSystem = systemsByName.get(String(sys).toLowerCase()) || { id: canonicalSystemId(sys), name: sys, kind: "source_system", protocol: "fixture" };
      if (seenEntities.has(entity)) continue;
      seenEntities.add(entity);
      tables.push({
        name: entity,
        rows: defaultRows,
        columns: deriveColumnsForEntity(entity, prefix),
        _sourceSystem: sourceSystem.name,
        _sourceSystemId: sourceSystem.id,
        _sourceKind: sourceSystem.kind,
        _sourceProtocol: sourceSystem.protocol,
      });
    }
  }

  if (tables.length === 0) {
    tables.push({
      name: "business_records",
      rows: defaultRows,
      columns: deriveColumnsForEntity("metric_records", "GEN"),
      _sourceSystem: "synthetic",
      _sourceSystemId: "synthetic",
      _sourceKind: "generated_fixture",
      _sourceDescription: useCase.title || "Freeform generated scenario",
    });
  }

  const anomalies = (useCase.kpis || []).map((kpi, i) => ({
    id: `kpi-anomaly-${i + 1}`,
    description: `${kpi.label}: before=${kpi.before}, after=${kpi.after}. Agent should discover the gap.`,
    evidence: tables.map((t) => t.name),
  }));

  useCaseSpec.dataContracts = tables.map((table) => ({
    entity: table.name,
    sourceSystem: table._sourceSystem,
    sourceSystemId: table._sourceSystemId,
    sourceKind: table._sourceKind,
    rows: table.rows,
    primaryKey: table.columns.find((column) => column.type === "seq")?.name || table.columns[0]?.name || "id",
    columns: table.columns.map((column) => ({
      name: column.name,
      type: column.type,
      ref: column.ref || null,
      required: true,
    })),
  }));
  const schema = enrichScenarioSpec({
    seed: 42,
    domain: useCase.department || "general",
    systems: useCaseSpec.systems,
    useCaseSpec,
    rowPolicy: useCaseSpec.rowPolicy,
    tables,
    anomalies,
  });
  schema.useCaseSpec.agentQualityPlan = buildAgentQualityPlan({
    useCase: { ...useCase, rowPolicy: useCaseSpec.rowPolicy },
    contract: schema.useCaseSpec.behaviorContract,
    systems: useCaseSpec.systems || [],
    tables,
    documents: [],
  });
  return schema;
}

async function cmdFromUseCase(dir, flags) {
  const useCaseId = flags.usecase || flags.id;
  const freeform = flags.freeform;
  const rows = Number(flags.rows) || 30;
  const seed = Number(flags.seed) || 42;

  if (!useCaseId && !freeform) fail("--usecase <id> required (from enterprise catalog) or --freeform '<description>'");

  let useCase;

  if (useCaseId) {
    const catalogPath = join(resolve("."), "src", "use-cases.js");
    try {
      const mod = await import(`file://${catalogPath}`);
      useCase = findUseCase(mod.getUseCases(), useCaseId);
      if (!useCase) {
        const needle = normalizeUseCaseLookup(useCaseId);
        const matches = mod.getUseCases().filter((u) => {
          const id = normalizeUseCaseLookup(u.id);
          const title = normalizeUseCaseLookup(u.title);
          const source = normalizeUseCaseLookup(u.sourcePath || "");
          return id.includes(needle) || needle.includes(id) || title.includes(needle) || needle.includes(title) || source.includes(needle);
        });
        if (matches.length === 1) useCase = matches[0];
        else if (matches.length > 1) {
          ok({ step: "from-usecase", error: "ambiguous", matches: matches.slice(0, 10).map((u) => ({ id: u.id, title: u.title, department: u.department })) });
          return;
        } else fail(`Use case "${useCaseId}" not found. Use factory list-usecases to browse.`);
      }
    } catch (e) {
      fail(`Could not load use case catalog: ${e.message}`);
    }
  } else {
    useCase = {
      id: snakeCase(freeform.slice(0, 40)),
      title: freeform,
      department: flags.domain || "general",
      systems: (flags.systems || "").split(",").filter(Boolean),
      kpis: [],
      architecture: { connections: [] },
    };
  }

  const name = snakeCase(useCase.id);
  const targetDir = dir === resolve(".") ? resolve(name) : dir;

  console.error(`Use case: ${useCase.title} (${useCase.department})`);
  console.error(`Systems: ${(useCase.systems || []).join(", ")}`);
  console.error(`Target: ${targetDir}`);

  // Step 1: init
  await cmdInit(targetDir, { name, domain: useCase.department || "general" });

  // Step 2: derive + write schema
  const schema = deriveSchemaFromUseCase(useCase, rows);
  schema.seed = seed;
  await writeJson(schemaPath(targetDir), schema);
  await writeJson(join(targetDir, "mock_systems", "usecase-spec.json"), schema.useCaseSpec);
  const pipeline = await loadPipeline(targetDir);
  pipeline.useCase = { id: useCase.id, title: useCase.title, department: useCase.department, systems: useCase.systems, kpis: useCase.kpis };
  markStep(pipeline, "schema", "done", { tables: schema.tables.length, derived: true });
  await savePipeline(targetDir, pipeline);

  // Step 3: generate fixtures
  await cmdGenerate(targetDir, { seed: String(seed), rows: String(rows) });

  // Step 4: generate tools + agent
  await cmdTools(targetDir, { "force-agent": flags["force-agent"] || "false" });

  // Step 5: generate smoke tests. The factory jumps straight to the cloud-build
  // `validate` stage (pytest tests/test_smoke.py), so the scaffolded workspace
  // must already contain the test file — otherwise pytest exits 4 (file not
  // found) and validate fails.
  await cmdTest(targetDir, {});

  const reviewResult = shouldRunHarnessReview(flags)
    ? await cmdHarnessReview(targetDir, flags)
    : { skipped: true, reason: "Set --harness-review true or configure GEMINI_API_KEY/Vertex env to run Antigravity SDK review." };
  const refineResult = shouldRunHarnessRefine(flags)
    ? await cmdHarnessRefine(targetDir, flags)
    : { skipped: true, reason: "Set --harness-refine true or enable harness review to run active Antigravity refinement." };
  if (!refineResult.skipped) {
    await cmdTest(targetDir, { run: flags["run-tests-after-refine"] || "false" });
  }

  console.error(`\nPipeline complete through '${refineResult.skipped ? (reviewResult.skipped ? "test" : "harnessReview") : "harnessRefine"}'. Ready to serve.`);
  ok({
    step: "from-usecase",
    useCase: { id: useCase.id, title: useCase.title, department: useCase.department },
    dir: targetDir,
    tables: schema.tables.map((t) => ({ name: t.name, rows: t.rows, source: t._sourceSystem, columns: t.columns.length })),
    anomalies: schema.anomalies?.length || 0,
    harnessReview: reviewResult,
    harnessRefine: refineResult,
    nextSteps: [
      reviewResult.skipped ? `factory harness-review --dir ${targetDir} --vertex true --project <project> --location <location>` : null,
      refineResult.skipped ? `factory harness-refine --dir ${targetDir} --vertex true --project <project> --location <location>` : null,
      `factory serve --dir ${targetDir}`,
      `factory status --dir ${targetDir}`,
    ].filter(Boolean),
  });
}

async function cmdPackCoverage(flags) {
  const report = analyzePackCoverage(getUseCases(), DOMAIN_CATALOG);
  if (flags.out) {
    await writeJson(resolve(flags.out), report);
  }
  ok({
    step: "pack-coverage",
    totals: report.totals,
    depthCoverage: report.totals.depthCoverage,
    depthCoveragePct: report.totals.depthCoveragePct,
    byDepartment: report.byDepartment,
    scenarioPackCounts: report.scenarioPackCounts,
    simulatorInterop: report.simulatorInterop,
    topUncoveredSystems: report.topUncoveredSystems.slice(0, 12),
    topUncoveredEntities: report.topUncoveredEntities.slice(0, 12),
    output: flags.out ? resolve(flags.out) : null,
  });
}

function selectAuditUseCases(flags) {
  let cases = getUseCases();
  if (flags.department) cases = cases.filter((useCase) => useCase.department === flags.department);
  if (flags.search) {
    const q = String(flags.search).toLowerCase();
    cases = cases.filter((useCase) => (
      String(useCase.id || "").toLowerCase().includes(q)
      || String(useCase.title || "").toLowerCase().includes(q)
      || String(useCase.department || "").toLowerCase().includes(q)
    ));
  }
  const offset = Math.max(0, Number(flags.offset) || 0);
  const limit = flags.limit ? Math.max(0, Number(flags.limit) || 0) : cases.length;
  return cases.slice(offset, offset + limit);
}

function failureCategory(result) {
  const text = `${result.error || ""}\n${result.stdout || ""}\n${result.stderr || ""}`;
  if (/Contract tool .* missing/.test(text)) return "missing_contract_tool";
  if (/ModuleNotFoundError|ImportError/.test(text)) return "python_import";
  if (/assert .*exists|No such file|ENOENT/.test(text)) return "missing_fixture_or_artifact";
  if (/timeout/i.test(text)) return "timeout";
  if (/FAILED/.test(text)) return "pytest_failure";
  return result.passed ? null : "generation_or_test_failure";
}

function incrementAuditBucket(map, key, passed) {
  const row = map[key] ||= { total: 0, passed: 0, failed: 0 };
  row.total += 1;
  if (passed) row.passed += 1;
  else row.failed += 1;
}

function renderBatchAuditMarkdown(report) {
  const lines = [
    `# GE Mock Batch Audit`,
    "",
    `Generated: ${report.generatedAt}`,
    `Root: \`${report.root}\``,
    "",
    `## Summary`,
    "",
    `- Total: ${report.totals.total}`,
    `- Passed: ${report.totals.passed}`,
    `- Failed: ${report.totals.failed}`,
    `- Skipped tests: ${report.totals.skippedTests}`,
    `- Harness review: ${report.runHarnessReview ? "enabled" : "disabled"}`,
    "",
    `## By Department`,
    "",
    `| Department | Total | Passed | Failed |`,
    `|---|---:|---:|---:|`,
    ...Object.entries(report.byDepartment).map(([id, row]) => `| ${id} | ${row.total} | ${row.passed} | ${row.failed} |`),
    "",
    `## By Pack`,
    "",
    `| Pack | Total | Passed | Failed |`,
    `|---|---:|---:|---:|`,
    ...Object.entries(report.byPack).sort((a, b) => b[1].failed - a[1].failed || b[1].total - a[1].total).map(([id, row]) => `| ${id} | ${row.total} | ${row.passed} | ${row.failed} |`),
    "",
    `## Failures`,
    "",
  ];
  const failures = report.results.filter((row) => !row.passed);
  if (!failures.length) {
    lines.push("No failures.");
  } else {
    lines.push(`| Use Case | Department | Category | Detail |`);
    lines.push(`|---|---|---|---|`);
    for (const row of failures) {
      const detail = String(row.error || row.stderr || row.stdout || "").replace(/\s+/g, " ").slice(0, 180);
      lines.push(`| ${row.id} | ${row.department} | ${row.failureCategory || "unknown"} | ${detail} |`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

async function cmdBatchAudit(flags) {
  const selected = selectAuditUseCases(flags);
  const runTests = flags.run !== "false";
  const runHarness = shouldRunHarnessReview(flags, false);
  const rows = Number(flags.rows) || 8;
  const seed = Number(flags.seed) || 42;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const root = resolve(flags.root || `/tmp/factory-batch-audit-${timestamp}`);
  const coverage = analyzePackCoverage(getUseCases(), DOMAIN_CATALOG);
  const coverageById = new Map(coverage.rows.map((row) => [row.id, row]));
  await mkdir(root, { recursive: true });

  const results = [];
  const byDepartment = {};
  const byPack = {};
  const byFailureCategory = {};

  for (const useCase of selected) {
    const workspace = join(root, snakeCase(useCase.id));
    const coverageRow = coverageById.get(useCase.id);
    const result = {
      id: useCase.id,
      title: useCase.title,
      department: useCase.department || "general",
      domainId: useCase.domainId || null,
      workspace,
      systems: coverageRow?.systems || [],
      packs: coverageRow?.scenarioPacks || [],
      recipeDepth: coverageRow?.recipeDepth || {},
      passed: false,
      testRan: false,
      exitCode: null,
    };
    try {
      await cmdInit(workspace, { name: snakeCase(useCase.id), domain: useCase.department || "general" });
      const schema = deriveSchemaFromUseCase(useCase, rows);
      schema.seed = seed;
      await writeJson(schemaPath(workspace), schema);
      await writeJson(join(workspace, "mock_systems", "usecase-spec.json"), schema.useCaseSpec);
      const pipeline = await loadPipeline(workspace);
      pipeline.useCase = { id: useCase.id, title: useCase.title, department: useCase.department, systems: useCase.systems, kpis: useCase.kpis };
      markStep(pipeline, "schema", "done", { tables: schema.tables.length, derived: true });
      await savePipeline(workspace, pipeline);
      await cmdGenerate(workspace, { seed: String(seed), rows: String(rows) });
      await cmdTools(workspace, {});
      await cmdTest(workspace, { run: "false" });
      if (runHarness) {
        const reviewed = await cmdHarnessReview(workspace, flags);
        result.harnessReview = reviewed;
      }
      if (shouldRunHarnessRefine(flags, false)) {
        const refined = await cmdHarnessRefine(workspace, flags);
        result.harnessRefine = refined;
      }
      if (runTests) {
        const testRun = await runCommand("uv", ["run", "pytest", "tests/test_smoke.py", "-q", "--tb=short"], { cwd: workspace, allowFail: true, timeout: 120000 });
        result.testRan = true;
        result.exitCode = testRun.code;
        result.stdout = testRun.stdout.slice(-4000);
        result.stderr = testRun.stderr.slice(-4000);
        result.passed = testRun.code === 0;
      } else {
        result.passed = true;
      }
    } catch (error) {
      result.error = error.message;
      result.stdout = error.stdout?.slice(-4000) || "";
      result.stderr = error.stderr?.slice(-4000) || "";
      result.exitCode = error.code ?? null;
      result.passed = false;
    }
    result.failureCategory = failureCategory(result);
    if (result.failureCategory) incrementAuditBucket(byFailureCategory, result.failureCategory, result.passed);
    incrementAuditBucket(byDepartment, result.department, result.passed);
    for (const packId of result.packs.length ? result.packs : ["<none>"]) incrementAuditBucket(byPack, packId, result.passed);
    results.push(result);
  }

  const report = {
    generatedAt: GENERATED_AT,
    root,
    runTests,
    runHarnessReview: runHarness,
    selection: {
      totalCatalogUseCases: getUseCases().length,
      selected: selected.length,
      department: flags.department || null,
      search: flags.search || null,
      offset: Number(flags.offset) || 0,
      limit: flags.limit ? Number(flags.limit) : null,
    },
    totals: {
      total: results.length,
      passed: results.filter((row) => row.passed).length,
      failed: results.filter((row) => !row.passed).length,
      skippedTests: results.filter((row) => !row.testRan).length,
    },
    byDepartment,
    byPack,
    byFailureCategory,
    results,
  };
  const outPath = resolve(flags.out || join(root, "batch-audit.json"));
  const mdPath = resolve(flags.md || join(root, "batch-audit.md"));
  await writeJson(outPath, report);
  await writeText(mdPath, renderBatchAuditMarkdown(report));
  ok({
    step: "batch-audit",
    totals: report.totals,
    byFailureCategory,
    root,
    output: outPath,
    markdown: mdPath,
  });
}

function normalizeUseCaseLookup(value) {
  return String(value || "")
    .replace(/Agent$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findUseCase(useCases, requestedId) {
  const requested = normalizeUseCaseLookup(requestedId);
  // Support uc-NNNN → A-NNNN mapping: presentation deck uses "uc-2103" while
  // catalog subtitle carries "A-2103". Extract A-NNNN from subtitle and match.
  const ucMatch = String(requestedId || "").match(/^uc-(\d+)$/i);
  const agentIdFromUc = ucMatch ? `A-${ucMatch[1]}` : null;

  return useCases.find((useCase) => {
    const candidates = [
      useCase.id,
      useCase.title,
      useCase.sourcePath?.split(/[\\/]/).pop()?.replace(/\.tsx$/i, ""),
    ].filter(Boolean).map(normalizeUseCaseLookup);

    // Match standard catalog fields (id, title, sourcePath)
    if (candidates.includes(requested)) return true;

    // Match uc-NNNN → A-NNNN via subtitle
    if (agentIdFromUc && useCase.subtitle) {
      const subtitleAgentId = String(useCase.subtitle).match(/^(A-\d+)/)?.[1];
      if (subtitleAgentId === agentIdFromUc) return true;
    }

    return false;
  }) || null;
}

async function cmdListUseCases(flags) {
  try {
    // getUseCases is statically imported (top of file); the prior dynamic import
    // computed a cwd-relative path that broke when run from anywhere but repo root.
    let cases = getUseCases();
    if (flags.department) cases = cases.filter((u) => u.department === flags.department);
    if (flags.search) {
      const q = flags.search.toLowerCase();
      cases = cases.filter((u) => u.title.toLowerCase().includes(q) || u.id.includes(q));
    }
    ok({
      total: cases.length,
      departments: [...new Set(cases.map((u) => u.department))],
      useCases: cases.slice(0, Number(flags.limit) || 20).map((u) => ({
        id: u.id,
        title: u.title,
        department: u.department,
        persona: u.persona,
        systems: u.systems?.slice(0, 4),
        kpis: u.kpis?.slice(0, 2).map((k) => `${k.label}: ${k.before}→${k.after}`),
      })),
    });
  } catch (e) {
    fail(`Could not load catalog: ${e.message}`);
  }
}

// ── Value generation (reuses faker) ──────────────────────────

// ── Document generation ──────────────────────────────────────

const DOC_TEMPLATES = {
  policy: { titlePrefix: "Policy", sections: ["Purpose", "Scope", "Policy Statement", "Procedures", "Compliance", "Exceptions", "Review Cycle"] },
  report: { titlePrefix: "Report", sections: ["Executive Summary", "Key Findings", "Analysis", "Recommendations", "Appendix"] },
  contract: { titlePrefix: "Agreement", sections: ["Parties", "Scope of Services", "Terms", "SLA Requirements", "Payment Terms", "Termination", "Signatures"] },
  sop: { titlePrefix: "SOP", sections: ["Objective", "Prerequisites", "Step-by-Step Procedure", "Validation Checks", "Escalation Path", "Revision History"] },
  knowledge_base: { titlePrefix: "KB Article", sections: ["Question", "Answer", "Related Topics", "Last Updated"] },
  audit: { titlePrefix: "Audit Report", sections: ["Audit Scope", "Methodology", "Findings", "Risk Assessment", "Remediation Plan", "Follow-up Schedule"] },
  memo: { titlePrefix: "Memo", sections: ["To", "From", "Date", "Subject", "Background", "Action Required"] },
};

const DOMAIN_DOC_SETS = {
  hr: [
    { id: "hr-policy-leave", type: "policy", title: "Leave & Absence Policy", topic: "leave management, accrual, carry-over limits, approval workflow" },
    { id: "hr-policy-compensation", type: "policy", title: "Compensation & Pay Equity Policy", topic: "pay bands, equity reviews, adjustment criteria, market benchmarking" },
    { id: "hr-sop-onboarding", type: "sop", title: "New Hire Onboarding Procedure", topic: "system provisioning, orientation schedule, buddy assignment, compliance training" },
    { id: "hr-report-attrition", type: "report", title: "Quarterly Attrition Analysis", topic: "turnover by department, voluntary vs involuntary, exit interview themes, risk indicators" },
    { id: "hr-kb-benefits", type: "knowledge_base", title: "Benefits Enrollment FAQ", topic: "enrollment windows, plan comparison, dependent coverage, HSA contributions" },
  ],
  finance: [
    { id: "fin-policy-expense", type: "policy", title: "Travel & Expense Policy", topic: "approval thresholds, receipt requirements, per diem rates, corporate card usage" },
    { id: "fin-policy-procurement", type: "policy", title: "Procurement Authorization Policy", topic: "purchase thresholds, vendor approval, sole source justification, contract review" },
    { id: "fin-sop-close", type: "sop", title: "Month-End Close Procedure", topic: "accrual entries, reconciliation checklist, sign-off workflow, variance thresholds" },
    { id: "fin-report-variance", type: "report", title: "Budget Variance Report", topic: "actual vs budget by cost center, root cause analysis, forecast adjustments" },
    { id: "fin-audit-controls", type: "audit", title: "Internal Controls Audit", topic: "SOX compliance, segregation of duties, access reviews, remediation status" },
  ],
  it: [
    { id: "it-policy-security", type: "policy", title: "Information Security Policy", topic: "access management, data classification, incident response, encryption standards" },
    { id: "it-policy-change", type: "policy", title: "Change Management Policy", topic: "change advisory board, risk assessment, rollback procedures, emergency changes" },
    { id: "it-sop-incident", type: "sop", title: "Incident Response Procedure", topic: "severity classification, escalation matrix, communication templates, post-mortem" },
    { id: "it-report-sla", type: "report", title: "SLA Performance Report", topic: "uptime metrics, response times, resolution rates, trend analysis" },
    { id: "it-kb-access", type: "knowledge_base", title: "System Access Request FAQ", topic: "role-based access, provisioning timeline, approval chain, deprovisioning" },
  ],
  procurement: [
    { id: "proc-policy-sourcing", type: "policy", title: "Strategic Sourcing Policy", topic: "competitive bidding, supplier diversity, evaluation criteria, contract templates" },
    { id: "proc-sop-rfp", type: "sop", title: "RFP Process Procedure", topic: "requirement gathering, supplier shortlisting, evaluation scoring, negotiation" },
    { id: "proc-contract-master", type: "contract", title: "Master Services Agreement Template", topic: "service levels, liability, data protection, pricing structure, renewal terms" },
    { id: "proc-report-spend", type: "report", title: "Spend Analysis Report", topic: "category breakdown, supplier concentration, savings opportunities, compliance rate" },
    { id: "proc-audit-vendor", type: "audit", title: "Vendor Risk Assessment", topic: "financial health, compliance status, performance scores, contingency plans" },
  ],
  marketing: [
    { id: "mkt-policy-brand", type: "policy", title: "Brand Guidelines & Usage Policy", topic: "logo usage, color palette, typography, tone of voice, approval process" },
    { id: "mkt-sop-campaign", type: "sop", title: "Campaign Launch Procedure", topic: "briefing, creative approval, channel setup, tracking, post-campaign analysis" },
    { id: "mkt-report-performance", type: "report", title: "Campaign Performance Report", topic: "reach, engagement, conversion, ROI, channel attribution, A/B test results" },
    { id: "mkt-memo-budget", type: "memo", title: "Q3 Marketing Budget Reallocation", topic: "performance data, channel shift rationale, projected impact, approval request" },
    { id: "mkt-kb-tools", type: "knowledge_base", title: "Marketing Tech Stack FAQ", topic: "platform access, integration points, data flows, support contacts" },
  ],
};

function generateDocument(docDef, domain, generatedTables) {
  const type = docDef.type || "policy";
  const template = DOC_TEMPLATES[type] || DOC_TEMPLATES.policy;
  const title = docDef.title || `${template.titlePrefix}: ${docDef.id}`;
  const topic = docDef.topic || docDef.description || domain || "general operations";
  const requiredSections = Array.isArray(docDef.requiredSections) && docDef.requiredSections.length
    ? docDef.requiredSections
    : template.sections;
  const citationAnchors = Array.isArray(docDef.citationAnchors) ? docDef.citationAnchors : [];
  const minimumWordCount = Number(docDef.minimumWordCount || 0);

  const entityRefs = pickEntityRefs(generatedTables, 3);
  const dateStr = faker.date.between({ from: "2025-01-01", to: "2026-06-01" }).toISOString().slice(0, 10);

  const lines = [
    `# ${title}`,
    "",
    `**Document ID:** ${docDef.id}`,
    `**Effective Date:** ${dateStr}`,
    `**Domain:** ${domain}`,
    `**Source System:** ${docDef.sourceSystem || docDef.sourceSystemId || "Synthetic source system"}`,
    `**Classification:** Internal`,
    "",
  ];

  for (const [sectionIndex, section] of requiredSections.entries()) {
    lines.push(`## ${section}`, "");
    const paraCount = section === "Executive Summary" || section === "Purpose" ? 2 : faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < paraCount; i++) {
      lines.push(generateParagraph(topic, entityRefs) + "\n");
    }
    if (citationAnchors[sectionIndex]) {
      lines.push(`Citation anchor: [${citationAnchors[sectionIndex]}]`, "");
    }
  }

  if (entityRefs.length > 0) {
    lines.push("## Referenced Records", "");
    for (const ref of entityRefs) {
      lines.push(`- \`${ref.id}\`: ${ref.context}`);
    }
    lines.push("");
  }

  while (minimumWordCount > 0 && lines.join("\n").split(/\s+/).filter(Boolean).length < minimumWordCount) {
    lines.push(generateParagraph(topic, entityRefs) + "\n");
  }

  lines.push("---", `*Generated for ${domain} domain demonstration. All data is synthetic.*`);

  return { title, content: lines.join("\n") };
}

function generateDomainDocuments(domain, generatedTables) {
  const docSet = DOMAIN_DOC_SETS[domain] || DOMAIN_DOC_SETS.hr;
  return docSet.map((def) => {
    const doc = generateDocument(def, domain, generatedTables);
    return { id: def.id, title: doc.title, type: def.type, content: doc.content };
  });
}

function generateParagraph(topic, entityRefs) {
  const subjects = [
    "This section establishes the operational framework",
    "The organization requires all stakeholders to adhere to",
    "Based on current analysis and industry benchmarks",
    "To ensure compliance with regulatory requirements",
    "The following procedures have been implemented to address",
    "Risk assessment indicates that the current approach to",
    "Performance metrics demonstrate that improvements in",
    "Cross-functional alignment is critical for effective",
  ];
  const connectors = [
    "Furthermore, ongoing monitoring ensures",
    "In addition, quarterly reviews validate",
    "The responsible parties must document",
    "Exceptions require written approval from",
    "Historical data from the past 12 months shows",
    "Automated checks verify compliance with",
  ];

  const subject = faker.helpers.arrayElement(subjects);
  const connector = faker.helpers.arrayElement(connectors);
  const topicWords = parseList(topic);
  const focus = faker.helpers.arrayElement(topicWords.length > 0 ? topicWords : ["operations"]);

  let para = `${subject} ${focus} within the defined scope. ${connector} ${focus} standards are met.`;

  if (entityRefs.length > 0 && faker.datatype.boolean({ probability: 0.4 })) {
    const ref = faker.helpers.arrayElement(entityRefs);
    para += ` See record \`${ref.id}\` for supporting evidence.`;
  }

  return para;
}

function pickEntityRefs(generatedTables, count) {
  const refs = [];
  for (const [tableName, rows] of Object.entries(generatedTables)) {
    if (!Array.isArray(rows) || rows.length === 0) continue;
    const sample = faker.helpers.arrayElements(rows, { min: 1, max: Math.min(count, rows.length) });
    for (const row of sample) {
      const idField = Object.keys(row).find((k) => k === "id" || k.endsWith("_id")) || Object.keys(row)[0];
      refs.push({ id: String(row[idField] || ""), context: `${tableName} record (${row.name || row.title || row[idField] || ""})` });
    }
    if (refs.length >= count) break;
  }
  return refs.slice(0, count);
}

function generateValue(col, rowIndex, generatedTables) {
  const type = col.type || "string";
  if (type === "seq") {
    const p = col.pattern || `${(col.name || "ID").slice(0, 3).toUpperCase()}-{n:4}`;
    return p.replace(/\{n(?::(\d+))?\}/g, (_, pad) => String(rowIndex + 1).padStart(Number(pad) || 4, "0"));
  }
  if (type === "number") return faker.number.int({ min: col.min ?? 0, max: col.max ?? 1000 });
  if (type === "float") return Number(faker.number.float({ min: col.min ?? 0, max: col.max ?? 1000, fractionDigits: col.decimals ?? 2 }));
  if (type === "date") return faker.date.between({ from: col.min || "2020-01-01", to: col.max || "2026-01-01" }).toISOString().slice(0, 10);
  if (type === "enum") {
    const vals = Array.isArray(col.values) ? col.values : ["A", "B", "C"];
    if (col.weights) return faker.helpers.weightedArrayElement(vals.map((v, i) => ({ value: v, weight: col.weights[i] || 1 })));
    return faker.helpers.arrayElement(vals);
  }
  if (type === "boolean") return faker.datatype.boolean({ probability: col.trueRate ?? 0.5 });
  if (type === "ref") {
    const [entity, field] = (col.ref || "").split(".");
    const ref = generatedTables[entity];
    if (ref?.length) return faker.helpers.arrayElement(ref)[field || "id"] ?? null;
    return `${entity}-${faker.number.int({ min: 1, max: 100 })}`;
  }
  const parts = type.split(".");
  if (parts.length === 2) {
    try {
      const fn = faker[parts[0]]?.[parts[1]];
      if (typeof fn === "function") {
        const opts = {};
        if (col.min !== undefined) opts.min = col.min;
        if (col.max !== undefined) opts.max = col.max;
        if (col.len !== undefined) opts.length = col.len;
        return Object.keys(opts).length ? fn(opts) : fn();
      }
    } catch { /* fall through */ }
  }
  return faker.lorem.word();
}

// ── Help ─────────────────────────────────────────────────────

function printHelp() {
  console.log(`
factory — Unified mock system pipeline

Local Development:
  init      Create workspace structure          --name <n> --domain <d> --dir <dir>
  schema    Add/inspect table schemas           --dir <dir> --add-table '<json>'
  generate  Produce fixture data (faker)        --dir <dir> [--seed N] [--rows N]
  tools     Generate Python ADK tools           --dir <dir>
  test      Generate + run smoke tests          --dir <dir> [--run true|false]
  serve     Start ADK web preview               --dir <dir> [--port N]
  data-plan Generate BigQuery/GCS load artifacts --dir <dir> [--project <p> --dataset <d> --bucket <b>]
  source-integration-plan Plan API/MCP/datastore provisioning and registry wiring --dir <dir> [--project <p>]
  sources   Analyze slide source systems        --slides <dir> [--json <path> --md <path>]
  plan-data Plan datastore collection from use case --dir <dir> --usecase <UseCaseName>
  snowfakery-recipe Export optional Snowfakery recipe --dir <dir>

Google Cloud:
  mcp       Manage Google Cloud MCP servers      --action plan|list|enable|disable [--service bigquery|maps|...]
  deploy    Deploy to Agent Runtime / Cloud Run  --dir <dir> --project <p> [--target agent_runtime|cloud_run]
  deploy-status Check pending Agent Runtime deploy --dir <dir> --project <p> --region <r>
  register  Register in Agent Registry           --dir <dir> --as adk|mcp|a2a
  publish   Publish to Gemini Enterprise         --dir <dir> --app-id <id>

Pipeline:
  status    Show pipeline state + data analysis  --dir <dir>
  reset     Reset pipeline from a step           --dir <dir> --step <step>

Flow: init → schema → generate → tools → test → serve → deploy → register → publish

Column types for schema:
  seq:PATTERN, number:MIN:MAX, float:MIN:MAX:DEC, date:FROM:TO, enum:A|B|C,
  boolean:RATE, ref:TABLE.COL, person.fullName, internet.email, company.name,
  location.city, finance.amount, lorem.sentence, string.uuid, ...

Deploy targets:
  agent_runtime  Standard ADK deployment (default, for Gemini Enterprise publish)
  cloud_run      Cloud Run service (for MCP servers or A2A agents)

Register modes (uses gcloud alpha agent-registry services create):
  adk   Agent Runtime ADK agent → publish to Gemini Enterprise
  mcp   Cloud Run service → register as MCP server with tool spec in Agent Registry
  a2a   Cloud Run service → register as A2A remote agent in Agent Registry

Examples:
  factory init --dir ./hr-agent --name hr-demo --domain hr
  factory schema --dir ./hr-agent --add-table '{"name":"employees","rows":50,"columns":[{"name":"id","type":"seq","pattern":"EMP-{n:4}"},{"name":"name","type":"person.fullName"},{"name":"dept","type":"enum","values":["HR","IT","Finance"]}]}'
  factory generate --dir ./hr-agent --seed 42
  factory tools --dir ./hr-agent
  factory test --dir ./hr-agent
  factory eval --dir ./hr-agent --run false
  factory quality-gate --dir ./hr-agent --prompt "hello" [--evals true|false] [--harness-review true --vertex true|false --no-vertex --project my-project --location global]
  factory harness-review --dir ./hr-agent [--provider antigravity-sdk|agy|gemini|codex|claude] [--vertex true|false --no-vertex --project my-project --location global]
  factory harness-refine --dir ./hr-agent [--provider antigravity-sdk] [--vertex true|false --no-vertex --project my-project --location global]
  factory pack-coverage [--out artifacts/pack-coverage.json]
  factory batch-audit [--limit 25] [--department hr] [--root /tmp/ge-audit] [--run true|false] [--harness-review true]
  factory sources --slides ../presentation/src/components/slides/use-cases
  factory plan-data --dir ./hr-agent --usecase BenefitsAssistant
  factory data-plan --dir ./hr-agent --project my-gcp-project --location US
  factory source-integration-plan --dir ./hr-agent --project my-gcp-project --location global
  factory snowfakery-recipe --dir ./hr-agent
  factory mcp --action enable --service bigquery --project my-gcp-project
  factory deploy --dir ./hr-agent --project my-gcp-project --target agent_runtime
  factory deploy-status --dir ./hr-agent --project my-gcp-project --region us-central1
  factory verify-live --dir ./hr-agent --prompt "hello"
  factory deploy --dir ./hr-agent --project my-gcp-project --target cloud_run
  factory register --dir ./hr-agent --as mcp
  factory publish --dir ./hr-agent --app-id my-gemini-enterprise-app-id
  factory status --dir ./hr-agent
`);
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  // Every command routes through the citty registry. Typed commands use citty's
  // parsed args; legacy-passthrough commands re-parse rawArgs with the existing
  // parser (byte-identical to the old switch) and are typed incrementally.
  // Handlers are injected so registry.mjs has no import back here.
  const tree = buildFactoryCommandTree({
    resolveDir: (d) => resolve(d || "."),
    parseLegacy: (rawArgs) => parseArgs(rawArgs).flags,
    handlers: {
      status: cmdStatus,
      listUsecases: cmdListUseCases,
      promotionGate: cmdPromotionGate,
      sources: cmdSources,
      packCoverage: cmdPackCoverage,
      init: cmdInit,
      schema: cmdSchema,
      generate: cmdGenerate,
      tools: cmdTools,
      test: cmdTest,
      eval: cmdEval,
      qualityGate: cmdQualityGate,
      harnessReview: cmdHarnessReview,
      harnessRefine: cmdHarnessRefine,
      serve: cmdServe,
      dataPlan: cmdDataPlan,
      sourceIntegrationPlan: cmdSourceIntegrationPlan,
      snowfakeryRecipe: cmdSnowfakeryRecipe,
      mcp: cmdMcp,
      deploy: cmdDeploy,
      deployStatus: cmdDeployStatus,
      verifyLive: cmdVerifyLive,
      register: cmdRegister,
      publish: cmdPublish,
      reset: cmdReset,
      planData: cmdPlanData,
      fromUseCase: cmdFromUseCase,
      batchAudit: cmdBatchAudit,
    },
  });
  const wantsHelp = argv.some((a) => a === "--help" || a === "-h");
  const firstCmd = argv.find((a) => !a.startsWith("-"));
  // Curated top-level help for a bare or unknown invocation (keeps the worked
  // examples below). Everything else goes through citty's own main: command
  // routing, per-command `--help`/usage rendering, and `--version`. citty runs a
  // command's `run` AFTER any matched subcommand, so the root command must have
  // no `run` — hence handling bare/unknown here instead of as a root run().
  if (!wantsHelp && (!firstCmd || !tree[firstCmd])) {
    printHelp();
    return;
  }
  const cli = defineCommand({
    meta: {
      name: "factory",
      version: "5.0",
      description: "Gemini Enterprise agent factory — generate, validate, deploy, and register GE agents",
    },
    subCommands: tree,
  });
  await runMain(cli, { rawArgs: argv });
}

// Pure build-time helpers exported for unit tests. Importing this module must NOT
// execute the CLI (the guard below ensures main() only runs when invoked directly).
export const __test = {
  deriveAgentWorkflow,
  canonicalIntentToolName,
  buildStepInstruction,
  sharedAgentGuardrails,
  bigQueryType,
  bigQueryNumericType,
  deriveColumnsForEntity,
  matchEntityColumnSchema,
  deriveSchemaFromGenerationSpec,
  deriveSchemaFromUseCase,
};

// Run the CLI only when this file is the process entry point. When imported by a
// test (or another module), the import side-effect is just the exports above.
const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
