// Background job transport: submit `ge` commands to the runtime daemon (with a
// traced local-execution fallback), persist job records/events, and stream job
// progress over SSE. Verbatim move from transport.mjs.
//
// Long mutating ops (up, mcp deploy, build, handoff, sync) must NOT run in-process —
// factory-core shells out synchronously and would block the server's event loop.
// We spawn the `ge` CLI as an async child, return a jobId immediately, and stream
// its NDJSON-shaped output over SSE so the console stays responsive.

import * as core from "../../../../../tools/lib/factory-core.mjs";
import { execStream } from "../../../../../tools/lib/exec-stream.mjs";
import {
  appendJobEvent,
  createJobRecord,
  finishJobRecord,
  getJobRecord,
  listJobEvents,
  listJobRecords,
} from "../job-store.mjs";
import { makeSseWriter } from "./sse.mjs";
import { daemonBaseUrl } from "./daemon.mjs";
import { GE_CLI } from "./paths.mjs";

const jobs = new Map(); // id -> { id, argv, status, events[], code, listeners:Set }
let jobSeq = 0;

// Job records/events are a best-effort mirror of the live stream; a failing
// store must not break the stream, but the operator should learn (once per
// job, not once per event) that the persisted history is incomplete.
const warnedJobPersist = new Set();
function warnJobPersistFailure(id, what, error) {
  if (warnedJobPersist.has(id)) return;
  warnedJobPersist.add(id);
  console.warn(`[transport] job ${id}: ${what} failed — persisted job history may be incomplete: ${error?.message || error}`);
}

function terminalJobEvent(ev) {
  return ["stage_done", "stage_failed", "stage_blocked"].includes(ev?.type) && (!ev.stage || ev.stage === "job" || ev.stage === "preflight");
}

function terminalJobStatusFromEvent(ev) {
  if (ev?.type === "stage_done") return "done";
  if (ev?.type === "stage_blocked") return "blocked";
  return "failed";
}

async function submitGeJobToDaemon(argv, command = null) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "ge.command", argv, command }),
    signal: AbortSignal.timeout(600),
  });
  if (!response.ok) throw new Error(`daemon task start failed: ${response.status}`);
  return await response.json();
}

