import { shellHtml } from "./templates/shell.js";
import { getElements } from "./elements.js";
import { escapeHtml } from "./lib/dom.js";
import { createState, examples, getWorkspaceScope, rememberProjectAgentSelection, restoreProjectAgentSelection } from "./state.js";
import { fetchBootstrap, fetchProjectFiles, saveBriefApi, createVersionApi, createWorkspace, deleteWorkspace, listAgents, createAgent, updateAgentStage } from "./lib/api.js";
import { saveChatMessage } from "./lib/chat-api.js";
import { createSettingsModal } from "./ui/settings-modal.js";
import { createTranscript } from "./ui/transcript.js";
import { createTimeline } from "./ui/timeline.js";
import { createBuilder } from "./ui/builder.js";
import { createAgentPanel } from "./ui/agents.js";
import { createProjectPanel } from "./ui/projects.js";
import { createGuidance } from "./ui/guidance.js";
import { createExampleChips } from "./ui/examples.js";
import { createRunController } from "./controllers/run.js";
import { createVersionTimeline } from "./ui/versions.js";
import { renderHomeScreen } from "./screens/home.js";
import { createFileTabs } from "./ui/file-tabs.js";
import { createAgentOverviewPanel } from "./ui/agent-panel-overview.js";
import { createNavigation } from "./controllers/navigation.js";
import { createAgentModal } from "./controllers/agent-modal.js";
import { createSessionManager } from "./controllers/session-manager.js";
import { createSlashCommands } from "./controllers/slash-commands.js";
import { createSetupController } from "./controllers/setup.js";
import { createWorkspaceActions } from "./controllers/workspace-actions.js";
import { createWorkspaceDashboard } from "./ui/workspace-dashboard.js";

document.querySelector("#app-root").innerHTML = shellHtml;

const state = createState();
const el = getElements();

/* ── UI components ────────────────────────────────────────── */

const fileTabs = createFileTabs({
  getProjectId: () => state.selectedProject,
  elements: el,
});

const transcript = createTranscript(el);
const timeline = createTimeline(el);
const builder = createBuilder(state, el, { onUpdate: refreshGuidance });

const agentPanel = createAgentPanel(state, el, {
  onUpdate() { refreshGuidance(); },
});

const projectPanel = createProjectPanel(state, el, {
  onUpdate: refreshGuidance,
  onOpen: openProject,
  fileTabs,
});

const guidance = createGuidance(state, el, {
  builder,
  getActiveProject: () => projectPanel.activeProject(),
});

const exampleChips = createExampleChips(el, examples);

const settingsModal = createSettingsModal({
  modal: el.settingsModal,
  closeButton: el.closeSettingsBtn,
});

const versionTl = createVersionTimeline(state, el);

const agentOverview = createAgentOverviewPanel(state, el, {
  onAction(stage, agent, action) {
    workspaceActions.handleDashboardAction(stage, agent, action);
  },
});

/* ── Dashboard (adaptive right panel) ────────────────────── */

const dashboard = createWorkspaceDashboard(state, el, {
  onAction: (...args) => workspaceActions.handleDashboardAction(...args),
  onHydrate() {
    projectPanel.renderProjectFiles(state.projectFiles || []);
  },
});

/* ── Controllers ──────────────────────────────────────────── */

const nav = createNavigation(state, el, { versionTl, agentOverview, dashboard });

const sessionMgr = createSessionManager(state, el, { transcript, examples });

const runCtrl = createRunController(state, el, {
  transcript,
  timeline,
  onUpdate: refreshGuidance,
  onEnd() {
    refreshGuidance();
    settleCompletedRun().catch(() => {
      projectPanel.loadFiles().catch((e) => projectPanel.renderFileError(e));
      agentOverview.render();
      dashboard.render();
    });
  },
});

const workspaceActions = createWorkspaceActions({
  state,
  elements: el,
  nav,
  runCtrl,
  projectPanel,
  transcript,
  load,
  openProject,
});

