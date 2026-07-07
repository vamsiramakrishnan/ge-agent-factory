import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { getUseCases } from "./use-cases.js";
import { DEFAULT_AGENT_MODEL } from "./known-models.js";
import { ARTIFACT_PATHS, DATA_PATHS, WORKSPACE_PATHS } from "./workspace-contract.js";
import { runAdkPreviewForWorkspace } from "./adk-preview.js";
import { slug as baseSlug } from "@ge/std/naming";
import { boolFlag } from "@ge/std/cli-args";
import { resolveGcpProject } from "@ge/std/gcp-config";

const FACTORY_STAGES = [
  "planned",
  "created",
  "validated",
  "harness_reviewed",
  "harness_refined",
  "data_packaged",
  "previewed",
  "deploy_planned",
  "deploying",
  "deployed",
  "registered",
  "publish_planned",
  "published",
];
const DEFAULT_WEB_URL = process.env.GE_HARNESS_WEB_URL || "http://localhost:17655";

// boolFlag imported from @ge/std/cli-args

const slug = (value, max = 72) => baseSlug(value, { max });

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stageIndex(stage) {
  const idx = FACTORY_STAGES.indexOf(stage);
  return idx >= 0 ? idx : 0;
}

function safeCloudName(value, fallback = "ge_mock", max = 63) {
  const normalized = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (normalized || fallback).slice(0, max).replace(/-+$/g, "") || fallback;
}

function safeSqlName(value, fallback = "ge_mock", max = 63) {
  const normalized = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return (normalized || fallback).slice(0, max).replace(/_+$/g, "") || fallback;
}

function resolveCloudTopology(options = {}) {
  const project = resolveGcpProject({ explicit: options.project || options["gcp-project"] }) || "<GCP_PROJECT>";
  const cloudLocation = options["cloud-location"] || process.env.GOOGLE_CLOUD_LOCATION || "global";
  const genaiLocation = options["genai-location"] || process.env.GOOGLE_GENAI_LOCATION || cloudLocation || "global";
  const geminiEnterpriseLocation = options["gemini-enterprise-location"] || process.env.GEMINI_ENTERPRISE_LOCATION || "global";
  const runtimeRegion = options["runtime-region"] || options["agent-runtime-region"] || options.region || process.env.GE_AGENT_RUNTIME_REGION || (cloudLocation === "global" ? "us-central1" : cloudLocation) || "us-central1";
  const dataRegion = options["data-region"] || (runtimeRegion === "global" ? "us-central1" : runtimeRegion);
  const bigQueryLocation = options["bq-location"] || (dataRegion.startsWith("us-") ? "US" : dataRegion);
  const environment = safeCloudName(options.environment || options.env || "dev", "dev", 24);
  const prefix = safeCloudName(options.prefix || "factory", "factory", 24);
  const projectToken = project.includes("<") ? "project" : safeCloudName(project, "project", 24);
  const namespace = safeCloudName(`${prefix}-${environment}`, "factory", 32);

  return {
    mode: "single_project_shared_services",
    project,
    environment,
    cloudLocation,
    runtimeRegion,
    genaiLocation,
    geminiEnterpriseLocation,
    agentLocation: runtimeRegion,
    dataRegion,
    bigQueryLocation,
    naming: {
      namespace,
      perWorkspaceIsolation: "database_or_dataset_or_collection_prefix",
    },
    services: {
      alloydb: {
        scope: "shared_cluster_instance_per_project_environment",
        cluster: safeCloudName(`${namespace}-alloydb`, "factory-alloydb", 40),
        instance: safeCloudName(`${namespace}-primary`, "factory-primary", 40),
        databasePattern: "ge_<workspace_id>",
        reason: "One shared AlloyDB cluster/instance keeps cost and operations sane; each generated agent gets an isolated PostgreSQL database.",
      },
      firestore: {
        scope: "shared_database_per_project_environment",
        database: "(default)",
        collectionPrefixPattern: "ge_mock/<workspace_id>/collections/<collection>",
        reason: "Firestore works best as a shared project database with collection/document namespace isolation for generated mocks.",
      },
      bigtable: {
        scope: "shared_instance_table_per_project_environment",
        instance: safeCloudName(`${namespace}-events`, "factory-events", 30),
        table: "ge_mock_events",
        rowKeyPattern: "<workspace_id>#<source>#<entity>#<timestamp>#<id>",
        reason: "High-volume event/time-series mocks share a Bigtable instance/table and isolate by row-key prefix.",
      },
      bigquery: {
        scope: "dataset_per_workspace_or_domain",
        datasetPattern: "ge_<department>_<workspace_id>",
        location: bigQueryLocation,
        reason: "BigQuery datasets are cheap isolation boundaries for schema, IAM, lifecycle, and cleanup.",
      },
      gcs: {
        scope: "shared_bucket_prefix_per_workspace",
        bucket: options.bucket || `${projectToken}-factory-data`,
        prefixPattern: "factory/<environment>/<workspace_id>",
        reason: "A shared bucket with per-workspace prefixes avoids bucket sprawl while keeping artifacts portable.",
      },
    },
  };
}

