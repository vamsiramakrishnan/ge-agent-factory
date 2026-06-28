import { buildMissionGraph } from "./mission-plan.mjs";

export const JOURNEY_STAGES = [
  "interview",
  "spec",
  "data",
  "simulator",
  "build",
  "eval",
  "preview",
  "deploy",
];

const STAGE_LABELS = {
  interview: "Interview",
  spec: "Spec",
  data: "Data",
  simulator: "Simulator",
  build: "Agent Build",
  eval: "Eval",
  preview: "Preview",
  deploy: "Deploy",
};

const STAGE_OWNERS = {
  interview: "antigravity",
  spec: "antigravity",
  data: "runtime",
  simulator: "runtime",
  build: "factory",
  eval: "antigravity",
  preview: "autopilot",
  deploy: "factory",
};

const MISSION_NODE_STAGE = {
  "antigravity.spec-data-review": "spec",
  "mock.generate": "data",
  "snowfakery.generate": "data",
  "simulator.seed": "simulator",
  "simulator.validate": "simulator",
  "factory.build": "build",
  "autopilot.converge": "preview",
};

const TERMINAL = new Set(["done", "skipped"]);
const BLOCKED = new Set(["blocked", "failed"]);
const ACTIVE = new Set(["queued", "running", "paused"]);

