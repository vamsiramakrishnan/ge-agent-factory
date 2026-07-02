import { createServer } from "node:http";
import { writeFileSync, appendFileSync, rmSync } from "node:fs";
import * as core from "./factory-core.mjs";
import { readJson, writeJson } from "@ge/std/json-io";
import { verifyMissionArtifacts } from "./mission-artifacts.mjs";
import { isDataMissionNodeKind, safeMissionNodeCommand, validateMissionNodeArtifacts } from "./mission-node-registry.mjs";
import { summarizeMissionNode } from "./mission-node-summary.mjs";
import { buildMissionGraph, nextRunnableMissionNode, patchMissionNode, resetMissionGraphForResume } from "./mission-plan.mjs";
import { LEGACY_STATE_PATHS, REPO_ROOT, STATE_PATHS } from "./state-paths.mjs";
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
import { resumeMissionNodeCommandTask, startMissionNodeCommandTask } from "./daemon/mission-node-run.mjs";
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
  normalizedTaskSummary,
  resumePlanFor,
  taskDetail,
  taskSummary,
} from "./daemon/resume-plan.mjs";

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

function childStatusToNodeStatus(status) {
  if (status === "done") return "done";
  if (status === "skipped") return "skipped";
  if (["blocked", "failed"].includes(status)) return "blocked";
  return status || "blocked";
}

function rehomeResumePlan(plan = null, fromMissionId = null, toMissionId = null) {
  if (!plan || !toMissionId) return plan;
  const from = fromMissionId ? String(fromMissionId) : "";
  return {
    ...plan,
    commands: Array.isArray(plan.commands)
      ? plan.commands.map((command) => from ? String(command).replaceAll(from, toMissionId) : String(command))
      : [],
  };
}

function rehomeMissionGraph(graph = null, missionId = null, fromMissionId = null) {
  if (!graph || !missionId) return graph;
  return {
    ...graph,
    id: missionId,
    nodes: (graph.nodes || []).map((node) => ({
      ...node,
      missionId,
      resumePlan: rehomeResumePlan(node.resumePlan, fromMissionId || graph.id, missionId),
      childTask: node.childTask?.resumePlan
        ? { ...node.childTask, resumePlan: rehomeResumePlan(node.childTask.resumePlan, fromMissionId || graph.id, missionId) }
        : node.childTask || null,
    })),
    edges: graph.edges || [],
  };
}

function attachMissionResumeChild({ parentId, child, nodeId = null }) {
  const parent = readJson(runMetaPath(parentId), null);
  if (!parent || !child) return;
  const currentOutput = parent.output || {};
  const parentGraph = currentOutput.graph || null;
  const delegatedGraph = parentGraph && nodeId
    ? patchMissionNode(parentGraph, nodeId, {
      status: "running",
      childTaskId: child.id,
      childTask: taskSummary(child),
      blockers: [],
    })
    : parentGraph;
  updateRun(parentId, {
    status: "running",
    endedAt: null,
    output: {
      ...currentOutput,
      graph: delegatedGraph || parentGraph,
      counts: delegatedGraph?.counts || currentOutput.counts || parentGraph?.counts || null,
      delegatedTaskId: child.id,
      delegatedNodeId: nodeId,
    },
  });

  waitForTaskTerminal(child.id, {
    onEvent: (wrapped) => {
      const event = wrapped.event || {};
      if (!event.line) return;
      appendEvent(parentId, {
        type: "mission_resume_child_event",
        level: event.level || "info",
        childTaskId: child.id,
        childSeq: wrapped.seq,
        childEventType: event.type || null,
        line: `${child.id}: ${event.line}`,
      });
    },
  }).then((finishedChild) => {
    const latestParent = readJson(runMetaPath(parentId), parent);
    const childOutput = finishedChild?.output || {};
    const childGraph = childOutput.graph
      ? rehomeMissionGraph(childOutput.graph, parentId, child.id)
      : latestParent.output?.graph || null;
    const nextOutput = {
      ...(latestParent.output || {}),
      ...childOutput,
      graph: childGraph,
      counts: childGraph?.counts || childOutput.counts || latestParent.output?.counts || null,
      artifactRefs: childGraph?.nodes?.flatMap((node) => node.artifacts || []) || childOutput.artifactRefs || latestParent.output?.artifactRefs || [],
      delegatedTaskId: child.id,
      delegatedNodeId: nodeId,
    };
    appendEvent(parentId, {
      type: "mission_resume_child_terminal",
      level: finishedChild.status === "done" ? "info" : "warn",
      childTaskId: child.id,
      line: `child mission ${child.id} ${finishedChild.status}`,
      counts: nextOutput.counts || null,
    });
    updateRun(parentId, {
      status: finishedChild.status,
      endedAt: finishedChild.endedAt || new Date().toISOString(),
      error: finishedChild.error || null,
      output: nextOutput,
    });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(parentId, { type: "mission_resume_child_failed", level: "error", childTaskId: child.id, line });
    updateRun(parentId, { status: "failed", endedAt: new Date().toISOString(), error: line });
  });
}