function workspaceCloudTargets(item, topology) {
  const workspaceId = item.workspaceId || item.workspaceName;
  const workspaceToken = safeCloudName(workspaceId, "workspace", 48);
  const department = safeSqlName(item.department || "dept", "dept", 20);
  return {
    workspaceId,
    project: topology.project,
    runtimeRegion: topology.runtimeRegion || topology.agentLocation,
    genaiLocation: topology.genaiLocation || topology.agentLocation,
    geminiEnterpriseLocation: topology.geminiEnterpriseLocation || "global",
    agentLocation: topology.runtimeRegion || topology.agentLocation,
    dataRegion: topology.dataRegion,
    bigQueryLocation: topology.bigQueryLocation,
    alloydb: {
      cluster: topology.services.alloydb.cluster,
      instance: topology.services.alloydb.instance,
      database: safeSqlName(`ge_${workspaceToken}`, "ge_workspace", 63),
    },
    firestore: {
      database: topology.services.firestore.database,
      collectionPrefix: `ge_mock/${workspaceToken}/collections`,
    },
    bigtable: {
      instance: topology.services.bigtable.instance,
      table: topology.services.bigtable.table,
      rowKeyPrefix: `${workspaceToken}#`,
    },
    bigquery: {
      dataset: safeSqlName(`ge_${department}_${workspaceToken}`, "ge_mock", 1024),
      location: topology.bigQueryLocation,
    },
    gcs: {
      bucket: topology.services.gcs.bucket,
      prefix: `factory/${topology.environment}/${workspaceToken}`,
    },
  };
}

export function inferDatastores(useCase) {
  const systems = Array.isArray(useCase.systems) ? useCase.systems : [];
  const haystack = [
    useCase.id,
    useCase.title,
    useCase.subtitle,
    useCase.persona,
    useCase.layer,
    useCase.triggerType,
    ...systems,
    ...(useCase.asIs || []),
    ...(useCase.toBe || []),
  ].join(" ").toLowerCase();

  const stores = [];
  const add = (id, kind, target, reason) => {
    if (!stores.some((item) => item.id === id)) stores.push({ id, kind, target, reason });
  };

  if (/(bigquery|warehouse|analytics|dashboard|report|forecast|prediction|model|benchmark|cohort|trend|kpi)/.test(haystack)) {
    add("analytics_warehouse", "olap", "bigquery", "Analytical facts, metrics, model outputs, and KPI trends.");
  }
  if (/(workday|sap|adp|erp|hris|finance system|benefits platform|ats|servicenow|salesforce|contract|invoice|enrollment|approval|ticket|case|transaction|payroll)/.test(haystack)) {
    add("operational_records", "oltp_sql", "alloydb", "Transactional source-system records and workflow state.");
  }
  if (/(chat|slack|gmail|calendar|google chat|notification|message|conversation|intranet|portal)/.test(haystack)) {
    add("collaboration_events", "document", "firestore", "Conversation, notification, and collaboration events.");
  }
  if (/(knowledge|policy|document|pdf|docx|guide|manual|sop|contract|resume|scorecard|communication|draft|q&a|assistant)/.test(haystack)) {
    add("knowledge_blobs", "unstructured", "gcs_discovery_engine", "Documents, generated drafts, policies, and searchable knowledge artifacts.");
  }
  if (/(bigtable|telemetry|time series|event stream|clickstream|logs)/.test(haystack)) {
    add("wide_event_store", "wide_column", "bigtable", "High-volume event or telemetry style data.");
  }

  if (!stores.length) {
    add("operational_records", "oltp_sql", "alloydb", "Default source-system records.");
    add("knowledge_blobs", "unstructured", "gcs_discovery_engine", "Default evidence documents.");
  }
  return stores;
}

