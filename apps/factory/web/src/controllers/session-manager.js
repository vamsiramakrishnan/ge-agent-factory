/**
 * Session manager — chat session lifecycle, session bar, history dropdown.
 *
 * Factory receives (state, el, deps) and returns its public API.
 */
import { listChatSessions, createChatSession, listChatMessages } from "../lib/chat-api.js";
import { deleteChatSession } from "../lib/api.js";
import { escapeHtml } from "../lib/dom.js";
import { getWorkspaceScope, workspaceScopeKey } from "../state.js";

export function createSessionManager(state, el, { transcript, examples }) {
  let hydrateToken = 0;

  function activeScopeKey() {
    return workspaceScopeKey(state.selectedProject, state.selectedAgentId);
  }

  function storageKey(projectId = state.selectedProject, agentId = state.selectedAgentId) {
    return projectId ? `ge:last-chat:${workspaceScopeKey(projectId, agentId)}` : null;
  }

  function rememberSession(projectId, agentId, sessionId) {
    const key = storageKey(projectId, agentId);
    if (key && sessionId) localStorage.setItem(key, sessionId);
  }

  function forgottenSession(projectId, agentId) {
    const key = storageKey(projectId, agentId);
    return key ? localStorage.getItem(key) : null;
  }

  function relTime(ts) {
    if (!ts) return "";
    const diff = Date.now() - ts;
    if (diff < 60000) return "Now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(ts).toLocaleDateString();
  }

  function renderSessionBar() {
    const scope = getWorkspaceScope(state);
    const sessions = scope?.chatSessions || [];
    const active = sessions.find((s) => s.id === scope?.chatSessionId);
    el.chatSessionPill.textContent = active?.title || "Chat";

    const itemsContainer = el.chatHistoryList.querySelector(".chat-history-items");
    if (!itemsContainer) return;
    itemsContainer.innerHTML = "";

    if (sessions.length === 0) {
      itemsContainer.innerHTML = `<div class="chat-history-empty">No conversations yet</div>`;
      return;
    }

    for (const session of sessions.slice(0, 20)) {
      const item = document.createElement("div");
      item.className = `chat-history-entry ${session.id === scope?.chatSessionId ? "active" : ""}`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chat-history-entry-main";
      btn.innerHTML = `<span class="chat-history-title">${escapeHtml(session.title || "Untitled")}</span><span class="chat-history-time">${relTime(session.updatedAt || session.createdAt)}</span>`;
      btn.addEventListener("click", () => {
        switchSession(session.id);
        el.chatHistoryList.hidden = true;
      });

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "chat-history-delete";
      delBtn.textContent = "×";
      delBtn.title = "Delete conversation";
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm("Delete this conversation?")) return;
        try {
          await deleteChatSession(state.selectedProject, session.id);
          const current = getWorkspaceScope(state);
          current.chatSessions = current.chatSessions.filter((s) => s.id !== session.id);
          if (current.chatSessionId === session.id) {
            current.chatSessionId = current.chatSessions[0]?.id || null;
            if (current.chatSessionId) {
              await switchSession(current.chatSessionId);
            } else {
              transcript.showEmpty("No conversations", "Start a new chat.", examples);
            }
          }
          renderSessionBar();
        } catch (err) {
          console.error("Delete session failed:", err);
        }
      });

      item.append(btn, delBtn);
      itemsContainer.appendChild(item);
    }
  }

  function applyScopeToLegacyState(scope) {
    state.chatSessionId = scope?.chatSessionId || null;
    state.chatSessions = scope?.chatSessions || [];
    state.currentRunId = scope?.currentRunId || null;
  }

  async function loadChatSession(projectId, agentId = state.selectedAgentId) {
    const token = ++hydrateToken;
    const key = workspaceScopeKey(projectId, agentId);
    const scope = getWorkspaceScope(state, projectId, agentId);
    const isStillActive = () => token === hydrateToken && activeScopeKey() === key;
    try {
      const sessions = await listChatSessions(projectId, agentId);
      const remembered = forgottenSession(projectId, agentId);
      let session = sessions.find((item) => item.id === remembered) || sessions[0];
      if (!session) {
        session = await createChatSession(projectId, "Chat 1", agentId);
        sessions.unshift(session);
      }
      scope.chatSessionId = session.id;
      scope.chatSessions = sessions;
      rememberSession(projectId, agentId, session.id);
      if (!isStillActive()) return false;
      applyScopeToLegacyState(scope);
      renderSessionBar();
      const messages = await listChatMessages(projectId, session.id);
      if (!isStillActive()) return false;
      transcript.loadMessages(messages);
      return true;
    } catch {
      scope.chatSessionId = null;
      scope.chatSessions = [];
      if (!isStillActive()) return false;
      applyScopeToLegacyState(scope);
      transcript.showEmpty("Start building", "Choose an example or write your own prompt.", examples);
      return false;
    }
  }

  async function switchSession(sessionId) {
    const scope = getWorkspaceScope(state);
    if (!state.selectedProject || !scope || sessionId === scope.chatSessionId) return;
    scope.chatSessionId = sessionId;
    applyScopeToLegacyState(scope);
    rememberSession(state.selectedProject, state.selectedAgentId, sessionId);
    renderSessionBar();
    const key = activeScopeKey();
    try {
      const messages = await listChatMessages(state.selectedProject, sessionId);
      if (activeScopeKey() !== key) return;
      transcript.loadMessages(messages);
    } catch {
      if (activeScopeKey() !== key) return;
      transcript.showEmpty("Start building", "Choose an example or write your own prompt.", examples);
    }
  }

  async function newChatSession() {
    if (!state.selectedProject) return;
    try {
      const scope = getWorkspaceScope(state);
      const count = (scope?.chatSessions?.length || 0) + 1;
      const session = await createChatSession(state.selectedProject, `Chat ${count}`, state.selectedAgentId);
      scope.chatSessionId = session.id;
      scope.chatSessions = [session, ...(scope.chatSessions || [])];
      applyScopeToLegacyState(scope);
      rememberSession(state.selectedProject, state.selectedAgentId, session.id);
      renderSessionBar();
      transcript.showEmpty("New chat", "Send a prompt to start.", examples);
    } catch {
      // best effort
    }
  }

  function toggleHistoryDropdown() {
    el.chatHistoryList.hidden = !el.chatHistoryList.hidden;
  }

  async function ensureSession(projectId = state.selectedProject, agentId = state.selectedAgentId) {
    const scope = getWorkspaceScope(state, projectId, agentId);
    if (scope?.chatSessionId) return scope.chatSessionId;
    if (!projectId) return null;
    const session = await createChatSession(projectId, "Chat 1", agentId);
    scope.chatSessionId = session.id;
    scope.chatSessions = [session, ...(scope.chatSessions || [])];
    rememberSession(projectId, agentId, session.id);
    if (workspaceScopeKey(projectId, agentId) === activeScopeKey()) {
      applyScopeToLegacyState(scope);
      renderSessionBar();
    }
    return session.id;
  }

  return { loadChatSession, switchSession, newChatSession, ensureSession, renderSessionBar, toggleHistoryDropdown, relTime, applyScopeToLegacyState };
}
