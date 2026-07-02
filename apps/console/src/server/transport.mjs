import { spawn } from "node:child_process";
import * as core from "../../../../tools/lib/factory-core.mjs";
import { execStream } from "../../../../tools/lib/exec-stream.mjs";
import {
  autopilotItemsFromMission,
  autopilotSkipReason,
  runAutopilotConvergence,
} from "../../../../tools/lib/autopilot-runner.mjs";
import { handleGeApi } from "./ge-api.mjs";
import { makeSseWriter } from "./transport/sse.mjs";
import { daemonBaseUrl } from "./transport/daemon.mjs";
import { GE_CLI, REPO_ROOT } from "./transport/paths.mjs";
export { streamLedger, __setFirestoreLedgerReaderForTest } from "./transport/ledger.mjs";
import {
  appendAutopilotEvent,
  appendJobEvent,
  createAutopilotRun,
  createJobRecord,
  finishAutopilotRun,
  finishJobRecord,
  getAutopilotRun,
  getJobRecord,
  listAutopilotEvents,
  listAutopilotItems,
  listAutopilotRuns,
  listJobEvents,
  listJobRecords,
  updateAutopilotItem,
} from "./job-store.mjs";

// ── background jobs ───────────────────────────────────────────────────────────
// Long mutating ops (up, mcp deploy, build, ship, sync) must NOT run in-process —
// factory-core shells out synchronously and would block the server's event loop.
// We spawn the `ge` CLI as an async child, return a jobId immediately, and stream
// its NDJSON-shaped output over SSE so the console stays responsive.
const jobs = new Map(); // id -> { id, argv, status, events[], code, listeners:Set }
let jobSeq = 0;
const autopilotActive = new Set();
let autopilotSeq = 0;

function terminalJobEvent(ev) {
  return ["stage_done", "stage_failed", "stage_blocked"].includes(ev?.type) && (!ev.stage || ev.stage === "job" || ev.stage === "preflight");
}

function terminalJobStatusFromEvent(ev) {
  if (ev?.type === "stage_done") return "done";
  if (ev?.type === "stage_blocked") return "blocked";
  return "failed";
}

async function submitGeJobToDaemon(argv, command = null) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "ge.command", argv, command }),
    signal: AbortSignal.timeout(600),
  });
  if (!response.ok) throw new Error(`daemon task start failed: ${response.status}`);
  return await response.json();
}

async function submitAutopilotToDaemon(body) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "autopilot.run", ...body }),
    signal: AbortSignal.timeout(1000),
  });
  if (!response.ok) throw new Error(`daemon autopilot start failed: ${response.status}`);
  return await response.json();
}

async function fetchDaemonTask(id) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks/${encodeURIComponent(id)}`, {
    signal: AbortSignal.timeout(1000),
  });
  if (!response.ok) throw new Error(`daemon task lookup failed: ${response.status}`);
  return await response.json();
}

async function fetchDaemonTaskEvents(id) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks/${encodeURIComponent(id)}/events?format=json`, {
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(`daemon task events failed: ${response.status}`);
  const body = await response.json();
  return body.events || [];
}

async function syncDaemonAutopilot(id) {
  const local = await getAutopilotRun(id);
  if (!local?.options?.daemonTask) return local;
  const task = await fetchDaemonTask(id);
  const output = task.output || {};
  for (const item of output.items || []) {
    await updateAutopilotItem(id, item.agentId, item);
  }
  if (!["running", "queued"].includes(task.status)) {
    await finishAutopilotRun(id, output.run?.status || task.status);
  }
  return await getAutopilotRun(id);
}

