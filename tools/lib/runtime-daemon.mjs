import { createServer } from "node:http";
import { writeFileSync, appendFileSync, rmSync } from "node:fs";
import { readJson, writeJson } from "@ge/std/json-io";
import { isDataMissionNodeKind, safeMissionNodeCommand } from "./mission/mission-node-registry.mjs";
import { LEGACY_STATE_PATHS, STATE_PATHS } from "./state-paths.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  commandOutput,
  createRun,
  ensureStore,
  interactionDir,
  listEvents,
  listRuns,
  listSequencedEvents,
  newTaskId,
  runMetaPath,
  runOutput,
  terminalStatusForCode,
  updateRun,
  updateRunOutput,
  waitForTaskTerminal,
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
const DAEMON_PROTOCOL_VERSION = 2;
const SUPPORTED_TASK_KINDS = [
  "ge.command",
  "process.command",
  "harness.run",
  "mission.run",
  "autopilot.run",
  "doctor",
  "mock.generate",
  "snowfakery.generate",
  "simulator.seed",
  "simulator.validate",
];

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

function readRequestJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += String(chunk);
      if (body.length > 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) { resolve({}); return; }
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function streamRunEvents(req, res, id) {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    "connection": "keep-alive",
  });
  let sent = 0;
  const write = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
  const tick = () => {
    if (res.writableEnded) return;
    const events = listEvents(id);
    for (let i = sent; i < events.length; i += 1) write(events[i]);
    sent = events.length;
    const run = readJson(runMetaPath(id), null);
    if (run && !["running", "queued"].includes(run.status)) {
      res.end();
      return;
    }
    setTimeout(tick, 300);
  };
  req.on("close", () => {});
  tick();
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
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", `http://${host}:${port}`);
    if (req.method === "GET" && url.pathname === "/health") return json(res, 200, daemonStatus(port));
    if (req.method === "GET" && url.pathname === "/api/runtime/status") return json(res, 200, daemonStatus(port));
    if (req.method === "GET" && url.pathname === "/api/tasks") {
      const full = url.searchParams.get("full") === "true";
      const limit = url.searchParams.get("limit") || 50;
      return json(res, 200, { tasks: full ? listRuns(limit).map(normalizedTaskDetail) : listRunSummaries(limit) });
    }
    if (req.method === "POST" && url.pathname === "/api/tasks") {
      readRequestJson(req).then((body) => {
        if (body.kind === "ge.command") return json(res, 202, startGeCommandTask({ argv: body.argv, command: body.command || null }));
        if (body.kind === "process.command") {
          try {
            return json(res, 202, startProcessCommandTask({ argv: body.argv, command: body.command || null }));
          } catch (error) {
            return json(res, 400, { error: error.message || String(error) });
          }
        }
        if (body.kind === "harness.run") {
          try {
            return json(res, 202, startHarnessRunTask(body.input || body));
          } catch (error) {
            return json(res, 400, { error: error.message || String(error) });
          }
        }
        if (body.kind === "mission.run") {
          startMissionTask(body).then((run) => json(res, 202, run)).catch((error) => json(res, 500, { error: error.message || String(error) }));
          return;
        }
        if (body.kind === "autopilot.run") {
          startAutopilotTask(body).then((run) => json(res, 202, run)).catch((error) => json(res, 500, { error: error.message || String(error) }));
          return;
        }
        return json(res, 400, { error: `unsupported task kind: ${body.kind || "<unset>"}` });
      }).catch((error) => json(res, 400, { error: error.message || String(error) }));
      return;
    }
    const interactionMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/interactions\/([^/]+)$/);
    if (req.method === "POST" && interactionMatch) {
      readRequestJson(req)
        .then((body) => {
          const result = submitInteractionResponse(decodeURIComponent(interactionMatch[1]), decodeURIComponent(interactionMatch[2]), body);
          return json(res, result.status, result.body);
        })
        .catch((error) => json(res, 400, { error: error.message || String(error) }));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/doctor") {
      const run = startDoctorTask({ scope: url.searchParams.get("scope") || "all", command: url.searchParams.get("command") || "" });
      return json(res, 202, run);
    }
    const streamMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/events$/);
    if (req.method === "GET" && streamMatch) {
      if (url.searchParams.get("format") === "json") return json(res, 200, { events: listSequencedEvents(streamMatch[1]) });
      return streamRunEvents(req, res, streamMatch[1]);
    }
    const resumeMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/resume$/);
    if (req.method === "POST" && resumeMatch) {
      resumeTask(resumeMatch[1]).then((result) => json(res, result.status, result.body)).catch((error) => json(res, 500, { error: error.message || String(error) }));
      return;
    }
    const runMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (req.method === "GET" && runMatch) {
      const run = readJson(runMetaPath(runMatch[1]), null);
      return json(res, run ? 200 : 404, run ? normalizedTaskDetail(run) : { error: "unknown task" });
    }
    return json(res, 404, { error: "not found" });
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
    try { server.close(); } catch {} // already-closed server: expected on double shutdown
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
