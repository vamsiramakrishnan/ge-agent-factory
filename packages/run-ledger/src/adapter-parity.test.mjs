// Adapter-parity oracle: the SQLite ledger (store.mjs createRunLedger) and the
// Firestore backend (firestore.mjs) are two adapters over ONE contract — the
// generator's live event stream (factory-events.jsonl), translated by the
// SHARED factoryEventToLedgerOp(), must read back through both backends as
// the same normalized shape (frames.mjs's {seq,ts,type,stage,status,
// workItemId,error,data}), because apps/console/src/server/transport/ledger.mjs
// streamLedger's console reducer switches between them at runtime and cannot
// tell (or be told) which backend it's talking to.
//
// This test drives ONE logical run through:
//   (a) createRunLedger(sqliteAdapter) — via ledger.applyFactoryEvent
//   (b) createFirestoreEventMirror     — via mirror.applyFactoryEvent, against
//       an injected fake Firestore client (db) shaped exactly like the
//       @google-cloud/firestore surface firestore.mjs actually calls
//       (collection().doc().collection().doc().get()/.set()/.orderBy()/.limit()),
//       then read back with createFirestoreLedgerReader({ db }) — the SAME
//       fake, so reader and mirror agree on what was written.
//
// Divergences that cannot be reconciled without changing the real reader's/
// writer's output are asserted as KNOWN DIVERGENCE, not silently normalized —
// see the block at the bottom and the task report for the full field-level
// writeup.
import { describe, expect, test } from "bun:test";
import { createRunLedger, sqliteAdapter } from "./store.mjs";
import { createFirestoreLedgerReader, createFirestoreEventMirror } from "./firestore.mjs";

// ── minimal in-memory fake of the @google-cloud/firestore surface consumed by
// firestore.mjs (see firestore.d.ts's FirestoreDatabaseLike/…Like interfaces).
// Two-level collection nesting only (factoryRuns/{runId}/{events|items}/{id}),
// which is all the real module ever addresses.
function createFakeFirestoreDb() {
  const runs = new Map(); // runId -> { run: obj|null, events: Map<id,obj>, items: Map<id,obj> }
  const bucket = (runId) => {
    if (!runs.has(runId)) runs.set(runId, { run: null, events: new Map(), items: new Map() });
    return runs.get(runId);
  };
  const snap = (id, data) => ({ id, exists: data != null, data: () => (data ? { ...data } : undefined) });

  function sortedDocs(docs, field, direction) {
    return [...docs].sort((a, b) => {
      const av = a.data()?.[field];
      const bv = b.data()?.[field];
      if (av === bv) return 0;
      if (av == null) return direction === "desc" ? 1 : -1;
      if (bv == null) return direction === "desc" ? -1 : 1;
      if (av < bv) return direction === "desc" ? 1 : -1;
      return direction === "desc" ? -1 : 1;
    });
  }

  function queryOver(getDocs) {
    return {
      async get() { return { docs: await getDocs() }; },
      orderBy(field, direction = "asc") {
        return queryOver(async () => sortedDocs(await getDocs(), field, direction));
      },
      limit(n) {
        return queryOver(async () => (await getDocs()).slice(0, n));
      },
    };
  }

  function subCollection(runId, kind) {
    const docs = () => bucket(runId)[kind];
    return {
      doc(id) {
        return {
          async get() { return snap(id, docs().get(id)); },
          async set(data, opts = {}) {
            const prev = docs().get(id);
            docs().set(id, opts?.merge && prev ? { ...prev, ...data } : { ...data });
          },
        };
      },
      ...queryOver(async () => [...docs().entries()].map(([id, data]) => snap(id, data))),
    };
  }

  return {
    collection(name) {
      if (name !== "factoryRuns") throw new Error(`fake firestore: unexpected top-level collection "${name}"`);
      return {
        doc(runId) {
          return {
            async get() { return snap(runId, bucket(runId).run); },
            async set(data, opts = {}) {
              const b = bucket(runId);
              b.run = opts?.merge && b.run ? { ...b.run, ...data } : { ...data };
            },
            collection(kind) { return subCollection(runId, kind); },
          };
        },
        ...queryOver(async () => [...runs.entries()].map(([id, r]) => snap(id, r.run))),
      };
    },
  };
}

