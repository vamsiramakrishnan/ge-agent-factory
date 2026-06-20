import { test, expect, describe } from "bun:test";
import {
  normalizeStatus,
  nextEventSeq,
  stageLogLines,
  STAGE_LOG_TYPE,
  applyEvent,
  orderStages,
  createRunAccumulator,
  isStageLogFrame,
  createRunLedger,
  factoryEventToLedgerOp,
  LEDGER_STAGES,
} from "./index.mjs";

// ── status normalization (ported from console runStatus.test) ─────────────────
describe("normalizeStatus", () => {
  test("maps factory/runtime/ledger jargon to one vocabulary", () => {
    for (const raw of ["pending", "queued", "planned", "none", "submitted"]) expect(normalizeStatus(raw)).toBe("pending");
    for (const raw of ["running", "active", "in_progress", "in-progress"]) expect(normalizeStatus(raw)).toBe("running");
    for (const raw of ["blocked", "pending_approval", "paused"]) expect(normalizeStatus(raw)).toBe("blocked");
    for (const raw of ["done", "complete", "completed", "passed", "ok", "success", "skipped"]) expect(normalizeStatus(raw)).toBe("done");
    for (const raw of ["failed", "error"]) expect(normalizeStatus(raw)).toBe("failed");
  });

  test("maps terminal cancelled/timeout states to failed (not pending)", () => {
    for (const raw of ["cancelled", "canceled", "aborted", "interrupted", "timed_out", "timeout", "timed-out", "TIMED OUT", "Cancelled"]) {
      expect(normalizeStatus(raw)).toBe("failed");
    }
  });

  test("is case/separator insensitive and defaults to pending", () => {
    expect(normalizeStatus("RUNNING")).toBe("running");
    expect(normalizeStatus("In Progress")).toBe("running");
    expect(normalizeStatus("")).toBe("pending");
    expect(normalizeStatus(undefined)).toBe("pending");
    expect(normalizeStatus("totally-unknown")).toBe("pending");
  });
});

// ── seq monotonicity ──────────────────────────────────────────────────────────
describe("nextEventSeq", () => {
  test("is strictly increasing across rapid same-instant calls", () => {
    const seqs = Array.from({ length: 1000 }, () => nextEventSeq());
    for (let i = 1; i < seqs.length; i++) {
      expect(seqs[i]).toBeGreaterThan(seqs[i - 1]);
    }
  });
});

// ── frame helpers ─────────────────────────────────────────────────────────────
describe("frame schema", () => {
  test("stageLogLines pulls data.lines, falls back to data.line, else []", () => {
    expect(stageLogLines({ data: { lines: ["a", "b"] } })).toEqual(["a", "b"]);
    expect(stageLogLines({ data: { line: "solo" } })).toEqual(["solo"]);
    expect(stageLogLines({ data: { lines: ["x", 1, null] } })).toEqual(["x"]);
    expect(stageLogLines({})).toEqual([]);
    expect(stageLogLines(null)).toEqual([]);
  });

  test("isStageLogFrame matches stage_log frames", () => {
    expect(isStageLogFrame({ type: STAGE_LOG_TYPE })).toBe(true);
    expect(isStageLogFrame({ type: "stage_done" })).toBe(false);
    expect(isStageLogFrame(null)).toBe(false);
  });
});

