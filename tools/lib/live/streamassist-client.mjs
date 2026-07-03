// Live runner — the real-traffic implementation of the runner interface,
// speaking to the Discovery Engine AssistantService via the official client
// (`@google-cloud/discoveryengine` v1, server-streaming streamAssist). The
// exact call and field paths are the ones proven live in
// tests/e2e/stream-assist.e2e.test.mjs.
//
// Auth is application default credentials, handled by the client library
// itself. Every failure is translated into a stable GELIVE code so drive,
// live proof, and bench report the same failure the same way.
//
// Recording: pass { recorder } (see cassette.mjs) and every request and chunk
// is appended as it happens — a crashed run still leaves a replayable prefix.
import { liveError, isLiveError } from "./errors.mjs";

async function loadAssistantClient(apiEndpoint) {
  let mod;
  try {
    mod = await import("@google-cloud/discoveryengine");
  } catch (cause) {
    throw liveError("GELIVE002", "the Discovery Engine client library is not installed", {
      where: "@google-cloud/discoveryengine",
      why: cause?.message || String(cause),
      fix: "bun install",
      cause,
    });
  }
  const AssistantServiceClient = mod.AssistantServiceClient || mod.v1?.AssistantServiceClient;
  if (!AssistantServiceClient) {
    throw liveError("GELIVE004", "AssistantServiceClient not found on the client library export surface", {
      where: "@google-cloud/discoveryengine",
      why: "the installed library version does not expose the v1 AssistantService",
      fix: "bun install (repo pin is @google-cloud/discoveryengine ^2.7.0)",
    });
  }
  return new AssistantServiceClient({ apiEndpoint });
}

function translateStreamError(error, target) {
  if (isLiveError(error)) return error;
  const message = String(error?.message || error);
  // gRPC status codes: 7 PERMISSION_DENIED, 16 UNAUTHENTICATED, 5 NOT_FOUND.
  if (error?.code === 16 || /default credentials|could not load|unauthenticated/i.test(message)) {
    return liveError("GELIVE002", "application default credentials unavailable", {
      where: "google application default credentials",
      why: message,
      fix: "gcloud auth application-default login",
      cause: error,
    });
  }
  if (error?.code === 7 || /permission denied/i.test(message)) {
    return liveError("GELIVE003", "the live assist call was denied", {
      where: target.name,
      why: `${message} (requires discoveryengine.assistants.assist on the engine)`,
      fix: "ge doctor",
      cause: error,
    });
  }
  if (error?.code === 5 || /not found/i.test(message)) {
    return liveError("GELIVE007", `assist surface not found: ${target.name}`, {
      where: target.name,
      why: message,
      fix: "ge config explain (check geAppId / geLocation point at a live engine)",
      cause: error,
    });
  }
  return liveError("GELIVE004", "live stream failed", {
    where: target.name,
    why: message,
    fix: "retry the command (transient transport failure)",
    retryable: true,
    cause: error,
  });
}

// Consume a gax server-streaming call, stamping each chunk with its arrival
// offset. Supports both event-emitter and async-iterable stream styles.
export function collectStreamChunks(stream, { now = () => Date.now() } = {}) {
  const startedAt = now();
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    const onData = (chunk) => chunks.push({ atMs: now() - startedAt, json: JSON.parse(JSON.stringify(chunk)) });
    const onError = (error) => { if (!settled) { settled = true; reject(error); } };
    const onEnd = () => { if (!settled) { settled = true; resolve(chunks); } };
    if (typeof stream.on === "function") {
      stream.on("data", onData);
      stream.on("error", onError);
      stream.on("end", onEnd);
      return;
    }
    (async () => {
      try {
        for await (const chunk of stream) onData(chunk);
        onEnd();
      } catch (error) {
        onError(error);
      }
    })();
  });
}

export async function createLiveRunner(target, { recorder = null, agentsSpec = null } = {}) {
  const client = await loadAssistantClient(target.apiEndpoint);
  return {
    kind: "streamassist",
    meta: { target: { project: target.project, location: target.location, engine: target.engine, assistant: target.assistant } },
    path: recorder?.path,
    async runTurn({ index, text, session }) {
      const request = {
        name: target.name,
        query: { text },
        ...(session ? { session } : {}),
        ...(agentsSpec ? { agentsSpec } : {}),
      };
      if (recorder) recorder.request(index, session ?? null, { query: { text }, ...(session ? { session } : {}) });
      let chunks;
      try {
        const stream = client.streamAssist(request);
        chunks = await collectStreamChunks(stream);
      } catch (error) {
        throw translateStreamError(error, target);
      }
      if (recorder) for (const { atMs, json } of chunks) recorder.chunk(index, atMs, json);
      return { chunks, request };
    },
    async close() {
      try {
        await client.close();
      } catch { /* best-effort: closing a gRPC channel that already dropped must not mask the run's real result */ }
    },
  };
}