// The SAME factory-events.jsonl-shaped stream both backends must interpret
// identically. One item (uc1) through created → validated, then run_done.
const RUN_ID = "local-2026-07-05T00-00-00-000Z";
const EVENTS = [
  { type: "run_started", ts: "2026-07-05T00:00:00.000Z", targetStage: "preview", total: 1 },
  { type: "item_started", ts: "2026-07-05T00:00:01.000Z", useCaseId: "uc1" },
  { type: "stage_started", ts: "2026-07-05T00:00:02.000Z", useCaseId: "uc1", stage: "created" },
  { type: "stage_done", ts: "2026-07-05T00:00:03.000Z", useCaseId: "uc1", stage: "created" },
  { type: "stage_started", ts: "2026-07-05T00:00:04.000Z", useCaseId: "uc1", stage: "validated" },
  { type: "stage_done", ts: "2026-07-05T00:00:05.000Z", useCaseId: "uc1", stage: "validated" },
  { type: "item_done", ts: "2026-07-05T00:00:06.000Z", useCaseId: "uc1" },
  { type: "run_done", ts: "2026-07-05T00:00:07.000Z", ok: true },
];
const MODE = "remote"; // same mode value fed to both backends, so it's not a false-positive divergence.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function driveBothBackends() {
  const ledger = createRunLedger(await sqliteAdapter(":memory:")).migrate();
  const fakeDb = createFakeFirestoreDb();
  const mirror = await createFirestoreEventMirror({ projectId: "demo-project", db: fakeDb });
  const reader = await createFirestoreLedgerReader({ projectId: "demo-project", db: fakeDb });

  for (const event of EVENTS) {
    ledger.applyFactoryEvent(RUN_ID, event, { mode: MODE });
    await mirror.applyFactoryEvent(RUN_ID, event, { mode: MODE });
    // recordEvent's per-run seq allocator (max(Date.now(), last + 1)) keeps
    // same-millisecond events distinct — the dedicated collision test below
    // asserts that guarantee. The 2ms spacer here keeps THIS test's seqs
    // wall-clock-shaped so field-shape parity stays isolated from ordering.
    await sleep(2);
  }
  return { ledger, reader };
}

