import { dataMissionNodes, missionDataContext } from "./mission-nodes.mjs";

const TERMINAL = new Set(["done", "skipped"]);

export function missionNodeResumePlan(node = {}) {
  if (["blocked", "failed"].includes(node.status) && (node.blockers || []).length) {
    return {
      state: "blocked",
      nextAction: "rerun_task",
      safeToRun: true,
      commands: node.id ? [`ge mission resume ${node.missionId || "<mission-id>"}`] : [],
      reason: node.blockers?.[0]?.message || "node is blocked",
      blockers: node.blockers || [],
      artifacts: node.artifacts || [],
    };
  }
  if (node.childTask?.resumePlan) return node.childTask.resumePlan;
  if (node.status === "done" || node.status === "skipped") {
    return {
      state: node.status,
      nextAction: "none",
      safeToRun: false,
      commands: node.id ? [`ge mission status ${node.missionId || "<mission-id>"}`] : [],
      reason: `node is ${node.status}`,
      blockers: node.blockers || [],
      artifacts: node.artifacts || [],
    };
  }
  const state = node.status === "pending" ? "paused" : node.status || "paused";
  return {
    state,
    nextAction: node.status === "running" ? "wait" : node.status === "done" ? "none" : "rerun_task",
    safeToRun: ["pending", "blocked", "failed", "paused"].includes(node.status || "pending"),
    commands: node.id ? [`ge mission resume ${node.missionId || "<mission-id>"}`] : [],
    reason: node.status === "done" ? "node is done" : "node can be scheduled by mission runtime",
    blockers: node.blockers || [],
    artifacts: node.artifacts || [],
  };
}

export function missionCounts(nodes = []) {
  return {
    total: nodes.length,
    done: nodes.filter((node) => node.status === "done").length,
    running: nodes.filter((node) => node.status === "running").length,
    blocked: nodes.filter((node) => ["blocked", "failed"].includes(node.status)).length,
    pending: nodes.filter((node) => ["pending", "paused"].includes(node.status)).length,
    skipped: nodes.filter((node) => node.status === "skipped").length,
  };
}

function idsArg(ids = []) {
  return Array.isArray(ids) ? ids.filter(Boolean).join(",") : String(ids || "");
}

