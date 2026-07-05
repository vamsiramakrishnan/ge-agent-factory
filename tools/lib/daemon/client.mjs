// tools/lib/daemon/client.mjs — the HTTP client for the runtime daemon's wire
// contract (tools/lib/daemon/http-app.mjs). The daemon SERVER has lived in
// tools/lib since it was extracted onto Hono; until now its only HTTP CLIENT
// was hand-rolled console-side (apps/console/src/server/transport/{daemon,jobs}.mjs)
// with a second, independent client in tools/ge/{daemon.mjs,shared.mjs} for the
// CLI. This module is the shared one: both call sites should end up thin
// bindings over it (the CLI's reconnect-on-drop SSE follower in
// tools/ge/shared.mjs's followTaskEvents is a good candidate to rebase on
// followEvents() below in a follow-up — not done here to keep this change's
// blast radius to the console).
//
// Pure return/throw, no console/apps imports (AGENTS.md convention) — this
// module never reads process.env itself; callers resolve their own
// baseUrl/port (the console re-reads GE_DAEMON_PORT per call via
// apps/console/src/server/transport/daemon.mjs's daemonBaseUrl(), the CLI via
// tools/ge/shared.mjs's daemonPort()) and construct a client per call so a
// runtime port change is picked up immediately, matching both existing
// clients' behavior today.
//
// Error classification: fetch() itself only ever rejects for a connection-
// level failure (refused/reset/DNS/timeout at the socket layer) or a signal
// abort — it resolves normally for any HTTP response, including 4xx/5xx. That
// means "fetch threw" and "the daemon answered with an error" are reliably
// distinguishable at the point of the call, which is exactly the distinction
// the console's daemon-unreachable fallback needs (tools/lib/ge-job-runner.mjs's
// createLocalJobSubmit falls back to local execution on ANY daemonSubmit
// rejection today — connection failures and HTTP failures are both "the
// daemon isn't usable right now" for that caller — but a typed error lets a
// caller that DOES care tell them apart without string-sniffing).
const DEFAULT_PORT = 17654;
const DEFAULT_TIMEOUT_MS = 5000;

export class DaemonConnectionError extends Error {
  constructor(message, { cause } = {}) {
    super(message);
    this.name = "DaemonConnectionError";
    if (cause !== undefined) this.cause = cause;
  }
}

export class DaemonHttpError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "DaemonHttpError";
    this.status = status;
    this.body = body;
  }
}

function resolveBaseUrl({ baseUrl, port }) {
  if (baseUrl) return baseUrl.replace(/\/+$/, "");
  return `http://127.0.0.1:${port ?? DEFAULT_PORT}`;
}

// Wrap a fetch call so a connection-level failure surfaces as a
// DaemonConnectionError — never let a bare TypeError/DOMException escape,
// so callers can `instanceof` their way to "the daemon isn't reachable"
// instead of pattern-matching error messages.
async function daemonFetch(fetchImpl, requestUrl, opts) {
  try {
    return await fetchImpl(requestUrl, opts);
  } catch (error) {
    throw new DaemonConnectionError(`daemon unreachable: ${error?.message || error}`, { cause: error });
  }
}

// GET/POST + JSON body, raising a DaemonHttpError (with status/body attached)
// on a non-2xx response. Mirrors tools/ge/shared.mjs's daemonRequest: best-
// effort JSON parse of the error body (a non-JSON error page still resolves
// to a message), real JSON parse (throws on malformed body) on success.
async function requestJson(fetchImpl, requestUrl, opts, { errorPrefix }) {
  const response = await daemonFetch(fetchImpl, requestUrl, opts);
  if (!response.ok) {
    let body = null;
    try { body = await response.json(); } catch { /* best-effort: error responses aren't always JSON */ }
    const detail = body?.error || response.statusText || String(response.status);
    throw new DaemonHttpError(`${errorPrefix}: ${detail}`, { status: response.status, body });
  }
  return await response.json();
}