export function resolveRows(useCase, options = {}) {
  const raw = String(options.rows || "auto").toLowerCase();
  if (raw !== "auto") {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 1) throw new Error(`Invalid --rows value: ${options.rows}`);
    return { rows: Math.floor(parsed), reason: "manual override" };
  }

  const stores = inferDatastores(useCase);
  let rows = 40;
  let reason = "workflow default";
  if (stores.some((store) => store.kind === "olap")) {
    rows = 150;
    reason = "analytics/OLAP workload";
  } else if (stores.some((store) => store.kind === "oltp_sql")) {
    rows = 80;
    reason = "transactional workflow";
  } else if (stores.some((store) => store.kind === "unstructured" || store.kind === "document")) {
    rows = 48;
    reason = "chat/document workflow";
  }

  const systemCount = Array.isArray(useCase.systems) ? useCase.systems.length : 0;
  if (systemCount >= 5) rows = Math.max(rows, 100);
  if (systemCount <= 2) rows = Math.min(rows, 60);

  const scale = Number(options["row-scale"] || 1);
  if (!Number.isFinite(scale) || scale <= 0) throw new Error(`Invalid --row-scale value: ${options["row-scale"]}`);
  const minRows = Number(options["min-rows"] || 24);
  const maxRows = Number(options["max-rows"] || 300);
  rows = Math.round(rows * scale);
  rows = Math.max(minRows, Math.min(maxRows, rows));
  return { rows, reason };
}

export function selectFactoryUseCases(options = {}) {
  let selected = getUseCases();
  if (options.usecases) {
    const wanted = new Set(splitList(options.usecases));
    selected = selected.filter((item) => wanted.has(item.id) || wanted.has(item.title));
    const missing = [...wanted].filter((id) => !selected.some((item) => item.id === id || item.title === id));
    if (missing.length) throw new Error(`Unknown use case(s): ${missing.join(", ")}`);
  }
  if (options.department && options.department !== "all") {
    const departments = new Set(splitList(options.department));
    selected = selected.filter((item) => departments.has(item.department));
  }
  if (options.domain && options.domain !== "all") {
    const domains = new Set(splitList(options.domain));
    selected = selected.filter((item) => domains.has(item.domainId));
  }
  const offset = Number(options.offset || 0);
  const limit = options.limit === "all" ? selected.length : Number(options.limit || selected.length);
  return selected.slice(offset, offset + limit);
}

export async function createFactoryPlan({ repoRoot, dataRoot, options = {} }) {
  const useCases = selectFactoryUseCases(options);
  const prefix = options.prefix || "factory";
  const targetStage = options.target || "deploy_planned";
  const generatedAt = new Date().toISOString();
  const workItems = useCases.map((useCase, index) => {
    const rowDecision = resolveRows(useCase, options);
    const workspaceName = slug(`${prefix}-${useCase.department}-${useCase.id}`);
    return {
      id: `${slug(useCase.department, 16)}-${slug(useCase.domainId || "domain", 24)}-${slug(useCase.id, 64)}`,
      status: "planned",
      targetStage,
      attempts: 0,
      useCaseId: useCase.id,
      title: useCase.title,
      department: useCase.department,
      domainId: useCase.domainId || null,
      persona: useCase.persona || null,
      triggerType: useCase.triggerType || null,
      systems: useCase.systems || [],
      workspaceName,
      workspaceId: null,
      rows: rowDecision.rows,
      rowReason: rowDecision.reason,
      seed: Number(options.seed || 101) + index,
      datastores: inferDatastores(useCase),
      artifacts: {},
      error: null,
    };
  });

  const plan = {
    kind: "ge.agent_factory.plan",
    version: 1,
    generatedAt,
    targetStage,
    options: {
      department: options.department || "all",
      domain: options.domain || "all",
      rows: options.rows || "auto",
      rowScale: Number(options["row-scale"] || 1),
      minRows: Number(options["min-rows"] || 24),
      maxRows: Number(options["max-rows"] || 300),
      seed: Number(options.seed || 101),
      prefix,
    },
    cloudTopology: resolveCloudTopology(options),
    totals: {
      workItems: workItems.length,
      departments: new Set(workItems.map((item) => item.department)).size,
      domains: new Set(workItems.map((item) => item.domainId).filter(Boolean)).size,
    },
    workItems,
  };

  const factoryDir = resolve(options.factoryDir || dataRoot);
  const planPath = join(factoryDir, options.output || "factory-plan.json");
  const mdPath = join(factoryDir, options.markdown || "FACTORY_PLAN.md");
  await mkdir(factoryDir, { recursive: true });
  await writeJson(planPath, plan);
  await writeText(mdPath, renderFactoryPlanMarkdown(plan));
  return { plan, planPath, mdPath };
}

