// Behavior parity oracle for the transport.mjs decomposition (REFACTOR-HANDOFF §9
// methodology: capture the exact observable event/frame sequences BEFORE moving
// code, then hold every extraction to them).
//
// Everything here is offline-deterministic:
//   - daemon-backed paths (job streaming, repair, doctor proxy) run against an
//     in-test fake daemon (Bun.serve) whose SSE/JSON payloads we control, so the
//     emitted line sequence is asserted byte-for-byte;
//   - the local job fallback and doctor subprocess paths spawn the real `ge` CLI
//     (cheap commands) and mask only genuinely non-deterministic fields
//     (timestamps, generated ids, environment-dependent check results) by
//     substituting observed values — the sequence/shape is pinned;
//   - the local ledger path seeds the very ledger instance streamLedger reads
//     (via the exported `core`), with fixed timestamps.
//
// NOT covered (see transport.mjs decomposition notes): the Firestore ledger
// reader beyond the injected-fake test in transport.test.mjs (runtime needs GCP),
// and startRepairRun's local pipeline-plan branch (core.pipelineGraphPlan requires
// the generated use-case catalog this environment doesn't materialize — same
// root cause as the catalog entries in tools/known-test-failures.json).

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "bun:test";
import { canBindLoopback } from "@ge/std/test-network";
import { STATE_PATHS } from "../../../../tools/lib/state-paths.mjs";

const loopbackTest = await canBindLoopback() ? test : test.skip;

// Isolated job store when this file is the first to load job-store.mjs (module
// cache is shared across test files in one bun process, so a prior loader wins;
// unique ids + observed-seq substitution keep assertions order-independent).
const storeDir = join("/tmp", `ge-console-transport-oracle-${process.pid}`);
rmSync(storeDir, { recursive: true, force: true });
mkdirSync(storeDir, { recursive: true });
process.env.GE_CONSOLE_JOB_STORE ||= storeDir;

const {
  core,
  startGeJob,
  getJob,
  streamJob,
  streamLedger,
  streamLogs,
  streamDoctor,
  startRepairRun,
  getRepair,
  getRepairEvents,
  listRepairs,
} = await import("./transport.mjs");
const { listJobEvents } = await import("./job-store.mjs");

const ISO_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function frameCollector() {
  const frames = [];
  const writeSSE = (line) => frames.push({ data: line });
  writeSSE.frame = (frame) => frames.push({ ...frame });
  return { frames, writeSSE };
}

function lineCollector() {
  const lines = [];
  return { lines, writeSSE: (line) => lines.push(line) };
}

async function until(predicate, { timeoutMs = 15000, stepMs = 25 } = {}) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const value = await predicate();
    if (value) return value;
    if (Date.now() > deadline) throw new Error("until(): timed out");
    await new Promise((resolve) => setTimeout(resolve, stepMs));
  }
}

function sseBody(events) {
  return events.map((ev) => `data: ${JSON.stringify(ev)}\n\n`).join("");
}

function withDaemonPort(port, fn) {
  const previous = process.env.GE_DAEMON_PORT;
  process.env.GE_DAEMON_PORT = String(port);
  const restore = () => {
    if (previous === undefined) delete process.env.GE_DAEMON_PORT;
    else process.env.GE_DAEMON_PORT = previous;
  };
  return Promise.resolve()
    .then(fn)
    .finally(restore);
}

function startFakeDaemon(handler) {
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      return handler({ method: req.method, path: url.pathname, url, req });
    },
  });
  return server;
}

// Port 1 is never listening — daemon submit fails fast with a connect error.
const CLOSED_PORT = 1;

// The job store may be the persistent repo-local one (whichever test file loads
// job-store.mjs first pins the directory for the whole bun process), so ids
// handed out by the fake daemon must be unique across runs.
const UNIQUE = `${Date.now()}-${process.pid}`;
const TASK_ID = `oracle-task-${UNIQUE}`;
const DOCTOR_ID = `oracle-doctor-${UNIQUE}`;
const REPAIR_ID = `oracle-repair-${UNIQUE}`;

// ── 1. shared SSE writer plumbing + blocked-job replay (jobs transport) ───────