async function startChildForMissionNode(node) {
  if (node.runtimeKind === "doctor") return startDoctorTask(node.input || {});
  if (node.runtimeKind === "ge.command") return startGeCommandTask(node.input || {});
  if (node.runtimeKind === "process.command") return startProcessCommandTask(node.input || {});
  if (node.runtimeKind === "harness.run") return startHarnessRunTask(node.input || {});
  if (isDataMissionNodeKind(node.runtimeKind)) return startMissionNodeCommandTask(node.runtimeKind, node.input || {});
  if (node.runtimeKind === "autopilot.run") return await startAutopilotTask(node.input || {});
  throw new Error(`unsupported mission node runtime kind: ${node.runtimeKind || "<unset>"}`);
}

function affectedMissionNodeIds(graph = {}, startNodeId = null) {
  if (!startNodeId) return new Set();
  const nodes = graph.nodes || [];
  const childrenById = new Map();
  for (const node of nodes) {
    for (const dep of node.dependsOn || []) {
      childrenById.set(dep, [...(childrenById.get(dep) || []), node.id]);
    }
  }
  const affected = new Set([startNodeId]);
  const queue = [startNodeId];
  while (queue.length) {
    const current = queue.shift();
    for (const child of childrenById.get(current) || []) {
      if (affected.has(child)) continue;
      affected.add(child);
      queue.push(child);
    }
  }
  return affected;
}

function rehydrateMissionGraphForResume(resumeGraph = {}, plannedGraph = {}, startNodeId = null) {
  if (!resumeGraph || !plannedGraph) return resumeGraph;
  const plannedById = new Map((plannedGraph.nodes || []).map((node) => [node.id, node]));
  const affected = affectedMissionNodeIds(resumeGraph, startNodeId);
  const nodes = (resumeGraph.nodes || []).map((node) => {
    const planned = plannedById.get(node.id);
    if (!planned) return node;
    const shouldRunAgain = affected.has(node.id);
    const currentArtifacts = Array.isArray(node.artifacts) ? node.artifacts : [];
    const plannedArtifacts = Array.isArray(planned.artifacts) ? planned.artifacts : [];
    const next = {
      ...node,
      kind: planned.kind,
      label: planned.label,
      runtimeKind: planned.runtimeKind,
      input: planned.input,
      dependsOn: planned.dependsOn,
      blockers: Array.isArray(node.blockers) ? node.blockers : [],
      artifacts: shouldRunAgain ? plannedArtifacts : currentArtifacts.length ? currentArtifacts : plannedArtifacts,
    };
    return { ...next, resumePlan: node.resumePlan };
  });
  return {
    ...resumeGraph,
    input: { ...(plannedGraph.input || {}), ...(resumeGraph.input || {}) },
    edges: plannedGraph.edges || resumeGraph.edges || [],
    nodes,
  };
}

