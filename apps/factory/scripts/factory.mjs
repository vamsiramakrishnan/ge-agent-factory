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
 *   factory quickstart --dir <workspace-dir> [--name <name> --domain <domain>]  (init->schema->generate->tools->test, zero flags required)
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
import { defineCommand, runMain } from "citty";
import { faker } from "@faker-js/faker";
import { extractFirstJsonObject } from "@ge/std/json-repair";
import { toCsv } from "@ge/std/csv-io";
import { buildFactoryCommandTree } from "./factory/registry.mjs";
import { renderToolsPy } from "./factory/tools/render-tools-py.mjs";
import { renderAgentPy } from "./factory/agents/render-agent-py.mjs";
import { writeOkfArtifacts } from "./factory/agents/okf-artifacts.mjs";
import { renderAgentsCliEvalSet, renderEvalConfig, renderGoldenEvals, renderOptimizationConfig } from "./factory/evals/render-eval-artifacts.mjs";
import { ensureAgentsCliPyprojectMetadata } from "./factory/runtime/agents-cli-metadata.mjs";
import { bigQueryNumericType, bigQuerySafeName, bigQueryType } from "./factory/data/bigquery-types.mjs";
import { buildCloudDataArtifacts } from "./factory/data/build-cloud-data-artifacts.mjs";
import { deriveColumnsForEntity, matchEntityColumnSchema } from "./factory/use-case/entity-column-schemas.mjs";
import { deriveSchemaFromGenerationSpec } from "./factory/use-case/schema-from-generation-spec.mjs";
import { deriveSchemaFromUseCase } from "./factory/use-case/schema-derivation.mjs";
import { harnessRefineSchema, harnessReviewSchema } from "./schemas/harness-schemas.mjs";
import { runHarnessTask } from "../src/harness-runner.js";
import { buildHarnessRefinePrompt, buildHarnessRunSummary, buildHarnessWorkItem, writeHarnessWorkItem } from "../src/harness-work-item.js";
import { canonicalSystemId, safePyName, snakeCase, titleCase, validPythonIdentifierName } from "@ge/std/naming";
import { CONTRACT_INTENT_KINDS, ensureContractQueryTables } from "./factory/core/contract-schema.mjs";
import { buildSourceIntegrationPlan } from "./factory/integration/source-integration.mjs";
import { pyEscape, pyTripleEscape } from "./factory/tools/py-emit.mjs";
import { canonicalIntentToolName, tableToolName } from "./factory/tools/tool-naming.mjs";
import { buildStepInstruction, deriveAgentWorkflow, sharedAgentGuardrails } from "./factory/agents/agent-workflow-derivation.mjs";
import { buildSemanticModel } from "./factory/data/semantic-model.mjs";
import { applyScenarioBindings } from "./factory/packs/index.mjs";
import { analyzePackCoverage } from "./factory/packs/coverage.mjs";
import { getUseCases } from "../src/use-cases.js";
import { readPromotionGate } from "../src/promotion-packet.js";
import { DOMAIN_CATALOG, DOMAIN_SUMMARY } from "../src/domains.generated.js";
import { APP_ROOT, GENERATOR_DATA_ROOT } from "../src/state-paths.js";
import { DEFAULT_AGENT_MODEL, assertKnownModel } from "../src/known-models.js";
import { sourceTimestamp } from "../src/source-clock.js";
import { cmdHarnessReview as harnessCmdReview, cmdHarnessRefine as harnessCmdRefine } from "./factory/harness/harness.mjs";
import { cmdMcp as lifecycleCmdMcp, cmdDeploy as lifecycleCmdDeploy, cmdDeployStatus as lifecycleCmdDeployStatus, cmdVerifyLive as lifecycleCmdVerifyLive, cmdRegister as lifecycleCmdRegister, cmdPublish as lifecycleCmdPublish } from "./factory/lifecycle/deploy.mjs";

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

