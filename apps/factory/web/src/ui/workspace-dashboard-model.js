export const STAGES = ["briefed", "generated", "tested", "serving", "deployed", "registered", "published"];

export const STAGE_LABELS = {
  briefed: "Briefed",
  generated: "Generated",
  tested: "Tested",
  serving: "Serving",
  deployed: "Deployed",
  registered: "Registered",
  published: "Published",
};

const CTA_CONFIG = {
  briefed: { label: "Generate Agent", cls: "dash-cta--generate" },
  generated: { label: "Run Tests", cls: "dash-cta--test" },
  tested: { label: "Start Preview", cls: "dash-cta--preview" },
  serving: { label: "Plan Deploy", cls: "dash-cta--deploy" },
  deployed: { label: "Plan Publish", cls: "dash-cta--register" },
  registered: { label: "Publish", cls: "dash-cta--publish" },
  published: { label: "Published", cls: "dash-cta--done" },
};

export function stageIndex(stage) {
  const idx = STAGES.indexOf(stage);
  return idx >= 0 ? idx : 0;
}

export function stageAtLeast(agentStage, minStage) {
  return stageIndex(agentStage) >= stageIndex(minStage);
}

export function currentProject(state) {
  return state.projects?.find((project) => project.id === state.selectedProject) || null;
}

export function currentAgent(state) {
  const projectId = state.selectedProject;
  if (!projectId) return null;
  const agents = state.projectAgents?.[projectId];
  if (!Array.isArray(agents) || agents.length === 0) return null;
  if (state.selectedAgentId) {
    const found = agents.find((agent) => agent.id === state.selectedAgentId);
    if (found) return found;
  }
  return agents.find((agent) => agent.dirName || agent.dir_name) || agents[0];
}

export function syntheticWorkspaceAgent(project) {
  if (!project) return null;
  const manifest = project.manifest || {};
  const readiness = manifest.readiness || {};
  const isBriefedWorkspace = Boolean(manifest.useCaseId || manifest.goal || project.useCaseId || project.departmentId);
  const hasAgent = readiness.agent?.status === "ready" || manifest.agent || project.agentName || isBriefedWorkspace;
  if (!hasAgent) return null;
  const stage = manifest.agent?.stage
    || manifest.stage
    || (readiness.tests?.status === "passing" ? "tested" : readiness.agent?.status === "ready" ? "generated" : "briefed");
  return {
    id: manifest.agent?.id || `${project.id}:root`,
    name: manifest.agent?.name || manifest.name || project.name || project.id,
    stage,
    current_version: manifest.currentVersion || 0,
    use_case_title: manifest.goal || project.useCaseTitle || "",
    departmentId: manifest.departmentId || project.departmentId || "",
    useCaseId: manifest.useCaseId || project.useCaseId || "",
    dirName: "",
    dir_name: "",
    synthetic: true,
  };
}

export function dashboardAgent(state) {
  const project = currentProject(state);
  return {
    project,
    agent: currentAgent(state) || syntheticWorkspaceAgent(project),
  };
}

export function ctaForState({ stage, nextAction, readiness = {} }) {
  if (nextAction === "deploy:plan") return { label: "Plan Deploy", cls: "dash-cta--deploy", action: "deploy:plan" };
  if (nextAction === "publish:plan") return { label: "Plan Publish", cls: "dash-cta--register", action: "publish:plan" };
  if (readiness.deployment?.status !== "ready" && readiness.deployPlan?.status === "ready") {
    return { label: "Review Deploy Plan", cls: "dash-cta--deploy", action: "review:deploy-plan" };
  }
  if (readiness.published?.status !== "ready" && readiness.publishPlan?.status === "ready" && readiness.deployment?.status === "ready") {
    return { label: "Review Publish Plan", cls: "dash-cta--register", action: "review:publish-plan" };
  }
  return { ...(CTA_CONFIG[stage] || CTA_CONFIG.briefed), action: stage };
}

export function busyLabelForAction(action) {
  if (action === "deploy:plan") return "Planning Deploy...";
  if (action === "publish:plan") return "Planning Publish...";
  if (action === "review:deploy-plan") return "Reviewing Plan...";
  if (action === "review:publish-plan") return "Reviewing Publish...";
  return "Working...";
}
