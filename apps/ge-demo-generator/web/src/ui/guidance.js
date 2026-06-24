import { escapeHtml } from "../lib/dom.js";

export function createGuidance(state, elements, { builder, getActiveProject }) {
  const {
    methodSteps,
    methodDepartment,
    methodUseCase,
    methodWorkspace,
    methodAgent,
    readinessList,
    readinessPill,
    nextActionsEl,
  } = elements;

  function readinessItems() {
    const dept = builder.activeDepartment();
    const uc = builder.activeUseCase();
    const project = getActiveProject();
    const agent = state.agents.find((a) => a.id === state.selectedAgent);
    const interview = builder.interviewCompletion();
    return [
      {
        title: "Department context",
        body: dept ? `${dept.label} gives the agent the operating domain.` : "Choose HR, Finance, Procurement, IT, or Marketing.",
        state: dept ? "good" : "warn",
      },
      {
        title: "Source use case",
        body: uc ? uc.title : "Pick a slide-derived use case so the prompt has real workflow material.",
        state: uc ? "good" : "warn",
      },
      {
        title: "Interview depth",
        body: interview.total
          ? `${interview.filled}/${interview.total} fields answered. Three strong answers are enough to generate.`
          : "Interview questions are loading.",
        state: interview.filled >= 3 ? "good" : interview.filled > 0 ? "warn" : "",
      },
      {
        title: "Workspace boundary",
        body: project ? project.name : "Create or select a workspace before generating files.",
        state: project ? "good" : "warn",
      },
      {
        title: "Runnable harness agent",
        body: agent?.available
          ? `${agent.name || agent.id} is available with ${state.selectedModel}.`
          : `${agent?.name || state.selectedAgent} is not currently available on PATH.`,
        state: agent?.available ? "good" : "warn",
      },
    ];
  }

  function render() {
    if (!methodSteps || !readinessList) return;
    const dept = builder.activeDepartment();
    const uc = builder.activeUseCase();
    const project = getActiveProject();
    const agent = state.agents.find((a) => a.id === state.selectedAgent);
    const interview = builder.interviewCompletion();
    const items = readinessItems();
    const ready = items.filter((i) => i.state === "good").length;

    methodDepartment.textContent = dept?.label || "Not selected";
    methodUseCase.textContent = uc?.title || "Not selected";
    methodWorkspace.textContent = project?.name || "Not selected";
    methodAgent.textContent = agent?.name || state.selectedAgent;
    readinessPill.textContent = `${ready}/${items.length} ready`;

    const stepState = {
      department: dept && uc ? "good" : dept ? "active" : "",
      interview: interview.filled >= 3 ? "good" : interview.filled > 0 ? "active" : "",
      workspace: project && agent?.available ? "good" : project ? "active" : "",
      iterate: state.currentRunId ? "active" : "",
    };
    methodSteps.querySelectorAll(".method-step").forEach((step) => {
      step.classList.remove("good", "active");
      const s = stepState[step.dataset.step];
      if (s) step.classList.add(s);
    });

    readinessList.innerHTML = "";
    for (const item of items) {
      const card = document.createElement("div");
      card.className = `readiness-item ${item.state || ""}`.trim();
      card.innerHTML = `<div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.body)}</span></div>`;
      readinessList.appendChild(card);
    }
  }

  function renderNextActions() {
    const project = getActiveProject();
    const agent = state.agents.find((a) => a.id === state.selectedAgent);
    const uc = builder.activeUseCase();
    const actions = [
      ...readinessItems()
        .filter((i) => i.state !== "good")
        .slice(0, 2)
        .map((i) => ({ title: i.title, body: i.body, tone: i.state || "warn" })),
      {
        title: project ? "Generate into selected workspace" : "Create or select a workspace",
        body: project ? project.name : "Workspace selection keeps generated artifacts inspectable here.",
        tone: project ? "good" : "warn",
      },
      {
        title: uc ? "Use case selected" : "Choose a use case",
        body: uc?.title || "The builder uses real slide use-case metadata.",
        tone: uc ? "good" : "warn",
      },
      {
        title: agent?.available ? "Agent is ready" : "Agent unavailable",
        body: agent?.available
          ? `${agent.name || agent.id} will run with ${state.selectedModel}.`
          : "Install or expose the agent binary before running live prompts.",
        tone: agent?.available ? "good" : "warn",
      },
      {
        title: state.currentRunId ? "Follow current run" : "Start a run",
        body: state.currentRunId || "Use a useful prompt or type a specific devex task below.",
        tone: state.currentRunId ? "" : "warn",
      },
    ];
    nextActionsEl.innerHTML = "";
    for (const action of actions) {
      const card = document.createElement("div");
      card.className = `action-card ${action.tone || ""}`.trim();
      card.innerHTML = `<strong><span>${escapeHtml(action.title)}</span></strong><span>${escapeHtml(action.body)}</span>`;
      nextActionsEl.appendChild(card);
    }
  }

  return { render, renderNextActions, readinessItems };
}
