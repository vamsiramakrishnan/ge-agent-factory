import { createServer } from "node:http";
import { writeFileSync, appendFileSync, rmSync } from "node:fs";
import { readJson, writeJson } from "@ge/std/json-io";
import { isDataMissionNodeKind, safeMissionNodeCommand } from "./mission/mission-node-registry.mjs";
import { LEGACY_STATE_PATHS, STATE_PATHS } from "./state-paths.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  commandOutput,
  ensureStore,
  listRuns,
  listSequencedEvents,
  runMetaPath,
} from "./daemon/run-store.mjs";
import { resumeDoctorTask, startDoctorTask } from "./daemon/doctor-run.mjs";
import {
  resumeGeCommandTask,
  resumeProcessCommandTask,
  safeGeCommand,
  safeProcessCommand,
  startGeCommandTask,
  startProcessCommandTask,
  toolAugmentedPath,
} from "./daemon/command-run.mjs";
import { resumeMissionNodeCommandTask } from "./daemon/mission-node-run.mjs";
import { startAutopilotTask } from "./daemon/autopilot-run.mjs";
import {
  harnessRunArgv,
  normalizeInteractionResponses,
  resolveHarnessRunInput,
  resumeHarnessRunTask,
  safeHarnessRunInput,
  startHarnessRunTask,
  submitInteractionResponse,
} from "./daemon/harness-run.mjs";
import {
  listRunSummaries,
  normalizedTaskDetail,
  resumePlanFor,
} from "./daemon/resume-plan.mjs";
import { createDaemonApp } from "./daemon/http-app.mjs";
import {
  attachMissionResumeChild,
  rehomeMissionGraph,
  rehydrateMissionGraphForResume,
  startMissionTask,
} from "./daemon/mission-graph-run.mjs";

const DAEMON_DIR = STATE_PATHS.runtime.root;
const RUNS_DIR = STATE_PATHS.runtime.runs;
const PID_PATH = STATE_PATHS.runtime.pid;
const META_PATH = STATE_PATHS.runtime.meta;
const LOG_PATH = STATE_PATHS.runtime.log;
const DEFAULT_PORT = 17654;
// v3: canonical task kinds (pipeline.run/repair.run), zod-validated task
// creation, and resumable SSE (id:/retry:/heartbeat + Last-Event-ID/afterSeq).
const DAEMON_PROTOCOL_VERSION = 3;
const SUPPORTED_TASK_KINDS = [
  "ge.command",
  "process.command",
  "harness.run",
  "pipeline.run",
  "repair.run",
  "mission.run",
  "autopilot.run",
  "doctor",
  "mock.generate",
  "snowfakery.generate",
  "simulator.seed",
  "simulator.validate",
];

// ── Task-kind vocabulary boundary ───────────────────────────────────────────
// The operator vocabulary collapsed to two nouns: a *pipeline run* (the
// orchestration graph a spec moves through — formerly "mission"/"journey")
// and a *repair run* (blocker convergence — formerly "autopilot"). Wire kinds
// are persisted in run.json files and mirrored stores, so they stay stable
// forever; the rename lives here at the boundary. Canonical kinds are
// accepted on POST (normalized to the wire kind before anything is stored)
// and wire kinds render back as canonical in human surfaces.
export const TASK_KIND_ALIASES = {
  "pipeline.run": "mission.run",
  "repair.run": "autopilot.run",
};
const CANONICAL_TASK_KINDS = Object.fromEntries(
  Object.entries(TASK_KIND_ALIASES).map(([canonical, wire]) => [wire, canonical]),
);
// canonical/legacy → the stable persisted kind.
export function wireTaskKind(kind) {
  return TASK_KIND_ALIASES[kind] || kind;
}
// persisted kind → the canonical operator-facing name.
export function displayTaskKind(kind) {
  return CANONICAL_TASK_KINDS[kind] || kind;
}

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body, null, 2));
};

export { safeGeCommand, safeProcessCommand, toolAugmentedPath, safeHarnessRunInput, resumePlanFor };