async function streamDaemonTask(id, writeSSE, isClosed, onEnd = () => {}, { mirrorJobEvents = false } = {}) {
  const response = await fetch(`${daemonBaseUrl()}/api/tasks/${encodeURIComponent(id)}/events`, {
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok || !response.body) throw new Error(`daemon task stream failed: ${response.status}`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let ended = false;
  const finish = (status, ev) => {
    if (ended) return;
    ended = true;
    if (mirrorJobEvents) {
      finishJobRecord(id, { status, code: ev?.data?.code ?? null, lastLine: ev?.line || null }).catch(() => {});
    }
    onEnd();
  };
  for (;;) {
    if (isClosed()) break;
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const line = frame.split(/\r?\n/).find((part) => part.startsWith("data: "));
      if (!line || isClosed()) continue;
      let ev;
      try { ev = JSON.parse(line.slice(6)); } catch { ev = null; }
      if (mirrorJobEvents && ev) appendJobEvent(id, ev).catch(() => {});
      writeSSE(line.slice(6));
      if (terminalJobEvent(ev)) finish(terminalJobStatusFromEvent(ev), ev);
    }
  }
  if (!ended) onEnd();
}

export async function startGeJob(argv, command = null, { cfg = null, preflight = null, selection = null } = {}) {
  const pushPreflightOnly = async (id, ev) => {
    await appendJobEvent(id, ev);
  };

  // When the daemon submit fails we fall through to local execution. Capture the
  // reason so the local job carries a "fell back to local" trace instead of the
  // submit error vanishing into a silent catch (the DB may already mark the run
  // daemon-bound, so a silent fallback desyncs the UI with no way to see why).
  let daemonSubmitError = null;

  if (command?.id) {
    let preflightResult;
    try {
      preflightResult = typeof preflight === "function"
        ? preflight(command.id)
        : core.preflightCommand(cfg || core.loadConfig({}), { commandId: command.id, selection });
    } catch (e) {
      preflightResult = {
        ok: false,
        checks: [{ name: "preflight", status: "fail", detail: e.message || String(e), fix: null }],
        fails: 1,
      };
    }
    if (!preflightResult.ok) {
      const id = `job-${Date.now()}-${++jobSeq}`;
      await createJobRecord({ id, argv, command });
      await pushPreflightOnly(id, { type: "stage_started", stage: "preflight", line: `doctor readiness: ${command.id}`, ts: new Date().toISOString() });
      const line = `blocked by ${preflightResult.fails} readiness failure${preflightResult.fails === 1 ? "" : "s"}`;
      await pushPreflightOnly(id, { type: "stage_blocked", stage: "preflight", level: "error", line, data: { checks: preflightResult.checks, fails: preflightResult.fails } });
      await finishJobRecord(id, { status: "blocked", code: null, lastLine: line, checks: preflightResult.checks });
      return id;
    }
    try {
      const run = await submitGeJobToDaemon(argv, command);
      await createJobRecord({ id: run.id, argv, command });
      await pushPreflightOnly(run.id, { type: "stage_started", stage: "preflight", line: `doctor readiness: ${command.id}`, ts: new Date().toISOString() });
      await pushPreflightOnly(run.id, { type: "stage_done", stage: "preflight", level: "info", line: "readiness passed", data: { checks: preflightResult.checks } });
      return run.id;
    } catch (error) {
      daemonSubmitError = error;
    }
  }

  if (!command?.id) {
    try {
      const run = await submitGeJobToDaemon(argv, command);
      await createJobRecord({ id: run.id, argv, command });
      return run.id;
    } catch (error) {
      daemonSubmitError = error;
    }
  }

  const id = `job-${Date.now()}-${++jobSeq}`;
  const job = { id, argv, command, status: "running", events: [], code: null, listeners: new Set() };
  jobs.set(id, job);
  await createJobRecord({ id, argv, command });
  const push = (ev) => {
    job.events.push(ev);
    if (job.events.length > 5000) job.events.shift();
    appendJobEvent(id, ev).catch(() => {});
    for (const l of job.listeners) { try { l(ev); } catch {} }
  };
  push({ type: "stage_started", stage: "job", line: `$ ge ${argv.join(" ")}`, ts: new Date().toISOString() });
  if (daemonSubmitError) {
    const reason = daemonSubmitError?.message || String(daemonSubmitError);
    console.warn(`[transport] job ${id}: daemon submit failed, running locally — ${reason}`);
    push({ type: "log", level: "warn", line: `Daemon unavailable; running this job locally instead — ${reason}`, data: { fellBackToLocal: true } });
  }

  if (command?.id) {
    push({ type: "stage_started", stage: "preflight", line: `doctor readiness: ${command.id}`, ts: new Date().toISOString() });
    push({ type: "stage_done", stage: "preflight", level: "info", line: "readiness passed" });
  }

  execStream("bun", [GE_CLI, ...argv], { onEvent: push, meta: { runId: id, stage: "job" } })
    .then((r) => {
      job.status = r.code === 0 ? "done" : "failed";
      job.code = r.code;
      const line = `exit ${r.code}`;
      push({ type: r.code === 0 ? "stage_done" : "stage_failed", stage: "job", level: r.code === 0 ? "info" : "error", line });
      finishJobRecord(id, { status: job.status, code: r.code, lastLine: line }).catch(() => {});
    })
    .catch((e) => {
      const line = String(e?.message || e);
      job.status = "failed";
      push({ type: "stage_failed", stage: "job", level: "error", line });
      finishJobRecord(id, { status: "failed", code: 1, lastLine: line }).catch(() => {});
    });
  return id;
}

export async function getJob(id) {
  const j = jobs.get(id);
  if (!j) return await getJobRecord(id);
  const stored = await getJobRecord(id);
  return stored ? { ...stored, status: j.status, code: j.code } : { id: j.id, argv: j.argv, command: j.command, status: j.status, code: j.code, checks: [] };
}

export async function listJobs({ limit } = {}) {
  return await listJobRecords({ limit });
}

export async function startAutopilotRun({ ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {} } = {}) {
  // Daemon submit failure falls through to local mission planning below; capture
  // the reason so the local run is traceable instead of silently swapping planes.
  let daemonSubmitError = null;
  try {
    const task = await submitAutopilotToDaemon({ ids, targetStage, repair, attempts, runPreview, query });
    const output = task.output || {};
    const run = output.run;
    const items = output.items || [];
    if (run) {
      await createAutopilotRun({
        id: task.id,
        targetStage: run.targetStage || targetStage,
        options: { ...(run.options || {}), daemonTask: true },
        items,
        status: run.status || task.status,
      });
      if (!["running", "queued"].includes(task.status)) await finishAutopilotRun(task.id, run.status || task.status);
    }
    return {
      skipped: task.status === "skipped",
      runId: task.id,
      reason: output.reason,
      mission: output.mission,
    };
  } catch (error) {
    daemonSubmitError = error;
  }

  const cfg = core.loadConfig(query || {});
  const mission = await core.missionPlan(cfg, { ids, targetStage, repair, attempts, runPreview });
  const items = autopilotItemsFromMission(mission);
  if (!items.length) {
    const id = `auto-skip-${Date.now()}-${++autopilotSeq}`;
    const reason = autopilotSkipReason(mission);
    if (daemonSubmitError) console.warn(`[transport] autopilot ${id}: daemon submit failed, planned locally — ${daemonSubmitError?.message || String(daemonSubmitError)}`);
    await createAutopilotRun({
      id,
      targetStage,
      options: { repair, attempts, runPreview, mode: cfg.mode, mission, skipped: true, skipReason: reason },
      items: [],
      status: "skipped",
    });
    await appendAutopilotEvent(id, {
      type: "stage_skipped",
      level: "info",
      line: reason,
      data: { summary: mission.summary, modeContract: mission.modeContract },
      ts: new Date().toISOString(),
    });
    await finishAutopilotRun(id, "skipped");
    return {
      skipped: true,
      runId: id,
      reason,
      mission,
    };
  }
  const id = `auto-${Date.now()}-${++autopilotSeq}`;
  await createAutopilotRun({
    id,
    targetStage,
    options: { repair, attempts, runPreview, mode: cfg.mode, mission },
    items,
  });
  if (daemonSubmitError) {
    const reason = daemonSubmitError?.message || String(daemonSubmitError);
    console.warn(`[transport] autopilot ${id}: daemon submit failed, running locally — ${reason}`);
    await appendAutopilotEvent(id, { type: "log", level: "warn", line: `Daemon unavailable; running autopilot locally instead — ${reason}`, data: { fellBackToLocal: true }, ts: new Date().toISOString() });
  }
  processAutopilotRun(id, { cfg, repair, attempts, runPreview }).catch(() => {});
  return { skipped: false, runId: id, mission };
}

export async function resumeAutopilotRun(id, { query = {} } = {}) {
  const run = await getAutopilotRun(id);
  if (!run) return null;
  if (run.options?.daemonTask) return await syncDaemonAutopilot(id);
  const cfg = core.loadConfig(query || {});
  processAutopilotRun(id, {
    cfg,
    repair: run.options?.repair !== false,
    attempts: run.options?.attempts || 3,
    runPreview: run.options?.runPreview === true,
  }).catch(() => {});
  return await getAutopilotRun(id);
}

export async function getAutopilot(id) {
  const run = await syncDaemonAutopilot(id) || await getAutopilotRun(id);
  if (!run) return null;
  return { run, items: await listAutopilotItems(id) };
}

export async function listAutopilots({ limit } = {}) {
  return await listAutopilotRuns({ limit });
}

export async function getAutopilotEvents(id, opts = {}) {
  const run = await getAutopilotRun(id);
  if (run?.options?.daemonTask) {
    try {
      const events = await fetchDaemonTaskEvents(id);
      const after = Number(opts.afterSeq) || 0;
      return events.filter((event) => event.seq > after);
    } catch {}
  }
  return await listAutopilotEvents(id, opts);
}

async function processAutopilotRun(id, { cfg, repair = true, attempts = 3, runPreview = false } = {}) {
  if (autopilotActive.has(id)) return;
  autopilotActive.add(id);
  const push = (ev) => appendAutopilotEvent(id, { ...ev, ts: new Date().toISOString() }).catch(() => {});
  try {
    const run = await getAutopilotRun(id);
    const items = await listAutopilotItems(id);
    const result = await runAutopilotConvergence({
      run,
      items,
      cfg,
      core,
      repair,
      attempts,
      runPreview,
      emit: push,
      updateItem: (item) => updateAutopilotItem(id, item.agentId, item),
    });
    await finishAutopilotRun(id, result.status);
  } catch (e) {
    push({ type: "stage_failed", level: "error", line: e?.message || String(e) });
    await finishAutopilotRun(id, "failed");
  } finally {
    autopilotActive.delete(id);
  }
}

// Replay buffered events then stream live ones; end on terminal event or close.
// Frames carry a monotonic `id:` (DB seq for stored events, buffer index for
// live ones) plus a one-time `retry:` so the browser can reconnect and resume.
export async function streamJob(id, writeSSE, isClosed, onEnd = () => {}) {
  const emit = makeSseWriter(writeSSE);
  const job = jobs.get(id);
  if (!job) {
    const stored = await getJobRecord(id);
    if (!stored) { emit(JSON.stringify({ type: "stage_failed", stage: "job", level: "error", line: "unknown job" })); onEnd(); return; }
    if (stored.status === "running") {
      try {
        await streamDaemonTask(id, writeSSE, isClosed, onEnd, { mirrorJobEvents: true });
        return;
      } catch {}
    }
    for (const { seq, event } of await listJobEvents(id)) emit(JSON.stringify(event), { seq });
    onEnd();
    return;
  }
  let seq = 0;
  for (const ev of job.events) emit(JSON.stringify(ev), { seq: ++seq });
  if (job.status !== "running") { onEnd(); return; }
  const l = (ev) => {
    if (isClosed()) { job.listeners.delete(l); return; }
    emit(JSON.stringify(ev), { seq: ++seq });
    if (ev.type === "stage_done" || ev.type === "stage_failed" || ev.type === "stage_blocked") { job.listeners.delete(l); onEnd(); }
  };
  job.listeners.add(l);
}

function doctorScopeOpts(scope, command) {
  const withCommand = (opts) => command ? { ...opts, command } : opts;
  if (scope === "local") return withCommand({ local: true, cloud: false, data: false, mcp: false });
  if (scope === "cloud") return withCommand({ local: false, cloud: true, data: false, mcp: false });
  if (scope === "data") return withCommand({ local: false, cloud: false, data: true, mcp: false });
  if (scope === "mcp") return withCommand({ local: false, cloud: false, data: false, mcp: true });
  return withCommand({ local: false, cloud: true, data: true, mcp: true });
}

function doctorArgv(scope, command) {
  const argv = ["doctor", "--json"];
  if (scope === "local") argv.push("--local");
  else if (scope === "cloud") argv.push("--cloud");
  else if (scope === "data") argv.push("--data");
  else if (scope === "mcp") argv.push("--mcp");
  if (command) argv.push("--command", command);
  return argv;
}

async function proxyDoctorFromDaemon({ scope = "all", command } = {}, writeSSE, isClosed, onEnd) {
  const port = Number(process.env.GE_DAEMON_PORT || 17654);
  const base = `http://127.0.0.1:${port}`;
  const qs = new URLSearchParams({ scope });
  if (command) qs.set("command", command);
  const start = await fetch(`${base}/api/doctor?${qs.toString()}`, {
    method: "POST",
    signal: AbortSignal.timeout(600),
  });
  if (!start.ok) throw new Error(`daemon doctor start failed: ${start.status}`);
  const run = await start.json();
  const stream = await fetch(`${base}/api/tasks/${encodeURIComponent(run.id)}/events`, {
    signal: AbortSignal.timeout(60000),
  });
  if (!stream.ok || !stream.body) throw new Error(`daemon doctor stream failed: ${stream.status}`);
  const reader = stream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    if (isClosed()) break;
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const line = frame.split(/\r?\n/).find((part) => part.startsWith("data: "));
      if (line && !isClosed()) writeSSE(line.slice(6));
    }
  }
  onEnd();
}

