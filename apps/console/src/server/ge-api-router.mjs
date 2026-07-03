import { handleGeApi, isConsoleReadonly } from "./ge-api.mjs";
import {
  toApiReq,
  streamLogs,
  streamDoctor,
  streamLedger,
  core,
  startGeJob,
  getJob,
  listJobs,
  streamJob,
  startRepairRun,
  resumeRepairRun,
  getRepair,
  listRepairs,
  getRepairEvents,
} from "./transport.mjs";
import {
  uploadInterviewDocument,
  listInterviewDocuments,
  writeInterviewSpec,
  readGenerationSpec,
  interviewOkfBundle,
} from "./interview-docs.mjs";
import { listKnownSystems, synthesizeSystem } from "./systems.mjs";
import { firebaseAuthMode, bearerFrom, verifyFirebaseIdToken } from "./firebase-auth.mjs";

// Opt-in Firebase auth gate for /api/*. Inert unless GE_AUTH_MODE=firebase: when
// disabled this returns null and the request passes through unchanged (the central
// deploy is fronted by IAP and never sets GE_AUTH_MODE). When enabled, every /api/*
// request — including SSE, where EventSource can't send headers so the client passes
// the token as ?access_token= (handled by bearerFrom) — must carry a valid Firebase
// ID token. authHeader is read per-transport (fetch Request vs node IncomingMessage).
async function enforceFirebaseAuth(req, getAuthHeader) {
  if (!firebaseAuthMode()) return null;
  const token = bearerFrom(getAuthHeader(), req.url || "/");
  if (!token) return { ok: false };
  try {
    await verifyFirebaseIdToken(token);
    return null;
  } catch {
    return { ok: false };
  }
}

const JSON_HEADERS = { "Content-Type": "application/json" };
const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
};

function isGeApiUrl(url) {
  return new URL(url || "/", "http://localhost").pathname.startsWith("/api/ge");
}

function isRuntimeApiUrl(url) {
  return new URL(url || "/", "http://localhost").pathname.startsWith("/api/runtime");
}

function isInterviewApiUrl(url) {
  return new URL(url || "/", "http://localhost").pathname.startsWith("/api/interviews");
}

function isSystemsApiUrl(url) {
  return new URL(url || "/", "http://localhost").pathname.startsWith("/api/systems");
}

// Bring-Your-Own-System backend: list the known built-in simulators, or
// synthesize a brand-new LIVE simulator from a natural-language description
// (samples / OpenAPI also supported) via the generator's synthesize_cli.py.
async function handleSystemsRequest(req, responder) {
  const url = new URL(req.url || "/", "http://localhost");
  if (!isSystemsApiUrl(url)) return null;

  // Mirror the /api/ge readonly gate for the mutating (synthesize) route.
  if (req.method !== "GET" && isConsoleReadonly()) {
    return responder.json(403, { error: "console is read-only (GE_CONSOLE_READONLY)" });
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/systems") {
      return responder.json(200, await listKnownSystems());
    }
    if (req.method === "POST" && url.pathname === "/api/systems/synthesize") {
      const text = typeof req.text === "function" ? await req.text() : await readNodeBody(req);
      let body = {};
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          return responder.json(400, { ok: false, error: "invalid JSON body" });
        }
      }
      const result = await synthesizeSystem(body);
      return responder.json(200, result);
    }
  } catch (error) {
    // Validation (4xx) vs. spawn/parse failures (5xx): keep ok:false so the UI
    // renders the error inline either way, consistent with the CLI's result shape.
    const status = error.statusCode || 500;
    return responder.json(status, { ok: false, error: error.message || String(error) });
  }
  return responder.json(405, { ok: false, error: "method not allowed" });
}

