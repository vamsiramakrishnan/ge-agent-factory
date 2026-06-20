const CAPABILITY_KEYWORDS = {
  adk_build: ["adk", "agent", "gemini enterprise", "vertex", "google cloud", "cloud run", "mcp"],
  google_fluency: ["gemini", "vertex", "google", "adk", "cloud", "workspace"],
  implementation: ["build", "implement", "fix", "write", "create", "change", "patch", "refactor"],
  review: ["audit", "review", "risks", "regression", "security", "correctness"],
  testing: ["test", "verify", "validate", "validation", "gate", "gates", "smoke", "coverage", "eval"],
  planning: ["plan", "design", "architecture", "approach", "mechanism"],
  mock_data: ["mock data", "mock.generate", "scenario data", "fixture", "fixtures", "snowfakery", "data plan"],
  simulation: ["simulation", "simulator", "simulator.seed", "simulator.validate", "materialize simulator", "source-system simulator"],
};

export const PERMISSION_PROFILES = {
  review: {
    id: "review",
    label: "Review only",
    writeAllowed: false,
    description: "Read, inspect, and report findings. Do not edit files.",
  },
  workspace_write: {
    id: "workspace_write",
    label: "Workspace write",
    writeAllowed: true,
    description: "Edit only inside the assigned workspace or owned paths.",
  },
  full_auto: {
    id: "full_auto",
    label: "Full auto",
    writeAllowed: true,
    description: "Unattended execution for explicitly trusted local dev workflows.",
  },
};

const HARNESS_CAPABILITIES = {
  "antigravity-sdk": {
    primary: ["adk_build", "google_fluency", "planning", "implementation", "review", "testing", "mock_data", "simulation"],
    bestFor: "Programmatic Google Antigravity agent execution with SDK policies, hooks, structured outputs, subagents, and gateway-owned auth.",
  },
  agy: {
    primary: ["adk_build", "google_fluency", "planning", "implementation", "review", "mock_data", "simulation"],
    bestFor: "Google Antigravity agentic coding, ADK/Gemini Enterprise work, subagent-oriented repo reasoning, and keyring-backed local sessions.",
  },
  gemini: {
    primary: ["adk_build", "google_fluency", "planning", "implementation", "mock_data", "simulation"],
    bestFor: "Google, ADK, Gemini Enterprise, broad repo reasoning, and generation from fuzzy requirements.",
  },
  codex: {
    primary: ["implementation", "testing", "review"],
    bestFor: "Repo-native implementation, patch integration, tests, and constrained engineering changes.",
  },
  claude: {
    primary: ["review", "planning", "implementation"],
    bestFor: "Independent code review, refactoring critique, and high-signal written analysis.",
  },
  opencode: {
    primary: ["implementation", "testing"],
    bestFor: "Simple implementation tasks in a print-oriented CLI.",
  },
  mock: {
    primary: ["testing"],
    bestFor: "Deterministic local smoke tests when live harness CLIs are unavailable.",
  },
};

export function normalizePermissionProfile(value, fallback = "workspace_write") {
  const key = typeof value === "string" ? value.replaceAll("-", "_") : fallback;
  return PERMISSION_PROFILES[key] ? key : fallback;
}

export function capabilityForAgent(agentId) {
  return HARNESS_CAPABILITIES[agentId] || {
    primary: ["implementation"],
    bestFor: "Generic CLI harness execution.",
  };
}

export function inferRequestedCapabilities({ message = "", task = null } = {}) {
  const text = [
    message,
    task?.title,
    task?.goal,
    task?.description,
  ].filter(Boolean).join(" ").toLowerCase();
  const capabilities = new Set();
  for (const [capability, keywords] of Object.entries(CAPABILITY_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) capabilities.add(capability);
  }
  if (!capabilities.size) capabilities.add("implementation");
  return Array.from(capabilities);
}

export function chooseHarness({ agents, requestedAgentId, requestedCapabilities }) {
  const available = agents.filter((agent) => agent.available);
  const requested = agents.find((agent) => agent.id === requestedAgentId);
  if (requested?.available) return { agent: requested, fallbackFrom: null, reason: "requested_available" };

  const candidates = available.length ? available : agents.filter((agent) => agent.id === "mock");
  const scored = candidates.map((agent) => {
    const profile = capabilityForAgent(agent.id);
    const score = requestedCapabilities.reduce(
      (total, capability) => total + (profile.primary.includes(capability) ? 3 : 0),
      agent.id === "mock" ? -10 : 0,
    );
    return { agent, score };
  }).sort((a, b) => b.score - a.score || a.agent.id.localeCompare(b.agent.id));

  const agent = scored[0]?.agent || requested || agents[0];
  return {
    agent,
    fallbackFrom: requested && requested.id !== agent.id ? requested.id : null,
    reason: requested ? "requested_unavailable_fallback" : "capability_match",
  };
}

export function buildHarnessRunPlan({
  agents,
  requestedAgentId,
  message,
  task = null,
  permissionProfile,
  ownedPaths = [],
  avoidPaths = [],
}) {
  const requestedCapabilities = inferRequestedCapabilities({ message, task });
  const selection = chooseHarness({ agents, requestedAgentId, requestedCapabilities });
  const profileId = normalizePermissionProfile(
    permissionProfile,
    requestedCapabilities.includes("review") && !requestedCapabilities.includes("implementation") ? "review" : "workspace_write",
  );
  return {
    adapterId: selection.agent.id,
    adapterName: selection.agent.name,
    fallbackFrom: selection.fallbackFrom,
    selectionReason: selection.reason,
    requestedCapabilities,
    adapterCapabilities: capabilityForAgent(selection.agent.id),
    permissionProfile: PERMISSION_PROFILES[profileId],
    ownedPaths: Array.isArray(ownedPaths) ? ownedPaths.filter(Boolean) : [],
    avoidPaths: Array.isArray(avoidPaths) ? avoidPaths.filter(Boolean) : [],
  };
}