async function settleCompletedRun() {
  const projectId = state.selectedProject;
  if (!projectId) return;

  const useCase = builder.activeUseCase();
  if (useCase || Object.keys(state.interviewAnswers || {}).length > 0) {
    const brief = builder.buildBrief();
    await saveBriefApi(projectId, {
      departmentId: state.selectedDepartment,
      useCaseId: state.selectedUseCaseId,
      department: builder.activeDepartment(),
      useCase,
      interviewAnswers: state.interviewAnswers,
      generatedText: brief,
    }).then(() => createVersionApi(projectId, { generatedText: brief }))
      .catch(() => {});
  }

  await advanceAgentStage();
  projectPanel.renderProjectFiles(state.projectFiles || []);
  versionTl.render().catch(() => {});
}

transcript.onMessage((msg) => {
  const projectId = state.selectedProject;
  const agentId = state.selectedAgentId || null;
  if (!projectId) return;
  sessionMgr.ensureSession(projectId, agentId)
    .then((sessionId) => {
      if (sessionId) return saveChatMessage(projectId, sessionId, msg);
      return null;
    })
    .catch(() => {});
});

/* ── Agent modal (created after runCtrl so load/openProject are defined) ── */

const agentModal = createAgentModal(state, el, {
  projectPanel,
  transcript,
  load,
  openProject,
});

/* ── Internal helpers ─────────────────────────────────────── */

function refreshGuidance() {
  guidance.render();
  guidance.renderNextActions();
}

function persistSelection() {
  if (state.selectedProject) localStorage.setItem("ge:selected-project", state.selectedProject);
  else localStorage.removeItem("ge:selected-project");
  if (state.selectedProject) {
    localStorage.setItem(`ge:selected-agent:${state.selectedProject}`, state.selectedAgentId || "");
  }
}

function restoreSelection() {
  const projectId = localStorage.getItem("ge:selected-project");
  if (projectId && state.projects.some((p) => p.id === projectId && !projectPanel.isHarnessTest(p))) {
    state.selectedProject = projectId;
  }
  if (state.selectedProject) {
    const agentId = localStorage.getItem(`ge:selected-agent:${state.selectedProject}`);
    if (agentId !== null) rememberProjectAgentSelection(state, state.selectedProject, agentId || null);
  }
}

async function advanceAgentStage() {
  if (!state.selectedProject) return;
  const projectId = state.selectedProject;

  const [bootstrap, agentsData, filesData] = await Promise.all([
    fetchBootstrap().catch(() => null),
    listAgents(projectId).catch(() => null),
    fetchProjectFiles(projectId).catch(() => null),
  ]);
  if (bootstrap) {
    state.agents = Array.isArray(bootstrap.agents?.agents) ? bootstrap.agents.agents : state.agents;
    state.projects = Array.isArray(bootstrap.workspaces?.workspaces) ? bootstrap.workspaces.workspaces : state.projects;
    state.departments = Array.isArray(bootstrap.departments?.departments) ? bootstrap.departments.departments : state.departments;
    state.runtimeCapabilities = bootstrap.capabilities || state.runtimeCapabilities;
    state.skillRegistry = bootstrap.skills || state.skillRegistry;
  }
  if (agentsData?.agents) {
    state.projectAgents[projectId] = agentsData.agents;
    if (!state.selectedAgentId && agentsData.agents.length > 0) {
      const rootAgent = agentsData.agents.find((a) => !a.dirName && !a.dir_name);
      const chosen = rootAgent || agentsData.agents[0];
      state.selectedAgentId = chosen.id;
      rememberProjectAgentSelection(state, projectId, chosen.id);
      persistSelection();
      sessionMgr.applyScopeToLegacyState(getWorkspaceScope(state, projectId, chosen.id));
      runCtrl.applyRunScope(getWorkspaceScope(state, projectId, chosen.id));
    }
  }
  if (filesData?.files) {
    state.projectFilesByProject[projectId] = filesData.files;
    if (state.selectedProject === projectId) state.projectFiles = filesData.files;
  }

  const agents = state.projectAgents[projectId] || [];
  const agent = agents.find((a) => a.id === state.selectedAgentId);
  if (!agent) return;
  const project = state.projects.find((p) => p.id === projectId);
  const readiness = project?.manifest?.readiness || {};
  const files = state.projectFiles || [];

  const stage = agent.stage || "briefed";
  let nextStage = null;

  if (stage === "briefed") {
    const hasGenerated = files.some((f) => {
      const p = String(f.path || f.name || "");
      return !p.startsWith("runs/") && p !== "workspace.json";
    });
    if (hasGenerated) nextStage = "generated";
  } else if (stage === "generated") {
    const hasValidationArtifact = files.some((f) => String(f.path || f.name || "") === "artifacts/validation-report.json");
    if (readiness.tests?.status === "passing" || hasValidationArtifact) nextStage = "tested";
  }

  if (!nextStage) {
    agentOverview.render();
    dashboard.render();
    renderAgentSwitcher();
    return;
  }

  try {
    await updateAgentStage(state.selectedProject, state.selectedAgentId, nextStage);
    agent.stage = nextStage;
    agentOverview.render();
    dashboard.render();
    renderAgentSwitcher();
  } catch {
    // best effort
  }
}