// Interview document store + spec writer. Sits beside the daemon proxy and
// intercepts BEFORE the generic JSON descriptor path so multipart-free uploads
// (base64 JSON) work identically under Bun (fetch Request) and Vite (Node req).
async function handleInterviewDocsRequest(req, responder) {
  const url = new URL(req.url || "/", "http://localhost");
  const docsMatch = url.pathname.match(/^\/api\/interviews\/([^/]+)\/documents$/);
  const specMatch = url.pathname.match(/^\/api\/interviews\/([^/]+)\/spec$/);
  const genSpecMatch = url.pathname.match(/^\/api\/interviews\/([^/]+)\/generation-spec$/);
  const okfMatch = url.pathname.match(/^\/api\/interviews\/([^/]+)\/okf$/);
  if (!docsMatch && !specMatch && !genSpecMatch && !okfMatch) return null;

  // Mirror the /api/ge readonly gate for mutations.
  if (req.method !== "GET" && isConsoleReadonly()) {
    return responder.json(403, { error: "console is read-only (GE_CONSOLE_READONLY)" });
  }

  const readBody = async () => {
    const text = typeof req.text === "function" ? await req.text() : await readNodeBody(req);
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      const err = new Error("invalid JSON body");
      err.statusCode = 400;
      throw err;
    }
  };

  try {
    // Cross-origin readable: the presentation deploy panel fetches this via ?spec=.
    // Read-only, non-sensitive generation spec — safe to expose with ACAO:*.
    if (genSpecMatch && req.method === "GET") {
      const cors = { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };
      const spec = await readGenerationSpec(decodeURIComponent(genSpecMatch[1]));
      if (!spec) return responder.json(404, { error: "no generation spec available for this use case" }, cors);
      return responder.json(200, spec, cors);
    }
    // The interview's spec AS an OKF Knowledge Bundle (path -> markdown map):
    // queries (what the agent answers), tests (how each is exercised), source
    // documents, plus systems/tables/tools/workflow/playbook. Additive + read-only.
    if (okfMatch && req.method === "GET") {
      const bundle = await interviewOkfBundle(decodeURIComponent(okfMatch[1]));
      if (!bundle) return responder.json(404, { error: "no agent-spec available to convert to OKF for this use case" });
      return responder.json(200, bundle, { "Cache-Control": "no-store" });
    }
    if (docsMatch && req.method === "GET") {
      return responder.json(200, await listInterviewDocuments(decodeURIComponent(docsMatch[1])));
    }
    if (docsMatch && req.method === "POST") {
      const body = await readBody();
      const result = await uploadInterviewDocument(decodeURIComponent(docsMatch[1]), body);
      return responder.json(200, result);
    }
    if (specMatch && req.method === "POST") {
      const body = await readBody();
      const result = await writeInterviewSpec(decodeURIComponent(specMatch[1]), body.spec ?? body);
      return responder.json(200, result);
    }
  } catch (error) {
    return responder.json(error.statusCode || 500, { error: error.message || String(error) });
  }
  return responder.json(405, { error: "method not allowed" });
}

