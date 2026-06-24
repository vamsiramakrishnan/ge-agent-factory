// @ge/run-ledger — durable run/stage ledger core (framework-agnostic).
//
// The event-sourced record of long-running pipeline runs: runs → work items →
// stage events, with idempotent transitions and projections. This module carries
// NO framework coupling (no React, no DOM, no EventSource) and no hard cloud
// dependency: storage is behind a tiny `LedgerStore` adapter so the SAME logic
// runs on SQLite locally + in tests, and Postgres / AlloyDB in the cloud control
// plane. Opening is best-effort: if no driver is available the caller gets null
// and can fall back to legacy file stores — wiring this in never breaks an install.

// Canonical pipeline stages, ordered. Mirrors FACTORY_STAGES in the generator
// (kept here to avoid importing the harness just for a constant). If the harness
// changes stages, update both.
export const LEDGER_STAGES = [
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

const stageIndex = (stage) => {
  const i = LEDGER_STAGES.indexOf(stage);
  return i === -1 ? -1 : i;
};

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS ledger_runs (
    id TEXT PRIMARY KEY,
    mode TEXT NOT NULL,
    kind TEXT,
    target_stage TEXT,
    scope TEXT,
    status TEXT NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    ok INTEGER,
    started_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    finished_at TEXT,
    meta TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS ledger_work_items (
    run_id TEXT NOT NULL,
    id TEXT NOT NULL,
    use_case_id TEXT,
    title TEXT,
    department TEXT,
    workspace_id TEXT,
    stage TEXT,
    status TEXT NOT NULL,
    error TEXT,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (run_id, id)
  )`,
  `CREATE TABLE IF NOT EXISTS ledger_events (
    run_id TEXT NOT NULL,
    seq INTEGER NOT NULL DEFAULT 0,
    event_key TEXT NOT NULL,
    work_item_id TEXT,
    stage TEXT,
    status TEXT NOT NULL,
    ts TEXT NOT NULL,
    error TEXT,
    data TEXT,
    PRIMARY KEY (run_id, event_key)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_ledger_events_seq ON ledger_events (run_id, seq)`,
  `CREATE INDEX IF NOT EXISTS idx_ledger_work_items_uc ON ledger_work_items (use_case_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ledger_runs_updated ON ledger_runs (updated_at)`,
];

const nowIso = () => new Date().toISOString();
const bool = (v) => (v == null ? null : v ? 1 : 0);
const eventKey = (workItemId, stage, status) => `${workItemId || "-"}:${stage || "-"}:${status}`;
// Stable work-item id from a factory result/event: prefer the use case id so the
// live event stream and the final run ingest converge on the SAME row.
const workItemIdOf = (x) => x.useCaseId || x.id || x.workspace || null;

// Map a factory-events.jsonl event (the generator's live stream) to a ledger op.
// Pure — unit-tested; the applier below turns ops into ledger writes.
export function factoryEventToLedgerOp(event) {
  if (!event || !event.type) return null;
  const base = { workItemId: workItemIdOf(event), useCaseId: event.useCaseId || null, workspaceId: event.workspaceId || null, ts: event.ts };
  switch (event.type) {
    case "run_started": return { kind: "start", targetStage: event.targetStage || null, total: event.total || 0, startedAt: event.startedAt || event.ts };
    case "item_started": return { kind: "transition", ...base, status: "started" };
    case "stage_started": return { kind: "transition", ...base, stage: event.stage, status: "started" };
    case "stage_done": return { kind: "transition", ...base, stage: event.stage, status: "done" };
    // A stage that threw / exited non-zero. Map to a "failed" transition carrying
    // the real error so the ledger (local SQLite + the reducer) records WHY it
    // failed instead of silently dropping it (previously only started/done were
    // mapped, so a stage_error/stage_failed mirrored from the worker was a no-op).
    case "stage_error":
    case "stage_failed": return { kind: "transition", ...base, stage: event.stage, status: "failed", error: event.error || event.data?.message || "failed" };
    case "item_failed": return { kind: "transition", ...base, status: "failed", error: event.error || "failed" };
    case "item_done": return { kind: "transition", ...base, status: "done" };
    case "run_done": return { kind: "complete", ok: event.ok == null ? null : !!event.ok };
    default: return null;
  }
}

// ── ledger over a LedgerStore adapter ─────────────────────────────────────────
// adapter: { run(sql, params), all(sql, params), get(sql, params), close() }
export function createRunLedger(adapter) {
  const migrate = () => {
    for (const ddl of SCHEMA) adapter.run(ddl);
    // Backfill the seq column on a pre-existing ledger (idempotent; ignore "duplicate column").
    try { adapter.run(`ALTER TABLE ledger_events ADD COLUMN seq INTEGER NOT NULL DEFAULT 0`); } catch { /* already present */ }
    return ledger;
  };

  const touchRun = (runId, ts) => {
    adapter.run(`UPDATE ledger_runs SET updated_at = ? WHERE id = ?`, [ts, runId]);
  };

  const startRun = ({ id, mode = "local", kind = "build", targetStage = null, scope = null, total = 0, startedAt = nowIso(), meta = null }) => {
    if (!id) throw new Error("startRun requires an id");
    adapter.run(
      `INSERT INTO ledger_runs (id, mode, kind, target_stage, scope, status, total, ok, started_at, updated_at, finished_at, meta)
       VALUES (?, ?, ?, ?, ?, 'running', ?, NULL, ?, ?, NULL, ?)
       ON CONFLICT(id) DO UPDATE SET mode=excluded.mode, kind=excluded.kind, target_stage=excluded.target_stage,
         scope=excluded.scope, total=excluded.total, updated_at=excluded.updated_at`,
      [id, mode, kind, targetStage, scope, total, startedAt, startedAt, meta ? JSON.stringify(meta) : null],
    );
    return id;
  };

  // Append an event (idempotent by run+work_item+stage+status) and upsert the
  // work item's materialised current state. Replaying the same transition is a
  // no-op; ingesting a finished run twice produces no duplicates.
  const recordTransition = ({ runId, workItemId = null, useCaseId = null, title = null, department = null, workspaceId = null, stage = null, status, error = null, ts = nowIso(), data = null }) => {
    if (!runId) throw new Error("recordTransition requires runId");
    if (!status) throw new Error("recordTransition requires status");
    // Monotonic per-run sequence for SSE reconnect/dedup (gaps on duplicate keys are fine).
    const nextSeq = (adapter.get(`SELECT MAX(seq) AS m FROM ledger_events WHERE run_id = ?`, [runId])?.m || 0) + 1;
    adapter.run(
      `INSERT INTO ledger_events (run_id, seq, event_key, work_item_id, stage, status, ts, error, data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(run_id, event_key) DO NOTHING`,
      [runId, nextSeq, eventKey(workItemId, stage, status), workItemId, stage, status, ts, error, data ? JSON.stringify(data) : null],
    );
    if (workItemId) {
      const existing = adapter.get(`SELECT stage FROM ledger_work_items WHERE run_id = ? AND id = ?`, [runId, workItemId]);
      // Only advance the materialised stage forward; a late 'started' for an
      // earlier stage must not regress a work item that already reached further.
      // A 'reset' (regenerate) is the one transition allowed to rewind.
      const advance = stage && (status === "reset" || !existing || stageIndex(stage) >= stageIndex(existing.stage));
      const nextStage = advance ? stage : existing?.stage ?? stage;
      adapter.run(
        `INSERT INTO ledger_work_items (run_id, id, use_case_id, title, department, workspace_id, stage, status, error, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(run_id, id) DO UPDATE SET
           use_case_id = COALESCE(excluded.use_case_id, ledger_work_items.use_case_id),
           title = COALESCE(excluded.title, ledger_work_items.title),
           department = COALESCE(excluded.department, ledger_work_items.department),
           workspace_id = COALESCE(excluded.workspace_id, ledger_work_items.workspace_id),
           stage = excluded.stage,
           status = excluded.status,
           error = excluded.error,
           updated_at = excluded.updated_at`,
        [runId, workItemId, useCaseId, title, department, workspaceId, nextStage, status, error, ts],
      );
    }
    touchRun(runId, ts);
    return ledger;
  };

  const completeRun = ({ runId, ok = null, finishedAt = nowIso() }) => {
    adapter.run(
      `UPDATE ledger_runs SET status = ?, ok = ?, finished_at = ?, updated_at = ? WHERE id = ?`,
      [ok == null ? "done" : ok ? "done" : "failed", bool(ok), finishedAt, finishedAt, runId],
    );
    return ledger;
  };

  const itemStages = (runId, workItemId) => {
    const rows = adapter.all(
      `SELECT stage, status FROM ledger_events WHERE run_id = ? AND work_item_id = ? AND stage IS NOT NULL`,
      [runId, workItemId],
    );
    const byStage = new Map();
    for (const r of rows) {
      const prev = byStage.get(r.stage);
      // failed > done > started for display
      const rank = (s) => (s === "failed" ? 3 : s === "done" ? 2 : 1);
      if (!prev || rank(r.status) > rank(prev)) byStage.set(r.stage, r.status);
    }
    return LEDGER_STAGES
      .filter((s) => byStage.has(s))
      .map((s) => ({ name: s, status: byStage.get(s) === "started" ? "running" : byStage.get(s) }));
  };

  const summarizeRun = (run) => {
    const items = adapter.all(`SELECT * FROM ledger_work_items WHERE run_id = ? ORDER BY id`, [run.id]);
    const failed = items.filter((i) => i.status === "failed").length;
    return {
      id: run.id,
      kind: run.kind || "build",
      mode: run.mode,
      status: run.status,
      ok: run.ok == null ? null : !!run.ok,
      startedAt: run.started_at,
      updatedAt: run.updated_at,
      finishedAt: run.finished_at,
      targetStage: run.target_stage,
      planPath: null,
      runPath: null,
      eventsPath: null,
      selected: items.length || run.total || 0,
      failed,
      results: items.map((i) => ({
        id: i.id,
        useCaseId: i.use_case_id,
        title: i.title,
        department: i.department,
        status: i.status,
        targetStage: run.target_stage,
        workspaceId: i.workspace_id,
        error: i.error,
        systems: [],
        stages: itemStages(run.id, i.id),
      })),
      recentEvents: adapter
        .all(`SELECT ts, status, stage, error FROM ledger_events WHERE run_id = ? ORDER BY seq DESC`, [run.id])
        .slice(0, 8)
        .map((e) => ({ ts: e.ts, type: e.stage ? `stage_${e.status}` : e.status, stage: e.stage, level: e.status === "failed" ? "error" : "info", line: e.error || `${e.stage || "run"} ${e.status}` })),
    };
  };

  const getRun = (runId) => {
    const run = adapter.get(`SELECT * FROM ledger_runs WHERE id = ?`, [runId]);
    return run ? summarizeRun(run) : null;
  };

  // Ordered event tail for live streaming (SSE). afterSeq enables reconnect/dedup
  // exactly like the runtime daemon's event stream.
  const parseData = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };
  const normalizeEvent = (e) => ({
    seq: e.seq,
    ts: e.ts,
    type: e.stage ? `stage_${e.status}` : e.status,
    stage: e.stage,
    status: e.status,
    workItemId: e.work_item_id,
    error: e.error,
    data: parseData(e.data),
  });
  const events = (runId, { afterSeq = 0, limit = 1000 } = {}) =>
    adapter
      .all(`SELECT * FROM ledger_events WHERE run_id = ? AND seq > ? ORDER BY seq ASC LIMIT ?`, [runId, afterSeq, limit])
      .map(normalizeEvent);

  const listRuns = ({ limit = 25 } = {}) => {
    const runs = adapter.all(`SELECT * FROM ledger_runs ORDER BY updated_at DESC LIMIT ?`, [limit]);
    return runs.map(summarizeRun);
  };

  // Latest work-item state per use case (and per work-item id), for fleet rollups.
  // Replaces reading state.completed / state.failed from .ge-state.json.
  const fleetByUseCase = () => {
    const rows = adapter.all(
      `SELECT wi.*, r.updated_at AS run_updated_at FROM ledger_work_items wi
       JOIN ledger_runs r ON r.id = wi.run_id`,
      [],
    );
    const byKey = new Map();
    for (const row of rows) {
      for (const key of [row.use_case_id, row.id].filter(Boolean)) {
        const prev = byKey.get(key);
        if (!prev || String(row.updated_at) > String(prev.updated_at)) {
          byKey.set(key, {
            runId: row.run_id,
            workspaceId: row.workspace_id,
            status: row.status,
            stage: row.stage,
            error: row.error,
            updated_at: row.updated_at,
          });
        }
      }
    }
    return byKey;
  };

  // Ingest a completed factory run object (the shape written to factory-run-*.json)
  // as runs + work items + per-stage events. Idempotent.
  const ingestFactoryRun = (run, { mode = "local", id = null } = {}) => {
    if (!run) return null;
    const runId = id || run.id || `local-${run.startedAt || nowIso()}`.replace(/[:.]/g, "-");
    startRun({
      id: runId,
      mode,
      kind: "build",
      targetStage: run.targetStage || null,
      total: run.totals?.workItems ?? (run.results || []).length,
      startedAt: run.startedAt || nowIso(),
    });
    for (const result of run.results || []) {
      const base = {
        runId,
        workItemId: workItemIdOf(result),
        useCaseId: result.useCaseId,
        title: result.title,
        department: result.department,
        workspaceId: result.workspaceId,
      };
      for (const stage of result.stages || []) {
        recordTransition({ ...base, stage: stage.name, status: stage.status === "done" ? "done" : stage.status === "failed" ? "failed" : "started", ts: run.finishedAt || run.startedAt || nowIso(), error: stage.status === "failed" ? result.error : null });
      }
      // Final materialised status for the work item.
      recordTransition({ ...base, stage: result.status, status: result.error ? "failed" : "done", error: result.error || null, ts: run.finishedAt || nowIso() });
    }
    completeRun({ runId, ok: run.ok == null ? null : !!run.ok, finishedAt: run.finishedAt || nowIso() });
    return runId;
  };

  // Apply a single live factory event (from the generator's event sink) to the
  // ledger, so a run streams in as it happens rather than only at completion.
  const applyFactoryEvent = (runId, event, { mode = "local" } = {}) => {
    const op = factoryEventToLedgerOp(event);
    if (!op) return;
    if (op.kind === "start") return startRun({ id: runId, mode, kind: "build", targetStage: op.targetStage, total: op.total, startedAt: op.startedAt || event.ts });
    if (op.kind === "complete") return completeRun({ runId, ok: op.ok, finishedAt: event.ts });
    const { kind, ...transition } = op;
    return recordTransition({ runId, ...transition });
  };

  // Regenerate as a transition (ADR 0001 phase 4): rewind a work item to 'created'
  // so the pipeline rebuilds it from scratch. Recorded as a 'reset' event.
  const recordReset = ({ runId, workItemId, ts = nowIso() }) =>
    recordTransition({ runId, workItemId, stage: "created", status: "reset", ts });

  // Record a remote submission (provision/ship): one run, work items in 'submitted'.
  const recordRemoteSubmission = ({ runId, mode = "remote", kind = "build", targetStage = null, items = [], startedAt = nowIso() }) => {
    startRun({ id: runId, mode, kind, targetStage, total: items.length, startedAt });
    for (const item of items) {
      recordTransition({
        runId,
        workItemId: item.id || item.useCaseId,
        useCaseId: item.useCaseId,
        title: item.title,
        department: item.department,
        workspaceId: item.workspaceId,
        stage: item.error ? null : "created",
        status: item.error ? "failed" : "submitted",
        error: item.error || null,
        ts: item.at || startedAt,
      });
    }
    return runId;
  };

  // One-time import from the legacy file stores into the ledger.
  const backfill = ({ stateJson = null, factoryRuns = [], mode = "remote" } = {}) => {
    let runs = 0;
    let items = 0;
    for (const run of factoryRuns) {
      const runId = ingestFactoryRun(run, { mode: run.mode || "local" });
      if (runId) {
        runs += 1;
        items += (run.results || []).length;
      }
    }
    if (stateJson) {
      // .ge-state.json: { completed: {agentId: {runId, workspaceId, at}}, failed: {agentId: {error}} }
      const completed = Object.entries(stateJson.completed || {});
      const failed = Object.entries(stateJson.failed || {});
      if (completed.length || failed.length) {
        const importRunId = "backfill-remote-state";
        startRun({ id: importRunId, mode, kind: "build", status: "done", total: completed.length + failed.length });
        for (const [agentId, e] of completed) {
          recordTransition({ runId: importRunId, workItemId: agentId, useCaseId: agentId, workspaceId: e.workspaceId, stage: "created", status: "submitted", ts: e.at || nowIso(), data: { remoteRunId: e.runId } });
          items += 1;
        }
        for (const [agentId, e] of failed) {
          recordTransition({ runId: importRunId, workItemId: agentId, useCaseId: agentId, status: "failed", error: e.error || "unknown", ts: nowIso() });
          items += 1;
        }
        completeRun({ runId: importRunId, ok: failed.length === 0 });
        runs += 1;
      }
    }
    return { runs, items };
  };

  const close = () => adapter.close?.();

  const ledger = {
    migrate,
    startRun,
    recordTransition,
    completeRun,
    getRun,
    listRuns,
    events,
    fleetByUseCase,
    ingestFactoryRun,
    applyFactoryEvent,
    recordReset,
    recordRemoteSubmission,
    backfill,
    close,
    adapter,
  };
  return ledger;
}

// ── SQLite adapter (bun:sqlite native, or better-sqlite3 under node) ───────────
export async function sqliteAdapter(path = ":memory:") {
  if (typeof Bun !== "undefined") {
    const { Database } = await import("bun:sqlite");
    const db = new Database(path);
    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA foreign_keys = ON");
    return {
      run: (sql, params = []) => db.run(sql, params),
      all: (sql, params = []) => db.query(sql).all(...params),
      get: (sql, params = []) => db.query(sql).get(...params) ?? null,
      close: () => db.close(),
    };
  }
  const mod = await import("better-sqlite3").then((m) => m.default || m);
  const db = new mod(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return {
    run: (sql, params = []) => db.prepare(sql).run(...params),
    all: (sql, params = []) => db.prepare(sql).all(...params),
    get: (sql, params = []) => db.prepare(sql).get(...params) ?? null,
    close: () => db.close(),
  };
}

// ── Postgres / AlloyDB adapter (cloud control plane) ──────────────────────────
// Lazy-imports `pg` (not a sandbox dependency). Translates `?` placeholders to
// Postgres `$n`. Used in the remote control plane; the ledger logic is identical.
export async function pgAdapter(dsn) {
  const pg = await import("pg").then((m) => m.default || m);
  const pool = new pg.Pool({ connectionString: dsn });
  const toPg = (sql) => { let i = 0; return sql.replace(/\?/g, () => `$${++i}`); };
  // pg is async; we expose a synchronous-looking surface via a small queue is not
  // possible, so the ledger's pg use is async-wrapped by callers. For parity the
  // adapter returns promises; createRunLedger callers in the cloud await them.
  return {
    run: (sql, params = []) => pool.query(toPg(sql), params),
    all: async (sql, params = []) => (await pool.query(toPg(sql), params)).rows,
    get: async (sql, params = []) => (await pool.query(toPg(sql), params)).rows[0] ?? null,
    close: () => pool.end(),
  };
}

// Best-effort open: SQLite locally/in tests, else null so callers fall back to
// the legacy files without erroring.
export async function openRunLedger(path = ":memory:") {
  try {
    const adapter = await sqliteAdapter(path);
    return createRunLedger(adapter).migrate();
  } catch {
    return null;
  }
}
