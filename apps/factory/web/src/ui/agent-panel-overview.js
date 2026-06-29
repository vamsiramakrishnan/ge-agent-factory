import { escapeHtml } from "../lib/dom.js";
import { fetchVersions, fetchBrief } from "../lib/api.js";

const STAGES = ["briefed", "generated", "tested", "serving", "deployed", "registered", "published"];

const STAGE_LABELS = {
  briefed:    "Briefed",
  generated:  "Generated",
  tested:     "Tested",
  serving:    "Serving",
  deployed:   "Deployed",
  registered: "Registered",
  published:  "Published",
};

const STAGE_ACTIONS = {
  briefed:    { label: "Generate",  icon: "&#9654;", cls: "primary" },
  generated:  { label: "Test",      icon: "&#9881;", cls: "primary" },
  tested:     { label: "Serve",     icon: "&#9654;", cls: "primary" },
  serving:    { label: "Deploy",    icon: "&#8593;", cls: "primary" },
  deployed:   { label: "Register",  icon: "&#9745;", cls: "" },
  registered: { label: "Publish",   icon: "&#9733;", cls: "primary" },
  published:  null,
};

export function createAgentOverviewPanel(state, elements, { onAction }) {
  // Note: agentPanel is a hidden container in the dashboard; the dashboard
  // renders the visible agent header/stage bar. This panel caches agent data
  // and may be used for future detail views.

  // Dynamic lookups — dashboard may rebuild these DOM nodes
  const getPanel = () => elements.agentPanel;

  let currentAgent = null;
  let briefCache = null;
  let versionCache = [];

  function stageIndex(stage) {
    const idx = STAGES.indexOf(stage);
    return idx >= 0 ? idx : -1;
  }

  // Hidden panel rendering helpers — operate on panel-local elements,
  // NOT on the shared elements object (dashboard manages the visible versions)
  let _panelStageDots = null;
  let _panelQuickActions = null;
  let _panelBriefSummary = null;

  function renderStageDots(stage) {
    if (!_panelStageDots) return;
    const activeIdx = stageIndex(stage);
    _panelStageDots.innerHTML = STAGES.map((s, i) => {
      let cls = "agent-stage-dot";
      if (i < activeIdx) cls += " filled";
      else if (i === activeIdx) cls += " active";
      const label = STAGE_LABELS[s] || s;
      return `<div class="${cls}" title="${escapeHtml(label)}"><span class="agent-stage-dot-label">${escapeHtml(label)}</span></div>`;
    }).join("");
  }

  function renderQuickActions(stage) {
    if (!_panelQuickActions) return;
    const action = STAGE_ACTIONS[stage];
    if (!action) {
      _panelQuickActions.innerHTML = `<span class="agent-actions-done">All stages complete</span>`;
      return;
    }
    const btnCls = `btn ${action.cls}`.trim();
    _panelQuickActions.innerHTML = `
      <button class="${btnCls}" type="button" data-agent-action="${escapeHtml(stage)}">
        ${action.icon} ${escapeHtml(action.label)}
      </button>
    `;
    const btn = _panelQuickActions.querySelector("[data-agent-action]");
    if (btn) {
      btn.addEventListener("click", () => {
        if (onAction) onAction(stage, currentAgent);
      });
    }
  }

  function renderVersionList(versions) {
    const panel = getPanel();
    const container = panel ? panel.querySelector(".agent-version-list") : null;
    if (!container) return;
    if (!versions || versions.length === 0) {
      container.innerHTML = `<span class="agent-version-empty">No versions yet</span>`;
      return;
    }
    const sorted = [...versions].sort((a, b) => b.version - a.version);
    container.innerHTML = sorted.slice(0, 8).map((v) => {
      const time = v.createdAt
        ? new Date(v.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })
        : "";
      const testBadge = v.testStatus === "passed"
        ? `<span class="agent-v-badge passed">passed</span>`
        : v.testStatus === "failed"
        ? `<span class="agent-v-badge failed">failed</span>`
        : "";
      return `<div class="agent-version-row">
        <strong>v${v.version}</strong>
        <span>${escapeHtml(time)}</span>
        ${testBadge}
      </div>`;
    }).join("");
  }

  function renderBriefSummary(brief) {
    // Generate HTML once, apply to both hidden panel and visible dashboard
    let html;
    if (!brief) {
      html = `<span class="agent-brief-empty">No brief available</span>`;
    } else {
      const dept = brief.department?.name || brief.departmentId || "";
      const uc = brief.useCase?.title || brief.useCaseId || "";
      const text = brief.generatedText || "";
      const preview = text.length > 280 ? text.slice(0, 280) + "..." : text;
      html = `
        <details class="agent-brief-details">
          <summary>Brief${dept ? ` — ${escapeHtml(dept)}` : ""}</summary>
          ${uc ? `<div class="agent-brief-uc">${escapeHtml(uc)}</div>` : ""}
          <pre class="agent-brief-text">${escapeHtml(preview)}</pre>
        </details>
      `;
    }
    if (_panelBriefSummary) _panelBriefSummary.innerHTML = html;
    // Also update the dashboard's visible brief section
    const dashBrief = elements.agentBriefSummary;
    if (dashBrief && dashBrief !== _panelBriefSummary) dashBrief.innerHTML = html;
  }

  function updateStagePill(stage) {
    const pill = elements.agentStagePill;
    if (pill) pill.textContent = stage ? STAGE_LABELS[stage] || stage : "--";
  }

  function renderEmpty() {
    updateStagePill(null);
    const panel = getPanel();
    if (panel) panel.innerHTML = `
      <div class="agent-panel-empty">
        <div class="agent-panel-empty-icon">&#9670;</div>
        <strong>No agent selected</strong>
        <p>Open a workspace with an active agent or use the Builder to create one.</p>
      </div>
    `;
  }

  function renderFull(agent) {
    const panel = getPanel();
    if (!panel) return;

    const stage = agent.stage || "briefed";
    const name = agent.name || agent.dir_name || "Agent";
    const useCaseTitle = agent.use_case_title || agent.useCaseTitle || "";
    const version = agent.current_version || agent.currentVersion || 0;

    updateStagePill(stage);
    panel.innerHTML = `
      <div class="agent-panel-header">
        <div class="agent-panel-name">
          <span class="agent-panel-kicker">Active Agent</span>
          <h3>${escapeHtml(name)}</h3>
          ${useCaseTitle ? `<p class="agent-panel-usecase">${escapeHtml(useCaseTitle)}</p>` : ""}
        </div>
        <div class="agent-panel-version-pill">
          <span class="pill">v${version}</span>
        </div>
      </div>

      <div class="agent-stage-section">
        <span class="agent-section-label">Pipeline</span>
        <div class="agent-stage-bar"></div>
      </div>

      <div class="agent-quick-actions"></div>

      <div class="agent-versions-section">
        <span class="agent-section-label">Versions</span>
        <div class="agent-version-list"></div>
      </div>

      <div class="agent-brief-summary"></div>
    `;

    // Use panel-local refs — do NOT overwrite shared elements
    _panelStageDots = panel.querySelector(".agent-stage-bar");
    _panelQuickActions = panel.querySelector(".agent-quick-actions");
    _panelBriefSummary = panel.querySelector(".agent-brief-summary");

    renderStageDots(stage);
    renderQuickActions(stage);
    renderVersionList(versionCache);
    renderBriefSummary(briefCache);
  }

  async function loadAgentData(projectId) {
    if (!projectId) return;
    try {
      const { versions } = await fetchVersions(projectId);
      versionCache = versions || [];
    } catch {
      versionCache = [];
    }
    try {
      const data = await fetchBrief(projectId);
      briefCache = data.brief || data || null;
    } catch {
      briefCache = null;
    }
  }

  async function render() {
    if (!getPanel()) return;

    // Try to find the agent associated with the current project
    const projectId = state.selectedProject;
    const agent = findAgentForProject(projectId);

    if (!agent) {
      currentAgent = null;
      versionCache = [];
      briefCache = null;
      renderEmpty();
      return;
    }

    currentAgent = agent;
    await loadAgentData(projectId);
    renderFull(agent);
  }

  function findAgentForProject(projectId) {
    if (!projectId) return null;
    // Check if we have project agents in state (keyed by projectId)
    const agents = state.projectAgents?.[projectId];
    if (Array.isArray(agents) && agents.length > 0) {
      // If a selected agent is set, find it; otherwise use the first
      if (state.selectedAgentId) {
        const selected = agents.find((a) => a.id === state.selectedAgentId);
        if (selected) return selected;
      }
      return agents[0];
    }
    // Build a synthetic agent from project + state data
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return null;
    const manifest = project.manifest || {};
    const readiness = manifest.readiness || {};
    // Only show as agent if we have agent-like workspace data.
    const isBriefedWorkspace = Boolean(manifest.useCaseId || manifest.goal || project.useCaseId || project.departmentId);
    if (!manifest.agent && readiness.agent?.status !== "ready" && !project.agentName && !isBriefedWorkspace) return null;
    const stage = manifest.agent?.stage
      || manifest.stage
      || (readiness.tests?.status === "passing" ? "tested" : readiness.agent?.status === "ready" ? "generated" : "briefed");
    return {
      id: manifest.agent?.id || `${project.id}:root`,
      name: manifest.agent?.name || project.agentName || project.name,
      stage,
      current_version: manifest.agent?.currentVersion || state.currentVersion || 0,
      use_case_title: manifest.agent?.useCaseTitle || manifest.goal || project.useCaseTitle || "",
      dir_name: project.id,
      synthetic: true,
    };
  }

  function setAgent(agent) {
    currentAgent = agent;
    render();
  }

  return { render, setAgent };
}