describe("adapter parity: SQLite ledger vs Firestore (fake client)", () => {
  test("events(): same length, order, and field-for-field shape (seq VALUE excepted — see below)", async () => {
    const { ledger, reader } = await driveBothBackends();
    const sqlEvents = ledger.events(RUN_ID);
    const fsEvents = await reader.events(RUN_ID);

    // 6 transition events: item_started, stage_started x2, stage_done x2, item_done
    // (run_started/run_done are "start"/"complete" ops, not ledger_events rows).
    expect(sqlEvents.length).toBe(6);
    expect(fsEvents.length).toBe(sqlEvents.length);

    for (let i = 0; i < sqlEvents.length; i++) {
      const a = sqlEvents[i];
      const b = fsEvents[i];
      expect(b.ts).toBe(a.ts);
      expect(b.type).toBe(a.type);
      expect(b.stage).toBe(a.stage);
      expect(b.status).toBe(a.status);
      expect(b.workItemId).toBe(a.workItemId);
      expect(b.error).toBe(a.error);
      // seq is intentionally NOT compared for value equality — see KNOWN
      // DIVERGENCE below. Both must still be strictly increasing (ordering
      // is the only contract afterSeq/cursor-based consumers rely on).
      if (i > 0) {
        expect(b.seq).toBeGreaterThan(fsEvents[i - 1].seq);
        expect(a.seq).toBeGreaterThan(sqlEvents[i - 1].seq);
      }
    }

    // Sanity on the content itself (not just parity): stage_started→started,
    // item-level events carry no stage, workItemId resolves for all of them.
    expect(sqlEvents[0]).toMatchObject({ type: "started", stage: null, status: "started", workItemId: "uc1" });
    expect(fsEvents[0]).toMatchObject({ type: "started", stage: null, status: "started", workItemId: "uc1" });
    expect(sqlEvents[1]).toMatchObject({ type: "stage_started", stage: "created", status: "started", workItemId: "uc1" });
    expect(fsEvents[1]).toMatchObject({ type: "stage_started", stage: "created", status: "started", workItemId: "uc1" });
  });

  test("getRun(): run-level fields agree (mode/status/ok/startedAt/targetStage/selected)", async () => {
    const { ledger, reader } = await driveBothBackends();
    const sqlRun = ledger.getRun(RUN_ID);
    const fsRun = await reader.getRun(RUN_ID);

    expect(fsRun.id).toBe(sqlRun.id);
    expect(fsRun.mode).toBe(sqlRun.mode);
    expect(fsRun.status).toBe(sqlRun.status);
    expect(fsRun.ok).toBe(sqlRun.ok);
    expect(fsRun.startedAt).toBe(sqlRun.startedAt);
    expect(fsRun.finishedAt).toBe(sqlRun.finishedAt);
    expect(fsRun.targetStage).toBe(sqlRun.targetStage);
    expect(fsRun.selected).toBe(sqlRun.selected);
    expect(sqlRun.status).toBe("done");
    expect(sqlRun.ok).toBe(true);
  });

  // ── KNOWN DIVERGENCES (reported, not silently normalized) ──────────────────
  // Reconciling either of these requires changing the real reader's/writer's
  // output (summarizeRunDoc's algorithm, or the Firestore mirror's seq
  // strategy), which is exactly the class of change the task called out as a
  // FINDING rather than something to fix inside this oracle.
  describe("KNOWN DIVERGENCE", () => {
    test("seq VALUES differ: SQLite is a monotonic 1,2,3… per-run counter; Firestore falls back to Date.now() ms when the driving event carries no .seq (raw factory-events.jsonl events never do)", async () => {
      const { ledger, reader } = await driveBothBackends();
      const sqlEvents = ledger.events(RUN_ID);
      const fsEvents = await reader.events(RUN_ID);
      expect(sqlEvents.map((e) => e.seq)).toEqual([1, 2, 3, 4, 5, 6]);
      // Firestore's seq is wall-clock milliseconds (recordEvent: `event.seq ?? Date.now()`),
      // not a small monotonic counter — assert it is NOT the SQLite sequence,
      // so a future "fix" that quietly makes these equal is a signal to update
      // this test (and the finding) deliberately, not by accident.
      expect(fsEvents.map((e) => e.seq)).not.toEqual([1, 2, 3, 4, 5, 6]);
      for (const e of fsEvents) expect(e.seq).toBeGreaterThan(1_000_000_000_000); // looks like Date.now(), not a small counter
    });

    test("getRun().results[].stages: SQLite keeps the FULL per-item stage timeline; Firestore's item doc only ever holds the CURRENT stage, and a stage-less item-level event (item_done) blanks it to null — so the Firestore side ends with an EMPTY stages[] where SQLite has the full history", async () => {
      const { ledger, reader } = await driveBothBackends();
      const sqlRun = ledger.getRun(RUN_ID);
      const fsRun = await reader.getRun(RUN_ID);

      // SQLite: itemStages() replays ledger_events history — both stages recorded, both "done".
      expect(sqlRun.results[0].stages).toEqual([
        { name: "created", status: "done" },
        { name: "validated", status: "done" },
      ]);

      // Firestore: summarizeRunDoc reads the single materialised `item.stage`/
      // `item.currentStage` field. The mirror's recordEvent (unlike the SQLite
      // ledger's recordTransition) has NO forward-only stage guard, so the
      // final item_done transition (which carries no `stage`) overwrites the
      // item doc's stage to null, and the getRun() view loses the timeline
      // entirely. This is real and load-bearing: any remote-mode console/CLI
      // reader of getRun().results[].stages sees far less than the SQLite path.
      expect(fsRun.results[0].stages).toEqual([]);
    });

    test("event-doc-id collision is FIXED: same-millisecond events get distinct doc ids on both sides", async () => {
      const runId = "local-collision-test";
      const ledger = createRunLedger(await sqliteAdapter(":memory:")).migrate();
      const fakeDb = createFakeFirestoreDb();
      const mirror = await createFirestoreEventMirror({ projectId: "demo-project", db: fakeDb });
      const reader = await createFirestoreLedgerReader({ projectId: "demo-project", db: fakeDb });

      const back2back = [
        { type: "run_started", ts: "2026-07-05T00:00:00.000Z", total: 1 },
        { type: "stage_started", ts: "2026-07-05T00:00:01.000Z", useCaseId: "uc1", stage: "created" },
        { type: "stage_done", ts: "2026-07-05T00:00:01.001Z", useCaseId: "uc1", stage: "created" },
      ];
      // Deliberately NO delay between these two transition events — the
      // realistic case (a fast build emits stage_started/stage_done within the
      // same ms) that used to collide: recordEvent's old `event.seq ?? Date.now()`
      // doc-id strategy gave both events the same doc id and the second
      // .set(merge:true) silently collapsed onto the first. recordEvent's
      // per-run monotonic allocator (max(Date.now(), last + 1)) now guarantees
      // distinct, time-ordered ids, so both adapters keep both events.
      for (const event of back2back) {
        ledger.applyFactoryEvent(runId, event);
        await mirror.applyFactoryEvent(runId, event);
      }

      const sqlEvents = ledger.events(runId);
      const fsEvents = await reader.events(runId);
      expect(sqlEvents.length).toBe(2); // SQLite: idempotency key is (workItemId,stage,status) — both distinct, both kept.
      expect(fsEvents.length).toBe(2); // Firestore: the seq allocator makes this a hard guarantee, timing-independent.
      const seqs = fsEvents.map((event) => event.seq);
      expect(new Set(seqs).size).toBe(2);
      expect(seqs[0]).toBeLessThan(seqs[1]);
    });
  });
});
