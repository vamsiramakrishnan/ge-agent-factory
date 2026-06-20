import { escapeHtml } from "../lib/dom.js";

const STAGE_COLORS = {
  briefed: "muted",
  generated: "amber",
  tested: "green",
  serving: "teal",
  deployed: "blue",
  registered: "violet",
  published: "accent",
};

function stageBadgeHtml(stage) {
  const variant = STAGE_COLORS[stage] || "muted";
  return `<span class="stage-badge stage-${variant}">${escapeHtml(stage)}</span>`;
}

export function renderHomeScreen({
  elements,
  departments,
  agents,
  systemCount,
  projects,
  visibleProjects,
  activeDepartment,
  activeUseCase,
  departmentUseCases,
  runtimeCapabilities,
  skillRegistry,
  selectUseCase,
  openProject,
  deleteProject,
  projectAgents,
}) {
  const shownProjects = visibleProjects();
  const hiddenCount = projects.length - shownProjects.length;
  const totalUseCases = departments.reduce((sum, d) => sum + Number(d.useCaseCount || 0), 0);
  const latest = shownProjects[0] || null;

  elements.homeWorkspaceCount.textContent = String(shownProjects.length);
  elements.homeUseCaseCount.textContent = String(totalUseCases);
  elements.homeAgentCount.textContent = String(agents.length);
  elements.homeSystemCount.textContent = systemCount || "0";
  if (elements.homeSkillCount) elements.homeSkillCount.textContent = String(skillRegistry?.skills?.length || 0);
  elements.homeWorkspacePill.textContent = hiddenCount
    ? `${shownProjects.length} + ${hiddenCount} hidden`
    : String(shownProjects.length);
  elements.homeUseCasePill.textContent = `${totalUseCases} total`;
  elements.homeResumeBtn.disabled = !latest;

  elements.homeCurrent.innerHTML = latest
    ? `<span>Latest workspace</span><strong>${escapeHtml(latest.name)}</strong><p class="subtle">${escapeHtml(latest.id)} · ${latest.fileCount || 0} files</p>`
    : `<span>No workspace open</span><strong>Create or open a workspace</strong>`;

  renderGroupedWorkspaces(elements.homeWorkspacesEl, shownProjects, departments, hiddenCount, openProject, deleteProject, projectAgents || {});

  elements.homeUseCasesEl.innerHTML = "";
  const dept = activeDepartment();
  for (const uc of departmentUseCases().slice(0, 8)) {
    const kpiHtml = (uc.kpis || []).slice(0, 2).map((k) =>
      `<span class="uc-kpi">${escapeHtml(k.label)}: <em>${escapeHtml(k.before)}</em> → <em>${escapeHtml(k.after)}</em></span>`
    ).join("");
    const systemsHtml = (uc.systems || []).slice(0, 3).map((s) =>
      `<span class="uc-system">${escapeHtml(s)}</span>`
    ).join("");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "home-usecase-card";
    btn.innerHTML = `
      <div class="uc-head">
        <strong>${escapeHtml(uc.title)}</strong>
        <span class="uc-dept">${escapeHtml(dept?.label || "")}</span>
      </div>
      <span class="uc-persona">${escapeHtml(uc.persona || "Business operator")} · ${escapeHtml(uc.subtitle || uc.layer || "")}</span>
      ${kpiHtml ? `<div class="uc-kpis">${kpiHtml}</div>` : ""}
      ${systemsHtml ? `<div class="uc-systems">${systemsHtml}</div>` : ""}
    `;
    btn.addEventListener("click", () => selectUseCase(uc.id, shownProjects[0]?.id));
    elements.homeUseCasesEl.appendChild(btn);
  }

  const manifest = latest?.manifest || null;
  const nextAction = manifest?.nextAction || manifest?.nextActions?.[0] || (shownProjects.length ? "validate" : "create");
  const selectedSkills = manifest?.skills?.length ? manifest.skills : skillRegistry?.bindings?.slice(0, 3).map((binding) => ({
    id: binding.skill,
    capability: binding.capability,
    path: binding.skillPath,
  })) || [];
  const liveHarnesses = runtimeCapabilities?.adapters?.filter((adapter) => adapter.available && adapter.id !== "mock").length || 0;
  const actions = [
    {
      title: shownProjects.length ? `Next: ${nextAction}` : "Next: create",
      body: shownProjects.length
        ? `${manifest?.capabilities?.length || 1} capabilities ready in ${latest.name}.`
        : "Create one workspace, then generate and validate locally.",
      tone: shownProjects.length ? "good" : "warn",
    },
    {
      title: "Use case",
      body: activeUseCase()?.title || "Pick a department and use case before running.",
      tone: activeUseCase() ? "good" : "warn",
    },
    {
      title: "Harnesses",
      body: `${liveHarnesses} live adapters available; selected skills mirror into each workspace.`,
      tone: liveHarnesses ? "good" : "warn",
    },
    ...selectedSkills.slice(0, 3).map((skill) => ({
      title: skill.id,
      body: `${skill.capability || "skill"} · ${skill.path || ""}`,
      tone: "good",
    })),
  ];
  elements.homeNextActionsEl.innerHTML = "";
  for (const action of actions) {
    const card = document.createElement("div");
    card.className = `action-card ${action.tone || ""}`.trim();
    card.innerHTML = `<strong><span>${escapeHtml(action.title)}</span></strong><span>${escapeHtml(action.body)}</span>`;
    elements.homeNextActionsEl.appendChild(card);
  }
}

