// factory-core — the engine behind the `ge` CLI and the MCP server.
//
// Operations return structured data and take an optional `log(msg)` callback for
// human progress; they never print directly and throw Error on failure. This is
// the "one core, two surfaces" seam: tools/ge.mjs renders for humans (or --json),
// tools/mcp-server.mjs exposes the same ops as typed MCP tools.

import { execFileSync } from "node:child_process";
import { parseList } from "@ge/std/list";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { basename, join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./gcp.mjs";
import { parseConcurrency } from "./concurrency.mjs";
import { readJson, writeJson, updateJson } from "@ge/std/json-io";
import { buildFactoryConfig, explainFactoryConfig } from "./config-schema.mjs";
import { commandMeta, commandRequirements } from "./ge-command-registry.mjs";
import { buildFactoryAutopilotMission } from "./factory-autopilot-mission.mjs";
import { runDoctorSection } from "./factory-doctor.mjs";
import { runCommand } from "./factory-exec.mjs";
import { createDataPlane } from "./data-plane.mjs";
import { createMcpPlane } from "./mcp-plane.mjs";
import { createFactoryPlane, serviceUrl } from "./factory-plane.mjs";
import { buildFleetHealth } from "./fleet-health.mjs";
import { buildJourneyPlan } from "./journey-plan.mjs";
import { LEGACY_STATE_PATHS, STATE_PATHS, displayStatePath, DEPARTMENTS } from "./state-paths.mjs";
// Week-4: app-domain ops are imported via the two cycle-break boundary modules,
// NOT directly from apps/factory — factory-core keeps zero app imports (enforced
// by tools/check-no-app-imports.mjs).
import { loadInterviewSpecEntries, slug, validateGenerationSpec } from "./factory-catalog.mjs";
import { openRunLedger } from "./run-ledger.mjs";
import { planWorkItem } from "./pipeline-state-machine.mjs";
import { planReconcile } from "./reconcile.mjs";
import { createGatewayClient, getJson, postJson } from "./gateway-client.mjs";
import { createDoctorPlane } from "./doctor.mjs";
import { createProvisionOps } from "./provision.mjs";
import { localWorkspaceIndexByUseCase, resolveLocalWorkspaceId, localWorkspaceExists } from "./local-workspaces.mjs";
import { selectionDepartments, toolPlaneChecks, shipProxyCheck, gatewayProvisionCheck, bigQueryApiCheck, selectWorkspacesForRegen } from "./tool-plane-checks.mjs";

export {
  selectionDepartments,
  toolPlaneChecks,
  shipProxyCheck,
  gatewayProvisionCheck,
  bigQueryApiCheck,
  selectWorkspacesForRegen,
} from "./tool-plane-checks.mjs";
export { HARNESS_VENV_DIR, harnessVenvPython } from "./doctor.mjs";


export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CONFIG_PATH = join(REPO_ROOT, ".ge.json");
const STATE_PATH = STATE_PATHS.envState;
const SYNC_STATE_PATH = STATE_PATHS.syncState;
const CATALOG_PATH = join(REPO_ROOT, "apps/factory/generated/use-cases.generated.json");
const AGENT_SPEC_REGISTRY_PATH = join(REPO_ROOT, "apps/factory/src/agent-spec-registry.generated.json");
const TF_DIR = join(REPO_ROOT, "installer/terraform");
const MCP_SERVICE_DIR = join(REPO_ROOT, "apps/factory/mcp-service");
const FACTORY_HARNESS_DIR = STATE_PATHS.factory.root;

export { DEPARTMENTS };

const noop = () => {};

// ── small fs/exec helpers ─────────────────────────────────────────────────────
// Single source of truth for JSON IO: atomic writes (temp+fsync+rename) and
// lockable read-modify-write live in json-io.mjs. Imported for internal use and
// re-exported so existing `import { readJson, writeJson } from "./factory-core.mjs"`
// callers stay valid.
export { readJson, writeJson, updateJson };

// Ledger is authoritative; keep only file runs it doesn't already cover (matched by
// startedAt — covers in-flight sessions + any run the best-effort ingest missed). Pure.
export function mergeLedgerAndFileRuns(ledgerRuns, fileRuns) {
  if (!ledgerRuns?.length) return fileRuns;
  const seen = new Set(ledgerRuns.map((r) => r.startedAt));
  return [...ledgerRuns, ...fileRuns.filter((r) => !seen.has(r.startedAt))];
}

export async function listFactoryRuns(_cfg = {}, { limit = 10 } = {}) {
  const max = Math.max(1, Math.min(100, Number(limit) || 10));
  const eventsPath = join(FACTORY_HARNESS_DIR, "factory-events.jsonl");
  const eventSessions = readFactoryEventSessions(eventsPath);
  const sessionByRunPath = new Map(
    eventSessions
      .filter((session) => session.runPath)
      .map((session) => [resolve(session.runPath), session])
  );

  const files = existsSync(FACTORY_HARNESS_DIR)
    ? readdirSync(FACTORY_HARNESS_DIR)
      .filter((file) => /^factory-run-.*\.json$/.test(file))
      .map((file) => {
        const path = join(FACTORY_HARNESS_DIR, file);
        return { file, path, stat: statSync(path) };
      })
      .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)
    : [];

  const completedRuns = files.map(({ file, path, stat }) => {
    const run = readJson(path, null);
    if (!run || typeof run !== "object") return null;
    const session = sessionByRunPath.get(resolve(path)) || null;
    return summarizeFactoryRun(run, {
      id: file.replace(/\.json$/, ""),
      runPath: path,
      mtime: stat.mtime.toISOString(),
      eventsPath,
      session,
    });
  }).filter(Boolean);

  const completedPaths = new Set(completedRuns.map((run) => resolve(run.runPath)));
  const liveRuns = eventSessions
    .filter((session) => !session.runPath || !completedPaths.has(resolve(session.runPath)))
    .map((session) => summarizeFactoryEventSession(session, eventsPath));

  let merged = [...liveRuns, ...completedRuns];
  let ledgerUsed = false;
  if (ledgerReadsEnabled()) {
    const l = await runLedger();
    const ledgerRunsList = l ? l.listRuns({ limit: max }) : [];
    if (ledgerRunsList.length) {
      merged = mergeLedgerAndFileRuns(ledgerRunsList, merged);
      ledgerUsed = true;
    }
  }
  const runs = merged
    .sort((a, b) => new Date(b.updatedAt || b.startedAt).getTime() - new Date(a.updatedAt || a.startedAt).getTime())
    .slice(0, max);

  return {
    kind: "ge.factory.runs",
    root: FACTORY_HARNESS_DIR,
    eventLog: eventsPath,
    ledger: ledgerUsed,
    runs,
  };
}

function readFactoryEventSessions(eventsPath) {
  if (!existsSync(eventsPath)) return [];
  const lines = readFileSync(eventsPath, "utf8").split(/\r?\n/).filter(Boolean);
  const sessions = [];
  let current = null;
  for (const line of lines) {
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === "run_started") {
      current = {
        id: `factory-live-${safeTimestamp(event.ts)}`,
        startedAt: event.ts,
        updatedAt: event.ts,
        targetStage: event.targetStage || null,
        total: event.total || 0,
        planPath: event.planPath || null,
        runPath: null,
        markdownPath: null,
        ok: null,
        failed: null,
        events: [],
      };
      sessions.push(current);
    }
    if (!current) continue;
    current.events.push(event);
    current.updatedAt = event.ts || current.updatedAt;
    if (event.type === "run_done") {
      current.ok = event.ok === true;
      current.failed = event.failed ?? null;
      current.total = event.total ?? current.total;
      current.runPath = event.runPath || null;
      current.markdownPath = event.markdown || null;
      current.finishedAt = event.ts || current.updatedAt;
      current = null;
    }
  }
  return sessions;
}

function summarizeFactoryRun(run, { id, runPath, mtime, eventsPath, session }) {
  const updatedAt = run.finishedAt || session?.updatedAt || mtime || run.startedAt;
  return {
    id,
    kind: run.kind || "ge.agent_factory.run",
    status: run.ok === true ? "done" : "failed",
    ok: run.ok === true,
    startedAt: run.startedAt,
    updatedAt,
    finishedAt: run.finishedAt || null,
    targetStage: run.targetStage || null,
    planPath: run.planPath || null,
    runPath,
    markdownPath: siblingMarkdownPath(runPath),
    eventsPath,
    totals: run.totals || null,
    selected: run.totals?.workItems ?? run.results?.length ?? session?.total ?? 0,
    failed: run.totals?.failed ?? run.results?.filter((item) => item.error).length ?? 0,
    results: (run.results || []).map(summarizeFactoryResult),
    recentEvents: summarizeFactoryEvents(session?.events || []),
  };
}

