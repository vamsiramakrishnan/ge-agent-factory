import { escapeHtml } from "../lib/dom.js";
import { buildAgentBrief } from "../features/brief.js";

export function createBuilder(state, elements, { onUpdate }) {
  const {
    useCasesEl,
    interviewQuestionsEl,
    briefPreviewEl,
    departmentsEl,
    useCaseCountPill,
    builderProgressPill,
    builderSourceSummary,
    builderInterviewSummary,
    builderReviewSummary,
    selectedUseCaseSummary,
    interviewProgressPill,
    reviewReadinessPill,
    builderToInterviewBtn,
    builderBackToSourceBtn,
    builderToReviewBtn,
    builderBackToInterviewBtn,
    builderState,
    departmentCount,
  } = elements;
  let builderStep = "source";
  let selectedDomainId = null;

  function setBuilderStep(step) {
    builderStep = ["source", "interview", "review"].includes(step) ? step : "source";
    document.body.dataset.builderStep = builderStep;
    document.querySelectorAll("[data-builder-step]").forEach((button) => {
      button.classList.toggle("active", button.dataset.builderStep === builderStep);
      button.setAttribute("aria-selected", button.dataset.builderStep === builderStep ? "true" : "false");
    });
    builderProgressPill.textContent =
      builderStep === "source" ? "Source" : builderStep === "interview" ? "Interview" : "Review";
  }

  function activeDepartment() {
    return state.departments.find((d) => d.id === state.selectedDepartment) || state.departments[0] || null;
  }

  function departmentDomains() {
    return activeDepartment()?.domains || [];
  }

  function departmentUseCases() {
    return activeDepartment()?.featuredUseCases || [];
  }

  function activeDomain() {
    const domains = departmentDomains();
    return domains.find((d) => d.id === selectedDomainId) || null;
  }

  function useCasesForView() {
    const domain = activeDomain();
    if (domain && domain.useCases) return domain.useCases;
    return departmentUseCases();
  }

  function activeUseCase() {
    const list = departmentUseCases();
    return state.selectedUseCaseId ? list.find((u) => u.id === state.selectedUseCaseId) || null : null;
  }

  function interviewCompletion() {
    const total = state.interviewQuestions.length || 0;
    const filled = state.interviewQuestions.filter((q) => String(state.interviewAnswers[q.id] || "").trim()).length;
    return { filled, total };
  }

  function buildBrief() {
    return buildAgentBrief({
      department: activeDepartment(),
      useCase: activeUseCase(),
      interviewAnswers: state.interviewAnswers,
    });
  }

  function renderBriefPreview() {
    briefPreviewEl.textContent = buildBrief();
  }

  function renderSummaries() {
    const selected = activeUseCase();
    const completion = interviewCompletion();
    const enoughAnswers = completion.filled >= Math.min(3, completion.total || 3);
    builderSourceSummary.textContent = selected ? selected.title : "Choose use case";
    builderInterviewSummary.textContent = `${completion.filled}/${completion.total || 0} answered`;
    builderReviewSummary.textContent = enoughAnswers ? "Ready to run" : "Defaults used";
    interviewProgressPill.textContent = `${completion.filled}/${completion.total || 0} answered`;
    reviewReadinessPill.textContent = enoughAnswers ? "Ready" : "Using defaults";

    if (!selected) {
      selectedUseCaseSummary.innerHTML = `
        <span>Selected use case</span>
        <strong>None selected</strong>
        <p>Choose a use case to continue.</p>
      `;
      return;
    }

    selectedUseCaseSummary.innerHTML = `
      <span>Selected use case</span>
      <strong>${escapeHtml(selected.title)}</strong>
      <p>${escapeHtml(selected.persona || "Business operator")} · ${escapeHtml(selected.subtitle || selected.layer || "Generated workspace")}</p>
      <ul>
        ${(selected.kpis || []).slice(0, 3).map((kpi) => `<li>${escapeHtml(kpi.label)}: ${escapeHtml(kpi.before)} → ${escapeHtml(kpi.after)}</li>`).join("")}
      </ul>
    `;
  }

  function renderDepartments() {
    departmentsEl.innerHTML = "";
    departmentCount.textContent = String(state.departments.length);
    for (const dept of state.departments) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `dept-card ${dept.id === state.selectedDepartment ? "active" : ""}`;
      btn.style.borderLeftColor = dept.color || "var(--accent)";
      const domainCount = dept.domainCount || dept.domains?.length || 0;
      btn.innerHTML = `
        <strong><span>${escapeHtml(dept.label)}</span><span class="count">${dept.useCaseCount || 0}</span></strong>
        <span>${domainCount ? `${domainCount} domains · ` : ""}${escapeHtml(dept.subtitle || dept.description || "")}</span>
      `;
      btn.addEventListener("click", () => {
        state.selectedDepartment = dept.id;
        selectedDomainId = null;
        state.selectedUseCaseId = "";
        state.interviewAnswers = {};
        setBuilderStep("source");
        renderDepartments();
        render();
      });
      departmentsEl.appendChild(btn);
    }
  }

  function render() {
    const dept = activeDepartment();
    const domains = departmentDomains();
    const allUseCases = departmentUseCases();
    const selected = activeUseCase();

    useCaseCountPill.textContent = `${dept?.useCaseCount || allUseCases.length || 0} use cases`;
    builderState.textContent = dept
      ? `${dept.label}${activeDomain() ? " → " + activeDomain().title : ""}: ${selected?.title || "choose a use case"}`
      : "Choose a department scenario, answer the interview, then generate.";

    useCasesEl.innerHTML = "";

    if (domains.length > 0) {
      renderDomainNav(domains);
      renderUseCaseList(activeDomain() ? useCasesForDomain(activeDomain()) : allUseCases);
    } else {
      renderUseCaseList(allUseCases.slice(0, 12));
    }

    interviewQuestionsEl.innerHTML = "";
    for (const q of state.interviewQuestions) {
      const wrap = document.createElement("div");
      wrap.className = "question";
      wrap.innerHTML = `
        <label for="q-${escapeHtml(q.id)}">${escapeHtml(q.label)}</label>
        <span>${escapeHtml(q.prompt)}</span>
        <input id="q-${escapeHtml(q.id)}" value="${escapeHtml(state.interviewAnswers[q.id] || "")}" placeholder="${escapeHtml(q.placeholder || "")}">
      `;
      wrap.querySelector("input").addEventListener("input", (e) => {
        state.interviewAnswers[q.id] = e.target.value;
        renderBriefPreview();
        renderSummaries();
        onUpdate();
      });
      interviewQuestionsEl.appendChild(wrap);
    }

    renderBriefPreview();
    renderSummaries();
    setBuilderStep(builderStep);
    onUpdate();
  }

  function renderDomainNav(domains) {
    const nav = document.createElement("div");
    nav.className = "domain-nav";

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `domain-pill ${!selectedDomainId ? "active" : ""}`;
    allBtn.textContent = "All";
    allBtn.addEventListener("click", () => {
      selectedDomainId = null;
      render();
    });
    nav.appendChild(allBtn);

    for (const domain of domains) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `domain-pill ${domain.id === selectedDomainId ? "active" : ""}`;
      btn.style.setProperty("--domain-color", domain.color || "var(--accent)");
      btn.innerHTML = `${escapeHtml(domain.title)} <span class="domain-pill-count">${domain.useCaseCount || 0}</span>`;
      btn.addEventListener("click", () => {
        selectedDomainId = domain.id;
        render();
      });
      nav.appendChild(btn);
    }

    useCasesEl.appendChild(nav);
  }

  function useCasesForDomain(domain) {
    if (!domain) return [];
    if (domain.useCases) return domain.useCases;
    const allUc = departmentUseCases();
    return allUc.filter((uc) => uc.domainId === domain.id || uc.domainId === `domain-${domain.domainNumber}`);
  }

  function renderUseCaseList(useCases) {
    const list = document.createElement("div");
    list.className = "usecase-grid";

    for (const uc of useCases) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `usecase-card ${uc.id === state.selectedUseCaseId ? "active" : ""}`;

      const kpiLine = (uc.kpis || []).slice(0, 2).map((k) => `${k.label}: ${k.before} → ${k.after}`).join(" · ");
      const systemsLine = (uc.systems || []).slice(0, 4).join(", ");
      const descLine = uc.description || "";

      btn.innerHTML = `
        <strong><span>${escapeHtml(uc.title)}</span></strong>
        ${uc.persona ? `<span class="meta">${escapeHtml(uc.persona)} · ${escapeHtml(uc.subtitle || uc.layer || "")}</span>` : ""}
        <span class="uc-desc">${escapeHtml(descLine || kpiLine || systemsLine)}</span>
      `;
      btn.addEventListener("click", () => {
        state.selectedUseCaseId = uc.id;
        setBuilderStep("source");
        render();
      });
      list.appendChild(btn);
    }

    if (useCases.length === 0) {
      list.innerHTML = `<div class="uc-empty">No use cases in this domain.</div>`;
    }

    useCasesEl.appendChild(list);
  }

  document.querySelectorAll("[data-builder-step]").forEach((button) => {
    button.addEventListener("click", () => setBuilderStep(button.dataset.builderStep));
  });
  builderToInterviewBtn.addEventListener("click", () => setBuilderStep("interview"));
  builderBackToSourceBtn.addEventListener("click", () => setBuilderStep("source"));
  builderToReviewBtn.addEventListener("click", () => setBuilderStep("review"));
  builderBackToInterviewBtn.addEventListener("click", () => setBuilderStep("interview"));
  setBuilderStep(builderStep);

  return {
    render,
    renderDepartments,
    renderBriefPreview,
    activeDepartment,
    activeUseCase,
    departmentUseCases,
    interviewCompletion,
    buildBrief,
  };
}
