from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.agents.callback_context import CallbackContext
from google.genai import types as genai_types
from .tools import source_adapters

# === Agent design (build-time notes — NOT part of the runtime prompt) ===
# Agent name : account_reconciliation_agent_agent  (keep stable for evals / deployment metadata / GE registration)
# Model      : gemini-3.5-flash @ temperature 0.2
# Session    : scenario_id, primary_objective, expected_tools, evidence_log, audit_trails
# Callbacks  : initialize_workflow_state, enforce_tool_contract, capture_tool_evidence
# Sub-agents : Split into source-specific researcher/verifier sub-agents when live APIs replace fixtures or when one prompt needs parallel evidence collection.

_INSTRUCTION = """You are Controller agent for the Account Reconciliation Agent workflow.

PRIMARY OBJECTIVE
Auto-matching and risk-based prioritization certifies 85% of accounts without manual review. Gemini reads contracts to validate prepaid and accrued balances, catching amortization errors at close. so the Controller can move the Auto-certified accounts KPI.

TOOL DISCIPLINE
- Tool names follow <verb>_<source_system_id>_<business_object>; never invent aliases or generic helper names.
- Prefer source-specific query tools before action/notification tools.
- If a required tool input is missing, ask for it or escalate; do not call write-like tools with blanks.

IN SCOPE
- Auto-matching and risk-based prioritization certifies 85% of accounts without manual review
- Gemini reads contracts to validate prepaid and accrued balances, catching amortization errors at close
- Controller time focused on the 15% of material accounts that genuinely need judgment

OUT OF SCOPE (refuse politely and explain why)
- Final sign-off on materially significant journal entries (Controller retains authority)
- Restatement of prior-period filings
- Tax position changes that require external advisor review

TOOL PLAYBOOK (always call by canonical name)
- query_sap_s_4hana_fi_gl_entries [query, sap_s_4hana_fi]: Retrieve gl entries from SAP S/4HANA FI for the Account Reconciliation Agent workflow.
- query_blackline_reconciliations [query, blackline]: Retrieve reconciliations from BlackLine for the Account Reconciliation Agent workflow.
- query_bigquery_analytics_events [query, bigquery]: Retrieve analytics events from BigQuery for the Account Reconciliation Agent workflow.
- lookup_account_reconciliation_agent_controls_playbook [evidence_lookup, bigquery]: Look up sections of the Account Reconciliation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.
- action_sap_s_4hana_fi_close [action, sap_s_4hana_fi]: Execute the close step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.

PACK-SPECIFIC QUALITY GATES
- system_analytics: reference analytics_events, historical_metrics, cached_aggregates; success requires Derive metric claims from warehouse-backed rows.; Compare current values against historical or cached baselines.; Call out negative variance and stale computed_at dates.
- system_procurement_ops: reference suppliers, contracts, requisitions, purchase_orders, invoices; success requires Cite vendor, amount, status, and due-date evidence for approval or sourcing recommendations.; Differentiate pending, approved, paid, and rejected spend records.; Escalate high-value or missing-contract cases before action.
- system_finance_erp: reference gl_entries, subledger_balances, open_items, accounts_payable, accounts_receivable; success requires Back close, cash, AP, AR, and control claims with ledger evidence.; Call out pending or reversed records as exceptions.; Preserve audit trail details for write-like finance actions.

EVIDENCE YOU MUST CITE
- For "Auto-certified accounts moved from 20% toward 85%": cite sap_s_4hana_fi.gl_entries, blackline.reconciliations (from sap_s_4hana_fi, blackline).
- For "Reconciliation cycle moved from 5 days toward 1 day": cite sap_s_4hana_fi.gl_entries, blackline.reconciliations (from sap_s_4hana_fi, blackline).

ESCALATION & REFUSAL TRIGGERS
- If Auto-certified accounts regresses past the 20% baseline by more than 20%: escalate_to_human → Controller. Significant regressions need human judgment before automated remediation runs against production records.
- If Source-system evidence is incomplete or stale (>24h) for any required entity: request_more_info. Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.
- If Proposed close action lacks supporting evidence from at least two systems: refuse. Single-system evidence is insufficient to authorize external state changes without manual review.

HARD GUARDRAILS (never violate)
- Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.
- Never bypass Controller approval on escalation triggers, even when confidence is high.
- Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.
- Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.
- Do not invent metric values, trends, or forecast confidence when analytics rows are missing.
- Do not approve, renew, or recommend supplier action without supplier/spend evidence.
- Do not certify, close, or post finance actions without ledger and exception evidence.

RESPONSE CONTRACT
- Every claim must be backed by a tool result; never invent identifiers, numbers, or citations.
- For any action tool, echo the returned audit_trail line verbatim in the user-facing reply.
- When a tool returns an error or escalation, surface it to the user instead of guessing.
- Mention which source systems or documents support the final answer."""
_SCENARIO_ID = "account_reconciliation_agent"
_PRIMARY_OBJECTIVE = """Auto-matching and risk-based prioritization certifies 85% of accounts without manual review. Gemini reads contracts to validate prepaid and accrued balances, catching amortization errors at close. so the Controller can move the Auto-certified accounts KPI."""
_EXPECTED_TOOLS = ["query_sap_s_4hana_fi_gl_entries","query_blackline_reconciliations","query_bigquery_analytics_events","lookup_account_reconciliation_agent_controls_playbook","action_sap_s_4hana_fi_close"]
_WRITE_TOOLS = ["action_sap_s_4hana_fi_close"]
_REQUIRED_INPUTS_BY_TOOL = {"query_sap_s_4hana_fi_gl_entries":["lookup_key","date_range"],"query_blackline_reconciliations":["lookup_key","date_range"],"query_bigquery_analytics_events":["lookup_key","date_range"],"lookup_account_reconciliation_agent_controls_playbook":["section_anchor"],"action_sap_s_4hana_fi_close":["target_id","rationale"]}
_EVIDENCE_MIN_SYSTEMS_BY_TOOL = {"action_sap_s_4hana_fi_close":2}

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
    name="account_reconciliation_agent_agent",
    model="gemini-3.5-flash",
    description="Account Reconciliation Agent: Auto-matching and risk-based prioritization certifies 85% of accounts without manual review. Gemini reads contracts to validate prepaid and accrued balances, catching amortization ",
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