function summarizeFactoryEventSession(session, eventsPath) {
  const failed = session.failed ?? session.events.filter((event) => event.type === "item_failed").length;
  return {
    id: session.runPath ? basename(session.runPath).replace(/\.json$/, "") : session.id,
    kind: "ge.agent_factory.run",
    status: session.finishedAt ? (session.ok ? "done" : "failed") : "running",
    ok: session.ok,
    startedAt: session.startedAt,
    updatedAt: session.updatedAt,
    finishedAt: session.finishedAt || null,
    targetStage: session.targetStage || null,
    planPath: session.planPath || null,
    runPath: session.runPath,
    markdownPath: session.markdownPath,
    eventsPath,
    totals: { workItems: session.total || 0, failed },
    selected: session.total || 0,
    failed,
    results: summarizeFactorySessionItems(session.events),
    recentEvents: summarizeFactoryEvents(session.events),
  };
}

function summarizeFactoryResult(result) {
  return {
    id: result.id,
    useCaseId: result.useCaseId,
    title: result.title || result.useCaseId || result.id,
    department: result.department || null,
    status: result.status || "unknown",
    targetStage: result.targetStage || null,
    workspaceId: result.workspaceId || result.workspaceName || null,
    workspacePath: result.workspacePath || null,
    error: result.error || null,
    systems: result.systems || [],
    stages: [
      factoryStage("created", !!result.workspacePath, result.error && !result.workspacePath),
      factoryStage("validated", result.validation?.ok === true, result.validation && result.validation.ok !== true),
      factoryStage("harness_reviewed", result.harnessReview?.ok === true, result.harnessReview && result.harnessReview.ok !== true),
      factoryStage("harness_refined", result.harnessRefine?.ok === true, result.harnessRefine && result.harnessRefine.ok !== true),
      factoryStage("data_packaged", result.dataPackage?.ok === true, result.dataPackage && result.dataPackage.ok !== true),
      factoryStage("previewed", result.preview?.ok === true, result.preview && result.preview.ok !== true),
    ],
    validation: result.validation?.summary || null,
    harnessReview: result.harnessReview ? {
      provider: result.harnessReview.provider || null,
      score: result.harnessReview.score ?? null,
      okToPromote: result.harnessReview.okToPromote ?? null,
    } : null,
    dataPackage: result.dataPackage ? {
      datastores: result.dataPackage.datastores || [],
      cloudTarget: result.dataPackage.cloudTarget || null,
      targets: result.dataPackage.targets || null,
    } : null,
    preview: result.preview || null,
  };
}

function summarizeFactorySessionItems(events) {
  const byKey = new Map();
  for (const event of events) {
    const key = event.useCaseId || event.workspace;
    if (!key) continue;
    const item = byKey.get(key) || {
      id: key,
      useCaseId: event.useCaseId || key,
      title: event.useCaseId || event.workspace || key,
      department: null,
      status: "running",
      targetStage: null,
      workspaceId: event.workspaceId || event.workspace || null,
      workspacePath: null,
      error: null,
      systems: [],
      stages: [],
      validation: null,
      harnessReview: null,
      dataPackage: null,
      preview: null,
    };
    if (event.workspaceId) item.workspaceId = event.workspaceId;
    if (event.type === "stage_started") item.stages = upsertFactoryStage(item.stages, event.stage, "running");
    if (event.type === "stage_done") item.stages = upsertFactoryStage(item.stages, event.stage, "done");
    if (event.type === "item_failed") {
      item.status = "failed";
      item.error = event.error || "factory item failed";
      if (event.status) item.stages = upsertFactoryStage(item.stages, event.status, "failed");
    }
    if (event.type === "item_done") item.status = event.status || "done";
    byKey.set(key, item);
  }
  return Array.from(byKey.values());
}

function factoryStage(name, done, failed) {
  return { name, status: failed ? "failed" : done ? "done" : "pending" };
}

function upsertFactoryStage(stages, name, status) {
  if (!name) return stages;
  const next = [...stages];
  const index = next.findIndex((stage) => stage.name === name);
  if (index >= 0) next[index] = { ...next[index], status };
  else next.push({ name, status });
  return next;
}

function summarizeFactoryEvents(events) {
  return events.slice(-80).map((event) => ({
    ts: event.ts || null,
    type: event.type || "event",
    stage: event.stage || null,
    level: event.type?.includes("failed") ? "error" : "info",
    line: formatFactoryEventLine(event),
  }));
}

function formatFactoryEventLine(event) {
  if (event.type === "run_started") return `factory run started → ${event.targetStage || "target"} (${event.total || 0})`;
  if (event.type === "run_done") return `factory run ${event.ok ? "done" : "failed"} · ${event.failed || 0} failed`;
  if (event.type === "item_started") return `${event.index || "?"}/${event.total || "?"} ${event.workspace || event.useCaseId}: started`;
  if (event.type === "item_done") return `${event.index || "?"}/${event.total || "?"} ${event.workspaceId || event.workspace || event.useCaseId}: ${event.status || "done"}`;
  if (event.type === "item_failed") return `${event.index || "?"}/${event.total || "?"} ${event.workspace || event.useCaseId}: ${event.error || "failed"}`;
  if (event.type === "stage_started") return `${event.index || "?"}/${event.total || "?"} ${event.workspace || event.useCaseId}: ${event.stage}...`;
  if (event.type === "stage_done") return `${event.index || "?"}/${event.total || "?"} ${event.workspaceId || event.workspace || event.useCaseId}: ${event.stage} done`;
  return event.line || event.type || "factory event";
}

function siblingMarkdownPath(runPath) {
  if (!runPath) return null;
  const file = basename(runPath).replace(/^factory-run-/, "FACTORY_RUN_").replace(/\.json$/, ".md");
  return join(dirname(runPath), file);
}

function safeTimestamp(value) {
  return String(value || Date.now()).replace(/[^0-9A-Za-z]+/g, "-").replace(/^-|-$/g, "");
}

function parseJsonObjects(text) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (start < 0) {
      if (ch === "{") { start = i; depth = 1; inString = false; escaped = false; }
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
        try { objects.push(JSON.parse(text.slice(start, i + 1))); } catch {}
        start = -1;
      }
    }
  }
  if (!objects.length) throw new Error(`command did not emit JSON: ${text.slice(-500)}`);
  return objects[objects.length - 1];
}

export function run(bin, args, { capture = true, allowFail = false, cwd = REPO_ROOT } = {}) {
  const result = runCommand(bin, args, { capture, allowFail, cwd });
  return {
    ok: result.ok,
    out: (result.stdout || "").trim(),
    err: result.stderr || result.failureLine || "",
  };
}
const gcloud = (args, opts) => run("gcloud", args, opts);

export function ensureBin(bin, hint) {
  try { execFileSync(bin, ["--version"], { stdio: "ignore" }); return; } catch {}
  try { execFileSync(bin, ["-version"], { stdio: "ignore" }); return; } catch {}
  throw new Error(`${bin} not found on PATH.${hint ? " " + hint : ""}`);
}
const ensureGcloud = () => ensureBin("gcloud", "Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install");
const ensureTerraform = () => ensureBin("terraform", "Install it: `mise install` (terraform is provisioned via mise.toml's pinned [tools] block; or https://developer.hashicorp.com/terraform/install).");

function binCheck(bin, args = ["--version"]) {
  const r = run(bin, args, { allowFail: true });
  return { ok: r.ok, detail: r.ok ? (r.out.split("\n")[0] || "available") : "not found" };
}

// ── config ────────────────────────────────────────────────────────────────────
// Scalar fields, project-override guards, and derived defaults live in
// config-schema.mjs so CLI/MCP/console/docs share one config contract.
export function loadConfig(flags = {}) {
  return buildFactoryConfig({ flags, env: process.env, file: readJson(CONFIG_PATH, {}) });
}

// Source-of-each-value report for `ge config explain` (uses the same schema).
// Honors the project-override guard so a flagged project doesn't show another
// project's cached number/bucket/app as if they applied.
export function explainLoadedConfig(flags = {}) {
  return explainFactoryConfig({ flags, env: process.env, file: readJson(CONFIG_PATH, {}) });
}

// ── terraform helpers ─────────────────────────────────────────────────────────
export function tfOutputs() {
  const r = run("terraform", [`-chdir=${TF_DIR}`, "output", "-json"], { allowFail: true });
  if (!r.ok) return {};
  try { const j = JSON.parse(r.out); const o = {}; for (const [k, v] of Object.entries(j)) o[k] = v.value; return o; } catch { return {}; }
}

