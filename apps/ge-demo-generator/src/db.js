/**
 * SQLite persistence layer.
 *
 * Uses bun:sqlite when running under Bun (native, fast),
 * falls back to better-sqlite3 for Node.js.
 *
 * WAL mode for concurrent reads. All operations are synchronous.
 */
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";

let db = null;
let currentDbPath = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadDriver(dbPath) {
  // Bun: use native bun:sqlite
  if (typeof Bun !== "undefined") {
    const { Database } = await import("bun:sqlite");
    return new Database(dbPath);
  }
  // Node.js: use better-sqlite3
  const mod = await import("better-sqlite3");
  const Database = mod.default || mod;
  return new Database(dbPath);
}

export async function openDatabase(dataDir) {
  mkdirSync(dataDir, { recursive: true });
  const dbPath = join(dataDir, "app.sqlite");
  if (db && currentDbPath === dbPath) return db;
  if (db) closeDatabase();

  db = await loadDriver(dbPath);
  currentDbPath = dbPath;
  db.exec("PRAGMA busy_timeout = 5000");
  await execWithRecoveryRetry("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  await migrate();
  return db;
}

export function getDb() {
  if (!db) throw new Error("Database not initialized. Call openDatabase() first.");
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    currentDbPath = null;
  }
}

async function execWithRecoveryRetry(sql) {
  let lastError = null;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return db.exec(sql);
    } catch (error) {
      lastError = error;
      if (!String(error?.code || error?.message || "").includes("BUSY")) throw error;
      await sleep(100 * (attempt + 1));
    }
  }
  throw lastError;
}