function renderAgentSwitcher() {
  const projectId = state.selectedProject;
  const agents = projectId ? (state.projectAgents[projectId] || []) : [];

  if (agents.length === 0) {
    el.agentSwitcher.hidden = true;
    return;
  }

  el.agentSwitcher.hidden = false;
  const current = agents.find((a) => a.id === state.selectedAgentId) || agents[0];
  el.agentSwitcherName.textContent = current.name || current.dir_name || "Agent";
  el.agentSwitcherStage.textContent = current.stage || "briefed";

  el.agentSwitcherList.innerHTML = "";
  for (const agent of agents) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `agent-switcher-item${agent.id === state.selectedAgentId ? " active" : ""}`;
    item.innerHTML = `<span class="agent-switcher-item-name">${escapeHtml(agent.name || agent.dir_name || "Agent")}</span><span class="pill">${escapeHtml(agent.stage || "briefed")}</span>`;
    item.addEventListener("click", () => {
      state.selectedAgentId = agent.id;
      rememberProjectAgentSelection(state, projectId, agent.id);
      persistSelection();
      sessionMgr.applyScopeToLegacyState(getWorkspaceScope(state));
      runCtrl.applyRunScope(getWorkspaceScope(state));
      if (agent.departmentId) state.selectedDepartment = agent.departmentId;
      if (agent.useCaseId) state.selectedUseCaseId = agent.useCaseId;
      renderAgentSwitcher();
      agentOverview.render();
      dashboard.render();
      el.agentSwitcherDropdown.hidden = true;
      sessionMgr.loadChatSession(projectId, agent.id).catch(() => {});
    });
    el.agentSwitcherList.appendChild(item);
  }
}

function projectHasWorkspaceAgent(project) {
  const manifest = project?.manifest || {};
  const readiness = manifest.readiness || {};
  const isBriefedWorkspace = Boolean(manifest.useCaseId || manifest.goal || project?.useCaseId || project?.departmentId);
  return Boolean(manifest.agent || readiness.agent?.status === "ready" || project?.agentName || isBriefedWorkspace);
}

async function deleteProject(projectId, projectName) {
  const confirmed = window.confirm(`Delete workspace "${projectName || projectId}"?\n\nThis will permanently remove all files, agents, conversations, and database entries. This cannot be undone.`);
  if (!confirmed) return;
  try {
    await deleteWorkspace(projectId);
    // If the deleted project was the active one, clear selection
    if (state.selectedProject === projectId) {
      state.selectedProject = null;
      state.selectedAgentId = null;
      localStorage.removeItem("ge:selected-project");
      localStorage.removeItem(`ge:selected-agent:${projectId}`);
      nav.setScreen("home");
    }
    delete state.projectAgents[projectId];
    await load();
  } catch (err) {
    transcript.addMessage("error", `Failed to delete workspace: ${err.message}`);
  }
}