function agentIdentityPrincipalSet(orgId, projectNumber) {
  return orgId && projectNumber
    ? `principalSet://agents.global.org-${orgId}.system.id.goog/attribute.platformContainer/aiplatform/projects/${projectNumber}`
    : "";
}

function inferAgentIdentityOrgId(cfg) {
  if (cfg.agentIdentityOrgId || !cfg.project) return cfg.agentIdentityOrgId || "";
  const r = gcloud(["projects", "get-ancestors", cfg.project, "--format=json"], { allowFail: true });
  if (!r.ok) return "";
  try {
    const ancestors = JSON.parse(r.out);
    return ancestors.find((a) => a.type === "organization")?.id || "";
  } catch {
    return "";
  }
}

function describeProjectNumber(cfg) {
  const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true });
  return r.ok ? r.out : "";
}

function ensureAgentIdentityConfig(cfg, { log = noop } = {}) {
  if (!cfg.agentIdentityOrgId) {
    const orgId = inferAgentIdentityOrgId(cfg);
    if (orgId) {
      cfg.agentIdentityOrgId = orgId;
      log(`detected Agent Identity org id ${orgId}`);
    }
  }
  if (!cfg.agentIdentityPrincipalSet && cfg.agentIdentityOrgId && cfg.projectNumber) {
    cfg.agentIdentityPrincipalSet = agentIdentityPrincipalSet(cfg.agentIdentityOrgId, cfg.projectNumber);
  }
  if (!cfg.agentIdentityOrgId) {
    log("Agent Identity org id not detected; set GE_AGENT_IDENTITY_ORG_ID or pass --agentIdentityOrgId before applying infra.");
  }
  return cfg;
}

function persistAgentIdentityConfig(cfg) {
  if (!cfg.project || !cfg.agentIdentityOrgId) return;
  const existing = readJson(CONFIG_PATH, {});
  if (existing.project && existing.project !== cfg.project) return;
  writeJson(CONFIG_PATH, {
    ...existing,
    project: existing.project || cfg.project,
    projectNumber: existing.projectNumber || cfg.projectNumber || "",
    agentIdentityOrgId: cfg.agentIdentityOrgId,
    agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || existing.agentIdentityPrincipalSet || "",
  });
}

const gitShortSha = () => { const r = run("git", ["rev-parse", "--short", "HEAD"], { allowFail: true }); return r.ok ? r.out : "manual"; };
export function resolveRepo(cfg) {
  return factoryPlane.resolveRepo(cfg);
}

// ── gateway transport + JSON fetch ────────────────────────────────────────────
// Proxy management, the bounded-retry fetch, and postJson/getJson now live in
// gateway-client.mjs (shared by `status` here and provision.mjs's provision/ship).
// `run` is injected the same way factory-core wires it into the plane modules.
const { withGateway } = createGatewayClient({ run });

// ── catalog ───────────────────────────────────────────────────────────────────
export async function loadCatalog() {
  if (!existsSync(CATALOG_PATH)) {
    throw new Error(`catalog not found: ${CATALOG_PATH} (generated artifact — run \`npm run use-cases:sync\`)`);
  }
  // Read the JSON artifact fresh each call so a regenerated catalog is picked up
  // without restarting a long-running daemon.
  const generated = JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
  let interviewEntries = [];
  try {
    interviewEntries = await loadInterviewSpecEntries({ repoRoot: GEN_DIR });
  } catch {
    interviewEntries = [];
  }
  const byId = new Map(generated.map((entry) => [entry.id, entry]));
  for (const entry of interviewEntries) byId.set(entry.id, entry);
  return [...byId.values()];
}

/**
 * Resolve ANY agent id form (catalog slug, uc-NNNN, A-NNNN, numeric) to the catalog id.
 * Uses @ge/agent-resolver to normalize ids and match against catalog entries.
 * Returns the catalog id on match, or null if no match.
 */
export async function resolveCatalogId(anyId) {
  if (!anyId) return null;
  try {
    const { candidateKeys, normalizeAgentId } = await import("@ge/agent-resolver");
    const catalog = await loadCatalog();
    const keys = candidateKeys(anyId);
    const normalized = normalizeAgentId(anyId);

    // Try exact match on id/slug first
    for (const key of keys) {
      const entry = catalog.find((c) => c.id === key);
      if (entry) return entry.id;
    }

    // Try matching subtitle prefix if we have an A-<num> form
    if (normalized.agentId) {
      const agentIdPrefix = `${normalized.agentId} `;
      const entry = catalog.find((c) => c.subtitle?.startsWith(agentIdPrefix));
      if (entry) return entry.id;
    }

    return null;
  } catch {
    return null;
  }
}
export async function listUsecases({ department, search, limit } = {}) {
  let cases = await loadCatalog();
  if (department) cases = cases.filter((u) => u.department === department);
  if (search) { const q = search.toLowerCase(); cases = cases.filter((u) => `${u.id} ${u.title}`.toLowerCase().includes(q)); }
  const byDept = {};
  for (const u of cases) byDept[u.department] = (byDept[u.department] || 0) + 1;
  return { total: cases.length, byDepartment: byDept, useCases: cases.slice(0, limit || cases.length).map((u) => ({ id: u.id, title: u.title, department: u.department })) };
}

function specSearchText(spec) {
  return [
    spec.id,
    spec.title,
    spec.department,
    spec.domainId,
    spec.persona,
    spec.subtitle,
    spec.description,
    spec.familyId,
    spec.variantId,
    spec.variantLabel,
    ...(spec.systems || []),
  ].filter(Boolean).join(" ").toLowerCase();
}