export async function loadFactoryPlan(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeText(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data, "utf8");
}

function renderFactoryPlanMarkdown(plan) {
  const lines = [
    "# GE Agent Factory Plan",
    "",
    `Generated: ${plan.generatedAt}`,
    `Target stage: ${plan.targetStage}`,
    `Work items: ${plan.totals.workItems}`,
    `Departments: ${plan.totals.departments}`,
    `Domains: ${plan.totals.domains}`,
    "",
    "| Workspace | Department | Domain | Rows | Datastores | Use case |",
    "| --- | --- | --- | ---: | --- | --- |",
  ];
  for (const item of plan.workItems) {
    lines.push([
      item.workspaceName,
      item.department,
      item.domainId || "-",
      item.rows,
      item.datastores.map((store) => `${store.kind}:${store.target}`).join("<br>"),
      item.title,
    ].map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | "));
  }
  return `${lines.join("\n")}\n`;
}

function parseJsonObjects(stdout) {
  const text = String(stdout || "").trim();
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (start < 0) {
      if (ch === "{") {
        start = i;
        depth = 1;
      }
      continue;
    }
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          objects.push(JSON.parse(text.slice(start, i + 1)));
        } catch {
          // Ignore log braces.
        }
        start = -1;
      }
    }
  }
  if (!objects.length) throw new Error(`Command did not emit JSON: ${text.slice(-800)}`);
  return objects[objects.length - 1];
}

function runCli(repoRoot, args, { verbose = false } = {}) {
  const result = spawnSync(process.execPath, ["src/cli.js", ...args], {
    cwd: repoRoot,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 30 * 1024 * 1024,
  });
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  if (verbose && stdout) process.stdout.write(stdout);
  if (verbose && stderr) process.stderr.write(stderr);
  if (result.error || result.status !== 0) {
    throw new Error(`node src/cli.js ${args.join(" ")} failed: ${result.error?.message || stderr || stdout}`);
  }
  return parseJsonObjects(stdout);
}

function runGeMock(repoRoot, args, { verbose = false } = {}) {
  const result = spawnSync(process.execPath, ["scripts/factory.mjs", ...args], {
    cwd: repoRoot,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 30 * 1024 * 1024,
  });
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  if (verbose && stdout) process.stdout.write(stdout);
  if (verbose && stderr) process.stderr.write(stderr);
  if (result.error || result.status !== 0) {
    throw new Error(`node scripts/factory.mjs ${args.join(" ")} failed: ${result.error?.message || stderr || stdout}`);
  }
  return parseJsonObjects(stdout);
}

async function runAdkPreview({ webUrl, workspaceId, prompt, timeoutMs = 120000 }) {
  const url = `${webUrl.replace(/\/+$/, "")}/api/workspaces/${encodeURIComponent(workspaceId)}/adk-run`;
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error(`ADK preview timed out after ${timeoutMs}ms at ${url}`);
    }
    throw error;
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`ADK preview endpoint did not return JSON (${response.status}). Is the web server running at ${webUrl}?\n${text.slice(0, 800)}`);
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || `ADK preview failed with ${response.status}`);
  return data.result;
}

function stageReached(item, stage) {
  return stageIndex(item.status) >= stageIndex(stage);
}

function formatFactoryEventLine(event) {
  if (event.type === "run_started") return `factory run: ${event.total} item(s) → ${event.targetStage}`;
  if (event.type === "item_started") return `${event.index}/${event.total} ${event.workspace || event.useCaseId}: started`;
  if (event.type === "stage_started") return `${event.index}/${event.total} ${event.workspace || event.useCaseId}: ${event.stage}…`;
  if (event.type === "stage_done") return `${event.index}/${event.total} ${event.workspace || event.useCaseId}: ${event.stage} done`;
  if (event.type === "item_done") return `${event.index}/${event.total} ${event.workspace || event.useCaseId}: ${event.status}`;
  if (event.type === "item_failed") return `${event.index}/${event.total} ${event.workspace || event.useCaseId}: failed ${event.error || ""}`.trim();
  if (event.type === "run_done") return `factory run: ${event.ok ? "done" : "blocked"} · ${event.failed || 0} failed`;
  return event.type || "factory event";
}

function createFactoryEventSink({ factoryDir, stream = false, onEvent = null } = {}) {
  const eventsPath = join(factoryDir, "factory-events.jsonl");
  return {
    eventsPath,
    async emit(event) {
      const record = { ts: new Date().toISOString(), ...event };
      await appendFile(eventsPath, `${JSON.stringify(record)}\n`, "utf8");
      if (stream) process.stderr.write(`${formatFactoryEventLine(record)}\n`);
      // Optional live mirror (e.g. into the run ledger). Never let it break a run.
      if (onEvent) { try { await onEvent(record); } catch { /* best-effort */ } }
    },
  };
}