async function handleRuntimeFetchRequest(req, responder) {
  const url = new URL(req.url || "/", "http://localhost");
  // Readonly gate also covers the daemon proxy (mirrors the /api/ge gate), so a
  // readonly console can't mutate via /api/runtime/* even if a daemon is colocated.
  if (req.method !== "GET" && isConsoleReadonly()) {
    return responder.json(403, { error: "console is read-only (GE_CONSOLE_READONLY)" });
  }
  const port = Number(process.env.GE_DAEMON_PORT || 17654);
  if (req.method === "GET" && url.pathname === "/api/runtime/status") {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/runtime/status`, {
        signal: AbortSignal.timeout(800),
      });
      if (!response.ok) throw new Error(`daemon returned ${response.status}`);
      return responder.json(200, await response.json());
    } catch (error) {
      return responder.json(200, {
        ok: false,
        status: "stopped",
        port,
        error: error.message || String(error),
        supportedTaskKinds: [],
        capabilities: {},
        restartCommand: "ge daemon stop && ge daemon start",
      });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/runtime/tasks") {
    const params = new URLSearchParams({
      limit: url.searchParams.get("limit") || "25",
    });
    if (url.searchParams.get("full") === "true") params.set("full", "true");
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/tasks?${params.toString()}`, {
        signal: AbortSignal.timeout(800),
      });
      if (!response.ok) throw new Error(`daemon returned ${response.status}`);
      return responder.json(200, await response.json());
    } catch (error) {
      return responder.json(200, { tasks: [], daemon: { ok: false, error: error.message || String(error) } });
    }
  }
  if (req.method === "POST" && url.pathname === "/api/runtime/tasks") {
    try {
      const text = typeof req.text === "function" ? await req.text() : await readNodeBody(req);
      const response = await fetch(`http://127.0.0.1:${port}/api/tasks`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: text || "{}",
        signal: AbortSignal.timeout(1500),
      });
      const body = await response.json();
      return responder.json(response.status, body);
    } catch (error) {
      return responder.json(503, { error: error.message || String(error) });
    }
  }
  const eventMatch = url.pathname.match(/^\/api\/runtime\/tasks\/([^/]+)\/events$/);
  if (req.method === "GET" && eventMatch) {
    const taskId = eventMatch[1];
    const params = new URLSearchParams();
    if (url.searchParams.get("afterSeq")) params.set("afterSeq", url.searchParams.get("afterSeq"));
    // A browser EventSource reconnect sends Last-Event-ID; hand it to the
    // daemon as afterSeq so the resume happens at the source instead of
    // replaying the whole stream through the proxy.
    const lastEventId = typeof req.headers?.get === "function" ? req.headers.get("last-event-id") : req.headers?.["last-event-id"];
    if (lastEventId && !params.get("afterSeq")) params.set("afterSeq", lastEventId);
    if (url.searchParams.get("format") === "json") params.set("format", "json");
    const daemonUrl = `http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(taskId)}/events${params.toString() ? `?${params.toString()}` : ""}`;
    if (params.get("format") === "json") {
      try {
        const response = await fetch(daemonUrl, { signal: AbortSignal.timeout(1200) });
        const body = await response.json();
        return responder.json(response.status, body);
      } catch (error) {
        return responder.json(503, { error: error.message || String(error) });
      }
    }
    return responder.sse((writeSSE, isClosed, end) => {
      proxyRuntimeSse(daemonUrl, writeSSE, isClosed, end);
    });
  }
  const taskMatch = url.pathname.match(/^\/api\/runtime\/tasks\/([^/]+)$/);
  if (req.method === "GET" && taskMatch) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(taskMatch[1])}`, {
        signal: AbortSignal.timeout(1200),
      });
      const body = await response.json();
      return responder.json(response.status, body);
    } catch (error) {
      return responder.json(503, { error: error.message || String(error) });
    }
  }
  const resumeMatch = url.pathname.match(/^\/api\/runtime\/tasks\/([^/]+)\/resume$/);
  if (req.method === "POST" && resumeMatch) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(resumeMatch[1])}/resume`, {
        method: "POST",
        signal: AbortSignal.timeout(1200),
      });
      const body = await response.json();
      return responder.json(response.status, body);
    } catch (error) {
      return responder.json(503, { error: error.message || String(error) });
    }
  }
  const interactionMatch = url.pathname.match(/^\/api\/runtime\/tasks\/([^/]+)\/interactions\/([^/]+)$/);
  if (req.method === "POST" && interactionMatch) {
    try {
      const text = typeof req.text === "function" ? await req.text() : await readNodeBody(req);
      const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(interactionMatch[1])}/interactions/${encodeURIComponent(interactionMatch[2])}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: text || "{}",
        signal: AbortSignal.timeout(1500),
      });
      const body = await response.json();
      return responder.json(response.status, body);
    } catch (error) {
      return responder.json(503, { error: error.message || String(error) });
    }
  }
  return null;
}

async function proxyRuntimeSse(url, writeSSE, isClosed, end) {
  try {
    const response = await fetch(url);
    if (!response.ok || !response.body) {
      writeSSE(JSON.stringify({
        type: "runtime_stream_error",
        level: "error",
        line: `daemon returned ${response.status}`,
      }));
      end();
      return;
    }

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let buffer = "";
    while (!isClosed()) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split(/\n\n/);
      buffer = frames.pop() || "";
      for (const frame of frames) {
        if (isClosed()) break;
        // Preserve the daemon's id: framing (event seq) so the browser's
        // native Last-Event-ID reconnect can resume at the right point.
        const lines = frame.split(/\n/);
        const idLine = lines.find((line) => line.startsWith("id:"));
        const id = idLine ? idLine.slice(3).trim() : null;
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trimStart();
          if (id != null && typeof writeSSE.frame === "function") writeSSE.frame({ data, id });
          else writeSSE(data);
        }
      }
    }
  } catch (error) {
    if (!isClosed()) {
      writeSSE(JSON.stringify({
        type: "runtime_stream_error",
        level: "error",
        line: error.message || String(error),
      }));
    }
  } finally {
    end();
  }
}