async function streamDaemonTask(id, writeSSE, isClosed, onEnd = () => {}, { mirrorJobEvents = false } = {}) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks/${encodeURIComponent(id)}/events`, {
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok || !response.body) throw new Error(`daemon task stream failed: ${response.status}`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let ended = false;
  const finish = (status, ev) => {
    if (ended) return;
    ended = true;
    if (mirrorJobEvents) {
      finishJobRecord(id, { status, code: ev?.data?.code ?? null, lastLine: ev?.line || null }).catch((e) => warnJobPersistFailure(id, "finishJobRecord", e));
    }
    onEnd();
  };
  for (;;) {
    if (isClosed()) break;
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const line = frame.split(/\r?\n/).find((part) => part.startsWith("data: "));
      if (!line || isClosed()) continue;
      let ev;
      try { ev = JSON.parse(line.slice(6)); } catch { ev = null; }
      if (mirrorJobEvents && ev) appendJobEvent(id, ev).catch((e) => warnJobPersistFailure(id, "appendJobEvent", e));
      writeSSE(line.slice(6));
      if (terminalJobEvent(ev)) finish(terminalJobStatusFromEvent(ev), ev);
    }
  }
  if (!ended) onEnd();
}

export async function startGeJob(argv, command = null, { cfg = null, preflight = null, selection = null } = {}) {
  const pushPreflightOnly = async (id, ev) => {
    await appendJobEvent(id, ev);
  };

  // When the daemon submit fails we fall through to local execution. Capture the
  // reason so the local job carries a "fell back to local" trace instead of the
  // submit error vanishing into a silent catch (the DB may already mark the run
  // daemon-bound, so a silent fallback desyncs the UI with no way to see why).
  let daemonSubmitError = null;

  if (command?.id) {
    let preflightResult;
    try {
      preflightResult = typeof preflight === "function"
        ? preflight(command.id)
        : core.preflightCommand(cfg || core.loadConfig({}), { commandId: command.id, selection });
    } catch (e) {
      preflightResult = {
        ok: false,
        checks: [{ name: "preflight", status: "fail", detail: e.message || String(e), fix: null }],
        fails: 1,
      };
    }
    if (!preflightResult.ok) {
      const id = `job-${Date.now()}-${++jobSeq}`;
      await createJobRecord({ id, argv, command });
      await pushPreflightOnly(id, { type: "stage_started", stage: "preflight", line: `doctor readiness: ${command.id}`, ts: new Date().toISOString() });
      const line = `blocked by ${preflightResult.fails} readiness failure${preflightResult.fails === 1 ? "" : "s"}`;
      await pushPreflightOnly(id, { type: "stage_blocked", stage: "preflight", level: "error", line, data: { checks: preflightResult.checks, fails: preflightResult.fails } });
      await finishJobRecord(id, { status: "blocked", code: null, lastLine: line, checks: preflightResult.checks });
      return id;
    }
    try {
      const run = await submitGeJobToDaemon(argv, command);
      await createJobRecord({ id: run.id, argv, command });
      await pushPreflightOnly(run.id, { type: "stage_started", stage: "preflight", line: `doctor readiness: ${command.id}`, ts: new Date().toISOString() });
      await pushPreflightOnly(run.id, { type: "stage_done", stage: "preflight", level: "info", line: "readiness passed", data: { checks: preflightResult.checks } });
      return run.id;
    } catch (error) {
      daemonSubmitError = error;
    }
  }

  if (!command?.id) {
    try {
      const run = await submitGeJobToDaemon(argv, command);
      await createJobRecord({ id: run.id, argv, command });
      return run.id;
    } catch (error) {
      daemonSubmitError = error;
    }
  }

  const id = `job-${Date.now()}-${++jobSeq}`;
  const job = { id, argv, command, status: "running", events: [], code: null, listeners: new Set() };
  jobs.set(id, job);
  await createJobRecord({ id, argv, command });
  const push = (ev) => {
    job.events.push(ev);
    if (job.events.length > 5000) job.events.shift();
    appendJobEvent(id, ev).catch((e) => warnJobPersistFailure(id, "appendJobEvent", e));
    for (const l of job.listeners) { try { l(ev); } catch { /* best-effort: one throwing listener must not break fan-out to the rest */ } }
  };
  push({ type: "stage_started", stage: "job", line: `$ ge ${argv.join(" ")}`, ts: new Date().toISOString() });
  if (daemonSubmitError) {
    const reason = daemonSubmitError?.message || String(daemonSubmitError);
    console.warn(`[transport] job ${id}: daemon submit failed, running locally — ${reason}`);
    push({ type: "log", level: "warn", line: `Daemon unavailable; running this job locally instead — ${reason}`, data: { fellBackToLocal: true } });
  }

  if (command?.id) {
    push({ type: "stage_started", stage: "preflight", line: `doctor readiness: ${command.id}`, ts: new Date().toISOString() });
    push({ type: "stage_done", stage: "preflight", level: "info", line: "readiness passed" });
  }

  execStream("bun", [GE_CLI, ...argv], { onEvent: push, meta: { runId: id, stage: "job" } })
    .then((r) => {
      job.status = r.code === 0 ? "done" : "failed";
      job.code = r.code;
      const line = `exit ${r.code}`;
      push({ type: r.code === 0 ? "stage_done" : "stage_failed", stage: "job", level: r.code === 0 ? "info" : "error", line });
      finishJobRecord(id, { status: job.status, code: r.code, lastLine: line }).catch((e) => warnJobPersistFailure(id, "finishJobRecord", e));
    })
    .catch((e) => {
      const line = String(e?.message || e);
      job.status = "failed";
      push({ type: "stage_failed", stage: "job", level: "error", line });
      finishJobRecord(id, { status: "failed", code: 1, lastLine: line }).catch((e) => warnJobPersistFailure(id, "finishJobRecord", e));
    });
  return id;
}

export async function getJob(id) {
  const j = jobs.get(id);
  if (!j) return await getJobRecord(id);
  const stored = await getJobRecord(id);
  return stored ? { ...stored, status: j.status, code: j.code } : { id: j.id, argv: j.argv, command: j.command, status: j.status, code: j.code, checks: [] };
}

export async function listJobs({ limit } = {}) {
  return await listJobRecords({ limit });
}

// Replay buffered events then stream live ones; end on terminal event or close.
// Frames carry a monotonic `id:` (DB seq for stored events, buffer index for
// live ones) plus a one-time `retry:` so the browser can reconnect and resume.
export async function streamJob(id, writeSSE, isClosed, onEnd = () => {}) {
  const emit = makeSseWriter(writeSSE);
  const job = jobs.get(id);
  if (!job) {
    const stored = await getJobRecord(id);
    if (!stored) { emit(JSON.stringify({ type: "stage_failed", stage: "job", level: "error", line: "unknown job" })); onEnd(); return; }
    if (stored.status === "running") {
      try {
        await streamDaemonTask(id, writeSSE, isClosed, onEnd, { mirrorJobEvents: true });
        return;
      } catch (error) {
        console.warn(`[transport] job ${id}: daemon stream failed, replaying stored events instead — ${error?.message || error}`);
      }
    }
    for (const { seq, event } of await listJobEvents(id)) emit(JSON.stringify(event), { seq });
    onEnd();
    return;
  }
  let seq = 0;
  for (const ev of job.events) emit(JSON.stringify(ev), { seq: ++seq });
  if (job.status !== "running") { onEnd(); return; }
  const l = (ev) => {
    if (isClosed()) { job.listeners.delete(l); return; }
    emit(JSON.stringify(ev), { seq: ++seq });
    if (ev.type === "stage_done" || ev.type === "stage_failed" || ev.type === "stage_blocked") { job.listeners.delete(l); onEnd(); }
  };
  job.listeners.add(l);
}
