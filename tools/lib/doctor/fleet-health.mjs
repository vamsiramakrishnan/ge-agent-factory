import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { STATE_PATHS, allExistingPaths } from "../state-paths.mjs";

const STAGES = ["spec", "data", "simulator", "build", "eval", "preview", "deploy"];
const TERMINAL = new Set(["done", "skipped"]);
const ACTIVE = new Set(["queued", "running", "paused"]);
const BLOCKED = new Set(["blocked", "failed"]);

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

function runtimeRuns(repoRoot) {
  const roots = allExistingPaths([
    process.env.GE_RUNTIME_RUNS_DIR || null,
    repoRoot === resolve(".", ".") ? STATE_PATHS.runtime.runs : join(repoRoot, ".ge", "runtime", "runs"),
  ]);
  return roots.flatMap((root) => readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readJson(join(root, entry.name, "run.json"), null)))
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

function firstBlocker(blockers = []) {
  const blocker = blockers.find(Boolean);
  if (!blocker) return null;
  if (typeof blocker === "string") return { id: blocker, message: blocker };
  return {
    id: blocker.id || blocker.artifact || blocker.check || "blocked",
    message: blocker.message || blocker.error || blocker.detail || blocker.id || "blocked",
    raw: blocker,
  };
}

function stageFromMissionNode(node = {}) {
  const kind = node.kind || node.runtimeKind || "";
  if (kind === "harness.run") return "spec";
  if (kind === "mock.generate" || kind === "snowfakery.generate") return "data";
  if (kind === "simulator.seed" || kind === "simulator.validate") return "simulator";
  if (kind === "agent.build" || node.id === "factory.build") return "build";
  if (kind === "autopilot.run" || node.id === "autopilot.converge") return "preview";
  if (kind === "doctor" || kind === "doctor.gate") return "eval";
  return "build";
}

function stageFromWorkspaceStatus(agent = {}) {
  if (agent.status === "failed") return "build";
  if (agent.status === "submitted") return "deploy";
  if (agent.workspaceId) return "preview";
  return "spec";
}

function statusForAgent(agent = {}) {
  if (agent.status === "failed") return "blocked";
  if (agent.status === "submitted") return "ready";
  if (agent.status === "none") return "missing";
  return agent.status || "unknown";
}

function ownerFor({ healthStatus, nextAction, blocker } = {}) {
  const action = String(nextAction || "");
  const blockerId = String(blocker?.id || "");
  if (action === "ship" || action === "deploy" || action.includes("ship")) return "factory";
  if (healthStatus === "ready") return "none";
  if (action.includes("resume") || action.includes("rerun") || action.includes("repair")) return "autopilot";
  if (/schema|spec|eval|code|simulator|mapping/.test(blockerId)) return "antigravity";
  if (/auth|project|credential|iam|gateway|secret|terraform/.test(blockerId)) return "user";
  if (healthStatus === "missing") return "factory";
  return "runtime";
}

function actionPlanFor(agent = {}) {
  if (agent.healthStatus === "ready" && agent.stage === "deploy" && agent.workspaceId) {
    return {
      kind: "ship_agents",
      label: "Ship",
      owner: "factory",
      safeToRun: true,
      agentIds: [agent.id],
      workspaceIds: [agent.workspaceId],
      commands: [`ge agents ship --ids ${agent.workspaceId}`],
    };
  }
  if (agent.healthStatus === "ready") {
    return { kind: "none", label: "No action", owner: "none", safeToRun: false, commands: [] };
  }
  if (agent.source === "mission" && agent.runtimeTaskId) {
    return {
      kind: "resume_mission",
      label: "Resume Mission",
      owner: agent.owner || "runtime",
      safeToRun: true,
      taskId: agent.runtimeTaskId,
      commands: [`ge runtime resume ${agent.runtimeTaskId}`],
    };
  }
  if (agent.source === "autopilot" && agent.runtimeTaskId) {
    return {
      kind: "resume_autopilot",
      label: "Resume Repair",
      owner: "autopilot",
      safeToRun: true,
      taskId: agent.runtimeTaskId,
      commands: [`ge runtime resume ${agent.runtimeTaskId}`],
    };
  }
  if (agent.healthStatus === "missing" || agent.owner === "factory") {
    return {
      kind: "build_agents",
      label: "Build",
      owner: "factory",
      safeToRun: true,
      agentIds: [agent.id],
      commands: [`ge agents build --ids ${agent.id}`],
    };
  }
  if (agent.owner === "user") {
    return {
      kind: "user_action",
      label: "Inspect Readiness",
      owner: "user",
      safeToRun: false,
      commands: ["ge doctor"],
    };
  }
  return {
    kind: "repair_agent",
    label: agent.owner === "antigravity" ? "Repair with Antigravity" : "Repair",
    owner: agent.owner || "autopilot",
    safeToRun: true,
    agentIds: [agent.id],
    commands: [`ge runtime start autopilot --ids ${agent.id} --stage preview`],
  };
}

function baseHealth(agent) {
  const stage = stageFromWorkspaceStatus(agent);
  const blocker = agent.error ? { id: "factory-failed", message: agent.error } : null;
  const nextAction = agent.status === "failed"
    ? "repair"
    : agent.status === "none"
      ? "build"
      : agent.workspaceId ? "ship" : "none";
  const healthStatus = statusForAgent(agent);
  const projected = {
    ...agent,
    stage,
    healthStatus,
    blocker,
    nextAction,
    owner: ownerFor({ healthStatus, nextAction, blocker }),
    source: "catalog",
  };
  return { ...projected, actionPlan: actionPlanFor(projected) };
}