function replayDoctorReport(report, emit) {
  for (const section of report.sections || []) {
    if (!emit({ type: "section_started", section: section.name, line: `checking ${section.name}` })) return false;
    for (const check of section.checks || []) {
      if (!emit({
        type: "check_result",
        section: section.name,
        level: check.status === "fail" ? "error" : check.status === "warn" ? "warn" : "info",
        line: `${check.name}: ${check.status}`,
        check,
      })) return false;
    }
    if (!emit({
      type: section.fails ? "section_blocked" : "section_done",
      section: section.name,
      level: section.fails ? "error" : "info",
      line: section.fails ? `${section.name}: ${section.fails} failure${section.fails === 1 ? "" : "s"}` : `${section.name}: passed`,
      sectionReport: section,
    })) return false;
  }
  return true;
}

export function streamDoctor(args = {}, writeSSE, isClosed, onEnd = () => {}) {
  proxyDoctorFromDaemon(args, writeSSE, isClosed, onEnd).catch(() => {
    streamDoctorSubprocess(args, writeSSE, isClosed, onEnd);
  });
}

function streamDoctorSubprocess({ scope = "all", command, query = {} } = {}, writeSSE, isClosed, onEnd = () => {}) {
  const cfg = core.loadConfig(query || {});
  const startedAt = new Date().toISOString();
  const emit = (event) => {
    if (isClosed()) return false;
    writeSSE(JSON.stringify({ ts: new Date().toISOString(), ...event }));
    return true;
  };

  emit({
    type: "doctor_started",
    line: command ? `doctor ${scope} readiness for ${command}` : `doctor ${scope}`,
    data: { scope, command: command || null, project: cfg.project, region: cfg.region, startedAt },
  });

  const argv = doctorArgv(scope, command);
  const child = spawn("bun", [GE_CLI, ...argv], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  let closed = false;
  const heartbeat = setInterval(() => {
    if (isClosed()) {
      child.kill();
      clearInterval(heartbeat);
      return;
    }
    emit({ type: "doctor_heartbeat", level: "info", line: "doctor still running" });
  }, 2000);
  child.stdout.on("data", (chunk) => { stdout += String(chunk); });
  child.stderr.on("data", (chunk) => {
    const text = String(chunk);
    stderr += text;
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      emit({ type: "doctor_log", level: /fail|error|blocked/i.test(line) ? "error" : /warn|unset|not found/i.test(line) ? "warn" : "info", line });
    }
  });
  child.on("error", (e) => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    const report = {
      mode: "all",
      project: cfg.project,
      region: cfg.region,
      sections: [{ name: "doctor", checks: [{ name: "doctor subprocess", status: "fail", detail: e.message || String(e), fix: "ge doctor --json" }], fails: 1 }],
      fails: 1,
    };
    replayDoctorReport(report, emit);
    emit({ type: "doctor_blocked", level: "error", line: "doctor subprocess failed", report });
    onEnd();
  });
  child.on("close", (code) => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    let report;
    try {
      report = JSON.parse(stdout || "{}");
    } catch {
      report = {
        mode: "all",
        project: cfg.project,
        region: cfg.region,
        sections: [{ name: "doctor", checks: [{ name: "doctor output", status: "fail", detail: (stderr || stdout || "no output").slice(-1000), fix: "ge doctor --json" }], fails: 1 }],
        fails: 1,
      };
    }
    if (code !== 0 && (!report.sections || !report.sections.length)) {
      report.sections = [{ name: "doctor", checks: [{ name: "doctor exit", status: "fail", detail: `exit ${code}`, fix: "ge doctor --json" }], fails: 1 }];
      report.fails = 1;
    }
    replayDoctorReport(report, emit);
    emit({
      type: report.fails ? "doctor_blocked" : "doctor_done",
      level: report.fails ? "error" : "info",
      line: report.fails ? `blocked by ${report.fails} failure${report.fails === 1 ? "" : "s"}` : "all checks passed",
      report,
    });
    onEnd();
  });
}

