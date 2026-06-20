"""Auto-generated fixture-backed tools for: ar_aging_dso_analyzer"""
from __future__ import annotations
import csv, hashlib, json, os
from pathlib import Path
from typing import Any
from google.adk.tools import FunctionTool

FIXTURES = Path(os.environ.get("FIXTURES_ROOT", str(Path(__file__).resolve().parent.parent / "fixtures")))
ACTION_EVENTS_DEFAULT = Path(__file__).resolve().parent.parent / "artifacts" / "action-events.jsonl"

def _json(p: str) -> Any: return json.loads((FIXTURES / p).read_text())
def _csv(p: str, n: int = 100) -> list[dict]:
    with (FIXTURES / p).open(newline="") as f: return list(csv.DictReader(f))[:n]
def _action_events_path() -> Path:
    return Path(os.environ.get("ACTION_EVENTS_PATH", str(ACTION_EVENTS_DEFAULT)))
def _append_action_event(tool_name: str, result: dict[str, Any]) -> None:
    ACTION_EVENTS = _action_events_path()
    ACTION_EVENTS.parent.mkdir(parents=True, exist_ok=True)
    with ACTION_EVENTS.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"tool": tool_name, **result}, sort_keys=True) + "\n")

_CONTRACT_DOCUMENTS = [{"id":"ar-aging-dso-analyzer-controls-playbook","title":"AR Aging & DSO Analyzer Controls Playbook","type":"policy","path":"documents/ar-aging-dso-analyzer-controls-playbook.md","source_system_id":"bigquery"}]

def _deterministic_id(prefix: str, *parts: Any) -> str:
    """Stable identifier for action tools — keeps audit trails reproducible without external state."""
    payload = "|".join(str(p) for p in parts if p is not None and p != "")
    digest = hashlib.sha1(payload.encode("utf-8")).hexdigest()[:10].upper() if payload else "EMPTY00000"
    return f"{prefix}-{digest}"

_SEMANTIC_MODEL_PATH = Path(__file__).resolve().parent.parent / "mock_data" / "metadata" / "semantic-model.json"

def describe_data_model() -> dict[str, Any]:
    """Return the semantic data model (tables, columns, descriptions, joins, measures,
    glossary) for grounding NL→SQL and choosing the right table/measure before querying."""
    try:
        return json.loads(_SEMANTIC_MODEL_PATH.read_text())
    except Exception:
        return {"error": "semantic model not found", "path": str(_SEMANTIC_MODEL_PATH)}

def list_systems() -> dict[str, Any]:
    """List canonical source systems, tables, and evidence documents for this scenario."""
    return {"scenario": "ar_aging_dso_analyzer", "systems": [{"id":"sap_s_4hana_fi","name":"SAP S/4HANA FI","owns":["gl_entries","subledger_balances","open_items"],"protocol":"RFC/BAPI","localBacking":["alloydb"],"toolNames":["query_sap_s_4hana_fi_gl_entries","query_sap_s_4hana_fi_subledger_balances","query_sap_s_4hana_fi_open_items"],"evidence":["source_system_record","generated_audit_trail"]},{"id":"bigquery","name":"BigQuery","owns":["analytics_events","historical_metrics","cached_aggregates"],"protocol":"BigQuery SQL","localBacking":["bigquery"],"toolNames":["query_bigquery_analytics_events","query_bigquery_historical_metrics","query_bigquery_cached_aggregates"],"evidence":["source_system_record","generated_audit_trail"]},{"id":"looker","name":"Looker","owns":["dashboards","explore_queries","metric_definitions"],"protocol":"LookerML","localBacking":["bigquery"],"toolNames":["query_looker_dashboards","query_looker_explore_queries","query_looker_metric_definitions"],"evidence":["source_system_record","generated_audit_trail"]}], "tables": [{"name":"gl_entries","sourceSystem":"SAP S/4HANA FI","sourceSystemId":"sap_s_4hana_fi"},{"name":"subledger_balances","sourceSystem":"SAP S/4HANA FI","sourceSystemId":"sap_s_4hana_fi"},{"name":"open_items","sourceSystem":"SAP S/4HANA FI","sourceSystemId":"sap_s_4hana_fi"},{"name":"analytics_events","sourceSystem":"BigQuery","sourceSystemId":"bigquery"},{"name":"historical_metrics","sourceSystem":"BigQuery","sourceSystemId":"bigquery"},{"name":"cached_aggregates","sourceSystem":"BigQuery","sourceSystemId":"bigquery"},{"name":"dashboards","sourceSystem":"Looker","sourceSystemId":"looker"},{"name":"explore_queries","sourceSystem":"Looker","sourceSystemId":"looker"},{"name":"metric_definitions","sourceSystem":"Looker","sourceSystemId":"looker"}]}

