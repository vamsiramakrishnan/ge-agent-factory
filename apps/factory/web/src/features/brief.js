export function buildAgentBrief({ department, useCase, interviewAnswers }) {
  if (!department || !useCase) return "Select a department and use case to build a brief.";
  const answer = (id, fallback) => (interviewAnswers[id] || fallback || "").trim();
  const systems = answer("systems", (useCase.systems || department.systems || []).slice(0, 6).join(", "));
  const success = answer("success", (useCase.kpis || []).map((kpi) => `${kpi.label}: ${kpi.before} -> ${kpi.after}`).join("; "));
  return [
    "Use the interviewing-specs, running-factory, building-simulators, checking-workspaces, and official google-agents-cli-adk-code skills.",
    "",
    "Generate a local-first Python ADK agent workspace from this GE transformation slide use case. Do not deploy, publish, or require Google auth. Mock all external systems deterministically.",
    "",
    `Department: ${department.label}`,
    `Use case: ${useCase.title}`,
    `Source slide: ${useCase.sourcePath}`,
    `Persona: ${useCase.persona || answer("sponsor", "business operator")}`,
    `Audience / sponsor: ${answer("sponsor", "not specified; infer from persona")}`,
    `Workflow moment: ${answer("workflow", useCase.triggerType || "operator asks for help")}`,
    `Systems to simulate with deterministic fixtures: ${systems}`,
    `Evidence to cite: ${answer("evidence", "SQL result, source-system record, and generated audit trail")}`,
    `Success metric: ${success || "before/after operational improvement from source slide"}`,
    "",
    "Source slide as-is:",
    ...(useCase.statusQuo || []).slice(0, 3).map((item) => `- ${item}`),
    "",
    "Source slide to-be:",
    ...(useCase.agentification || []).slice(0, 3).map((item) => `- ${item}`),
    "",
    "Required output:",
    "- pyproject.toml using uv conventions",
    "- app/agent.py with root_agent",
    "- app/tools.py with fixture-backed source adapters for each source system",
    "- deterministic fixture data and manifest",
    "- README with uv run/adk web/agents-cli commands",
    "- one smoke test or eval prompt that proves the KPI",
  ].join("\n");
}
