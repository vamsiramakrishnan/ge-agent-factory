import { expect, test, describe, beforeEach } from "bun:test";
import { openRunLedger, createRunLedger, sqliteAdapter, LEDGER_STAGES, factoryEventToLedgerOp } from "./run-ledger.mjs";

let ledger;
beforeEach(async () => {
  // Fresh in-memory ledger per test.
  ledger = createRunLedger(await sqliteAdapter(":memory:")).migrate();
});

describe("run lifecycle", () => {
  test("startRun → transition → completeRun yields a queryable summary", () => {
    ledger.startRun({ id: "r1", mode: "local", targetStage: "previewed", total: 1 });
    ledger.recordTransition({ runId: "r1", workItemId: "uc-promotion", useCaseId: "uc-promotion", title: "Promotion", department: "hr", workspaceId: "ws-1", stage: "created", status: "started" });
    ledger.recordTransition({ runId: "r1", workItemId: "uc-promotion", stage: "created", status: "done" });
    ledger.recordTransition({ runId: "r1", workItemId: "uc-promotion", stage: "previewed", status: "done" });
    ledger.completeRun({ runId: "r1", ok: true });

    const run = ledger.getRun("r1");
    expect(run.id).toBe("r1");
    expect(run.status).toBe("done");
    expect(run.ok).toBe(true);
    expect(run.selected).toBe(1);
    expect(run.failed).toBe(0);
    expect(run.results[0]).toMatchObject({ id: "uc-promotion", department: "hr", workspaceId: "ws-1", status: "done" });
    expect(run.results[0].stages.map((s) => s.name)).toEqual(["created", "previewed"]);
  });

  test("getRun returns null for unknown run", () => {
    expect(ledger.getRun("nope")).toBeNull();
  });
});

describe("idempotency", () => {
  test("replaying the same transition does not duplicate events or change state", () => {
    ledger.startRun({ id: "r1" });
    const t = { runId: "r1", workItemId: "a", stage: "created", status: "done" };
    ledger.recordTransition(t);
    ledger.recordTransition(t);
    ledger.recordTransition(t);
    const events = ledger.adapter.all("SELECT * FROM ledger_events WHERE run_id = ?", ["r1"]);
    expect(events.length).toBe(1);
    const items = ledger.adapter.all("SELECT * FROM ledger_work_items WHERE run_id = ?", ["r1"]);
    expect(items.length).toBe(1);
    expect(items[0].stage).toBe("created");
  });

  test("a late earlier-stage event does not regress the materialised stage", () => {
    ledger.startRun({ id: "r1" });
    ledger.recordTransition({ runId: "r1", workItemId: "a", stage: "previewed", status: "done" });
    ledger.recordTransition({ runId: "r1", workItemId: "a", stage: "created", status: "started" });
    const item = ledger.adapter.get("SELECT stage FROM ledger_work_items WHERE run_id = ? AND id = ?", ["r1", "a"]);
    expect(item.stage).toBe("previewed");
  });
});

describe("ingestFactoryRun", () => {
  const factoryRun = {
    startedAt: "2026-06-15T10:00:00.000Z",
    finishedAt: "2026-06-15T10:05:00.000Z",
    targetStage: "previewed",
    ok: false,
    totals: { workItems: 2, failed: 1 },
    results: [
      { id: "uc-a", useCaseId: "uc-a", title: "A", department: "hr", workspaceId: "ws-a", status: "previewed", stages: [{ name: "created", status: "done" }, { name: "previewed", status: "done" }] },
      { id: "uc-b", useCaseId: "uc-b", title: "B", department: "finance", workspaceId: "ws-b", status: "validated", error: "boom", stages: [{ name: "created", status: "done" }, { name: "validated", status: "failed" }] },
    ],
  };

  test("imports a completed run with per-item state and stages", () => {
    const runId = ledger.ingestFactoryRun(factoryRun, { mode: "local" });
    const run = ledger.getRun(runId);
    expect(run.selected).toBe(2);
    expect(run.failed).toBe(1);
    expect(run.ok).toBe(false);
    const b = run.results.find((r) => r.id === "uc-b");
    expect(b.status).toBe("failed");
    expect(b.error).toBe("boom");
    expect(b.stages).toEqual([{ name: "created", status: "done" }, { name: "validated", status: "failed" }]);
  });

  test("ingesting the same run twice is idempotent", () => {
    const id1 = ledger.ingestFactoryRun(factoryRun, { mode: "local" });
    const id2 = ledger.ingestFactoryRun(factoryRun, { mode: "local" });
    expect(id1).toBe(id2);
    expect(ledger.listRuns().length).toBe(1);
    expect(ledger.getRun(id1).selected).toBe(2);
  });
});