test("oracle: blocked job replays stored events as framed SSE — retry once, ids are store seqs, payloads byte-exact", async () => {
  const checks = [{ name: "gcloud auth", status: "fail", detail: "no active account", fix: "gcloud auth login" }];
  const jobId = await startGeJob(["data", "up"], { id: "data.up", label: "Provision data plane" }, {
    preflight: () => ({ ok: false, fails: 1, checks }),
  });

  const { frames, writeSSE } = frameCollector();
  let ended = false;
  await streamJob(jobId, writeSSE, () => false, () => { ended = true; });
  expect(ended).toBe(true);

  const stored = await listJobEvents(jobId);
  expect(stored.length).toBe(2);
  expect(frames.length).toBe(2);
  // The replayed frame ids are the DB seqs; the retry hint is emitted exactly once.
  expect(frames[0].retry).toBe(3000);
  expect(frames[1].retry).toBeUndefined();
  expect(frames.map((f) => f.id)).toEqual(stored.map((s) => s.seq));
  // Byte-exact payload parity with the stored events.
  expect(frames.map((f) => f.data)).toEqual(stored.map((s) => JSON.stringify(s.event)));
  // Pin the actual event sequence (ts masked with the observed value).
  const events = frames.map((f) => JSON.parse(f.data));
  expect(events[0]).toEqual({
    type: "stage_started",
    stage: "preflight",
    line: "doctor readiness: data.up",
    ts: events[0].ts,
  });
  expect(events[0].ts).toMatch(ISO_TS);
  expect(events[1]).toEqual({
    type: "stage_blocked",
    stage: "preflight",
    level: "error",
    line: "blocked by 1 readiness failure",
    data: { checks, fails: 1 },
  });
});

// ── 2. daemon job streaming (jobs transport) ──────────────────────────────────

loopbackTest("oracle: daemon-backed job — submit, preflight events, SSE proxy byte-exact, mirror + terminal record", async () => {
  const daemonEvents = [
    { type: "log", level: "info", line: "building things", ts: "2026-07-02T00:00:00.000Z" },
    { type: "stage_done", stage: "job", level: "info", line: "exit 0", data: { code: 0 }, ts: "2026-07-02T00:00:01.000Z" },
  ];
  const requests = [];
  const server = startFakeDaemon(async ({ method, path, req }) => {
    if (method === "POST" && path === "/api/tasks") {
      requests.push({ path, body: await req.json() });
      return Response.json({ id: TASK_ID, status: "running" });
    }
    if (method === "GET" && path === `/api/tasks/${TASK_ID}/events`) {
      return new Response(sseBody(daemonEvents), { headers: { "content-type": "text/event-stream" } });
    }
    return new Response("not found", { status: 404 });
  });

  try {
    await withDaemonPort(server.port, async () => {
      const command = { id: "factory.build", label: "Build" };
      const okChecks = [{ name: "gcloud auth", status: "pass", detail: "ok", fix: null }];
      const jobId = await startGeJob(["build", "--ids", "demo"], command, {
        preflight: () => ({ ok: true, fails: 0, checks: okChecks }),
      });
      expect(jobId).toBe(TASK_ID);

      // Submit body parity.
      expect(requests).toEqual([
        { path: "/api/tasks", body: { kind: "ge.command", argv: ["build", "--ids", "demo"], command } },
      ]);

      // Preflight trace was recorded before streaming.
      const preflightEvents = (await listJobEvents(jobId)).map(({ event }) => event);
      expect(preflightEvents.map((ev) => [ev.type, ev.stage, ev.line])).toEqual([
        ["stage_started", "preflight", "doctor readiness: factory.build"],
        ["stage_done", "preflight", "readiness passed"],
      ]);
      expect(preflightEvents[1].data).toEqual({ checks: okChecks });

      // Streaming a running daemon job proxies the daemon SSE payloads byte-for-byte.
      const { lines, writeSSE } = lineCollector();
      let ended = false;
      await streamJob(jobId, writeSSE, () => false, () => { ended = true; });
      expect(ended).toBe(true);
      expect(lines).toEqual(daemonEvents.map((ev) => JSON.stringify(ev)));

      // Terminal event finishes the job record (status/code/lastLine) and the
      // daemon events were mirrored into the store after the preflight pair.
      const job = await until(async () => {
        const record = await getJob(jobId);
        return record?.status === "done" ? record : null;
      });
      expect(job).toMatchObject({ id: jobId, status: "done", code: 0, lastLine: "exit 0" });
      await until(async () => (await listJobEvents(jobId)).length >= 4);
      const mirrored = (await listJobEvents(jobId)).map(({ event }) => event).slice(2);
      expect(mirrored).toEqual(daemonEvents);
    });
  } finally {
    server.stop(true);
  }
});

