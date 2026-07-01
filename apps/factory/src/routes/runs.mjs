// Run status/listing/cancel routes. GET /api/runs/:id/events (SSE) is
// deliberately NOT here — it hands the raw res to runs.stream() for a
// long-lived, heartbeat-driven connection and stays on the legacy
// raw-http handler in server.js. See the "remaining work" notes there.
import { Hono } from "hono";

/**
 * @param {{ runs: ReturnType<typeof import("../run-service.js").createRunService>, terminateChild: Function }} ctx
 */
export function createRunRoutes({ runs, terminateChild }) {
  const app = new Hono();
  app.onError((error, c) => c.json({ error: error instanceof Error ? error.message : String(error) }, 500));

  app.get("/api/runs", (c) => {
    const filters = {
      projectId: c.req.query("projectId") || "",
      agentId: c.req.query("agentId") || "",
      status: c.req.query("status") || "",
    };
    return c.json({ runs: runs.list(filters).map((run) => runs.statusBody(run)) });
  });

  app.get("/api/runs/:id", (c) => {
    const run = runs.get(c.req.param("id"));
    if (!run) return c.json({ error: "run not found" }, 404);
    return c.json({ run: runs.statusBody(run) });
  });

  app.get("/api/runs/:id/wait", async (c) => {
    const run = runs.get(c.req.param("id"));
    if (!run) return c.json({ error: "run not found" }, 404);
    return c.json({ run: await runs.wait(run) });
  });

  app.post("/api/runs/:id/cancel", (c) => {
    const run = runs.get(c.req.param("id"));
    if (!run) return c.json({ error: "run not found" }, 404);
    runs.cancel(run, terminateChild);
    return c.json({ ok: true });
  });

  return app;
}
