async function readJson(res) {
  const type = res.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    const text = await res.text();
    if (/<html[\s>]/i.test(text) || /Unable to forward your request to a backend/i.test(text)) {
      throw new Error(`GE web server/proxy is unavailable or restarting (${res.status}). Refresh after the dev server is listening on port 17655.`);
    }
    throw new Error((text || `daemon ${res.status}`).slice(0, 800));
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `daemon ${res.status}`);
  return data;
}

// ── Auth & Setup ─────────────────────────────────────────────
export async function fetchAuthStatus() {
  return readJson(await fetch("/api/auth/status"));
}

export async function fetchGcpProjects() {
  return readJson(await fetch("/api/auth/projects"));
}

export async function setGcpProject(projectId) {
  return readJson(await fetch("/api/auth/project", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId }),
  }));
}

export async function fetchGeminiApps(projectId) {
  const qs = projectId ? `?project=${encodeURIComponent(projectId)}` : "";
  return readJson(await fetch(`/api/auth/gemini-apps${qs}`));
}

export async function saveEnvConfig(vars) {
  return readJson(await fetch("/api/auth/env", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(vars),
  }));
}

// ── Bootstrap ────────────────────────────────────────────────
export async function fetchBootstrap() {
  const [healthRes, agentsRes, systemsRes, workspacesRes, departmentsRes, capabilitiesRes, skillsRes] = await Promise.all([
    fetch("/api/health"),
    fetch("/api/agents"),
    fetch("/api/systems"),
    fetch("/api/workspaces"),
    fetch("/api/departments"),
    fetch("/api/runtime/capabilities"),
    fetch("/api/runtime/skills"),
  ]);
  if (!healthRes.ok) throw new Error("daemon health check failed");
  const [health, agents, systems, workspaces, departments, capabilities, skills] = await Promise.all([
    readJson(healthRes),
    readJson(agentsRes),
    readJson(systemsRes),
    readJson(workspacesRes),
    readJson(departmentsRes),
    readJson(capabilitiesRes),
    readJson(skillsRes),
  ]);
  return { health, agents, systems, workspaces, departments, capabilities, skills };
}

export async function fetchProjectFiles(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/files`));
}

export async function fetchProjectFile(projectId, path) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/file?path=${encodeURIComponent(path)}`));
}

export async function runProjectCommand(projectId, commandId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/terminal`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ commandId }),
  }));
}

export async function startAdkWebPreview(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/previews/adk-web`, { method: "POST" }));
}

export async function runAdkAgent(projectId, prompt = "hello") {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/adk-run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  }));
}

export async function createPromotionPacket(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/promotion-packet`, {
    method: "POST",
  }));
}

export async function createDeployPlan(projectId, target = "agent_runtime") {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/plans/deploy`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ target }),
  }));
}

export async function createPublishPlan(projectId, appId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/plans/publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ appId }),
  }));
}

export async function fetchAdkWebPreview(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/previews/adk-web`));
}

export async function fetchRegistrationStatus(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/registration`));
}

export async function createWorkspace(name, { useCaseId, departmentId } = {}) {
  return readJson(await fetch("/api/workspaces", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, kind: "workspace", useCaseId, departmentId }),
  }));
}

export async function deleteWorkspace(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
  }));
}

export async function saveBriefApi(projectId, briefData) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/brief`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(briefData),
  }));
}

export async function fetchBrief(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/brief`));
}

export async function createVersionApi(projectId, brief) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/versions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ brief }),
  }));
}

export async function fetchVersions(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/versions`));
}

export async function fetchVersion(projectId, vid) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/versions/${vid}`));
}

export async function promoteVersionApi(projectId, vid) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/versions/${vid}/promote`, { method: "PATCH" }));
}

export function startChatRun({ agentId, model, projectId, selectedAgentId, message }) {
  return fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ agentId, model, projectId, selectedAgentId, message }),
  });
}

export function cancelChatRun(runId) {
  return fetch(`/api/runs/${encodeURIComponent(runId)}/cancel`, { method: "POST" });
}

export async function listAgents(projectId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/agents`));
}

export async function createAgent(projectId, { name, useCaseId, departmentId, dirName, brief }) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/agents`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, useCaseId, departmentId, dirName, brief }),
  }));
}

export async function getAgent(projectId, agentId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/agents/${encodeURIComponent(agentId)}`));
}

export async function deleteAgent(projectId, agentId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/agents/${encodeURIComponent(agentId)}`, {
    method: "DELETE",
  }));
}

export async function deleteChatSession(projectId, sessionId) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  }));
}

export async function updateAgentStage(projectId, agentId, stage) {
  return readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/agents/${encodeURIComponent(agentId)}/stage`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ stage }),
  }));
}