async function migrate() {
  const stmts = [
    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'workspace',
      department_id TEXT, current_version INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY, project_id TEXT NOT NULL, name TEXT NOT NULL,
      use_case_id TEXT, department_id TEXT, stage TEXT NOT NULL DEFAULT 'briefed',
      current_version INTEGER, brief_json TEXT, dir_name TEXT NOT NULL,
      created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY, project_id TEXT NOT NULL, agent_id TEXT, title TEXT,
      created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, role TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '', tool_name TEXT, tool_detail TEXT,
      run_id TEXT, position INTEGER NOT NULL, created_at INTEGER NOT NULL,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, agent_id TEXT,
      project_id TEXT, version_number INTEGER NOT NULL,
      brief_json TEXT, file_snapshot_json TEXT, snapshot_ref TEXT,
      test_status TEXT, created_at INTEGER NOT NULL,
      FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS artifacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, agent_id TEXT NOT NULL,
      version_number INTEGER, path TEXT NOT NULL, kind TEXT, size INTEGER,
      run_id TEXT, created_at INTEGER NOT NULL,
      FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, project_id TEXT NOT NULL, title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'open',
      goal TEXT, assignee_agent_id TEXT, priority INTEGER NOT NULL DEFAULT 3,
      blocked_by_json TEXT NOT NULL DEFAULT '[]', created_by TEXT,
      accepted_at INTEGER, completed_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY(assignee_agent_id) REFERENCES agents(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS activity_events (
      id TEXT PRIMARY KEY, project_id TEXT, actor TEXT, type TEXT NOT NULL,
      entity_type TEXT, entity_id TEXT, payload_json TEXT NOT NULL DEFAULT '{}',
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS heartbeat_policies (
      agent_id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 0,
      interval_sec INTEGER NOT NULL DEFAULT 0,
      wake_on_assignment INTEGER NOT NULL DEFAULT 1,
      wake_on_on_demand INTEGER NOT NULL DEFAULT 1,
      wake_on_automation INTEGER NOT NULL DEFAULT 1,
      timeout_sec INTEGER NOT NULL DEFAULT 1800,
      grace_sec INTEGER NOT NULL DEFAULT 10,
      secret_names_json TEXT NOT NULL DEFAULT '[]',
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS agent_spec_registry (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department_id TEXT NOT NULL,
      domain_id TEXT,
      family_id TEXT NOT NULL,
      variant_of TEXT,
      source_kind TEXT NOT NULL,
      source_path TEXT,
      build_enabled INTEGER NOT NULL DEFAULT 0,
      maturity TEXT NOT NULL,
      systems_json TEXT NOT NULL DEFAULT '[]',
      spec_json TEXT NOT NULL,
      registry_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_agents_project ON agents(project_id, updated_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_conversations_project ON conversations(project_id, updated_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_conversations_agent ON conversations(agent_id)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, position)`,
    `CREATE INDEX IF NOT EXISTS idx_versions_agent ON versions(agent_id, version_number)`,
    `CREATE INDEX IF NOT EXISTS idx_artifacts_agent ON artifacts(agent_id, version_number)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id, status, updated_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_agent_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_activity_project ON activity_events(project_id, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_agent_spec_department ON agent_spec_registry(department_id, title)`,
    `CREATE INDEX IF NOT EXISTS idx_agent_spec_family ON agent_spec_registry(family_id, variant_of)`,
    `CREATE INDEX IF NOT EXISTS idx_agent_spec_source ON agent_spec_registry(source_kind, source_path)`,
  ];
  for (const sql of stmts) await execWithRecoveryRetry(sql);

  // ── Additive migrations for existing databases ──────────────
  // Only swallow the expected "already migrated" case (duplicate column). Any
  // other ALTER failure (type mismatch, disk full, locked DB, typo) must surface
  // instead of leaving the app running against a half-migrated schema.
  const safeAlter = async (sql) => {
    try {
      await execWithRecoveryRetry(sql);
    } catch (error) {
      if (/duplicate column name/i.test(String(error?.message || ""))) return;
      throw error;
    }
  };
  await safeAlter("ALTER TABLE projects ADD COLUMN current_version INTEGER");
  await safeAlter("ALTER TABLE versions ADD COLUMN project_id TEXT REFERENCES projects(id) ON DELETE CASCADE");
  await safeAlter("ALTER TABLE versions ADD COLUMN snapshot_ref TEXT");
await safeAlter("ALTER TABLE conversations ADD COLUMN agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL");
}

// ── Agent Spec Registry ─────────────────────────────────────

export function upsertAgentSpecRegistryDb(entry) {
  const now = Date.now();
  const registry = entry.registry || {};
  getDb().prepare(
    `INSERT INTO agent_spec_registry (
      id, title, department_id, domain_id, family_id, variant_of, source_kind,
      source_path, build_enabled, maturity, systems_json, spec_json, registry_json,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      department_id = excluded.department_id,
      domain_id = excluded.domain_id,
      family_id = excluded.family_id,
      variant_of = excluded.variant_of,
      source_kind = excluded.source_kind,
      source_path = excluded.source_path,
      build_enabled = excluded.build_enabled,
      maturity = excluded.maturity,
      systems_json = excluded.systems_json,
      spec_json = excluded.spec_json,
      registry_json = excluded.registry_json,
      updated_at = excluded.updated_at`
  ).run(
    entry.id,
    entry.title,
    entry.department,
    entry.domainId || null,
    registry.familyId || entry.id,
    registry.variant?.variantOf || null,
    registry.sourceKind || "unknown",
    registry.sourcePath || entry.sourcePath || null,
    registry.build?.enabled ? 1 : 0,
    registry.quality?.maturity || "unknown",
    JSON.stringify(entry.systems || []),
    JSON.stringify(entry.generationSpec || {}),
    JSON.stringify(registry),
    now,
    now,
  );
  return getAgentSpecRegistryDb(entry.id);
}

export function replaceAgentSpecRegistryDb(entries = []) {
  const d = getDb();
  const ids = new Set(entries.map((entry) => entry.id));
  const apply = () => {
    for (const entry of entries) upsertAgentSpecRegistryDb(entry);
    for (const row of d.prepare("SELECT id FROM agent_spec_registry").all()) {
      if (!ids.has(row.id)) d.prepare("DELETE FROM agent_spec_registry WHERE id = ?").run(row.id);
    }
  };
  if (typeof d.transaction === "function") d.transaction(apply)();
  else apply();
  return listAgentSpecRegistryDb();
}

export function listAgentSpecRegistryDb({ department = null, familyId = null, buildable = null, limit = 500 } = {}) {
  const where = [];
  const values = [];
  if (department) {
    where.push("department_id = ?");
    values.push(department);
  }
  if (familyId) {
    where.push("family_id = ?");
    values.push(familyId);
  }
  if (buildable != null) {
    where.push("build_enabled = ?");
    values.push(buildable ? 1 : 0);
  }
  const safeLimit = Math.max(1, Math.min(2000, Number(limit) || 500));
  values.push(safeLimit);
  const sql = `SELECT * FROM agent_spec_registry${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY department_id, title LIMIT ?`;
  return getDb().prepare(sql).all(...values).map(normalizeAgentSpecRegistryRow);
}

export function getAgentSpecRegistryDb(id) {
  const row = getDb().prepare("SELECT * FROM agent_spec_registry WHERE id = ?").get(id);
  return row ? normalizeAgentSpecRegistryRow(row) : null;
}

function normalizeAgentSpecRegistryRow(row) {
  return {
    id: row.id,
    title: row.title,
    department: row.department_id,
    domainId: row.domain_id || null,
    familyId: row.family_id,
    variantOf: row.variant_of || null,
    sourceKind: row.source_kind,
    sourcePath: row.source_path || null,
    buildable: Boolean(row.build_enabled),
    maturity: row.maturity,
    systems: row.systems_json ? JSON.parse(row.systems_json) : [],
    generationSpec: row.spec_json ? JSON.parse(row.spec_json) : {},
    registry: row.registry_json ? JSON.parse(row.registry_json) : {},
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// ── Projects ─────────────────────────────────────────────────

export function listProjectsDb() {
  return getDb().prepare("SELECT * FROM projects ORDER BY updated_at DESC").all().map(normalizeProject);
}

export function getProjectDb(id) {
  const row = getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id);
  return row ? normalizeProject(row) : null;
}

export function insertProjectDb({ id, name, kind = "workspace", departmentId = null }) {
  const now = Date.now();
  getDb().prepare(
    "INSERT INTO projects (id, name, kind, department_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, name, kind, departmentId, now, now);
  return getProjectDb(id);
}

export function touchProjectDb(id) {
  getDb().prepare("UPDATE projects SET updated_at = ? WHERE id = ?").run(Date.now(), id);
}

export function updateProjectDb(id, fields) {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(fields)) {
    const col = k.replace(/([A-Z])/g, "_$1").toLowerCase();
    sets.push(`${col} = ?`);
    vals.push(v);
  }
  sets.push("updated_at = ?");
  vals.push(Date.now());
  vals.push(id);
  getDb().prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`).run(...vals);
}

export function deleteProjectDb(id) {
  const d = getDb();
  // Explicit child-table deletes as safety (CASCADE should handle, but be thorough)
  const agentIds = d.prepare("SELECT id FROM agents WHERE project_id = ?").all(id).map(r => r.id);
  for (const aid of agentIds) {
    d.prepare("DELETE FROM artifacts WHERE agent_id = ?").run(aid);
  }
  // Delete versions by both agent_id and project_id
  for (const aid of agentIds) {
    d.prepare("DELETE FROM versions WHERE agent_id = ?").run(aid);
  }
  d.prepare("DELETE FROM versions WHERE project_id = ?").run(id);
  d.prepare("DELETE FROM agents WHERE project_id = ?").run(id);
  const convIds = d.prepare("SELECT id FROM conversations WHERE project_id = ?").all(id).map(r => r.id);
  for (const cid of convIds) {
    d.prepare("DELETE FROM messages WHERE conversation_id = ?").run(cid);
  }
  d.prepare("DELETE FROM conversations WHERE project_id = ?").run(id);
  // Finally delete the project row itself
  d.prepare("DELETE FROM projects WHERE id = ?").run(id);
}

function normalizeProject(row) {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    departmentId: row.department_id,
    currentVersion: row.current_version || null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// ── Agents ───────────────────────────────────────────────────

const STAGES = ["briefed", "generated", "tested", "serving", "deployed", "registered", "published"];

export function listAgentsDb(projectId) {
  return getDb().prepare(
    "SELECT * FROM agents WHERE project_id = ? ORDER BY updated_at DESC"
  ).all(projectId).map(normalizeAgent);
}

export function getAgentDb(id) {
  const row = getDb().prepare("SELECT * FROM agents WHERE id = ?").get(id);
  return row ? normalizeAgent(row) : null;
}

export function insertAgentDb({ projectId, name, useCaseId = null, departmentId = null, dirName, brief = null }) {
  const id = `agent-${randomUUID().slice(0, 8)}`;
  const now = Date.now();
  getDb().prepare(
    "INSERT INTO agents (id, project_id, name, use_case_id, department_id, stage, dir_name, brief_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, projectId, name, useCaseId, departmentId, "briefed", dirName, brief ? JSON.stringify(brief) : null, now, now);
  touchProjectDb(projectId);
  return getAgentDb(id);
}

export function updateAgentStageDb(agentId, stage) {
  if (!STAGES.includes(stage)) throw new Error(`Invalid stage: ${stage}. Valid: ${STAGES.join(", ")}`);
  const now = Date.now();
  getDb().prepare("UPDATE agents SET stage = ?, updated_at = ? WHERE id = ?").run(stage, now, agentId);
  const agent = getAgentDb(agentId);
  if (agent) touchProjectDb(agent.projectId);
  return agent;
}

export function updateAgentDb(agentId, fields) {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(fields)) {
    const col = k === "briefJson" ? "brief_json" : k.replace(/([A-Z])/g, "_$1").toLowerCase();
    sets.push(`${col} = ?`);
    vals.push(typeof v === "object" && v !== null ? JSON.stringify(v) : v);
  }
  sets.push("updated_at = ?");
  vals.push(Date.now());
  vals.push(agentId);
  getDb().prepare(`UPDATE agents SET ${sets.join(", ")} WHERE id = ?`).run(...vals);
}

export function deleteAgentDb(agentId) {
  const agent = getAgentDb(agentId);
  getDb().prepare("DELETE FROM agents WHERE id = ?").run(agentId);
  if (agent) touchProjectDb(agent.projectId);
}

function normalizeAgent(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    useCaseId: row.use_case_id,
    departmentId: row.department_id,
    stage: row.stage,
    currentVersion: row.current_version,
    dirName: row.dir_name,
    brief: row.brief_json ? JSON.parse(row.brief_json) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export { STAGES };

// ── Tasks ────────────────────────────────────────────────────

const TASK_STATUSES = ["open", "accepted", "in_progress", "blocked", "completed", "canceled"];

export function listTasksDb(projectId, { status = null, assigneeAgentId = null } = {}) {
  const where = ["project_id = ?"];
  const vals = [projectId];
  if (status) {
    where.push("status = ?");
    vals.push(status);
  }
  if (assigneeAgentId) {
    where.push("assignee_agent_id = ?");
    vals.push(assigneeAgentId);
  }
  return getDb().prepare(
    `SELECT * FROM tasks WHERE ${where.join(" AND ")} ORDER BY priority ASC, updated_at DESC`
  ).all(...vals).map(normalizeTask);
}

export function getTaskDb(projectId, taskId) {
  const row = getDb().prepare("SELECT * FROM tasks WHERE project_id = ? AND id = ?").get(projectId, taskId);
  return row ? normalizeTask(row) : null;
}

export function insertTaskDb(projectId, fields = {}) {
  const now = Date.now();
  const id = fields.id || `task-${randomUUID().slice(0, 8)}`;
  const status = TASK_STATUSES.includes(fields.status) ? fields.status : "open";
  getDb().prepare(
    `INSERT INTO tasks (
      id, project_id, title, description, status, goal, assignee_agent_id, priority,
      blocked_by_json, created_by, accepted_at, completed_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    projectId,
    String(fields.title || "Untitled task").trim() || "Untitled task",
    String(fields.description || ""),
    status,
    fields.goal || null,
    fields.assigneeAgentId || null,
    Number.isFinite(Number(fields.priority)) ? Number(fields.priority) : 3,
    JSON.stringify(Array.isArray(fields.blockedBy) ? fields.blockedBy : []),
    fields.createdBy || "user",
    status === "accepted" || status === "in_progress" ? now : null,
    status === "completed" ? now : null,
    now,
    now,
  );
  touchProjectDb(projectId);
  return getTaskDb(projectId, id);
}

export function updateTaskDb(projectId, taskId, fields = {}) {
  const current = getTaskDb(projectId, taskId);
  if (!current) return null;
  const sets = [];
  const vals = [];
  const add = (column, value) => {
    sets.push(`${column} = ?`);
    vals.push(value);
  };
  if (typeof fields.title === "string") add("title", fields.title.trim() || current.title);
  if (typeof fields.description === "string") add("description", fields.description);
  if (typeof fields.goal === "string" || fields.goal === null) add("goal", fields.goal || null);
  if (typeof fields.assigneeAgentId === "string" || fields.assigneeAgentId === null) add("assignee_agent_id", fields.assigneeAgentId || null);
  if (Number.isFinite(Number(fields.priority))) add("priority", Number(fields.priority));
  if (Array.isArray(fields.blockedBy)) add("blocked_by_json", JSON.stringify(fields.blockedBy));
  if (typeof fields.status === "string" && TASK_STATUSES.includes(fields.status)) {
    add("status", fields.status);
    if ((fields.status === "accepted" || fields.status === "in_progress") && !current.acceptedAt) add("accepted_at", Date.now());
    if (fields.status === "completed" && !current.completedAt) add("completed_at", Date.now());
    if (fields.status !== "completed") add("completed_at", null);
  }
  if (sets.length === 0) return current;
  sets.push("updated_at = ?");
  vals.push(Date.now(), projectId, taskId);
  getDb().prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE project_id = ? AND id = ?`).run(...vals);
  touchProjectDb(projectId);
  return getTaskDb(projectId, taskId);
}

export function deleteTaskDb(projectId, taskId) {
  getDb().prepare("DELETE FROM tasks WHERE project_id = ? AND id = ?").run(projectId, taskId);
  touchProjectDb(projectId);
}

function normalizeTask(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description || "",
    status: row.status,
    goal: row.goal || null,
    assigneeAgentId: row.assignee_agent_id || null,
    priority: row.priority,
    blockedBy: row.blocked_by_json ? JSON.parse(row.blocked_by_json) : [],
    createdBy: row.created_by || null,
    acceptedAt: row.accepted_at ? new Date(row.accepted_at).toISOString() : null,
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export { TASK_STATUSES };

// ── Activity Events ──────────────────────────────────────────

export function appendActivityEventDb({ projectId = null, actor = "daemon", type, entityType = null, entityId = null, payload = {} }) {
  const id = `evt-${randomUUID().slice(0, 12)}`;
  const now = Date.now();
  getDb().prepare(
    "INSERT INTO activity_events (id, project_id, actor, type, entity_type, entity_id, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, projectId, actor, type, entityType, entityId, JSON.stringify(payload || {}), now);
  return getActivityEventDb(id);
}

export function getActivityEventDb(id) {
  const row = getDb().prepare("SELECT * FROM activity_events WHERE id = ?").get(id);
  return row ? normalizeActivityEvent(row) : null;
}

export function listActivityEventsDb({ projectId = null, limit = 100 } = {}) {
  const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));
  const rows = projectId
    ? getDb().prepare("SELECT * FROM activity_events WHERE project_id = ? ORDER BY created_at DESC LIMIT ?").all(projectId, safeLimit)
    : getDb().prepare("SELECT * FROM activity_events ORDER BY created_at DESC LIMIT ?").all(safeLimit);
  return rows.map(normalizeActivityEvent);
}

function normalizeActivityEvent(row) {
  return {
    id: row.id,
    projectId: row.project_id || null,
    actor: row.actor || null,
    type: row.type,
    entityType: row.entity_type || null,
    entityId: row.entity_id || null,
    payload: row.payload_json ? JSON.parse(row.payload_json) : {},
    createdAt: new Date(row.created_at).toISOString(),
  };
}

// ── Heartbeat Policies ───────────────────────────────────────

const DEFAULT_HEARTBEAT_POLICY = Object.freeze({
  enabled: false,
  intervalSec: 0,
  wakeOnAssignment: true,
  wakeOnOnDemand: true,
  wakeOnAutomation: true,
  timeoutSec: 1800,
  graceSec: 10,
  secretNames: [],
});

export function getHeartbeatPolicyDb(agentId) {
  const row = getDb().prepare("SELECT * FROM heartbeat_policies WHERE agent_id = ?").get(agentId);
  return row ? normalizeHeartbeatPolicy(row) : { agentId, ...DEFAULT_HEARTBEAT_POLICY, updatedAt: null };
}

export function upsertHeartbeatPolicyDb(agentId, fields = {}) {
  const current = getHeartbeatPolicyDb(agentId);
  const next = {
    ...current,
    enabled: typeof fields.enabled === "boolean" ? fields.enabled : current.enabled,
    intervalSec: Number.isFinite(Number(fields.intervalSec)) ? Math.max(0, Number(fields.intervalSec)) : current.intervalSec,
    wakeOnAssignment: typeof fields.wakeOnAssignment === "boolean" ? fields.wakeOnAssignment : current.wakeOnAssignment,
    wakeOnOnDemand: typeof fields.wakeOnOnDemand === "boolean" ? fields.wakeOnOnDemand : current.wakeOnOnDemand,
    wakeOnAutomation: typeof fields.wakeOnAutomation === "boolean" ? fields.wakeOnAutomation : current.wakeOnAutomation,
    timeoutSec: Number.isFinite(Number(fields.timeoutSec)) ? Math.max(1, Number(fields.timeoutSec)) : current.timeoutSec,
    graceSec: Number.isFinite(Number(fields.graceSec)) ? Math.max(0, Number(fields.graceSec)) : current.graceSec,
    secretNames: Array.isArray(fields.secretNames) ? fields.secretNames.map((v) => String(v).trim()).filter(Boolean) : current.secretNames,
  };
  const now = Date.now();
  getDb().prepare(
    `INSERT INTO heartbeat_policies (
      agent_id, enabled, interval_sec, wake_on_assignment, wake_on_on_demand, wake_on_automation,
      timeout_sec, grace_sec, secret_names_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(agent_id) DO UPDATE SET
      enabled = excluded.enabled,
      interval_sec = excluded.interval_sec,
      wake_on_assignment = excluded.wake_on_assignment,
      wake_on_on_demand = excluded.wake_on_on_demand,
      wake_on_automation = excluded.wake_on_automation,
      timeout_sec = excluded.timeout_sec,
      grace_sec = excluded.grace_sec,
      secret_names_json = excluded.secret_names_json,
      updated_at = excluded.updated_at`
  ).run(
    agentId,
    next.enabled ? 1 : 0,
    next.intervalSec,
    next.wakeOnAssignment ? 1 : 0,
    next.wakeOnOnDemand ? 1 : 0,
    next.wakeOnAutomation ? 1 : 0,
    next.timeoutSec,
    next.graceSec,
    JSON.stringify(next.secretNames),
    now,
  );
  return getHeartbeatPolicyDb(agentId);
}

function normalizeHeartbeatPolicy(row) {
  return {
    agentId: row.agent_id,
    enabled: Boolean(row.enabled),
    intervalSec: row.interval_sec,
    wakeOnAssignment: Boolean(row.wake_on_assignment),
    wakeOnOnDemand: Boolean(row.wake_on_on_demand),
    wakeOnAutomation: Boolean(row.wake_on_automation),
    timeoutSec: row.timeout_sec,
    graceSec: row.grace_sec,
    secretNames: row.secret_names_json ? JSON.parse(row.secret_names_json) : [],
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// ── Artifacts (per agent) ────────────────────────────────────

export function recordArtifactDb({ agentId, versionNumber = null, path, kind = null, size = 0, runId = null }) {
  const now = Date.now();
  getDb().prepare(
    "INSERT INTO artifacts (agent_id, version_number, path, kind, size, run_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(agentId, versionNumber, path, kind, size, runId, now);
}

export function listArtifactsDb(agentId, versionNumber = null) {
  if (versionNumber !== null) {
    return getDb().prepare(
      "SELECT * FROM artifacts WHERE agent_id = ? AND version_number = ? ORDER BY created_at"
    ).all(agentId, versionNumber);
  }
  return getDb().prepare(
    "SELECT * FROM artifacts WHERE agent_id = ? ORDER BY created_at DESC"
  ).all(agentId);
}

// ── Conversations ────────────────────────────────────────────

export function listConversationsDb(projectId, agentId = null) {
  const sql = agentId
    ? "SELECT * FROM conversations WHERE project_id = ? AND agent_id = ? ORDER BY updated_at DESC"
    : "SELECT * FROM conversations WHERE project_id = ? AND agent_id IS NULL ORDER BY updated_at DESC";
  const args = agentId ? [projectId, agentId] : [projectId];
  return getDb().prepare(sql).all(...args).map(normalizeConversation);
}

export function createConversationDb(projectId, title = null, agentId = null) {
  const id = `chat-${randomUUID().slice(0, 8)}`;
  const now = Date.now();
  getDb().prepare(
    "INSERT INTO conversations (id, project_id, agent_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, projectId, agentId || null, title, now, now);
  return { id, projectId, agentId: agentId || null, title, createdAt: now, updatedAt: now };
}

export function deleteConversationDb(projectId, conversationId) {
  getDb().prepare("DELETE FROM conversations WHERE id = ? AND project_id = ?").run(conversationId, projectId);
}

export function renameConversationDb(projectId, conversationId, title) {
  const now = Date.now();
  getDb().prepare("UPDATE conversations SET title = ?, updated_at = ? WHERE id = ? AND project_id = ?").run(title, now, conversationId, projectId);
  return { id: conversationId, title, updatedAt: now };
}

function normalizeConversation(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    agentId: row.agent_id || null,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Messages ─────────────────────────────────────────────────

export function listMessagesDb(projectId, conversationId) {
  return getDb().prepare(
    "SELECT m.* FROM messages m JOIN conversations c ON c.id = m.conversation_id WHERE c.project_id = ? AND m.conversation_id = ? ORDER BY m.position"
  ).all(projectId, conversationId).map(normalizeMessage);
}

export function appendMessageDb(projectId, conversationId, message) {
  const id = message.id || `msg-${randomUUID().slice(0, 8)}`;
  const posRow = getDb().prepare(
    "SELECT COALESCE(MAX(position), 0) + 1 AS next_pos FROM messages WHERE conversation_id = ?"
  ).get(conversationId);
  const position = posRow?.next_pos || 1;
  const now = message.createdAt || Date.now();

  getDb().prepare(
    "INSERT INTO messages (id, conversation_id, role, content, tool_name, tool_detail, run_id, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, conversationId, message.role || "agent", message.content || "", message.toolName || null, message.toolDetail || null, message.runId || null, position, now);

  getDb().prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").run(Date.now(), conversationId);

  return { id, role: message.role, content: message.content, toolName: message.toolName, toolDetail: message.toolDetail, runId: message.runId, position, createdAt: now };
}

function normalizeMessage(row) {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    toolName: row.tool_name || undefined,
    toolDetail: row.tool_detail || undefined,
    runId: row.run_id || undefined,
    position: row.position,
    createdAt: row.created_at,
  };
}

// ── Versions ─────────────────────────────────────────────────

export function listVersionsDb(projectId) {
  const versions = getDb().prepare(
    "SELECT * FROM versions WHERE project_id = ? ORDER BY version_number"
  ).all(projectId).map(normalizeVersion);
  const project = getProjectDb(projectId);
  return { versions, currentVersion: project?.currentVersion || null };
}

export function createVersionDb(projectId, { brief = null, fileSnapshot = [], snapshotRef = null } = {}) {
  const lastRow = getDb().prepare(
    "SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM versions WHERE project_id = ?"
  ).get(projectId);
  const versionNumber = lastRow?.next || 1;
  const now = Date.now();

  getDb().prepare(
    "INSERT INTO versions (project_id, version_number, brief_json, file_snapshot_json, snapshot_ref, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(projectId, versionNumber, brief ? JSON.stringify(brief) : null, JSON.stringify(fileSnapshot), snapshotRef, now);

  getDb().prepare("UPDATE projects SET current_version = ?, updated_at = ? WHERE id = ?").run(versionNumber, now, projectId);

  return { version: versionNumber, snapshotRef, fileSnapshot, fileCount: fileSnapshot.length, createdAt: new Date(now).toISOString() };
}

export function getVersionDb(projectId, versionNumber) {
  const row = getDb().prepare(
    "SELECT * FROM versions WHERE project_id = ? AND version_number = ?"
  ).get(projectId, versionNumber);
  return row ? normalizeVersion(row) : null;
}

export function promoteVersionDb(projectId, versionNumber) {
  const exists = getDb().prepare("SELECT 1 FROM versions WHERE project_id = ? AND version_number = ?").get(projectId, versionNumber);
  if (!exists) throw new Error(`Version ${versionNumber} not found`);
  getDb().prepare("UPDATE projects SET current_version = ?, updated_at = ? WHERE id = ?").run(versionNumber, Date.now(), projectId);
  return { currentVersion: versionNumber };
}

function normalizeVersion(row) {
  return {
    version: row.version_number,
    snapshotRef: row.snapshot_ref || null,
    brief: row.brief_json ? JSON.parse(row.brief_json) : null,
    fileSnapshot: row.file_snapshot_json ? JSON.parse(row.file_snapshot_json) : [],
    fileCount: row.file_snapshot_json ? JSON.parse(row.file_snapshot_json).length : 0,
    createdAt: new Date(row.created_at).toISOString(),
  };
}