export function buildHandoffPacket({
  sender = "ge-harness-daemon",
  receiver,
  run,
  project,
  cwd,
  repoRoot,
  userRequest,
  task = null,
  plan,
}) {
  const ownedPaths = plan.ownedPaths.length ? plan.ownedPaths : [cwd];
  const avoidPaths = plan.avoidPaths.length ? plan.avoidPaths : ["unrelated user changes", ".harness/", "runs/"];
  const needsAgentQualityGate = plan.requestedCapabilities.some((capability) => (
    ["adk_build", "google_fluency", "testing"].includes(capability)
  ));
  return [
    "# Harness Handoff Packet",
    "",
    `Sender: ${sender}`,
    `Receiver: ${receiver}`,
    `Run ID: ${run.id}`,
    task?.id ? `Task ID: ${task.id}` : "Task ID: none",
    `Project: ${project.name} (${project.id})`,
    `Working directory: ${cwd}`,
    `Repository root: ${repoRoot}`,
    `Permission profile: ${plan.permissionProfile.id} - ${plan.permissionProfile.description}`,
    `Requested capabilities: ${plan.requestedCapabilities.join(", ")}`,
    `Adapter strengths: ${plan.adapterCapabilities.bestFor}`,
    plan.fallbackFrom ? `Fallback: requested ${plan.fallbackFrom}, selected ${plan.adapterId}` : "",
    "",
    "## Capability Skills",
    ...(Array.isArray(plan.skills) && plan.skills.length
      ? [
          "Read these local skill files before acting. Canonical sources may be repository GE skills under .gemini/skills or installed Google Agents CLI skills under the local Agents CLI skill root. The workspace mirror is provided for sandboxed harnesses. These instructions apply to every harness adapter, including Gemini CLI, Codex CLI, Claude Code, and any nested tool they invoke.",
          ...plan.skills.map((skill) => {
            const mirror = skill.workspaceRelativePath ? `; workspace mirror: ${skill.workspaceRelativePath}` : "";
            return `- ${skill.id}: ${skill.relativePath}${mirror}${skill.capability ? ` (${skill.capability})` : ""}`;
          }),
        ]
      : ["- none selected"]),
    "",
    "## Ownership",
    ...ownedPaths.map((path) => `- Own: ${path}`),
    ...avoidPaths.map((path) => `- Avoid: ${path}`),
    "",
    "## Collaboration Rules",
    "- You are not alone in this codebase. Preserve unrelated user and harness changes.",
    "- Keep edits inside owned paths unless the user request explicitly requires otherwise.",
    "- Prefer small, verifiable changes over broad rewrites.",
    "- Emit clear tool/action evidence in your final response.",
    needsAgentQualityGate ? "" : "",
    needsAgentQualityGate ? "## Spec-To-Code Quality Gate" : "",
    ...(needsAgentQualityGate ? [
      "- Treat `mock_systems/usecase-spec.json` and `fixtures/manifest.json` as the source of truth.",
      "- Prove each `behaviorContract.toolIntents[*].name` resolves to an implemented canonical Python tool and, when applicable, a `FunctionTool` in `source_adapters`.",
      "- Prove `app/agent.py` renders role, objective, scope, tool playbook, evidence requirements, escalation/refusal rules, and hard guardrails from the behavior contract.",
      "- Prove generated tools return source-system-specific evidence, not generic mock data, and preserve required inputs, produced IDs, evidence, and audit trails.",
      "- Prove `evals/golden.json` and `tests/eval/evalsets/ge_behavior_contract.evalset.json` mirror the behavior contract and expected tool trajectory.",
      "- Prove ADK runtime details are real: `root_agent`, deterministic generation config, output state, callback wiring, and callback signatures compatible with ADK keyword invocation.",
      "- Review point — model: confirm `app/agent.py` declares `model=\"gemini-3.5-flash\"`. Flag and fix any other model id.",
      "- Review point — output budget: decide `max_output_tokens` from the use case. Set an explicit bound only when the use case clearly needs one (long structured reports, multi-section synthesis); when it is hard to estimate, leave it unset so the model default applies. Never the 2048 boilerplate — if you find `max_output_tokens=2048`, remove it or replace it with a use-case-justified value.",
      "- Run or cite `ge validate <workspace-id>` / `ge-mock test --dir <workspace>` when available; otherwise state the exact blocker.",
    ] : []),
    "",
    "## Required Completion Packet",
    "Status: <done|blocked|failed>",
    `Sender: ${receiver}`,
    "Receiver: ge-harness-daemon",
    `Working directory: ${cwd}`,
    "Summary: <what changed or what you found>",
    "Files Changed: <paths or none>",
    "Verification: <commands and result, or not run with reason>",
    "Evidence: <artifact/test/diff references or none>",
    "Next Handoff: <what should happen next>",
    "Notes: <risks, assumptions, unresolved questions, or none>",
    "",
    task ? "## Assigned Task" : "",
    task ? `Title: ${task.title}` : "",
    task?.goal ? `Goal: ${task.goal}` : "",
    task?.description ? `Description:\n${task.description}` : "",
    "",
    "## User Request",
    userRequest,
  ].filter(Boolean).join("\n");
}
