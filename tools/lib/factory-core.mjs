// factory-core — the engine behind the `ge` CLI and the MCP server.
//
// Operations return structured data and take an optional `log(msg)` callback for
// human progress; they never print directly and throw Error on failure. This is
// the "one core, two surfaces" seam: tools/ge.mjs renders for humans (or --json),
// tools/mcp-server.mjs exposes the same ops as typed MCP tools.

import { spawn, execFileSync } from "node:child_process";
import { parseList } from "@ge/std/list";
import { accessSync, constants, existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { basename, join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createConnection } from "node:net";
import { pool } from "./gcp.mjs";
import { findOpenPort } from "./net.mjs";
import { parseConcurrency } from "./concurrency.mjs";
import { readJson, writeJson, updateJson } from "@ge/std/json-io";
import { buildFactoryConfig, explainFactoryConfig } from "./config-schema.mjs";
import { runDocsCheck } from "./docs-check.mjs";
import { commandMeta, commandRequirements } from "./ge-command-registry.mjs";
import { buildFactoryAutopilotMission } from "./factory-autopilot-mission.mjs";
import { buildDoctorReport, createCheckCollector, runDoctorSection } from "./factory-doctor.mjs";
import { runCommand } from "./factory-exec.mjs";
import { createDataPlane } from "./data-plane.mjs";
import { createMcpPlane, mcpServiceName } from "./mcp-plane.mjs";
import { createFactoryPlane, serviceUrl, serviceEnv } from "./factory-plane.mjs";
import { buildFleetHealth } from "./fleet-health.mjs";
import { buildJourneyPlan } from "./journey-plan.mjs";
import { LEGACY_STATE_PATHS, STATE_PATHS, displayStatePath } from "./state-paths.mjs";
// Week-4: app-domain ops are imported via the two cycle-break boundary modules,
// NOT directly from apps/factory — factory-core keeps zero app imports (enforced
// by tools/check-no-app-imports.mjs).
import { loadInterviewSpecEntries, slug, validateGenerationSpec } from "./factory-catalog.mjs";
import { createFactoryPlan, runFactoryPlan, removeWorkspace, buildWorkspaceContractReport } from "./factory-local-ops.mjs";
import { openRunLedger } from "./run-ledger.mjs";
import { planWorkItem } from "./pipeline-state-machine.mjs";
import { planReconcile } from "./reconcile.mjs";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CONFIG_PATH = join(REPO_ROOT, ".ge.json");
const STATE_PATH = STATE_PATHS.envState;
const SYNC_STATE_PATH = STATE_PATHS.syncState;
const CATALOG_PATH = join(REPO_ROOT, "apps/factory/generated/use-cases.generated.json");
const AGENT_SPEC_REGISTRY_PATH = join(REPO_ROOT, "apps/factory/src/agent-spec-registry.generated.json");
const TF_DIR = join(REPO_ROOT, "installer/terraform");
const MCP_SERVICE_DIR = join(REPO_ROOT, "apps/factory/mcp-service");
const FACTORY_HARNESS_DIR = STATE_PATHS.factory.root;

export const DEPARTMENTS = ["finance", "hr", "it", "marketing", "procurement"];

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
const ensureTerraform = () => ensureBin("terraform", "Install it: `make deps-terraform` (or https://developer.hashicorp.com/terraform/install).");

function binCheck(bin, args = ["--version"]) {
  const r = run(bin, args, { allowFail: true });
  return { ok: r.ok, detail: r.ok ? (r.out.split("\n")[0] || "available") : "not found" };
}

function canWritePath(path) {
  try { accessSync(path, constants.W_OK); return true; } catch { return false; }
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

// ── auto-managed Cloud Run proxy ──────────────────────────────────────────────
function waitForPort(port, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((res, rej) => {
    const tick = () => {
      const sock = createConnection({ host: "127.0.0.1", port }, () => { sock.destroy(); res(); });
      sock.on("error", () => { sock.destroy(); Date.now() - start > timeoutMs ? rej(new Error("proxy did not start in time")) : setTimeout(tick, 400); });
    };
    tick();
  });
}
// Mint an ID token for direct (proxy-less) gateway calls. Requires run.invoker on
// the gateway for the active identity. Best-effort: returns {} on failure so the
// caller can surface a clear auth error from the gateway response.
function gatewayAuthHeader(cfg, { log = noop } = {}) {
  const args = ["auth", "print-identity-token"];
  if (cfg.gatewayUrl) args.push(`--audiences=${cfg.gatewayUrl}`);
  const r = run("gcloud", args, { allowFail: true });
  if (r.ok && r.out) return { Authorization: `Bearer ${r.out.trim()}` };
  log("warning: could not mint a gateway identity token (gcloud auth print-identity-token failed)");
  return {};
}

async function withGateway(cfg, fn, { noProxy = false, port = null, log = noop } = {}) {
  // Direct transport (ADR 0001 phase 3): call the gateway over HTTPS with a minted
  // ID token — no `gcloud run services proxy` child process. The legacy `noProxy`
  // flag still hits gatewayUrl but without auth (unchanged); gatewayTransport=direct
  // is the authenticated, tunnel-free path.
  const direct = cfg.gatewayTransport === "direct";
  if (noProxy || direct) {
    if (!cfg.gatewayUrl) throw new Error("No gateway URL. Run `ge init` or pass --gatewayUrl.");
    const headers = direct ? gatewayAuthHeader(cfg, { log }) : {};
    if (direct) log(`direct gateway ${cfg.gatewayUrl} (no proxy)`);
    return fn(cfg.gatewayUrl, { headers });
  }
  // Dynamic port by default so concurrent `ge` invocations don't collide.
  if (!port) port = await findOpenPort();
  log(`starting authenticated proxy to ${cfg.gatewayService} on :${port} …`);
  const child = spawn("gcloud", ["run", "services", "proxy", cfg.gatewayService, "--project", cfg.project, "--region", cfg.region, "--port", String(port)], { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  child.stderr?.on("data", (d) => { stderr += d; });
  const cleanup = () => { try { child.kill("SIGTERM"); } catch {} };
  process.on("exit", cleanup);
  try {
    await waitForPort(port);
    log("proxy ready");
    return await fn(`http://localhost:${port}`, { headers: {} });
  } catch (err) {
    throw new Error(`proxy failed: ${err.message}\n${stderr.split("\n").slice(0, 4).join("\n")}`);
  } finally { cleanup(); }
}
async function postJson(url, path, body, headers = {}) {
  const res = await fetch(`${url}${path}`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch {}
  return { status: res.status, ok: res.ok, json, text };
}
async function getJson(url, path, headers = {}) {
  const res = await fetch(`${url}${path}`, { headers, signal: AbortSignal.timeout(30000) });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch {}
  return { status: res.status, ok: res.ok, json, text };
}

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
function toAgent(u) {
  return {
    id: u.id, name: u.title, title: u.title, useCaseId: u.id, workspaceId: `ws-${u.id}`,
    domain: u.department, goal: u.subtitle || `${u.title} — ${u.department} specialist agent`,
    systems: u.systems || [], targetStage: "publish_enterprise", rows: "48",
  };
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
  try { result = JSON.parse(registered.out); } catch {}
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

export async function provision(cfg, { scope, ids, dept, concurrency = 2, noProxy = false, force = false, refine = true, model = null, maxOutputTokens = null, log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  if (!cfg.geAppId) throw new Error("geAppId unset. Add it to .ge.json or set GEMINI_ENTERPRISE_APP_ID.");
  let agents = (await loadCatalog()).map(toAgent);
  if (scope === "canary") agents = agents.slice(0, 1);
  else if (ids) { const set = new Set(String(ids).split(",").map((s) => s.trim())); agents = agents.filter((a) => set.has(a.id)); }
  else if (dept) { const set = new Set(String(dept).split(",").map((s) => s.trim())); agents = agents.filter((a) => set.has(a.domain)); }
  else if (scope !== "all") throw new Error("Specify a scope: canary | all | dept:<d> | ids:<a,b>");

  const state = readJson(STATE_PATH, { completed: {}, failed: {} });
  const pending = agents.filter((a) => force || !state.completed[a.id]);
  if (!pending.length) return { submitted: 0, failed: 0, total: agents.length, results: [], note: "nothing to submit (use force to resubmit)" };

  const conc = parseConcurrency(concurrency);
  const results = [];
  await withGateway(cfg, async (url, ctx = {}) => {
    await pool(pending, conc, async (a) => {
      const payload = {
        title: a.title, useCaseId: a.useCaseId, workspace: a.workspaceId, targetStage: a.targetStage,
        rows: String(a.rows), systems: a.systems, generationSpec: { domain: a.domain, description: a.goal },
        // Antigravity review+refine runs in the cloud factory by default; REFINE=0 opts out.
        refine,
        // Top-level like `refine`; the bridge (submitFactoryRun) folds these into the
        // worker payload.options and the from-usecase generation so remote builds pin
        // the same model (default gemini-3.5-flash) + output-token budget as local.
        ...(model ? { model } : {}),
        ...(maxOutputTokens != null && String(maxOutputTokens).trim() !== ""
          ? { maxOutputTokens: Number(maxOutputTokens) }
          : {}),
        target: { projectId: cfg.project, runtimeRegion: cfg.region, artifactBucket: cfg.bucket, dataBucket: cfg.dataBucket, projectNumber: cfg.projectNumber, geminiEnterpriseAppId: cfg.geAppId, serviceAccount: cfg.serviceAccount,
          // Per-dept custom MCP service URL + agent-identity principalSet → triggers the
          // register_tools MCP registration + iap.egressor grant in the worker.
          mcpServiceUrl: (cfg.mcpServices && cfg.mcpServices[a.domain]) || "", agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || "" },
      };
      const res = await postJson(url, "/api/factory/usecase", payload, ctx.headers).catch((e) => ({ ok: false, text: e.message }));
      if (res.ok && res.json?.ok) {
        state.completed[a.id] = { runId: res.json.runId, workspaceId: res.json.workspaceId, at: new Date().toISOString() };
        delete state.failed[a.id];
        results.push({ id: a.id, ok: true, runId: res.json.runId });
        log(`✓ ${a.id} → ${res.json.runId}`);
      } else {
        const error = res.json?.message || `HTTP ${res.status}: ${(res.text || "").slice(0, 120)}`;
        state.failed[a.id] = { error };
        results.push({ id: a.id, ok: false, error });
        log(`✗ ${a.id} ${error}`);
      }
      writeJson(STATE_PATH, state);
    });
  }, { noProxy, log });
  // Shadow the remote submission into the durable ledger.
  const agentById = new Map(pending.map((a) => [a.id, a]));
  await ledgerWrite((l) => l.recordRemoteSubmission({
    runId: `remote-build-${new Date().toISOString().replace(/[:.]/g, "-")}`,
    mode: "remote",
    kind: "build",
    targetStage: "published",
    items: results.map((r) => ({
      id: r.id,
      useCaseId: r.id,
      title: agentById.get(r.id)?.title || null,
      department: agentById.get(r.id)?.domain || null,
      workspaceId: state.completed?.[r.id]?.workspaceId || null,
      error: r.ok ? null : r.error,
      at: state.completed?.[r.id]?.at,
    })),
  }));
  return { submitted: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, total: pending.length, results };
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
const LOCAL_PROJECT_STORE = STATE_PATHS.factory.workspacesJson;
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
  } catch { /* ledger is a shadow store in phase 1; never fatal */ }
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
      if (cfg.mode === "remote") await provision(cfg, { ids, log });
      else await provisionLocal(cfg, { ids, log });
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
const UV_CACHE = STATE_PATHS.cache.uv;
const HARNESS_SKILLS_MANIFEST = STATE_PATHS.skills.manifest;

function workspaceStoreItems(store) {
  return Array.isArray(store?.workspaces) ? store.workspaces : [];
}

function localWorkspaceIndexByUseCase() {
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  const projects = workspaceStoreItems(store);
  const byUseCase = new Map();
  for (const project of projects) {
    if (!project?.id || !project?.useCaseId) continue;
    if (!existsSync(join(LOCAL_PROJECTS, project.id))) continue;
    const current = byUseCase.get(project.useCaseId);
    if (!current || String(project.updatedAt || project.createdAt || "") > String(current.updatedAt || current.createdAt || "")) {
      byUseCase.set(project.useCaseId, {
        ...project,
        updatedAt: project.updatedAt || project.createdAt || null,
      });
    }
  }
  return byUseCase;
}

function resolveLocalWorkspaceId(id) {
  if (!id) throw new Error("workspace id required");
  if (localWorkspaceExists(id)) return id;
  const local = localWorkspaceIndexByUseCase().get(id);
  if (local?.id && existsSync(join(LOCAL_PROJECTS, local.id))) return local.id;
  const state = readJson(STATE_PATH, { completed: {} });
  const mapped = state.completed?.[id]?.workspaceId;
  if (mapped && existsSync(join(LOCAL_PROJECTS, mapped))) return mapped;
  const wsId = id.startsWith("ws-") ? id : `ws-${id}`;
  if (existsSync(join(LOCAL_PROJECTS, wsId))) return wsId;
  return mapped || id;
}

function summarizeLocalWorkspace(workspaceId, { requestedId = null } = {}) {
  const workspacePath = join(LOCAL_PROJECTS, workspaceId);
  const manifestPath = join(workspacePath, "workspace.json");
  const manifest = readJson(manifestPath, null);
  const contract = manifest && existsSync(workspacePath)
    ? buildWorkspaceContractReport(workspacePath, { manifest, strictFiles: true })
    : null;
  return {
    id: workspaceId,
    requestedId,
    useCaseId: manifest?.useCaseId || manifest?.source?.useCaseId || requestedId || workspaceId,
    departmentId: manifest?.departmentId || manifest?.source?.departmentId || null,
    path: displayStatePath(workspacePath),
    manifest: existsSync(manifestPath) ? displayStatePath(manifestPath) : null,
    nextAction: manifest?.nextAction || null,
    nextActions: manifest?.nextActions || [],
    commands: manifest?.commands || {},
    readiness: manifest?.readiness || {},
    quality: manifest?.quality || {},
    registration: manifest?.registration || {},
    contract: contract ? {
      ok: contract.ok,
      fails: contract.manifest?.fails || 0,
      warnings: contract.manifest?.warnings || 0,
      checks: contract.checks || [],
    } : null,
    evalConfig: existsSync(join(workspacePath, "tests/eval/eval_config.json")) ? "tests/eval/eval_config.json" : null,
    smokeTest: existsSync(join(workspacePath, "tests/test_smoke.py")) ? "tests/test_smoke.py" : null,
  };
}

function summarizeLocalRunWorkspaces(run) {
  return (run?.results || [])
    .filter((item) => item.workspaceId && existsSync(join(LOCAL_PROJECTS, item.workspaceId)))
    .map((item) => ({
      ...summarizeLocalWorkspace(item.workspaceId, { requestedId: item.useCaseId }),
      status: item.status || null,
      error: item.error || null,
    }));
}

function localWorkspaceContractReports({ ids = "", allWorkspaces = false, strictFiles = true } = {}) {
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  const items = workspaceStoreItems(store);
  const requested = parseIdList(ids);
  const selected = [];
  const byId = new Map(items.map((item) => [item.id, item]));

  if (requested.length) {
    for (const id of requested) {
      const workspaceId = resolveLocalWorkspaceId(id);
      selected.push(byId.get(workspaceId) || { id: workspaceId, useCaseId: id === workspaceId ? null : id });
    }
  } else {
    for (const item of items) {
      if (allWorkspaces || item.useCaseId) selected.push(item);
    }
  }

  const seen = new Set();
  return selected
    .filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => {
      const workspacePath = join(LOCAL_PROJECTS, item.id);
      const manifestPath = join(workspacePath, "workspace.json");
      const manifest = readJson(manifestPath, null);
      if (!existsSync(workspacePath) || !manifest) {
        return {
          id: item.id,
          useCaseId: item.useCaseId || null,
          path: displayStatePath(workspacePath),
          manifest: existsSync(manifestPath) ? displayStatePath(manifestPath) : null,
          ok: false,
          fails: 1,
          warnings: 0,
          checks: [{
            id: "workspace:manifest_missing",
            name: "workspace manifest",
            status: "fail",
            detail: existsSync(workspacePath) ? "workspace.json missing" : "workspace directory missing",
            fix: item.useCaseId ? `ge agents build --ids ${item.useCaseId} --local --force` : "regenerate or remove the stale workspace registry entry",
          }],
        };
      }
      const contract = buildWorkspaceContractReport(workspacePath, { manifest, strictFiles });
      return {
        id: item.id,
        useCaseId: item.useCaseId || manifest.source?.useCaseId || manifest.useCaseId || null,
        path: displayStatePath(workspacePath),
        manifest: displayStatePath(manifestPath),
        ok: contract.ok,
        fails: contract.manifest?.fails || 0,
        warnings: contract.manifest?.warnings || 0,
        checks: contract.checks || [],
        missing: (contract.manifest?.requiredFiles || []).filter((file) => !file.exists).map((file) => file.path),
      };
    });
}

export function devexCheck(_cfg = {}, {
  ids = "",
  allWorkspaces = false,
  strictWorkspaces = true,
  docs = true,
  local = true,
} = {}) {
  const startedAt = new Date().toISOString();
  const doctor = local ? localPreflight() : null;
  const docsResult = docs ? runDocsCheck({ root: REPO_ROOT }) : null;
  const workspaceItems = localWorkspaceContractReports({
    ids,
    allWorkspaces,
    strictFiles: strictWorkspaces,
  });
  const workspaceFails = workspaceItems.filter((item) => !item.ok).length;
  const workspaceWarnings = workspaceItems.reduce((sum, item) => sum + (item.warnings || 0), 0);
  const ok = (!doctor || doctor.fails === 0) && (!docsResult || docsResult.ok) && workspaceFails === 0;
  return {
    kind: "ge.devex.check",
    ok,
    blocked: !ok,
    startedAt,
    finishedAt: new Date().toISOString(),
    doctor,
    docs: docsResult,
    workspaces: {
      checked: workspaceItems.length,
      failed: workspaceFails,
      warnings: workspaceWarnings,
      strict: strictWorkspaces,
      all: allWorkspaces,
      items: workspaceItems,
    },
    next: ok
      ? ["ge devex smoke --target validated --force", "make console"]
      : [
        doctor?.fails ? "make setup" : null,
        docsResult && !docsResult.ok ? "node tools/docs-check.mjs" : null,
        workspaceFails ? "ge devex smoke --target validated --force" : null,
      ].filter(Boolean),
  };
}

function localWorkspaceExists(id) {
  if (!id) return false;
  if (!existsSync(join(LOCAL_PROJECTS, id))) return false;
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  return workspaceStoreItems(store).some((project) => project.id === id);
}

// Sync catalog id→department lookup. Uses only the generated artifact (enough to
// map a build/ship selection to the departments it touches); returns an empty map
// if the catalog hasn't been synced yet.
function catalogDeptById() {
  try {
    if (!existsSync(CATALOG_PATH)) return new Map();
    return new Map(JSON.parse(readFileSync(CATALOG_PATH, "utf8")).map((e) => [e.id, e.department]));
  } catch {
    return new Map();
  }
}

// Which departments a build/ship selection touches. Returns null when the selection
// spans every department (all/canary, or ids we can't map) so callers gate the whole
// tool plane rather than silently skipping the check. Pure given `deptById`.
export function selectionDepartments({ ids, dept, scope } = {}, deptById = null) {
  if (dept) {
    const set = parseList(String(dept));
    return set.length ? [...new Set(set)] : null;
  }
  if (ids) {
    const map = deptById || catalogDeptById();
    const requested = parseList(String(ids));
    const depts = requested.map((id) => map.get(id));
    // If any requested id can't be mapped to a department, gate the whole tool
    // plane rather than silently under-gating the unmapped agents.
    if (depts.some((d) => !d)) return null;
    return depts.length ? [...new Set(depts)] : null;
  }
  if (scope === "canary" || scope === "all") return null;
  return null;
}

// Tool-plane readiness for a set of departments: a remote build/ship can only
// register an agent's tools if its department's MCP service is deployed
// (cfg.mcpServices[dept]). Pure; departments=null/empty gates every department.
export function toolPlaneChecks(cfg, departments) {
  const depts = (departments && departments.length) ? departments : DEPARTMENTS;
  const services = cfg.mcpServices || {};
  return depts.map((dept) => {
    const url = services[dept];
    return {
      name: `tool plane ${dept}`,
      status: url ? "pass" : "fail",
      detail: url ? `${mcpServiceName(dept)} deployed` : `${mcpServiceName(dept)} not deployed`,
      fix: url ? null : "ge mcp deploy  (run from local)",
    };
  });
}

// `ge agents ship` hands the locally-built workspace to the cloud factory by
// opening an authenticated proxy to the gateway (gcloud run services proxy),
// which needs the `cloud-run-proxy` gcloud component. On this install the gcloud
// component manager is disabled, so the component ships as an apt package — a
// missing proxy is a HARD blocker (ship cannot hand off; it fails mid-run with
// "proxy did not start in time"). Pure: pass in a probe for the proxy command.
//   probe() → { ok: boolean }   (e.g. `gcloud run services proxy --help` exit 0)
export function shipProxyCheck(probe) {
  const ok = !!probe()?.ok;
  return {
    name: "cloud-run-proxy component",
    status: ok ? "pass" : "fail",
    detail: ok ? "gcloud run services proxy available" : "cloud-run-proxy gcloud component missing (ship cannot open the gateway proxy)",
    // The gcloud component manager is disabled on this install, so
    // `gcloud components install cloud-run-proxy` is NOT valid here — use apt.
    fix: ok ? null : "sudo apt-get install google-cloud-cli-cloud-run-proxy",
  };
}

// `ge agents ship` deploy_runtime POSTs to the gateway, which 403s with "Agent
// provisioning is disabled" unless GE_ENABLE_AGENT_PROVISION=true is set on the
// gateway service (see apps/presentation/server.js). That 403 fired AFTER
// load_data already ran, so it must be a HARD pre-flight blocker. Pure: pass the
// described gateway Cloud Run service (or null) + the env reader.
//   describeGateway() → service|null ;  readEnv(service, key) → value|undefined
export function gatewayProvisionCheck(cfg, describeGateway, readEnv = serviceEnv) {
  const svc = cfg.gatewayService || "ge-agent-factory-gateway";
  const service = describeGateway();
  if (!service) {
    return {
      name: "gateway provisioning",
      status: "fail",
      detail: `${svc} not deployed (cannot confirm GE_ENABLE_AGENT_PROVISION)`,
      fix: "ge up",
    };
  }
  const enabled = readEnv(service, "GE_ENABLE_AGENT_PROVISION") === "true";
  return {
    name: "gateway provisioning",
    status: enabled ? "pass" : "fail",
    detail: enabled
      ? `${svc}: GE_ENABLE_AGENT_PROVISION=true`
      : `${svc}: GE_ENABLE_AGENT_PROVISION not true (gateway 403s "Agent provisioning is disabled" after load_data)`,
    fix: enabled ? null : `gcloud run services update ${svc} --region ${cfg.region} --update-env-vars GE_ENABLE_AGENT_PROVISION=true`,
  };
}

// `ge agents ship`/`ge data up` run load_data, which needs the BigQuery API. The
// other doctors surface a disabled BQ API only as a soft ▲, but for ship/data
// it's a HARD ✗ (load_data fails mid-run otherwise). Pure: pass a probe that
// returns whether bigquery.googleapis.com is enabled.
//   probe() → { ok: boolean, out: string }  (gcloud services list --enabled …)
export function bigQueryApiCheck(probe) {
  const result = probe() || {};
  const enabled = !!result.ok && !!result.out;
  return {
    name: "bigquery API",
    status: enabled ? "pass" : "fail",
    detail: enabled ? result.out : "bigquery.googleapis.com not enabled (load_data needs it)",
    fix: enabled ? null : "ge data up  (or gcloud services enable bigquery.googleapis.com)",
  };
}

// Local workspaces a `--force` (regenerate) selection should wipe before rebuilding.
// Pure given the store `items` and an optional catalog dept lookup.
export function selectWorkspacesForRegen(items, { ids, dept, scope } = {}, deptById = null) {
  if (ids) {
    const set = new Set(parseList(String(ids)));
    return items.filter((w) => set.has(w.id) || set.has(w.useCaseId));
  }
  if (dept) {
    const set = new Set(parseList(String(dept)));
    const map = deptById || catalogDeptById();
    return items.filter((w) => set.has(w.departmentId) || set.has(map.get(w.useCaseId)));
  }
  if (scope === "canary") return items.slice(0, 1);
  // No explicit selection (bare `ge agents build --force`) mirrors build's
  // default-to-all so the wipe set equals the rebuild set (no duplicate workspaces).
  if (!ids && !dept && (scope == null || scope === "all")) return [...items];
  return [];
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

// Repo-local Python venv for the Antigravity harness *driver* (the interpreter
// that imports google.antigravity). Created with uv — no system-Python pollution,
// no PEP-668 --break-system-packages. Idempotent: only creates/installs when
// missing. Returns the venv's python path (or null if uv/venv unavailable).
export const HARNESS_VENV_DIR = join(REPO_ROOT, ".venv");
export function harnessVenvPython(dir = HARNESS_VENV_DIR) {
  return process.platform === "win32"
    ? join(dir, "Scripts", "python.exe")
    : join(dir, "bin", "python");
}
export function ensureHarnessVenv({ log = noop } = {}) {
  const py = harnessVenvPython();
  if (!existsSync(py)) {
    log("creating repo .venv (uv, python 3.11)…");
    const made = run("uv", ["venv", "--python", "3.11", HARNESS_VENV_DIR], { capture: true, allowFail: true });
    if (!made.ok) run("uv", ["venv", HARNESS_VENV_DIR], { capture: true, allowFail: true });
  }
  if (!existsSync(py)) return null;
  const has = run(py, ["-c", "import google.antigravity"], { allowFail: true });
  if (!has.ok) {
    log("installing google-antigravity into .venv…");
    run("uv", ["pip", "install", "--python", py, "-q", "google-antigravity"], { capture: true, allowFail: true });
  }
  return py;
}

// Ensure uv + a SHARED cache for local runs. uv keeps per-project .venvs (good —
// each agent stays isolated/deployable), but points them all at one cache and
// hardlinks packages in, so installs are near-instant with ~zero duplication.
// That's the right "shared venv": shared cache + hardlink, not one .venv.
export function ensureLocalUv({ warm = false, log = noop } = {}) {
  ensureBin("uv", "Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh");
  mkdirSync(UV_CACHE, { recursive: true });
  process.env.UV_CACHE_DIR = process.env.UV_CACHE_DIR || UV_CACHE;
  process.env.UV_LINK_MODE = process.env.UV_LINK_MODE || "hardlink";
  // agents-cli as a shared uv tool (no-op if already installed).
  run("uv", ["tool", "install", "google-agents-cli"], { capture: true, allowFail: true });
  // google-antigravity SDK — the local harness driver imports google.antigravity.
  // Install it into a repo-local .venv (uv) instead of `pip --break-system-packages`
  // into a PEP-668 externally-managed system Python (the "airlock"). The venv is
  // isolated, repo-owned, and reused across runs; GE_HARNESS_PYTHON points the
  // spawned harness at it (see harness-python.js resolveHarnessPython).
  const venvPy = ensureHarnessVenv({ log });
  if (venvPy) process.env.GE_HARNESS_PYTHON = venvPy;
  if (warm) {
    log("warming shared uv cache (google-adk[eval], pydantic, pytest)…");
    run("uv", ["pip", "install", "--python", "3.11", "--no-installer-metadata", "google-adk", "google-adk[eval]", "pydantic>=2", "pytest>=8"], { capture: true, allowFail: true });
  }
  return process.env.UV_CACHE_DIR;
}

// Verify the local toolchain (uv, python 3.11, agents-cli, shared cache).
export function localPreflight() {
  mkdirSync(UV_CACHE, { recursive: true });
  const checks = [];
  const add = (name, ok, detail, fix) => checks.push({ name, status: ok ? "pass" : "fail", detail, fix: fix || null });
  const addStatus = (name, status, detail, fix) => checks.push({ name, status, detail, fix: fix || null });
  const uv = run("uv", ["--version"], { allowFail: true });
  add("uv installed", uv.ok, uv.ok ? uv.out : "not found", "curl -LsSf https://astral.sh/uv/install.sh | sh");
  const py = run("uv", ["python", "find", "3.11"], { allowFail: true });
  add("python 3.11", py.ok, py.ok ? py.out : "not found", "uv python install 3.11");
  const acli = run("agents-cli", ["--version"], { allowFail: true });
  add("agents-cli", acli.ok, acli.ok ? acli.out.split("\n")[0] : "not found", "uv tool install google-agents-cli");
  const venvPy = harnessVenvPython();
  const harnessPy = process.env.GE_HARNESS_PYTHON || (existsSync(venvPy) ? venvPy : "python3");
  const ag = run(harnessPy, ["-c", "import google.antigravity"], { allowFail: true });
  const where = harnessPy === venvPy ? ".venv" : harnessPy === "python3" ? "python3" : harnessPy;
  add("google-antigravity SDK", ag.ok, ag.ok ? `importable (${where})` : `not importable (${where})`, "make deps  (creates .venv via uv + installs the SDK)");
  add("shared uv cache", true, process.env.UV_CACHE_DIR || UV_CACHE, null);
  add("link mode", true, process.env.UV_LINK_MODE || "hardlink", "export UV_LINK_MODE=hardlink");
  const skills = readJson(HARNESS_SKILLS_MANIFEST, null);
  add("harness skills manifest", !!skills?.skills?.length, skills?.skills?.length ? `${skills.skills.length} skills discoverable` : `${displayStatePath(HARNESS_SKILLS_MANIFEST)} missing or empty`, "make skills-sync");
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  const projectIds = workspaceStoreItems(store).map((project) => project.id).filter(Boolean);
  const missingProjectDirs = projectIds.filter((id) => !existsSync(join(LOCAL_PROJECTS, id)));
  const localDirs = existsSync(LOCAL_PROJECTS)
    ? readdirSync(LOCAL_PROJECTS, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    : [];
  const orphanDirs = localDirs.filter((id) => !projectIds.includes(id));
  addStatus(
    "workspace registry",
    missingProjectDirs.length ? "fail" : orphanDirs.length ? "warn" : "pass",
    missingProjectDirs.length
      ? `${missingProjectDirs.length} registry entr${missingProjectDirs.length === 1 ? "y" : "ies"} missing workspace directories`
      : orphanDirs.length
        ? `${orphanDirs.length} workspace director${orphanDirs.length === 1 ? "y is" : "ies are"} not in workspaces.json`
        : `${projectIds.length} registered workspace${projectIds.length === 1 ? "" : "s"}`,
    missingProjectDirs.length || orphanDirs.length ? `ge agents build --local  (or resync ${displayStatePath(LOCAL_PROJECT_STORE)})` : null,
  );
  const gitignore = existsSync(join(REPO_ROOT, ".gitignore")) ? readFileSync(join(REPO_ROOT, ".gitignore"), "utf8") : "";
  addStatus(
    "generated OpenAPI ignored",
    gitignore.includes("apps/factory/simulator-systems/_openapi/") ? "pass" : "warn",
    gitignore.includes("apps/factory/simulator-systems/_openapi/") ? "private-key-like generated payloads excluded" : "generated OpenAPI payloads can trip remote private-key scanners",
    "Add apps/factory/simulator-systems/_openapi/ to .gitignore",
  );
  return { mode: "local", cacheDir: process.env.UV_CACHE_DIR || UV_CACHE, checks, fails: checks.filter((c) => c.status === "fail").length };
}

// Local mode: run the whole pipeline on this machine via the Antigravity SDK
// harness (ge-harness factory plan + run --vertex) instead of the cloud gateway.
// Generated workspaces land in .ge/factory/projects/.
export async function provisionLocal(cfg, { scope, ids, dept, limit, target = "published", vertex = true, location = null, model = null, maxOutputTokens = null, warm = false, force = false, log = noop } = {}) {
  ensureBin("node");
  if (vertex && !cfg.project) throw new Error("local --vertex needs a project (set GOOGLE_CLOUD_PROJECT or run `ge init`).");
  // One runId shared by the live ledger stream and the final ingest (idempotent).
  const ledgerRunId = `local-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const liveLedger = await runLedger();
  // Regenerate (--force): wipe the selected workspaces + registry entries so the
  // rebuild replaces them instead of leaving stale/duplicate workspaces. The wipe
  // is also recorded as a 'reset' transition (ADR 0001 phase 4) so the run's event
  // stream shows regenerate intent, not just a fresh build.
  if (force) {
    const items = workspaceStoreItems(readJson(LOCAL_PROJECT_STORE, { workspaces: [] }));
    const targets = selectWorkspacesForRegen(items, { ids, dept, scope });
    let wiped = 0;
    for (const ws of targets) {
      const present = existsSync(join(LOCAL_PROJECTS, ws.id));
      // Always remove the registry entry (clears drift); record reset only under the
      // catalog useCaseId so it converges with the rebuild's work-item row.
      await removeWorkspace({ storePath: LOCAL_PROJECT_STORE, projectsRoot: LOCAL_PROJECTS, projectId: ws.id });
      if (ws.useCaseId) { try { liveLedger?.recordReset({ runId: ledgerRunId, workItemId: ws.useCaseId }); } catch { /* best-effort */ } }
      if (present) { wiped += 1; log(`regenerate: wiped workspace ${ws.id}`); }
    }
    if (wiped) log(`regenerate: cleared ${wiped} workspace(s) — rebuilding from scratch`);
    else log("regenerate: no existing local workspaces matched the selection (nothing to wipe)");
  }
  // Shared uv cache + hardlink for all agent .venvs in this run.
  const cacheDir = ensureLocalUv({ warm, log });
  log(`uv: shared cache ${cacheDir} (hardlink)`);
  const planOptions = { target };
  if (ids) planOptions.usecases = ids;
  else if (scope === "canary") planOptions.limit = "1";
  else if (dept) planOptions.department = dept;
  else if (limit) planOptions.limit = String(limit);
  else {
    planOptions.department = "all";
    planOptions.limit = "all";
  }
  if (cfg.project) planOptions.project = cfg.project;
  planOptions.factoryDir = FACTORY_HARNESS_DIR;
  log("planning (local harness)…");
  process.env.GE_HARNESS_DATA_ROOT = FACTORY_DATA_ROOT;
  // Propagate model / token overrides to the spawned `factory generate` so locally
  // generated agents honor them (parity with the remote worker's commandEnv).
  if (model) process.env.GE_AGENT_MODEL = model;
  if (maxOutputTokens != null && String(maxOutputTokens).trim() !== "") {
    process.env.GE_AGENT_MAX_OUTPUT_TOKENS = String(maxOutputTokens);
  }
  const planResult = await createFactoryPlan({ repoRoot: GEN_DIR, dataRoot: FACTORY_DATA_ROOT, options: planOptions });
  log(`planned ${planResult.plan.totals.workItems} item(s) across ${planResult.plan.totals.departments} department(s)`);

  const runOptions = { target, continue: "true", stream: "true" };
  runOptions.factoryDir = FACTORY_HARNESS_DIR;
  runOptions.projectsDir = LOCAL_PROJECTS;
  if (vertex) {
    runOptions.vertex = "true";
    runOptions.project = cfg.project;
    runOptions.location = location || cfg.geLocation || "global";
  }
  if (model) runOptions.model = model;
  // Stream this run into the ledger live (ledgerRunId shared with the final ingest,
  // so events arrive as stages complete rather than only at the end). Best-effort.
  if (liveLedger) {
    runOptions.onEvent = (event) => {
      try { liveLedger.applyFactoryEvent(ledgerRunId, event, { mode: "local" }); } catch { /* never break the run */ }
    };
  }
  log(`running pipeline → ${target} (local harness${vertex ? ", Vertex" : ""})…`);
  const runResult = await runFactoryPlan({
    repoRoot: GEN_DIR,
    dataRoot: FACTORY_DATA_ROOT,
    planPath: planResult.planPath,
    options: runOptions,
  });
  // Final ingest reconciles the canonical run record (same id → idempotent with the
  // live stream; also the fallback when live emission was unavailable).
  await ledgerWrite((l) => l.ingestFactoryRun(runResult.run, { mode: "local", id: ledgerRunId }));
  if (!runResult.run.ok) {
    const failed = runResult.run.results.find((item) => item.error);
    throw new Error(`local harness build failed${failed ? ` for ${failed.useCaseId}: ${failed.error}` : ""}`);
  }
  const workspaces = summarizeLocalRunWorkspaces(runResult.run);
  return {
    mode: "local",
    target,
    selected: planResult.plan.totals.workItems,
    plan: planResult.planPath,
    run: runResult.runPath,
    markdown: runResult.mdPath,
    projectsDir: displayStatePath(LOCAL_PROJECTS),
    events: displayStatePath(join(FACTORY_HARNESS_DIR, "factory-events.jsonl")),
    workspaces,
    primaryWorkspace: workspaces[0] || null,
  };
}

export async function devexSmoke(cfg, {
  id = null,
  target = "validated",
  preview = false,
  vertex = false,
  warm = false,
  force = false,
  log = noop,
} = {}) {
  const startedAt = new Date().toISOString();
  const doctor = localPreflight();
  if (doctor.fails > 0) {
    return {
      kind: "ge.devex.smoke",
      ok: false,
      blocked: true,
      stage: "doctor",
      startedAt,
      finishedAt: new Date().toISOString(),
      doctor,
      fixes: doctor.checks.filter((check) => check.status === "fail").map((check) => check.fix).filter(Boolean),
      next: "make setup",
    };
  }

  setMode("local");
  const buildTarget = preview ? "previewed" : target || "validated";
  const build = await provisionLocal({ ...cfg, mode: "local" }, {
    scope: id ? undefined : "canary",
    ids: id || undefined,
    target: buildTarget,
    vertex,
    warm,
    force,
    log,
  });
  const workspace = build.primaryWorkspace || null;
  const contract = workspace?.contract || null;
  if (!workspace || !contract?.ok) {
    return {
      kind: "ge.devex.smoke",
      ok: false,
      blocked: true,
      stage: "workspace_contract",
      startedAt,
      finishedAt: new Date().toISOString(),
      mode: "local",
      target: buildTarget,
      doctor,
      build,
      workspace,
      contract,
      next: workspace ? `ge devex check --id ${workspace.id}` : "ge devex check",
    };
  }
  return {
    kind: "ge.devex.smoke",
    ok: true,
    blocked: false,
    startedAt,
    finishedAt: new Date().toISOString(),
    mode: "local",
    target: buildTarget,
    doctor,
    build,
    workspace,
    contract,
    next: [
      workspace?.commands?.doctor || (workspace ? `ge-harness workspace doctor ${workspace.id} --stage preview` : null),
      workspace?.commands?.eval || null,
      workspace?.commands?.sync || null,
      workspace?.commands?.ship || null,
    ].filter(Boolean),
  };
}

function copyWorkspaces(ids, baseDir, log) {
  let n = 0;
  for (const id of ids) {
    const dest = join(baseDir, id);
    rmSync(dest, { recursive: true, force: true }); mkdirSync(dest, { recursive: true });
    const r = run("rsync", [
      "-a",
      "--exclude", ".venv",
      "--exclude", "node_modules",
      "--exclude", "__pycache__",
      "--exclude", "*.pyc",
      "--exclude", ".pytest_cache",
      "--exclude", ".adk",
      "--exclude", ".google-agents-cli",
      "--exclude", "runs",
      "--exclude", "versions",
      "--exclude", ".ge-harness",
      `${join(LOCAL_PROJECTS, id)}/`,
      `${dest}/`,
    ], { capture: true, allowFail: true });
    if (!r.ok) {
      // No rsync: cp then prune the heavy/generated dirs so they don't get committed.
      run("cp", ["-a", `${join(LOCAL_PROJECTS, id)}/.`, dest], { capture: true, allowFail: true });
      for (const junk of [".venv", "node_modules", ".pytest_cache", ".google-agents-cli", "runs", "versions", ".ge-harness"]) rmSync(join(dest, junk), { recursive: true, force: true });
      // prune nested __pycache__ / *.pyc that cp -a carries through
      run("bash", ["-c", `find ${JSON.stringify(dest)} \\( -name __pycache__ -o -name .adk \\) -type d -prune -exec rm -rf {} + 2>/dev/null; find ${JSON.stringify(dest)} -name '*.pyc' -delete 2>/dev/null; true`], { capture: true, allowFail: true });
    }
    n++; log(`✓ ${id}`);
  }
  return n;
}

// Sync locally-generated agent workspaces to git. Default target is a DEDICATED
// repo (cfg.agentsRepo or --remote): clone it, drop the workspaces in, push from
// there — so the monorepo isn't pushed. With no repo configured, falls back to
// generated-agents/ in this repo.
export function syncLocal(cfg, { ids = "", remote, push = false, commit = true, create = false, log = noop } = {}) {
  if (!existsSync(LOCAL_PROJECTS)) throw new Error(`no local workspaces at ${LOCAL_PROJECTS} — run \`ge provision --local\` first.`);
  const dirs = readdirSync(LOCAL_PROJECTS).filter((d) => { try { return statSync(join(LOCAL_PROJECTS, d)).isDirectory(); } catch { return false; } });
  const requested = parseIdList(ids);
  let syncIds = dirs;
  if (requested.length) {
    const resolved = new Set(requested.map((id) => {
      try { return resolveLocalWorkspaceId(id); } catch { return id; }
    }));
    for (const id of requested) resolved.add(id);
    syncIds = dirs.filter((dir) => resolved.has(dir));
    if (!syncIds.length) throw new Error(`no matching local workspaces for: ${requested.join(", ")}`);
  }
  const target = remote || cfg.agentsRepo || "";

  if (target) {
    // --create: ensure the Cloud Source repo exists before cloning/pushing.
    if (create) {
      const cs = target.match(/source\.developers\.google\.com(?::\d+)?\/p\/([^/]+)\/r\/([^/]+)/);
      if (cs) {
        log(`ensuring Cloud Source repo ${cs[2]} in ${cs[1]}`);
        const r = run("gcloud", ["source", "repos", "create", cs[2], "--project", cs[1]], { capture: true, allowFail: true });
        if (!r.ok && !/already exists/i.test(r.err)) log(`⚠ repo create failed (${(r.err.split("\n")[0] || "").slice(0, 100)}) — continuing; clone will fail if it truly doesn't exist`);
      } else log("--create only supports Cloud Source URLs; skipping repo creation");
    }
    const work = join(REPO_ROOT, ".agents-repo");
    if (existsSync(join(work, ".git"))) {
      run("git", ["-C", work, "remote", "set-url", "origin", target], { capture: true, allowFail: true });
      run("git", ["-C", work, "pull", "--ff-only"], { capture: false, allowFail: true });
    } else {
      rmSync(work, { recursive: true, force: true });
      const cl = run("git", ["clone", target, work], { capture: true, allowFail: true });
      if (!cl.ok) throw new Error(`Could not clone the agents repo:\n  ${target}\nCreate it first (gcloud source repos create / your git host) on an authenticated machine, or pass an existing --remote. (${(cl.err.split("\n").find((l) => /fatal|error/i.test(l)) || cl.err.split("\n")[0] || "").trim()})`);
    }
    const n = copyWorkspaces(syncIds, work, log);
    let pushed = false;
    if (n && commit) {
      run("git", ["-C", work, "add", "-A"], { capture: false, allowFail: true });
      run("git", ["-C", work, "commit", "-m", `sync ${n} generated agent workspace(s)`], { capture: false, allowFail: true });
      if (push) { run("git", ["-C", work, "push", "origin", "HEAD"], { capture: false }); pushed = true; }
    }
    return { mode: "local", repo: target, ids: syncIds, synced: n, pushed };
  }

  const outDir = join(REPO_ROOT, "generated-agents");
  mkdirSync(outDir, { recursive: true });
  const n = copyWorkspaces(syncIds, outDir, log);
  let pushed = false;
  if (n && commit) {
    run("git", ["add", "generated-agents"], { capture: false, allowFail: true });
    run("git", ["commit", "-m", `chore(agents): sync ${n} locally-generated workspace(s)`], { capture: false, allowFail: true });
    if (push) { run("git", ["push"], { capture: false }); pushed = true; }
  }
  return { mode: "local", repo: displayStatePath(outDir), ids: syncIds, synced: n, pushed };
}

// `ge agents ship` (local → remote handoff): upload each locally-built workspace to
// GCS and submit a deploy-only run to the cloud factory that starts past the build
// boundary (default load_data → deploy_runtime → register_tools → publish_enterprise),
// consuming the prebuilt workspace instead of regenerating. Pairs with `ge agents
// build --local` (build + validate on this machine).
export async function ship(cfg, { ids, startStage = "load_data", targetStage = "publish_enterprise", concurrency = "2", noProxy = false, log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  if (!cfg.bucket) throw new Error("No artifact bucket in config.");
  if (!cfg.geAppId) throw new Error("geAppId unset. Add it to .ge.json or set GEMINI_ENTERPRISE_APP_ID.");
  if (!existsSync(LOCAL_PROJECTS)) throw new Error(`no local workspaces at ${LOCAL_PROJECTS} — run \`ge agents build --local\` first.`);
  let dirs = readdirSync(LOCAL_PROJECTS).filter((d) => { try { return statSync(join(LOCAL_PROJECTS, d)).isDirectory(); } catch { return false; } });
  if (ids) {
    const requested = parseList(String(ids));
    const resolved = new Set(requested.map((id) => {
      try { return resolveLocalWorkspaceId(id); } catch { return id; }
    }));
    dirs = dirs.filter((d) => resolved.has(d));
  }
  if (!dirs.length) throw new Error("no matching local workspaces to ship.");

  const conc = parseConcurrency(concurrency);
  const results = [];
  await withGateway(cfg, async (url, ctx = {}) => {
    await pool(dirs, conc, async (id) => {
      try {
        const wsDir = join(LOCAL_PROJECTS, id);
        const manifest = readJson(join(wsDir, "fixtures", "manifest.json"), {});
        const pipeline = readJson(join(wsDir, "mock_systems", "pipeline.json"), {});
        const useCaseId = manifest.useCaseId || pipeline.useCaseId || id;
        const title = pipeline.name || manifest.title || id;
        const domain = pipeline.domain || manifest.department || "hr";

        // tar (pruning heavy/generated dirs) → upload to the prebuilt staging path.
        const tmp = join("/tmp", `ge-ship-${id}.tar.gz`);
        const tar = run("tar", ["-czf", tmp, "--exclude=.venv", "--exclude=node_modules", "--exclude=__pycache__", "--exclude=.pytest_cache", "--exclude=runs", "--exclude=versions", "--exclude=.ge-harness", "-C", wsDir, "."], { allowFail: true });
        if (!tar.ok) throw new Error(`tar failed: ${tar.err?.split("\n")[0] || "?"}`);
        const prebuiltArchive = `gs://${cfg.bucket}/prebuilt/${id}/workspace.tar.gz`;
        const cp = gcloud(["storage", "cp", tmp, prebuiltArchive], { allowFail: true });
        if (!cp.ok) throw new Error(`upload failed: ${cp.err?.split("\n")[0] || "?"}`);

        const payload = {
          title, useCaseId, workspace: id, targetStage, startStage, prebuiltArchive,
          generationSpec: { domain },
          target: { projectId: cfg.project, runtimeRegion: cfg.region, artifactBucket: cfg.bucket, dataBucket: cfg.dataBucket, projectNumber: cfg.projectNumber, geminiEnterpriseAppId: cfg.geAppId, serviceAccount: cfg.serviceAccount,
            mcpServiceUrl: (cfg.mcpServices && cfg.mcpServices[domain]) || "", agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || "" },
        };
        const res = await postJson(url, "/api/factory/usecase", payload, ctx.headers).catch((e) => ({ ok: false, text: e.message }));
        if (res.ok && res.json?.ok) { results.push({ id, ok: true, runId: res.json.runId }); log(`✓ ${id} → ${res.json.runId} (from ${startStage})`); }
        else { const error = res.json?.message || `HTTP ${res.status}: ${(res.text || "").slice(0, 120)}`; results.push({ id, ok: false, error }); log(`✗ ${id} ${error}`); }
      } catch (e) { results.push({ id, ok: false, error: e.message }); log(`✗ ${id} ${e.message}`); }
    });
  }, { noProxy, log });
  // Shadow the ship handoff into the durable ledger.
  await ledgerWrite((l) => l.recordRemoteSubmission({
    runId: `ship-${new Date().toISOString().replace(/[:.]/g, "-")}`,
    mode: "remote",
    kind: "ship",
    targetStage,
    items: results.map((r) => ({ id: r.id, useCaseId: r.id, workspaceId: r.id, error: r.ok ? null : r.error })),
  }));
  return { submitted: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, total: dirs.length, startStage, targetStage, results };
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
  const health = doctorAll(cfg);
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

export function commandDoctor(cfg, { commandId = "up", selection = null } = {}) {
  const meta = commandMeta(commandId);
  const req = commandRequirements(commandId);
  const collector = createCheckCollector();
  const { add } = collector;
  if (!req) {
    add("command", "fail", `${commandId} is not a known doctor target`, "ge doctor --command up");
    return collector.report({ commandId, project: cfg.project, region: cfg.region });
  }

  add("command", "pass", meta?.cli || commandId, null);

  for (const bin of req.bins || []) {
    const probe = bin === "terraform" ? binCheck(bin, ["-version"]) : binCheck(bin);
    const fix = bin === "gcloud"
      ? "Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install"
      : bin === "terraform"
        ? "make deps-terraform"
        : bin === "uv"
          ? "curl -LsSf https://astral.sh/uv/install.sh | sh"
          : null;
    add(`${bin} available`, probe.ok ? "pass" : "fail", probe.detail, fix);
  }

  for (const key of req.config || []) {
    const value = cfg[key];
    const fix = key === "project"
      ? "ge init  (or set GOOGLE_CLOUD_PROJECT)"
      : key === "geAppId"
        ? "Set GEMINI_ENTERPRISE_APP_ID or run ge init after creating the app"
        : key === "gatewayUrl"
          ? "ge up"
          : key === "dataBucket"
            ? "ge data up"
            : "ge init";
    add(`config ${key}`, value ? "pass" : "fail", value || "<unset>", fix);
  }

  if (req.configWritable) {
    const configExists = existsSync(CONFIG_PATH);
    const writable = configExists ? canWritePath(CONFIG_PATH) : canWritePath(REPO_ROOT);
    add(".ge.json writable", writable ? "pass" : "fail", configExists ? CONFIG_PATH : `${REPO_ROOT} (for .ge.json)`, "Check repository permissions");
  }

  if (req.terraformRoot) {
    add("terraform root", existsSync(join(TF_DIR, "main.tf")) || existsSync(join(TF_DIR, "data_plane.tf")) ? "pass" : "fail", TF_DIR, "Restore installer/terraform");
  }

  if (req.cloudAuth) {
    const g = binCheck("gcloud");
    if (g.ok) {
      const auth = gcloud(["auth", "list", "--filter=status:ACTIVE", "--format=value(account)"], { allowFail: true });
      add("gcloud auth", auth.ok && auth.out ? "pass" : "fail", auth.out || "no active account", "gcloud auth login");
      if (cfg.project) {
        const proj = gcloud(["projects", "describe", cfg.project, "--format=value(projectId)"], { allowFail: true });
        add("project access", proj.ok && proj.out ? "pass" : "fail", proj.out || `${cfg.project} not accessible`, `gcloud config set project ${cfg.project}`);
      }
    }
  }

  if (req.localToolchain) {
    try {
      const local = localPreflight();
      for (const check of local.checks) add(`local ${check.name}`, check.status, check.detail, check.fix);
    } catch (e) {
      add("local toolchain", "fail", e.message, "make deps");
    }
  }

  if (req.dataGenerationRuntime) {
    try {
      const runtime = dataPlane.dataRuntimeDoctor();
      for (const check of runtime.checks || []) add(`data runtime ${check.name}`, check.status, check.detail, check.fix);
    } catch (e) {
      add("data runtime", "warn", e.message || String(e), "ge data doctor");
    }
  }

  // Remote build/ship register an agent's tools against its department's MCP
  // service (deployed from local via `ge mcp deploy`). Without it the agent ships
  // with no tools — so gate on the selected agents' departments (all if unknown).
  if (req.toolPlane) {
    const departments = selectionDepartments(selection || {});
    for (const check of toolPlaneChecks(cfg, departments)) add(check.name, check.status, check.detail, check.fix);
  }

  // Ship-only handoff blockers: the cloud-run-proxy gcloud component (the proxy
  // ship opens to the gateway) and GE_ENABLE_AGENT_PROVISION=true on the gateway.
  // Both previously fired mid-run; surface them here, before any cloud work.
  if (req.shipHandoff) {
    const proxy = shipProxyCheck(() => binCheck("gcloud", ["run", "services", "proxy", "--help"]));
    add(proxy.name, proxy.status, proxy.detail, proxy.fix);

    const gateway = gatewayProvisionCheck(cfg, () => factoryPlane.describeRun(cfg, cfg.gatewayService || "ge-agent-factory-gateway"));
    add(gateway.name, gateway.status, gateway.detail, gateway.fix);
  }

  // load_data (ship + data) needs the BigQuery API — a HARD failure here, not the
  // soft ▲ the other doctors show, because it otherwise fails mid load_data.
  if (req.bigQueryHard) {
    const bq = bigQueryApiCheck(() => gcloud(
      ["services", "list", "--enabled", "--project", cfg.project, "--filter=config.name=bigquery.googleapis.com", "--format=value(config.name)"],
      { allowFail: true },
    ));
    add(bq.name, bq.status, bq.detail, bq.fix);
  }

  return collector.report({ commandId, project: cfg.project, region: cfg.region });
}

export function preflightCommand(cfg, { commandId = "up", selection = null } = {}) {
  const report = commandDoctor(cfg, { commandId, selection });
  return {
    ...report,
    ok: report.fails === 0,
    status: report.fails === 0 ? "pass" : "blocked",
  };
}

// ── unified health + status board ─────────────────────────────────────────────
// One report across every plane. Each section is isolated: a thrown sub-doctor
// (e.g. no project yet) becomes a failed section rather than aborting the report.
export function doctorAll(cfg, { local = false, cloud = true, data = true, mcp = true, command } = {}) {
  const sections = [];
  const safe = (name, fn) => sections.push(runDoctorSection(name, fn));
  if (command) safe(`readiness: ${command}`, () => commandDoctor(cfg, { commandId: command }));
  if (local) safe("toolchain", () => localPreflight());
  if (cloud) safe("factory", () => doctor(cfg));
  if (data) safe("data plane", () => dataDoctor(cfg));
  if (mcp) safe("tool plane", () => mcpDoctor(cfg));
  return buildDoctorReport({ cfg, sections });
}

// `ge mode local|remote`: set the operating mode (persisted in .ge.json).
export function setMode(mode) {
  if (!["local", "remote"].includes(mode)) throw new Error(`mode must be 'local' or 'remote' (got '${mode}')`);
  const existing = readJson(CONFIG_PATH, {});
  writeJson(CONFIG_PATH, { ...existing, mode });
  return { mode };
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
    try { factoryUp = !!(factoryPlane.describeRun(cfg, cfg.gatewayService) && factoryPlane.describeRun(cfg, cfg.workerService)); } catch {}
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
