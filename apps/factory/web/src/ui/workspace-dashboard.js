/**
 * Workspace Dashboard — single scrollable adaptive panel replacing the 8-pane rail.
 *
 * Sections appear/collapse based on the agent's pipeline stage.
 * All existing element IDs are preserved as static containers within each section.
 */

import { escapeHtml } from "../lib/dom.js";
import {
  STAGES,
  STAGE_LABELS,
  busyLabelForAction,
  ctaForState,
  dashboardAgent,
  stageAtLeast,
  stageIndex,
} from "./workspace-dashboard-model.js";

/**
 * @param {object}   state      — global app state
 * @param {object}   elements   — element refs from getElements()
 * @param {object}   callbacks  — { onAction(stage, agent), onHydrate() }
 */
export function createWorkspaceDashboard(state, elements, { onAction, onHydrate } = {}) {
  /**
   * Full render — rebuilds the dashboard HTML inside #wsDashboard.
   * Keeps all required element IDs in the DOM.
   */
  function render() {
    const container = document.getElementById("wsDashboard");
    if (!container) return;

    const { project, agent } = dashboardAgent(state);
    const stage = agent?.stage || "briefed";
    const hasAgent = !!agent;

    container.innerHTML = buildDashboardHtml(agent, stage, hasAgent);
    container.dataset.stage = stage;

    // Rebind element refs that were replaced by innerHTML
    rebindElements();

    // Wire CTA
    const ctaBtn = container.querySelector(".dash-cta");
    if (ctaBtn && hasAgent && stage !== "published") {
      ctaBtn.addEventListener("click", () => {
        ctaBtn.disabled = true;
        ctaBtn.dataset.busy = "true";
        ctaBtn.textContent = busyLabelForAction(ctaBtn.dataset.action);
        if (onAction) onAction(stage, agent, ctaBtn.dataset.action || stage);
      });
    }

    // Wire section collapse toggles
    container.querySelectorAll(".dash-section-head").forEach((head) => {
      head.addEventListener("click", () => {
        const section = head.closest(".dash-section");
        if (section) section.classList.toggle("collapsed");
      });
    });
    container.querySelectorAll(".dash-section-action").forEach((button) => {
      button.addEventListener("click", (event) => event.stopPropagation());
    });

    // Wire delete agent button
    const delBtn = container.querySelector(".dash-delete-agent");
    if (delBtn && hasAgent) {
      delBtn.addEventListener("click", async () => {
        if (!confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) return;
        try {
          const { deleteAgent } = await import("../lib/api.js");
          await deleteAgent(state.selectedProject, agent.id);
          state.selectedAgentId = null;
          const agents = state.projectAgents?.[state.selectedProject];
          if (Array.isArray(agents)) {
            const idx = agents.findIndex((a) => a.id === agent.id);
            if (idx >= 0) agents.splice(idx, 1);
          }
          render();
        } catch (e) {
          console.error("Delete agent failed:", e);
        }
      });
    }

    if (onHydrate) {
      onHydrate();
    }
  }

  function buildDashboardHtml(agent, stage, hasAgent) {
    if (!hasAgent) {
      return `
        <div class="dash-empty">
          <div class="dash-empty-icon">&#9670;</div>
          <strong>No agent selected</strong>
          <p>Open a workspace with an active agent or use the Builder to create one.</p>
        </div>
      `;
    }

    const { project } = dashboardAgent(state);
    const manifest = project?.manifest || {};
    const isRootWorkspaceAgent = !agent.dirName && !agent.dir_name;
    const name = agent.name || agent.dir_name || manifest.name || project?.name || "Agent";
    const useCaseTitle = agent.use_case_title || agent.useCaseTitle || agent.brief?.goal || manifest.goal || "";
    const version = Number(agent.current_version || agent.currentVersion || manifest.currentVersion || 0);
    const nextAction = manifest.nextAction || manifest.nextActions?.[0] || (stage === "generated" ? "validate" : "");
    const departmentId = agent.departmentId || agent.department_id || manifest.departmentId || "";
    const mode = manifest.mode || "local_mock";
    const activeIdx = stageIndex(stage);
    const readiness = manifest.readiness || {};
    const cta = ctaForState({ stage, nextAction, readiness });

    const dotsHtml = STAGES.map((s, i) => {
      let cls = "dash-dot";
      if (i < activeIdx) cls += " filled";
      else if (i === activeIdx) cls += " active";
      return `<div class="${cls}" title="${escapeHtml(STAGE_LABELS[s])}"><span class="dash-dot-label">${escapeHtml(STAGE_LABELS[s])}</span></div>`;
    }).join("");

    const ctaDisabled = stage === "published" ? " disabled" : "";
    const ctaHtml = `<button class="dash-cta ${escapeHtml(cta.cls)}" type="button" data-action="${escapeHtml(cta.action)}"${ctaDisabled}>${escapeHtml(cta.label)}</button>`;

    // Pill inside the rail-less header (preserves agentStagePill ID)
    const stagePillHtml = `<span class="pill" id="agentStagePill">${escapeHtml(STAGE_LABELS[stage] || stage)}</span>`;
    const stageCaption = `
      <div class="dash-stage-caption">
        <strong>${escapeHtml(STAGE_LABELS[stage] || stage)}</strong>
        ${nextAction ? `<span>Next: ${escapeHtml(nextAction)}</span>` : ""}
      </div>
    `;
    const agentMetaChips = [
      isRootWorkspaceAgent ? "Root workspace" : "Agent folder",
      departmentId ? String(departmentId).toUpperCase() : "",
      mode ? String(mode).replaceAll("_", " ") : "",
    ].filter(Boolean).map((label) => `<span class="dash-agent-chip">${escapeHtml(label)}</span>`).join("");
    const readinessItems = [
      ["Mock data", readiness.mockData?.status || "missing", readiness.mockData?.tables ? `${readiness.mockData.tables} tables` : ""],
      ["Agent", readiness.agent?.status || "missing", readiness.agent?.entrypoint || ""],
      ["Tests", readiness.tests?.status || "missing", readiness.tests?.lastExitCode === 0 ? "last run passed" : ""],
      ["Preview", readiness.localPreview?.status || "missing", readiness.localPreview?.port ? `:${readiness.localPreview.port}` : ""],
    ];

    // ── SECTION: Header (always visible)
    const headerSection = `
      <div class="dash-header">
        <div class="dash-header-top">
          <div class="dash-header-info">
            <span class="dash-kicker">Active Agent</span>
            <h3 class="dash-agent-name">${escapeHtml(name)}</h3>
            ${useCaseTitle ? `<p class="dash-usecase">${escapeHtml(useCaseTitle)}</p>` : ""}
            ${agentMetaChips ? `<div class="dash-agent-meta-row">${agentMetaChips}</div>` : ""}
          </div>
          <div class="dash-header-meta">
            ${stagePillHtml}
            ${version > 0 ? `<span class="pill">v${version}</span>` : ""}
            ${isRootWorkspaceAgent ? "" : `<button class="dash-delete-agent" type="button" title="Delete this agent">×</button>`}
          </div>
        </div>
        ${stageCaption}
        <div class="dash-stage-bar" id="agentStageDots">${dotsHtml}</div>
        ${ctaHtml}
      </div>
    `;

    // ── SECTION: Overview metrics (always visible, compact)
    const overviewSection = `
      <div class="dash-section" data-dash-section="overview">
        <div class="dash-section-head">
          <span class="dash-section-title">Overview</span>
        </div>
        <div class="dash-section-body">
          <div id="workspaceDetails" class="dash-overview-summary"></div>
          <div class="dash-metric-grid">
            <div class="metric"><span>Kind</span><strong id="workspaceKindMetric">--</strong></div>
            <div class="metric"><span>Files</span><strong id="workspaceFilesMetric">0</strong></div>
            <div class="metric"><span>Updated</span><strong id="workspaceUpdatedMetric">--</strong></div>
          </div>
        </div>
      </div>
    `;

    const capabilities = Array.isArray(manifest.capabilities) && manifest.capabilities.length ? manifest.capabilities : ["workspace"];
    const nextActions = Array.isArray(manifest.nextActions) && manifest.nextActions.length ? manifest.nextActions : ["create"];
    const skills = Array.isArray(manifest.skills) ? manifest.skills : [];
    const capabilitySection = `
      <div class="dash-section" data-dash-section="capabilities">
        <div class="dash-section-head">
          <span class="dash-section-title">Capabilities</span>
          <span class="pill">${escapeHtml(nextActions[0] || "ready")}</span>
        </div>
        <div class="dash-section-body">
          <div class="capability-strip">
            ${capabilities.map((capability) => `<span class="capability-chip">${escapeHtml(capability)}</span>`).join("")}
          </div>
          <div class="readiness-grid">
            ${readinessItems.map(([label, status, detail]) => `
              <div class="readiness-item" data-status="${escapeHtml(status)}">
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(status)}</strong>
                ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
              </div>
            `).join("")}
          </div>
          ${skills.length ? `<div class="skill-strip">
            ${skills.length
              ? skills.slice(0, 5).map((skill) => `<span class="skill-chip">${escapeHtml(skill.id)}<em>${escapeHtml(skill.capability || "")}</em></span>`).join("")
              : ""}
          </div>` : ""}
        </div>
      </div>
    `;

    const graphNodes = [
      ["workspace", "Workspace", "ready"],
      ["data", "Datastores", readiness.mockData?.status === "ready" ? "ready" : "missing"],
      ["agent", "Agent + Tools", readiness.agent?.status === "ready" ? "ready" : "missing"],
      ["tests", "Tests", readiness.tests?.status === "passing" ? "ready" : readiness.tests?.status || "missing"],
      ["preview", "Preview", ["ready", "running"].includes(readiness.localPreview?.status) ? "ready" : readiness.localPreview?.status || "missing"],
      ["deployPlan", "Deploy Plan", readiness.deployPlan?.status || "missing"],
      ["runtime", "Runtime", readiness.deployment?.status || "missing"],
      ["publish", "Publish", readiness.published?.status || readiness.publishPlan?.status || "missing"],
    ];
    const graphSection = `
      <div class="dash-section" data-dash-section="graph">
        <div class="dash-section-head">
          <span class="dash-section-title">Delivery Graph</span>
          <span class="pill">${escapeHtml(readiness.deployment?.status === "ready" ? "deployed" : nextActions[0] || "plan")}</span>
        </div>
        <div class="dash-section-body">
          <div class="delivery-graph" aria-label="Agent delivery graph">
            ${graphNodes.map(([id, label, status], index) => `
              <div class="delivery-node" data-node="${escapeHtml(id)}" data-status="${escapeHtml(status)}">
                <strong>${escapeHtml(label)}</strong>
                <span>${escapeHtml(status)}</span>
              </div>
              ${index < graphNodes.length - 1 ? '<div class="delivery-edge" aria-hidden="true"></div>' : ""}
            `).join("")}
          </div>
          <div class="delivery-graph-note">
            <span>Full graph: artifacts/GRAPH.md</span>
            <span>Packet: artifacts/promotion-packet.json</span>
          </div>
        </div>
      </div>
    `;

    // ── SECTION: Files (from "generated" onward)
    const filesHidden = !stageAtLeast(stage, "generated") ? " hidden-section" : "";
    const filesSection = `
      <div class="dash-section${filesHidden}" data-dash-section="files" data-min-stage="generated">
        <div class="dash-section-head">
          <span class="dash-section-title">Files</span>
          <span class="pill" id="fileCountPill">0</span>
          <button class="btn btn-sm dash-section-action" id="refreshFilesBtn" type="button">&#8635;</button>
        </div>
        <div class="dash-section-body">
          <span class="files-state" id="filesState">Select a workspace</span>
          <div class="file-list" id="projectFiles"></div>
        </div>
      </div>
    `;

    // ── SECTION: File Preview (from "generated" onward)
    const previewHidden = !stageAtLeast(stage, "generated") ? " hidden-section" : "";
    const previewSection = `
      <div class="dash-section${previewHidden} collapsed" data-dash-section="preview" data-min-stage="generated">
        <div class="dash-section-head">
          <span class="dash-section-title">Preview</span>
          <span class="pill" id="filePreviewPill">none</span>
        </div>
        <div class="dash-section-body">
          <div class="file-tab-bar" id="fileTabBar"></div>
          <div class="file-preview-box" id="filePreview"></div>
        </div>
      </div>
    `;

    // ── SECTION: Terminal / Test Results (from "generated" onward)
    const terminalHidden = !stageAtLeast(stage, "generated") ? " hidden-section" : "";
    const terminalSection = `
      <div class="dash-section${terminalHidden}" data-dash-section="terminal" data-min-stage="generated">
        <div class="dash-section-head">
          <span class="dash-section-title">Terminal</span>
          <span class="pill" id="terminalStatePill">idle</span>
        </div>
        <div class="dash-section-body">
          <div class="terminal-actions">
            <button class="btn btn-sm" type="button" data-command-id="uv-sync">uv sync</button>
            <button class="btn btn-sm" type="button" data-command-id="pytest">uv run pytest</button>
            <button class="btn btn-sm" type="button" data-command-id="agents-info">agents-cli info</button>
          </div>
          <div class="terminal-output" id="terminalOutput"></div>
        </div>
      </div>
    `;

    // ── SECTION: ADK Run (from "tested" onward)
    const adkHidden = !stageAtLeast(stage, "tested") ? " hidden-section" : "";
    const adkSection = `
      <div class="dash-section${adkHidden}" data-dash-section="adk" data-min-stage="tested">
        <div class="dash-section-head">
          <span class="dash-section-title">ADK Run</span>
          <span class="pill" id="adkPreviewPill">off</span>
        </div>
        <div class="dash-section-body">
          <div class="adk-preview-card" id="adkPreviewCard">
            <p>Run the generated root_agent locally with adk run --replay.</p>
            <button class="btn primary" type="button" id="startAdkRunBtn">&#9654; Test Agent</button>
          </div>
        </div>
      </div>
    `;

    // ── SECTION: Deploy & Register (from "deployed" onward)
    const regHidden = !stageAtLeast(stage, "deployed") ? " hidden-section" : "";
    const registrationSection = `
      <div class="dash-section${regHidden}" data-dash-section="registration" data-min-stage="deployed">
        <div class="dash-section-head">
          <span class="dash-section-title">Deploy & Register</span>
          <span class="pill" id="registrationStatePill">--</span>
        </div>
        <div class="dash-section-body">
          <div class="registration-card" id="registrationCard">
            <p>Registration info will appear after a successful agent build.</p>
          </div>
        </div>
      </div>
    `;

    // ── SECTION: Brief (always visible, collapsed by default)
    const briefData = agent.brief;
    const hasBrief = briefData && (typeof briefData === "string" ? briefData.trim() : Object.keys(briefData).length > 0);
    const briefContent = hasBrief
      ? `<pre class="dash-brief-text">${escapeHtml(typeof briefData === "string" ? briefData : JSON.stringify(briefData, null, 2))}</pre>`
      : `<span class="agent-brief-empty">No brief available</span>`;
    const briefSection = `
      <div class="dash-section collapsed" data-dash-section="brief">
        <div class="dash-section-head">
          <span class="dash-section-title">Brief</span>
          ${hasBrief ? '<span class="pill">available</span>' : ""}
        </div>
        <div class="dash-section-body">
          <div class="agent-brief-summary" id="agentBriefSummary">
            ${briefContent}
          </div>
        </div>
      </div>
    `;

    // ── SECTION: Version History (always visible, compact)
    const versionsSection = `
      <div class="dash-section" data-dash-section="versions">
        <div class="dash-section-head">
          <span class="dash-section-title">Versions</span>
          <span class="pill" id="versionCountPill">0</span>
          <span class="pill" id="currentVersionPill">none</span>
        </div>
        <div class="dash-section-body">
          <div class="version-timeline" id="versionTimeline">
            <div class="version-empty">No versions yet. Run a brief to create the first version.</div>
          </div>
        </div>
      </div>
    `;

    // ── Hidden container for agentPanel (preserves ID, used by agent-panel-overview.js)
    const agentPanelHidden = `<div class="agent-panel" id="agentPanel" hidden></div>`;

    // ── Hidden container for agentQuickActions (preserves ID)
    const quickActionsHidden = `<div id="agentQuickActions" hidden></div>`;

    return [
      headerSection,
      overviewSection,
      capabilitySection,
      graphSection,
      filesSection,
      previewSection,
      terminalSection,
      adkSection,
      registrationSection,
      briefSection,
      versionsSection,
      agentPanelHidden,
      quickActionsHidden,
    ].join("\n");
  }

  /**
   * After innerHTML rebuild, re-point element refs in `elements` object so
   * downstream code writing to e.g. elements.terminalOutput still works.
   */
  function rebindElements() {
    const ids = [
      ["agentStagePill", "agentStagePill"],
      ["agentStageDots", "agentStageDots"],
      ["agentQuickActions", "agentQuickActions"],
      ["agentBriefSummary", "agentBriefSummary"],
      ["agentPanel", "agentPanel"],
      ["fileCountPill", "fileCountPill"],
      ["projectFilesEl", "projectFiles"],
      ["filesState", "filesState"],
      ["refreshFilesBtn", "refreshFilesBtn"],
      ["fileTabBar", "fileTabBar"],
      ["filePreview", "filePreview"],
      ["filePreviewPill", "filePreviewPill"],
      ["terminalOutput", "terminalOutput"],
      ["terminalStatePill", "terminalStatePill"],
      ["adkPreviewCard", "adkPreviewCard"],
      ["adkPreviewPill", "adkPreviewPill"],
      ["startAdkRunBtn", "startAdkRunBtn"],
      ["registrationCard", "registrationCard"],
      ["registrationStatePill", "registrationStatePill"],
      ["versionTimeline", "versionTimeline"],
      ["versionCountPill", "versionCountPill"],
      ["currentVersionPill", "currentVersionPill"],
      ["workspaceDetails", "workspaceDetails"],
      ["workspaceKindMetric", "workspaceKindMetric"],
      ["workspaceFilesMetric", "workspaceFilesMetric"],
      ["workspaceUpdatedMetric", "workspaceUpdatedMetric"],
    ];
    for (const [key, domId] of ids) {
      const el = document.getElementById(domId);
      if (el) elements[key] = el;
    }
  }

  return { render };
}