function renderHome() {
  renderHomeScreen({
    elements: el,
    departments: state.departments,
    agents: state.agents,
    systemCount: el.systemCount.textContent,
    projects: state.projects,
    visibleProjects: () => projectPanel.visibleProjects(),
    activeDepartment: () => builder.activeDepartment(),
    activeUseCase: () => builder.activeUseCase(),
    departmentUseCases: () => builder.departmentUseCases(),
    runtimeCapabilities: state.runtimeCapabilities,
    skillRegistry: state.skillRegistry,
    openProject,
    deleteProject,
    projectAgents: state.projectAgents || {},
    selectUseCase(useCaseId, fallbackProjectId) {
      state.selectedUseCaseId = useCaseId;
      builder.render();
      if (state.selectedProject || fallbackProjectId) {
        openProject(state.selectedProject || fallbackProjectId);
      }
    },
  });
}

function openProject(projectId = state.selectedProject, preferredAgentId = undefined) {
  const project = state.projects.find((p) => p.id === projectId);
  if (project && projectPanel.isHarnessTest(project)) return;
  if (projectId) state.selectedProject = projectId;
  state.projectFiles = state.projectFilesByProject?.[projectId] || [];
  el.runTitle.textContent = project?.name || "Workspace";
  el.workspaceText.textContent = project?.path || projectId || "";
  projectPanel.renderProjects();
  refreshGuidance();
  renderHome();
  projectPanel.loadFiles().catch((e) => projectPanel.renderFileError(e));
  versionTl.render().catch(() => {});

  const agents = state.projectAgents[projectId] || [];

  if (agents.length > 0) {
    const rememberedAgentId = preferredAgentId !== undefined ? preferredAgentId : restoreProjectAgentSelection(state, projectId);
    const selected = agents.find((agent) => agent.id === rememberedAgentId)
      || agents.find((agent) => agent.id === state.selectedAgentId);
    const chosen = selected || agents.find((agent) => agent.dirName || agent.dir_name) || agents[0];
    state.selectedAgentId = chosen.id;
    rememberProjectAgentSelection(state, projectId, chosen.id);
    persistSelection();
    sessionMgr.applyScopeToLegacyState(getWorkspaceScope(state, projectId, chosen.id));
    runCtrl.applyRunScope(getWorkspaceScope(state, projectId, chosen.id));
    if (chosen.departmentId) state.selectedDepartment = chosen.departmentId;
    if (chosen.useCaseId) state.selectedUseCaseId = chosen.useCaseId;
    agentOverview.render();
    dashboard.render();
    renderAgentSwitcher();
    sessionMgr.loadChatSession(projectId, chosen.id).then(() => {
      nav.setScreen("workspace");
      projectPanel.renderProjectFiles(state.projectFiles);
    }).catch(() => {
      nav.setScreen("workspace");
      projectPanel.renderProjectFiles(state.projectFiles);
    });
  } else if (projectHasWorkspaceAgent(project)) {
    state.selectedAgentId = null;
    rememberProjectAgentSelection(state, projectId, null);
    persistSelection();
    sessionMgr.applyScopeToLegacyState(getWorkspaceScope(state, projectId, null));
    runCtrl.applyRunScope(getWorkspaceScope(state, projectId, null));
    if (project?.departmentId) state.selectedDepartment = project.departmentId;
    if (project?.useCaseId) state.selectedUseCaseId = project.useCaseId;
    agentOverview.render();
    dashboard.render();
    renderAgentSwitcher();
    sessionMgr.loadChatSession(projectId, null).then(() => {
      nav.setScreen("workspace");
      projectPanel.renderProjectFiles(state.projectFiles);
    }).catch(() => {
      nav.setScreen("workspace");
      projectPanel.renderProjectFiles(state.projectFiles);
    });
  } else {
    state.selectedAgentId = null;
    rememberProjectAgentSelection(state, projectId, null);
    persistSelection();
    sessionMgr.applyScopeToLegacyState(getWorkspaceScope(state, projectId, null));
    runCtrl.applyRunScope(getWorkspaceScope(state, projectId, null));
    agentOverview.render();
    dashboard.render();
    renderAgentSwitcher();
    sessionMgr.loadChatSession(projectId, null).then(() => {
      const hasMessages = transcript.getMessages().length > 0;
      if (hasMessages) {
        nav.setScreen("workspace");
        projectPanel.renderProjectFiles(state.projectFiles);
      } else {
        nav.setScreen("builder");
      }
    }).catch(() => {
      nav.setScreen("builder");
    });
  }
}

