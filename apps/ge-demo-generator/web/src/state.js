export const examples = [
  "Create a local-first HR benefits agent with deterministic mock systems and validation.",
  "Validate this workspace and tell me the next capability-driven action.",
  "Audit the selected agent for fixture credibility, evidence quality, and ADK correctness.",
  "Produce deploy and publish plans only; do not call live Google services.",
];

export function createState() {
  return {
    selectedAgent: "gemini",
    selectedModel: "default",
    selectedProject: null,
    agents: [],
    projects: [],
    projectFiles: [],
    projectFilesByProject: {},
    departments: [],
    interviewQuestions: [],
    selectedDepartment: "hr",
    selectedUseCaseId: "",
    selectedAgentId: null,
    interviewAnswers: {},
    projectAgents: {},
    runtimeCapabilities: null,
    skillRegistry: null,
    viewMode: "entry",
    homeTabsBound: false,
    currentRunId: null,
    workspaceScopes: {},
  };
}

export function agentScopeId(agentId) {
  return agentId || "__workspace__";
}

export function workspaceScopeKey(projectId, agentId = null) {
  return projectId ? `${projectId}::${agentScopeId(agentId)}` : "";
}

export function getWorkspaceScope(state, projectId = state.selectedProject, agentId = state.selectedAgentId) {
  const key = workspaceScopeKey(projectId, agentId);
  if (!key) return null;
  if (!state.workspaceScopes[key]) {
    state.workspaceScopes[key] = {
      projectId,
      agentId: agentId || null,
      chatSessionId: null,
      chatSessions: [],
      currentRunId: null,
      runStatus: "idle",
      runtimeText: "0s",
      runIdText: "No run yet",
      streamState: "No active run",
    };
  }
  return state.workspaceScopes[key];
}

export function currentWorkspaceScope(state) {
  return getWorkspaceScope(state);
}

export function rememberProjectAgentSelection(state, projectId, agentId) {
  if (!projectId) return;
  if (!state.selectedAgentByProject) state.selectedAgentByProject = {};
  state.selectedAgentByProject[projectId] = agentId || null;
}

export function restoreProjectAgentSelection(state, projectId) {
  return state.selectedAgentByProject?.[projectId] || null;
}
