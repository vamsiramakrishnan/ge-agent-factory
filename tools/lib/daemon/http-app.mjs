// tools/lib/daemon/http-app.mjs — the daemon's HTTP surface as a Hono app.
//
// Replaces the hand-rolled node:http if/regex ladder that predated hono in
// this repo (apps/factory/src/server.js established the hono-on-node pattern).
// What this buys, concretely:
//   · one declarative route table instead of ordered regex matching;
//   · zod-validated task creation (task-schemas.mjs) — malformed bodies fail
//     as one field-level 400 before any run state is created;
//   · real SSE framing: every frame carries `id:` (the event seq) and the
//     first frame a `retry:` hint, `: ping` heartbeats keep proxies from
//     killing idle streams, and reconnecting clients resume from
//     `Last-Event-ID` (or `?afterSeq=`) instead of replaying from zero.
//     `?format=json` honors `afterSeq` server-side too, so pollers stop
//     re-downloading the whole event log every tick.
//
// The app is transport-agnostic (`app.fetch`): runtime-daemon.mjs bridges it
// onto node:http with response streaming, and tests can call fetch directly.
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { validateTaskCreate } from "./task-schemas.mjs";

const SSE_RETRY_MS = 3000;
const SSE_POLL_MS = 300;
const SSE_HEARTBEAT_MS = 15000;
const MAX_BODY_BYTES = 1024 * 1024;

function afterSeqFrom(c) {
  const header = c.req.header("last-event-id");
  const query = c.req.query("afterSeq");
  const value = Number(header ?? query ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

// deps: everything stateful, injected so the app stays a pure route table.
// { daemonStatus(port), listRuns, listRunSummaries, normalizedTaskDetail,
//   readRun(id), listSequencedEvents(id),
//   startGeCommandTask, startProcessCommandTask, startHarnessRunTask,
//   startPipelineTask, startRepairTask, startDoctorTask,
//   submitInteractionResponse, resumeTask, port }
export function createDaemonApp(deps) {
  const app = new Hono();

  app.get("/health", (c) => c.json(deps.daemonStatus(deps.port)));
  app.get("/api/runtime/status", (c) => c.json(deps.daemonStatus(deps.port)));

  app.get("/api/tasks", (c) => {
    const full = c.req.query("full") === "true";
    const limit = c.req.query("limit") || 50;
    return c.json({ tasks: full ? deps.listRuns(limit).map(deps.normalizedTaskDetail) : deps.listRunSummaries(limit) });
  });

  app.post("/api/tasks", async (c) => {
    const raw = await c.req.text();
    if (raw.length > MAX_BODY_BYTES) return c.json({ error: "request body too large" }, 413);
    let body = {};
    if (raw.trim()) {
      try { body = JSON.parse(raw); } catch (error) {
        return c.json({ error: `invalid JSON body: ${error.message}` }, 400);
      }
    }
    // pipeline.run / repair.run ARE the wire kinds — no alias normalization.
    const kind = body.kind;
    const checked = validateTaskCreate(kind, body);
    if (!checked.ok) return c.json({ error: checked.error }, 400);
    const input = checked.value;
    try {
      if (kind === "ge.command") return c.json(deps.startGeCommandTask({ argv: input.argv, command: input.command || null }), 202);
      if (kind === "process.command") return c.json(deps.startProcessCommandTask({ argv: input.argv, command: input.command || null }), 202);
      if (kind === "harness.run") return c.json(deps.startHarnessRunTask(input.input || input), 202);
      if (kind === "pipeline.run") return c.json(await deps.startPipelineTask(input), 202);
      if (kind === "repair.run") return c.json(await deps.startRepairTask(input), 202);
    } catch (error) {
      const status = kind === "pipeline.run" || kind === "repair.run" ? 500 : 400;
      return c.json({ error: error.message || String(error) }, status);
    }
    return c.json({ error: `unsupported task kind: ${body.kind || "<unset>"}` }, 400);
  });

  app.post("/api/tasks/:id/interactions/:interactionId", async (c) => {
    try {
      const body = await c.req.json().catch(() => ({})); // best-effort: an empty/non-JSON interaction body means "no fields", same as the legacy readRequestJson contract
      const result = deps.submitInteractionResponse(c.req.param("id"), c.req.param("interactionId"), body);
      return c.json(result.body, result.status);
    } catch (error) {
      return c.json({ error: error.message || String(error) }, 400);
    }
  });

  app.post("/api/doctor", (c) => {
    const run = deps.startDoctorTask({ scope: c.req.query("scope") || "all", command: c.req.query("command") || "" });
    return c.json(run, 202);
  });

  app.get("/api/tasks/:id/events", (c) => {
    const id = c.req.param("id");
    if (c.req.query("format") === "json") {
      const afterSeq = afterSeqFrom(c);
      const events = deps.listSequencedEvents(id).filter((entry) => entry.seq > afterSeq);
      return c.json({ events, afterSeq });
    }
    let cursor = afterSeqFrom(c);
    return streamSSE(c, async (stream) => {
      let first = true;
      let lastWrite = Date.now();
      while (!stream.aborted) {
        for (const { seq, event } of deps.listSequencedEvents(id)) {
          if (seq <= cursor) continue;
          cursor = seq;
          await stream.writeSSE({ id: String(seq), data: JSON.stringify(event), retry: first ? SSE_RETRY_MS : undefined });
          first = false;
          lastWrite = Date.now();
        }
        const run = deps.readRun(id);
        if (!run || !["running", "queued"].includes(run.status)) return;
        if (Date.now() - lastWrite >= SSE_HEARTBEAT_MS) {
          await stream.write(`: ping\n\n`);
          lastWrite = Date.now();
        }
        await stream.sleep(SSE_POLL_MS);
      }
    });
  });

  app.post("/api/tasks/:id/resume", async (c) => {
    try {
      const result = await deps.resumeTask(c.req.param("id"));
      return c.json(result.body, result.status);
    } catch (error) {
      return c.json({ error: error.message || String(error) }, 500);
    }
  });

  app.get("/api/tasks/:id", (c) => {
    const run = deps.readRun(c.req.param("id"));
    return run ? c.json(deps.normalizedTaskDetail(run)) : c.json({ error: "unknown task" }, 404);
  });

  app.notFound((c) => c.json({ error: "not found" }, 404));
  app.onError((error, c) => c.json({ error: error.message || String(error) }, 500));

  return app;
}