function renderAll() {
  builder.renderDepartments();
  builder.render();
  agentPanel.renderAgents();
  projectPanel.renderProjects();
  agentPanel.updateModels();
  refreshGuidance();
  renderHome();
  exampleChips.render();
}

async function loadAllProjectAgents() {
  const visible = projectPanel.visibleProjects();
  const results = await Promise.allSettled(
    visible.map((p) => listAgents(p.id).then((data) => ({ id: p.id, agents: data.agents || [] })))
  );
  const map = {};
  for (const r of results) {
    if (r.status === "fulfilled") map[r.value.id] = r.value.agents;
  }
  state.projectAgents = map;
}

async function load() {
  runCtrl.setDaemon(false, "checking");
  const bootstrap = await fetchBootstrap();

  state.agents = Array.isArray(bootstrap.agents?.agents) ? bootstrap.agents.agents : [];
  state.projects = Array.isArray(bootstrap.workspaces?.workspaces) ? bootstrap.workspaces.workspaces : [];
  state.departments = Array.isArray(bootstrap.departments?.departments) ? bootstrap.departments.departments : [];
  state.interviewQuestions = Array.isArray(bootstrap.departments?.interviewQuestions) ? bootstrap.departments.interviewQuestions : [];
  state.runtimeCapabilities = bootstrap.capabilities || null;
  state.skillRegistry = bootstrap.skills || null;

  if (state.selectedProject && projectPanel.isHarnessTest(state.projects.find((p) => p.id === state.selectedProject))) {
    state.selectedProject = null;
  }
  if (!state.departments.some((d) => d.id === state.selectedDepartment)) {
    state.selectedDepartment = state.departments[0]?.id || "hr";
  }
  if (!state.agents.some((a) => a.id === state.selectedAgent)) {
    state.selectedAgent = state.agents[0]?.id || "gemini";
  }

  restoreSelection();

  agentPanel.setCounts(state.agents.length, (bootstrap.systems?.systems || []).length);
  el.selectedAgentPill.textContent = state.selectedAgent;
  agentPanel.renderSystems(Array.isArray(bootstrap.systems?.systems) ? bootstrap.systems.systems : []);

  await loadAllProjectAgents();

  renderAll();
  await projectPanel.loadFiles().catch((e) => projectPanel.renderFileError(e));
  if (state.selectedProject) {
    openProject(state.selectedProject);
  }
  runCtrl.setDaemon(true, "online");
  setupCtrl.loadStatus().catch(() => {});
}

/* ── Setup controller ────────────────────────────────────── */

const setupCtrl = createSetupController(el);
setupCtrl.bind();

/* ── Initial screen ───────────────────────────────────────── */

nav.setScreen("home");

/* ── Event wiring ─────────────────────────────────────────── */

const slashCmds = createSlashCommands({
  transcript,
  runAgent: (cmd) => {
    nav.setScreen("workspace");
    runCtrl.run(cmd).catch((err) => runCtrl.handleRunError(err));
  },
  state,
});

el.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = el.message.value.trim();
  if (!text) return;
  el.message.value = "";
  if (slashCmds.tryHandle(text)) return;
  if (await workspaceActions.tryHandleNaturalCommand(text)) return;
  nav.setScreen("workspace");
  runCtrl.run(text).catch((err) => runCtrl.handleRunError(err));
});

el.message.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    el.form.requestSubmit();
  }
});

el.modelSelect.addEventListener("change", () => {
  state.selectedModel = el.modelSelect.value;
  refreshGuidance();
});

el.backHomeBtn.addEventListener("click", () => {
  nav.setScreen("home");
  renderHome();
});

document.querySelector(".app-mark")?.addEventListener("click", () => {
  nav.setScreen("home");
  renderHome();
});

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.nav;
    if (target === "builder" || target === "workspace") {
      nav.setScreen(target);
    }
  });
});

/* Workspace rail buttons removed — dashboard sections are inline and scrollable. */