// Parse an incoming request into the handler's req shape. bodyText may be "".
export async function toApiReq(method, url, bodyText) {
  const u = new URL(url, "http://localhost");
  const query = Object.fromEntries(u.searchParams.entries());
  let body = null;
  if (bodyText) { try { body = JSON.parse(bodyText); } catch { body = null; } }
  return { method, path: u.pathname, query, body };
}

// Poll-based NDJSON log stream: re-read tailLog, emit only new lines. writeSSE(line) sends one SSE "data:" frame.
// Each frame carries a monotonic `id:` (the line's 1-based index) so a browser
// EventSource can resume from Last-Event-ID after a drop, plus a one-time `retry:`.
export function streamLogs({ runId, stage, item, query }, writeSSE, isClosed) {
  const emit = makeSseWriter(writeSSE);
  let sent = 0;
  const tick = () => {
    if (isClosed()) return;
    let r; try { r = core.tailLog(core.loadConfig(query || {}), { runId, stage, item }); } catch { r = { ndjson: "" }; }
    const lines = (r.ndjson || "").split("\n").filter(Boolean);
    for (let i = sent; i < lines.length; i++) emit(lines[i], { seq: i + 1 });
    sent = Math.max(sent, lines.length);
    if (!isClosed()) setTimeout(tick, 1000);
  };
  tick();
}
export { core };
