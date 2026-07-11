import { expect, test, describe } from "bun:test";
import { createFirestoreLedgerReader, normalizeFirestoreLedgerEvent } from "./run-ledger-firestore.mjs";

class FakeDoc {
  constructor(id, data = null, collections = {}) {
    this.id = id;
    this._data = data;
    this._collections = collections;
    this.exists = data != null;
  }
  data() {
    return this._data;
  }
  async get() {
    return this;
  }
  collection(name) {
    return new FakeCollection(this._collections[name] || {});
  }
}

class FakeCollection {
  constructor(entries = {}, options = {}) {
    this.entries = entries;
    this.sortField = options.sortField || null;
    this.sortDir = options.sortDir || "asc";
    this.max = options.max || null;
  }
  doc(id) {
    const entry = this.entries[id];
    if (!entry) return new FakeDoc(id, null, {});
    return new FakeDoc(id, entry.data || entry, entry.collections || {});
  }
  orderBy(field, dir = "asc") {
    return new FakeCollection(this.entries, { sortField: field, sortDir: dir, max: this.max });
  }
  limit(max) {
    return new FakeCollection(this.entries, { sortField: this.sortField, sortDir: this.sortDir, max });
  }
  async get() {
    let docs = Object.entries(this.entries).map(([id, entry]) => new FakeDoc(id, entry.data || entry, entry.collections || {}));
    if (this.sortField) {
      docs.sort((a, b) => {
        const av = a.data()?.[this.sortField];
        const bv = b.data()?.[this.sortField];
        const out = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
        return this.sortDir === "desc" ? -out : out;
      });
    }
    if (this.max != null) docs = docs.slice(0, this.max);
    return { docs };
  }
}

function fakeDb(collections) {
  return {
    collection(name) {
      return new FakeCollection(collections[name] || {});
    },
  };
}

describe("Firestore ledger reader", () => {
  test("normalizes worker event docs to the local ledger event shape", () => {
    expect(normalizeFirestoreLedgerEvent({
      id: "uc-a_created_done",
      data: () => ({
        ts: "2026-06-15T10:00:03.000Z",
        type: "stage_done",
        stage: "created",
        workItemId: "uc-a",
      }),
    }, 0)).toEqual({
      seq: 1,
      ts: "2026-06-15T10:00:03.000Z",
      type: "stage_done",
      stage: "created",
      status: "done",
      workItemId: "uc-a",
      error: null,
      data: null,
    });
  });

  test("events orders, synthesizes sequence for legacy docs, and filters afterSeq", async () => {
    const reader = await createFirestoreLedgerReader({
      db: fakeDb({
        factoryRuns: {
          "run-1": {
            data: { mode: "remote", status: "running", updatedAt: "2026-06-15T10:00:04.000Z" },
            collections: {
              events: {
                "late-no-seq": { data: { ts: "2026-06-15T10:00:04.000Z", type: "stage_done", stage: "previewed", status: "done", workItemId: "uc-a" } },
                "seq-1": { data: { seq: 1, ts: "2026-06-15T10:00:01.000Z", type: "stage_started", stage: "created", workItemId: "uc-a" } },
                "seq-2": { data: { seq: 2, ts: "2026-06-15T10:00:02.000Z", type: "stage_done", stage: "created", status: "done", workItemId: "uc-a" } },
              },
            },
          },
        },
      }),
    });

    const events = await reader.events("run-1", { afterSeq: 1 });
    expect(events.map((event) => event.seq)).toEqual([2, 3]);
    expect(events.map((event) => event.type)).toEqual(["stage_done", "stage_done"]);
    expect(events[0]).toMatchObject({ stage: "created", status: "done", workItemId: "uc-a" });
    expect(events[1]).toMatchObject({ stage: "previewed", status: "done", workItemId: "uc-a" });
  });

  test("getRun projects Firestore run, item, and recent event docs", async () => {
    const reader = await createFirestoreLedgerReader({
      db: fakeDb({
        factoryRuns: {
          "run-2": {
            data: {
              mode: "remote",
              targetStage: "previewed",
              status: "done",
              ok: true,
              total: 1,
              startedAt: "2026-06-15T10:00:00.000Z",
              updatedAt: "2026-06-15T10:00:05.000Z",
              finishedAt: "2026-06-15T10:00:05.000Z",
            },
            collections: {
              items: {
                "uc-a": { data: { useCaseId: "uc-a", title: "A", department: "hr", status: "done", currentStage: "previewed", workspaceId: "ws-a" } },
              },
              events: {
                "seq-1": { data: { seq: 1, ts: "2026-06-15T10:00:01.000Z", type: "stage_done", stage: "created", status: "done", workItemId: "uc-a" } },
              },
            },
          },
        },
      }),
    });

    const run = await reader.getRun("run-2");
    expect(run).toMatchObject({ id: "run-2", mode: "remote", status: "done", ok: true, selected: 1, failed: 0 });
    expect(run.results[0]).toMatchObject({ id: "uc-a", department: "hr", workspaceId: "ws-a", status: "done" });
    expect(run.recentEvents[0]).toMatchObject({ type: "stage_done", stage: "created", line: "created done" });
  });

  test("getRun derives terminal failure from item state when the root run doc is stale", async () => {
    const reader = await createFirestoreLedgerReader({
      db: fakeDb({
        factoryRuns: {
          "run-stale": {
            data: {
              mode: "remote",
              targetStage: "publish_enterprise",
              status: "queued",
              updatedAt: "2026-07-09T07:30:00.000Z",
            },
            collections: {
              items: {
                "ws-a": { data: { status: "failed", currentStage: "validate", workspaceId: "ws-a", error: "bad substitution" } },
              },
              events: {
                "ws-a_validate_failed": { data: { seq: 1, ts: "2026-07-09T07:32:00.000Z", type: "stage_error", stage: "validate", status: "failed", workItemId: "ws-a", error: "bad substitution" } },
              },
            },
          },
        },
      }),
    });

    const run = await reader.getRun("run-stale");
    expect(run).toMatchObject({ status: "failed", ok: false, failed: 1 });
    expect(run.results[0]).toMatchObject({ status: "failed", workspaceId: "ws-a", error: "bad substitution" });
  });

  test("getRun does not make an intermediate completed stage terminal", async () => {
    const db = fakeDb({
      factoryRuns: {
        "run-advance": {
          data: { status: "submitted", targetStage: "publish_enterprise" },
          collections: {
            items: {
              "item-1": {
                data: {
                  status: "done",
                  currentStage: "deploy_runtime",
                  nextStage: "poll_runtime",
                  workspaceId: "ws-1",
                },
              },
            },
          },
        },
      },
    });
    const reader = await createFirestoreLedgerReader({ db, projectId: "p1" });
    const run = await reader.getRun("run-advance");
    expect(run.status).toBe("running");
    expect(run.results[0]).toMatchObject({ status: "running", targetStage: "publish_enterprise" });
  });

  test("listRuns uses the same item-derived status projection as getRun", async () => {
    const reader = await createFirestoreLedgerReader({
      db: fakeDb({
        factoryRuns: {
          "run-stale": {
            data: {
              mode: "remote",
              targetStage: "publish_enterprise",
              status: "queued",
              updatedAt: "2026-07-09T07:30:00.000Z",
            },
            collections: {
              items: {
                "ws-a": { data: { status: "failed", currentStage: "validate", workspaceId: "ws-a", error: "bad substitution" } },
              },
            },
          },
        },
      }),
    });

    const runs = await reader.listRuns({ limit: 1 });
    expect(runs[0]).toMatchObject({ id: "run-stale", status: "failed", ok: false, failed: 1 });
  });
});