/* ── Split-pane resizer drag logic ───────────────────────── */
{
  const resizer = document.getElementById("wsResizer");
  const wsRight = resizer?.nextElementSibling;
  if (resizer && wsRight) {
    let dragging = false;
    let startX = 0;
    let startW = 0;

    function onPointerDown(e) {
      dragging = true;
      startX = e.clientX;
      startW = wsRight.getBoundingClientRect().width;
      resizer.classList.add("dragging");
      document.body.classList.add("ws-dragging");
      resizer.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = startX - e.clientX;
      const minW = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--ws-right-min")) || 340;
      const maxW = window.innerWidth * 0.65;
      const newW = Math.min(maxW, Math.max(minW, startW + dx));
      document.documentElement.style.setProperty("--ws-right-w", newW + "px");
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      resizer.classList.remove("dragging");
      document.body.classList.remove("ws-dragging");
    }

    resizer.addEventListener("pointerdown", onPointerDown);
    resizer.addEventListener("pointermove", onPointerMove);
    resizer.addEventListener("pointerup", onPointerUp);
    resizer.addEventListener("pointercancel", onPointerUp);
  }
}

settingsModal.bind(el.settingsBtn, el.sidebarSettingsBtn);

el.homeCreateBtn.addEventListener("click", () => agentModal.open());

el.homeResumeBtn.addEventListener("click", () => {
  const latest = projectPanel.visibleProjects()[0];
  if (latest) openProject(latest.id);
});

el.copyBriefBtn.addEventListener("click", () => {
  el.message.value = builder.buildBrief();
  nav.setScreen("workspace");
  el.message.focus();
});

el.runBriefBtn.addEventListener("click", () => {
  const text = builder.buildBrief();
  el.message.value = "";
  nav.setScreen("workspace");
  runCtrl.run(text).catch((err) => runCtrl.handleRunError(err));
});

el.cancelBtn.addEventListener("click", () => runCtrl.cancel());

el.createProjectBtn.addEventListener("click", () => {
  projectPanel
    .createFromUi()
    .then((project) => load().then(() => openProject(project.id)))
    .catch((err) => transcript.addMessage("error", err.message));
});

document.getElementById("projectName")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    projectPanel
      .createFromUi()
      .then((project) => load().then(() => openProject(project.id)))
      .catch((err) => transcript.addMessage("error", err.message));
  }
});

el.clearBtn.addEventListener("click", () => runCtrl.resetUi());
el.newChatBtn?.addEventListener("click", () => sessionMgr.newChatSession());
document.getElementById("chatHistoryBtn")?.addEventListener("click", () => sessionMgr.toggleHistoryDropdown());
document.getElementById("newChatBtn2")?.addEventListener("click", () => { sessionMgr.newChatSession(); el.chatHistoryList.hidden = true; });
document.addEventListener("click", (e) => {
  if (!el.chatHistoryList.hidden && !el.chatHistoryList.contains(e.target) && e.target.id !== "chatHistoryBtn") {
    el.chatHistoryList.hidden = true;
  }
});

el.refreshBtn.addEventListener("click", () => {
  load().catch((err) => {
    runCtrl.setDaemon(false, "offline");
    transcript.addMessage("error", err.message);
  });
});

/* Delegated click for refreshFilesBtn — survives dashboard re-renders */
document.addEventListener("click", (e) => {
  if (e.target.id === "refreshFilesBtn" || e.target.closest("#refreshFilesBtn")) {
    projectPanel.loadFiles().catch((err) => projectPanel.renderFileError(err));
  }
});

/* ── Agent modal events ───────────────────────────────────── */
agentModal.bind();

/* ── Agent switcher toggle ────────────────────────────────── */
document.getElementById("agentSwitcherBtn")?.addEventListener("click", () => {
  el.agentSwitcherDropdown.hidden = !el.agentSwitcherDropdown.hidden;
});
document.addEventListener("click", (e) => {
  if (!el.agentSwitcherDropdown.hidden && !el.agentSwitcher.contains(e.target)) {
    el.agentSwitcherDropdown.hidden = true;
  }
});

/* ── Boot ─────────────────────────────────────────────────── */

load().catch((err) => {
  runCtrl.setDaemon(false, "offline");
  projectPanel.renderProjectFiles([]);
  guidance.renderNextActions();
  transcript.addMessage("error", err.message);
});