async function readNodeBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function dispatchGeApiResult(result, responder) {
  if (result.json !== undefined) {
    return responder.json(result.status, result.json);
  }

  if (result.job) {
    return responder.json(202, {
      jobId: await startGeJob(result.job, result.command, { cfg: result.cfg, selection: result.selection }),
      command: result.command,
    });
  }

  if (result.jobStatus) {
    return responder.json(200, await getJob(result.jobStatus) || { error: "unknown job", status: "unknown" });
  }

  if (result.jobList) {
    return responder.json(200, { jobs: await listJobs(result.jobList) });
  }

  if (result.repairStart) {
    const started = await startRepairRun(result.repairStart);
    return responder.json(started.skipped ? 200 : 202, started);
  }

  if (result.repairResume) {
    return responder.json(202, {
      run: await resumeRepairRun(result.repairResume.id, result.repairResume),
    });
  }

  if (result.repairList) {
    return responder.json(200, { runs: await listRepairs(result.repairList) });
  }

  if (result.repairGet) {
    const run = await getRepair(result.repairGet);
    return responder.json(run ? 200 : 404, run || { error: "unknown repair run" });
  }

  if (result.repairEvents) {
    return responder.json(200, {
      events: await getRepairEvents(result.repairEvents.id, {
        afterSeq: result.repairEvents.afterSeq,
      }),
    });
  }

  if (result.stream === "job") {
    return responder.sse((writeSSE, isClosed, end) => {
      streamJob(result.jobId, writeSSE, isClosed, end);
    });
  }

  if (result.stream === "doctor") {
    return responder.sse((writeSSE, isClosed, end) => {
      streamDoctor(result, writeSSE, isClosed, end);
    });
  }

  if (result.stream === "logs") {
    return responder.sse((writeSSE, isClosed) => {
      streamLogs(result, writeSSE, isClosed);
    });
  }

  if (result.stream === "ledger") {
    return responder.sse((writeSSE, isClosed, end) => {
      streamLedger(result, writeSSE, isClosed, end);
    });
  }

  if (result.stream === "events") {
    return responder.heartbeat();
  }

  return responder.json(500, { error: "Unknown response type" });
}