function findUseCaseTitle(departments, useCaseId) {
  if (!useCaseId) return null;
  for (const dept of departments) {
    const uc = (dept.featuredUseCases || []).find((u) => u.id === useCaseId);
    if (uc) return { title: uc.title, department: dept.label, color: dept.color };
  }
  return null;
}

function renderGroupedWorkspaces(container, projects, departments, hiddenCount, openProject, deleteProject, projectAgents) {
  container.innerHTML = "";

  if (projects.length === 0) {
    container.innerHTML = `<div class="workspace-tile"><strong>No workspaces yet</strong><span>Create one to start generating agents.${hiddenCount ? ` ${hiddenCount} test workspaces hidden.` : ""}</span></div>`;
    return;
  }

  const grouped = new Map();
  const ungrouped = [];

  for (const project of projects) {
    const ucId = project.useCaseId;
    if (ucId) {
      if (!grouped.has(ucId)) grouped.set(ucId, []);
      grouped.get(ucId).push(project);
    } else {
      ungrouped.push(project);
    }
  }

  for (const [ucId, ucProjects] of grouped) {
    const info = findUseCaseTitle(departments, ucId);
    const group = document.createElement("div");
    group.className = "usecase-group expanded";

    const header = document.createElement("button");
    header.type = "button";
    header.className = "usecase-group-header";
    header.innerHTML = `
      <strong>${escapeHtml(info?.title || ucId)}</strong>
      <div class="usecase-group-meta">
        ${info?.department ? `<span class="pill">${escapeHtml(info.department)}</span>` : ""}
        <span class="pill">${ucProjects.length} workspace${ucProjects.length !== 1 ? "s" : ""}</span>
      </div>
    `;
    header.addEventListener("click", () => group.classList.toggle("expanded"));

    const body = document.createElement("div");
    body.className = "usecase-group-body";
    const grid = document.createElement("div");
    grid.className = "home-workspace-grid";

    for (const project of ucProjects) {
      grid.appendChild(makeWorkspaceTile(project, openProject, deleteProject, projectAgents[project.id]));
    }

    body.appendChild(grid);
    group.append(header, body);
    container.appendChild(group);
  }

  if (ungrouped.length > 0) {
    if (grouped.size > 0) {
      const label = document.createElement("div");
      label.className = "usecase-group-label";
      label.textContent = "Other Workspaces";
      container.appendChild(label);
    }
    const grid = document.createElement("div");
    grid.className = "home-workspace-grid";
    for (const project of ungrouped) {
      grid.appendChild(makeWorkspaceTile(project, openProject, deleteProject, projectAgents[project.id]));
    }
    container.appendChild(grid);
  }
}

function makeWorkspaceTile(project, openProject, deleteProject, agentsList) {
  const wrapper = document.createElement("div");
  wrapper.className = "workspace-tile";
  const versionInfo = project.manifest?.currentVersion
    ? `v${project.manifest.currentVersion}`
    : "";
  const agents = Array.isArray(agentsList) ? agentsList : [];
  const hasWorkspaceAgent = project.manifest?.readiness?.agent?.status === "ready"
    || project.manifest?.agent
    || project.agentName
    || project.manifest?.useCaseId
    || project.manifest?.goal
    || project.useCaseId
    || project.departmentId;
  const displayAgents = agents.length > 0
    ? agents
    : hasWorkspaceAgent
      ? [{
          id: `${project.id}:root`,
          name: project.manifest?.name || project.name,
          stage: project.manifest?.readiness?.tests?.status === "passing" ? "tested" : "generated",
        }]
      : [];
  const agentListHtml = displayAgents.length > 0
    ? `<div class="workspace-tile-agents">${displayAgents.map((a) =>
        `<button type="button" class="workspace-tile-agent" data-open-agent="${escapeHtml(a.id)}"><span class="workspace-tile-agent-name">${escapeHtml(a.name)}</span>${stageBadgeHtml(a.stage || "briefed")}</button>`
      ).join("")}</div>`
    : "";
  wrapper.innerHTML = `
    <button type="button" class="workspace-tile-delete" title="Delete workspace" aria-label="Delete workspace">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
    </button>
    <button type="button" class="workspace-tile-main">
      <strong>${escapeHtml(project.name)}</strong>
      <span>${project.fileCount || 0} files${versionInfo ? ` · ${versionInfo}` : ""}${displayAgents.length ? ` · ${displayAgents.length} agent${displayAgents.length !== 1 ? "s" : ""}` : ""}</span>
      <span class="workspace-tile-id">${escapeHtml(project.id)}</span>
    </button>
    ${agentListHtml}
  `;
  const deleteBtn = wrapper.querySelector(".workspace-tile-delete");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (deleteProject) deleteProject(project.id, project.name);
  });
  wrapper.querySelector(".workspace-tile-main")?.addEventListener("click", () => {
    openProject(project.id);
  });
  wrapper.querySelectorAll(".workspace-tile-agent").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const agentId = button.dataset.openAgent || "";
      openProject(project.id, agentId.endsWith(":root") ? null : agentId);
    });
  });
  return wrapper;
}
