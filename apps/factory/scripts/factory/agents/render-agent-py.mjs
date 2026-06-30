// Renderer for the generated app/agent.py. Extracted from cmdTools (factory.mjs)
// verbatim — a pure function of the already-derived inputs (instruction text,
// quality plan, agent workflow topology). The single-agent path is byte-identical
// to the legacy emitter; the multi-agent path emits a SequentialAgent/ParallelAgent
// of stage sub-agents. The caller owns the derivation (renderAgentInstruction /
// buildAgentQualityPlan / deriveAgentWorkflow) and the agent-workflow.json sidecar;
// this module only assembles the Python source.

import { safePyName, snakeCase } from "@ge/std/naming";
import { pyEscape, pyTripleEscape } from "../tools/py-emit.mjs";
import { canonicalIntentToolName } from "../tools/tool-naming.mjs";

// Build the agent.py source string.
//   manifest, behaviorContract — generation inputs
//   instruction                — rendered _INSTRUCTION text (renderAgentInstruction)
//   qualityPlan                — buildAgentQualityPlan() result
//   workflow                   — deriveAgentWorkflow() result ({ topology, steps })
//   agentModel                 — model id every emitted Agent is pinned to
export function renderAgentPy({ manifest, behaviorContract, instruction, qualityPlan, workflow, agentModel }) {
  const writeToolNames = (behaviorContract?.toolIntents || [])
    .filter((intent) => ["action", "notification"].includes(intent?.kind))
    .map((intent) => safePyName(intent.name));
  const evidenceMinSystemsByTool = Object.fromEntries((behaviorContract?.toolIntents || [])
    .filter((intent) => ["action", "notification"].includes(intent?.kind))
    .map((intent) => {
      const toolName = safePyName(intent.name);
      const ruleText = [
        intent?.description,
        ...(behaviorContract?.escalationRules || []).map((rule) => `${rule?.trigger || ""} ${rule?.action || ""} ${rule?.rationale || ""}`),
        ...(behaviorContract?.hardGuardrails || []).map((rule) => typeof rule === "string" ? rule : JSON.stringify(rule)),
      ].join(" ");
      const minSystems = /(?:at least\s+)?two(?:-|\s+)system|two\s+systems|2\s+systems/i.test(ruleText) ? 2 : 0;
      return [toolName, minSystems];
    })
    .filter(([, minSystems]) => minSystems > 0));
  const requiredInputsByTool = Object.fromEntries((behaviorContract?.toolIntents || [])
    .filter((intent) => intent?.name)
    .map((intent) => [safePyName(intent.name), (intent.requiredInputs || []).map((input) => snakeCase(input))]));

  // Derive the agent topology from the upstream pipeline / explicit workflow.
  // topology === "single" emits byte-identical output to the legacy single-agent
  // path (default, must never regress). sequential/parallel emit a workflow of
  // sub-agents, each scoped to its stage's tools.
  const isMultiAgent = workflow.topology !== "single";
  const workflowAgentClass = workflow.topology === "parallel" ? "ParallelAgent" : "SequentialAgent";

  // Common header: imports + build-time design notes. The single-agent path keeps
  // the exact legacy import line and design note; the multi-agent path adds the
  // orchestration import and records the derived topology.
  const importLine = isMultiAgent
    ? `from google.adk.agents import Agent, ${workflowAgentClass}`
    : `from google.adk.agents import Agent`;
  const subAgentNote = isMultiAgent
    ? `# Topology   : ${workflow.topology} (${workflow.steps.length} stages, derived from architecture.pipeline)`
    : `# Sub-agents : ${String(qualityPlan.adkCapabilities.useSubAgentsWhen || "single agent").replace(/\s+/g, " ").slice(0, 200)}`;

  const headerLines = [
    importLine,
    `from google.adk.apps import App`,
    `from google.adk.agents.callback_context import CallbackContext`,
    `from google.genai import types as genai_types`,
    `from .tools import source_adapters`,
    ``,
    `# === Agent design (build-time notes — NOT part of the runtime prompt) ===`,
    `# Agent name : ${qualityPlan.naming.agentName}  (keep stable for evals / deployment metadata / GE registration)`,
    `# Model      : ${agentModel} @ temperature ${qualityPlan.adkCapabilities.generateContentConfig.temperature}`,
    `# Session    : scenario_id, primary_objective, expected_tools, evidence_log, audit_trails`,
    `# Callbacks  : initialize_workflow_state, enforce_tool_contract, capture_tool_evidence`,
    subAgentNote,
    ``,
    `_INSTRUCTION = """${pyTripleEscape(instruction)}"""`,
    `_SCENARIO_ID = "${pyEscape(manifest?.id || "generated")}"`,
    `_PRIMARY_OBJECTIVE = """${pyTripleEscape(behaviorContract?.primaryObjective || "Fixture-backed generated agent.")}"""`,
    `_EXPECTED_TOOLS = ${JSON.stringify((behaviorContract?.toolIntents || []).map((intent) => canonicalIntentToolName(intent, manifest?.tables || [])).filter(Boolean))}`,
    `_WRITE_TOOLS = ${JSON.stringify(writeToolNames)}`,
    `_REQUIRED_INPUTS_BY_TOOL = ${JSON.stringify(requiredInputsByTool)}`,
    `_EVIDENCE_MIN_SYSTEMS_BY_TOOL = ${JSON.stringify(evidenceMinSystemsByTool)}`,
    ``,
    `async def initialize_workflow_state(callback_context: CallbackContext) -> None:`,
    `    """Initialize session-scoped state used by evals, callbacks, and audit review."""`,
    `    state = callback_context.state`,
    `    state.setdefault("scenario_id", _SCENARIO_ID)`,
    `    state.setdefault("primary_objective", _PRIMARY_OBJECTIVE)`,
    `    state.setdefault("expected_tools", _EXPECTED_TOOLS)`,
    `    state.setdefault("evidence_log", [])`,
    `    state.setdefault("audit_trails", [])`,
    ``,
    `# ADK injects tool-callback args by keyword. before_tool_callback signature is`,
    `# (tool, args, tool_context); after_tool_callback adds tool_response. We accept`,
    `# **kwargs for forward-compatibility across ADK versions (result vs tool_response).`,
    `async def enforce_tool_contract(tool=None, args: dict = None, tool_context=None, **kwargs) -> dict | None:`,
    `    """Block unsafe write-like tool calls before they can mutate external state."""`,
    `    args = args or {}`,
    `    tool_name = getattr(tool, "name", tool)`,
    `    if tool_name in _WRITE_TOOLS:`,
    `        required = _REQUIRED_INPUTS_BY_TOOL.get(tool_name, [])`,
    `        missing = [key for key in required if args.get(key) in ("", None)]`,
    `        missing.extend([key for key, value in args.items() if value in ("", None) and key not in missing])`,
    `        idempotency = args.get("idempotency_key") or args.get("idempotencyKey")`,
    `        if missing:`,
    `            return {"error": "missing_required_inputs", "missing": missing, "tool": tool_name, "escalation": "request_more_info"}`,
    `        if ("idempotency_key" in args or "idempotencyKey" in args) and not idempotency:`,
    `            return {"error": "missing_idempotency_key", "tool": tool_name, "escalation": "request_confirmation"}`,
    `        min_systems = _EVIDENCE_MIN_SYSTEMS_BY_TOOL.get(tool_name, 0)`,
    `        if min_systems:`,
    `            state = getattr(tool_context, "state", {}) or {}`,
    `            evidence_log = state.get("evidence_log", [])`,
    `            systems = set()`,
    `            for entry in evidence_log:`,
    `                if not isinstance(entry, dict):`,
    `                    continue`,
    `                source = entry.get("source_system_id") or entry.get("source_system")`,
    `                if source:`,
    `                    systems.add(str(source).lower().replace(" ", "").replace("_", "").replace("/", ""))`,
    `            if len(systems) < min_systems:`,
    `                return {"error": "insufficient_evidence", "tool": tool_name, "required_source_systems": min_systems, "actual_source_systems": sorted(systems), "escalation": "refuse", "rationale": "Single-system evidence is insufficient to authorize external state changes without manual review."}`,
    `    return None`,
    ``,
    `async def capture_tool_evidence(tool=None, args: dict = None, tool_context=None, tool_response=None, **kwargs) -> dict | None:`,
    `    """Record source evidence and audit trails in session state without changing the tool result."""`,
    `    tool_name = getattr(tool, "name", tool)`,
    `    result = tool_response if tool_response is not None else kwargs.get("result")`,
    `    state = getattr(tool_context, "state", None)`,
    `    if state is None:`,
    `        return None`,
    `    evidence_log = state.setdefault("evidence_log", [])`,
    `    if isinstance(result, dict):`,
    `        evidence_log.append({`,
    `            "tool": tool_name,`,
    `            "source_system": result.get("source_system") or result.get("source_system_id"),`,
    `            "evidence": result.get("evidence"),`,
    `            "table": result.get("table"),`,
    `            "total": result.get("total"),`,
    `        })`,
    `        if result.get("audit_trail"):`,
    `            state.setdefault("audit_trails", []).append(result["audit_trail"])`,
    `    return None`,
    ``,
  ];

  // generate_content_config body shared by single + multi (sub-)agents. Inline
  // comment preserved so the single-agent path stays byte-identical to legacy.
  const generateConfigLines = [
    `    generate_content_config=genai_types.GenerateContentConfig(`,
    `        temperature=${qualityPlan.adkCapabilities.generateContentConfig.temperature},`,
    // Emit max_output_tokens only when the use case warrants a bound; otherwise
    // omit it so the agent uses the model's default budget (never the 2048 boilerplate).
    ...(qualityPlan.adkCapabilities.generateContentConfig.maxOutputTokens != null
      ? [`        max_output_tokens=${qualityPlan.adkCapabilities.generateContentConfig.maxOutputTokens},`]
      : []),
    `    ),`,
  ];

  let agentTail;
  if (!isMultiAgent) {
    // ── Single-agent path: byte-identical to the legacy emitter. ──
    agentTail = [
      `root_agent = Agent(`,
      `    name="${qualityPlan.naming.agentName}",`,
      `    model="${agentModel}",`,
      `    description="${pyEscape(qualityPlan.naming.displayName)}: ${pyEscape((behaviorContract?.primaryObjective || "Fixture-backed generated agent.").slice(0, 180))}",`,
      `    instruction=_INSTRUCTION,`,
      ...generateConfigLines,
      `    output_key="${qualityPlan.adkCapabilities.outputKey}",`,
      `    before_agent_callback=initialize_workflow_state,`,
      `    before_tool_callback=enforce_tool_contract,`,
      `    after_tool_callback=capture_tool_evidence,`,
      `    tools=source_adapters,`,
      `)`,
      ``,
      `app = App(root_agent=root_agent, name="app")`,
      ``,
    ];
  } else {
    // ── Multi-agent path: SequentialAgent/ParallelAgent of stage sub-agents. ──
    // Each sub-agent is scoped to its stage's tools via _pick(); tools.py is
    // unchanged (source_adapters stays the full list). The orchestration agent
    // (SequentialAgent/ParallelAgent) takes name/description/sub_agents only.
    const scenario = pyEscape(manifest?.id ? safePyName(manifest.id) : "generated");
    const subAgentVars = workflow.steps.map((step) => `${scenario}_${step.id}`);
    agentTail = [];
    // name -> tool object map + picker, so a sub-agent can request a tool subset
    // by name without re-deriving the FunctionTool list.
    agentTail.push(
      `# Resolve each tool by its runtime name (FunctionTool.name or the wrapped`,
      `# function's __name__) so stage sub-agents can claim a subset of source_adapters.`,
      `_TOOLS_BY_NAME = {getattr(t, "name", None) or getattr(getattr(t, "func", None), "__name__", None): t for t in source_adapters}`,
      ``,
      ``,
      `def _pick(*names):`,
      `    """Return the source_adapters tools matching the given names, preserving order."""`,
      `    return [_TOOLS_BY_NAME[n] for n in names if n in _TOOLS_BY_NAME]`,
      ``,
      ``,
    );
    workflow.steps.forEach((step, index) => {
      const varName = subAgentVars[index];
      const pickArgs = step.toolNames.map((name) => `"${pyEscape(name)}"`).join(", ");
      agentTail.push(
        `${varName} = Agent(`,
        `    name="${pyEscape(varName)}",`,
        `    model="${agentModel}",`,
        `    description="${pyEscape(step.label).slice(0, 180)}",`,
        `    instruction="""${pyTripleEscape(step.instruction)}""",`,
        ...generateConfigLines,
        // Distinct per-stage output_key so sequential stages don't clobber each
        // other and parallel branches don't collide on a shared key.
        `    output_key="${pyEscape(safePyName(`${step.id}_output`) || `${qualityPlan.adkCapabilities.outputKey}_${index}`)}",`,
        // initialize_workflow_state seeds shared session state. It is wired on
        // EVERY sub-agent: ParallelAgent branches do NOT share state, so each
        // branch must seed evidence_log/expected_tools itself (setdefault is
        // idempotent, so this is also safe for the sequential topology).
        `    before_agent_callback=initialize_workflow_state,`,
        `    before_tool_callback=enforce_tool_contract,`,
        `    after_tool_callback=capture_tool_evidence,`,
        `    tools=_pick(${pickArgs}),`,
        `)`,
        ``,
        ``,
      );
    });
    agentTail.push(
      `root_agent = ${workflowAgentClass}(`,
      `    name="${qualityPlan.naming.agentName}",`,
      `    description="${pyEscape(qualityPlan.naming.displayName)}: ${pyEscape((behaviorContract?.primaryObjective || "Fixture-backed generated agent.").slice(0, 180))}",`,
      `    sub_agents=[${subAgentVars.join(", ")}],`,
      `)`,
      ``,
      `app = App(root_agent=root_agent, name="app")`,
      ``,
    );
  }

  return [...headerLines, ...agentTail].join("\n");
}