export async function runFactoryPlan({ repoRoot, dataRoot, planPath, options = {} }) {
  const factoryDir = resolve(options.factoryDir || dataRoot);
  const projectsDir = resolve(options.projectsDir || join(dataRoot, "workspaces"));
  const resolvedPlanPath = resolve(planPath || join(factoryDir, "factory-plan.json"));
  if (!existsSync(resolvedPlanPath)) throw new Error(`Factory plan not found: ${resolvedPlanPath}`);

  const plan = await loadFactoryPlan(resolvedPlanPath);
  const targetStage = options.target || plan.targetStage || "deploy_planned";
  const verbose = boolFlag(options, "verbose", false);
  const stream = boolFlag(options, "stream", false);
  const continueOnError = boolFlag(options, "continue", false);
  const agentsCli = boolFlag(options, "agents-cli", false);
  const prompt = options.prompt || "hello";
  const previewTimeoutMs = Number(options["preview-timeout-ms"] || process.env.GE_PREVIEW_TIMEOUT_MS || 120000);
  const startedAt = new Date().toISOString();
  await mkdir(factoryDir, { recursive: true });
  const events = createFactoryEventSink({ factoryDir, stream, onEvent: options.onEvent || null });

  const results = [];
  await events.emit({ type: "run_started", targetStage, total: plan.workItems.length, planPath: resolvedPlanPath, startedAt });
  for (let index = 0; index < plan.workItems.length; index += 1) {
    const item = plan.workItems[index];
    const progress = { index: index + 1, total: plan.workItems.length, useCaseId: item.useCaseId, workspace: item.workspaceName };
    const result = { ...item, startedAt: new Date().toISOString() };
    await events.emit({ type: "item_started", ...progress });
    try {
      if (!stageReached(result, "created") && stageIndex(targetStage) >= stageIndex("created")) {
        await events.emit({ type: "stage_started", stage: "created", ...progress });
        const createArgs = [
          "create",
          "--usecase", item.useCaseId,
          "--name", item.workspaceName,
          "--domain", item.department,
          "--rows", String(item.rows),
          "--seed", String(item.seed),
        ];
        if (!agentsCli) createArgs.push("--no-agents-cli", "true");
        const created = runCli(repoRoot, createArgs, { verbose });
        result.workspaceId = created.workspace?.id || item.workspaceName;
        result.workspacePath = created.workspace?.path || null;
        result.status = "created";
        result.artifacts.workspace = WORKSPACE_PATHS.workspaceManifest;
        await events.emit({ type: "stage_done", stage: "created", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "validated") && stageIndex(targetStage) >= stageIndex("validated")) {
        await events.emit({ type: "stage_started", stage: "validated", workspaceId: result.workspaceId, ...progress });
        const validated = runCli(repoRoot, ["validate", result.workspaceId], { verbose });
        result.status = "validated";
        result.validation = {
          ok: validated.ok === true,
          testExitCode: validated.testExitCode,
          summary: validated.summary,
        };
        result.artifacts.validation = ARTIFACT_PATHS.validationReport;
        await events.emit({ type: "stage_done", stage: "validated", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "harness_reviewed") && stageIndex(targetStage) >= stageIndex("harness_reviewed")) {
        await events.emit({ type: "stage_started", stage: "harness_reviewed", workspaceId: result.workspaceId, ...progress });
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const reviewArgs = ["harness-review", "--dir", workspaceDir];
        // Adapter + model resolve caller option → env (the centralized
        // GE_HARNESS_AGENT/GE_REFINEMENT_MODEL knobs) → the historical default,
        // so claude/codex/gemini can drive review without per-call flags.
        const provider = options["harness-provider"] || options.provider || process.env.GE_HARNESS_AGENT || "antigravity-sdk";
        if (provider) reviewArgs.push("--provider", provider);
        if (options.vertex) reviewArgs.push("--vertex", String(options.vertex));
        if (options.project || options["gcp-project"]) reviewArgs.push("--project", options.project || options["gcp-project"]);
        if (options.location || options.region) reviewArgs.push("--location", options.location || options.region);
        // Always pin the harness review model (default gemini-3.5-flash) so review runs
        // on the same model locally and remotely, even when no --model flag was passed.
        reviewArgs.push("--model", options.model || process.env.GE_REFINEMENT_MODEL || DEFAULT_AGENT_MODEL);
        const reviewed = runGeMock(repoRoot, reviewArgs, { verbose });
        result.status = "harness_reviewed";
        result.harnessReview = {
          ok: reviewed.step === "harness-review",
          provider: reviewed.provider,
          score: reviewed.score,
          okToPromote: reviewed.okToPromote,
          output: reviewed.output,
        };
        result.artifacts.harnessReview = reviewed.output || "artifacts/antigravity-sdk-harness-review.json";
        result.artifacts.generatorFeedback = ARTIFACT_PATHS.generatorFeedback;
        await events.emit({ type: "stage_done", stage: "harness_reviewed", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "harness_refined") && stageIndex(targetStage) >= stageIndex("harness_refined")) {
        await events.emit({ type: "stage_started", stage: "harness_refined", workspaceId: result.workspaceId, ...progress });
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const refineArgs = ["harness-refine", "--dir", workspaceDir];
        const provider = options["harness-provider"] || options.provider || process.env.GE_HARNESS_AGENT || "antigravity-sdk";
        if (provider) refineArgs.push("--provider", provider);
        if (options.vertex) refineArgs.push("--vertex", String(options.vertex));
        if (options.project || options["gcp-project"]) refineArgs.push("--project", options.project || options["gcp-project"]);
        if (options.location || options.region) refineArgs.push("--location", options.location || options.region);
        refineArgs.push("--model", options.model || process.env.GE_REFINEMENT_MODEL || DEFAULT_AGENT_MODEL);
        const refined = runGeMock(repoRoot, refineArgs, { verbose });
        result.status = "harness_refined";
        result.harnessRefine = {
          ok: refined.step === "harness-refine",
          provider: refined.provider,
          changedFiles: refined.changedFiles || [],
          output: refined.output,
        };
        result.artifacts.harnessRefine = refined.output || "artifacts/antigravity-sdk-harness-refine.json";
        await events.emit({ type: "stage_started", stage: "post_refine_validated", workspaceId: result.workspaceId, ...progress });
        const revalidated = runCli(repoRoot, ["validate", result.workspaceId], { verbose });
        result.validation = {
          ok: revalidated.ok === true,
          testExitCode: revalidated.testExitCode,
          summary: revalidated.summary,
          source: "post_harness_refine",
        };
        result.artifacts.validation = ARTIFACT_PATHS.validationReport;
        if (!result.validation.ok) throw new Error(`post-refine validation failed for ${result.workspaceId}`);
        await events.emit({ type: "stage_done", stage: "post_refine_validated", workspaceId: result.workspaceId, ...progress });
        await events.emit({ type: "stage_done", stage: "harness_refined", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "data_packaged") && stageIndex(targetStage) >= stageIndex("data_packaged")) {
        await events.emit({ type: "stage_started", stage: "data_packaged", workspaceId: result.workspaceId, ...progress });
        const topology = plan.cloudTopology || resolveCloudTopology(plan.options || {});
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const targets = workspaceCloudTargets(result, topology);
        const planData = runGeMock(repoRoot, [
          "plan-data",
          "--dir", workspaceDir,
          "--usecase", item.title || item.useCaseId,
          "--project", targets.project,
          "--location", topology.geminiEnterpriseLocation || topology.cloudLocation || "global",
        ], { verbose });
        runGeMock(repoRoot, ["snowfakery-recipe", "--dir", workspaceDir], { verbose });
        const cloudData = runGeMock(repoRoot, [
          "data-plan",
          "--dir", workspaceDir,
          "--project", targets.project,
          "--location", targets.bigQueryLocation,
          "--dataset", targets.bigquery.dataset,
          "--bucket", targets.gcs.bucket,
          "--prefix", targets.gcs.prefix,
        ], { verbose });
        await writeJson(join(workspaceDir, ARTIFACT_PATHS.cloudTopology), {
          generatedAt: new Date().toISOString(),
          topology,
          targets,
          policy: {
            projectBoundary: "all generated agents deploy into the same selected Google Cloud project",
            locationSeparation: "Agent Runtime uses runtimeRegion; Gemini model calls use genaiLocation; Gemini Enterprise registration uses geminiEnterpriseLocation.",
            alloyDbIsolation: "shared cluster and instance, database per generated workspace",
            firestoreIsolation: "shared database, collection prefix per generated workspace",
            bigtableIsolation: "shared instance/table, row-key prefix per generated workspace",
            bigQueryIsolation: "dataset per generated workspace",
            gcsIsolation: "shared bucket, object prefix per generated workspace",
          },
        });
        result.status = "data_packaged";
        result.dataPackage = {
          ok: true,
          topology: ARTIFACT_PATHS.cloudTopology,
          datastores: planData.datastores || [],
          cloudTarget: cloudData.target || null,
          targets,
        };
        result.artifacts.dataPlan = DATA_PATHS.dataPlan;
        result.artifacts.packageIndex = DATA_PATHS.packageIndex;
        result.artifacts.snowfakery = "mock_data/snowfakery/structured.recipe.yml";
        result.artifacts.cloudData = DATA_PATHS.cloudDataManifest;
        result.artifacts.cloudTopology = ARTIFACT_PATHS.cloudTopology;
        result.artifacts.sourceIntegrationPlan = DATA_PATHS.sourceIntegrationPlan;
        result.artifacts.toolRegistryPlan = DATA_PATHS.toolRegistryPlan;
        await events.emit({ type: "stage_done", stage: "data_packaged", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "previewed") && stageIndex(targetStage) >= stageIndex("previewed")) {
        await events.emit({ type: "stage_started", stage: "previewed", workspaceId: result.workspaceId, ...progress });
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const preview = await runAdkPreviewForWorkspace({
          workspaceDir,
          projectId: result.workspaceId,
          prompt,
          repoRoot,
          dataRoot,
          timeoutMs: Number.isFinite(previewTimeoutMs) && previewTimeoutMs > 0 ? previewTimeoutMs : 120000,
          source: "factory-preview",
        });
        if (!preview.ok) throw new Error(`ADK preview failed with exit ${preview.code}`);
        result.status = "previewed";
        result.preview = {
          ok: preview.ok === true,
          code: preview.code,
          response: preview.response || "",
        };
        result.artifacts.preview = ARTIFACT_PATHS.previewReport;
        result.artifacts.promotionPacket = ARTIFACT_PATHS.promotionPacket;
        await events.emit({ type: "stage_done", stage: "previewed", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "deploy_planned") && stageIndex(targetStage) >= stageIndex("deploy_planned")) {
        await events.emit({ type: "stage_started", stage: "deploy_planned", workspaceId: result.workspaceId, ...progress });
        const deployed = runCli(repoRoot, ["deploy:plan", result.workspaceId, "--target", options.targetRuntime || "agent_runtime"], { verbose });
        result.status = "deploy_planned";
        result.deployPlan = {
          ok: deployed.ok === true,
          nextActions: deployed.nextActions || [],
        };
        result.artifacts.deployPlan = ARTIFACT_PATHS.deployPlan;
        await events.emit({ type: "stage_done", stage: "deploy_planned", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "deployed") && stageIndex(targetStage) >= stageIndex("deployed")) {
        await events.emit({ type: "stage_started", stage: "deployed", workspaceId: result.workspaceId, ...progress });
        const topology = plan.cloudTopology || resolveCloudTopology(plan.options || {});
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const targets = result.dataPackage?.targets || workspaceCloudTargets(result, topology);
        const targetRuntime = options.targetRuntime || options["target-runtime"] || options.runtime || "agent_runtime";
        const deployed = runGeMock(repoRoot, [
          "deploy",
          "--dir", workspaceDir,
          "--project", targets.project,
          "--region", targets.runtimeRegion,
          "--target", targetRuntime,
        ], { verbose });
        if (deployed.status === "running") {
          result.status = "deploying";
          result.deployment = {
            ok: true,
            status: "running",
            target: deployed.target,
            project: deployed.project,
            region: deployed.region,
            operation: deployed.operation || null,
            statusCommand: deployed.statusCommand || null,
          };
          result.artifacts.deployment = "mock_systems/pipeline.json";
          result.finishedAt = new Date().toISOString();
          results.push(result);
          await events.emit({ type: "item_done", status: result.status, workspaceId: result.workspaceId, ...progress });
          continue;
        }
        result.status = "deployed";
        result.deployment = {
          ok: deployed.step === "deploy",
          target: deployed.target,
          project: deployed.project,
          region: deployed.region,
          runtimeId: deployed.runtimeId || null,
          serviceUrl: deployed.serviceUrl || null,
        };
        result.artifacts.deployment = "deployment_metadata.json";
        await events.emit({ type: "stage_done", stage: "deployed", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "registered") && stageIndex(targetStage) >= stageIndex("registered")) {
        await events.emit({ type: "stage_started", stage: "registered", workspaceId: result.workspaceId, ...progress });
        const topology = plan.cloudTopology || resolveCloudTopology(plan.options || {});
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const targets = result.dataPackage?.targets || workspaceCloudTargets(result, topology);
        const registered = runGeMock(repoRoot, [
          "register",
          "--dir", workspaceDir,
          "--project", targets.project,
          "--region", targets.geminiEnterpriseLocation || "global",
          "--as", options["register-as"] || "adk",
        ], { verbose });
        result.status = "registered";
        result.registration = {
          ok: registered.step === "register",
          mode: registered.mode,
          runtimeId: registered.runtimeId || null,
          serverName: registered.serverName || null,
        };
        result.artifacts.registration = WORKSPACE_PATHS.pipeline;
        await events.emit({ type: "stage_done", stage: "registered", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "publish_planned") && stageIndex(targetStage) >= stageIndex("publish_planned")) {
        await events.emit({ type: "stage_started", stage: "publish_planned", workspaceId: result.workspaceId, ...progress });
        const appId = options["app-id"] || process.env.GEMINI_ENTERPRISE_APP_ID || "<GEMINI_ENTERPRISE_APP_ID>";
        const published = runCli(repoRoot, ["publish:plan", result.workspaceId, "--app-id", appId], { verbose });
        result.status = "publish_planned";
        result.publishPlan = {
          ok: published.ok === true,
          nextActions: published.nextActions || [],
        };
        result.artifacts.publishPlan = ARTIFACT_PATHS.publishPlan;
        await events.emit({ type: "stage_done", stage: "publish_planned", workspaceId: result.workspaceId, ...progress });
      }

      if (!stageReached(result, "published") && stageIndex(targetStage) >= stageIndex("published")) {
        await events.emit({ type: "stage_started", stage: "published", workspaceId: result.workspaceId, ...progress });
        const workspaceDir = result.workspacePath || join(projectsDir, result.workspaceId);
        const appId = options["app-id"] || process.env.GEMINI_ENTERPRISE_APP_ID;
        const publishArgs = ["publish", "--dir", workspaceDir];
        if (appId) publishArgs.push("--app-id", appId);
        if (options["gemini-enterprise-location"]) publishArgs.push("--location", options["gemini-enterprise-location"]);
        const published = runGeMock(repoRoot, publishArgs, { verbose });
        result.status = "published";
        result.publish = {
          ok: published.step === "publish",
          appId: published.appId || appId || null,
          registrationType: published.regType || null,
          displayName: published.displayName || null,
        };
        result.artifacts.publish = "mock_systems/pipeline.json";
        await events.emit({ type: "stage_done", stage: "published", workspaceId: result.workspaceId, ...progress });
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.status = result.status || "failed";
      results.push(result);
      await events.emit({ type: "item_failed", error: result.error, status: result.status, workspaceId: result.workspaceId, ...progress });
      if (!continueOnError) break;
      continue;
    }
    result.finishedAt = new Date().toISOString();
    results.push(result);
    await events.emit({ type: "item_done", status: result.status, workspaceId: result.workspaceId, ...progress });
  }

  const run = {
    kind: "ge.agent_factory.run",
    version: 1,
    startedAt,
    finishedAt: new Date().toISOString(),
    targetStage,
    ok: results.every((item) => !item.error),
    totals: {
      workItems: results.length,
      failed: results.filter((item) => item.error).length,
      byStatus: results.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {}),
    },
    planPath: resolvedPlanPath,
    results,
  };

  const stamp = startedAt.replace(/[:.]/g, "-");
  const runPath = join(factoryDir, `factory-run-${stamp}.json`);
  const mdPath = join(factoryDir, `FACTORY_RUN_${stamp}.md`);
  await writeJson(runPath, run);
  await writeText(mdPath, renderFactoryRunMarkdown(run));
  await events.emit({ type: "run_done", ok: run.ok, failed: run.totals.failed, total: run.totals.workItems, runPath, markdown: mdPath });
  return { run, runPath, mdPath };
}

function renderFactoryRunMarkdown(run) {
  const lines = [
    "# GE Agent Factory Run",
    "",
    `Started: ${run.startedAt}`,
    `Finished: ${run.finishedAt}`,
    `Target stage: ${run.targetStage}`,
    `OK: ${run.ok}`,
    "",
    "| Workspace | Department | Domain | Status | Error |",
    "| --- | --- | --- | --- | --- |",
  ];
  for (const item of run.results) {
    lines.push([
      item.workspaceId || item.workspaceName,
      item.department,
      item.domainId || "-",
      item.status,
      item.error || "",
    ].map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | "));
  }
  return `${lines.join("\n")}\n`;
}

export { FACTORY_STAGES };