// With { recursive: true } mkdir only rejects on real fs errors (EACCES, ENOSPC,
// a file where a directory should be) — never on "already exists". Warn instead
// of swallowing so those failures are diagnosable; the follow-up write still
// fails loudly on its own.
const warnMkdirFailure = (path) => (error) => {
  console.warn(`[factory] could not create directory ${path} — ${error?.message || String(error)}`);
};

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true }).catch(warnMkdirFailure(dirname(path)));
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function writeText(path, data) {
  await mkdir(dirname(path), { recursive: true }).catch(warnMkdirFailure(dirname(path)));
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

// Thrown by fail() (and requireStep()) instead of exiting the process. A thrown
// error unwinds exactly like process.exit(1) did (immediately, past every call
// site — no call-site edits needed since `fail(msg);` and `return fail(msg);`
// behave identically once fail throws), EXCEPT that a JS exception, unlike
// process.exit, DOES unwind through any enclosing try/catch. Every existing
// try/catch in this file has been audited for that difference (see registry.mjs
// dispatch boundary + the from-usecase catch-guard below); this is intentional,
// not a gap.
class FactoryCommandError extends Error {}

// Returns the same shape ok() used to print, so a bare `ok(data);` statement
// (now a no-op — see below) doesn't change behavior for internal callers that
// only rely on the function's own `return summary;`, while `return ok(data);`
// gives the registry's render boundary a value to print/render.
function ok(data) { return { ok: true, ...data }; }
// Throws instead of exiting so composed in-process command calls (from-usecase,
// batch-audit, quality-gate) can catch/aggregate failures instead of killing the
// whole process. The registry's dispatch boundary renders the JSON/human error
// and sets process.exitCode = 1 (not process.exit) so this matches the old
// exit-code contract without bypassing citty's own cleanup/promise chain.
function fail(msg) { throw new FactoryCommandError(msg); }

function requireStep(pipeline, step) {
  if (!pipeline.steps[step] || pipeline.steps[step].status !== "done") {
    fail(`Step "${step}" has not been completed yet. Run "factory ${step}" first.`);
  }
}

// STEPS entries are camelCase pipeline-state keys; the CLI subcommand for a
// few of them is kebab-case and/or spelled differently (harnessReview →
// harness-review, sourceIntegration → source-integration-plan). Anything not
// listed here has an identical CLI name (init, schema, generate, tools, test,
// serve, deploy, register, publish).
const STEP_CLI_COMMAND = {
  harnessReview: "harness-review",
  harnessRefine: "harness-refine",
  sourceIntegration: "source-integration-plan",
};

// Cloud steps (deploy/register/publish) need operator-supplied values (GCP
// project, Gemini Enterprise app id, ...) this function can't infer from the
// workspace alone, so the suggested command carries a placeholder — same
// convention already used by cmdRegister's own nextStep/nextCommand and by
// cmdFromUseCase's nextSteps list.
const STEP_CLI_PLACEHOLDER_ARGS = {
  deploy: "--project <gcp-project> --region <region>",
  register: "--as adk|mcp|a2a",
  publish: "--app-id <GEMINI_ENTERPRISE_APP_ID>",
};

// Pure: "what's the next command a human should run" derived from the SAME
// pipeline.steps state markStep/requireStep already track, walking the SAME
// STEPS sequence and using the SAME "blocks progress" rule cmdStatus already
// uses for its own nextStep (a step only blocks if it's missing/"pending" or
// explicitly "failed" — any other status, e.g. tools' terminal "done", or
// test's "created" when --run false skipped actually executing pytest, or
// deploy's transitional "running", means the pipeline has moved past it).
// Centralized here so every cmd* function below can attach a consistent
// nextCommand field to its return value instead of each one reimplementing
// (or omitting, or subtly diverging from cmdStatus's own notion of "next").
function nextCommandFor(pipeline, dir) {
  const nextStep = STEPS.find((step) => {
    const status = pipeline.steps?.[step]?.status || "pending";
    return status === "pending" || status === "failed";
  }) || null;
  if (!nextStep) return null;
  const cliName = STEP_CLI_COMMAND[nextStep] || nextStep;
  const placeholder = STEP_CLI_PLACEHOLDER_ARGS[nextStep];
  return `factory ${cliName} --dir ${dir}${placeholder ? ` ${placeholder}` : ""}`;
}

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

// ── COMMANDS ─────────────────────────────────────────────────

// Canonical short domain list for the coarse `factory init --domain` field —
// the department keys used across DOMAIN_DOC_SETS/DOMAIN_SUMMARY (not the 46
// fine-grained DOMAIN_CATALOG entries, which are a different, finer axis).
const INIT_DOMAIN_CHOICES = ["general", ...Object.keys(DOMAIN_SUMMARY)];

// Pure: does this invocation need to prompt at all? Never true unless BOTH
// `name` and `domain` are absent from flags AND we're at a real interactive
// TTY. Any flag already supplied, or a non-TTY stream (CI, scripts, pipes),
// skips prompting entirely — zero behavior change for scripted/CI usage.
function shouldPromptForInit(flags, { isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY) } = {}) {
  if (!isTTY) return false;
  if (flags?.yes || flags?.["non-interactive"]) return false;
  return !flags?.name || !flags?.domain;
}