export function safeMissionRuntimeCommand(kind, input = {}) {
  return safeMissionNodeCommand(kind, input);
}

async function resumeTask(id) {
  const run = readJson(runMetaPath(id), null);
  if (!run) return { status: 404, body: { error: "unknown task" } };
  const plan = resumePlanFor(run);
  appendEvent(id, { type: "resume_started", line: `resume requested for ${id}` });
  appendEvent(id, { type: "resume_decision", line: `${plan.nextAction}: ${plan.reason}`, resumePlan: plan });
  if (!plan.safeToRun) {
    appendEvent(id, { type: "resume_blocked", level: plan.state === "done" ? "info" : "warn", line: plan.reason, resumePlan: plan });
    appendResumeAttempt(id, { status: plan.state === "done" ? "done" : "blocked", action: plan.nextAction, reason: plan.reason });
    return { status: 200, body: normalizedTaskDetail(readJson(runMetaPath(id), run)) };
  }
  if (run.kind === "autopilot.run") {
    const child = await startAutopilotTask({ ...(run.input || {}), resumedFrom: run.id });
    appendEvent(id, { type: "resume_done", line: `started child Autopilot task ${child.id}`, childTaskId: child.id });
    appendResumeAttempt(id, { status: "done", action: "resume_autopilot", childTaskId: child.id });
  } else if (run.kind === "mission.run") {
    const graph = run.output?.graph || null;
    const blockedNode = (graph?.nodes || []).find((node) => ["blocked", "failed"].includes(node.status));
    const child = await startMissionTask({ ...(run.input || {}), resumedFrom: run.id, resumeGraph: graph, startAtNode: blockedNode?.id || null });
    appendEvent(id, { type: "resume_done", line: blockedNode ? `started child mission task ${child.id} at ${blockedNode.id}` : `started child mission task ${child.id}`, childTaskId: child.id, nodeId: blockedNode?.id || null });
    appendResumeAttempt(id, { status: "done", action: "resume_mission", childTaskId: child.id, nodeId: blockedNode?.id || null });
    attachMissionResumeChild({ parentId: id, child, nodeId: blockedNode?.id || null });
  } else if (run.kind === "doctor") resumeDoctorTask(run);
  else if (run.kind === "ge.command") resumeGeCommandTask(run);
  else if (run.kind === "process.command") resumeProcessCommandTask(run);
  else if (run.kind === "harness.run") resumeHarnessRunTask(run);
  else if (isDataMissionNodeKind(run.kind)) resumeMissionNodeCommandTask(run);
  else {
    appendEvent(id, { type: "resume_blocked", level: "warn", line: `no resume handler for ${run.kind || "<unset>"}` });
    appendResumeAttempt(id, { status: "blocked", action: "inspect_blocker", reason: `no resume handler for ${run.kind || "<unset>"}` });
  }
  return { status: 202, body: normalizedTaskDetail(readJson(runMetaPath(id), run)) };
}

// Bridge one node:http request onto the Hono app (`app.fetch`) with response
// STREAMING — the factory server's strangler bridge buffers whole bodies
// (fine for JSON), but the daemon serves SSE, so frames must flush as they're
// written. Same Request-construction pattern as apps/factory/src/server.js.
async function serveNodeRequest(app, req, res) {
  const headers = new Headers();
  for (let i = 0; i < req.rawHeaders.length; i += 2) headers.append(req.rawHeaders[i], req.rawHeaders[i + 1]);
  const isBodyless = req.method === "GET" || req.method === "HEAD";
  const request = new Request(`http://${req.headers.host || "127.0.0.1"}${req.url}`, {
    method: req.method,
    headers,
    body: isBodyless ? undefined : req,
    duplex: isBodyless ? undefined : "half",
  });
  const response = await app.fetch(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (!response.body) {
    res.end();
    return;
  }
  const reader = response.body.getReader();
  res.on("close", () => {
    // Client went away: cancel the web stream so streamSSE's abort fires and
    // its poll loop stops. cancel() rejecting just means it already finished.
    reader.cancel().catch(() => {}); // best-effort: cancel() rejecting means the stream already finished
  });
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } catch {
    // The client disconnected mid-stream — nothing left to deliver to.
  }
  res.end();
}