function matchesSpecSearch(spec, search) {
  const terms = String(search || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const text = specSearchText(spec);
  return terms.every((term) => text.includes(term));
}

function splitCsvLike(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return parseList(String(value || ""));
}

function summarizeSpec(usecase, registryEntry) {
  const registry = registryEntry?.registry || {};
  const variant = registry.variant || {};
  return {
    id: usecase.id,
    title: usecase.title,
    department: usecase.department || registryEntry?.department || null,
    domainId: usecase.domainId || registryEntry?.domainId || null,
    persona: usecase.persona || null,
    subtitle: usecase.subtitle || null,
    systems: usecase.systems || registryEntry?.systems || [],
    source: registry.sourceKind || "slide",
    sourcePath: usecase.sourcePath || registry.sourcePath || null,
    familyId: variant.familyId || registry.familyId || usecase.id,
    variantId: variant.variantId || usecase.id,
    variantLabel: variant.label || "Canonical",
    buildable: registryEntry?.buildable !== false,
    hasBehaviorContract: registryEntry?.hasBehaviorContract === true,
    description: (usecase.statusQuo?.[0] || usecase.agentification?.[0] || usecase.subtitle || "").trim(),
  };
}

export async function listSpecs({ department, search, limit = 100, ids = [] } = {}) {
  const catalog = await loadCatalog();
  const registry = readJson(AGENT_SPEC_REGISTRY_PATH, { entries: [], summary: {} });
  const registryById = new Map((registry.entries || []).map((entry) => [entry.id, entry]));
  const idSet = new Set(splitCsvLike(ids));
  const q = String(search || "").trim().toLowerCase();
  const interviewEntries = await loadInterviewSpecEntries({ repoRoot: GEN_DIR });
  const byId = new Map();
  for (const usecase of catalog) byId.set(usecase.id, summarizeSpec(usecase, registryById.get(usecase.id)));
  for (const entry of interviewEntries) byId.set(entry.id, summarizeSpec(entry, entry));
  let specs = [...byId.values()];
  if (department) specs = specs.filter((spec) => spec.department === department);
  if (idSet.size) specs = specs.filter((spec) => idSet.has(spec.id));
  if (q) specs = specs.filter((spec) => matchesSpecSearch(spec, q));
  specs.sort((a, b) => `${a.department || ""}/${a.title}`.localeCompare(`${b.department || ""}/${b.title}`));
  const byDepartment = {};
  for (const spec of specs) byDepartment[spec.department || "unknown"] = (byDepartment[spec.department || "unknown"] || 0) + 1;
  const capped = Math.max(1, Math.min(Number(limit) || 100, 1000));
  return {
    kind: "ge.agent_spec.catalog",
    version: 1,
    total: specs.length,
    returned: Math.min(specs.length, capped),
    byDepartment,
    departments: DEPARTMENTS,
    summary: registry.summary || {},
    specs: specs.slice(0, capped),
  };
}

function isInsideDir(filePath, rootDir) {
  const root = resolve(rootDir);
  const file = resolve(filePath);
  return file === root || file.startsWith(`${root}/`);
}

function safeSpecReviewPath({ usecaseId, path } = {}) {
  const rawPath = path
    ? String(path)
    : join(displayStatePath(STATE_PATHS.interviews.root), slug(usecaseId || "new-agent", 64) || "new-agent", "agent-spec.json");
  const fullPath = resolve(REPO_ROOT, rawPath);
  const allowedRoots = [
    STATE_PATHS.interviews.root,
    LEGACY_STATE_PATHS.interviews.root,
    join(GEN_DIR, "catalog", "interview-specs"),
  ];
  if (!allowedRoots.some((root) => isInsideDir(fullPath, root))) {
    throw new Error("spec review path must be under .ge/interviews or apps/factory/catalog/interview-specs");
  }
  return fullPath;
}

function summarizeReviewedSpec(spec, usecaseId = null) {
  const generation = spec.generationSpec || spec;
  const quality = validateGenerationSpec(generation);
  return {
    summary: {
      id: spec.id || usecaseId,
      title: spec.title || spec.id || usecaseId || "Generated agent spec",
      department: spec.department || null,
      persona: spec.persona || generation.behaviorContract?.role || null,
      systems: spec.systems || (generation.sourceSystems || []).map((system) => system.id || system.name).filter(Boolean),
      sourceSystems: Array.isArray(generation.sourceSystems) ? generation.sourceSystems.length : 0,
      entities: Array.isArray(generation.entities) ? generation.entities.length : 0,
      documents: Array.isArray(generation.documents) ? generation.documents.length : 0,
      anomalies: Array.isArray(generation.anomalies) ? generation.anomalies.length : 0,
      goldenEvals: Array.isArray(generation.behaviorContract?.goldenEvals) ? generation.behaviorContract.goldenEvals.length : 0,
      buildable: quality.ok,
      maturity: quality.maturity,
    },
    gaps: quality.gaps || [],
  };
}

function generatedInterviewSpecs() {
  const roots = [STATE_PATHS.interviews.root, LEGACY_STATE_PATHS.interviews.root].filter((root, index, all) => all.indexOf(root) === index);
  return roots.flatMap((root) => {
    if (!existsSync(root)) return [];
    return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const specPath = join(root, entry.name, "agent-spec.json");
      if (!existsSync(specPath)) return null;
      try {
        const content = readFileSync(specPath, "utf8");
        const spec = JSON.parse(content);
        return {
          id: spec.id || entry.name,
          title: spec.title || spec.id || entry.name,
          department: spec.department || null,
          source: "generated_artifact",
          path: specPath,
          relativePath: specPath.slice(REPO_ROOT.length + 1),
          content,
          spec,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  });
}

function candidateScore(entry, words) {
  const text = `${entry.id || ""} ${entry.title || ""} ${entry.subtitle || ""}`.toLowerCase();
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

async function specReviewCandidates(usecaseId) {
  const q = String(usecaseId || "").replace(/-/g, " ").trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((word) => word.length > 2);
  if (!words.length) return [];
  const catalog = await loadCatalog();
  const generated = generatedInterviewSpecs().map((entry) => ({
    id: entry.id,
    title: entry.title,
    department: entry.department,
    source: entry.source,
    score: candidateScore(entry, words),
  }));
  const canonical = catalog
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      department: entry.department || null,
      source: "canonical_catalog_spec",
      score: candidateScore(entry, words),
    }));
  return [...generated, ...canonical]
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 8)
    .map(({ score: _score, ...entry }) => entry);
}

