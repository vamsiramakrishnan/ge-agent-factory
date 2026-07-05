import { test, expect } from "bun:test";
import { runSpawnedJob, createLocalJobSubmit } from "./ge-job-runner.mjs";

function collect() {
  const events = [];
  const terminals = [];
  return {
    events,
    terminals,
    onEvent: (ev) => events.push(ev),
    onTerminal: (status, info) => terminals.push({ status, info }),
  };
}

function waitFor(predicate, { timeoutMs = 5000, stepMs = 10 } = {}) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (predicate()) { resolve(); return; }
      if (Date.now() > deadline) { reject(new Error("waitFor(): timed out")); return; }
      setTimeout(tick, stepMs);
    };
    tick();
  });
}

// ── runSpawnedJob ─────────────────────────────────────────────────────────

test("runSpawnedJob: terminalData toggles the daemon data:{code,signal} shape vs the console no-data shape", async () => {
  const daemonSide = collect();
  runSpawnedJob({
    id: "t-daemon-1",
    cmd: process.execPath,
    args: ["-e", "console.log('hi'); process.exit(0);"],
    announceLine: "$ ge doctor",
    stage: "job",
    terminalData: true,
    onEvent: daemonSide.onEvent,
    onTerminal: daemonSide.onTerminal,
  });
  await waitFor(() => daemonSide.terminals.length > 0);
  expect(daemonSide.events[0]).toEqual({ type: "stage_started", stage: "job", line: "$ ge doctor" });
  expect(daemonSide.events.at(-1)).toMatchObject({ type: "stage_done", stage: "job", level: "info", line: "exit 0", data: { code: 0, signal: null } });
  expect(daemonSide.terminals[0]).toMatchObject({ status: "done", info: { code: 0, signal: null, line: "exit 0" } });
  expect(daemonSide.terminals[0].info.result).toBeTruthy();

  const consoleSide = collect();
  runSpawnedJob({
    id: "t-console-1",
    cmd: process.execPath,
    args: ["-e", "console.log('hi'); process.exit(0);"],
    announceLine: "$ ge doctor",
    stage: "job",
    terminalData: false,
    stampAnnounceTs: true,
    onEvent: consoleSide.onEvent,
    onTerminal: consoleSide.onTerminal,
  });
  await waitFor(() => consoleSide.terminals.length > 0);
  const announce = consoleSide.events[0];
  expect(announce.type).toBe("stage_started");
  expect(announce.ts).toBeTruthy();
  const terminalEvent = consoleSide.events.at(-1);
  expect(terminalEvent).toEqual({ type: "stage_done", stage: "job", level: "info", line: "exit 0" });
  expect(terminalEvent.data).toBeUndefined();
});

test("runSpawnedJob: nonzero exit maps to stage_failed with the exit code", async () => {
  const c = collect();
  runSpawnedJob({
    id: "t-fail-1",
    cmd: process.execPath,
    args: ["-e", "console.error('boom'); process.exit(7);"],
    announceLine: "$ ge broken",
    stage: "job",
    terminalData: true,
    onEvent: c.onEvent,
    onTerminal: c.onTerminal,
  });
  await waitFor(() => c.terminals.length > 0);
  expect(c.events.at(-1)).toMatchObject({ type: "stage_failed", stage: "job", level: "error", line: "exit 7", data: { code: 7, signal: null } });
  expect(c.terminals[0].status).toBe("failed");
});

test("runSpawnedJob: resume mode suffixes the announce line and emits resume_done/resume_failed", async () => {
  const ok = collect();
  runSpawnedJob({
    id: "t-resume-ok",
    cmd: process.execPath,
    args: ["-e", "process.exit(0);"],
    announceLine: "$ ge doctor",
    stage: "job",
    terminalData: true,
    resume: true,
    resumeAction: "rerun_command",
    onEvent: ok.onEvent,
    onTerminal: ok.onTerminal,
  });
  await waitFor(() => ok.terminals.length > 0);
  expect(ok.events[0]).toMatchObject({ type: "stage_started", line: "$ ge doctor (resume)" });
  expect(ok.events.at(-1)).toMatchObject({ type: "resume_done", data: { code: 0, signal: null } });
  expect(ok.terminals[0]).toMatchObject({ status: "done", info: { resumeAction: "rerun_command" } });

  const fail = collect();
  runSpawnedJob({
    id: "t-resume-fail",
    cmd: process.execPath,
    args: ["-e", "process.exit(3);"],
    announceLine: "$ ge doctor",
    stage: "job",
    terminalData: true,
    resume: true,
    resumeAction: "rerun_command",
    onEvent: fail.onEvent,
    onTerminal: fail.onTerminal,
  });
  await waitFor(() => fail.terminals.length > 0);
  expect(fail.events.at(-1)).toMatchObject({ type: "resume_failed", data: { code: 3, signal: null } });
  expect(fail.terminals[0]).toMatchObject({ status: "failed", info: { resumeAction: "rerun_command" } });
});

