import { escapeHtml } from "../lib/dom.js";

export function createAgentPanel(state, elements, { onUpdate }) {
  const { agentsEl, systemsEl, agentCount, systemCount, selectedAgentPill, modelSelect } = elements;

  function updateModels() {
    const agent = state.agents.find((a) => a.id === state.selectedAgent);
    const models = agent?.models?.length ? agent.models : [{ id: "default", label: "Default" }];
    modelSelect.innerHTML = models
      .map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.label || m.id)}</option>`)
      .join("");
    state.selectedModel = models.some((m) => m.id === state.selectedModel)
      ? state.selectedModel
      : models[0]?.id || "default";
    modelSelect.value = state.selectedModel;
  }

  function renderAgents() {
    agentsEl.innerHTML = "";
    for (const agent of state.agents) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `agent-card ${agent.id === state.selectedAgent ? "active" : ""}`;
      btn.innerHTML = `
        <strong><i class="dot ${agent.available ? "on" : ""}"></i><span>${escapeHtml(agent.name || agent.id)}</span></strong>
        <code>${agent.available ? escapeHtml(agent.resolvedBin || "available") : "not on PATH"}</code>
      `;
      btn.addEventListener("click", () => {
        state.selectedAgent = agent.id;
        selectedAgentPill.textContent = agent.id;
        renderAgents();
        updateModels();
        onUpdate();
      });
      agentsEl.appendChild(btn);
    }
  }

  function renderSystems(systems) {
    systemsEl.innerHTML = "";
    for (const sys of systems) {
      const card = document.createElement("div");
      card.className = "system-card";
      card.dataset.status = sys.status;
      const tools =
        Array.isArray(sys.tools) && sys.tools.length
          ? ` · ${sys.tools.slice(0, 3).join(", ")}`
          : "";
      card.innerHTML = `
        <strong><span>${escapeHtml(sys.name)}</span> <span class="pill">${escapeHtml(sys.status)}</span></strong>
        <span>${escapeHtml(sys.description || "")}${escapeHtml(tools)}</span>
      `;
      systemsEl.appendChild(card);
    }
  }

  function setCounts(agentLen, sysLen) {
    agentCount.textContent = String(agentLen);
    systemCount.textContent = String(sysLen);
  }

  return { renderAgents, renderSystems, updateModels, setCounts };
}
