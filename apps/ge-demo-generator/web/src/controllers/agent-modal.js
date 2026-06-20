/**
 * Agent modal controller — new-agent creation modal, department pills,
 * domain nav, use-case grid, and create-agent handler.
 *
 * Factory receives (state, el, deps) and returns its public API.
 */
import { escapeHtml } from "../lib/dom.js";
import { createAgent, createWorkspace } from "../lib/api.js";

export function createAgentModal(state, el, { projectPanel, transcript, load, openProject }) {
  // ── Modal-local state ──────────────────────────────────────
  let newAgentPath = "usecase";
  let newAgentDeptId = null;
  let modalDomainId = null;
  let modalSelectedUcId = null;

  // ── Public API ─────────────────────────────────────────────

  function open() {
    newAgentPath = "usecase";
    newAgentDeptId = state.selectedDepartment || state.departments[0]?.id || null;
    modalDomainId = null;
    modalSelectedUcId = null;
    render();
    el.newAgentModal.hidden = false;
    el.closeNewAgentBtn.focus();
  }

  function close() {
    el.newAgentModal.hidden = true;
  }

  function render() {
    // Populate workspace select
    const visible = projectPanel.visibleProjects();
    el.newAgentWorkspaceSelect.innerHTML = "";
    if (visible.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No workspaces -- create one below";
      el.newAgentWorkspaceSelect.appendChild(opt);
      el.inlineWsCreate.hidden = false;
    } else {
      for (const p of visible) {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        if (p.id === state.selectedProject) opt.selected = true;
        el.newAgentWorkspaceSelect.appendChild(opt);
      }
      el.inlineWsCreate.hidden = true;
    }

    // Set active path
    document.querySelectorAll("[data-agent-path]").forEach((card) => {
      card.classList.toggle("active", card.dataset.agentPath === newAgentPath);
    });
    document.querySelectorAll("[data-agent-form]").forEach((form) => {
      form.hidden = form.dataset.agentForm !== newAgentPath;
    });

    // Populate department pills (shared by usecase and department paths)
    renderDeptPills(el.newAgentDeptPills);
    renderDeptPills(el.newAgentDeptPillsDept);

    // Populate domain nav + use case grid
    renderDomainNav();
    renderUseCaseGrid();
  }

  function setPath(path) {
    newAgentPath = path;
    render();
  }

  // ── Internal helpers ───────────────────────────────────────

  function renderDeptPills(container) {
    container.innerHTML = "";
    for (const dept of state.departments) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `dept-pill${dept.id === newAgentDeptId ? " active" : ""}`;
      pill.textContent = dept.label || dept.id;
      pill.style.setProperty("--dept-color", dept.color || "var(--accent)");
      pill.addEventListener("click", () => {
        newAgentDeptId = dept.id;
        modalDomainId = null;
        modalSelectedUcId = null;
        renderDeptPills(el.newAgentDeptPills);
        renderDeptPills(el.newAgentDeptPillsDept);
        renderDomainNav();
        renderUseCaseGrid();
      });
      container.appendChild(pill);
    }
  }

  function renderDomainNav() {
    if (!el.newAgentDomainNav) return;
    el.newAgentDomainNav.innerHTML = "";
    const dept = state.departments.find((d) => d.id === newAgentDeptId);
    const domains = dept?.domains || [];
    if (domains.length === 0) return;

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `domain-pill ${!modalDomainId ? "active" : ""}`;
    allBtn.textContent = "All";
    allBtn.addEventListener("click", () => { modalDomainId = null; renderDomainNav(); renderUseCaseGrid(); });
    el.newAgentDomainNav.appendChild(allBtn);

    for (const domain of domains) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `domain-pill ${domain.id === modalDomainId ? "active" : ""}`;
      btn.style.setProperty("--domain-color", domain.color || "var(--accent)");
      btn.innerHTML = `${escapeHtml(domain.title)} <span class="domain-pill-count">${domain.useCaseCount || 0}</span>`;
      btn.addEventListener("click", () => { modalDomainId = domain.id; renderDomainNav(); renderUseCaseGrid(); });
      el.newAgentDomainNav.appendChild(btn);
    }
  }

  function getUseCases() {
    const dept = state.departments.find((d) => d.id === newAgentDeptId);
    if (!dept) return [];
    const domains = dept.domains || [];

    if (modalDomainId) {
      const domain = domains.find((d) => d.id === modalDomainId);
      if (domain?.useCases?.length) return domain.useCases;
    }

    // Combine: domain use cases first (richer data), then featuredUseCases as fallback
    if (domains.some((d) => d.useCases?.length)) {
      const all = [];
      const seen = new Set();
      for (const d of domains) {
        for (const uc of d.useCases || []) {
          if (!seen.has(uc.id)) { seen.add(uc.id); all.push(uc); }
        }
      }
      return all;
    }

    return dept.featuredUseCases || [];
  }

  function renderUseCaseGrid() {
    if (!el.newAgentUseCaseGrid) return;
    el.newAgentUseCaseGrid.innerHTML = "";
    const filtered = getUseCases();

    if (filtered.length === 0) {
      el.newAgentUseCaseGrid.innerHTML = `<div class="uc-empty">No use cases available. Select a department first.</div>`;
      return;
    }

    for (const uc of filtered) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `modal-uc-card ${uc.id === modalSelectedUcId ? "selected" : ""}`;
      card.innerHTML = `<strong>${escapeHtml(uc.title)}</strong><span>${escapeHtml(uc.description || "")}</span>`;
      card.addEventListener("click", () => {
        modalSelectedUcId = uc.id;
        if (!el.newAgentNameUC.value) el.newAgentNameUC.value = uc.title;
        renderUseCaseGrid();
      });
      el.newAgentUseCaseGrid.appendChild(card);
    }

    // Sync hidden select
    el.newAgentUseCaseSelect.innerHTML = "";
    for (const uc of filtered) {
      const opt = document.createElement("option");
      opt.value = uc.id;
      opt.textContent = uc.title;
      if (uc.id === modalSelectedUcId) opt.selected = true;
      el.newAgentUseCaseSelect.appendChild(opt);
    }
  }

  async function handleCreate(path) {
    const projectId = el.newAgentWorkspaceSelect.value;
    if (!projectId) {
      alert("Please select or create a workspace first.");
      return;
    }

    let name, useCaseId, departmentId, brief;

    if (path === "usecase") {
      useCaseId = modalSelectedUcId || el.newAgentUseCaseSelect.value;
      departmentId = newAgentDeptId;
      name = el.newAgentNameUC.value.trim();
      if (!useCaseId) {
        alert("Please select a use case.");
        return;
      }
      const dept = state.departments.find((d) => d.id === departmentId);
      let uc = (dept?.featuredUseCases || []).find((u) => u.id === useCaseId);
      if (!uc) {
        for (const domain of (dept?.domains || [])) {
          uc = (domain.useCases || []).find((u) => u.id === useCaseId);
          if (uc) break;
        }
      }
      if (!name) name = uc?.title || "New Agent";
      // Auto-generate brief from use case metadata
      if (uc) {
        const parts = [`Use case: ${uc.title}`];
        if (dept) parts.push(`Department: ${dept.label}`);
        if (uc.persona) parts.push(`Persona: ${uc.persona}`);
        if (uc.description) parts.push(`Description: ${uc.description}`);
        if (uc.systems?.length) parts.push(`Systems: ${uc.systems.join(", ")}`);
        if (uc.kpis?.length) parts.push(`KPIs: ${uc.kpis.map((k) => `${k.label}: ${k.before} → ${k.after}`).join("; ")}`);
        if (uc.statusQuo?.length) parts.push(`Status quo: ${uc.statusQuo.join(" ")}`);
        if (uc.agentification?.length) parts.push(`Agent vision: ${uc.agentification.join(" ")}`);
        brief = parts.join("\n");
      }
    } else if (path === "department") {
      departmentId = newAgentDeptId;
      name = el.newAgentNameDept.value.trim() || "New Agent";
      brief = el.newAgentDescDept.value.trim() || undefined;
    } else {
      name = el.newAgentNameFree.value.trim() || "New Agent";
      brief = el.newAgentDescFree.value.trim() || undefined;
    }

    const dirName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    try {
      const { agent } = await createAgent(projectId, {
        name,
        useCaseId: useCaseId || undefined,
        departmentId: departmentId || undefined,
        dirName: `agents/${dirName || "agent"}`,
        brief: brief || undefined,
      });
      close();
      // Set the newly created agent as selected
      if (agent && agent.id) state.selectedAgentId = agent.id;
      // Reload and navigate
      await load();
      openProject(projectId);
    } catch (err) {
      transcript.addMessage("error", `Failed to create agent: ${err.message}`);
    }
  }

  async function handleInlineWsCreate() {
    const name = el.inlineWsName.value.trim();
    if (!name) { el.inlineWsName.focus(); return; }
    el.inlineWsBtn.disabled = true;
    try {
      const { workspace } = await createWorkspace(name);
      state.projects.push(workspace);
      state.selectedProject = workspace.id;
      el.inlineWsName.value = "";
      render();
    } catch (err) {
      transcript.addMessage("error", `Failed to create workspace: ${err.message}`);
    } finally {
      el.inlineWsBtn.disabled = false;
    }
  }

  // ── Bind DOM events ────────────────────────────────────────

  function bind() {
    // Path card switching
    document.querySelectorAll("[data-agent-path]").forEach((card) => {
      card.addEventListener("click", () => setPath(card.dataset.agentPath));
    });

    // Close button
    el.closeNewAgentBtn.addEventListener("click", close);

    // Backdrop click to close
    el.newAgentModal.addEventListener("click", (e) => {
      if (e.target === el.newAgentModal) close();
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !el.newAgentModal.hidden) close();
    });

    // Create buttons
    el.createAgentUseCaseBtn.addEventListener("click", () => handleCreate("usecase"));
    el.createAgentDeptBtn.addEventListener("click", () => handleCreate("department"));
    el.createAgentFreeBtn.addEventListener("click", () => handleCreate("freeform"));

    // Inline workspace creation in new agent modal
    el.inlineWsBtn.addEventListener("click", () => handleInlineWsCreate());
    el.inlineWsName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); el.inlineWsBtn.click(); }
    });
  }

  return { open, close, render, setPath, handleCreate, bind };
}
