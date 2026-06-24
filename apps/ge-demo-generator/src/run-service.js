import { randomUUID } from "node:crypto";

export const TERMINAL_RUN_STATUSES = new Set(["succeeded", "failed", "canceled"]);

export function createRunService({
  createSse,
  maxEvents = 2000,
  ttlMs = 30 * 60 * 1000,
  onFinish = null,
} = {}) {
  const runs = new Map();

  function create(meta = {}) {
    const now = Date.now();
    const run = {
      id: randomUUID(),
      status: "queued",
      createdAt: now,
      updatedAt: now,
      nextEventId: 1,
      events: [],
      clients: new Set(),
      waiters: new Set(),
      child: null,
      eventLog: null,
      eventLogPath: null,
      exitCode: null,
      signal: null,
      cancelRequested: false,
      wakeupReason: typeof meta.wakeupReason === "string" && meta.wakeupReason ? meta.wakeupReason : null,
      wakeupMessage: typeof meta.wakeupMessage === "string" && meta.wakeupMessage ? meta.wakeupMessage : null,
      coalescedWakeups: [],
      projectId: typeof meta.projectId === "string" && meta.projectId ? meta.projectId : null,
      agentId: typeof meta.agentId === "string" && meta.agentId ? meta.agentId : null,
      selectedAgentId: typeof meta.selectedAgentId === "string" && meta.selectedAgentId ? meta.selectedAgentId : null,
    };
    runs.set(run.id, run);
    return run;
  }

  function get(runId) {
    return runs.get(runId) || null;
  }

  function list(filters = {}) {
    return Array.from(runs.values()).filter((run) => {
      if (filters.projectId && run.projectId !== filters.projectId) return false;
      if (filters.agentId && run.agentId !== filters.agentId) return false;
      if (filters.status === "active") return !TERMINAL_RUN_STATUSES.has(run.status);
      if (filters.status && run.status !== filters.status) return false;
      return true;
    });
  }

  function statusBody(run) {
    return {
      id: run.id,
      projectId: run.projectId,
      agentId: run.agentId,
      selectedAgentId: run.selectedAgentId,
      status: run.status,
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
      exitCode: run.exitCode,
      signal: run.signal,
      wakeupReason: run.wakeupReason,
      coalescedWakeupCount: run.coalescedWakeups.length,
      eventCount: run.events.length,
      eventLogPath: run.eventLogPath || null,
      runtime: run.runtime || null,
    };
  }

  function scheduleCleanup(run) {
    setTimeout(() => {
      if (TERMINAL_RUN_STATUSES.has(run.status)) runs.delete(run.id);
    }, ttlMs).unref?.();
  }

  function emit(run, event, data) {
    const record = { id: run.nextEventId++, event, data, createdAt: new Date().toISOString() };
    run.events.push(record);
    if (run.events.length > maxEvents) run.events.splice(0, run.events.length - maxEvents);
    run.updatedAt = Date.now();
    if (run.eventLog) run.eventLog.write(`${JSON.stringify(record)}\n`);
    for (const client of run.clients) client.send(event, data, record.id);
    return record;
  }

  function finish(run, status, code = null, signal = null) {
    if (TERMINAL_RUN_STATUSES.has(run.status)) return;
    run.status = status;
    run.exitCode = code;
    run.signal = signal;
    run.updatedAt = Date.now();
    emit(run, "end", { status, code, signal });
    if (run.eventLog) run.eventLog.end();
    if (typeof onFinish === "function") {
      try {
        onFinish(run, status, code, signal);
      } catch {
        // Lifecycle cleanup should not prevent SSE clients from closing.
      }
    }
    for (const client of run.clients) client.end();
    run.clients.clear();
    for (const waiter of run.waiters) waiter(statusBody(run));
    run.waiters.clear();
    scheduleCleanup(run);
  }

  function fail(run, code, message, detail = {}) {
    emit(run, "error", { code, message, ...detail });
    finish(run, "failed", 1);
  }

  function stream(req, res, run) {
    const sse = createSse(res);
    const lastEventId = Number(req.headers["last-event-id"] || new URL(req.url, "http://local").searchParams.get("after") || 0);
    for (const record of run.events) {
      if (!Number.isFinite(lastEventId) || record.id > lastEventId) sse.send(record.event, record.data, record.id);
    }
    if (TERMINAL_RUN_STATUSES.has(run.status)) {
      sse.end();
      return;
    }
    run.clients.add(sse);
    req.on("close", () => {
      run.clients.delete(sse);
    });
  }

  function wait(run) {
    if (TERMINAL_RUN_STATUSES.has(run.status)) return Promise.resolve(statusBody(run));
    return new Promise((resolve) => run.waiters.add(resolve));
  }

  function cancel(run, terminateChild) {
    if (TERMINAL_RUN_STATUSES.has(run.status)) return;
    run.cancelRequested = true;
    run.updatedAt = Date.now();
    if (run.child && !run.child.killed && typeof terminateChild === "function") {
      terminateChild(run.child, "SIGTERM");
      return;
    }
    finish(run, "canceled", null, "SIGTERM");
  }

  function coalesceWakeup(run, wakeup = {}) {
    const record = {
      reason: typeof wakeup.reason === "string" && wakeup.reason ? wakeup.reason : "on_demand",
      message: typeof wakeup.message === "string" ? wakeup.message.slice(0, 4000) : "",
      createdAt: new Date().toISOString(),
    };
    run.coalescedWakeups.push(record);
    run.updatedAt = Date.now();
    emit(run, "wakeup", { coalesced: true, ...record, coalescedWakeupCount: run.coalescedWakeups.length });
    return record;
  }

  return {
    create,
    get,
    list,
    emit,
    finish,
    fail,
    stream,
    wait,
    cancel,
    coalesceWakeup,
    statusBody,
    isTerminal(status) {
      return TERMINAL_RUN_STATUSES.has(status);
    },
  };
}
