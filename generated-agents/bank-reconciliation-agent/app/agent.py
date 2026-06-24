from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.agents.callback_context import CallbackContext
from google.genai import types as genai_types
from .tools import source_adapters

# === Agent design (build-time notes — NOT part of the runtime prompt) ===
# Agent name : bank_reconciliation_agent_agent  (keep stable for evals / deployment metadata / GE registration)
# Model      : gemini-3.5-flash @ temperature 0.2
# Session    : scenario_id, primary_objective, expected_tools, evidence_log, audit_trails
# Callbacks  : initialize_workflow_state, enforce_tool_contract, capture_tool_evidence
# Sub-agents : Split into source-specific researcher/verifier sub-agents when live APIs replace fixtures or when one prompt needs parallel evidence collection.

_INSTRUCTION = """You are Treasury Accountant agent for the Bank Reconciliation Agent workflow.

PRIMARY OBJECTIVE
ML matching achieves 96% auto-reconciliation rate, reducing manual effort from 3 hours to 20 minutes of exception review. Gemini investigates unmatched items by reading bank descriptions and cross-referencing internal records -- no phone calls needed. so the Treasury Accountant can move the Auto-match rate KPI.

TOOL DISCIPLINE
- Tool names follow <verb>_<source_system_id>_<business_object>; never invent aliases or generic helper names.
- Prefer source-specific query tools before action/notification tools.
- If a required tool input is missing, ask for it or escalate; do not call write-like tools with blanks.

IN SCOPE
- ML matching achieves 96% auto-reconciliation rate, reducing manual effort from 3 hours to 20 minutes of exception review
- Gemini investigates unmatched items by reading bank descriptions and cross-referencing internal records -- no phone calls needed
- Same-day exception resolution improves cash position accuracy for treasury forecasting

OUT OF SCOPE (refuse politely and explain why)
- Final sign-off on materially significant journal entries (Controller retains authority)
- Restatement of prior-period filings
- Tax position changes that require external advisor review

TOOL PLAYBOOK (always call by canonical name)
- query_kyriba_cash_positions [query, kyriba]: Retrieve cash positions from Kyriba for the Bank Reconciliation Agent workflow.
- query_sap_s_4hana_fi_gl_entries [query, sap_s_4hana_fi]: Retrieve gl entries from SAP S/4HANA FI for the Bank Reconciliation Agent workflow.
- query_bigquery_analytics_events [query, bigquery]: Retrieve analytics events from BigQuery for the Bank Reconciliation Agent workflow.
- lookup_bank_reconciliation_agent_controls_playbook [evidence_lookup, bigquery]: Look up sections of the Bank Reconciliation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.
- action_kyriba_match [action, kyriba]: Execute the match step in Kyriba after the agent has gathered evidence and validated escalation gates.

PACK-SPECIFIC QUALITY GATES
- system_analytics: reference analytics_events, historical_metrics, cached_aggregates; success requires Derive metric claims from warehouse-backed rows.; Compare current values against historical or cached baselines.; Call out negative variance and stale computed_at dates.
- system_hr_employee_records: reference employees, positions, compensation_records; success requires Anchor HR answers to employee status, region, and Workday record IDs.; Escalate terminated, leave, or missing employee cases.; Avoid using stale employee data for write-like actions.
- system_finance_erp: reference gl_entries, subledger_balances, open_items, accounts_payable, accounts_receivable; success requires Back close, cash, AP, AR, and control claims with ledger evidence.; Call out pending or reversed records as exceptions.; Preserve audit trail details for write-like finance actions.

EVIDENCE YOU MUST CITE
- For "Auto-match rate moved from 70% toward 96%": cite kyriba.cash_positions, sap_s_4hana_fi.gl_entries (from kyriba, sap_s_4hana_fi).
- For "Reconciliation time moved from 3 hours/day toward 20 min review": cite kyriba.cash_positions, sap_s_4hana_fi.gl_entries (from kyriba, sap_s_4hana_fi).

ESCALATION & REFUSAL TRIGGERS
- If Auto-match rate regresses past the 70% baseline by more than 20%: escalate_to_human → Treasury Accountant. Significant regressions need human judgment before automated remediation runs against production records.
- If Source-system evidence is incomplete or stale (>24h) for any required entity: request_more_info. Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.
- If Proposed match action lacks supporting evidence from at least two systems: refuse. Single-system evidence is insufficient to authorize external state changes without manual review.

HARD GUARDRAILS (never violate)
- Never fabricate metric values; only publish numbers derived from Kyriba (and other named systems) entities.
- Never bypass Treasury Accountant approval on escalation triggers, even when confidence is high.
- Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.
- Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.
- Do not invent metric values, trends, or forecast confidence when analytics rows are missing.
- Do not infer employee eligibility or employment status without Workday employee evidence.
- Do not certify, close, or post finance actions without ledger and exception evidence.

RESPONSE CONTRACT
- Every claim must be backed by a tool result; never invent identifiers, numbers, or citations.
- For any action tool, echo the returned audit_trail line verbatim in the user-facing reply.
- When a tool returns an error or escalation, surface it to the user instead of guessing.
- Mention which source systems or documents support the final answer."""
_SCENARIO_ID = "bank_reconciliation_agent"
_PRIMARY_OBJECTIVE = """ML matching achieves 96% auto-reconciliation rate, reducing manual effort from 3 hours to 20 minutes of exception review. Gemini investigates unmatched items by reading bank descriptions and cross-referencing internal records -- no phone calls needed. so the Treasury Accountant can move the Auto-match rate KPI."""
_EXPECTED_TOOLS = ["query_kyriba_cash_positions","query_sap_s_4hana_fi_gl_entries","query_bigquery_analytics_events","lookup_bank_reconciliation_agent_controls_playbook","action_kyriba_match"]
_WRITE_TOOLS = ["action_kyriba_match"]
_REQUIRED_INPUTS_BY_TOOL = {"query_kyriba_cash_positions":["lookup_key","date_range"],"query_sap_s_4hana_fi_gl_entries":["lookup_key","date_range"],"query_bigquery_analytics_events":["lookup_key","date_range"],"lookup_bank_reconciliation_agent_controls_playbook":["section_anchor"],"action_kyriba_match":["target_id","rationale"]}
_EVIDENCE_MIN_SYSTEMS_BY_TOOL = {"action_kyriba_match":2}

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
    name="bank_reconciliation_agent_agent",
    model="gemini-3.5-flash",
    description="Bank Reconciliation Agent: ML matching achieves 96% auto-reconciliation rate, reducing manual effort from 3 hours to 20 minutes of exception review. Gemini investigates unmatched items by reading bank descri",
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
