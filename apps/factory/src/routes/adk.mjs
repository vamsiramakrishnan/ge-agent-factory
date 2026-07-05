// ADK preview lifecycle + one-shot run routes, converted out of server.js's
// legacy raw-http if-ladder onto Hono. These return plain JSON (no streaming),
// so they route cleanly through the Hono apiApp like catalog/runs/workspaces.
//
// Deliberately NOT here (still on the legacy raw-http handler in server.js):
//   - /api/workspaces/:id/adk-proxy/*  — proxies an upstream ADK-web server and
//     streams its response body (incl. SSE from /run_sse) straight to the raw
//     Node res; the Hono→raw bridge in server.js buffers a converted response in
//     full (await honoResp.arrayBuffer()) before writing, so a live stream would
//     never flush. Concrete blocker: the bridge, not Hono itself.
// The helper closures are injected (mirroring createRunRoutes' { runs } wiring)
// rather than re-plumbing their ~15 server.js module-scope dependencies.
import { Hono } from "hono";

/**
 * @param {{
 *   previews: Map<string, any>,
 *   startAdkPreview: (id: string) => Promise<any>,
 *   waitForPreviewRunning: (preview: any) => Promise<any>,
 *   serializePreview: (preview: any) => any,
 *   refreshPreviewStatus: (preview: any) => Promise<any>,
 *   runAdkAgent: (id: string, prompt: string) => Promise<any>,
 *   terminateChild: (child: any, signal?: string) => void,
 * }} ctx
 */
export function createAdkRoutes({
  previews,
  startAdkPreview,
  waitForPreviewRunning,
  serializePreview,
  refreshPreviewStatus,
  runAdkAgent,
  terminateChild,
}) {
  const app = new Hono();
  // Match the legacy outer catch: any thrown error becomes a 500 { error }.
  app.onError((error, c) => c.json({ error: error instanceof Error ? error.message : String(error) }, 500));

  // Workspace ids are generator slugs ([a-z0-9-]), so Hono's already-decoded
  // param equals the legacy raw capture / decodeURIComponent(capture).
  app.post("/api/workspaces/:id/previews/adk-web", async (c) => {
    const preview = await waitForPreviewRunning(await startAdkPreview(c.req.param("id")));
    return c.json({ preview: serializePreview(preview) });
  });

  app.get("/api/workspaces/:id/previews/adk-web", async (c) => {
    const preview = await refreshPreviewStatus(previews.get(c.req.param("id")));
    return c.json({ preview: serializePreview(preview) });
  });

  app.delete("/api/workspaces/:id/previews/adk-web", (c) => {
    const preview = previews.get(c.req.param("id"));
    terminateChild(preview?.child, "SIGTERM");
    return c.json({ ok: true });
  });

  app.post("/api/workspaces/:id/adk-run", async (c) => {
    // Replicate readBody(): empty body → {}, malformed JSON → throw → 500 (via
    // onError above), matching the legacy handler's error surface exactly.
    const raw = await c.req.text();
    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error("invalid JSON body");
    }
    const result = await runAdkAgent(c.req.param("id"), body.prompt || body.message || "hello");
    if (result.blocked) return c.json(result, 422);
    return c.json({ result });
  });

  return app;
}