describe("fleetByUseCase", () => {
  test("returns the latest work-item state keyed by use case and id", () => {
    ledger.startRun({ id: "r1", startedAt: "2026-06-15T09:00:00.000Z" });
    ledger.recordTransition({ runId: "r1", workItemId: "uc-a", useCaseId: "uc-a", workspaceId: "ws-old", stage: "created", status: "done", ts: "2026-06-15T09:00:00.000Z" });
    ledger.startRun({ id: "r2", startedAt: "2026-06-15T11:00:00.000Z" });
    ledger.recordTransition({ runId: "r2", workItemId: "uc-a", useCaseId: "uc-a", workspaceId: "ws-new", stage: "previewed", status: "done", ts: "2026-06-15T11:00:00.000Z" });

    const map = ledger.fleetByUseCase();
    expect(map.get("uc-a").workspaceId).toBe("ws-new");
    expect(map.get("uc-a").stage).toBe("previewed");
  });
});

describe("recordRemoteSubmission", () => {
  test("records submitted + failed items", () => {
    ledger.recordRemoteSubmission({
      runId: "remote-1",
      targetStage: "published",
      items: [
        { id: "uc-a", useCaseId: "uc-a", department: "hr", workspaceId: "ws-a" },
        { id: "uc-b", useCaseId: "uc-b", department: "it", error: "gateway 500" },
      ],
    });
    const run = ledger.getRun("remote-1");
    expect(run.mode).toBe("remote");
    expect(run.selected).toBe(2);
    expect(run.failed).toBe(1);
    expect(run.results.find((r) => r.id === "uc-a").status).toBe("submitted");
  });
});

describe("backfill", () => {
  test("imports .ge-state.json completed + failed", () => {
    const { runs, items } = ledger.backfill({
      stateJson: {
        completed: { "uc-a": { runId: "R1", workspaceId: "ws-a", at: "2026-06-15T08:00:00.000Z" } },
        failed: { "uc-b": { error: "nope" } },
      },
    });
    expect(runs).toBe(1);
    expect(items).toBe(2);
    const map = ledger.fleetByUseCase();
    expect(map.get("uc-a").workspaceId).toBe("ws-a");
    expect(map.get("uc-b").status).toBe("failed");
  });

  test("imports factory run files", () => {
    const { runs } = ledger.backfill({
      factoryRuns: [{ startedAt: "2026-06-15T10:00:00.000Z", finishedAt: "2026-06-15T10:01:00.000Z", ok: true, results: [{ id: "uc-a", useCaseId: "uc-a", status: "previewed", stages: [{ name: "created", status: "done" }] }] }],
    });
    expect(runs).toBe(1);
    expect(ledger.listRuns()[0].results[0].id).toBe("uc-a");
  });
});

describe("factoryEventToLedgerOp", () => {
  test("maps the live event types", () => {
    expect(factoryEventToLedgerOp({ type: "run_started", total: 2, targetStage: "published" })).toMatchObject({ kind: "start", total: 2, targetStage: "published" });
    expect(factoryEventToLedgerOp({ type: "stage_done", useCaseId: "a", stage: "created" })).toMatchObject({ kind: "transition", workItemId: "a", stage: "created", status: "done" });
    expect(factoryEventToLedgerOp({ type: "item_failed", useCaseId: "a", error: "x" })).toMatchObject({ kind: "transition", status: "failed", error: "x" });
    expect(factoryEventToLedgerOp({ type: "run_done", ok: false })).toEqual({ kind: "complete", ok: false });
    expect(factoryEventToLedgerOp({ type: "weird" })).toBeNull();
  });
});