function splitIds(ids = []) {
  if (Array.isArray(ids)) return ids.map(String).map((id) => id.trim()).filter(Boolean);
  return String(ids || "").split(",").map((id) => id.trim()).filter(Boolean);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function latestTask(tasks = [], predicate = () => true) {
  return [...tasks]
    .filter(predicate)
    .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")))[0] || null;
}

function stageStatusRank(status) {
  if (BLOCKED.has(status)) return 4;
  if (ACTIVE.has(status)) return 3;
  if (TERMINAL.has(status)) return 2;
  return 1;
}

function mergeStageStatus(current, next) {
  return stageStatusRank(next) > stageStatusRank(current) ? next : current;
}

function blockerFromNode(node = {}) {
  const blocker = node.blockers?.[0] || node.resumePlan?.blockers?.[0] || null;
  if (!blocker) return null;
  if (typeof blocker === "string") return { id: "blocked", message: blocker };
  return {
    id: blocker.id || node.id || "blocked",
    message: blocker.message || blocker.error || blocker.detail || blocker.id || "blocked",
  };
}

function action(kind, label, commands = [], safeToRun = true, extra = {}) {
  return { kind, label, commands, safeToRun, ...extra };
}

function baseStages({ scenario, ids, systems, targetStage, mode, usecaseId }) {
  const idArg = ids.length ? ` --ids ${ids.join(",")}` : "";
  const systemsArg = systems.length ? ` --systems ${systems.join(",")}` : "";
  const scenarioArg = scenario ? ` --scenario ${scenario}` : "";
  const targetArg = targetStage ? ` --target-stage ${targetStage}` : "";
  const specUsecase = usecaseId || scenario || "<usecase>";
  const specReviewRoute = specUsecase === "<usecase>" ? "#/spec-review" : `#/spec-review/${encodeURIComponent(specUsecase)}`;
  const specPath = specUsecase === "<usecase>" ? ".ge/interviews/<usecase>/agent-spec.json" : `.ge/interviews/${specUsecase}/agent-spec.json`;
  return JOURNEY_STAGES.map((stage) => ({
    id: stage,
    label: STAGE_LABELS[stage],
    owner: STAGE_OWNERS[stage],
    status: "pending",
    blocker: null,
    taskId: null,
    nodeIds: [],
    artifacts: [],
    actionPlan: {
      interview: action("start_interview", "Start interview", ["Open #/interview"], true),
      spec: action("review_spec", "Review generated spec", [`Open ${specReviewRoute}`], true, { route: specReviewRoute, artifactPath: specPath }),
      data: action("run_mission", "Generate data", [`ge mission run${scenarioArg}${systemsArg}${targetArg}`.trim()], true),
      simulator: action("run_mission", "Seed simulators", [`ge mission run${scenarioArg}${systemsArg}${targetArg}`.trim()], true),
      build: action("build_agents", "Build agents", [`ge agents build${idArg}${mode === "remote" ? "" : " --local"}`.trim()], true),
      eval: action("generate_evals", "Generate evals", [`node apps/factory/scripts/spec-workbench.mjs golden-evals prompt --spec ${specPath}`], true),
      preview: action("run_preview", "Run preview", [`ge mission run${scenarioArg}${systemsArg} --run-preview`.trim()], true),
      deploy: action("ship_agents", "Ship agents", [`ge agents ship${idArg}`.trim()], false),
    }[stage],
  }));
}

function applyMissionGraph(stages, graph = null) {
  if (!graph?.nodes?.length) return;
  for (const node of graph.nodes) {
    const stageId = MISSION_NODE_STAGE[node.id] || MISSION_NODE_STAGE[node.kind];
    if (!stageId) continue;
    const stage = stages.find((entry) => entry.id === stageId);
    if (!stage) continue;
    stage.status = mergeStageStatus(stage.status, node.status || "pending");
    stage.taskId = stage.taskId || node.childTaskId || null;
    stage.nodeIds.push(node.id);
    stage.artifacts.push(...(node.artifacts || []));
    if (BLOCKED.has(node.status) && !stage.blocker) {
      stage.blocker = blockerFromNode(node);
      stage.actionPlan = action("resume_mission", "Resume mission", node.resumePlan?.commands || [`ge mission resume ${graph.id}`], true, { taskId: graph.id, nodeId: node.id });
    }
  }
}

function applyRuntimeTasks(stages, tasks = []) {
  const harness = latestTask(tasks, (task) => task.kind === "harness.run" && String(task.input?.stage || "").includes("interview"));
  if (harness) {
    const interview = stages.find((stage) => stage.id === "interview");
    interview.status = harness.status || "pending";
    interview.taskId = harness.id;
    interview.artifacts = harness.artifactRefs || harness.output?.artifactRefs || [];
    if (BLOCKED.has(harness.status)) {
      interview.blocker = { id: "harness-blocked", message: harness.resumePlan?.reason || harness.summary || "Antigravity interview is blocked" };
      interview.actionPlan = action("resume_harness", "Resume interview", harness.resumePlan?.commands || [`ge runtime resume ${harness.id}`], !!harness.resumePlan?.safeToRun, { taskId: harness.id });
    } else if (ACTIVE.has(harness.status)) {
      interview.actionPlan = action("watch_runtime", "Watch interview", [`ge runtime events ${harness.id} --follow`], false, { taskId: harness.id });
    }
  }
  const mission = latestTask(tasks, (task) => task.kind === "mission.run");
  if (mission?.output?.graph) {
    applyMissionGraph(stages, mission.output.graph);
    const blocked = (mission.output.graph.nodes || []).find((node) => BLOCKED.has(node.status));
    if (blocked) {
      const stage = stages.find((entry) => entry.nodeIds.includes(blocked.id));
      if (stage) {
        stage.taskId = mission.id;
        stage.actionPlan = action("resume_mission", "Resume mission", mission.summary?.resumePlan?.commands || [`ge mission resume ${mission.id}`], true, { taskId: mission.id, nodeId: blocked.id });
      }
    }
  }
}

function applyFleet(stages, fleet = null, selectedIds = []) {
  const health = fleet?.health;
  if (!health) return;
  const selected = new Set(selectedIds);
  const inScope = (agent) => selected.size === 0 || selected.has(agent.id);
  const agents = (health.agents || []).filter(inScope);
  if (selected.size > 0) {
    markStage(stages, "interview", "skipped");
    markStage(stages, "spec", "done");
  }
  const previewReady = agents.filter((agent) => agent.workspaceId && agent.healthStatus === "ready");
  const workspaceReady = agents.filter((agent) => agent.workspaceId);
  if (agents.length > 0 && workspaceReady.length === agents.length) {
    for (const stageId of ["data", "simulator", "build", "eval"]) markStage(stages, stageId, "done");
    const preview = stages.find((stage) => stage.id === "preview");
    if (preview) {
      preview.status = previewReady.length === agents.length ? "done" : mergeStageStatus(preview.status, "pending");
      preview.actionPlan = previewReady.length === agents.length
        ? null
        : preview.actionPlan;
    }
  }
  if (agents.length > 0 && previewReady.length === agents.length) {
    const workspaceIds = previewReady.map((agent) => agent.workspaceId).filter(Boolean);
    const deploy = stages.find((stage) => stage.id === "deploy");
    if (deploy) {
      deploy.status = "pending";
      deploy.blocker = null;
      deploy.actionPlan = action("ship_agents", "Ship agents", [`ge agents ship --ids ${workspaceIds.join(",")}`], true, {
        agentIds: previewReady.map((agent) => agent.id),
        workspaceIds,
      });
    }
  }
  const buildBlocked = agents.filter((agent) => agent.stage === "build" && agent.healthStatus === "blocked");
  const previewBlocked = agents.filter((agent) => agent.stage === "preview" && agent.healthStatus === "blocked");
  const readyForBuild = agents.filter((agent) => agent.actionPlan?.kind === "build_agents");
  if (readyForBuild.length) {
    const build = stages.find((stage) => stage.id === "build");
    build.status = mergeStageStatus(build.status, "pending");
    build.actionPlan = action("build_agents", "Build missing agents", [`ge agents build --ids ${readyForBuild.slice(0, 25).map((agent) => agent.id).join(",")}`], true, { agentIds: readyForBuild.map((agent) => agent.id) });
  }
  if (buildBlocked.length) {
    const build = stages.find((stage) => stage.id === "build");
    build.status = "blocked";
    build.blocker = buildBlocked[0].blocker || { id: "build-blocked", message: `${buildBlocked.length} agent build blocker(s)` };
  }
  if (previewBlocked.length) {
    const preview = stages.find((stage) => stage.id === "preview");
    preview.status = "blocked";
    preview.blocker = previewBlocked[0].blocker || { id: "preview-blocked", message: `${previewBlocked.length} preview blocker(s)` };
    if (previewBlocked[0].actionPlan) preview.actionPlan = previewBlocked[0].actionPlan;
  }
}

function markStage(stages, stageId, status) {
  const stage = stages.find((entry) => entry.id === stageId);
  if (!stage) return;
  stage.status = status;
  if (TERMINAL.has(status)) {
    stage.blocker = null;
    stage.actionPlan = null;
  }
}

function deriveCounts(stages) {
  return stages.reduce((acc, stage) => {
    acc[stage.status] = (acc[stage.status] || 0) + 1;
    return acc;
  }, {});
}

function nextStage(stages) {
  return stages.find((stage) => BLOCKED.has(stage.status))
    || stages.find((stage) => ACTIVE.has(stage.status))
    || stages.find((stage) => !TERMINAL.has(stage.status))
    || stages[stages.length - 1];
}

export function buildJourneyPlan({
  scenario = null,
  spec = null,
  usecaseId = null,
  systems = [],
  ids = [],
  targetStage = "preview",
  mode = "local",
  status = null,
  fleet = null,
  tasks = [],
  graph = null,
  includePlannedMission = true,
} = {}) {
  const selectedIds = splitIds(ids);
  const selectedSystems = splitIds(systems);
  const normalizedUsecase = usecaseId || slugify(scenario) || null;
  const startsFromCatalogSpec = selectedIds.length > 0 && !spec;
  const plannedGraph = graph || (includePlannedMission ? buildMissionGraph({
    id: "mission-planned",
    mode,
    ids: selectedIds,
    scenario,
    spec,
    systems: selectedSystems,
    targetStage,
    runPreview: targetStage === "preview",
    executeFactory: false,
    useAntigravity: !startsFromCatalogSpec,
  }) : null);
  const stages = baseStages({ scenario, ids: selectedIds, systems: selectedSystems, targetStage, mode, usecaseId: normalizedUsecase });
  if (plannedGraph) applyMissionGraph(stages, plannedGraph);
  applyRuntimeTasks(stages, tasks);
  applyFleet(stages, fleet, selectedIds);

  const next = nextStage(stages);
  return {
    kind: "ge.journey.plan",
    version: 1,
    id: normalizedUsecase || scenario || selectedIds[0] || "journey",
    mode,
    targetStage,
    input: { scenario, spec, usecaseId: normalizedUsecase, systems: selectedSystems, ids: selectedIds },
    status: BLOCKED.has(next?.status) ? "blocked" : ACTIVE.has(next?.status) ? "running" : stages.every((stage) => TERMINAL.has(stage.status)) ? "done" : "pending",
    next,
    counts: deriveCounts(stages),
    stages,
    implementation: {
      missionGraph: plannedGraph ? { id: plannedGraph.id, nodes: plannedGraph.nodes.map((node) => ({ id: node.id, kind: node.kind, runtimeKind: node.runtimeKind, dependsOn: node.dependsOn })) } : null,
      readiness: status ? { mode: status.mode, project: status.project || null, next: status.next || null } : null,
      fleet: fleet?.health ? { total: fleet.total, blocked: fleet.health.blocked, repairable: fleet.health.repairable, byStage: fleet.health.byStage } : null,
    },
  };
}
