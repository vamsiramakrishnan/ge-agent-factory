// Parity oracle for the ADK routes converted out of server.js's legacy
// if-ladder (WS4 Step 1/3). The expected response shapes below are derived
// from the LEGACY branch behavior (server.js ~1264-1290 as of 2026-07-05):
//   POST previews/adk-web → { preview: serializePreview(await waitForRunning(await start(id))) }
//   GET  previews/adk-web → { preview: serializePreview(await refresh(previews.get(id))) }
//   DELETE previews/adk-web → terminateChild(previews.get(id)?.child, "SIGTERM"); { ok: true }
//   POST adk-run → 422 { ...result } when result.blocked, else 200 { result }
// Injected stubs stand in for the server.js module-scope closures so the route
// wiring is exercised in isolation (the same closures the legacy branch called).
import { describe, expect, it } from "bun:test";
import { createAdkRoutes } from "./adk.mjs";

function makeApp(overrides = {}) {
  const calls = { start: [], wait: [], refresh: [], terminate: [], run: [] };
  const previews = overrides.previews ?? new Map();
  const app = createAdkRoutes({
    previews,
    startAdkPreview: async (id) => {
      calls.start.push(id);
      return { projectId: id, status: "starting", child: { pid: 42 } };
    },
    waitForPreviewRunning: async (preview) => {
      calls.wait.push(preview);
      return { ...preview, status: "running" };
    },
    serializePreview: (preview) => {
      if (!preview) return null;
      const { child, ...rest } = preview;
      return rest;
    },
    refreshPreviewStatus: async (preview) => {
      calls.refresh.push(preview);
      return preview ? { ...preview, status: "running" } : null;
    },
    runAdkAgent: overrides.runAdkAgent ?? (async (id, prompt) => {
      calls.run.push({ id, prompt });
      return { ok: true, response: `ran ${id}: ${prompt}` };
    }),
    terminateChild: (child, signal) => calls.terminate.push({ child, signal }),
    ...overrides.ctx,
  });
  return { app, calls, previews };
}

const req = (method, path, body) =>
  new Request(`http://localhost${path}`, {
    method,
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  });

describe("createAdkRoutes — parity with the legacy if-ladder branches", () => {
  it("POST previews/adk-web starts + waits, returns serialized (child-stripped) preview", async () => {
    const { app, calls } = makeApp();
    const res = await app.fetch(req("POST", "/api/workspaces/gl-anomaly-detector/previews/adk-web"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ preview: { projectId: "gl-anomaly-detector", status: "running" } });
    expect(json.preview.child).toBeUndefined();
    expect(calls.start).toEqual(["gl-anomaly-detector"]);
    expect(calls.wait.length).toBe(1);
  });

  it("GET previews/adk-web refreshes the stored preview and serializes it", async () => {
    const previews = new Map([["ws1", { projectId: "ws1", status: "starting", child: { pid: 7 } }]]);
    const { app, calls } = makeApp({ previews });
    const res = await app.fetch(req("GET", "/api/workspaces/ws1/previews/adk-web"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ preview: { projectId: "ws1", status: "running" } });
    expect(calls.refresh.length).toBe(1);
  });

  it("GET previews/adk-web returns { preview: null } when nothing is stored", async () => {
    const { app } = makeApp();
    const res = await app.fetch(req("GET", "/api/workspaces/missing/previews/adk-web"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ preview: null });
  });

  it("DELETE previews/adk-web terminates the child (SIGTERM) and returns { ok: true }", async () => {
    const child = { pid: 99 };
    const previews = new Map([["ws2", { projectId: "ws2", child }]]);
    const { app, calls } = makeApp({ previews });
    const res = await app.fetch(req("DELETE", "/api/workspaces/ws2/previews/adk-web"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls.terminate).toEqual([{ child, signal: "SIGTERM" }]);
  });

  it("DELETE previews/adk-web still returns { ok: true } and calls terminate when nothing is stored", async () => {
    const { app, calls } = makeApp();
    const res = await app.fetch(req("DELETE", "/api/workspaces/none/previews/adk-web"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls.terminate).toEqual([{ child: undefined, signal: "SIGTERM" }]);
  });

  it("POST adk-run returns 200 { result } for an unblocked run, defaulting prompt to 'hello'", async () => {
    const { app, calls } = makeApp();
    const res = await app.fetch(req("POST", "/api/workspaces/ws3/adk-run", {}));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ result: { ok: true, response: "ran ws3: hello" } });
    expect(calls.run).toEqual([{ id: "ws3", prompt: "hello" }]);
  });

  it("POST adk-run forwards prompt (or message) and returns 422 with the raw result when blocked", async () => {
    const { app } = makeApp({
      runAdkAgent: async (id, prompt) => ({ ok: false, blocked: true, doctor: { ok: false }, id, prompt }),
    });
    const res = await app.fetch(req("POST", "/api/workspaces/ws4/adk-run", { prompt: "check this" }));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, blocked: true, doctor: { ok: false }, id: "ws4", prompt: "check this" });
  });

  it("POST adk-run with an empty body defaults to prompt 'hello' (readBody {}-on-empty parity)", async () => {
    const { app, calls } = makeApp();
    const res = await app.fetch(req("POST", "/api/workspaces/ws5/adk-run"));
    expect(res.status).toBe(200);
    expect(calls.run).toEqual([{ id: "ws5", prompt: "hello" }]);
  });

  it("POST adk-run with malformed JSON returns 500 { error } (legacy outer-catch parity)", async () => {
    const { app } = makeApp();
    const res = await app.fetch(req("POST", "/api/workspaces/ws6/adk-run", "{not json"));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "invalid JSON body" });
  });

  it("a thrown startAdkPreview error surfaces as 500 { error } (onError parity)", async () => {
    const { app } = makeApp({
      ctx: { startAdkPreview: async () => { throw new Error("workspace not found"); } },
    });
    const res = await app.fetch(req("POST", "/api/workspaces/ghost/previews/adk-web"));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "workspace not found" });
  });
});
