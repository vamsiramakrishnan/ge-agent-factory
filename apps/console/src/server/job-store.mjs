import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..");
const DATA_DIR = process.env.GE_CONSOLE_JOB_STORE || join(REPO_ROOT, ".ge", "console", "jobs");
const DB_PATH = join(DATA_DIR, "jobs.sqlite");
const requireFromRoot = createRequire(join(REPO_ROOT, "package.json"));
const requireFromGenerator = createRequire(join(REPO_ROOT, "apps", "factory", "package.json"));

let db = null;
let dbPromise = null;

// CANONICAL DRIVER: bun:sqlite. The console is launched with bun (`make
// console-start`), so bun:sqlite is the runtime of record. The better-sqlite3
// branch is a fallback for plain-node invocations; the two have subtly different
// type coercion (e.g. integer vs bigint), so anything that opens jobs.sqlite
// under node should be covered by a cross-runtime contract test before relying
// on it. better-sqlite3 must be installed (declared in factory).
async function loadDriver(dbPath) {
  if (typeof Bun !== "undefined") {
    const { Database } = await import("bun:sqlite");
    return new Database(dbPath);
  }
  let Database;
  try { Database = requireFromRoot("better-sqlite3"); }
  catch { Database = requireFromGenerator("better-sqlite3"); }
  return new Database(dbPath);
}

async function openDatabase() {
  mkdirSync(DATA_DIR, { recursive: true });
  db = await loadDriver(DB_PATH);
  db.exec("PRAGMA busy_timeout = 5000");
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  migrate();
  return db;
}

