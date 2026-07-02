import { describe, expect, test } from "bun:test";
import { createDaemonApp } from "./http-app.mjs";
import { validateTaskCreate } from "./task-schemas.mjs";

// The daemon's HTTP contract, tested hermetically: createDaemonApp is a pure
// route table over injected deps, so app.fetch() exercises routing, zod
// validation, kind normalization, and SSE framing without a port or a store.

const WIRE_ALIASES = { "pipeline.run": "mission.run", "repair.run": "autopilot.run" };

function makeApp({ events = [], run = { id: "t-1", status: "done" } } = {}) {
  const calls = [];
  const app = createDaemonApp({
    port: 0,
    daemonStatus: () => ({ ok: true }),
    listRuns: () => [run],
    listRunSummaries: () => [run],
    normalizedTaskDetail: (r) => r,
    readRun: (id) => (id === run.id ? run : null),
    listSequencedEvents: () => events,
    wireTaskKind: (kind) => WIRE_ALIASES[kind] || kind,
    startGeCommandTask: (input) => { calls.push(["ge.command", input]); return { id: "job-1", kind: "ge.command" }; },
    startProcessCommandTask: (input) => { calls.push(["process.command", input]); return { id: "p-1" }; },
    startHarnessRunTask: (input) => { calls.push(["harness.run", input]); return { id: "h-1" }; },
    startMissionTask: async (input) => { calls.push(["mission.run", input]); return { id: "m-1", kind: "mission.run" }; },
    startAutopilotTask: async (input) => { calls.push(["autopilot.run", input]); return { id: "a-1", kind: "autopilot.run" }; },
    startDoctorTask: (input) => ({ id: "d-1", ...input }),
    submitInteractionResponse: () => ({ status: 200, body: { ok: true } }),
    resumeTask: async (id) => ({ status: 202, body: { id, resumed: true } }),
  });
  return { app, calls };
}

const post = (app, path, body) => app.fetch(new Request(`http://d${path}`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
}));

describe("daemon http app", () => {
  test("health and status routes respond", async () => {
    const { app } = makeApp();
    expect((await app.fetch(new Request("http://d/health"))).status).toBe(200);
    expect((await app.fetch(new Request("http://d/api/runtime/status"))).status).toBe(200);
  });

  test("invalid task body fails with a field-level 400 before any run starts", async () => {
    const { app, calls } = makeApp();
    const res = await post(app, "/api/tasks", { kind: "ge.command" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("argv");
    expect(calls).toHaveLength(0);
  });

  test("unsupported kind is a 400, not a crash", async () => {
    const { app } = makeApp();
    const res = await post(app, "/api/tasks", { kind: "nope.run" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("unsupported task kind");
  });

  test("canonical kinds normalize to wire kinds (pipeline.run → mission.run, repair.run → autopilot.run)", async () => {
    const { app, calls } = makeApp();
    expect((await post(app, "/api/tasks", { kind: "pipeline.run", scenario: "s" })).status).toBe(202);
    expect((await post(app, "/api/tasks", { kind: "repair.run", ids: ["a"] })).status).toBe(202);
    expect(calls.map(([kind]) => kind)).toEqual(["mission.run", "autopilot.run"]);
  });

  test("legacy kinds keep working verbatim", async () => {
    const { app, calls } = makeApp();
    expect((await post(app, "/api/tasks", { kind: "mission.run", scenario: "s" })).status).toBe(202);
    expect(calls[0][0]).toBe("mission.run");
  });

  test("unknown task id is a 404", async () => {
    const { app } = makeApp();
    expect((await app.fetch(new Request("http://d/api/tasks/ghost"))).status).toBe(404);
    expect((await app.fetch(new Request("http://d/api/nope"))).status).toBe(404);
  });

  test("json events honor afterSeq server-side", async () => {
    const events = [1, 2, 3, 4].map((seq) => ({ seq, event: { type: "log", line: `e${seq}` } }));
    const { app } = makeApp({ events });
    const res = await app.fetch(new Request("http://d/api/tasks/t-1/events?format=json&afterSeq=2"));
    const body = await res.json();
    expect(body.events.map((e) => e.seq)).toEqual([3, 4]);
  });

  test("SSE frames carry id: (seq), a retry: hint, and honor Last-Event-ID", async () => {
    const events = [1, 2, 3].map((seq) => ({ seq, event: { type: "log", line: `e${seq}` } }));
    const { app } = makeApp({ events, run: { id: "t-1", status: "done" } }); // terminal → stream closes after replay
    const full = await (await app.fetch(new Request("http://d/api/tasks/t-1/events"))).text();
    expect(full).toContain("retry: 3000");
    expect([...full.matchAll(/^id: (\d+)$/gm)].map((m) => Number(m[1]))).toEqual([1, 2, 3]);

    const resumed = await (await app.fetch(new Request("http://d/api/tasks/t-1/events", { headers: { "Last-Event-ID": "2" } }))).text();
    expect([...resumed.matchAll(/^id: (\d+)$/gm)].map((m) => Number(m[1]))).toEqual([3]);
  });

  test("resume route delegates and returns the resume payload", async () => {
    const { app } = makeApp();
    const res = await post(app, "/api/tasks/t-1/resume", {});
    expect(res.status).toBe(202);
    expect((await res.json()).resumed).toBe(true);
  });
});

describe("task schemas", () => {
  test("argv must be non-empty strings", () => {
    expect(validateTaskCreate("ge.command", { argv: [] }).ok).toBe(false);
    expect(validateTaskCreate("ge.command", { argv: ["doctor"] }).ok).toBe(true);
  });
  test("extra fields pass through (newer client, older daemon)", () => {
    const checked = validateTaskCreate("autopilot.run", { ids: ["a"], futureField: 1 });
    expect(checked.ok).toBe(true);
    expect(checked.value.futureField).toBe(1);
  });
  test("wrong types produce readable field errors", () => {
    const checked = validateTaskCreate("mission.run", { attempts: "three" });
    expect(checked.ok).toBe(false);
    expect(checked.error).toContain("attempts");
  });
});
