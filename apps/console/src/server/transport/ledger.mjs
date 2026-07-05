// Ledger SSE transport: stream the durable run ledger (local SQLite or the
// hosted Firestore mirror) to the console. Verbatim move from transport.mjs.
//
// NOTE: the Firestore-backed branch (streamFirestoreLedger + the cached reader)
// is parse/unit-verified offline only — exercising it for real needs GCP
// credentials and a live factoryRuns mirror. It was moved verbatim; treat it as
// runtime-unverified until driven against a hosted project.

import * as core from "../../../../../tools/lib/factory-core.mjs";
import { makeSseWriter } from "./sse.mjs";

let firestoreLedgerReaderPromise = null;
let firestoreLedgerReaderOverride = null;

function normalizeLedgerSource(source = null) {
  const value = String(source || process.env.GE_LEDGER_BACKEND || process.env.GE_LEDGER_SOURCE || "local").trim().toLowerCase();
  if (["firestore", "cloud", "remote"].includes(value)) return "firestore";
  return "local";
}

async function firestoreLedgerReader() {
  if (firestoreLedgerReaderOverride) return firestoreLedgerReaderOverride;
  if (!firestoreLedgerReaderPromise) firestoreLedgerReaderPromise = core.resolveRunLedger({ source: "remote" }).catch((error) => {
    firestoreLedgerReaderPromise = null;
    throw error;
  });
  return firestoreLedgerReaderPromise;
}

export function __setFirestoreLedgerReaderForTest(reader) {
  firestoreLedgerReaderOverride = reader;
  firestoreLedgerReaderPromise = null;
}

// Live ledger run stream (ADR 0001 phase 2): stream the durable run ledger over
// SSE, advancing afterSeq, until the run is terminal or the client disconnects.
// Local/dev reads the SQLite ledger. Hosted console reads Firestore's
// factoryRuns/{runId}/events mirror using the same event shape.
export async function streamLedger({ runId, afterSeq = 0, source = null } = {}, writeSSE, isClosed, onEnd = () => {}) {
  const emit = makeSseWriter(writeSSE);
  const backend = normalizeLedgerSource(source);
  const emitEvent = (event) => {
    if (!isClosed()) emit(JSON.stringify(event), { seq: event.seq });
  };
  if (!isClosed()) {
    emitEvent({
      type: "ledger_source",
      status: backend,
      ts: new Date().toISOString(),
      data: { source: backend },
    });
  }
  if (backend === "firestore") {
    await streamFirestoreLedger({ runId, afterSeq }, emitEvent, isClosed, onEnd);
    return;
  }
  const ledger = await core.resolveRunLedger({ source: "local" });
  if (!ledger) {
    if (!isClosed()) emitEvent({ type: "ledger_unavailable", level: "warn", line: "run ledger unavailable (no driver)", ts: new Date().toISOString() });
    onEnd();
    return;
  }
  let cursor = Number(afterSeq) || 0;
  let timer;
  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    if (timer) clearInterval(timer);
    onEnd();
  };
  const tick = () => {
    if (isClosed()) { finish(); return; }
    try {
      for (const ev of ledger.events(runId, { afterSeq: cursor })) {
        cursor = ev.seq;
        emitEvent(ev);
      }
      const run = ledger.getRun(runId);
      if (run && (run.status === "done" || run.status === "failed")) {
        if (!isClosed()) emitEvent({ type: "run_complete", status: run.status, ok: run.ok, ts: new Date().toISOString() });
        finish();
      }
    } catch { /* transient read; keep polling */ }
  };
  timer = setInterval(tick, 1000);
  tick();
}

async function streamFirestoreLedger({ runId, afterSeq = 0 } = {}, emitEvent, isClosed, onEnd) {
  let reader;
  try {
    reader = await firestoreLedgerReader();
  } catch (error) {
    if (!isClosed()) emitEvent({
      type: "ledger_unavailable",
      status: "firestore",
      level: "error",
      line: error.message || String(error),
      ts: new Date().toISOString(),
    });
    onEnd();
    return;
  }

  let cursor = Number(afterSeq) || 0;
  let eventTimer = null;
  let statusTimer = null;
  let unsubscribe = null;
  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    if (eventTimer) clearInterval(eventTimer);
    if (statusTimer) clearInterval(statusTimer);
    try { unsubscribe?.(); } catch { /* best-effort: unsubscribing an already-torn-down listener */ }
    onEnd();
  };
  const emitEvents = (events) => {
    for (const ev of events) {
      if (isClosed()) { finish(); return; }
      cursor = Math.max(cursor, Number(ev.seq) || cursor);
      emitEvent(ev);
    }
  };
  const pollEvents = async () => {
    if (isClosed()) { finish(); return; }
    try {
      emitEvents(await reader.events(runId, { afterSeq: cursor }));
    } catch {
      // Transient Firestore read failures should not kill the SSE stream.
    }
  };
  const pollStatus = async () => {
    if (isClosed()) { finish(); return; }
    try {
      const run = await reader.getRun(runId);
      if (run && (run.status === "done" || run.status === "failed")) {
        emitEvent({ type: "run_complete", status: run.status, ok: run.ok, ts: new Date().toISOString() });
        finish();
      }
    } catch {
      // Keep the event stream alive on transient run-doc reads.
    }
  };

  try {
    unsubscribe = reader.listenEvents?.(runId, { afterSeq: cursor }, emitEvents, () => {});
  } catch {
    unsubscribe = null;
  }
  await pollEvents();
  await pollStatus();
  if (!ended) {
    if (!unsubscribe) eventTimer = setInterval(pollEvents, 1000);
    statusTimer = setInterval(pollStatus, 1000);
  }
}
