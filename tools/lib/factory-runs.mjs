// factory-runs — run listing/summarization (`ge factory runs`, `ge status`
// board's run history). Verbatim extraction from factory-core.mjs (see
// AGENTS.md / REFACTOR-HANDOFF.md §9 methodology: verbatim move, dependency
// injection where needed, re-export from factory-core.mjs to preserve its
// public API contract).

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, dirname, resolve } from "node:path";
import { readJson } from "@ge/std/json-io";
import { STATE_PATHS } from "./state-paths.mjs";
import { runLedger, ledgerReadsEnabled } from "./ledger/factory-ledger.mjs";

const FACTORY_HARNESS_DIR = STATE_PATHS.factory.root;

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
  // NOT routed through apps/factory/src/source-clock.js's sourceTimestamp(): this
  // file lives under tools/lib/, and tools/check-no-app-imports.mjs's Rule 1 hard-bans
  // tools/lib/* -> apps/factory imports (only factory-catalog.mjs/factory-local-ops.mjs
  // are allowlisted cycle-break exceptions, and this file isn't one of them). value is
  // almost always present (a real event.ts from factory-events.jsonl); Date.now() here
  // is only a defensive fallback for a malformed/missing timestamp, never observed in
  // practice and not covered by any golden/byte-exact test. Fixing this properly needs
  // either adding this file to that allowlist or hoisting sourceTimestamp() into the
  // dependency-free @ge/std leaf package — both out of this workstream's write-set.
  return String(value || Date.now()).replace(/[^0-9A-Za-z]+/g, "-").replace(/^-|-$/g, "");
}