function daemonStatus(port) {
  return {
    ok: true,
    protocolVersion: DAEMON_PROTOCOL_VERSION,
    supportedTaskKinds: SUPPORTED_TASK_KINDS,
    capabilities: {
      harnessRun: true,
      missionRun: true,
      runtimeResume: true,
      eventStream: true,
      resumableEventStream: true,
      validatedTaskInput: true,
      artifactChecks: true,
      interactionForms: true,
    },
    pid: process.pid,
    port,
    startedAt: readJson(META_PATH, {}).startedAt || null,
    dataDir: DAEMON_DIR,
    runs: listRunSummaries(20),
  };
}

export function startDaemonServer({ host = "127.0.0.1", port = DEFAULT_PORT, foreground = true } = {}) {
  ensureStore();
  const backgroundChild = process.env.GE_DAEMON_BACKGROUND === "1";
  writeJson(META_PATH, { pid: process.pid, port, host, startedAt: new Date().toISOString() });
  writeFileSync(PID_PATH, String(process.pid), "utf8");
  // The route table lives in daemon/http-app.mjs (Hono + zod-validated task
  // creation + resumable SSE); this process wires it to node:http and owns
  // lifecycle concerns only (pidfile, signals, logging).
  const app = createDaemonApp({
    port,
    daemonStatus,
    listRuns,
    listRunSummaries,
    normalizedTaskDetail,
    readRun: (id) => readJson(runMetaPath(id), null),
    listSequencedEvents,
    wireTaskKind,
    startGeCommandTask,
    startProcessCommandTask,
    startHarnessRunTask,
    startMissionTask,
    startAutopilotTask,
    startDoctorTask,
    submitInteractionResponse,
    resumeTask,
  });
  const server = createServer((req, res) => {
    serveNodeRequest(app, req, res).catch((error) => {
      if (!res.headersSent) json(res, 500, { error: error.message || String(error) });
      else res.end();
    });
  });
  server.on("error", (error) => {
    const line = `${new Date().toISOString()} daemon listen error: ${error.message || String(error)}\n`;
    appendFileSync(LOG_PATH, line, "utf8");
    if (foreground && !backgroundChild) console.error(line.trim());
  });
  server.listen(port, host, () => {
    const line = `${new Date().toISOString()} ge daemon listening on http://${host}:${port}\n`;
    appendFileSync(LOG_PATH, line, "utf8");
    if (foreground && !backgroundChild) console.log(line.trim());
  });
  const stop = () => {
    try { server.close(); } catch { /* best-effort: already-closed server, expected on double shutdown */ }
    // force:true already tolerates a missing pidfile; a rejection here is a real
    // fs error and leaves a stale pidfile behind, so make it visible.
    try { rmSync(PID_PATH, { force: true }); } catch (error) {
      console.warn(`ge daemon: could not remove pidfile ${PID_PATH} — ${error?.message || String(error)}`);
    }
  };
  process.on("SIGINT", () => { stop(); process.exit(0); });
  process.on("SIGTERM", () => { stop(); process.exit(0); });
  return { server, url: `http://${host}:${port}`, stop };
}

export async function getDaemonStatus({ port = Number(process.env.GE_DAEMON_PORT) || DEFAULT_PORT } = {}) {
  const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1500) });
  if (!response.ok) throw new Error(`daemon health returned ${response.status}`);
  return await response.json();
}

export const __test = {
  rehydrateMissionGraphForResume,
  rehomeMissionGraph,
  commandOutput,
  harnessRunArgv,
  normalizeInteractionResponses,
  resolveHarnessRunInput,
};

export function daemonPaths() {
  return {
    dir: DAEMON_DIR,
    runsDir: RUNS_DIR,
    pidPath: PID_PATH,
    metaPath: META_PATH,
    logPath: LOG_PATH,
    defaultPort: DEFAULT_PORT,
    legacy: LEGACY_STATE_PATHS.runtime,
  };
}