describe("live emission + event tail", () => {
  const stream = [
    { type: "run_started", ts: "2026-06-15T10:00:00.000Z", targetStage: "previewed", total: 1 },
    { type: "item_started", ts: "2026-06-15T10:00:01.000Z", useCaseId: "uc-a", workspace: "ws-a" },
    { type: "stage_started", ts: "2026-06-15T10:00:02.000Z", useCaseId: "uc-a", stage: "created", workspaceId: "ws-a" },
    { type: "stage_done", ts: "2026-06-15T10:00:03.000Z", useCaseId: "uc-a", stage: "created", workspaceId: "ws-a" },
    { type: "stage_done", ts: "2026-06-15T10:00:04.000Z", useCaseId: "uc-a", stage: "previewed", workspaceId: "ws-a" },
    { type: "item_done", ts: "2026-06-15T10:00:05.000Z", useCaseId: "uc-a", status: "previewed" },
    { type: "run_done", ts: "2026-06-15T10:00:06.000Z", ok: true },
  ];

  test("applyFactoryEvent streams a run in live with a monotonic event tail", () => {
    const runId = "live-1";
    for (const e of stream) ledger.applyFactoryEvent(runId, e, { mode: "local" });
    const run = ledger.getRun(runId);
    expect(run.status).toBe("done");
    expect(run.ok).toBe(true);
    expect(run.results[0]).toMatchObject({ id: "uc-a", workspaceId: "ws-a" });

    const ev = ledger.events(runId);
    expect(ev.length).toBeGreaterThan(3);
    expect(ev[0].seq).toBe(1);
    expect(ev.map((e) => e.seq)).toEqual([...ev.map((e) => e.seq)].sort((a, b) => a - b));
    // afterSeq tail returns only newer events
    const tail = ledger.events(runId, { afterSeq: ev[2].seq });
    expect(tail.every((e) => e.seq > ev[2].seq)).toBe(true);
  });

  test("live emission then final ingest of the same run id does not double-count", () => {
    const runId = "live-2";
    for (const e of stream) ledger.applyFactoryEvent(runId, e, { mode: "local" });
    ledger.ingestFactoryRun(
      { startedAt: "2026-06-15T10:00:00.000Z", finishedAt: "2026-06-15T10:00:06.000Z", targetStage: "previewed", ok: true,
        results: [{ id: "uc-a", useCaseId: "uc-a", workspaceId: "ws-a", status: "previewed", stages: [{ name: "created", status: "done" }, { name: "previewed", status: "done" }] }] },
      { mode: "local", id: runId },
    );
    expect(ledger.listRuns().filter((r) => r.id === runId).length).toBe(1);
    expect(ledger.adapter.all("SELECT * FROM ledger_work_items WHERE run_id = ?", [runId]).length).toBe(1);
  });
});

describe("recordReset (regenerate as a transition)", () => {
  test("rewinds a work item's materialised stage to created", () => {
    ledger.startRun({ id: "r1" });
    ledger.recordTransition({ runId: "r1", workItemId: "uc-a", useCaseId: "uc-a", stage: "previewed", status: "done" });
    expect(ledger.adapter.get("SELECT stage FROM ledger_work_items WHERE run_id=? AND id=?", ["r1", "uc-a"]).stage).toBe("previewed");
    ledger.recordReset({ runId: "r1", workItemId: "uc-a" });
    const row = ledger.adapter.get("SELECT stage, status FROM ledger_work_items WHERE run_id=? AND id=?", ["r1", "uc-a"]);
    expect(row.stage).toBe("created");
    expect(row.status).toBe("reset");
  });
});

describe("openRunLedger", () => {
  test("opens an in-memory ledger and migrates", async () => {
    const l = await openRunLedger(":memory:");
    expect(l).not.toBeNull();
    expect(l.listRuns()).toEqual([]);
  });
});

test("LEDGER_STAGES matches the harness order head", () => {
  expect(LEDGER_STAGES.slice(0, 7)).toEqual([
    "planned", "created", "validated", "harness_reviewed", "harness_refined", "data_packaged", "previewed",
  ]);
});

import { mergeLedgerAndFileRuns } from "../factory-core.mjs";

describe("mergeLedgerAndFileRuns (read-cutover dedup)", () => {
  const ledgerRuns = [{ id: "L1", startedAt: "2026-06-15T10:00:00.000Z" }];
  test("ledger wins; file run with same startedAt is deduped", () => {
    const fileRuns = [{ id: "F-dup", startedAt: "2026-06-15T10:00:00.000Z" }, { id: "F-live", startedAt: "2026-06-15T12:00:00.000Z" }];
    const out = mergeLedgerAndFileRuns(ledgerRuns, fileRuns);
    expect(out.map((r) => r.id)).toEqual(["L1", "F-live"]);
  });
  test("no ledger runs → file runs untouched", () => {
    const fileRuns = [{ id: "F1", startedAt: "x" }];
    expect(mergeLedgerAndFileRuns([], fileRuns)).toBe(fileRuns);
  });
});