// ── pure reducer (ported from useRunStream logic) ─────────────────────────────
describe("reduceFrames", () => {
  test("started → running, done → done, ordered timeline", () => {
    const acc = createRunAccumulator();
    applyEvent({ type: "stage_started", stage: "build", ts: "2026-06-20T00:00:00.000Z" }, acc.stages, acc.signals);
    expect(acc.signals.status).toBe("running");
    expect(acc.signals.active).toBe("build");
    applyEvent({ type: "stage_done", stage: "build", ts: "2026-06-20T00:00:05.000Z" }, acc.stages, acc.signals);
    expect(acc.signals.active).toBe(null);

    const view = orderStages(acc.stages, acc.firstSeen, 999999999999999);
    expect(view).toHaveLength(1);
    expect(view[0].name).toBe("build");
    expect(view[0].status).toBe("done");
    expect(view[0].elapsedMs).toBe(5000);
  });

  test("stage_failed with error → failed run + blockedReason", () => {
    const acc = createRunAccumulator();
    applyEvent({ type: "stage_started", stage: "deploy" }, acc.stages, acc.signals);
    applyEvent({ type: "stage_failed", stage: "deploy", error: "boom" }, acc.stages, acc.signals);
    expect(acc.signals.status).toBe("failed");
    expect(acc.signals.blockedReason).toBe("boom");
  });

  test("stage_failed with blocked status → blocked, surfaces Resume reason", () => {
    const acc = createRunAccumulator();
    applyEvent({ type: "stage_failed", stage: "deploy", status: "blocked", error: "needs approval" }, acc.stages, acc.signals);
    expect(acc.signals.status).toBe("blocked");
    expect(acc.signals.blockedReason).toBe("needs approval");
    expect(orderStages(acc.stages, acc.firstSeen)[0].status).toBe("blocked");
  });

  test("run_complete trusts the terminal frame", () => {
    const acc = createRunAccumulator();
    applyEvent({ type: "stage_done", stage: "build" }, acc.stages, acc.signals);
    applyEvent({ type: "run_complete", ok: true }, acc.stages, acc.signals);
    expect(acc.signals.complete).toBe(true);
    expect(acc.signals.status).toBe("done");

    const failAcc = createRunAccumulator();
    applyEvent({ type: "run_complete", ok: false }, failAcc.stages, failAcc.signals);
    expect(failAcc.signals.status).toBe("failed");
  });

  test("canonical order first, then first-seen extras", () => {
    const acc = createRunAccumulator();
    for (const stage of ["extra", "build", "data"]) {
      acc.firstSeen.push(stage);
      applyEvent({ type: "stage_started", stage }, acc.stages, acc.signals);
    }
    const names = orderStages(acc.stages, acc.firstSeen).map((s) => s.name);
    // data + build are canonical (in that canonical order); extra appended after.
    expect(names).toEqual(["data", "build", "extra"]);
  });
});