export async function handleGeFetchRequest(req, { headers = {} } = {}) {
  if (!isGeApiUrl(req.url) && !isRuntimeApiUrl(req.url) && !isInterviewApiUrl(req.url) && !isSystemsApiUrl(req.url)) return null;

  const responseHeaders = (extra = {}) => ({ ...headers, ...extra });
  const responder = {
    json(status, data, extraHeaders = {}) {
      return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: responseHeaders({ ...JSON_HEADERS, ...extraHeaders }),
      });
    },
    sse(start) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const writeSSE = (line) => {
            try {
              controller.enqueue(encoder.encode(`data: ${line}\n\n`));
            } catch { /* best-effort: enqueue throws once the client disconnects; isClosed() ends the stream */ }
          };
          // Reconnect-safe framing: emit id:/retry: alongside data: so the browser
          // can resume via Last-Event-ID and cap its reconnect backoff.
          writeSSE.frame = ({ data, id, retry }) => {
            try {
              let f = "";
              if (retry != null) f += `retry: ${retry}\n`;
              if (id != null) f += `id: ${id}\n`;
              f += `data: ${data}\n\n`;
              controller.enqueue(encoder.encode(f));
            } catch { /* best-effort: enqueue throws once the client disconnects; isClosed() ends the stream */ }
          };
          const isClosed = () => {
            try {
              return controller.desiredSize === null;
            } catch {
              return true;
            }
          };
          const end = () => {
            try {
              controller.close();
            } catch { /* best-effort: double-close after client disconnect is expected */ }
          };
          start(writeSSE, isClosed, end);
        },
      });
      return new Response(stream, { headers: responseHeaders(SSE_HEADERS) });
    },
    heartbeat() {
      const encoder = new TextEncoder();
      let heartbeatTimer;
      const stream = new ReadableStream({
        start(controller) {
          heartbeatTimer = setInterval(() => {
            try {
              controller.enqueue(encoder.encode(": ping\n\n"));
            } catch {
              clearInterval(heartbeatTimer);
            }
          }, 15000);
        },
        cancel() {
          if (heartbeatTimer) clearInterval(heartbeatTimer);
        },
      });
      return new Response(stream, { headers: responseHeaders(SSE_HEADERS) });
    },
  };

  try {
    const denied = await enforceFirebaseAuth(req, () => req.headers.get("authorization"));
    if (denied) return responder.json(401, { error: "unauthenticated" });
    const runtimeResponse = await handleRuntimeFetchRequest(req, responder);
    if (runtimeResponse) return runtimeResponse;
    const interviewResponse = await handleInterviewDocsRequest(req, responder);
    if (interviewResponse) return interviewResponse;
    const systemsResponse = await handleSystemsRequest(req, responder);
    if (systemsResponse) return systemsResponse;
    const apiReq = await toApiReq(req.method, req.url, await req.text());
    const result = await handleGeApi(apiReq, core);
    return await dispatchGeApiResult(result, responder);
  } catch (error) {
    return responder.json(500, { error: error.message });
  }
}

export async function handleGeNodeRequest(req, res, next) {
  if (!isGeApiUrl(req.url) && !isRuntimeApiUrl(req.url) && !isInterviewApiUrl(req.url) && !isSystemsApiUrl(req.url)) {
    next();
    return;
  }

  const setHeaders = (headers) => {
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  };
  const responder = {
    json(status, data, extraHeaders = {}) {
      res.statusCode = status;
      setHeaders({ ...JSON_HEADERS, ...extraHeaders });
      res.end(JSON.stringify(data, null, 2));
      return true;
    },
    sse(start) {
      res.writeHead(200, SSE_HEADERS);
      const writeSSE = (line) => {
        if (!res.writableEnded) res.write(`data: ${line}\n\n`);
      };
      // Reconnect-safe framing: see the fetch-path note above.
      writeSSE.frame = ({ data, id, retry }) => {
        if (res.writableEnded) return;
        let f = "";
        if (retry != null) f += `retry: ${retry}\n`;
        if (id != null) f += `id: ${id}\n`;
        f += `data: ${data}\n\n`;
        res.write(f);
      };
      const isClosed = () => res.writableEnded || res.destroyed;
      const end = () => {
        if (!res.writableEnded) res.end();
      };
      start(writeSSE, isClosed, end);
      return true;
    },
    heartbeat() {
      res.writeHead(200, SSE_HEADERS);
      const heartbeat = setInterval(() => {
        if (res.writableEnded || res.destroyed) {
          clearInterval(heartbeat);
          return;
        }
        res.write(": ping\n\n");
      }, 15000);
      req.on("close", () => clearInterval(heartbeat));
      return true;
    },
  };

  try {
    const denied = await enforceFirebaseAuth(req, () => req.headers?.authorization);
    if (denied) {
      responder.json(401, { error: "unauthenticated" });
      return;
    }
    const runtimeResponse = await handleRuntimeFetchRequest(req, responder);
    if (runtimeResponse) return;
    const interviewResponse = await handleInterviewDocsRequest(req, responder);
    if (interviewResponse) return;
    const systemsResponse = await handleSystemsRequest(req, responder);
    if (systemsResponse) return;
    const bodyText = await readNodeBody(req);
    const apiReq = await toApiReq(req.method || "GET", req.url || "/", bodyText);
    const result = await handleGeApi(apiReq, core);
    await dispatchGeApiResult(result, responder);
  } catch (error) {
    if (!res.headersSent && !res.writableEnded) {
      responder.json(500, { error: error.message });
      return;
    }
    console.error(error);
  }
}