export async function reviewSpec({ usecaseId, path } = {}) {
  const fullPath = safeSpecReviewPath({ usecaseId, path });
  const relativePath = fullPath.startsWith(`${REPO_ROOT}/`) ? fullPath.slice(REPO_ROOT.length + 1) : fullPath;
  const normalizedUsecaseId = usecaseId ? slug(usecaseId, 64) : (relativePath.match(/\.ge(?:-harness)?\/interviews\/([^/]+)\/agent-spec\.json$/)?.[1] || null);
  if (existsSync(fullPath)) {
    const content = readFileSync(fullPath, "utf8");
    let spec;
    try {
      spec = JSON.parse(content);
    } catch (error) {
      return {
        kind: "ge.spec.review",
        source: "generated_artifact",
        found: true,
        parseError: error.message,
        usecaseId: normalizedUsecaseId,
        path: relativePath,
        spec: null,
        content,
        summary: null,
        gaps: ["invalid_json"],
      };
    }
    const reviewed = summarizeReviewedSpec(spec, normalizedUsecaseId);
    return {
      kind: "ge.spec.review",
      source: "generated_artifact",
      found: true,
      usecaseId: normalizedUsecaseId || reviewed.summary.id,
      path: relativePath,
      spec,
      content,
      ...reviewed,
    };
  }

  if (!path && normalizedUsecaseId) {
    const interviewEntries = await loadInterviewSpecEntries({ repoRoot: GEN_DIR });
    const registered = interviewEntries.find((entry) => entry.id === normalizedUsecaseId || entry.registry?.familyId === normalizedUsecaseId);
    if (registered) {
      const reviewed = summarizeReviewedSpec(registered, normalizedUsecaseId);
      const registeredPath = registered.sourcePath?.startsWith(`${REPO_ROOT}/`) ? registered.sourcePath.slice(REPO_ROOT.length + 1) : registered.sourcePath || `apps/factory/catalog/interview-specs/${registered.id}.json`;
      return {
        kind: "ge.spec.review",
        source: "registered_interview_spec",
        found: true,
        usecaseId: registered.id,
        path: registeredPath,
        spec: registered,
        content: `${JSON.stringify(registered, null, 2)}\n`,
        ...reviewed,
      };
    }

    const catalog = await loadCatalog();
    const catalogEntry = catalog.find((entry) => entry.id === normalizedUsecaseId);
    if (catalogEntry) {
      const reviewed = summarizeReviewedSpec(catalogEntry, normalizedUsecaseId);
      return {
        kind: "ge.spec.review",
        source: "canonical_catalog_spec",
        found: true,
        usecaseId: catalogEntry.id,
        path: `apps/factory/generated/use-cases.generated.json#${catalogEntry.id}`,
        spec: catalogEntry,
        content: `${JSON.stringify(catalogEntry, null, 2)}\n`,
        ...reviewed,
      };
    }

    const words = String(normalizedUsecaseId || "").replace(/-/g, " ").trim().toLowerCase().split(/\s+/).filter((word) => word.length > 2);
    const generatedMatches = generatedInterviewSpecs()
      .map((entry) => ({ ...entry, score: candidateScore(entry, words) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    if (generatedMatches.length && generatedMatches[0].score >= Math.min(words.length, 2) && generatedMatches.filter((entry) => entry.score === generatedMatches[0].score).length === 1) {
      const match = generatedMatches[0];
      const reviewed = summarizeReviewedSpec(match.spec, match.id);
      return {
        kind: "ge.spec.review",
        source: "generated_artifact",
        resolvedFrom: normalizedUsecaseId,
        found: true,
        usecaseId: match.id,
        path: match.relativePath,
        spec: match.spec,
        content: match.content,
        ...reviewed,
      };
    }
  }

  return {
    kind: "ge.spec.review",
    source: "unresolved",
    found: false,
    usecaseId: normalizedUsecaseId,
    path: relativePath,
    spec: null,
    content: "",
    summary: null,
    gaps: ["spec_id_not_found"],
    candidates: await specReviewCandidates(normalizedUsecaseId),
  };
}

export async function registerSpec({ input, allowDraft = false, syncCatalog = true } = {}) {
  if (!input) throw new Error("missing spec input path");
  const inputPath = resolve(REPO_ROOT, input);
  if (!existsSync(inputPath)) throw new Error(`spec not found: ${inputPath}`);
  const args = ["scripts/register-agent-spec.mjs", "--input", inputPath];
  if (allowDraft) args.push("--allow-draft", "true");
  const registered = run("node", args, { cwd: GEN_DIR, allowFail: true });
  if (!registered.ok) throw new Error((registered.err || registered.out || "spec registration failed").trim());
  let result = {};
  try { result = JSON.parse(registered.out); } catch (err) {
    console.warn(`registerSpec: failed to parse register-agent-spec.mjs output as JSON (${err.message}); continuing with empty result`);
  }
  let sync = null;
  if (syncCatalog) {
    sync = run("node", ["scripts/sync-use-cases-from-slides.mjs"], { cwd: GEN_DIR, allowFail: true });
    if (!sync.ok) throw new Error((sync.err || sync.out || "spec registered but catalog sync failed").trim());
  }
  return {
    ok: true,
    ...result,
    input: inputPath,
    catalog: {
      synced: Boolean(syncCatalog),
      stdout: sync?.out || "",
      note: syncCatalog ? "generated catalog synced" : "generated catalog sync skipped; interview registry is available immediately",
    },
  };
}

// ── operations ────────────────────────────────────────────────────────────────
export async function init(cfg, { log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) { const r = gcloud(["config", "get-value", "project"], { allowFail: true }); cfg.project = r.ok ? r.out : undefined; }
  if (!cfg.project) throw new Error("No project. Pass --project or run `gcloud config set project …`.");

  const tfo = tfOutputs();
  if (Object.keys(tfo).length) log("sourcing config from terraform outputs");
  cfg.project = tfo.project_id || cfg.project;
  cfg.projectNumber = tfo.project_number || cfg.projectNumber;
  cfg.region = tfo.region || cfg.region;
  cfg.bucket = tfo.factory_bucket || cfg.bucket;
  cfg.gatewayUrl = tfo.gateway_url || cfg.gatewayUrl;
  cfg.workerUrl = tfo.worker_url || cfg.workerUrl;
  cfg.serviceAccount = tfo.runner_service_account || cfg.serviceAccount;
  cfg.geAppId = tfo.gemini_enterprise_app_id || cfg.geAppId;
  cfg.geLocation = tfo.gemini_enterprise_location || cfg.geLocation;
  cfg.tasksQueue = tfo.tasks_queue || cfg.tasksQueue;
  cfg.agentIdentityPrincipalSet = tfo.agent_identity_principalset || cfg.agentIdentityPrincipalSet;

  if (!cfg.projectNumber) { const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true }); if (r.ok) cfg.projectNumber = r.out; }
  ensureAgentIdentityConfig(cfg, { log });
  if (!cfg.gatewayUrl) cfg.gatewayUrl = serviceUrl(factoryPlane.describeRun(cfg, cfg.gatewayService));
  if (!cfg.workerUrl) cfg.workerUrl = serviceUrl(factoryPlane.describeRun(cfg, cfg.workerService));
  cfg.bucket = cfg.bucket || `${cfg.project}-ge-agent-factory`;

  const out = {
    project: cfg.project, projectNumber: cfg.projectNumber, region: cfg.region,
    gatewayService: cfg.gatewayService, workerService: cfg.workerService,
    gatewayUrl: cfg.gatewayUrl, workerUrl: cfg.workerUrl, bucket: cfg.bucket,
    geAppId: cfg.geAppId, geLocation: cfg.geLocation, serviceAccount: cfg.serviceAccount, tasksQueue: cfg.tasksQueue,
    agentsRepo: cfg.agentsRepo || "",
    agentIdentityOrgId: cfg.agentIdentityOrgId || "",
    agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || "",
  };
  writeJson(CONFIG_PATH, out);
  return out;
}

export function doctor(cfg) {
  return factoryPlane.doctor(cfg);
}

// Deploy contract: Cloud Build builds images; Terraform owns Cloud Run config
// (env, ingress, SA, scaling, CPU/memory, IAM). So `deploy` = build images, then
// bind them via `terraform apply` — never a direct `gcloud run deploy` (which would
// clobber Terraform-managed config). Memory/CPU/IAP live in Terraform variables.
// Note: terraform apply reconciles the whole module, so target is advisory.
export function deploy(cfg, { target = "all", log = noop } = {}) {
  return factoryPlane.deploy(cfg, { target, log });
}

export async function status(cfg, { noProxy = false } = {}) {
  ensureGcloud();
  const state = readJson(STATE_PATH, { completed: {} });
  const runs = Object.entries(state.completed).map(([id, e]) => ({ id, ...e }));
  if (!runs.length) throw new Error("No submitted runs in .ge-state.json. Run `ge provision` first.");
  return withGateway(cfg, async (url, ctx = {}) => {
    const tally = { done: 0, running: 0, queued: 0, failed: 0, unknown: 0 };
    const stages = {};
    const perRun = [];
    await pool(runs, 10, async (r) => {
      const res = await getJson(url, `/api/factory/runs/${r.runId}`, ctx.headers).catch(() => ({ ok: false }));
      const s = res.json || {};
      const st = (s.status || s.state || "unknown").toLowerCase();
      const stage = s.currentStage || s.stage || "?";
      stages[stage] = (stages[stage] || 0) + 1;
      let bucket = "unknown";
      if (["done", "succeeded", "published", "complete"].some((k) => st.includes(k))) bucket = "done";
      else if (["fail", "error"].some((k) => st.includes(k))) bucket = "failed";
      else if (["run", "active", "submit", "build", "deploy"].some((k) => st.includes(k))) bucket = "running";
      else if (st.includes("queue") || st.includes("wait")) bucket = "queued";
      tally[bucket]++;
      perRun.push({ id: r.id, runId: r.runId, stage, status: st, bucket });
    });
    return { total: runs.length, tally, stages, perRun, terminal: tally.done + tally.failed === runs.length };
  }, { noProxy });
}

export function logs(cfg, { runId, stage = "validate", item } = {}) {
  ensureGcloud();
  if (!runId) throw new Error("runId required");
  const state = readJson(STATE_PATH, { completed: {} });
  const workspaceId = item || Object.values(state.completed).find((e) => e.runId === runId)?.workspaceId;
  if (!workspaceId) throw new Error("Could not resolve workspaceId; pass item=ws-<id>.");
  const uri = `gs://${cfg.bucket}/runs/${runId}/items/${workspaceId}/factory-${stage}-result.json`;
  const r = gcloud(["storage", "cat", uri], { allowFail: true });
  if (!r.ok) {
    const ls = gcloud(["storage", "ls", "-r", `gs://${cfg.bucket}/runs/${runId}/`], { allowFail: true });
    return { found: false, uri, available: ls.ok ? ls.out.split("\n") : [] };
  }
  let result; try { result = JSON.parse(r.out); } catch { return { found: true, uri, raw: r.out }; }
  return { found: true, uri, result };
}

// Fleet roster: catalog × .ge-state.json (no network).
export async function fleetStatus(cfg) {
  const cat = await loadCatalog();
  const state = readJson(STATE_PATH, { completed: {}, failed: {} });
  const localWorkspaces = cfg.mode === "local" ? localWorkspaceIndexByUseCase() : new Map();
  // Read cutover: when enabled, the ledger is the source of per-agent run state
  // (replacing the .ge-state.json completed/failed lookups below). Falls back to
  // the files when the flag is off or the ledger is unavailable/empty.
  let ledgerFleet = null;
  if (ledgerReadsEnabled()) {
    const l = await runLedger();
    const map = l ? l.fleetByUseCase() : null;
    if (map && map.size) ledgerFleet = map;
  }

  // Local mode: best-effort runId discovery from the canonical factory journal.
  let localRunIndex = {};
  if (cfg.mode === "local") {
    const indexPath = join(FACTORY_DATA_ROOT, "runs", "index.json");
    const indexEntries = readJson(indexPath, []);
    // Map agentId → latest runId (agentId↔catalogId alignment is required; no fuzzy match).
    for (const entry of indexEntries) {
      if (entry.agentId && entry.runId) localRunIndex[entry.agentId] = entry.runId;
    }
  }

  const agents = cat.map((u) => {
    const lg = ledgerFleet?.get(u.id) || null;
    // Per-agent merge: the ledger is authoritative for agents it knows about; agents
    // it hasn't recorded fall back to the legacy state file. This keeps defaulting
    // reads on safe even before a backfill (no agent silently loses its state).
    const c = lg ? (lg.status !== "failed" ? { runId: lg.runId, workspaceId: lg.workspaceId } : null) : state.completed[u.id];
    const f = lg ? (lg.status === "failed" ? { error: lg.error || "failed" } : null) : state.failed[u.id];
    const local = localWorkspaces.get(u.id) || null;
    let runId = c?.runId || null;
    // Best-effort: if still null in local mode, use harness journal index.
    if (!runId && cfg.mode === "local" && localRunIndex[u.id]) {
      runId = localRunIndex[u.id];
    }
    if (!runId && local?.runId) runId = local.runId;
    const workspaceId = c?.workspaceId || local?.id || null;
    return {
      id: u.id, title: u.title, department: u.department,
      runId,
      workspaceId,
      status: c || workspaceId ? "submitted" : f ? "failed" : "none",
      error: f?.error || null,
      localWorkspaceUpdatedAt: local?.updatedAt || null,
    };
  });
  const byDept = {}; const byStatus = {};
  for (const a of agents) { byDept[a.department] = (byDept[a.department] || 0) + 1; byStatus[a.status] = (byStatus[a.status] || 0) + 1; }
  const base = { total: agents.length, byDept, byStatus, agents };
  const health = buildFleetHealth(base, { repoRoot: REPO_ROOT });
  return { ...base, health, agents: health.agents };
}

export async function missionPlan(cfg, { ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false } = {}) {
  const fleet = await fleetStatus(cfg);
  return buildFactoryAutopilotMission({ cfg, fleet, ids, targetStage, repair, attempts, runPreview });
}

export async function journeyPlan(cfg, {
  scenario = null,
  usecaseId = null,
  spec = null,
  systems = [],
  ids = [],
  targetStage = "preview",
  tasks = [],
  graph = null,
} = {}) {
  const [status, fleet] = await Promise.all([
    Promise.resolve(statusBoard(cfg)),
    fleetStatus(cfg),
  ]);
  return buildJourneyPlan({
    scenario,
    spec,
    usecaseId,
    systems,
    ids,
    targetStage,
    mode: cfg.mode || "local",
    status,
    fleet,
    tasks,
    graph,
  });
}

// Read the NDJSON log for a run/stage. Local → .ge/factory/runs (harness writes stage "run");
// remote → GCS object the worker tees to.
export function tailLog(cfg, { runId, stage, item } = {}) {
  if ((cfg.mode || "local") === "local") {
    const s = stage || "run"; // harness journal uses stage "run" per agent invocation
    const p = join(FACTORY_DATA_ROOT, "runs", runId, `${s}.ndjson`);
    return { found: existsSync(p), source: p, ndjson: existsSync(p) ? readFileSync(p, "utf8") : "" };
  }
  const uri = `gs://${cfg.bucket}/runs/${runId}/items/${item || runId}/${stage}.ndjson`;
  const r = gcloud(["storage", "cat", uri], { allowFail: true });
  return { found: r.ok, source: uri, ndjson: r.ok ? r.out : "" };
}

export function readArtifact(cfg, { runId, item, name } = {}) {
  if ((cfg.mode || "local") === "local") {
    const workspaceId = item || runId;
    const p = join(LOCAL_PROJECTS, workspaceId, name);
    return { found: existsSync(p), source: p, content: existsSync(p) ? readFileSync(p, "utf8") : "" };
  }
  const uri = `gs://${cfg.bucket}/runs/${runId}/items/${item}/${name}`;
  const r = gcloud(["storage", "cat", uri], { allowFail: true });
  return { found: r.ok, source: uri, content: r.ok ? r.out : "" };
}

function parseIdList(ids) {
  return String(Array.isArray(ids) ? ids.join(",") : ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function sync(cfg, { ids = "", force = false, commit = true, push = false, log = noop } = {}) {
  ensureGcloud();
  const state = readJson(STATE_PATH, { completed: {} });
  const requested = parseIdList(ids);
  const requestedSet = new Set(requested);
  const entries = Object.entries(state.completed).filter(([id, entry]) => {
    if (!requestedSet.size) return true;
    return requestedSet.has(id) || requestedSet.has(entry?.workspaceId);
  });
  if (!entries.length) throw new Error("No completed runs to sync.");
  const outDir = join(REPO_ROOT, "generated-agents");
  mkdirSync(outDir, { recursive: true });
  const synced = readJson(SYNC_STATE_PATH, { synced: {} });
  let ok = 0, fail = 0;
  await pool(entries, 4, async ([id, e]) => {
    if (!force && synced.synced[id]?.runId === e.runId) return;
    const uri = `gs://${cfg.bucket}/runs/${e.runId}/items/${e.workspaceId}/agent-result.tar.gz`;
    const dest = join(outDir, id);
    const tmp = join(REPO_ROOT, ".tmp", `${id}.tar.gz`);
    mkdirSync(dirname(tmp), { recursive: true });
    const dl = gcloud(["storage", "cp", uri, tmp], { allowFail: true });
    if (!dl.ok) { fail++; log(`✗ ${id} (no archive yet)`); return; }
    rmSync(dest, { recursive: true, force: true }); mkdirSync(dest, { recursive: true });
    try { execFileSync("tar", ["-xzf", tmp, "-C", dest], { stdio: "ignore" }); } catch { fail++; return; }
    rmSync(tmp, { force: true });
    synced.synced[id] = { runId: e.runId, at: new Date().toISOString() };
    writeJson(SYNC_STATE_PATH, synced);
    ok++; log(`✓ ${id}`);
  });
  rmSync(join(REPO_ROOT, ".tmp"), { recursive: true, force: true });
  let committed = false;
  if (ok && commit) {
    run("git", ["add", "generated-agents", ".generated-agents-sync-state.json"], { capture: false });
    run("git", ["commit", "-m", `chore(agents): sync ${ok} generated workspace(s)`], { capture: false });
    committed = true;
    if (push) run("git", ["push"], { capture: false });
  }
  return { mode: "remote", ids: entries.map(([id]) => id), synced: ok, failed: fail, committed, pushed: !!(ok && commit && push) };
}

const GEN_DIR = join(REPO_ROOT, "apps/factory");
const FACTORY_DATA_ROOT = STATE_PATHS.factory.root;
const LOCAL_PROJECTS = STATE_PATHS.factory.workspaces;
const LEDGER_PATH = join(FACTORY_HARNESS_DIR, "ledger.sqlite");

// Durable run ledger (ADR 0001). Best-effort + cached: opens a local SQLite ledger
// when a driver is available (bun:sqlite / better-sqlite3), else returns null and
// callers fall back to the legacy files. Set GE_LEDGER=0 to disable. The cloud
// control plane points this at AlloyDB via pgAdapter (future phase).
let _ledgerPromise = null;
export async function runLedger() {
  if (process.env.GE_LEDGER === "0") return null;
  if (!_ledgerPromise) _ledgerPromise = openRunLedger(LEDGER_PATH).catch(() => null);
  return _ledgerPromise;
}
// Never let a ledger write break a build/ship: best-effort, swallow errors.
async function ledgerWrite(fn) {
  try {
    const l = await runLedger();
    if (l) await fn(l);
  } catch (error) {
    // The ledger is a shadow store in phase 1, so a write failure is never fatal to
    // the build/ship — but silently dropping it means a run/submission can vanish
    // from the durable ledger with no trace, leaving the UI/CLI disagreeing about
    // run state. Surface the reason; the swallow (and fallback to file state) is unchanged.
    console.warn(`[factory-core] ledger write skipped — durable run/job record not persisted: ${error?.message || String(error)}`);
  }
}

// Read cutover (default ON; set GE_LEDGER_READS=0 to disable): fleetStatus and
// listFactoryRuns treat the ledger as authoritative and fall back to the legacy
// files for anything it doesn't cover. Safe to default on because both readers
// merge per-item — an empty/partial ledger never drops file-only state.
function ledgerReadsEnabled() {
  return process.env.GE_LEDGER_READS !== "0";
}

// Read APIs over the ledger (used by `ge ledger …`; the console can adopt these to
// replace the file-based fleet/runs reads once validated against a live install).
export async function ledgerRuns({ limit = 25 } = {}) {
  const l = await runLedger();
  return l ? l.listRuns({ limit }) : [];
}
export async function ledgerRun(id) {
  const l = await runLedger();
  return l ? l.getRun(id) : null;
}
export async function ledgerFleet() {
  const l = await runLedger();
  if (!l) return [];
  return [...l.fleetByUseCase().entries()].map(([useCaseId, s]) => ({ useCaseId, ...s }));
}
// Next action per work item, from the ledger's latest state + the pipeline state
// machine (ADR 0001 phase 4). One authoritative "what happens next" for build /
// ship / retry / regenerate — replacing ad-hoc stageReached skipping.
export async function ledgerPlan({ targetStage = "previewed", mode = null } = {}) {
  const l = await runLedger();
  if (!l) return [];
  const effectiveMode = mode || "local";
  return [...l.fleetByUseCase().entries()].map(([useCaseId, s]) => ({
    useCaseId,
    workspaceId: s.workspaceId || null,
    ...planWorkItem({ stage: s.stage, status: s.status === "failed" ? "failed" : "done" }, { targetStage, mode: effectiveMode }),
  }));
}
// ── declarative reconcile (ADR 0001 phase 5) ──────────────────────────────────
const APPLY_MANIFEST_PATH = join(REPO_ROOT, "ge.manifest.json");

// Gather actual platform + fleet state and diff it against the desired manifest.
export async function applyPlan(cfg, { manifest = null } = {}) {
  const board = statusBoard(cfg);
  const planes = {};
  for (const p of board.planes || []) {
    const n = (p.name || "").toLowerCase();
    const key = n.includes("tool") || n.includes("mcp") ? "mcp" : n.includes("data") ? "data" : "infra";
    planes[key] = !!p.up;
  }
  const source = manifest ? "inline" : existsSync(APPLY_MANIFEST_PATH) ? "ge.manifest.json" : "default";
  const m = manifest || readJson(APPLY_MANIFEST_PATH, {});
  const plan = await ledgerPlan({ targetStage: m?.fleet?.target || "previewed", mode: cfg.mode });
  return { ...planReconcile(m, { planes, plan }), source };
}

// Execute the reconcile plan in dependency order (gateway → data → tool plane →
// agents). Reuses the same tested core operations the CLI/console already call.
export async function applyApply(cfg, { manifest = null, log = noop } = {}) {
  const planResult = await applyPlan(cfg, { manifest });
  for (const step of planResult.steps) {
    log(`→ ${step.id}: ${step.command}`);
    if (step.kind === "platform") {
      if (step.plane === "infra") await up(cfg, { planes: ["infra"], log });
      else if (step.plane === "data") await dataUp(cfg, { log });
      else if (step.plane === "mcp") mcpDeploy(cfg, { log });
    } else if (step.kind === "fleet") {
      const ids = step.agents.join(",");
      if (cfg.mode === "remote") await provisionOps.provision(cfg, { ids, log });
      else await provisionOps.provisionLocal(cfg, { ids, log });
    }
    log(`✓ ${step.id}`);
  }
  return { applied: planResult.steps.length, plan: planResult };
}

// One-shot import of the legacy file stores (.ge-state.json + factory-run-*.json)
// into the ledger. Idempotent — safe to re-run.
export async function ledgerBackfillFromDisk() {
  const l = await runLedger();
  if (!l) return { runs: 0, items: 0, note: "ledger unavailable (no sqlite driver — run under bun)" };
  const stateJson = readJson(STATE_PATH, null);
  const factoryRuns = [];
  if (existsSync(FACTORY_HARNESS_DIR)) {
    for (const f of readdirSync(FACTORY_HARNESS_DIR).filter((name) => /^factory-run-.*\.json$/.test(name))) {
      const run = readJson(join(FACTORY_HARNESS_DIR, f), null);
      if (run) factoryRuns.push(run);
    }
  }
  return l.backfill({ stateJson, factoryRuns });
}
function missingWorkspaceReport({ id, workspaceId, stage }) {
  return {
    kind: "ge.workspace_doctor",
    ok: false,
    blocked: true,
    workspace: workspaceId || id,
    stage,
    summary: { total: 1, passed: 0, failed: 1 },
    blockers: [{
      id: "workspace:missing",
      message: `No local generated workspace exists for ${id}. Run Factory build before using the workspace doctor.`,
      detail: { requestedId: id, resolvedWorkspaceId: workspaceId || null },
    }],
    repairTasks: [{
      id: "factory:build-local-workspace",
      command: `ge agents build --ids ${id} --local`,
      reason: "Workspace doctor can only inspect generated local workspaces. Factory must create this workspace first.",
      owner: "factory",
    }],
    evidence: {},
  };
}

export function workspaceDoctor(cfg, { id, stage = "preview" } = {}) {
  if ((cfg.mode || "local") !== "local") {
    return {
      ok: false,
      blocked: true,
      workspace: id,
      stage,
      blockers: [{ id: "console:mode", message: "Workspace doctor is available for local workspaces in this console path." }],
      repairTasks: [],
    };
  }
  const workspaceId = resolveLocalWorkspaceId(id);
  if (!localWorkspaceExists(workspaceId)) {
    return missingWorkspaceReport({ id, workspaceId, stage });
  }
  const result = run("node", ["src/cli.js", "workspace", "doctor", workspaceId, "--stage", stage], { cwd: GEN_DIR, allowFail: true });
  if (!result.out && !result.ok) {
    return {
      ok: false,
      blocked: true,
      workspace: workspaceId,
      stage,
      blockers: [{ id: "doctor:command", message: result.err || "workspace doctor command failed" }],
      repairTasks: [],
    };
  }
  return parseJsonObjects(result.out || result.err || "{}");
}

export function workspaceRepair(cfg, { id, stage = "preview", attempts = 3, agent = "none", runPreview = false } = {}) {
  if ((cfg.mode || "local") !== "local") {
    return {
      ok: false,
      blocked: true,
      workspace: id,
      stage,
      finalDoctor: {
        blockers: [{ id: "console:mode", message: "Workspace repair is available for local workspaces in this console path." }],
      },
      attempts: [],
    };
  }
  const workspaceId = resolveLocalWorkspaceId(id);
  if (!localWorkspaceExists(workspaceId)) {
    const doctor = missingWorkspaceReport({ id, workspaceId, stage });
    return {
      kind: "ge.workspace_repair",
      ok: false,
      workspace: workspaceId,
      stage,
      attempts: [],
      finalDoctor: doctor,
      nextRepairTasks: doctor.repairTasks,
    };
  }
  const args = [
    "src/cli.js", "workspace", "repair", workspaceId,
    "--stage", stage,
    "--attempts", String(attempts),
    "--agent", agent,
    "--run-preview", runPreview ? "true" : "false",
  ];
  const result = run("node", args, { cwd: GEN_DIR, allowFail: true });
  if (!result.out && !result.ok) {
    return {
      ok: false,
      blocked: true,
      workspace: workspaceId,
      stage,
      finalDoctor: {
        blockers: [{ id: "repair:command", message: result.err || "workspace repair command failed" }],
      },
      attempts: [],
    };
  }
  return parseJsonObjects(result.out || result.err || "{}");
}

export function infra(cfg, { sub, gatewayImage, workerImage, yes = false, log = noop } = {}) {
  return factoryPlane.infra(cfg, { sub, gatewayImage, workerImage, yes, log });
}

const factoryPlane = createFactoryPlane({
  repoRoot: REPO_ROOT,
  terraformDir: TF_DIR,
  ensureGcloud,
  ensureTerraform,
  ensureAgentIdentityConfig,
  persistAgentIdentityConfig,
  tfOutputs,
  run,
  gcloud,
  gitShortSha,
  writeTextFile: (path, content) => writeFileSync(path, content, "utf8"),
});

const dataPlane = createDataPlane({
  ensureTerraform,
  ensureGcloud,
  describeProjectNumber,
  infra: (...args) => factoryPlane.infra(...args),
  tfOutputs,
  readConfig: () => readJson(CONFIG_PATH, {}),
  writeConfig: (config) => writeJson(CONFIG_PATH, config),
  gcloud,
});

const mcpPlane = createMcpPlane({
  departments: DEPARTMENTS,
  serviceDir: MCP_SERVICE_DIR,
  repoRoot: REPO_ROOT,
  ensureGcloud,
  describeRun: (...args) => factoryPlane.describeRun(...args),
  serviceUrl,
  readConfig: () => readJson(CONFIG_PATH, {}),
  writeConfig: (config) => writeJson(CONFIG_PATH, config),
  gcloud,
});

// commandDoctor/doctorAll/preflightCommand + local-toolchain preflight now live in
// doctor.mjs; wired here the same way as the plane modules above, since they need
// live run/gcloud plus these already-composed plane instances.
const doctorPlane = createDoctorPlane({
  run,
  gcloud,
  ensureBin,
  binCheck,
  dataPlane,
  factoryPlane,
  commandMeta,
  commandRequirements,
  doctor,
  dataDoctor,
  mcpDoctor,
});
export const { commandDoctor, preflightCommand, doctorAll } = doctorPlane;
export const { localPreflight, ensureHarnessVenv, ensureLocalUv } = doctorPlane;

// provision/provisionLocal/ship/syncLocal/devexCheck/devexSmoke + setMode now live
// in provision.mjs; wired here for the same reason (live run/gcloud/gateway/ledger
// access, which only exist once factory-core.mjs composes them).
const provisionOps = createProvisionOps({
  run,
  gcloud,
  ensureGcloud,
  ensureBin,
  withGateway,
  postJson,
  loadCatalog,
  runLedger,
  ledgerWrite,
  readJson,
  writeJson,
  localPreflight: doctorPlane.localPreflight,
  ensureLocalUv: doctorPlane.ensureLocalUv,
  repoRoot: REPO_ROOT,
  configPath: CONFIG_PATH,
  factoryHarnessDir: FACTORY_HARNESS_DIR,
  factoryDataRoot: FACTORY_DATA_ROOT,
  genDir: GEN_DIR,
});
export const { provision, provisionLocal, setMode, devexSmoke, devexCheck, syncLocal, ship } = provisionOps;

export function build(cfg, { target, log = noop } = {}) {
  return factoryPlane.build(cfg, { target, log });
}

// Adopt a hand-managed project into Terraform (the cracked way): generate
// import {} blocks for the resources that already exist, then a single parallel
// `terraform apply` (additive google_project_iam_member — no serial gcloud loop).
// Plan-by-default so you review the adopt/create diff; --apply runs it, then the
// two-phase image build + doctor (via `up`).
export async function cutover(cfg, { apply = false, log = noop } = {}) {
  ensureTerraform(); ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  if (!cfg.projectNumber) { const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true }); if (r.ok) cfg.projectNumber = r.out; }
  if (!cfg.geAppId) throw new Error("geAppId required. Set GEMINI_ENTERPRISE_APP_ID.");
  const p = cfg.project, region = cfg.region;
  cfg.bucket = cfg.bucket || `${p}-ge-agent-factory`;
  const sa = (id) => `projects/${p}/serviceAccounts/${id}@${p}.iam.gserviceaccount.com`;

  // Resources likely to already exist on a hand-managed project — adopt them so
  // `apply` reconciles rather than fails on "already exists". `terraform plan`
  // will flag anything else to add here (e.g. an already-deployed Cloud Run
  // service); that's the normal adopt loop.
  const imports = [
    ["google_storage_bucket.factory", cfg.bucket],
    ["google_firestore_database.default", `${p}/(default)`],
    ["google_service_account.runner", sa("ge-agent-factory-runner")],
    ["google_service_account.gateway", sa("ge-agent-factory-runtime")],
    ["google_service_account.builder", sa("ge-agent-factory-builder")],
    ["google_cloud_tasks_queue.factory_stages", `projects/${p}/locations/${region}/queues/ge-agent-factory-stages`],
    ["google_artifact_registry_repository.containers", `projects/${p}/locations/${region}/repositories/ge-agent-factory`],
  ];
  const body = "# GENERATED by `ge cutover` — adopts pre-existing demo resources into Terraform\n" +
    "# state. import {} blocks are one-shot (no-ops once in state); safe to delete\n" +
    "# after the first successful apply. Add lines for anything `terraform plan` flags.\n\n" +
    imports.map(([to, id]) => `import {\n  to = ${to}\n  id = ${JSON.stringify(id)}\n}\n`).join("\n");
  writeFileSync(join(TF_DIR, "imports.generated.tf"), body, "utf8");
  log(`wrote installer/terraform/imports.generated.tf (${imports.length} import blocks)`);

  if (!apply) {
    infra(cfg, { sub: "plan", log });
    return {
      mode: "plan", project: p, imports: imports.map(([to, id]) => ({ to, id })),
      note: "Reviewed the plan above. It should ADOPT the imported resources and CREATE/UPDATE the rest (IAM is additive google_project_iam_member). If plan errors with 'already exists' for another resource, add its import to installer/terraform/imports.generated.tf and re-plan. Then re-run with --apply.",
    };
  }
  const res = await up(cfg, { log }); // terraform apply (adopts via imports) → build → apply(images) → init → doctor
  return { mode: "apply", project: p, ...res };
}

// Full platform stand-up. `planes` selects which to bring up; default = all.
// The data plane + MCP IAM live in the same terraform root as the factory, so the
// infra apply already provisions the stores/IAM; the `data` step just merges their
// coordinates into .ge.json, and `mcp` deploys the per-department Cloud Run services.
export async function up(cfg, { planes = ["infra", "data", "mcp"], log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  if (!cfg.projectNumber) { const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true }); if (r.ok) cfg.projectNumber = r.out; }
  const did = [];

  if (planes.includes("infra")) {
    ensureTerraform();
    if (!cfg.geAppId) throw new Error("geAppId required (set GEMINI_ENTERPRISE_APP_ID or run `ge init`).");
    log("infra: terraform apply (factory + data stores + MCP/agent-identity IAM)"); infra(cfg, { sub: "apply", log });
    log("infra: build + push gateway/worker images"); const { gatewayImage, workerImage } = build(cfg, { log });
    log("infra: terraform apply (bind real images)"); infra(cfg, { sub: "apply", gatewayImage, workerImage, log });
    log("infra: write .ge.json"); await init(cfg, { log });
    did.push("infra");
  }

  if (planes.includes("data")) {
    log("data: merge store coordinates → .ge.json");
    dataPlane.mergeDataPlaneOutputs(cfg);
    Object.assign(cfg, loadConfig({ project: cfg.project }));
    did.push("data");
  }

  if (planes.includes("mcp")) {
    log("mcp: deploy per-department MCP services"); mcpDeploy(cfg, { log });
    Object.assign(cfg, loadConfig({ project: cfg.project }));
    did.push("mcp");
  }

  log("doctor: unified health report");
  const health = doctorPlane.doctorAll(cfg);
  return { planes: did, config: readJson(CONFIG_PATH, {}), health };
}