// ── 3. local fallback execution (jobs transport) ──────────────────────────────

test("oracle: daemon-unreachable job falls back to local `ge` execution with the fell-back trace", async () => {
  await withDaemonPort(CLOSED_PORT, async () => {
    const jobId = await startGeJob(["ledger", "--help"], null);
    expect(jobId).toMatch(/^job-\d+-\d+$/);

    const job = await until(async () => {
      const record = await getJob(jobId);
      return record && record.status !== "running" ? record : null;
    });
    expect(job.status).toBe("done");
    expect(job.code).toBe(0);

    const { frames, writeSSE } = frameCollector();
    let ended = false;
    await streamJob(jobId, writeSSE, () => false, () => { ended = true; });
    expect(ended).toBe(true);
    // Live-buffer replay ids are the 1-based buffer index; retry emitted once.
    expect(frames[0].retry).toBe(3000);
    expect(frames.map((f) => f.id)).toEqual(frames.map((_, i) => i + 1));

    const events = frames.map((f) => JSON.parse(f.data));
    expect(events[0]).toMatchObject({ type: "stage_started", stage: "job", line: "$ ge ledger --help" });
    expect(events[1]).toMatchObject({ type: "log", level: "warn", data: { fellBackToLocal: true } });
    expect(events[1].line.startsWith("Daemon unavailable; running this job locally instead — ")).toBe(true);
    expect(events.at(-1)).toMatchObject({ type: "stage_done", stage: "job", level: "info", line: "exit 0" });
    // Everything between the fallback warning and the exit event is the CLI's
    // streamed stdout (content environment-stable, but pinned only structurally).
    const middle = events.slice(2, -1);
    expect(middle.length).toBeGreaterThan(0);
    for (const ev of middle) {
      expect(ev).toMatchObject({ type: "log", stage: "job", data: { stream: "stdout" } });
      expect(ev.runId).toBe(jobId);
    }
    expect(middle.map((ev) => ev.line).join("\n")).toContain("USAGE");
  });
});

// ── 4. local ledger SSE (ledger transport) ────────────────────────────────────

test("oracle: streamLedger local source — ledger_source, seeded events with seq ids, run_complete", async () => {
  const ledger = await core.runLedger();
  expect(ledger).not.toBeNull();
  const runId = `oracle-ledger-${process.pid}`;
  ledger.startRun({ id: runId, mode: "local", kind: "build", targetStage: "preview", startedAt: "2026-06-15T10:00:00.000Z" });
  ledger.recordTransition({
    runId,
    workItemId: "uc-a",
    stage: "created",
    status: "done",
    ts: "2026-06-15T10:00:02.000Z",
  });
  ledger.completeRun({ runId, ok: true, finishedAt: "2026-06-15T10:00:03.000Z" });

  const { frames, writeSSE } = frameCollector();
  let ended = false;
  await new Promise((resolve) => {
    streamLedger({ runId, source: "local" }, writeSSE, () => false, () => { ended = true; resolve(); });
  });
  expect(ended).toBe(true);

  const events = frames.map((f) => JSON.parse(f.data));
  expect(events.map((ev) => ev.type)).toEqual(["ledger_source", "stage_done", "run_complete"]);
  // ledger_source and run_complete carry a live ts (masked); no seq → no frame id.
  expect(events[0]).toEqual({ type: "ledger_source", status: "local", ts: events[0].ts, data: { source: "local" } });
  expect(events[0].ts).toMatch(ISO_TS);
  expect(frames[0].retry).toBe(3000);
  expect(frames[0].id).toBeUndefined();
  // The stored event streams byte-stable with its DB seq as the frame id.
  expect(events[1]).toEqual({
    seq: 1,
    ts: "2026-06-15T10:00:02.000Z",
    type: "stage_done",
    stage: "created",
    status: "done",
    workItemId: "uc-a",
    error: null,
    data: null,
  });
  expect(frames[1].id).toBe(1);
  expect(frames[1].retry).toBeUndefined();
  expect(events[2]).toEqual({ type: "run_complete", status: "done", ok: true, ts: events[2].ts });
  expect(events[2].ts).toMatch(ISO_TS);
  expect(frames[2].id).toBeUndefined();
});