// Pure: what's already provided vs. what's missing, and the exact fallback
// values `cmdInit` would use today. Isolates the "flags vs defaults" logic so
// it's unit-testable without touching @clack/prompts.
function resolveInitPromptPlan(dir, flags) {
  return {
    needsName: !flags?.name,
    needsDomain: !flags?.domain,
    nameDefault: flags?.name || basename(dir),
    domainDefault: flags?.domain || "general",
    domainChoices: INIT_DOMAIN_CHOICES,
  };
}

// Interactive boundary: the only place that touches @clack/prompts. Prompts
// ONLY for fields resolveInitPromptPlan marked missing; anything already on
// `flags` is used as-is. Cancels (Ctrl+C) exit cleanly, matching clack's
// documented isCancel() pattern.
async function promptForMissingInit(dir, flags) {
  const plan = resolveInitPromptPlan(dir, flags);
  if (!plan.needsName && !plan.needsDomain) return { name: plan.nameDefault, domain: plan.domainDefault };

  const clack = await import("@clack/prompts");
  clack.intro("factory init");

  let name = flags?.name;
  if (plan.needsName) {
    name = await clack.text({
      message: "Agent name",
      placeholder: plan.nameDefault,
      defaultValue: plan.nameDefault,
    });
    if (clack.isCancel(name)) {
      clack.cancel("Cancelled.");
      process.exit(1);
    }
  }

  let domain = flags?.domain;
  if (plan.needsDomain) {
    domain = await clack.select({
      message: "Domain",
      options: plan.domainChoices.map((value) => ({ value, label: value })),
      initialValue: plan.domainDefault,
    });
    if (clack.isCancel(domain)) {
      clack.cancel("Cancelled.");
      process.exit(1);
    }
  }

  clack.outro(`Scaffolding ${name || plan.nameDefault} (${domain || plan.domainDefault})`);
  return { name: name || plan.nameDefault, domain: domain || plan.domainDefault };
}

async function cmdInit(dir, flags) {
  let name = flags.name || basename(dir);
  let domain = flags.domain || "general";
  if (shouldPromptForInit(flags)) {
    const answers = await promptForMissingInit(dir, flags);
    name = answers.name;
    domain = answers.domain;
  }
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
  return ok({ step: "init", name, domain, dir, schemaPath: schemaPath(dir), nextCommand: nextCommandFor(pipeline, dir) });
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
    return ok({ step: "schema", action: "add-table", table: tableDef.name, analysis, totalTables: schema.tables.length, nextCommand: nextCommandFor(pipeline, dir) });
  }

  if (flags["from-file"]) {
    const imported = JSON.parse(await readFile(flags["from-file"], "utf8"));
    if (imported.tables) schema.tables = imported.tables;
    if (imported.seed) schema.seed = imported.seed;
    if (imported.domain) schema.domain = imported.domain;
    await writeJson(schemaPath(dir), schema);
    markStep(pipeline, "schema", "done", { tables: schema.tables.length });
    await savePipeline(dir, pipeline);
    return ok({ step: "schema", action: "import", tables: schema.tables.length, nextCommand: nextCommandFor(pipeline, dir) });
  }

  const analysis = schema.tables.map(classifyTable);
  return ok({ step: "schema", tables: analysis, totalTables: schema.tables.length, schemaPath: schemaPath(dir), nextCommand: nextCommandFor(pipeline, dir) });
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
  return ok({ step: "generate", tables: manifestTables.map((t) => ({ name: t.name, rows: t.rowCount })), totalRows: manifest.totalRows, manifest: manifestPath(dir), nextCommand: nextCommandFor(pipeline, dir) });
}

