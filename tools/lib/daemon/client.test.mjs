import { afterEach, describe, expect, test } from "bun:test";
import { createDaemonApp } from "./http-app.mjs";
import { createDaemonClient, DaemonConnectionError, DaemonHttpError } from "./client.mjs";

// Exercises the client against a REAL createDaemonApp instance (dependency-
// injected fakes, same shape as http-app.test.mjs's makeApp) served over a
// real ephemeral-port HTTP server (Bun.serve, same pattern as
// transport-oracle.test.mjs's startFakeDaemon) — so the SSE framing, header
// handling, and connection-refused classification are exercised through the
// real wire, not a mocked fetch.

const servers = [];
afterEach(() => {
  while (servers.length) servers.pop().stop(true);
});

// A minimal but real run/event store, injected as deps — mutable so a test
// can move a run through running -> done and append events as it goes,
// mirroring what run-store.mjs's appendEvent/updateRun would do.
function startFakeDaemon({ run = { id: "t-1", kind: "ge.command", status: "running" }, events = [] } = {}) {
  let currentRun = { ...run };
  const eventLog = events.map((event, i) => ({ seq: i + 1, event }));
  const calls = [];
  const app = createDaemonApp({
    port: 0,
    daemonStatus: (port) => ({ ok: true, protocolVersion: 3, port, runs: [currentRun] }),
    listRuns: () => [currentRun],
    listRunSummaries: () => [currentRun],
    normalizedTaskDetail: (r) => r,
    readRun: (id) => (id === currentRun.id ? currentRun : null),
    listSequencedEvents: (id) => (id === currentRun.id ? eventLog : []),
    startGeCommandTask: (input) => {
      calls.push(["ge.command", input]);
      currentRun = { id: currentRun.id, kind: "ge.command", status: "running", input };
      return currentRun;
    },
    startProcessCommandTask: (input) => { calls.push(["process.command", input]); return { id: "p-1" }; },
    startHarnessRunTask: (input) => { calls.push(["harness.run", input]); return { id: "h-1" }; },
    startPipelineTask: async (input) => { calls.push(["pipeline.run", input]); return { id: "m-1" }; },
    startRepairTask: async (input) => { calls.push(["repair.run", input]); return { id: "a-1" }; },
    startDoctorTask: (input) => ({ id: "d-1", ...input }),
    submitInteractionResponse: () => ({ status: 200, body: { ok: true } }),
    resumeTask: async (id) => {
      currentRun = { ...currentRun, status: "done" };
      return { status: 202, body: { id, resumed: true } };
    },
  });
  const server = Bun.serve({ port: 0, fetch: (req) => app.fetch(req) });
  servers.push(server);
  return {
    server,
    calls,
    client: createDaemonClient({ baseUrl: `http://127.0.0.1:${server.port}` }),
    appendEvent: (event) => { eventLog.push({ seq: eventLog.length + 1, event }); },
    finish: (status = "done") => { currentRun = { ...currentRun, status }; },
    get run() { return currentRun; },
  };
}

describe("createDaemonClient — happy paths", () => {
  test("status() reads /api/runtime/status", async () => {
    const { client } = startFakeDaemon();
    const body = await client.status();
    expect(body.ok).toBe(true);
    expect(body.protocolVersion).toBe(3);
  });

  test("submitTask() posts to /api/tasks and returns the run record", async () => {
    const { client, calls } = startFakeDaemon({ run: { id: "job-9", kind: "ge.command", status: "running" } });
    const run = await client.submitTask({ kind: "ge.command", argv: ["doctor"] });
    expect(run).toMatchObject({ id: "job-9", kind: "ge.command", status: "running" });
    expect(calls).toEqual([["ge.command", { argv: ["doctor"], command: null }]]);
  });

  test("listRuns() reads /api/tasks and unwraps the tasks array", async () => {
    const { client } = startFakeDaemon({ run: { id: "t-1", kind: "ge.command", status: "running" } });
    const runs = await client.listRuns();
    expect(runs).toEqual([{ id: "t-1", kind: "ge.command", status: "running" }]);
  });

  test("taskDetail() reads a known task, 404s on an unknown one as a DaemonHttpError", async () => {
    const { client } = startFakeDaemon({ run: { id: "t-1", kind: "ge.command", status: "done" } });
    expect(await client.taskDetail("t-1")).toEqual({ id: "t-1", kind: "ge.command", status: "done" });
    await expect(client.taskDetail("ghost")).rejects.toThrow(DaemonHttpError);
    try {
      await client.taskDetail("ghost");
      throw new Error("expected taskDetail to reject");
    } catch (error) {
      expect(error).toBeInstanceOf(DaemonHttpError);
      expect(error.status).toBe(404);
    }
  });

  test("events() one-shot json honors afterSeq server-side", async () => {
    const { client } = startFakeDaemon({
      run: { id: "t-1", kind: "ge.command", status: "done" },
      events: [{ type: "log", line: "e1" }, { type: "log", line: "e2" }, { type: "stage_done", line: "exit 0" }],
    });
    const all = await client.events("t-1");
    expect(all.events.map((e) => e.seq)).toEqual([1, 2, 3]);
    expect(all.afterSeq).toBe(0);

    const partial = await client.events("t-1", { afterSeq: 1 });
    expect(partial.events.map((e) => e.seq)).toEqual([2, 3]);
    expect(partial.events.map((e) => e.event.line)).toEqual(["e2", "exit 0"]);
  });

  test("resume() posts /api/tasks/:id/resume and returns the resume payload", async () => {
    const { client } = startFakeDaemon({ run: { id: "t-1", kind: "ge.command", status: "failed" } });
    const body = await client.resume("t-1");
    expect(body).toEqual({ id: "t-1", resumed: true });
  });
});

