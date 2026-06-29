import { createDeployPlan, createPublishPlan, createPromotionPacket } from "../lib/api.js";

const DEPLOY_REVIEW_PROMPT = "Review the selected workspace deploy plan artifact. Read artifacts/DEPLOY_PLAN.md and artifacts/deploy-plan.json, summarize the deploy path, data-store packages, risks, missing prerequisites, and the next concrete action. Do not deploy, publish, or call live Google services.";
const PUBLISH_REVIEW_PROMPT = "Review the selected workspace publish plan artifact. Read artifacts/PUBLISH_PLAN.md and artifacts/publish-plan.json, summarize Gemini Enterprise readiness, risks, missing prerequisites, and the next concrete action. Do not deploy, publish, or call live Google services.";

export function createWorkspaceActions({
  state,
  elements,
  nav,
  runCtrl,
  projectPanel,
  transcript,
  load,
  openProject,
} = {}) {
  const reloadWorkspace = () => {
    const projectId = state.selectedProject;
    return load().then(() => {
      if (projectId) openProject(projectId);
    });
  };

  function runPrompt(text) {
    nav.setScreen("workspace");
    runCtrl.run(text).catch((err) => runCtrl.handleRunError(err));
  }

  async function planDeploy({ review = false } = {}) {
    if (!state.selectedProject) return;
    try {
      await createDeployPlan(state.selectedProject);
      await reloadWorkspace();
      if (review) runPrompt(DEPLOY_REVIEW_PROMPT);
      else transcript.addMessage("agent", "Deploy plan created: `artifacts/DEPLOY_PLAN.md` and `artifacts/deploy-plan.json`. No cloud resources were changed.");
    } catch (err) {
      transcript.addMessage("error", `Failed to create deploy plan artifact: ${err.message}`);
    }
  }

  async function planPublish({ review = false } = {}) {
    if (!state.selectedProject) return;
    try {
      await createPublishPlan(state.selectedProject);
      await reloadWorkspace();
      if (review) runPrompt(PUBLISH_REVIEW_PROMPT);
      else transcript.addMessage("agent", "Publish plan created: `artifacts/PUBLISH_PLAN.md` and `artifacts/publish-plan.json`. Nothing was published.");
    } catch (err) {
      transcript.addMessage("error", `Failed to create publish plan artifact: ${err.message}`);
    }
  }

  async function createPromotion() {
    if (!state.selectedProject) return;
    nav.setScreen("workspace");
    try {
      await createPromotionPacket(state.selectedProject);
      await reloadWorkspace();
      transcript.addMessage("agent", "Promotion packet created: `artifacts/PROMOTION_PACKET.md`, `artifacts/promotion-packet.json`, and delivery graph artifacts.");
    } catch (err) {
      transcript.addMessage("error", `Failed to create promotion packet: ${err.message}`);
    }
  }

  function handleDashboardAction(stage, _agent, action = stage) {
    if (action === "deploy:plan") return planDeploy();
    if (action === "publish:plan") return planPublish();
    if (action === "review:deploy-plan") return runPrompt(DEPLOY_REVIEW_PROMPT);
    if (action === "review:publish-plan") return runPrompt(PUBLISH_REVIEW_PROMPT);

    if (stage === "briefed") {
      elements.message.value = "";
      return runPrompt("Create the local-first ADK workspace for this agent using the selected GE skills. Generate deterministic mock data, fixture-backed tools, app/agent.py with root_agent, README, and a smoke test. Do not deploy or require Google auth.");
    }
    if (stage === "generated") {
      elements.message.value = "";
      return runPrompt("Validate the selected workspace with the GE iterative refinement skill. Run the local validation gates, patch the weakest issue, and report capabilities plus next action. Do not deploy.");
    }
    if (stage === "tested") return projectPanel.startPreview();
    if (stage === "serving") {
      const project = projectPanel.activeProject();
      const nextAction = project?.manifest?.nextAction || project?.manifest?.nextActions?.[0] || "deploy:plan";
      return nextAction === "publish:plan" ? planPublish() : planDeploy();
    }
    if (stage === "deployed") return planPublish();
    return null;
  }

  async function tryHandleNaturalCommand(text) {
    const normalized = String(text || "").toLowerCase().replace(/[^\w:/ -]+/g, " ").replace(/\s+/g, " ").trim();
    if (!state.selectedProject) return false;
    if (/^(plan deploy|deploy plan|plan deployment|deployment plan)$/.test(normalized)) {
      await planDeploy({ review: true });
      return true;
    }
    if (/^(plan publish|publish plan|publication plan)$/.test(normalized)) {
      await planPublish({ review: true });
      return true;
    }
    if (/^(promotion packet|promote packet|create promotion packet|share packet)$/.test(normalized)) {
      transcript.addMessage("user", text);
      await createPromotion();
      return true;
    }
    return false;
  }

  return {
    handleDashboardAction,
    tryHandleNaturalCommand,
    planDeploy,
    planPublish,
    createPromotion,
  };
}
