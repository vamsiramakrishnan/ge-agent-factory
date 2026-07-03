import { parseList } from "@ge/std/list";

const LOCAL_BUILD_BOUNDARY = "previewed";

const STAGE_CONTRACTS = {
  preview: {
    workspaceGate: "preview",
    localFactoryTarget: "previewed",
    remoteFactoryTarget: "preview",
    cloudContinuation: null,
    requiredArtifacts: ["artifacts/workspace-doctor.json", "artifacts/preview-report.json"],
  },
  promote: {
    workspaceGate: "promote",
    localFactoryTarget: "promotion_ready",
    remoteFactoryTarget: "validate",
    cloudContinuation: null,
    requiredArtifacts: ["artifacts/workspace-doctor.json", "artifacts/promotion-packet.json"],
  },
  "deploy:plan": {
    workspaceGate: "deploy:plan",
    localFactoryTarget: "deploy_planned",
    remoteFactoryTarget: "plan_deploy",
    cloudContinuation: null,
    requiredArtifacts: ["artifacts/workspace-doctor.json", "artifacts/deploy-plan.json"],
  },
  "publish:plan": {
    workspaceGate: "publish:plan",
    localFactoryTarget: "publish_planned",
    remoteFactoryTarget: "publish_enterprise",
    cloudContinuation: { commandId: "handoff", startStage: "load_data", targetStage: "publish_enterprise" },
    requiredArtifacts: ["artifacts/workspace-doctor.json", "artifacts/publish-plan.json"],
  },
};

export const FACTORY_REPAIR_PIPELINE_VERSION = 1;
export const FACTORY_REPAIR_TARGETS = Object.freeze(Object.keys(STAGE_CONTRACTS));
export const FACTORY_REPAIR_MODES = Object.freeze(["local", "remote"]);

export function normalizePipelineTarget(targetStage = "preview") {
  const normalized = String(targetStage || "preview").trim();
  return STAGE_CONTRACTS[normalized] ? normalized : "preview";
}

export function normalizePipelineMode(mode = "remote") {
  const normalized = String(mode || "remote").trim();
  return FACTORY_REPAIR_MODES.includes(normalized) ? normalized : "remote";
}

export function buildFactoryRepairPipeline({
  cfg = {},
  fleet = { agents: [] },
  ids = [],
  targetStage = "preview",
  repair = true,
  attempts = 3,
  runPreview = false,
  now = new Date().toISOString(),
} = {}) {
  const selected = normalizeIds(ids);
  const target = normalizePipelineTarget(targetStage);
  const contract = STAGE_CONTRACTS[target];
  const mode = normalizePipelineMode(cfg.mode);
  const modeContract = buildModeContract(mode, contract);
  const agents = (fleet.agents || []).filter((agent) => {
    if (!selected.length) return true;
    return selected.includes(agent.id) || selected.includes(agent.workspaceId);
  });
  const roster = agents.map((agent) => classifyAgent(agent, mode));
  const factoryItems = roster.filter((item) => item.factoryAction !== "none");
  const repairItems = roster.filter((item) => item.repairAction === "doctor_repair");
  const remoteObserveItems = roster.filter((item) => item.repairAction === "observe_remote_run");
  const pendingRepairItems = roster.filter((item) => item.repairAction === "after_factory_output");
  const missingWorkspaces = roster.filter((item) => item.workspaceState === "missing");
  const commandBody = buildFactoryCommandBody({ roster, contract, mode, target });

  return {
    kind: "ge.factory_repair.pipeline",
    version: FACTORY_REPAIR_PIPELINE_VERSION,
    createdAt: now,
    mode,
    modeContract,
    intent: "converge_fleet_to_stage",
    target: {
      requested: target,
      workspaceGate: contract.workspaceGate,
      localFactoryTarget: contract.localFactoryTarget,
      remoteFactoryTarget: contract.remoteFactoryTarget,
      effectiveFactoryTarget: modeContract.effectiveFactoryTarget,
      buildBoundary: modeContract.buildBoundary,
      cloudContinuation: modeContract.cloudContinuation,
      requiredArtifacts: contract.requiredArtifacts,
    },
    policy: {
      repair,
      attempts: Number(attempts) || 3,
      runPreview: runPreview === true,
      localBuildBoundary: LOCAL_BUILD_BOUNDARY,
      ownership: {
        factory: "produce missing or explicitly rebuilt workspaces and release artifacts",
        repair: "supervise existing workspace health, deterministic repairs, and resumable convergence",
      },
    },
    summary: {
      selected: roster.length,
      factory: factoryItems.length,
      repair: repairItems.length,
      remoteObserve: remoteObserveItems.length,
      repairAfterFactory: pendingRepairItems.length,
      missingWorkspaces: missingWorkspaces.length,
      existingWorkspaces: roster.length - missingWorkspaces.length,
    },
    phases: [
      {
        id: "preflight",
        owner: "pipeline",
        action: "resolve_selection_and_stage_contract",
        status: roster.length ? "ready" : "empty",
      },
      {
        id: "factory",
        owner: "factory",
        action: factoryItems.length ? "produce_required_workspaces" : "no_factory_work_required",
        command: factoryItems.length ? commandBody : null,
        itemCount: factoryItems.length,
      },
      {
        id: "repair",
        owner: "repair",
        action: repairActionForMode({ mode, repairItems, remoteObserveItems }),
        gate: contract.workspaceGate,
        itemCount: mode === "local" ? repairItems.length : remoteObserveItems.length,
        capability: modeContract.repairCapability,
      },
      {
        id: "handoff",
        owner: modeContract.cloudContinuation ? "factory" : "pipeline",
        action: modeContract.cloudContinuation ? "ship_local_outputs_to_cloud_release" : "none",
        command: modeContract.cloudContinuation,
      },
    ],
    roster,
    disambiguation: [
      "Factory is the producer: it creates or regenerates workspaces and release artifacts.",
      "Repair is the supervisor: it converges existing workspaces through doctor and repair loops.",
      "A pipeline records the division of labor so retries and resumes do not reinterpret intent.",
    ],
  };
}

