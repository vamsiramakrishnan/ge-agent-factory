from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.agents.callback_context import CallbackContext
from google.genai import types as genai_types
from .tools import source_adapters

# === Agent design (build-time notes — NOT part of the runtime prompt) ===
# Agent name : audit_finding_tracker_agent  (keep stable for evals / deployment metadata / GE registration)
# Model      : gemini-3.5-flash @ temperature 0.2
# Session    : scenario_id, primary_objective, expected_tools, evidence_log, audit_trails
# Callbacks  : initialize_workflow_state, enforce_tool_contract, capture_tool_evidence
# Sub-agents : Split into source-specific researcher/verifier sub-agents when live APIs replace fixtures or when one prompt needs parallel evidence collection.

_INSTRUCTION = """You are Chief Audit Executive agent for the Audit Finding Tracker workflow.

PRIMARY OBJECTIVE
Automated deadline tracking with escalation ensures findings don't age without action. Gemini evaluates whether remediation plans address root cause or just treat symptoms. so the Chief Audit Executive can move the Avg remediation time KPI.

TOOL DISCIPLINE
- Tool names follow <verb>_<source_system_id>_<business_object>; never invent aliases or generic helper names.
- Prefer source-specific query tools before action/notification tools.
- If a required tool input is missing, ask for it or escalate; do not call write-like tools with blanks.

IN SCOPE
- Automated deadline tracking with escalation ensures findings don't age without action
- Gemini evaluates whether remediation plans address root cause or just treat symptoms
- Pattern detection across historical findings surfaces systemic issues requiring enterprise-level intervention

OUT OF SCOPE (refuse politely and explain why)
- Final sign-off on materially significant journal entries (Controller retains authority)
- Restatement of prior-period filings
- Tax position changes that require external advisor review

TOOL PLAYBOOK (always call by canonical name)
- query_auditboard_auditboard_records [query, auditboard]: Retrieve auditboard records from AuditBoard for the Audit Finding Tracker workflow.
- query_servicenow_tickets [query, servicenow]: Retrieve tickets from ServiceNow for the Audit Finding Tracker workflow.
- query_finance_3_finance_3_records [query, finance_3]: Retrieve finance 3 records from FINANCE 3 for the Audit Finding Tracker workflow.
- lookup_audit_finding_tracker_controls_playbook [evidence_lookup, auditboard]: Look up sections of the Audit Finding Tracker Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.
- action_auditboard_execute [action, auditboard]: Execute the execute step in AuditBoard after the agent has gathered evidence and validated escalation gates.

PACK-SPECIFIC QUALITY GATES
- system_itsm: reference tickets, incidents, change_requests; success requires Use status, owner, created_at, and notes to prioritize remediation.; Treat active or pending SLA-risk records as escalation candidates.; Preserve audit trails for remediation actions.

EVIDENCE YOU MUST CITE
- For "Avg remediation time moved from 90-120 days toward 30-45 days": cite auditboard.auditboard_records, servicenow.tickets (from auditboard, servicenow).
- For "Overdue findings moved from 25-35% toward < 10%": cite auditboard.auditboard_records, servicenow.tickets (from auditboard, servicenow).

ESCALATION & REFUSAL TRIGGERS
- If Avg remediation time regresses past the 90-120 days baseline by more than 20%: escalate_to_human → Chief Audit Executive. Significant regressions need human judgment before automated remediation runs against production records.
- If Source-system evidence is incomplete or stale (>24h) for any required entity: request_more_info. Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.
- If Proposed execute action lacks supporting evidence from at least two systems: refuse. Single-system evidence is insufficient to authorize external state changes without manual review.

HARD GUARDRAILS (never violate)
- Never fabricate metric values; only publish numbers derived from AuditBoard (and other named systems) entities.
- Never bypass Chief Audit Executive approval on escalation triggers, even when confidence is high.
- Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.
- Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.
- Do not claim an incident is remediated or closed without ITSM status evidence.

RESPONSE CONTRACT
- Every claim must be backed by a tool result; never invent identifiers, numbers, or citations.
- For any action tool, echo the returned audit_trail line verbatim in the user-facing reply.
- When a tool returns an error or escalation, surface it to the user instead of guessing.
- Mention which source systems or documents support the final answer."""
_SCENARIO_ID = "audit_finding_tracker"
_PRIMARY_OBJECTIVE = """Automated deadline tracking with escalation ensures findings don't age without action. Gemini evaluates whether remediation plans address root cause or just treat symptoms. so the Chief Audit Executive can move the Avg remediation time KPI."""
_EXPECTED_TOOLS = ["query_auditboard_records","query_servicenow_tickets","query_finance_3_records","lookup_audit_finding_tracker_controls_playbook","action_auditboard_execute"]
_WRITE_TOOLS = ["action_auditboard_execute"]
_REQUIRED_INPUTS_BY_TOOL = {"query_auditboard_auditboard_records":["lookup_key","date_range"],"query_servicenow_tickets":["lookup_key","date_range"],"query_finance_3_finance_3_records":["lookup_key","date_range"],"lookup_audit_finding_tracker_controls_playbook":["section_anchor"],"action_auditboard_execute":["target_id","rationale"]}
_EVIDENCE_MIN_SYSTEMS_BY_TOOL = {"action_auditboard_execute":2}

