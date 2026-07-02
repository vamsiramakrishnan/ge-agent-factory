// Firestore-backed ledger backend — the cloud live-push counterpart of the run
// ledger (ADR 0001, phase 2). Locally the console subscribes to a run by polling
// the SQLite ledger over SSE. In the cloud, the gateway/worker writes each
// transition to Firestore and the console subscribes with a real-time listener
// (onSnapshot) — no polling, no proxy.
//
// Document layout (mirrors the ledger projections):
//   factoryRuns/{runId}                     → { mode, status, ok, targetStage, total, startedAt, updatedAt, finishedAt }
//   factoryRuns/{runId}/events/{seq}        → { seq, ts, type, stage, status, workItemId, error }
//   factoryRuns/{runId}/items/{workItemId}  → { stage, status, workspaceId, error, updatedAt }
//
// Lazy-imports @google-cloud/firestore (a cloud-only dependency; NOT a hard
// dependency of this package — consumers that only need the types/reducer/store
// never pull it in). The event→write mapping reuses factoryEventToLedgerOp so the
// local ledger and the cloud mirror can never drift in how they interpret the
// generator's stream.

import { resolveGcpProject } from "@ge/std/gcp-config";
import { factoryEventToLedgerOp } from "./store.mjs";

const DEFAULT_COLLECTION = "factoryRuns";
const DEFAULT_DATABASE = "(default)";

const isFiniteNumber = (value) => Number.isFinite(Number(value));
const toNumber = (value, fallback = null) => (isFiniteNumber(value) ? Number(value) : fallback);

function docData(doc) {
  if (!doc) return {};
  if (typeof doc.data === "function") return doc.data() || {};
  return doc.data || doc || {};
}

function docId(doc) {
  return doc?.id || doc?.ref?.id || docData(doc).id || "";
}

function toIso(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "number") return new Date(value).toISOString();
  return String(value);
}

function eventStatus(data) {
  if (data.status) return data.status;
  if (typeof data.type === "string" && data.type.startsWith("stage_")) return data.type.slice("stage_".length);
  return data.type || "event";
}

function eventType(data, status) {
  if (data.type) return data.type;
  return data.stage ? `stage_${status}` : status;
}

function sortEventDocs(docs) {
  return [...(docs || [])].sort((a, b) => {
    const ad = docData(a);
    const bd = docData(b);
    const aSeq = toNumber(ad.seq);
    const bSeq = toNumber(bd.seq);
    if (aSeq != null && bSeq != null && aSeq !== bSeq) return aSeq - bSeq;
    if (aSeq != null && bSeq == null) return -1;
    if (aSeq == null && bSeq != null) return 1;
    const at = Date.parse(toIso(ad.ts || ad.createdAt || ad.updatedAt) || "") || 0;
    const bt = Date.parse(toIso(bd.ts || bd.createdAt || bd.updatedAt) || "") || 0;
    if (at !== bt) return at - bt;
    return docId(a).localeCompare(docId(b));
  });
}

export function normalizeFirestoreLedgerEvent(doc, index = 0) {
  const data = docData(doc);
  const status = eventStatus(data);
  return {
    seq: toNumber(data.seq, index + 1),
    ts: toIso(data.ts || data.createdAt || data.updatedAt) || new Date(0).toISOString(),
    type: eventType(data, status),
    stage: data.stage ?? null,
    status,
    workItemId: data.workItemId || data.itemId || null,
    error: data.error ?? null,
    data: data.data ?? null,
  };
}

function normalizeEventDocs(docs) {
  return sortEventDocs(docs).map((doc, index) => normalizeFirestoreLedgerEvent(doc, index));
}

async function queryDocs(query) {
  const snapshot = await query.get();
  return snapshot.docs || [];
}

async function orderedDocs(collectionRef) {
  if (typeof collectionRef.orderBy === "function") {
    try {
      // Current worker event docs carry ts but not seq. Query by ts so those docs
      // are included, then apply seq-aware ordering locally.
      return await queryDocs(collectionRef.orderBy("ts", "asc"));
    } catch {
      // Tests/fakes may not support orderBy. Fall through to an unordered read
      // and normalize locally.
    }
  }
  return await queryDocs(collectionRef);
}

async function limitedRunDocs(collectionRef, limit) {
  let query = collectionRef;
  if (typeof query.orderBy === "function") query = query.orderBy("updatedAt", "desc");
  if (typeof query.limit === "function") query = query.limit(limit);
  try {
    return await queryDocs(query);
  } catch {
    const docs = await queryDocs(collectionRef);
    return docs
      .sort((a, b) => String(docData(b).updatedAt || "").localeCompare(String(docData(a).updatedAt || "")))
      .slice(0, limit);
  }
}

function summarizeRunDoc(doc, { events = [], items = [] } = {}) {
  const data = docData(doc);
  const failed = items.filter((item) => ["failed", "error"].includes(docData(item).status)).length;
  return {
    id: docId(doc),
    kind: data.kind || "build",
    mode: data.mode || "remote",
    status: data.status || "running",
    ok: data.ok == null ? null : !!data.ok,
    startedAt: toIso(data.startedAt) || null,
    updatedAt: toIso(data.updatedAt) || toIso(data.startedAt) || null,
    finishedAt: toIso(data.finishedAt) || null,
    targetStage: data.targetStage || data.target_stage || null,
    planPath: null,
    runPath: null,
    eventsPath: null,
    selected: items.length || Number(data.total || 0),
    failed,
    results: items.map((itemDoc) => {
      const item = docData(itemDoc);
      return {
        id: docId(itemDoc),
        useCaseId: item.useCaseId || item.use_case_id || docId(itemDoc),
        title: item.title || item.useCaseId || docId(itemDoc),
        department: item.department || null,
        status: item.status || "unknown",
        targetStage: data.targetStage || null,
        workspaceId: item.workspaceId || item.workspace_id || null,
        error: item.error || null,
        systems: [],
        stages: item.currentStage || item.stage ? [{ name: item.currentStage || item.stage, status: item.status || "unknown" }] : [],
      };
    }),
    recentEvents: events
      .slice(-8)
      .reverse()
      .map((event) => ({
        ts: event.ts,
        type: event.type,
        stage: event.stage,
        level: event.error || event.status === "failed" ? "error" : "info",
        line: event.error || `${event.stage || "run"} ${event.status || event.type}`,
      })),
  };
}