// ── data plane ──────────────────────────────────────────────────────────────
// `ge data up`: terraform apply (the data_plane.tf stores live in the same root
// as the factory infra), then merge the store coordinates into .ge.json so the
// load_data stage and the runtime backend can find them.
export async function dataUp(cfg, { log = noop } = {}) {
  return dataPlane.dataUp(cfg, { log });
}

// `ge data doctor`: confirm the shared stores exist and are reachable.
export function dataDoctor(cfg) {
  return dataPlane.dataDoctor(cfg);
}

// ── MCP tool plane ──────────────────────────────────────────────────────────
// `ge mcp deploy`: deploy the generic FastMCP server once per department (fleet
// level — like the shared builder image), recording URLs in .ge.json.
export function mcpDeploy(cfg, { depts = DEPARTMENTS, memory = "1Gi", cpu = "1", log = noop } = {}) {
  return mcpPlane.mcpDeploy(cfg, { depts, memory, cpu, log });
}

// `ge mcp doctor`: department services Ready + APIs/IAM present.
export function mcpDoctor(cfg) {
  return mcpPlane.mcpDoctor(cfg);
}

// `ge` (bare): where am I, what's stood up, and the next command to run.
export function statusBoard(cfg) {
  const haveConfig = existsSync(CONFIG_PATH) && !!cfg.project;
  const mode = cfg.mode || "local";
  const clientDoes = mode === "local"
    ? "this machine runs generate → validate (to the build boundary); deploy/register/publish need the cloud"
    : "this machine submits + observes; the cloud factory builds, deploys, and publishes";
  const planes = [];

  let factoryUp = false;
  if (cfg.project) {
    try { factoryUp = !!(factoryPlane.describeRun(cfg, cfg.gatewayService) && factoryPlane.describeRun(cfg, cfg.workerService)); } catch (error) {
      // describeRun returns null on a clean "service absent" (allowFail), so a throw
      // here means the check itself broke (e.g. gcloud missing / auth error) — i.e.
      // "deployed but unreachable", not "not deployed". Surface it so the board's
      // "not deployed" detail isn't mistaken for a confirmed absence. factoryUp stays false.
      console.warn(`[factory-core] statusBoard: factory-plane probe failed; reporting "not deployed" but the check itself errored — ${error?.message || String(error)}`);
    }
  }
  planes.push({ name: "factory", up: factoryUp, detail: factoryUp ? `${cfg.gatewayService} + ${cfg.workerService}` : "gateway/worker not deployed" });

  let dataUpd = false;
  const bucket = cfg.dataBucket || (cfg.project ? `${cfg.project}-ge-agent-data` : "");
  if (bucket && cfg.project) {
    const b = gcloud(["storage", "buckets", "describe", `gs://${bucket}`, "--project", cfg.project, "--format=value(name)"], { allowFail: true });
    dataUpd = b.ok;
  }
  planes.push({ name: "data plane", up: dataUpd, detail: dataUpd ? bucket : "stores not provisioned" });

  const svcCount = cfg.mcpServices ? Object.keys(cfg.mcpServices).length : 0;
  planes.push({ name: "tool plane", up: svcCount > 0, detail: svcCount > 0 ? `${svcCount} dept MCP service(s)` : "MCP services not deployed" });

  let next;
  if (!haveConfig) next = "ge init";
  else if (mode === "local") next = "ge agents build --canary"; // local doesn't need cloud planes stood up
  else if (!factoryUp) next = "ge up";
  else if (!dataUpd) next = "ge up --data";
  else if (svcCount === 0) next = "ge up --mcp";
  else next = "ge agents build --canary";

  return { mode, clientDoes, project: cfg.project || null, app: cfg.geAppId || null, region: cfg.region, planes, next };
}