function classifyAgent(agent, mode) {
  const workspaceId = agent.workspaceId || null;
  const hasWorkspace = Boolean(workspaceId);
  const hasRun = Boolean(agent.runId);
  const factoryAction = hasWorkspace || hasRun ? "none" : mode === "local" ? "build_local" : "build_remote";
  const repairAction = classifyRepairAction({ mode, hasWorkspace, hasRun });
  return {
    agentId: agent.id,
    title: agent.title || agent.id,
    department: agent.department || null,
    status: agent.status || "unknown",
    workspaceId: workspaceId || agent.id,
    workspaceState: hasWorkspace ? "existing" : "missing",
    factoryAction,
    repairAction,
    runId: agent.runId || null,
  };
}

function classifyRepairAction({ mode, hasWorkspace, hasRun }) {
  if (mode === "local") return hasWorkspace ? "doctor_repair" : "after_factory_output";
  if (hasRun) return "observe_remote_run";
  return hasWorkspace ? "remote_workspace_not_locally_repairable" : "after_factory_output";
}

function buildFactoryCommandBody({ roster, contract, mode, target }) {
  const ids = roster.filter((item) => item.factoryAction !== "none").map((item) => item.agentId);
  if (!ids.length) return null;
  if (mode === "local") {
    return {
      commandId: "agents.build.local",
      ids,
      argv: ["agents", "build", "--ids", ids.join(","), "--local", "--target", contract.localFactoryTarget],
    };
  }
  return {
    commandId: "agents.build",
    ids,
    argv: ["agents", "build", "--ids", ids.join(","), "--target", target],
  };
}

function buildModeContract(mode, stageContract) {
  if (mode === "local") {
    return {
      mode,
      factorySurface: "local_harness",
      workspaceSource: ".ge/factory/projects",
      artifactSource: "local_workspace_artifacts",
      repairCapability: "local_doctor_repair",
      effectiveFactoryTarget: stageContract.localFactoryTarget,
      buildBoundary: LOCAL_BUILD_BOUNDARY,
      cloudContinuation: stageContract.cloudContinuation,
      constraints: [
        "Local mode can repair generated workspaces before cloud side effects.",
        "Publishing still requires a cloud handoff through ge handoff agents-cli.",
      ],
    };
  }
  return {
    mode,
    factorySurface: "cloud_factory",
    workspaceSource: "factory run state and GCS artifacts",
    artifactSource: "remote_factory_artifacts",
    repairCapability: "remote_observe_only",
    effectiveFactoryTarget: stageContract.remoteFactoryTarget,
    buildBoundary: null,
    cloudContinuation: null,
    constraints: [
      "Remote mode submits and observes cloud factory work.",
      "Workspace doctor/repair requires a local workspace; use local mode or sync/prebuild before repair.",
    ],
  };
}

function repairActionForMode({ mode, repairItems, remoteObserveItems }) {
  if (mode === "local") {
    return repairItems.length ? "doctor_and_repair_existing_workspaces" : "wait_for_factory_outputs";
  }
  return remoteObserveItems.length ? "observe_remote_factory_runs" : "wait_for_cloud_factory_outputs";
}

function normalizeIds(ids) {
  if (Array.isArray(ids)) return ids.map((id) => String(id).trim()).filter(Boolean);
  return parseList(String(ids || ""));
}