// ── store: factoryEventToLedgerOp + an end-to-end ledger over a fake adapter ───
describe("store", () => {
  test("factoryEventToLedgerOp maps the generator stream", () => {
    expect(factoryEventToLedgerOp({ type: "run_started", total: 3 })).toMatchObject({ kind: "start", total: 3 });
    expect(factoryEventToLedgerOp({ type: "stage_done", stage: "build", useCaseId: "uc1" })).toMatchObject({ kind: "transition", stage: "build", status: "done" });
    expect(factoryEventToLedgerOp({ type: "run_done", ok: true })).toMatchObject({ kind: "complete", ok: true });
    expect(factoryEventToLedgerOp({ type: "nope" })).toBe(null);
    expect(factoryEventToLedgerOp(null)).toBe(null);
  });

  test("LEDGER_STAGES is the ordered canonical pipeline", () => {
    expect(LEDGER_STAGES[0]).toBe("planned");
    expect(LEDGER_STAGES).toContain("deployed");
  });

  // Minimal in-memory SQL-ish fake adapter exercising the ledger surface without
  // a real driver — confirms append/read/list + monotonic event seq.
  test("createRunLedger appends + reads events with monotonic seq (in-memory adapter)", () => {
    const runs = new Map();
    const items = new Map();
    const events = []; // { run_id, seq, event_key, work_item_id, stage, status, ts, error, data }
    const adapter = {
      run(sql, params = []) {
        if (/INSERT INTO ledger_runs/.test(sql)) {
          const [id, mode, kind, target_stage, scope, total, started_at, updated_at, , meta] = params;
          const prev = runs.get(id) || {};
          runs.set(id, { ...prev, id, mode, kind, target_stage, scope, status: prev.status || "running", total, ok: prev.ok ?? null, started_at, updated_at, finished_at: prev.finished_at ?? null, meta });
        } else if (/UPDATE ledger_runs SET status/.test(sql)) {
          const [status, ok, finished_at, updated_at, id] = params;
          const prev = runs.get(id) || {};
          runs.set(id, { ...prev, status, ok, finished_at, updated_at });
        } else if (/UPDATE ledger_runs SET updated_at/.test(sql)) {
          const [updated_at, id] = params;
          const prev = runs.get(id); if (prev) prev.updated_at = updated_at;
        } else if (/INSERT INTO ledger_events/.test(sql)) {
          const [run_id, seq, event_key, work_item_id, stage, status, ts, error, data] = params;
          if (!events.some((e) => e.run_id === run_id && e.event_key === event_key)) {
            events.push({ run_id, seq, event_key, work_item_id, stage, status, ts, error, data });
          }
        } else if (/INSERT INTO ledger_work_items/.test(sql)) {
          const [run_id, id, use_case_id, title, department, workspace_id, stage, status, error, updated_at] = params;
          items.set(`${run_id}:${id}`, { run_id, id, use_case_id, title, department, workspace_id, stage, status, error, updated_at });
        }
        // CREATE TABLE / ALTER / INDEX → no-op
      },
      get(sql, params = []) {
        if (/SELECT MAX\(seq\)/.test(sql)) {
          const [runId] = params;
          const m = events.filter((e) => e.run_id === runId).reduce((acc, e) => Math.max(acc, e.seq), 0);
          return { m };
        }
        if (/SELECT stage FROM ledger_work_items/.test(sql)) {
          const [runId, id] = params;
          return items.get(`${runId}:${id}`) || null;
        }
        if (/SELECT \* FROM ledger_runs WHERE id/.test(sql)) {
          const [id] = params;
          return runs.get(id) || null;
        }
        return null;
      },
      all(sql, params = []) {
        if (/FROM ledger_events WHERE run_id = \? AND seq >/.test(sql)) {
          const [runId, afterSeq] = params;
          return events.filter((e) => e.run_id === runId && e.seq > afterSeq).sort((a, b) => a.seq - b.seq);
        }
        if (/FROM ledger_work_items WHERE run_id/.test(sql)) {
          const [runId] = params;
          return [...items.values()].filter((i) => i.run_id === runId).sort((a, b) => a.id.localeCompare(b.id));
        }
        if (/FROM ledger_events WHERE run_id = \? ORDER BY seq DESC/.test(sql)) {
          const [runId] = params;
          return events.filter((e) => e.run_id === runId).sort((a, b) => b.seq - a.seq);
        }
        if (/FROM ledger_events WHERE run_id = \? AND work_item_id/.test(sql)) {
          const [runId, wid] = params;
          return events.filter((e) => e.run_id === runId && e.work_item_id === wid && e.stage != null);
        }
        if (/ORDER BY updated_at DESC/.test(sql)) {
          return [...runs.values()].sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
        }
        return [];
      },
      close() {},
    };

    const ledger = createRunLedger(adapter).migrate();
    ledger.startRun({ id: "run-1", total: 1 });
    ledger.recordTransition({ runId: "run-1", workItemId: "uc1", useCaseId: "uc1", stage: "created", status: "started", ts: "2026-06-20T00:00:00.000Z" });
    ledger.recordTransition({ runId: "run-1", workItemId: "uc1", useCaseId: "uc1", stage: "created", status: "done", ts: "2026-06-20T00:00:01.000Z" });
    ledger.completeRun({ runId: "run-1", ok: true });

    const evs = ledger.events("run-1", { afterSeq: 0 });
    expect(evs.length).toBe(2);
    // Monotonic per-run seq.
    expect(evs[0].seq).toBe(1);
    expect(evs[1].seq).toBe(2);
    expect(evs[1].seq).toBeGreaterThan(evs[0].seq);

    const summary = ledger.getRun("run-1");
    expect(summary.id).toBe("run-1");
    expect(summary.status).toBe("done");
    expect(summary.results[0].useCaseId).toBe("uc1");
  });
});