async def initialize_workflow_state(callback_context: CallbackContext) -> None:
    """Initialize session-scoped state used by evals, callbacks, and audit review."""
    state = callback_context.state
    state.setdefault("scenario_id", _SCENARIO_ID)
    state.setdefault("primary_objective", _PRIMARY_OBJECTIVE)
    state.setdefault("expected_tools", _EXPECTED_TOOLS)
    state.setdefault("evidence_log", [])
    state.setdefault("audit_trails", [])

# ADK injects tool-callback args by keyword. before_tool_callback signature is
# (tool, args, tool_context); after_tool_callback adds tool_response. We accept
# **kwargs for forward-compatibility across ADK versions (result vs tool_response).
async def enforce_tool_contract(tool=None, args: dict = None, tool_context=None, **kwargs) -> dict | None:
    """Block unsafe write-like tool calls before they can mutate external state."""
    args = args or {}
    tool_name = getattr(tool, "name", tool)
    if tool_name in _WRITE_TOOLS:
        required = _REQUIRED_INPUTS_BY_TOOL.get(tool_name, [])
        missing = [key for key in required if args.get(key) in ("", None)]
        missing.extend([key for key, value in args.items() if value in ("", None) and key not in missing])
        idempotency = args.get("idempotency_key") or args.get("idempotencyKey")
        if missing:
            return {"error": "missing_required_inputs", "missing": missing, "tool": tool_name, "escalation": "request_more_info"}
        if ("idempotency_key" in args or "idempotencyKey" in args) and not idempotency:
            return {"error": "missing_idempotency_key", "tool": tool_name, "escalation": "request_confirmation"}
        min_systems = _EVIDENCE_MIN_SYSTEMS_BY_TOOL.get(tool_name, 0)
        if min_systems:
            state = getattr(tool_context, "state", {}) or {}
            evidence_log = state.get("evidence_log", [])
            systems = set()
            for entry in evidence_log:
                if not isinstance(entry, dict):
                    continue
                source = entry.get("source_system_id") or entry.get("source_system")
                if source:
                    systems.add(str(source).lower().replace(" ", "").replace("_", "").replace("/", ""))
            if len(systems) < min_systems:
                return {"error": "insufficient_evidence", "tool": tool_name, "required_source_systems": min_systems, "actual_source_systems": sorted(systems), "escalation": "refuse", "rationale": "Single-system evidence is insufficient to authorize external state changes without manual review."}
    return None

async def capture_tool_evidence(tool=None, args: dict = None, tool_context=None, tool_response=None, **kwargs) -> dict | None:
    """Record source evidence and audit trails in session state without changing the tool result."""
    tool_name = getattr(tool, "name", tool)
    result = tool_response if tool_response is not None else kwargs.get("result")
    state = getattr(tool_context, "state", None)
    if state is None:
        return None
    evidence_log = state.setdefault("evidence_log", [])
    if isinstance(result, dict):
        evidence_log.append({
            "tool": tool_name,
            "source_system": result.get("source_system") or result.get("source_system_id"),
            "evidence": result.get("evidence"),
            "table": result.get("table"),
            "total": result.get("total"),
        })
        if result.get("audit_trail"):
            state.setdefault("audit_trails", []).append(result["audit_trail"])
    return None

root_agent = Agent(
    name="audit_finding_tracker_agent",
    model="gemini-3.5-flash",
    description="Audit Finding Tracker: Automated deadline tracking with escalation ensures findings don't age without action. Gemini evaluates whether remediation plans address root cause or just treat symptoms. so the ",
    instruction=_INSTRUCTION,
    generate_content_config=genai_types.GenerateContentConfig(
        temperature=0.2,
    ),
    output_key="last_response",
    before_agent_callback=initialize_workflow_state,
    before_tool_callback=enforce_tool_contract,
    after_tool_callback=capture_tool_evidence,
    tools=source_adapters,
)

app = App(root_agent=root_agent, name="app")