// createDaemonClient({ baseUrl?, port?, fetchImpl?, timeoutMs? }) -> client
//
//   baseUrl     full origin, e.g. "http://127.0.0.1:17654" — takes priority
//               over `port` when both are given.
//   port        used to build the default 127.0.0.1 origin when `baseUrl` is
//               omitted (default 17654, matching daemonPaths().defaultPort).
//   fetchImpl   injectable fetch (default the global) — tests can pass a
//               stub/spy without touching the network.
//   timeoutMs   default per-call timeout (default 5000ms); every method also
//               takes its own `timeoutMs` override so a caller (e.g. the
//               console's 600ms job submit) keeps its own choice per call.
//
// Every method throws DaemonConnectionError for a connection-level failure or
// DaemonHttpError for a non-2xx response; both extend Error, so an untyped
// `catch (e)` still works exactly as it does against today's hand-rolled
// fetch calls.
export function createDaemonClient({ baseUrl, port, fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const base = resolveBaseUrl({ baseUrl, port });
  const url = (path) => `${base}${path}`;

  async function status({ timeoutMs: t = timeoutMs } = {}) {
    return requestJson(fetchImpl, url("/api/runtime/status"), { signal: AbortSignal.timeout(t) }, { errorPrefix: "daemon status failed" });
  }

  async function listRuns({ full = false, limit, timeoutMs: t = timeoutMs } = {}) {
    const params = new URLSearchParams();
    if (full) params.set("full", "true");
    if (limit !== undefined) params.set("limit", String(limit));
    const qs = params.toString();
    const body = await requestJson(fetchImpl, url(`/api/tasks${qs ? `?${qs}` : ""}`), { signal: AbortSignal.timeout(t) }, { errorPrefix: "daemon task list failed" });
    return body?.tasks || [];
  }

  async function submitTask(body, { timeoutMs: t = timeoutMs } = {}) {
    return requestJson(fetchImpl, url("/api/tasks"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(t),
    }, { errorPrefix: "daemon task start failed" });
  }

  async function taskDetail(id, { timeoutMs: t = timeoutMs } = {}) {
    return requestJson(fetchImpl, url(`/api/tasks/${encodeURIComponent(id)}`), { signal: AbortSignal.timeout(t) }, { errorPrefix: "daemon task lookup failed" });
  }

  // One-shot JSON read of GET /api/tasks/:id/events?format=json — returns the
  // server's own { events, afterSeq } shape (events already filtered
  // server-side to seq > afterSeq, per http-app.mjs's afterSeqFrom).
  async function events(id, { afterSeq, timeoutMs: t = timeoutMs } = {}) {
    const params = new URLSearchParams();
    params.set("format", "json");
    if (afterSeq) params.set("afterSeq", String(afterSeq));
    return requestJson(fetchImpl, url(`/api/tasks/${encodeURIComponent(id)}/events?${params}`), { signal: AbortSignal.timeout(t) }, { errorPrefix: "daemon task events failed" });
  }

  async function resume(id, { timeoutMs: t = timeoutMs } = {}) {
    return requestJson(fetchImpl, url(`/api/tasks/${encodeURIComponent(id)}/resume`), {
      method: "POST",
      signal: AbortSignal.timeout(t),
    }, { errorPrefix: "daemon task resume failed" });
  }

  // Consume GET /api/tasks/:id/events as SSE, once, honoring the server's
  // Last-Event-ID resume contract (afterSeq seeds the initial header exactly
  // like tools/ge/shared.mjs's followTaskEvents does on a reconnect). Calls
  // onEvent(parsedEvent, { seq, raw }) per frame that carries a `data:` line
  // (heartbeats/bare `retry:` frames are skipped, same as the CLI follower);
  // resolves with { lastEventId } once the server closes the stream (the run
  // reached a terminal state) or the reader completes. Reconnect-on-drop is
  // deliberately NOT this function's job — it is one pass over one HTTP
  // response, matching the daemon's actual wire behavior; a caller that wants
  // resilience against a dropped TCP connection re-invokes followEvents with
  // afterSeq: <lastEventId> (see tools/ge/shared.mjs's followTaskEvents for
  // that reconnect loop built on an equivalent one-shot read).
  async function followEvents(id, { afterSeq = 0, signal, onEvent } = {}) {
    const headers = afterSeq ? { "Last-Event-ID": String(afterSeq) } : undefined;
    const response = await daemonFetch(fetchImpl, url(`/api/tasks/${encodeURIComponent(id)}/events`), { headers, signal });
    if (!response.ok || !response.body) {
      throw new DaemonHttpError(`daemon task stream failed: ${response.status}`, { status: response.status });
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let lastEventId = afterSeq || 0;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n\n")) >= 0) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const lines = frame.split(/\r?\n/);
          const idLine = lines.find((part) => part.startsWith("id: "));
          if (idLine) lastEventId = Number(idLine.slice(4)) || lastEventId;
          const dataLine = lines.find((part) => part.startsWith("data: "));
          if (!dataLine) continue; // ": ping" heartbeat or a bare retry: line
          let event = null;
          try { event = JSON.parse(dataLine.slice(6)); } catch { event = null; }
          if (onEvent) onEvent(event, { seq: lastEventId, raw: dataLine.slice(6) });
        }
      }
    } finally {
      try { reader.releaseLock(); } catch { /* best-effort: already released on a clean/aborted end */ }
    }
    return { lastEventId };
  }

  return { status, listRuns, submitTask, taskDetail, events, resume, followEvents };
}