function applyAutopilotRuns(byAgent, runs) {
  for (const run of runs) {
    if (run.kind !== "autopilot.run") continue;
    const items = run.output?.items || [];
    for (const item of items) {
      const current = byAgent.get(item.agentId);
      if (!current) continue;
      if (current.runtimeUpdatedAt && current.runtimeUpdatedAt > run.updatedAt) continue;
      const blocked = firstBlocker(item.blockers || []);
      const status = BLOCKED.has(item.status) ? "blocked" : ACTIVE.has(item.status) ? "repairing" : TERMINAL.has(item.status) || item.status === "passed" ? "ready" : item.status;
      const projected = {
        ...current,
        stage: item.targetStage || current.stage || "preview",
        healthStatus: status,
        blocker: blocked,
        nextAction: item.nextAction || run.summary?.nextAction || (blocked ? "repair" : "none"),
        owner: ownerFor({ healthStatus: status, nextAction: item.nextAction, blocker: blocked }),
        runId: item.runId || current.runId,
        runtimeTaskId: run.id,
        runtimeUpdatedAt: run.updatedAt,
        source: "autopilot",
      };
      byAgent.set(item.agentId, { ...projected, actionPlan: actionPlanFor(projected) });
    }
  }
}

function latestResumeChild(run = {}, runsById = new Map()) {
  const attempts = run.output?.resumeAttempts || [];
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    const childId = attempts[index]?.childTaskId;
    const child = childId ? runsById.get(childId) : null;
    if (child) return child;
  }
  return null;
}

function staleBlockedParent(run = {}, runsById = new Map()) {
  if (!BLOCKED.has(run.status)) return false;
  const child = latestResumeChild(run, runsById);
  if (!child) return false;
  if (String(child.updatedAt || child.createdAt || "") < String(run.updatedAt || run.createdAt || "")) return false;
  return !BLOCKED.has(child.status);
}

function applyMissionRuns(byAgent, runs) {
  const runsById = new Map(runs.map((run) => [run.id, run]));
  for (const run of runs) {
    if (run.kind !== "mission.run") continue;
    if (staleBlockedParent(run, runsById)) continue;
    const graph = run.output?.graph || run.graph;
    const blockedNode = (graph?.nodes || []).find((node) => BLOCKED.has(node.status));
    if (!blockedNode) continue;
    const ids = run.input?.ids || [];
    const blocker = firstBlocker(blockedNode.blockers || blockedNode.resumePlan?.blockers || []);
    for (const id of ids) {
      const current = byAgent.get(id);
      if (!current) continue;
      if (current.source === "autopilot" && current.runtimeUpdatedAt && current.runtimeUpdatedAt >= run.updatedAt) continue;
      if (current.workspaceId && current.localWorkspaceUpdatedAt && String(current.localWorkspaceUpdatedAt) >= String(run.updatedAt || "")) continue;
      const projected = {
        ...current,
        stage: stageFromMissionNode(blockedNode),
        healthStatus: "blocked",
        blocker,
        nextAction: blockedNode.resumePlan?.nextAction || "resume_mission",
        owner: ownerFor({ healthStatus: "blocked", nextAction: blockedNode.resumePlan?.nextAction, blocker }),
        runtimeTaskId: run.id,
        runtimeUpdatedAt: run.updatedAt,
        source: "mission",
      };
      byAgent.set(id, { ...projected, actionPlan: actionPlanFor(projected) });
    }
  }
}

function countBy(items, key) {
  const out = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    out[value] = (out[value] || 0) + 1;
  }
  return out;
}

function bottlenecks(agents) {
  const groups = new Map();
  for (const agent of agents) {
    if (!agent.blocker) continue;
    const key = `${agent.stage}:${agent.blocker.id}`;
    const current = groups.get(key) || {
      id: key,
      stage: agent.stage,
      blockerId: agent.blocker.id,
      message: agent.blocker.message,
      count: 0,
      owner: agent.owner,
      agentIds: [],
      actionPlan: agent.actionPlan || null,
    };
    current.count += 1;
    if (current.agentIds.length < 12) current.agentIds.push(agent.id);
    groups.set(key, current);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count);
}

export function buildFleetHealth(fleet, { repoRoot = resolve(".", ".") } = {}) {
  const runs = runtimeRuns(repoRoot);
  const byAgent = new Map((fleet.agents || []).map((agent) => [agent.id, baseHealth(agent)]));
  applyAutopilotRuns(byAgent, runs);
  applyMissionRuns(byAgent, runs);
  const agents = [...byAgent.values()].map((agent) => ({ ...agent, actionPlan: actionPlanFor(agent) }));
  const byStage = Object.fromEntries(STAGES.map((stage) => [stage, 0]));
  for (const agent of agents) byStage[agent.stage || "spec"] = (byStage[agent.stage || "spec"] || 0) + 1;
  const byHealth = countBy(agents, "healthStatus");
  const byOwner = countBy(agents, "owner");
  const blocked = agents.filter((agent) => ["blocked", "failed"].includes(agent.healthStatus) || agent.blocker);
  return {
    stages: STAGES,
    byStage,
    byHealth,
    byOwner,
    blocked: blocked.length,
    repairable: blocked.filter((agent) => agent.actionPlan?.safeToRun).length,
    bottlenecks: bottlenecks(agents),
    agents,
  };
}
