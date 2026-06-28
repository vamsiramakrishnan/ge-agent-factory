async function readJson(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `${res.status}`);
  return data;
}

function agentQuery(agentId) {
  return agentId ? `?agentId=${encodeURIComponent(agentId)}` : "";
}

export async function listChatSessions(projectId, agentId = null) {
  const data = await readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions${agentQuery(agentId)}`));
  return data.sessions || [];
}

export async function createChatSession(projectId, title, agentId = null) {
  const data = await readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title, agentId }),
  }));
  return data.session;
}

export async function deleteChatSession(projectId, sessionId) {
  await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });
}

export async function renameChatSession(projectId, sessionId, title) {
  const data = await readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  }));
  return data.session;
}

export async function listChatMessages(projectId, sessionId) {
  const data = await readJson(await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}/messages`));
  return data.messages || [];
}

export async function saveChatMessage(projectId, sessionId, message) {
  await fetch(`/api/workspaces/${encodeURIComponent(projectId)}/chat/sessions/${encodeURIComponent(sessionId)}/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(message),
  });
}