async function startMissionTask({ ids = [], scenario = null, spec = null, workspace = null, systems = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {}, mode = null, executeFactory = false, useAntigravity = true, harnessAgent = "antigravity-sdk", harnessModel = "gemini-3.5-flash", harnessLocation = "global", resumedFrom = null, resumeGraph = null, startAtNode = null } = {}) {
  const cfg = core.loadConfig(query || {});
  const plannedGraph = buildMissionGraph({
    mode: mode || cfg.mode || "local",
    ids,
    scenario,
    spec,
    workspace,
    systems,
    targetStage,
    repair,
    attempts,
    runPreview,
    query,
    executeFactory,
    useAntigravity,
    harnessAgent,
    harnessModel,
    harnessLocation,
  });
  const rehydratedGraph = resumeGraph && startAtNode ? rehydrateMissionGraphForResume(resumeGraph, plannedGraph, startAtNode) : null;
  const graph = rehydratedGraph && startAtNode ? resetMissionGraphForResume({ ...rehydratedGraph, id: plannedGraph.id }, startAtNode) : plannedGraph;
  const run = createRun({
    id: graph.id,
    kind: "mission.run",
    input: { ids, scenario, spec, workspace, systems, targetStage, repair, attempts, runPreview, query, mode: mode || cfg.mode || "local", executeFactory, useAntigravity, harnessAgent, harnessModel, harnessLocation, resumedFrom, startAtNode },
  });
  updateRunOutput(run.id, { graph, counts: graph.counts, artifactRefs: [] });
  appendEvent(run.id, { type: "mission_started", line: `mission ${run.id} started`, graph: { id: graph.id, counts: graph.counts } });
  if (rehydratedGraph) {
    appendEvent(run.id, {
      type: "mission_graph_rehydrated",
      level: "info",
      line: `mission graph rehydrated from current node registry at ${startAtNode}`,
      startAtNode,
    });
  }

  (async () => {
    let current = graph;
    try {
      for (;;) {
        const node = nextRunnableMissionNode(current);
        if (!node) break;
        current = patchMissionNode(current, node.id, { status: "running" });
        updateRunOutput(run.id, { graph: current, counts: current.counts });
        appendEvent(run.id, { type: "mission_node_started", nodeId: node.id, line: `${node.id}: scheduling ${node.runtimeKind}` });
        const child = await startChildForMissionNode(node);
        current = patchMissionNode(current, node.id, { childTaskId: child.id, status: "running", childTask: taskSummary(child) });
        updateRunOutput(run.id, { graph: current, counts: current.counts });
        appendEvent(run.id, { type: "mission_child_started", nodeId: node.id, childTaskId: child.id, line: `${node.id}: child task ${child.id}` });
        const finishedChild = await waitForTaskTerminal(child.id, {
          onEvent: (wrapped) => {
            const event = wrapped.event || {};
            if (!event.line) return;
            appendEvent(run.id, {
              type: "mission_child_log",
              level: event.level || "info",
              nodeId: node.id,
              childTaskId: child.id,
              childSeq: wrapped.seq,
              line: `${node.id}: ${event.line}`,
              childEventType: event.type || null,
            });
          },
        });
        const childDetail = taskDetail(finishedChild);
        const plan = childDetail?.summary?.resumePlan || null;
        const baseArtifactCheck = verifyMissionArtifacts(node.artifacts || [], { repoRoot: REPO_ROOT, childTask: finishedChild });
        const nodeSummary = summarizeMissionNode({ node, childTask: finishedChild, artifactCheck: baseArtifactCheck });
        const semanticCheck = validateMissionNodeArtifacts(node.kind || node.runtimeKind, { input: node.input || {}, artifactCheck: baseArtifactCheck, summary: nodeSummary });
        const artifactCheck = {
          ...baseArtifactCheck,
          ok: baseArtifactCheck.ok && semanticCheck.ok,
          blockers: [...(baseArtifactCheck.blockers || []), ...(semanticCheck.blockers || [])],
          warnings: semanticCheck.warnings || [],
          semantic: semanticCheck,
        };
        const childNodeStatus = childStatusToNodeStatus(finishedChild?.status);
        const nodeStatus = childNodeStatus === "done" && !artifactCheck.ok ? "blocked" : childNodeStatus;
        const blockers = [
          ...(plan?.blockers || []),
          ...(childNodeStatus === "done" ? artifactCheck.blockers : []),
        ];
        current = patchMissionNode(current, node.id, {
          status: nodeStatus,
          childTaskId: child.id,
          childTask: childDetail?.summary || null,
          blockers,
          warnings: artifactCheck.warnings || [],
          artifacts: artifactCheck.artifacts.length ? artifactCheck.artifacts : plan?.artifacts || childDetail?.summary?.artifactRefs || [],
          artifactCheck,
          summary: nodeSummary,
        });
        updateRunOutput(run.id, {
          graph: current,
          counts: current.counts,
          artifactRefs: current.nodes.flatMap((graphNode) => graphNode.artifacts || []),
        });
        appendEvent(run.id, {
          type: nodeStatus === "blocked" ? "mission_node_blocked" : "mission_node_done",
          level: nodeStatus === "blocked" ? "error" : "info",
          nodeId: node.id,
          childTaskId: child.id,
          line: artifactCheck.ok ? `${node.id}: ${nodeStatus}` : `${node.id}: blocked by ${artifactCheck.blockers.length} artifact issue${artifactCheck.blockers.length === 1 ? "" : "s"}`,
          resumePlan: plan,
          artifactCheck,
          summary: nodeSummary,
        });
        if (nodeStatus === "blocked") break;
      }
      const finalStatus = current.status === "blocked" ? "blocked" : current.counts.pending || current.counts.running ? "paused" : "done";
      appendEvent(run.id, {
        type: finalStatus === "done" ? "mission_done" : "mission_blocked",
        level: finalStatus === "done" ? "info" : "warn",
        line: `mission ${finalStatus}`,
        counts: current.counts,
      });
      updateRun(run.id, { status: finalStatus, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), graph: { ...current, status: finalStatus }, counts: current.counts } });
    } catch (error) {
      const line = error?.message || String(error);
      appendEvent(run.id, { type: "mission_failed", level: "error", line });
      updateRun(run.id, { status: "failed", endedAt: new Date().toISOString(), error: line, output: runOutput(run.id) });
    }
  })();

  return readJson(runMetaPath(run.id), run);
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
    try { server.close(); } catch {}
    try { rmSync(PID_PATH, { force: true }); } catch {}
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