export function buildMissionGraph({
  id = null,
  mode = "local",
  ids = [],
  scenario = null,
  spec = null,
  workspace = null,
  systems = [],
  targetStage = "preview",
  repair = true,
  attempts = 3,
  runPreview = false,
  query = {},
  executeFactory = false,
  useAntigravity = true,
  harnessAgent = "antigravity-sdk",
  harnessModel = "gemini-3.5-flash",
  harnessLocation = "global",
} = {}) {
  const missionId = id || `mission-${Date.now()}`;
  const selectedIds = Array.isArray(ids) ? ids.filter(Boolean) : idsArg(ids).split(",").map((x) => x.trim()).filter(Boolean);
  const local = mode !== "remote";
  const dataContext = missionDataContext({ scenario, spec, workspace, systems });
  const antigravityNodeId = "antigravity.spec-data-review";
  const antigravityDependsOn = ["preflight.doctor"];
  const dataDependsOn = useAntigravity ? [antigravityNodeId] : ["preflight.doctor"];
  const factoryArgv = local
    ? ["agents", "build", "--local", ...(selectedIds.length ? ["--ids", selectedIds.join(",")] : []), "--target", "previewed"]
    : ["agents", "build", ...(selectedIds.length ? ["--ids", selectedIds.join(",")] : []), "--target", targetStage];
  const dataNodes = dataMissionNodes({ missionId, scenario: dataContext.scenario, spec: dataContext.spec, workspace: dataContext.workspace, systems: dataContext.systems })
    .map((node) => node.id === "mock.generate" ? { ...node, dependsOn: dataDependsOn } : node);
  const preflightCommand = dataContext.enabled ? "mission.run" : local ? "agents.build.local" : "agents.build";
  const dataTail = dataNodes.length ? dataNodes[dataNodes.length - 1].id : (useAntigravity ? antigravityNodeId : "preflight.doctor");
  const factoryDependsOn = dataNodes.length ? [dataTail] : [dataTail];
  const autopilotDependsOn = executeFactory ? ["factory.build"] : [dataTail];
  const antigravityMessage = [
    "Operate the GE Agent Factory mission as the Antigravity harness.",
    scenario ? `Scenario/use-case: ${scenario}` : null,
    dataContext.spec ? `Spec artifact: ${dataContext.spec}` : null,
    selectedIds.length ? `Agent ids: ${selectedIds.join(", ")}` : null,
    dataContext.systems.length ? `Simulator systems: ${dataContext.systems.join(", ")}` : null,
    dataContext.workspace ? `Mission workspace: ${dataContext.workspace}` : null,
    "",
    "Read the selected repository skills before acting. Check the spec, golden eval, mock-data, simulator, and ADK eval contracts.",
    "Use existing simulator systems where appropriate. Do not scaffold duplicate simulators. Treat .md policy/evidence files as unstructured document artifacts.",
    "Return a concise readiness report with blockers and exact next commands. Do not deploy or publish.",
  ].filter(Boolean).join("\n");
  const nodes = [
    {
      id: "preflight.doctor",
      missionId,
      kind: "doctor.gate",
      label: "Preflight Doctor",
      status: "pending",
      runtimeKind: "doctor",
      input: { scope: "all", command: preflightCommand },
      dependsOn: [],
      artifacts: [],
      blockers: [],
    },
    ...(useAntigravity ? [{
      id: antigravityNodeId,
      missionId,
      kind: "harness.run",
      label: "Antigravity Spec/Data Review",
      status: "pending",
      runtimeKind: "harness.run",
      input: {
        workspaceDir: ".",
        agent: harnessAgent,
        stage: "spec_generation,mock_data,simulation,eval",
        permissionProfile: "review",
        vertex: true,
        project: query.project || null,
        location: query.location || query.region || harnessLocation,
        model: query.model || harnessModel,
        message: antigravityMessage,
      },
      dependsOn: antigravityDependsOn,
      artifacts: [],
      blockers: [],
    }] : []),
    ...dataNodes,
    {
      id: "factory.build",
      missionId,
      kind: "agent.build",
      label: "Factory Build",
      status: executeFactory ? "pending" : "skipped",
      runtimeKind: "ge.command",
      input: { argv: factoryArgv, command: { id: local ? "agents.build.local" : "agents.build" } },
      dependsOn: factoryDependsOn,
      artifacts: [],
      blockers: [],
      handoff: executeFactory ? null : {
        id: "factory-not-executed",
        label: "Build agents",
        message: "Factory build is a handoff action for this mission, not an automatic runtime node.",
        commands: [`ge agents build${selectedIds.length ? ` --ids ${selectedIds.join(",")}` : ""}${local ? " --local" : ""}`.trim()],
      },
    },
    {
      id: "autopilot.converge",
      missionId,
      kind: "autopilot.run",
      label: "Autopilot Convergence",
      status: "pending",
      runtimeKind: "autopilot.run",
      input: { ids: selectedIds, targetStage, repair, attempts, runPreview, query },
      dependsOn: autopilotDependsOn,
      artifacts: [],
      blockers: [],
    },
  ];
  return {
    id: missionId,
    kind: "ge.mission.graph",
    version: 1,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    input: { mode, ids: selectedIds, scenario: dataContext.scenario, spec: dataContext.spec, workspace: dataContext.workspace, systems: dataContext.systems, targetStage, repair, attempts, runPreview, query, executeFactory, useAntigravity, harnessAgent, harnessModel, harnessLocation },
    nodes: nodes.map((node) => ({ ...node, resumePlan: missionNodeResumePlan(node) })),
    edges: nodes.flatMap((node) => node.dependsOn.map((from) => ({ from, to: node.id }))),
    counts: missionCounts(nodes),
  };
}

export function patchMissionNode(graph, nodeId, patch = {}) {
  const nodes = (graph.nodes || []).map((node) => {
    if (node.id !== nodeId) return node;
    const next = { ...node, ...patch, updatedAt: new Date().toISOString() };
    return { ...next, resumePlan: missionNodeResumePlan(next) };
  });
  const counts = missionCounts(nodes);
  const blocked = nodes.some((node) => ["blocked", "failed"].includes(node.status));
  const pending = nodes.some((node) => ["pending", "paused", "running"].includes(node.status));
  const status = blocked ? "blocked" : pending ? "running" : "done";
  return { ...graph, nodes, counts, status, updatedAt: new Date().toISOString() };
}

export function resetMissionGraphForResume(graph = {}, startNodeId) {
  if (!startNodeId) return graph;
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
  const resetNodes = nodes.map((node) => {
    if (!affected.has(node.id)) {
      const next = { ...node, missionId: graph.id };
      return { ...next, resumePlan: missionNodeResumePlan(next) };
    }
    const skipped = node.status === "skipped";
    const next = {
      ...node,
      missionId: graph.id,
      status: skipped ? "skipped" : "pending",
      childTaskId: null,
      childTask: null,
      blockers: skipped ? node.blockers || [] : [],
      artifactCheck: null,
      summary: null,
      updatedAt: new Date().toISOString(),
    };
    return { ...next, resumePlan: missionNodeResumePlan(next) };
  });
  const counts = missionCounts(resetNodes);
  return {
    ...graph,
    status: "pending",
    updatedAt: new Date().toISOString(),
    nodes: resetNodes,
    counts,
  };
}

export function nextRunnableMissionNode(graph = {}) {
  const nodes = graph.nodes || [];
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return nodes.find((node) => {
    if (node.status !== "pending") return false;
    return (node.dependsOn || []).every((dep) => TERMINAL.has(byId.get(dep)?.status));
  }) || null;
}