def query_sap_s_4hana_fi_gl_entries(lookup_key: str = "", date_range: str = "", id: str = "", posting_date: str = "", account: str = "", currency: str = "", description: str = "", status: str = "", limit: int = 20) -> dict[str, Any]:
    """Query SAP S/4HANA FI gl_entries. Columns: id, posting_date, account, amount, currency, description, status."""
    rows = _json("tables/gl_entries.json")
    if lookup_key:
        needle = lookup_key.lower()
        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]
    if date_range:
        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if posting_date: rows = [r for r in rows if str(r.get("posting_date","")).lower() == posting_date.lower()]
    if account: rows = [r for r in rows if str(r.get("account","")).lower() == account.lower()]
    if currency: rows = [r for r in rows if str(r.get("currency","")).lower() == currency.lower()]
    if description: rows = [r for r in rows if str(r.get("description","")).lower() == description.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    return {"source_system": "SAP S/4HANA FI", "source_system_id": "sap_s_4hana_fi", "table": "gl_entries", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["gl_entries_records","gl_entries_summary"], "evidence": ["source_system_record"]}

def query_sap_s_4hana_fi_subledger_balances(id: str = "", posting_date: str = "", account: str = "", currency: str = "", description: str = "", status: str = "", limit: int = 20) -> dict[str, Any]:
    """Query SAP S/4HANA FI subledger_balances. Columns: id, posting_date, account, amount, currency, description, status."""
    rows = _json("tables/subledger_balances.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if posting_date: rows = [r for r in rows if str(r.get("posting_date","")).lower() == posting_date.lower()]
    if account: rows = [r for r in rows if str(r.get("account","")).lower() == account.lower()]
    if currency: rows = [r for r in rows if str(r.get("currency","")).lower() == currency.lower()]
    if description: rows = [r for r in rows if str(r.get("description","")).lower() == description.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    return {"source_system": "SAP S/4HANA FI", "source_system_id": "sap_s_4hana_fi", "table": "subledger_balances", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["subledger_balances_records","subledger_balances_summary"], "evidence": ["source_system_record"]}

def query_sap_s_4hana_fi_open_items(id: str = "", posting_date: str = "", account: str = "", currency: str = "", description: str = "", status: str = "", limit: int = 20) -> dict[str, Any]:
    """Query SAP S/4HANA FI open_items. Columns: id, posting_date, account, amount, currency, description, status."""
    rows = _json("tables/open_items.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if posting_date: rows = [r for r in rows if str(r.get("posting_date","")).lower() == posting_date.lower()]
    if account: rows = [r for r in rows if str(r.get("account","")).lower() == account.lower()]
    if currency: rows = [r for r in rows if str(r.get("currency","")).lower() == currency.lower()]
    if description: rows = [r for r in rows if str(r.get("description","")).lower() == description.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    return {"source_system": "SAP S/4HANA FI", "source_system_id": "sap_s_4hana_fi", "table": "open_items", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["open_items_records","open_items_summary"], "evidence": ["source_system_record"]}

def query_bigquery_analytics_events(lookup_key: str = "", date_range: str = "", id: str = "", period: str = "", metric_name: str = "", computed_at: str = "", historical_metric_id: str = "", limit: int = 20) -> dict[str, Any]:
    """Query BigQuery analytics_events. Columns: id, period, metric_name, value, variance_pct, computed_at, historical_metric_id."""
    rows = _json("tables/analytics_events.json")
    if lookup_key:
        needle = lookup_key.lower()
        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]
    if date_range:
        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if period: rows = [r for r in rows if str(r.get("period","")).lower() == period.lower()]
    if metric_name: rows = [r for r in rows if str(r.get("metric_name","")).lower() == metric_name.lower()]
    if computed_at: rows = [r for r in rows if str(r.get("computed_at","")).lower() == computed_at.lower()]
    if historical_metric_id: rows = [r for r in rows if str(r.get("historical_metric_id","")).lower() == historical_metric_id.lower()]
    return {"source_system": "BigQuery", "source_system_id": "bigquery", "table": "analytics_events", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["analytics_events_records","analytics_events_summary"], "evidence": ["sql_result"]}

def query_bigquery_historical_metrics(id: str = "", period: str = "", metric_name: str = "", computed_at: str = "", limit: int = 20) -> dict[str, Any]:
    """Query BigQuery historical_metrics. Columns: id, period, metric_name, value, variance_pct, computed_at."""
    rows = _json("tables/historical_metrics.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if period: rows = [r for r in rows if str(r.get("period","")).lower() == period.lower()]
    if metric_name: rows = [r for r in rows if str(r.get("metric_name","")).lower() == metric_name.lower()]
    if computed_at: rows = [r for r in rows if str(r.get("computed_at","")).lower() == computed_at.lower()]
    return {"source_system": "BigQuery", "source_system_id": "bigquery", "table": "historical_metrics", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["historical_metrics_records","historical_metrics_summary"], "evidence": ["source_system_record"]}

def query_bigquery_cached_aggregates(id: str = "", period: str = "", metric_name: str = "", computed_at: str = "", limit: int = 20) -> dict[str, Any]:
    """Query BigQuery cached_aggregates. Columns: id, period, metric_name, value, variance_pct, computed_at."""
    rows = _json("tables/cached_aggregates.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if period: rows = [r for r in rows if str(r.get("period","")).lower() == period.lower()]
    if metric_name: rows = [r for r in rows if str(r.get("metric_name","")).lower() == metric_name.lower()]
    if computed_at: rows = [r for r in rows if str(r.get("computed_at","")).lower() == computed_at.lower()]
    return {"source_system": "BigQuery", "source_system_id": "bigquery", "table": "cached_aggregates", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["cached_aggregates_records","cached_aggregates_summary"], "evidence": ["source_system_record"]}

def query_looker_dashboards(lookup_key: str = "", date_range: str = "", id: str = "", period: str = "", metric_name: str = "", computed_at: str = "", limit: int = 20) -> dict[str, Any]:
    """Query Looker dashboards. Columns: id, period, metric_name, value, variance_pct, computed_at."""
    rows = _json("tables/dashboards.json")
    if lookup_key:
        needle = lookup_key.lower()
        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]
    if date_range:
        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if period: rows = [r for r in rows if str(r.get("period","")).lower() == period.lower()]
    if metric_name: rows = [r for r in rows if str(r.get("metric_name","")).lower() == metric_name.lower()]
    if computed_at: rows = [r for r in rows if str(r.get("computed_at","")).lower() == computed_at.lower()]
    return {"source_system": "Looker", "source_system_id": "looker", "table": "dashboards", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["dashboards_records","dashboards_summary"], "evidence": ["sql_result"]}

def query_looker_explore_queries(id: str = "", source_record_id: str = "", status: str = "", owner: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query Looker explore_queries. Columns: id, source_record_id, status, owner, created_at, notes."""
    rows = _json("tables/explore_queries.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if source_record_id: rows = [r for r in rows if str(r.get("source_record_id","")).lower() == source_record_id.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    if owner: rows = [r for r in rows if str(r.get("owner","")).lower() == owner.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "Looker", "source_system_id": "looker", "table": "explore_queries", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["explore_queries_records","explore_queries_summary"], "evidence": ["source_system_record"]}

def query_looker_metric_definitions(id: str = "", period: str = "", metric_name: str = "", computed_at: str = "", limit: int = 20) -> dict[str, Any]:
    """Query Looker metric_definitions. Columns: id, period, metric_name, value, variance_pct, computed_at."""
    rows = _json("tables/metric_definitions.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if period: rows = [r for r in rows if str(r.get("period","")).lower() == period.lower()]
    if metric_name: rows = [r for r in rows if str(r.get("metric_name","")).lower() == metric_name.lower()]
    if computed_at: rows = [r for r in rows if str(r.get("computed_at","")).lower() == computed_at.lower()]
    return {"source_system": "Looker", "source_system_id": "looker", "table": "metric_definitions", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["metric_definitions_records","metric_definitions_summary"], "evidence": ["source_system_record"]}

def list_documents() -> dict[str, Any]:
    """List all available evidence documents and their metadata."""
    return {"documents": [{"id":"ar-aging-dso-analyzer-controls-playbook","title":"AR Aging & DSO Analyzer Controls Playbook","type":"policy","path":"documents/ar-aging-dso-analyzer-controls-playbook.md","wordCount":511}]}

def read_document(document_id: str) -> dict[str, Any]:
    """Read the full text of a document by its ID. Use for citing evidence."""
    docs = [{"id":"ar-aging-dso-analyzer-controls-playbook","path":"documents/ar-aging-dso-analyzer-controls-playbook.md","title":"AR Aging & DSO Analyzer Controls Playbook"}]
    doc = next((d for d in docs if d["id"] == document_id), None)
    if not doc: return {"error": f"Document {document_id} not found"}
    path = FIXTURES / doc["path"]
    if not path.exists(): return {"error": f"File not found: {doc['path']}"}
    return {"id": doc["id"], "title": doc["title"], "content": path.read_text(encoding="utf-8")}

def search_documents(query: str = "") -> dict[str, Any]:
    """Search documents by keyword. Returns matching document IDs and snippets."""
    results = []
    for doc_meta in [{"id":"ar-aging-dso-analyzer-controls-playbook","path":"documents/ar-aging-dso-analyzer-controls-playbook.md","title":"AR Aging & DSO Analyzer Controls Playbook"}]:
        path = FIXTURES / doc_meta["path"]
        if not path.exists(): continue
        text = path.read_text(encoding="utf-8")
        if not query or query.lower() in text.lower():
            idx = text.lower().find(query.lower()) if query else 0
            snippet = text[max(0,idx-80):idx+120].strip()
            results.append({"id": doc_meta["id"], "title": doc_meta["title"], "snippet": snippet})
    return {"query": query, "results": results}

# ── Behavior-contract tools (action / notification / evidence / calculation) ──
def lookup_ar_aging_dso_analyzer_controls_playbook(section_anchor: str = "", document_id: str = "") -> dict[str, Any]:
    """Look up sections of the AR Aging & DSO Analyzer Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."""
    candidates = [d for d in _CONTRACT_DOCUMENTS if d.get("source_system_id") == "bigquery"]
    if document_id:
        candidates = [d for d in candidates if d.get("id") == document_id]
    if not candidates:
        return {"error": "no_document_for_source", "source_system_id": "bigquery", "tool_kind": "evidence_lookup"}
    best = None
    for doc in candidates:
        path = FIXTURES / doc.get("path", "")
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        if section_anchor and section_anchor.lower() in text.lower():
            idx = text.lower().find(section_anchor.lower())
            snippet = text[max(0, idx - 160):idx + 320].strip()
            best = {"id": doc.get("id"), "title": doc.get("title"), "snippet": snippet, "anchor_matched": True}
            break
        if best is None:
            best = {"id": doc.get("id"), "title": doc.get("title"), "snippet": text[:400].strip(), "anchor_matched": False}
    if best is None:
        return {"error": "documents_unavailable", "source_system_id": "bigquery", "tool_kind": "evidence_lookup"}
    # Contract outputs: expose produced fields as top-level keys so
    # validators and downstream harnesses can trace spec-to-code coverage.
    document_section = best.get("snippet", "")
    return {
        "source_system_id": "bigquery",
        "tool_kind": "evidence_lookup",
        "citation_anchor": section_anchor,
        "document_section": document_section,
        "document": best,
        "evidence": ["document_reference"],
    }

def action_sap_s_4hana_fi_generate(target_id: str = "", rationale: str = "") -> dict[str, Any]:
    """Execute the generate step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates."""
    missing = [name for name, value in [("target_id", target_id), ("rationale", rationale)] if not value]
    if missing:
        return {"error": "missing_required_inputs", "missing": missing, "tool_kind": "action", "escalation": "request_more_info"}
    audit_trail = "action_sap_s_4hana_fi_generate(target_id={target_id}, rationale={rationale})".format(target_id=target_id, rationale=rationale)
    action_id = _deterministic_id("ACTION_I", "action_sap_s_4hana_fi_generate", target_id, rationale)
    audit_record_id = _deterministic_id("AUDIT_RE", "action_sap_s_4hana_fi_generate", target_id, rationale)
    result = {
        "source_system_id": "sap_s_4hana_fi",
        "tool_kind": "action",
        "status": "submitted",
        "action_id": action_id,
        "audit_record_id": audit_record_id,
        "audit_trail": audit_trail,
        "evidence": ["api_response","generated_audit_trail"],
        "produces": ["action_id","audit_record_id"],
    }
    _append_action_event("action_sap_s_4hana_fi_generate", result)
    return result
source_adapters_fixtures = [FunctionTool(func=list_systems), FunctionTool(func=describe_data_model), FunctionTool(func=query_sap_s_4hana_fi_gl_entries), FunctionTool(func=query_sap_s_4hana_fi_subledger_balances), FunctionTool(func=query_sap_s_4hana_fi_open_items), FunctionTool(func=query_bigquery_analytics_events), FunctionTool(func=query_bigquery_historical_metrics), FunctionTool(func=query_bigquery_cached_aggregates), FunctionTool(func=query_looker_dashboards), FunctionTool(func=query_looker_explore_queries), FunctionTool(func=query_looker_metric_definitions), FunctionTool(func=list_documents), FunctionTool(func=read_document), FunctionTool(func=search_documents), FunctionTool(func=lookup_ar_aging_dso_analyzer_controls_playbook), FunctionTool(func=action_sap_s_4hana_fi_generate)]

# ── runtime tool backend ─────────────────────────────────────────────────
# GE_DATA_BACKEND=fixtures (default, local/offline) -> in-process FunctionTools.
# GE_DATA_BACKEND=mcp (cloud) -> tools resolved from Agent Registry by name.
# Auth: ADC / Agent Runtime agent identity via GcpAuthProvider (no hardcoded URL).
# department: finance
import os as _os
_BACKEND = _os.environ.get("GE_DATA_BACKEND", "fixtures")
_PROJECT = _os.environ.get("GOOGLE_CLOUD_PROJECT", "")
_LOCATION = _os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
_AGENT_ID = _os.environ.get("GE_AGENT_ID", "ar_aging_dso_analyzer")
# Registry server id this agent registers as (override via env if needed).
_MCP_SERVER = _os.environ.get("GE_MCP_SERVER", "ar-aging-dso-analyzer")

def _mcp_toolsets():
    # Resolve registered MCP toolsets from Agent Registry. ADC (Agent Identity
    # or service account) authenticates both the registry lookup and the tool calls.
    from google.adk.auth.credential_manager import CredentialManager
    from google.adk.integrations.agent_identity import GcpAuthProvider
    from google.adk.integrations.agent_registry import AgentRegistry
    CredentialManager.register_auth_provider(GcpAuthProvider())
    registry = AgentRegistry(project_id=_PROJECT, location=_LOCATION)
    toolsets = []
    for _name in [
        "mcpServers/ar-aging-dso-analyzer",
    ]:
        try:
            toolsets.append(registry.get_mcp_toolset(mcp_server_name=_name))
        except Exception:  # a server not yet registered shouldn't crash startup
            pass
    return toolsets

if _BACKEND == "mcp":
    source_adapters = _mcp_toolsets() or source_adapters_fixtures
else:
    source_adapters = source_adapters_fixtures
mock_tools = source_adapters  # Backwards-compatible alias for older harness validators.