async function ensureDb() {
  if (db) return db;
  dbPromise ||= openDatabase();
  return dbPromise;
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      argv_json TEXT NOT NULL,
      command_json TEXT,
      status TEXT NOT NULL,
      code INTEGER,
      started_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      ended_at TEXT,
      last_line TEXT,
      checks_json TEXT
    );
    CREATE TABLE IF NOT EXISTS job_events (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT NOT NULL,
      event_json TEXT NOT NULL,
      type TEXT,
      level TEXT,
      stage TEXT,
      line TEXT,
      ts TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_jobs_updated ON jobs(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_job_events_job_seq ON job_events(job_id, seq);

    CREATE TABLE IF NOT EXISTS autopilot_runs (
      id TEXT PRIMARY KEY,
      target_stage TEXT NOT NULL,
      status TEXT NOT NULL,
      options_json TEXT,
      total INTEGER NOT NULL DEFAULT 0,
      passed INTEGER NOT NULL DEFAULT 0,
      repaired INTEGER NOT NULL DEFAULT 0,
      blocked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      ended_at TEXT
    );
    CREATE TABLE IF NOT EXISTS autopilot_items (
      run_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      target_stage TEXT NOT NULL,
      status TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      blocker_json TEXT,
      doctor_json TEXT,
      repair_json TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(run_id, agent_id),
      FOREIGN KEY(run_id) REFERENCES autopilot_runs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS autopilot_events (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id TEXT NOT NULL,
      event_json TEXT NOT NULL,
      type TEXT,
      agent_id TEXT,
      line TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(run_id) REFERENCES autopilot_runs(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_autopilot_runs_updated ON autopilot_runs(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_autopilot_items_run_status ON autopilot_items(run_id, status);
    CREATE INDEX IF NOT EXISTS idx_autopilot_events_run_seq ON autopilot_events(run_id, seq);
  `);
  // Only swallow the expected "already migrated" case; surface real failures.
  try {
    db.exec("ALTER TABLE jobs ADD COLUMN checks_json TEXT");
  } catch (error) {
    if (!/duplicate column name/i.test(String(error?.message || ""))) throw error;
  }
}

export async function createAutopilotRun({ id, targetStage, options = {}, items = [], status = "running" }) {
  await ensureDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO autopilot_runs (id, target_stage, status, options_json, total, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, targetStage, status, JSON.stringify(options), items.length, now, now);
  const insert = db.prepare(`
    INSERT INTO autopilot_items (run_id, agent_id, workspace_id, target_stage, status, updated_at)
    VALUES (?, ?, ?, ?, 'pending', ?)
  `);
  for (const item of items) insert.run(id, item.agentId, item.workspaceId, targetStage, now);
  return await getAutopilotRun(id);
}

export async function appendAutopilotEvent(runId, ev) {
  await ensureDb();
  const line = typeof ev.line === "string" ? ev.line.trimEnd() : null;
  db.prepare(`
    INSERT INTO autopilot_events (run_id, event_json, type, agent_id, line, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(runId, JSON.stringify(ev), ev.type || null, ev.agentId || null, line, Date.now());
  db.prepare("UPDATE autopilot_runs SET updated_at = ? WHERE id = ?").run(new Date().toISOString(), runId);
}

export async function updateAutopilotItem(runId, agentId, patch = {}) {
  await ensureDb();
  const current = db.prepare("SELECT * FROM autopilot_items WHERE run_id = ? AND agent_id = ?").get(runId, agentId);
  if (!current) return null;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE autopilot_items
    SET status = ?, attempts = ?, blocker_json = ?, doctor_json = ?, repair_json = ?, updated_at = ?
    WHERE run_id = ? AND agent_id = ?
  `).run(
    patch.status || current.status,
    patch.attempts ?? current.attempts,
    patch.blockers !== undefined ? JSON.stringify(patch.blockers) : current.blocker_json,
    patch.doctor !== undefined ? JSON.stringify(patch.doctor) : current.doctor_json,
    patch.repair !== undefined ? JSON.stringify(patch.repair) : current.repair_json,
    now,
    runId,
    agentId,
  );
  await refreshAutopilotRunCounts(runId);
  return await getAutopilotItem(runId, agentId);
}

export async function finishAutopilotRun(id, status = "done") {
  await ensureDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE autopilot_runs SET status = ?, updated_at = ?, ended_at = ? WHERE id = ?").run(status, now, now, id);
  await refreshAutopilotRunCounts(id);
  return await getAutopilotRun(id);
}

export async function getAutopilotRun(id) {
  await ensureDb();
  const row = db.prepare("SELECT * FROM autopilot_runs WHERE id = ?").get(id);
  return row ? normalizeAutopilotRun(row) : null;
}

export async function listAutopilotRuns({ limit = 50 } = {}) {
  await ensureDb();
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
  return db.prepare("SELECT * FROM autopilot_runs ORDER BY updated_at DESC LIMIT ?").all(safeLimit).map(normalizeAutopilotRun);
}

export async function getAutopilotItem(runId, agentId) {
  await ensureDb();
  const row = db.prepare("SELECT * FROM autopilot_items WHERE run_id = ? AND agent_id = ?").get(runId, agentId);
  return row ? normalizeAutopilotItem(row) : null;
}

export async function listAutopilotItems(runId) {
  await ensureDb();
  return db.prepare("SELECT * FROM autopilot_items WHERE run_id = ? ORDER BY updated_at DESC, agent_id ASC").all(runId).map(normalizeAutopilotItem);
}

export async function listAutopilotEvents(runId, { afterSeq = 0, limit = 5000 } = {}) {
  await ensureDb();
  const rows = db.prepare(`
    SELECT seq, event_json FROM autopilot_events
    WHERE run_id = ? AND seq > ?
    ORDER BY seq ASC
    LIMIT ?
  `).all(runId, Number(afterSeq) || 0, Math.max(1, Math.min(Number(limit) || 5000, 10000)));
  return rows.map((row) => ({ seq: row.seq, event: JSON.parse(row.event_json) }));
}

async function refreshAutopilotRunCounts(runId) {
  const rows = db.prepare("SELECT status, COUNT(*) AS count FROM autopilot_items WHERE run_id = ? GROUP BY status").all(runId);
  const counts = Object.fromEntries(rows.map((row) => [row.status, row.count]));
  const passed = Number(counts.passed || 0);
  const repaired = Number(counts.repaired || 0);
  const blocked = Number(counts.blocked || 0);
  db.prepare(`
    UPDATE autopilot_runs
    SET passed = ?, repaired = ?, blocked = ?, updated_at = ?
    WHERE id = ?
  `).run(passed, repaired, blocked, new Date().toISOString(), runId);
}

export async function createJobRecord({ id, argv, command }) {
  await ensureDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO jobs (id, argv_json, command_json, status, started_at, updated_at)
    VALUES (?, ?, ?, 'running', ?, ?)
  `).run(id, JSON.stringify(argv), command ? JSON.stringify(command) : null, now, now);
  return await getJobRecord(id);
}

export async function appendJobEvent(jobId, ev) {
  await ensureDb();
  const now = Date.now();
  const line = typeof ev.line === "string" ? ev.line.trimEnd() : null;
  db.prepare(`
    INSERT INTO job_events (job_id, event_json, type, level, stage, line, ts, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(jobId, JSON.stringify(ev), ev.type || null, ev.level || null, ev.stage || null, line, ev.ts || null, now);
  db.prepare("UPDATE jobs SET updated_at = ?, last_line = COALESCE(?, last_line) WHERE id = ?")
    .run(new Date().toISOString(), line, jobId);
}

export async function finishJobRecord(id, { status, code, lastLine = null, checks = null }) {
  await ensureDb();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE jobs
    SET status = ?, code = ?, ended_at = ?, updated_at = ?, last_line = COALESCE(?, last_line), checks_json = COALESCE(?, checks_json)
    WHERE id = ?
  `).run(status, code ?? null, now, now, lastLine, checks ? JSON.stringify(checks) : null, id);
  return await getJobRecord(id);
}

export async function getJobRecord(id) {
  await ensureDb();
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id);
  return row ? normalizeJob(row) : null;
}

export async function listJobRecords({ limit = 50 } = {}) {
  await ensureDb();
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
  return db.prepare("SELECT * FROM jobs ORDER BY updated_at DESC LIMIT ?").all(safeLimit).map(normalizeJob);
}

export async function listJobEvents(id, { afterSeq = 0, limit = 5000 } = {}) {
  await ensureDb();
  const safeLimit = Math.max(1, Math.min(Number(limit) || 5000, 10000));
  const rows = db.prepare(`
    SELECT seq, event_json
    FROM job_events
    WHERE job_id = ? AND seq > ?
    ORDER BY seq ASC
    LIMIT ?
  `).all(id, Number(afterSeq) || 0, safeLimit);
  return rows.map((row) => ({ seq: row.seq, event: JSON.parse(row.event_json) }));
}

function normalizeJob(row) {
  return {
    id: row.id,
    argv: JSON.parse(row.argv_json),
    command: row.command_json ? JSON.parse(row.command_json) : null,
    status: row.status,
    code: row.code,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    endedAt: row.ended_at,
    lastLine: row.last_line,
    checks: row.checks_json ? JSON.parse(row.checks_json) : [],
  };
}

function normalizeAutopilotRun(row) {
  return {
    id: row.id,
    targetStage: row.target_stage,
    status: row.status,
    options: row.options_json ? JSON.parse(row.options_json) : {},
    total: row.total,
    passed: row.passed,
    repaired: row.repaired,
    blocked: row.blocked,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    endedAt: row.ended_at,
  };
}

function normalizeAutopilotItem(row) {
  return {
    runId: row.run_id,
    agentId: row.agent_id,
    workspaceId: row.workspace_id,
    targetStage: row.target_stage,
    status: row.status,
    attempts: row.attempts,
    blockers: row.blocker_json ? JSON.parse(row.blocker_json) : [],
    doctor: row.doctor_json ? JSON.parse(row.doctor_json) : null,
    repair: row.repair_json ? JSON.parse(row.repair_json) : null,
    updatedAt: row.updated_at,
  };
}