describe("createDaemonClient — followEvents (SSE)", () => {
  test("replays every event and honors Last-Event-ID resume like the server contract", async () => {
    const { client } = startFakeDaemon({
      run: { id: "t-1", kind: "ge.command", status: "done" }, // terminal: SSE loop closes after one replay pass
      events: [{ type: "log", line: "e1" }, { type: "log", line: "e2" }, { type: "stage_done", line: "exit 0" }],
    });

    const fresh = [];
    const freshResult = await client.followEvents("t-1", { onEvent: (event, meta) => fresh.push({ event, meta }) });
    expect(fresh.map(({ event }) => event.line)).toEqual(["e1", "e2", "exit 0"]);
    expect(fresh.map(({ meta }) => meta.seq)).toEqual([1, 2, 3]);
    expect(freshResult.lastEventId).toBe(3);

    // Resuming from afterSeq: 2 (i.e. "I've already seen seq 1 and 2") sends
    // Last-Event-ID: 2, and the server (afterSeqFrom) replays only seq > 2.
    const resumed = [];
    const resumedResult = await client.followEvents("t-1", { afterSeq: 2, onEvent: (event) => resumed.push(event) });
    expect(resumed.map((event) => event.line)).toEqual(["exit 0"]);
    expect(resumedResult.lastEventId).toBe(3);
  });

  test("a still-running task never terminates the stream on its own (bounded by an AbortSignal)", async () => {
    const { client, finish } = startFakeDaemon({
      run: { id: "t-1", kind: "ge.command", status: "running" },
      events: [{ type: "log", line: "e1" }],
    });
    const controller = new AbortController();
    const seen = [];
    const followPromise = client.followEvents("t-1", { signal: controller.signal, onEvent: (event) => seen.push(event) });
    // Give the poll loop a couple of ticks to deliver the one buffered event,
    // then abort — a running task's stream only ends when the caller says so.
    await new Promise((resolve) => setTimeout(resolve, 50));
    controller.abort();
    await expect(followPromise).rejects.toThrow();
    expect(seen.map((event) => event.line)).toEqual(["e1"]);
    finish("done"); // avoid leaking an unresolved server-side poll expectation
  });
});

describe("createDaemonClient — error classification", () => {
  // Port 1 is never listening in this sandbox — connecting to it fails at the
  // socket layer (ECONNREFUSED), before any HTTP response exists.
  const CLOSED_PORT = 1;

  test("connection failure (nothing listening) throws DaemonConnectionError, not DaemonHttpError", async () => {
    const client = createDaemonClient({ port: CLOSED_PORT, timeoutMs: 2000 });
    await expect(client.status()).rejects.toThrow(DaemonConnectionError);
    try {
      await client.submitTask({ kind: "ge.command", argv: ["doctor"] });
      throw new Error("expected submitTask to reject");
    } catch (error) {
      expect(error).toBeInstanceOf(DaemonConnectionError);
      expect(error).not.toBeInstanceOf(DaemonHttpError);
      expect(error.message).toContain("daemon unreachable");
    }
  });

  test("followEvents() against a closed port also classifies as DaemonConnectionError", async () => {
    const client = createDaemonClient({ port: CLOSED_PORT });
    await expect(client.followEvents("t-1", { onEvent: () => {} })).rejects.toThrow(DaemonConnectionError);
  });

  test("a non-2xx HTTP response (server reachable, request rejected) throws DaemonHttpError, not DaemonConnectionError", async () => {
    const { client } = startFakeDaemon();
    try {
      await client.submitTask({ kind: "nope.run" });
      throw new Error("expected submitTask to reject");
    } catch (error) {
      expect(error).toBeInstanceOf(DaemonHttpError);
      expect(error).not.toBeInstanceOf(DaemonConnectionError);
      expect(error.status).toBe(400);
      expect(error.message).toContain("daemon task start failed");
      expect(error.message).toContain("unsupported task kind");
    }
  });

  test("both error types are still plain Errors — an untyped catch keeps working", async () => {
    expect(new DaemonConnectionError("x")).toBeInstanceOf(Error);
    expect(new DaemonHttpError("x", { status: 500 })).toBeInstanceOf(Error);
  });
});