// ── Behavior-contract codegen helpers ─────────────────────────
//
// The behavior contract on the use case spec is what makes the generated ADK
// agent task-specific instead of a hello/list/query shell. These helpers turn
// each ToolIntentSpec into a Python function and shape the agent instruction
// from the contract's role, scope, evidence, and escalation rules.

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

  const { source: toolsSource, contractToolFunctionNames } = renderToolsPy({
    manifest, tables, contractIntents, emittedContractIntents, pipeline,
  });

  await mkdir(dirname(outPath), { recursive: true }).catch(warnMkdirFailure(dirname(outPath)));
  await writeFile(outPath, toolsSource, "utf8");

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
    // Derive the agent topology from the upstream pipeline / explicit workflow.
    // topology === "single" emits byte-identical output to the legacy single-agent
    // path (default, must never regress). sequential/parallel emit a workflow of
    // sub-agents, each scoped to its stage's tools.
    const workflow = deriveAgentWorkflow({ behaviorContract, architecture: manifest?.useCaseSpec?.architecture, manifest });

    await writeFile(agentPath, renderAgentPy({ manifest, behaviorContract, instruction, qualityPlan, workflow, agentModel: AGENT_MODEL }), "utf8");

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

  const goldenEvals = renderGoldenEvals(behaviorContract, manifest, GENERATED_AT);
  const agentsCliEvalSet = renderAgentsCliEvalSet(behaviorContract, manifest);
  let goldenPath = null;
  if (goldenEvals) {
    goldenPath = join(dir, "evals", "golden.json");
    await mkdir(join(dir, "evals"), { recursive: true }).catch(warnMkdirFailure(join(dir, "evals")));
    await writeJson(goldenPath, goldenEvals);
  }
  let agentsCliEvalSetPath = null;
  if (agentsCliEvalSet) {
    agentsCliEvalSetPath = join(dir, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json");
    await mkdir(join(dir, "tests", "eval", "evalsets"), { recursive: true }).catch(warnMkdirFailure(join(dir, "tests", "eval", "evalsets")));
    await writeJson(agentsCliEvalSetPath, agentsCliEvalSet);
    // eval_config.json so `agents-cli eval run` uses achievable criteria
    // instead of the default response_match (which needs a reference answer).
    await writeJson(join(dir, "tests", "eval", "eval_config.json"), renderEvalConfig(behaviorContract));
    await writeJson(join(dir, "tests", "eval", "optimization_config.json"), renderOptimizationConfig(behaviorContract));
  }

  const okfBundleDir = await writeOkfArtifacts({ dir, manifest, behaviorContract, generatedAt: GENERATED_AT });

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
  return ok({
    step: "tools",
    output: outPath,
    functions: fns,
    behaviorContract: behaviorContract ? "present" : "missing",
    contractTools: contractToolFunctionNames,
    goldenEvalsPath: goldenPath,
    agentsCliEvalSetPath,
    okfKnowledgeBundle: okfBundleDir,
    agentGenerated: !existsSync(agentPath) || true,
    nextCommand: nextCommandFor(pipeline, dir),
  });
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

  await mkdir(dirname(testPath), { recursive: true }).catch(warnMkdirFailure(dirname(testPath)));
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
  return ok({ step: "test", output: testPath, tests: tables.length * 2 + 2, ...testResult, nextCommand: nextCommandFor(pipeline, dir) });
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
    await mkdir(join(dir, "tests", "eval", "evalsets"), { recursive: true }).catch(warnMkdirFailure(join(dir, "tests", "eval", "evalsets")));
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
  return ok({ step: "eval", ...evalResult, nextCommand: nextCommandFor(pipeline, dir) });
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
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch(warnMkdirFailure(join(dir, "artifacts")));

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
    return ok({ step: "quality-gate", ...report, nextCommand: nextCommandFor(pipeline, dir) });
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
//
// cmdHarnessReview/cmdHarnessRefine (and the helpers only they use —
// readWorkspaceReviewContext, applyHarnessReviewFeedback, refineSessionId,
// refineResumeOptions) now live in ./factory/harness/harness.mjs. This file
// still owns pipeline state I/O, the ok()/fail() contract, the harness-runner
// / harness-work-item bridges, the zod schemas, and the shared flag
// predicates below — injected into the extracted module as `deps`, matching
// the injection pattern already used for buildAgentQualityPlan elsewhere in
// this tree (not importing back up, which would create a cycle).

const harnessDeps = () => ({
  readJson, manifestPath, fail, ok, mkdir, writeText, writeJson,
  loadPipeline, savePipeline, markStep, nextCommandFor,
  runHarnessTask, REPO_ROOT, HARNESS_DATA_ROOT,
  harnessReviewSchema, harnessRefineSchema,
  wantsVertex, truthyFlag, envOff,
  harnessResponseSchemaFile, reviewFanoutOptions,
  basename, GENERATED_AT,
  buildHarnessWorkItem, writeHarnessWorkItem, buildHarnessRefinePrompt, buildHarnessRunSummary,
});

async function cmdHarnessReview(dir, flags) {
  return harnessCmdReview(dir, flags, harnessDeps());
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
  // cmdPromotionGate is only ever invoked as a top-level command (never composed
  // internally by another cmd* function), so — unlike cmdHarnessReview/Refine —
  // there's no internal caller relying on the bare `gate` object; it's safe (and
  // needed, for the registry to have something to render) to return ok(...) here.
  if (gate.ok) return ok(base);
  if (truthyFlag(flags.force) || envOff("GE_ALLOW_UNPROMOTED")) {
    console.error(`⚠ promotion gate blocked but overridden (${gate.blockers.length} blocker(s))`);
    return ok({ ...base, overridden: true });
  }
  fail(`Promotion gate blocked (${gate.blockers.length} blocker(s)):\n${gate.blockers.map((b) => `  - ${b}`).join("\n")}`);
}

async function cmdHarnessRefine(dir, flags) {
  return harnessCmdRefine(dir, flags, harnessDeps());
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
//
// buildCloudDataArtifacts itself now lives in
// ./factory/data/build-cloud-data-artifacts.mjs — it's the file-writing
// orchestration around the pure derivers already extracted into
// ./factory/data/render-cloud-data-plan.mjs. Pipeline state I/O and the
// ok()/fail() contract are injected as `deps`.
async function cmdDataPlan(dir, flags) {
  const plan = await buildCloudDataArtifacts(dir, flags, {
    loadPipeline, requireStep, readJson, fail, mkdir, writeJson, writeText,
    savePipeline, manifestPath, fixturesDir, cloudDataDir, deployPlanPath,
    GENERATED_AT,
  });
  const integrationPlan = await buildSourceIntegrationPlan(dir, flags, { cloudPlan: plan });
  return ok({
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
  return ok({
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
  return ok({ step: "snowfakery-recipe", ...manifest });
}

// ── Cloud lifecycle (MCP tool-plane, deploy, register, publish) ──────────
//
// cmdMcp/cmdDeploy/cmdDeployStatus/cmdVerifyLive/cmdRegister/cmdPublish, and
// every gcloud/agents-cli helper only they use, now live in
// ./factory/lifecycle/deploy.mjs — a real seam: they're tightly coupled to
// EACH OTHER (register/publish/deploy-status all read
// deployment_metadata.json through the same parseAgentRuntimeId/
// hydrateDeployStepFromMetadata path) but only loosely coupled to the rest
// of this file's local pipeline commands. This file still owns pipeline
// state I/O, the ok()/fail() contract, runCommand, runLifecycleCommand,
// assertPromotable, and the resolved AGENT_MODEL — injected into the
// extracted module as `deps`, matching the injection pattern already used
// for buildAgentQualityPlan elsewhere in this tree.
const lifecycleDeps = () => ({
  readJson, writeJson, writeText, mkdir,
  loadPipeline, savePipeline, markStep, requireStep, nextCommandFor,
  fail, ok, runCommand, runLifecycleCommand, assertPromotable,
  manifestPath, GENERATED_AT, AGENT_MODEL,
  cmdSourceIntegrationPlan,
});

async function cmdMcp(dir, flags) {
  return lifecycleCmdMcp(dir, flags, lifecycleDeps());
}

async function cmdDeploy(dir, flags) {
  return lifecycleCmdDeploy(dir, flags, lifecycleDeps());
}

async function cmdDeployStatus(dir, flags) {
  return lifecycleCmdDeployStatus(dir, flags, lifecycleDeps());
}

async function cmdVerifyLive(dir, flags) {
  return lifecycleCmdVerifyLive(dir, flags, lifecycleDeps());
}

async function cmdRegister(dir, flags) {
  return lifecycleCmdRegister(dir, flags, lifecycleDeps());
}

async function cmdPublish(dir, flags) {
  return lifecycleCmdPublish(dir, flags, lifecycleDeps());
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

  return ok({
    name: pipeline.name,
    domain: pipeline.domain,
    pipeline: status,
    cloudDataPlan: pipeline.steps.cloudDataPlan || null,
    sourceIntegrationPlan: pipeline.steps.sourceIntegration || null,
    nextStep,
    nextCommand: nextCommandFor(pipeline, dir),
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
  return ok({ step: "reset", resetFrom: step, currentStep: pipeline.currentStep, nextCommand: nextCommandFor(pipeline, dir) });
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
  return ok({
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
  return ok({
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
          return ok({ step: "from-usecase", error: "ambiguous", matches: matches.slice(0, 10).map((u) => ({ id: u.id, title: u.title, department: u.department })) });
        } else fail(`Use case "${useCaseId}" not found. Use factory list-usecases to browse.`);
      }
    } catch (e) {
      // fail() now throws FactoryCommandError instead of process.exit(1)-ing, so
      // the "not found" fail() a few lines up (and any other fail() inside this
      // try) would otherwise land HERE and get re-wrapped as a misleading
      // "Could not load use case catalog: ..." message. Before this refactor that
      // could never happen (process.exit bypassed this catch entirely); guard by
      // re-throwing FactoryCommandError as-is and only wrapping genuine catalog
      // load/parse errors.
      if (e instanceof FactoryCommandError) throw e;
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
  const schema = deriveSchemaFromUseCase(useCase, rows, { buildAgentQualityPlan });
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
  const finalPipeline = await loadPipeline(targetDir);
  const nextSteps = [
    reviewResult.skipped ? `factory harness-review --dir ${targetDir} --vertex true --project <project> --location <location>` : null,
    refineResult.skipped ? `factory harness-refine --dir ${targetDir} --vertex true --project <project> --location <location>` : null,
    `factory serve --dir ${targetDir}`,
    `factory status --dir ${targetDir}`,
  ].filter(Boolean);
  return ok({
    step: "from-usecase",
    useCase: { id: useCase.id, title: useCase.title, department: useCase.department },
    dir: targetDir,
    tables: schema.tables.map((t) => ({ name: t.name, rows: t.rows, source: t._sourceSystem, columns: t.columns.length })),
    anomalies: schema.anomalies?.length || 0,
    harnessReview: reviewResult,
    harnessRefine: refineResult,
    nextSteps,
    // Singular convenience field alongside the richer nextSteps list above,
    // matching the nextCommand convention every other pipeline command carries
    // (derived the same way cmdStatus derives it — from pipeline.steps).
    nextCommand: nextSteps[0] || nextCommandFor(finalPipeline, targetDir),
  });
}

// ── Quickstart (zero-flag local pipeline: init → schema → generate → tools → test) ──
//
// A brand-new workspace, end to end, with nothing but --dir/--name/--domain.
// Composes cmd* functions in-process (same pattern cmdFromUseCase already
// uses to chain cmdInit → cmdGenerate → cmdTools → cmdTest) instead of
// shelling out to `factory <step>` subprocesses. Deliberately stops at `test`
// — deploy/register/publish stay explicit, opt-in, cloud-touching commands a
// human runs on purpose; quickstart never reaches for gcloud/agents-cli.
const QUICKSTART_DEFAULT_TABLE = {
  name: "records",
  rows: 25,
  // Without a source system, the generated query tool's smoke test (which
  // asserts source_system is set) fails on a workspace built with nothing
  // but --dir — every catalog-driven spec already has one; quickstart's
  // synthetic default table needs its own for the same reason.
  _sourceSystem: "Quickstart Demo Data",
  columns: [
    { name: "id", type: "seq", pattern: "REC-{n:4}" },
    { name: "name", type: "person.fullName" },
    { name: "status", type: "enum", values: ["open", "in_progress", "closed"] },
    { name: "created_at", type: "date", min: "2024-01-01", max: "2026-12-31" },
    { name: "notes", type: "lorem.sentence" },
  ],
};

async function cmdQuickstart(dir, flags) {
  const name = flags.name || basename(dir);
  const domain = flags.domain || "general";
  const runTests = flags["run-tests"] !== "false";

  console.error(`quickstart: building "${name}" (${domain}) in ${dir}`);

  // Step 1: init. Pass name/domain explicitly so this never engages the
  // interactive @clack/prompts wizard (shouldPromptForInit only fires when
  // BOTH are absent from flags) — quickstart is a one-shot, zero-prompt run
  // even at a real TTY.
  console.error("  [1/5] init...");
  const initResult = await cmdInit(dir, { name, domain });

  // Step 2: schema. Use whatever the caller supplied via --add-table, else a
  // minimal default table so a brand-new workspace has something to generate
  // fixtures from with zero required flags.
  console.error("  [2/5] schema...");
  const schemaResult = await cmdSchema(dir, { "add-table": flags["add-table"] || JSON.stringify(QUICKSTART_DEFAULT_TABLE) });

  // Step 3: generate fixtures.
  console.error("  [3/5] generate...");
  const generateResult = await cmdGenerate(dir, { seed: flags.seed, rows: flags.rows });

  // Step 4: tools + agent scaffold.
  console.error("  [4/5] tools...");
  const toolsResult = await cmdTools(dir, { "force-agent": flags["force-agent"] });

  // Step 5: smoke tests. Off by default reasons (uv/pytest unavailable, or a
  // caller that just wants the scaffold fast) are handled the same way
  // cmdFromUseCase already handles harness review/refine being skipped: a
  // { skipped: true, reason } stand-in instead of omitting the field.
  console.error("  [5/5] test...");
  const testResult = runTests
    ? await cmdTest(dir, {})
    : { skipped: true, reason: "Pass --run-tests true (the default) to generate + run tests, or omit --run-tests false." };

  const pipeline = await loadPipeline(dir);
  const nextCommand = nextCommandFor(pipeline, dir) || `factory serve --dir ${dir}`;
  console.error(`\nquickstart complete: ${name} (${domain}) is ready in ${dir}`);
  console.error(`Next: ${nextCommand}`);

  return ok({
    step: "quickstart",
    name,
    domain,
    dir,
    init: initResult,
    schema: schemaResult,
    generate: generateResult,
    tools: toolsResult,
    test: testResult,
    tables: schemaResult.totalTables ?? schemaResult.tables?.length ?? null,
    totalRows: generateResult.totalRows ?? null,
    functions: toolsResult.functions ?? null,
    nextCommand,
  });
}

async function cmdPackCoverage(flags) {
  const report = analyzePackCoverage(getUseCases(), DOMAIN_CATALOG);
  if (flags.out) {
    await writeJson(resolve(flags.out), report);
  }
  return ok({
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
      const schema = deriveSchemaFromUseCase(useCase, rows, { buildAgentQualityPlan });
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
  return ok({
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
    return ok({
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

Quickstart:
  quickstart Zero-flag local pipeline: init → schema → generate → tools → test
                                              [--dir <dir> --name <n> --domain <d>] [--run-tests false]

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
  factory quickstart --dir ./hr-agent --name hr-demo --domain hr
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
      quickstart: cmdQuickstart,
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
  // Bind the injected dependency so the test-facing signature stays (useCase, rows).
  deriveSchemaFromUseCase: (useCase, defaultRows) => deriveSchemaFromUseCase(useCase, defaultRows, { buildAgentQualityPlan }),
  shouldPromptForInit,
  resolveInitPromptPlan,
  INIT_DOMAIN_CHOICES,
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