// ── 5. raw log tailing (logs transport) ───────────────────────────────────────

test("oracle: streamLogs tails the local run NDJSON — one frame per line, 1-based ids, retry once", async () => {
  const runId = `oracle-logs-${process.pid}`;
  const dir = join(STATE_PATHS.factory.root, "runs", runId);
  mkdirSync(dir, { recursive: true });
  const ndjsonLines = [
    JSON.stringify({ type: "log", level: "info", line: "alpha" }),
    JSON.stringify({ type: "log", level: "info", line: "beta" }),
    JSON.stringify({ type: "stage_done", stage: "run", line: "exit 0" }),
  ];
  writeFileSync(join(dir, "run.ndjson"), `${ndjsonLines.join("\n")}\n`);

  try {
    const { frames, writeSSE } = frameCollector();
    let closed = false;
    streamLogs({ runId, query: { mode: "local" } }, writeSSE, () => closed);
    closed = true; // first tick is synchronous; stop the poll loop
    expect(frames).toEqual([
      { retry: 3000, id: 1, data: ndjsonLines[0] },
      { id: 2, data: ndjsonLines[1] },
      { id: 3, data: ndjsonLines[2] },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ── 6. doctor daemon proxy (doctor transport) ─────────────────────────────────

loopbackTest("oracle: streamDoctor proxies the daemon doctor task stream byte-exact", async () => {
  const doctorEvents = [
    { type: "doctor_started", line: "doctor local", data: { scope: "local" } },
    { type: "check_result", section: "toolchain", level: "info", line: "bun installed: pass" },
    { type: "doctor_done", level: "info", line: "all checks passed" },
  ];
  const starts = [];
  const server = startFakeDaemon(({ method, path, url }) => {
    if (method === "POST" && path === "/api/doctor") {
      starts.push(Object.fromEntries(url.searchParams.entries()));
      return Response.json({ id: DOCTOR_ID });
    }
    if (method === "GET" && path === `/api/tasks/${DOCTOR_ID}/events`) {
      return new Response(sseBody(doctorEvents), { headers: { "content-type": "text/event-stream" } });
    }
    return new Response("not found", { status: 404 });
  });

  try {
    await withDaemonPort(server.port, async () => {
      const { lines, writeSSE } = lineCollector();
      await new Promise((resolve) => {
        streamDoctor({ scope: "local", command: "data.up" }, writeSSE, () => false, resolve);
      });
      expect(starts).toEqual([{ scope: "local", command: "data.up" }]);
      expect(lines).toEqual(doctorEvents.map((ev) => JSON.stringify(ev)));
    });
  } finally {
    server.stop(true);
  }
});

// ── 7. doctor subprocess fallback (doctor transport) ──────────────────────────

test("oracle: streamDoctor falls back to the real doctor subprocess and replays its report", async () => {
  await withDaemonPort(CLOSED_PORT, async () => {
    const { lines, writeSSE } = lineCollector();
    await new Promise((resolve) => {
      streamDoctor({ scope: "local", query: {} }, writeSSE, () => false, resolve);
    });
    const events = lines.map((line) => JSON.parse(line));
    for (const ev of events) expect(ev.ts).toMatch(ISO_TS);

    // Heartbeats/stderr logs are timing/environment noise; the report replay is the contract.
    const meaningful = events.filter((ev) => !["doctor_heartbeat", "doctor_log"].includes(ev.type));
    expect(meaningful[0]).toMatchObject({
      type: "doctor_started",
      line: "doctor local",
      data: { scope: "local", command: null },
    });
    const terminal = meaningful.at(-1);
    expect(["doctor_done", "doctor_blocked"]).toContain(terminal.type);
    expect(Array.isArray(terminal.report?.sections)).toBe(true);
    expect(terminal.report.sections.length).toBeGreaterThan(0);
    // These check names only appear when the subprocess itself failed to launch
    // or produced unparseable output — i.e. a broken GE_CLI/cwd path after a move.
    const checkNames = terminal.report.sections.flatMap((s) => (s.checks || []).map((c) => c.name));
    expect(checkNames).not.toContain("doctor subprocess");
    expect(checkNames).not.toContain("doctor output");
    // The replay walks every section: started → per-check results → done/blocked.
    const replay = meaningful.slice(1, -1);
    for (const section of terminal.report.sections) {
      const sectionEvents = replay.filter((ev) => ev.section === section.name);
      expect(sectionEvents[0]).toMatchObject({ type: "section_started", line: `checking ${section.name}` });
      expect(sectionEvents.filter((ev) => ev.type === "check_result").length).toBe((section.checks || []).length);
      expect(["section_done", "section_blocked"]).toContain(sectionEvents.at(-1).type);
    }
  });
}, 30000);

// ── 8. repair orchestration via daemon tasks (repair transport) ───────────────

loopbackTest("oracle: repair daemon path — start records the run, get syncs items, events proxy with afterSeq", async () => {
  const submits = [];
  const taskEvents = [
    { seq: 1, type: "log", level: "info", line: "planning" },
    { seq: 2, type: "stage_done", level: "info", line: "converged" },
  ];
  const server = startFakeDaemon(async ({ method, path, req }) => {
    if (method === "POST" && path === "/api/tasks") {
      submits.push(await req.json());
      return Response.json({
        id: REPAIR_ID,
        status: "done",
        output: {
          run: { targetStage: "preview", options: { repair: true, attempts: 2, runPreview: false }, status: "done" },
          items: [{ agentId: "agent-a", workspaceId: "ws-a", status: "passed", attempts: 1 }],
        },
      });
    }
    if (method === "GET" && path === `/api/tasks/${REPAIR_ID}`) {
      return Response.json({
        id: REPAIR_ID,
        status: "done",
        output: {
          run: { status: "done" },
          items: [{ agentId: "agent-a", status: "passed", attempts: 1 }],
        },
      });
    }
    if (method === "GET" && path === `/api/tasks/${REPAIR_ID}/events`) {
      return Response.json({ events: taskEvents });
    }
    return new Response("not found", { status: 404 });
  });

  try {
    await withDaemonPort(server.port, async () => {
      const started = await startRepairRun({ ids: ["agent-a"], targetStage: "preview", repair: true, attempts: 2 });
      expect(started).toEqual({ skipped: false, runId: REPAIR_ID, reason: undefined, pipeline: undefined });
      expect(submits).toEqual([
        { kind: "repair.run", ids: ["agent-a"], targetStage: "preview", repair: true, attempts: 2, runPreview: false, query: {} },
      ]);

      const { run, items } = await getRepair(REPAIR_ID);
      expect(run).toMatchObject({
        id: REPAIR_ID,
        targetStage: "preview",
        status: "done",
        options: { repair: true, attempts: 2, runPreview: false, daemonTask: true },
        total: 1,
        passed: 1,
      });
      expect(run.endedAt).not.toBeNull();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ runId: REPAIR_ID, agentId: "agent-a", workspaceId: "ws-a", status: "passed", attempts: 1 });

      // Daemon-task event reads proxy the daemon list and honor afterSeq.
      expect(await getRepairEvents(REPAIR_ID, {})).toEqual(taskEvents);
      expect(await getRepairEvents(REPAIR_ID, { afterSeq: 1 })).toEqual([taskEvents[1]]);

      const runs = await listRepairs({ limit: 5 });
      expect(runs.some((r) => r.id === REPAIR_ID)).toBe(true);
    });
  } finally {
    server.stop(true);
  }
});