export async function createFirestoreLedgerReader({
  projectId = resolveGcpProject({ fallbackEnvVars: ["GE_PROJECT"] }),
  databaseId = process.env.GE_FIRESTORE_DATABASE || DEFAULT_DATABASE,
  collection = process.env.GE_FIRESTORE_COLLECTION || DEFAULT_COLLECTION,
  db = null,
} = {}) {
  if (!db) {
    const { Firestore } = await import("@google-cloud/firestore");
    db = new Firestore({ projectId, databaseId });
  }

  const runsCollection = () => db.collection(collection);
  const runDoc = (runId) => runsCollection().doc(runId);
  const eventsCollection = (runId) => runDoc(runId).collection("events");
  const itemsCollection = (runId) => runDoc(runId).collection("items");

  const events = async (runId, { afterSeq = 0, limit = 1000 } = {}) => {
    const cursor = Number(afterSeq) || 0;
    const max = Math.max(1, Math.min(Number(limit) || 1000, 10000));
    return normalizeEventDocs(await orderedDocs(eventsCollection(runId)))
      .filter((event) => event.seq > cursor)
      .slice(0, max);
  };

  const getRun = async (runId) => {
    const snapshot = await runDoc(runId).get();
    if (!snapshot?.exists) return null;
    const [runEvents, itemDocs] = await Promise.all([
      events(runId, { limit: 10000 }),
      queryDocs(itemsCollection(runId)).catch((error) => {
        console.warn(`[run-ledger] items query failed for ${runId}; returning run without items: ${error?.message || error}`);
        return [];
      }),
    ]);
    return summarizeRunDoc(snapshot, { events: runEvents, items: itemDocs });
  };

  const listRuns = async ({ limit = 25 } = {}) =>
    (await limitedRunDocs(runsCollection(), Math.max(1, Math.min(Number(limit) || 25, 100))))
      .map((doc) => summarizeRunDoc(doc));

  const listenEvents = (runId, { afterSeq = 0 } = {}, onEvents, onError = () => {}) => {
    const collectionRef = eventsCollection(runId);
    if (typeof collectionRef.onSnapshot !== "function") return null;
    let cursor = Number(afterSeq) || 0;
    let query = collectionRef;
    if (typeof query.orderBy === "function") {
      try { query = query.orderBy("ts", "asc"); } catch { query = collectionRef; }
    }
    const unsubscribe = query.onSnapshot((snapshot) => {
      const next = normalizeEventDocs(snapshot.docs || []).filter((event) => event.seq > cursor);
      if (!next.length) return;
      cursor = Math.max(cursor, ...next.map((event) => event.seq));
      onEvents(next);
    }, onError);
    return typeof unsubscribe === "function" ? unsubscribe : null;
  };

  return { events, getRun, listRuns, listenEvents, db, projectId, databaseId, collection };
}

export async function createFirestoreEventMirror({
  projectId = resolveGcpProject({ fallbackEnvVars: ["GE_PROJECT"] }),
  databaseId = process.env.GE_FIRESTORE_DATABASE || DEFAULT_DATABASE,
  collection = process.env.GE_FIRESTORE_COLLECTION || DEFAULT_COLLECTION,
} = {}) {
  const { Firestore } = await import("@google-cloud/firestore");
  const db = new Firestore({ projectId, databaseId });
  const runDoc = (runId) => db.collection(collection).doc(runId);
  const nowIso = () => new Date().toISOString();

  const startRun = ({ id, mode = "remote", targetStage = null, total = 0, startedAt = nowIso() }) =>
    runDoc(id).set({ mode, targetStage, total, status: "running", startedAt, updatedAt: startedAt }, { merge: true });

  const completeRun = (runId, { ok = null, finishedAt = nowIso() } = {}) =>
    runDoc(runId).set({ status: ok ? "done" : "failed", ok, finishedAt, updatedAt: finishedAt }, { merge: true });

  const recordEvent = async (runId, event) => {
    const seq = event.seq ?? Date.now();
    const ts = event.ts || nowIso();
    await runDoc(runId).collection("events").doc(String(seq)).set({ ...event, seq, ts }, { merge: true });
    if (event.workItemId) {
      await runDoc(runId).collection("items").doc(String(event.workItemId)).set(
        { stage: event.stage ?? null, status: event.status, workspaceId: event.workspaceId ?? null, error: event.error ?? null, updatedAt: ts },
        { merge: true },
      );
    }
    await runDoc(runId).set({ updatedAt: ts }, { merge: true });
  };

  // Mirror a single generator event to Firestore (parity with ledger.applyFactoryEvent).
  const applyFactoryEvent = (runId, event, { mode = "remote" } = {}) => {
    const op = factoryEventToLedgerOp(event);
    if (!op) return Promise.resolve();
    if (op.kind === "start") return startRun({ id: runId, mode, targetStage: op.targetStage, total: op.total, startedAt: op.startedAt || event.ts });
    if (op.kind === "complete") return completeRun(runId, { ok: op.ok, finishedAt: event.ts });
    return recordEvent(runId, { ...event });
  };

  return { startRun, completeRun, recordEvent, applyFactoryEvent, db };
}
