import { escapeHtml, formatBytes, formatTime, formatProjectTime } from "../lib/dom.js";
import {
  createWorkspace,
  createPromotionPacket,
  fetchProjectFile,
  fetchProjectFiles as fetchProjectFilesApi,
  fetchRegistrationStatus,
  runAdkAgent,
  runProjectCommand,
} from "../lib/api.js";

export function createProjectPanel(state, elements, { onUpdate, onOpen, fileTabs }) {
  // Static elements (outside dashboard, never rebuilt)
  const {
    projectsEl,
    selectedProjectPill,
    workspaceText,
    projectName,
    createProjectBtn,
  } = elements;

  function activeProject() {
    return state.projects.find((p) => p.id === state.selectedProject) || null;
  }

  function isHarnessTest(project) {
    const id = String(project?.id || "");
    const name = String(project?.name || "");
    return /^(agent-dir|control-plane|harness-plan|root-agent|snapshot-restore|stage-persist|validation|wakeup|run-events|smoke-workspace)-/.test(id)
      || /^(Agent Dir|Control Plane|Harness Plan|Root Agent|Snapshot Restore|Stage Persist|Validation|Wakeup|Run Events|Smoke Workspace)\b/.test(name);
  }

  function visibleProjects() {
    return state.projects.filter((p) => !isHarnessTest(p));
  }

  function countByPrefix(files, prefix) {
    return files.filter((f) => String(f.path || f.name || "").startsWith(prefix)).length;
  }

  function resetWorkspaceTools() {
    if (fileTabs) fileTabs.reset();
    if (elements.filePreviewPill) elements.filePreviewPill.textContent = "No file";
    if (elements.filePreview) elements.filePreview.innerHTML = `<strong>Select a file</strong><span>Text files open here without leaving the harness.</span>`;
    if (elements.adkPreviewPill) elements.adkPreviewPill.textContent = "stopped";
    if (elements.adkPreviewCard) elements.adkPreviewCard.innerHTML = `
      <strong>Local ADK run</strong>
      <span>Run the generated agent with <code>uv run adk run --replay</code>.</span>
      <button class="btn primary" type="button" id="startAdkRunBtn">Test Agent</button>
    `;
    if (elements.terminalStatePill) elements.terminalStatePill.textContent = "ready";
    if (elements.terminalOutput) elements.terminalOutput.textContent = "Run a workspace command to see output.";
    if (elements.registrationStatePill) elements.registrationStatePill.textContent = "checking";
    if (elements.registrationCard) elements.registrationCard.innerHTML = "";
    bindAdkPreviewButton();
  }

  async function openFile(path) {
    if (!state.selectedProject) return;
    // Delegate to file tabs controller when available
    if (fileTabs) {
      fileTabs.openFile(path);
      return;
    }
    const previewSection = document.querySelector('[data-dash-section="preview"]');
    if (previewSection) { previewSection.classList.remove("collapsed"); previewSection.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    const projectId = state.selectedProject;
    if (elements.filePreviewPill) elements.filePreviewPill.textContent = "loading";
    if (elements.filePreview) elements.filePreview.innerHTML = `<strong>${escapeHtml(path)}</strong><span>Loading preview...</span>`;
    try {
      const { file } = await fetchProjectFile(projectId, path);
      if (state.selectedProject !== projectId) return;
      if (elements.filePreviewPill) elements.filePreviewPill.textContent = formatBytes(file.size);
      if (elements.filePreview) elements.filePreview.innerHTML = `
        <div class="file-preview-head">
          <strong>${escapeHtml(file.path)}</strong>
          <span>${formatBytes(file.size)} · ${formatTime(file.mtime)}</span>
        </div>
        <pre>${escapeHtml(file.content)}</pre>
      `;
    } catch (error) {
      if (state.selectedProject !== projectId) return;
      if (elements.filePreviewPill) elements.filePreviewPill.textContent = "blocked";
      if (elements.filePreview) elements.filePreview.innerHTML = `<strong>${escapeHtml(path)}</strong><span>${escapeHtml(error.message || error)}</span>`;
    }
  }

  async function runTerminal(commandId) {
    if (!state.selectedProject) return;
    const projectId = state.selectedProject;
    const termSection = document.querySelector('[data-dash-section="terminal"]');
    if (termSection) { termSection.classList.remove("collapsed"); termSection.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    if (elements.terminalStatePill) elements.terminalStatePill.textContent = "running";
    if (elements.terminalOutput) elements.terminalOutput.textContent = "Running command...";
    try {
      const { result } = await runProjectCommand(projectId, commandId);
      if (state.selectedProject !== projectId) return;
      if (elements.terminalStatePill) elements.terminalStatePill.textContent = result.code === 0 ? "passed" : "failed";
      if (elements.terminalOutput) elements.terminalOutput.textContent = [
        `$ ${result.label}`,
        result.timedOut ? "[timed out]" : `[exit ${result.code}]`,
        "",
        result.stdout || "",
        result.stderr ? `\n[stderr]\n${result.stderr}` : "",
      ].join("\n").trim();
    } catch (error) {
      if (state.selectedProject !== projectId) return;
      if (elements.terminalStatePill) elements.terminalStatePill.textContent = "failed";
      if (elements.terminalOutput) elements.terminalOutput.textContent = error.message || String(error);
    }
  }

  async function startPreview() {
    if (!state.selectedProject) return;
    const projectId = state.selectedProject;
    const adkSection = document.querySelector('[data-dash-section="adk"]');
    if (adkSection) { adkSection.classList.remove("collapsed"); adkSection.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    if (elements.adkPreviewPill) elements.adkPreviewPill.textContent = "starting";
    if (elements.adkPreviewCard) elements.adkPreviewCard.innerHTML = `<strong>Running ADK agent</strong><span>Launching uv run adk run --replay from this workspace...</span>`;
    try {
      const { result } = await runAdkAgent(projectId, "hello");
      if (state.selectedProject !== projectId) return;
      renderAdkPreview(result);
      if (result.ok) {
        await loadFiles();
      }
    } catch (error) {
      if (state.selectedProject !== projectId) return;
      if (elements.adkPreviewPill) elements.adkPreviewPill.textContent = "failed";
      if (elements.adkPreviewCard) elements.adkPreviewCard.innerHTML = `<strong>ADK run failed</strong><span>${escapeHtml(error.message || error)}</span>`;
      bindAdkPreviewButton();
    }
  }

  function renderAdkPreview(result) {
    if (!result) {
      if (elements.adkPreviewPill) elements.adkPreviewPill.textContent = "stopped";
      if (elements.adkPreviewCard) elements.adkPreviewCard.innerHTML = `
        <strong>Local ADK run</strong>
        <span>Run the generated agent with <code>uv run adk run --replay</code>.</span>
        <button class="btn primary" type="button" id="startAdkRunBtn">Test Agent</button>
      `;
      bindAdkPreviewButton();
      return;
    }
    if (elements.adkPreviewPill) elements.adkPreviewPill.textContent = result.ok ? "passed" : "failed";
    if (elements.adkPreviewCard) elements.adkPreviewCard.innerHTML = `
      <div class="adk-status-bar">
        <strong>ADK run ${result.ok ? "passed" : "failed"}</strong>
        <span>exit ${escapeHtml(String(result.code ?? "?"))} · agent ${escapeHtml(result.rootAgentPath || "app")} · prompt "${escapeHtml(result.prompt || "hello")}"</span>
        <button class="btn btn-sm" type="button" id="startAdkRunBtn">Run Again</button>
      </div>
      <div class="adk-run-result">
        <strong>Agent response</strong>
        <p>${escapeHtml(result.response || "No response captured.")}</p>
      </div>
      ${result.promotionPacket ? `
        <div class="adk-run-result">
          <strong>Promotion packet ready</strong>
          <p>${escapeHtml((result.promotionPacket.paths || []).join(" · "))}</p>
          <button class="btn btn-sm" type="button" id="createPromotionPacketBtn">Regenerate Packet</button>
        </div>
      ` : result.ok ? `
        <button class="btn btn-sm" type="button" id="createPromotionPacketBtn">Create Promotion Packet</button>
      ` : ""}
      <details class="adk-logs"><summary>Command output</summary><pre>${escapeHtml([result.stdout || "", result.stderr ? `\n[stderr]\n${result.stderr}` : ""].join("").trim() || "...")}</pre></details>
    `;
    bindAdkPreviewButton();
    bindPromotionPacketButton();
  }

  function bindAdkPreviewButton() {
    // ADK run buttons are handled by the delegated document listener below.
    // Direct binding caused duplicate runs after dashboard re-renders.
  }

  function bindPromotionPacketButton() {
    const card = elements.adkPreviewCard;
    if (!card) return;
    const button = card.querySelector("#createPromotionPacketBtn");
    if (!button) return;
    button.addEventListener("click", async () => {
      if (!state.selectedProject) return;
      button.disabled = true;
      button.textContent = "Packaging...";
      try {
        const promotion = await createPromotionPacket(state.selectedProject);
        button.textContent = "Packet Ready";
        const paths = promotion.paths || [];
        const note = document.createElement("p");
        note.textContent = paths.join(" · ") || "artifacts/promotion-packet.json";
        button.insertAdjacentElement("afterend", note);
        await loadFiles();
      } catch (error) {
        button.textContent = "Packet Failed";
        const note = document.createElement("p");
        note.textContent = error.message || String(error);
        button.insertAdjacentElement("afterend", note);
      } finally {
        button.disabled = false;
      }
    });
  }

  async function renderRegistration() {
    if (!state.selectedProject) {
      if (elements.registrationStatePill) elements.registrationStatePill.textContent = "no workspace";
      if (elements.registrationCard) elements.registrationCard.innerHTML = `<strong>No workspace selected</strong><span>Select a workspace to inspect registration readiness.</span>`;
      return;
    }
    const projectId = state.selectedProject;
    if (elements.registrationStatePill) elements.registrationStatePill.textContent = "checking";
    try {
      const { registration } = await fetchRegistrationStatus(projectId);
      if (state.selectedProject !== projectId) return;
      if (elements.registrationStatePill) elements.registrationStatePill.textContent = registration.registered ? "registered" : registration.deployed ? "deploy ready" : "local only";
      if (elements.registrationCard) elements.registrationCard.innerHTML = `
        <strong>${registration.registered ? "Registered in Gemini Enterprise" : registration.deployed ? "Deployed, not registered" : "Not registered yet"}</strong>
        <span>${escapeHtml(registration.registrationPath || "unknown")} · ${escapeHtml(registration.mode || "adk")}</span>
        <div class="registration-list">
          ${(registration.checklist || []).map((item) => `
            <div class="registration-item ${escapeHtml(item.status)}">
              <b>${escapeHtml(item.label)}</b>
              <span>${escapeHtml(item.detail)}</span>
            </div>
          `).join("")}
        </div>
        <code>${escapeHtml(registration.nextCommand || "agents-cli publish gemini-enterprise --interactive")}</code>
      `;
    } catch (error) {
      if (state.selectedProject !== projectId) return;
      if (elements.registrationStatePill) elements.registrationStatePill.textContent = "failed";
      if (elements.registrationCard) elements.registrationCard.innerHTML = `<strong>Could not inspect registration</strong><span>${escapeHtml(error.message || error)}</span>`;
    }
  }

  function renderWorkspaceDetails(files = state.projectFiles) {
    const project = activeProject();
    if (!project) {
      if (elements.workspaceDetails) elements.workspaceDetails.innerHTML = `<strong>No workspace selected</strong><span>Create or select a workspace to inspect manifests, run logs, and generated files.</span>`;
      if (elements.workspaceKindMetric) elements.workspaceKindMetric.textContent = "none";
      if (elements.workspaceFilesMetric) elements.workspaceFilesMetric.textContent = "0";
      if (elements.workspaceUpdatedMetric) elements.workspaceUpdatedMetric.textContent = "never";
      resetWorkspaceTools();
      onUpdate();
      return;
    }
    const manifest = project.manifest || {};
    const runFiles = countByPrefix(files, "runs/");
    const artifactFiles = countByPrefix(files, "artifacts/");
    const systemFiles = countByPrefix(files, "systems/");
    const rootFiles = files.length - runFiles - artifactFiles - systemFiles;
    if (elements.workspaceDetails) elements.workspaceDetails.innerHTML = `
      <strong>${escapeHtml(project.name)}</strong>
      <span>${escapeHtml(project.id)} · ${escapeHtml(project.path || "workspace path unavailable")}</span>
      <div class="workspace-tabs" role="list" aria-label="Workspace contents">
        <span class="workspace-tab active" role="listitem">Manifest ${manifest.id ? "ready" : "pending"}</span>
        <span class="workspace-tab" role="listitem">${runFiles} run logs</span>
        <span class="workspace-tab" role="listitem">${artifactFiles} artifacts</span>
        <span class="workspace-tab" role="listitem">${systemFiles} systems</span>
        <span class="workspace-tab" role="listitem">${Math.max(0, rootFiles)} root files</span>
      </div>
    `;
    if (elements.workspaceKindMetric) elements.workspaceKindMetric.textContent = project.kind || manifest.kind || "workspace";
    if (elements.workspaceFilesMetric) elements.workspaceFilesMetric.textContent = String(files.length || project.fileCount || 0);
    if (elements.workspaceUpdatedMetric) elements.workspaceUpdatedMetric.textContent = formatProjectTime(project.updatedAt || manifest.updatedAt);
    onUpdate();
  }

  function renderProjectFiles(files) {
    state.projectFiles = Array.isArray(files) ? files : [];
    if (state.selectedProject) {
      state.projectFilesByProject = state.projectFilesByProject || {};
      state.projectFilesByProject[state.selectedProject] = state.projectFiles;
    }
    const pf = elements.projectFilesEl;
    if (pf) pf.innerHTML = "";
    if (elements.fileCountPill) elements.fileCountPill.textContent = String(state.projectFiles.length);
    renderWorkspaceDetails(state.projectFiles);
    if (!state.selectedProject) {
      if (elements.filesState) elements.filesState.textContent = "No workspace selected";
      if (pf) pf.innerHTML = `<div class="file-card empty-card"><strong><span>No workspace selected</span></strong><span>Create or select a workspace to view files.</span></div>`;
      onUpdate();
      return;
    }
    if (state.projectFiles.length === 0) {
      if (elements.filesState) elements.filesState.textContent = "Workspace has no files yet";
      if (pf) pf.innerHTML = `<div class="file-card empty-card"><strong><span>No artifacts yet</span></strong><span>Run the agent with this workspace selected to generate files.</span></div>`;
      renderRegistration();
      onUpdate();
      return;
    }
    if (elements.filesState) elements.filesState.textContent = `${state.projectFiles.length} project files`;
    for (const file of state.projectFiles.slice(0, 24)) {
      const path = String(file.path || file.name || "file");
      const group =
        path.startsWith("runs/") ? "run log"
        : path.startsWith("artifacts/") ? "artifact"
        : path.startsWith("systems/") ? "system"
        : path === "workspace.json" ? "manifest"
        : "file";
      const card = document.createElement("div");
      card.className = "file-card";
      card.innerHTML = `
        <strong><span>${escapeHtml(file.name || file.path || "file")}</span></strong>
        <span>${escapeHtml(group)} · ${formatBytes(file.size)} · ${formatTime(file.mtime)}</span>
        <button class="file-open" type="button">Open</button>
      `;
      card.querySelector(".file-open").addEventListener("click", () => openFile(path));
      if (pf) pf.appendChild(card);
    }
    renderRegistration();
    onUpdate();
  }

  function renderFileError(error) {
    if (elements.filesState) elements.filesState.textContent = "File load failed";
    if (elements.fileCountPill) elements.fileCountPill.textContent = "!";
    if (elements.projectFilesEl) elements.projectFilesEl.innerHTML = `<div class="file-card empty-card"><strong><span>Could not load files</span></strong><span>${escapeHtml(error.message || error)}</span></div>`;
    renderWorkspaceDetails([]);
    renderRegistration();
    onUpdate();
  }

  function renderProjects() {
    const shown = visibleProjects();
    projectsEl.innerHTML = "";
    if (shown.length === 0) {
      const card = document.createElement("div");
      card.className = "project-card";
      const hiddenCount = state.projects.length - shown.length;
      card.innerHTML = `<strong><span>No user workspaces yet</span></strong><span>Create one to scope generated files.${hiddenCount ? ` ${hiddenCount} test workspaces hidden.` : ""}</span>`;
      projectsEl.appendChild(card);
      selectedProjectPill.textContent = "none";
      workspaceText.textContent = "Working directory: repo root until a workspace exists";
      if (!state.selectedProject || isHarnessTest(activeProject())) state.selectedProject = null;
      renderProjectFiles([]);
      return;
    }
    if (state.selectedProject && !shown.some((p) => p.id === state.selectedProject)) {
      state.selectedProject = null;
    }
    const active = shown.find((p) => p.id === state.selectedProject);
    selectedProjectPill.textContent = active?.name || "none";
    workspaceText.textContent = active ? `Workspace: ${active.path}` : "Workspace: pending";
    renderWorkspaceDetails(state.projectFiles);
    for (const project of shown) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `project-card ${project.id === state.selectedProject ? "active" : ""}`;
      btn.innerHTML = `
        <strong><span>${escapeHtml(project.name)}</span></strong>
        <span>${escapeHtml(project.id)} · ${project.fileCount || 0} files</span>
      `;
      btn.addEventListener("click", () => {
        onOpen(project.id);
      });
      projectsEl.appendChild(btn);
    }
    onUpdate();
  }

  async function loadFiles() {
    if (!state.selectedProject) {
      renderProjectFiles([]);
      return;
    }
    const projectId = state.selectedProject;
    if (elements.filesState) elements.filesState.textContent = "Loading project files";
    const data = await fetchProjectFilesApi(projectId);
    if (state.selectedProject !== projectId) return;
    renderProjectFiles(data.files || []);
  }

  async function createFromUi() {
    const name = projectName.value.trim() || "New Workspace";
    createProjectBtn.disabled = true;
    try {
      const { workspace } = await createWorkspace(name, {
        useCaseId: state.selectedUseCaseId || undefined,
        departmentId: state.selectedDepartment || undefined,
      });
      state.selectedProject = workspace.id;
      projectName.value = "";
      return workspace;
    } finally {
      createProjectBtn.disabled = false;
    }
  }

  /* Delegated handlers — survive dashboard DOM rebuilds */
  document.addEventListener("click", (e) => {
    const cmdBtn = e.target.closest("[data-command-id]");
    if (cmdBtn) {
      runTerminal(cmdBtn.dataset.commandId);
      return;
    }
    if (e.target.id === "startAdkRunBtn" || e.target.closest("#startAdkRunBtn")) {
      startPreview();
    }
  });

  return {
    activeProject,
    isHarnessTest,
    visibleProjects,
    renderProjects,
    renderProjectFiles,
    renderWorkspaceDetails,
    renderFileError,
    loadFiles,
    openFile,
    runTerminal,
    startPreview,
    renderRegistration,
    createFromUi,
  };
}
