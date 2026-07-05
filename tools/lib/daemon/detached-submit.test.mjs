import { afterEach, describe, expect, test } from "bun:test";
import { createDaemonApp } from "./http-app.mjs";
import { createDaemonClient } from "./client.mjs";
import { submitDetached } from "./detached-submit.mjs";
import { isDxError, dxErrorShape } from "../errors/dx-error.mjs";

// Same fake-daemon shape as client.test.mjs's startFakeDaemon: createDaemonApp
// with injected fakes, served over a real Bun.serve HTTP server so the wire
// (connection-refused vs. HTTP response) is exercised for real, not mocked.

const servers = [];
afterEach(() => {
  while (servers.length) servers.pop().stop(true);
});

function startFakeDaemon({ port = 0, run = { id: "job-1", kind: "ge.command", status: "running" } } = {}) {
  let currentRun = { ...run };
  const calls = [];
  const app = createDaemonApp({
    port,
    daemonStatus: (p) => ({ ok: true, protocolVersion: 3, port: p, runs: [currentRun] }),
    listRuns: () => [currentRun],
    listRunSummaries: () => [currentRun],
    normalizedTaskDetail: (r) => r,
    readRun: (id) => (id === currentRun.id ? currentRun : null),
    listSequencedEvents: () => [],
    startGeCommandTask: (input) => {
      calls.push(["ge.command", input]);
      currentRun = { id: currentRun.id, kind: "ge.command", status: "running", input };
      return currentRun;
    },
    startProcessCommandTask: () => ({ id: "p-1" }),
    startHarnessRunTask: () => ({ id: "h-1" }),
    startPipelineTask: async () => ({ id: "m-1" }),
    startRepairTask: async () => ({ id: "a-1" }),
    startDoctorTask: (input) => ({ id: "d-1", ...input }),
    submitInteractionResponse: () => ({ status: 200, body: { ok: true } }),
    resumeTask: async (id) => ({ status: 202, body: { id, resumed: true } }),
  });
  const server = Bun.serve({ port, fetch: (req) => app.fetch(req) });
  servers.push(server);
  return {
    server,
    calls,
    client: createDaemonClient({ baseUrl: `http://127.0.0.1:${server.port}`, timeoutMs: 2000 }),
    get run() { return currentRun; },
  };
}

// Grab a port nothing is listening on by binding to an ephemeral port and
// releasing it immediately — used to simulate "the daemon isn't up yet" at a
// KNOWN port that a later call can bring a real fake daemon up on, so the
// retry lands on the exact same origin the first (failing) attempt used.
function reserveClosedPort() {
  const probe = Bun.serve({ port: 0, fetch: () => new Response("ok") });
  const port = probe.port;
  probe.stop(true);
  return port;
}

const BUILD_ARGV = ["agents", "build", "--local", "--canary"];

describe("submitDetached — happy path", () => {
  test("submits a ge.command task and returns the daemon's run id + hints", async () => {
    const { client, calls } = startFakeDaemon({ run: { id: "job-42", kind: "ge.command", status: "running" } });
    const result = await submitDetached({ argv: BUILD_ARGV, client });
    expect(result).toEqual({
      runId: "job-42",
      statusHint: "ge runs show job-42",
      followHint: "ge runs events job-42 --follow",
    });
    expect(calls).toEqual([["ge.command", { argv: BUILD_ARGV, command: null }]]);
  });

  test("the submitted argv never contains --detach", async () => {
    const { client, calls } = startFakeDaemon();
    await submitDetached({ argv: BUILD_ARGV, client });
    expect(calls[0][1].argv).not.toContain("--detach");
    expect(calls[0][1].argv).toEqual(BUILD_ARGV);
  });

  test("rejects up front if argv still contains --detach (recursion guard)", async () => {
    const { client, calls } = startFakeDaemon();
    await expect(submitDetached({ argv: [...BUILD_ARGV, "--detach"], client })).rejects.toThrow(/--detach/);
    expect(calls).toEqual([]); // never reaches the daemon at all
  });

  test("passes command metadata through to the daemon's ge.command task", async () => {
    const { client, calls } = startFakeDaemon();
    const result = await submitDetached({ argv: BUILD_ARGV, client, command: "agents.build.local" });
    expect(result.runId).toBe("job-1");
    expect(calls).toEqual([["ge.command", { argv: BUILD_ARGV, command: "agents.build.local" }]]);
  });
});

describe("submitDetached — daemon down", () => {
  test("daemon initially down + ensureDaemon brings it up → succeeds after one retry", async () => {
    const port = reserveClosedPort();
    const client = createDaemonClient({ baseUrl: `http://127.0.0.1:${port}`, timeoutMs: 2000 });
    const ensureCalls = [];
    let fake = null;
    const ensureDaemon = async () => {
      ensureCalls.push(1);
      fake = startFakeDaemon({ port, run: { id: "job-99", kind: "ge.command", status: "running" } });
      return { ok: true, started: true };
    };

    const result = await submitDetached({ argv: BUILD_ARGV, client, ensureDaemon });
    expect(result.runId).toBe("job-99");
    expect(ensureCalls.length).toBe(1); // exactly one ensure/retry, not a loop
    expect(fake.calls).toEqual([["ge.command", { argv: BUILD_ARGV, command: null }]]);
  });

  test("daemon down + ensureDaemon no-op → DxError naming `ge daemon start`", async () => {
    const client = createDaemonClient({ port: 1, timeoutMs: 500 }); // nothing listens on port 1 in this sandbox
    const ensureCalls = [];
    const ensureDaemon = async () => { ensureCalls.push(1); }; // daemon stays down

    let caught = null;
    try {
      await submitDetached({ argv: BUILD_ARGV, client, ensureDaemon });
      throw new Error("expected submitDetached to reject");
    } catch (error) {
      caught = error;
    }
    expect(isDxError(caught)).toBe(true);
    const shape = dxErrorShape(caught);
    expect(shape.fix).toBe("ge daemon start");
    expect(ensureCalls.length).toBe(1); // ensureDaemon is tried exactly once, then it's a hard failure
  });

  test("a daemon-side HTTP rejection (not a connection failure) propagates as-is — no retry, no DxError reframing", async () => {
    const { client } = startFakeDaemon();
    // command: 123 fails task-schemas.mjs's commandTask zod shape (expects a
    // nullish string) — a real HTTP 400 from a reachable daemon, distinct from
    // "the daemon is down", which is the only case submitDetached retries.
    await expect(submitDetached({ argv: BUILD_ARGV, client, command: 123 })).rejects.toThrow(/invalid ge\.command task/);
  });
});