test("runSpawnedJob: afterAnnounce fires synchronously between the announce and any spawn-derived event", async () => {
  const order = [];
  runSpawnedJob({
    id: "t-order",
    cmd: process.execPath,
    args: ["-e", "console.log('x'); process.exit(0);"],
    announceLine: "$ ge x",
    stage: "job",
    onEvent: (ev) => order.push(ev.type),
    onTerminal: () => order.push("terminal"),
    afterAnnounce: () => order.push("after-announce"),
  });
  await waitFor(() => order.includes("terminal"));
  expect(order[0]).toBe("stage_started");
  expect(order[1]).toBe("after-announce");
});

// ── createLocalJobSubmit ──────────────────────────────────────────────────

function fakeSinks() {
  const created = [];
  const local = new Map();
  const finished = [];
  return {
    created,
    local,
    finished,
    create: async (id, argv, command) => { created.push({ id, argv, command }); },
    registerLocal: (id, argv, command) => {
      const job = { id, argv, command, status: "running", events: [] };
      local.set(id, job);
      return job;
    },
    push: (job, ev) => { job.events.push(ev); },
    finish: (job, id, status, info) => { job.status = status; finished.push({ id, status, info }); },
  };
}

test("createLocalJobSubmit: daemon submit success never touches the local spawn path", async () => {
  const sinks = fakeSinks();
  const submit = createLocalJobSubmit({
    daemonSubmit: async () => ({ id: "daemon-job-1" }),
    mintId: () => { throw new Error("mintId must not be called on the daemon-success path"); },
    spawnBinding: {
      cmd: process.execPath,
      stage: "job",
      announceLine: (argv) => `$ ge ${argv.join(" ")}`,
      args: (argv) => ["-e", "process.exit(0);", ...argv],
    },
    sinks,
  });
  const result = await submit(["ledger", "--help"], null);
  expect(result).toEqual({ id: "daemon-job-1", daemon: true });
  expect(sinks.created).toEqual([{ id: "daemon-job-1", argv: ["ledger", "--help"], command: null }]);
  expect(sinks.local.size).toBe(0);
});

test("createLocalJobSubmit: connection failure falls back — fallback-warning event, local spawn, terminal finish", async () => {
  const sinks = fakeSinks();
  const submit = createLocalJobSubmit({
    daemonSubmit: async () => { throw new Error("connect ECONNREFUSED"); },
    mintId: () => "job-local-1",
    spawnBinding: {
      cmd: process.execPath,
      stage: "job",
      announceLine: (argv) => `$ ge ${argv.join(" ")}`,
      args: () => ["-e", "console.log('ok'); process.exit(0);"],
    },
    sinks,
  });
  const traceCalls = [];
  const result = await submit(["ledger", "--help"], { id: "factory.build" }, {
    extraLocalTrace: (push) => traceCalls.push(push),
  });

  expect(result.daemon).toBe(false);
  expect(result.id).toBe("job-local-1");
  expect(sinks.created).toEqual([{ id: "job-local-1", argv: ["ledger", "--help"], command: { id: "factory.build" } }]);

  const job = sinks.local.get("job-local-1");
  expect(job).toBeTruthy();
  expect(job.events[0]).toMatchObject({ type: "stage_started", stage: "job", line: "$ ge ledger --help" });
  expect(job.events[0].ts).toBeTruthy();
  expect(job.events[1]).toMatchObject({ type: "log", level: "warn", data: { fellBackToLocal: true } });
  expect(job.events[1].line.startsWith("Daemon unavailable; running this job locally instead — ")).toBe(true);
  expect(traceCalls.length).toBe(1);

  await waitFor(() => sinks.finished.length > 0);
  expect(sinks.finished[0]).toMatchObject({ id: "job-local-1", status: "done" });
});

test("createLocalJobSubmit: nonzero local exit finishes with status failed", async () => {
  const sinks = fakeSinks();
  const submit = createLocalJobSubmit({
    daemonSubmit: async () => { throw new Error("connect ECONNREFUSED"); },
    mintId: () => "job-local-2",
    spawnBinding: {
      cmd: process.execPath,
      stage: "job",
      announceLine: (argv) => `$ ge ${argv.join(" ")}`,
      args: () => ["-e", "process.exit(5);"],
    },
    sinks,
  });
  await submit(["ledger", "--help"], null);
  await waitFor(() => sinks.finished.length > 0);
  expect(sinks.finished[0]).toMatchObject({ id: "job-local-2", status: "failed", info: { code: 5 } });
});
