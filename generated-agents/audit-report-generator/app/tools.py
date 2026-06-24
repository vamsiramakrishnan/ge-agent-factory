"""Auto-generated fixture-backed tools for: audit_report_generator"""
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

_CONTRACT_DOCUMENTS = [{"id":"audit-report-generator-controls-playbook","title":"Audit Report Generator Controls Playbook","type":"policy","path":"documents/audit-report-generator-controls-playbook.md","source_system_id":"auditboard"}]

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
    return {"scenario": "audit_report_generator", "systems": [{"id":"auditboard","name":"AuditBoard","owns":["auditboard_records","auditboard_events","auditboard_audit_trail"],"protocol":"REST API","localBacking":["alloydb"],"toolNames":["query_auditboard_auditboard_records","query_auditboard_auditboard_events","query_auditboard_auditboard_audit_trail"],"evidence":["source_system_record","generated_audit_trail"]},{"id":"google_docs","name":"Google Docs","owns":["documents","comments","revision_history"],"protocol":"Workspace API","localBacking":["cloud-storage"],"toolNames":["query_google_docs_documents","query_google_docs_comments","query_google_docs_revision_history"],"evidence":["source_system_record","generated_audit_trail"]},{"id":"finance_3","name":"FINANCE 3","owns":["finance_3_records","finance_3_events"],"protocol":"REST API","localBacking":["alloydb"],"toolNames":["query_finance_3_records"],"evidence":["source_system_record"]}], "tables": [{"name":"auditboard_records","sourceSystem":"AuditBoard","sourceSystemId":"auditboard"},{"name":"auditboard_events","sourceSystem":"AuditBoard","sourceSystemId":"auditboard"},{"name":"auditboard_audit_trail","sourceSystem":"AuditBoard","sourceSystemId":"auditboard"},{"name":"documents","sourceSystem":"Google Docs","sourceSystemId":"google_docs"},{"name":"comments","sourceSystem":"Google Docs","sourceSystemId":"google_docs"},{"name":"revision_history","sourceSystem":"Google Docs","sourceSystemId":"google_docs"},{"name":"finance_3_records","sourceSystem":"FINANCE 3","sourceSystemId":"finance_3"},{"name":"finance_3_events","sourceSystem":"FINANCE 3","sourceSystemId":"finance_3"}]}

def query_auditboard_records(lookup_key: str = "", date_range: str = "", id: str = "", actor: str = "", action: str = "", target_type: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query AuditBoard auditboard_records. Columns: id, actor, action, target_type, created_at, notes."""
    rows = _json("tables/auditboard_records.json")
    if lookup_key:
        needle = lookup_key.lower()
        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]
    if date_range:
        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if actor: rows = [r for r in rows if str(r.get("actor","")).lower() == actor.lower()]
    if action: rows = [r for r in rows if str(r.get("action","")).lower() == action.lower()]
    if target_type: rows = [r for r in rows if str(r.get("target_type","")).lower() == target_type.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "AuditBoard", "source_system_id": "auditboard", "table": "auditboard_records", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["auditboard_records_records","auditboard_records_summary"], "evidence": ["source_system_record"]}

def query_auditboard_events(id: str = "", actor: str = "", action: str = "", target_type: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query AuditBoard auditboard_events. Columns: id, actor, action, target_type, created_at, notes."""
    rows = _json("tables/auditboard_events.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if actor: rows = [r for r in rows if str(r.get("actor","")).lower() == actor.lower()]
    if action: rows = [r for r in rows if str(r.get("action","")).lower() == action.lower()]
    if target_type: rows = [r for r in rows if str(r.get("target_type","")).lower() == target_type.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "AuditBoard", "source_system_id": "auditboard", "table": "auditboard_events", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["auditboard_events_records","auditboard_events_summary"], "evidence": ["source_system_record"]}

def query_auditboard_audit_trail(id: str = "", actor: str = "", action: str = "", target_type: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query AuditBoard auditboard_audit_trail. Columns: id, actor, action, target_type, created_at, notes."""
    rows = _json("tables/auditboard_audit_trail.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if actor: rows = [r for r in rows if str(r.get("actor","")).lower() == actor.lower()]
    if action: rows = [r for r in rows if str(r.get("action","")).lower() == action.lower()]
    if target_type: rows = [r for r in rows if str(r.get("target_type","")).lower() == target_type.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "AuditBoard", "source_system_id": "auditboard", "table": "auditboard_audit_trail", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["auditboard_audit_trail_records","auditboard_audit_trail_summary"], "evidence": ["source_system_record"]}

def query_google_docs_documents(lookup_key: str = "", date_range: str = "", id: str = "", title: str = "", owner: str = "", status: str = "", last_updated: str = "", limit: int = 20) -> dict[str, Any]:
    """Query Google Docs documents. Columns: id, title, owner, status, last_updated."""
    rows = _json("tables/documents.json")
    if lookup_key:
        needle = lookup_key.lower()
        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]
    if date_range:
        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if title: rows = [r for r in rows if str(r.get("title","")).lower() == title.lower()]
    if owner: rows = [r for r in rows if str(r.get("owner","")).lower() == owner.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    if last_updated: rows = [r for r in rows if str(r.get("last_updated","")).lower() == last_updated.lower()]
    return {"source_system": "Google Docs", "source_system_id": "google_docs", "table": "documents", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["documents_records","documents_summary"], "evidence": ["source_system_record"]}

def query_google_docs_comments(id: str = "", source_record_id: str = "", status: str = "", owner: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query Google Docs comments. Columns: id, source_record_id, status, owner, created_at, notes."""
    rows = _json("tables/comments.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if source_record_id: rows = [r for r in rows if str(r.get("source_record_id","")).lower() == source_record_id.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    if owner: rows = [r for r in rows if str(r.get("owner","")).lower() == owner.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "Google Docs", "source_system_id": "google_docs", "table": "comments", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["comments_records","comments_summary"], "evidence": ["source_system_record"]}

def query_google_docs_revision_history(id: str = "", actor: str = "", action: str = "", target_type: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query Google Docs revision_history. Columns: id, actor, action, target_type, created_at, notes, document_id."""
    rows = _json("tables/revision_history.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if actor: rows = [r for r in rows if str(r.get("actor","")).lower() == actor.lower()]
    if action: rows = [r for r in rows if str(r.get("action","")).lower() == action.lower()]
    if target_type: rows = [r for r in rows if str(r.get("target_type","")).lower() == target_type.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "Google Docs", "source_system_id": "google_docs", "table": "revision_history", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["revision_history_records","revision_history_summary"], "evidence": ["source_system_record"]}

def query_finance_3_records(lookup_key: str = "", date_range: str = "", id: str = "", source_record_id: str = "", status: str = "", owner: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query FINANCE 3 finance_3_records. Columns: id, source_record_id, status, owner, created_at, notes."""
    rows = _json("tables/finance_3_records.json")
    if lookup_key:
        needle = lookup_key.lower()
        rows = [r for r in rows if any(needle in str(value).lower() for value in r.values())]
    if date_range:
        rows = [r for r in rows if any(date_range.lower() in str(value).lower() for key, value in r.items() if "date" in key.lower() or key.lower().endswith("_at") or key.lower() == "period")]
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if source_record_id: rows = [r for r in rows if str(r.get("source_record_id","")).lower() == source_record_id.lower()]
    if status: rows = [r for r in rows if str(r.get("status","")).lower() == status.lower()]
    if owner: rows = [r for r in rows if str(r.get("owner","")).lower() == owner.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "FINANCE 3", "source_system_id": "finance_3", "table": "finance_3_records", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["finance_3_records_records","finance_3_records_summary"], "evidence": ["source_system_record"]}

def query_finance_3_events(id: str = "", actor: str = "", action: str = "", target_type: str = "", created_at: str = "", notes: str = "", limit: int = 20) -> dict[str, Any]:
    """Query FINANCE 3 finance_3_events. Columns: id, actor, action, target_type, created_at, notes, finance_3_record_id."""
    rows = _json("tables/finance_3_events.json")
    if id: rows = [r for r in rows if str(r.get("id","")).lower() == id.lower()]
    if actor: rows = [r for r in rows if str(r.get("actor","")).lower() == actor.lower()]
    if action: rows = [r for r in rows if str(r.get("action","")).lower() == action.lower()]
    if target_type: rows = [r for r in rows if str(r.get("target_type","")).lower() == target_type.lower()]
    if created_at: rows = [r for r in rows if str(r.get("created_at","")).lower() == created_at.lower()]
    if notes: rows = [r for r in rows if str(r.get("notes","")).lower() == notes.lower()]
    return {"source_system": "FINANCE 3", "source_system_id": "finance_3", "table": "finance_3_events", "rows": rows[:max(1,min(limit,100))], "total": len(rows), "produces": ["finance_3_events_records","finance_3_events_summary"], "evidence": ["source_system_record"]}

def list_documents() -> dict[str, Any]:
    """List all available evidence documents and their metadata."""
    return {"documents": [{"id":"audit-report-generator-controls-playbook","title":"Audit Report Generator Controls Playbook","type":"policy","path":"documents/audit-report-generator-controls-playbook.md","wordCount":543}]}

def read_document(document_id: str) -> dict[str, Any]:
    """Read the full text of a document by its ID. Use for citing evidence."""
    docs = [{"id":"audit-report-generator-controls-playbook","path":"documents/audit-report-generator-controls-playbook.md","title":"Audit Report Generator Controls Playbook"}]
    doc = next((d for d in docs if d["id"] == document_id), None)
    if not doc: return {"error": f"Document {document_id} not found"}
    path = FIXTURES / doc["path"]
    if not path.exists(): return {"error": f"File not found: {doc['path']}"}
    return {"id": doc["id"], "title": doc["title"], "content": path.read_text(encoding="utf-8")}

def search_documents(query: str = "") -> dict[str, Any]:
    """Search documents by keyword. Returns matching document IDs and snippets."""
    results = []
    for doc_meta in [{"id":"audit-report-generator-controls-playbook","path":"documents/audit-report-generator-controls-playbook.md","title":"Audit Report Generator Controls Playbook"}]:
        path = FIXTURES / doc_meta["path"]
        if not path.exists(): continue
        text = path.read_text(encoding="utf-8")
        if not query or query.lower() in text.lower():
            idx = text.lower().find(query.lower()) if query else 0
            snippet = text[max(0,idx-80):idx+120].strip()
            results.append({"id": doc_meta["id"], "title": doc_meta["title"], "snippet": snippet})
    return {"query": query, "results": results}

# ── Behavior-contract tools (action / notification / evidence / calculation) ──
def lookup_audit_report_generator_controls_playbook(section_anchor: str = "", document_id: str = "") -> dict[str, Any]:
    """Look up sections of the Audit Report Generator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."""
    candidates = [d for d in _CONTRACT_DOCUMENTS if d.get("source_system_id") == "google_docs"]
    if document_id:
        candidates = [d for d in candidates if d.get("id") == document_id]
    if not candidates:
        return {"error": "no_document_for_source", "source_system_id": "google_docs", "tool_kind": "evidence_lookup"}
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
        return {"error": "documents_unavailable", "source_system_id": "google_docs", "tool_kind": "evidence_lookup"}
    # Contract outputs: expose produced fields as top-level keys so
    # validators and downstream harnesses can trace spec-to-code coverage.
    document_section = best.get("snippet", "")
    return {
        "source_system_id": "google_docs",
        "tool_kind": "evidence_lookup",
        "citation_anchor": section_anchor,
        "document_section": document_section,
        "document": best,
        "evidence": ["document_reference"],
    }

def action_auditboard_recommend(target_id: str = "", rationale: str = "") -> dict[str, Any]:
    """Execute the recommend step in AuditBoard after the agent has gathered evidence and validated escalation gates."""
    missing = [name for name, value in [("target_id", target_id), ("rationale", rationale)] if not value]
    if missing:
        return {"error": "missing_required_inputs", "missing": missing, "tool_kind": "action", "escalation": "request_more_info"}
    audit_trail = "action_auditboard_recommend(target_id={target_id}, rationale={rationale})".format(target_id=target_id, rationale=rationale)
    action_id = _deterministic_id("ACTION_I", "action_auditboard_recommend", target_id, rationale)
    audit_record_id = _deterministic_id("AUDIT_RE", "action_auditboard_recommend", target_id, rationale)
    result = {
        "source_system_id": "auditboard",
        "tool_kind": "action",
        "status": "submitted",
        "action_id": action_id,
        "audit_record_id": audit_record_id,
        "audit_trail": audit_trail,
        "evidence": ["api_response","generated_audit_trail"],
        "produces": ["action_id","audit_record_id"],
    }
    _append_action_event("action_auditboard_recommend", result)
    return result
source_adapters_fixtures = [FunctionTool(func=list_systems), FunctionTool(func=describe_data_model), FunctionTool(func=query_auditboard_records), FunctionTool(func=query_auditboard_events), FunctionTool(func=query_auditboard_audit_trail), FunctionTool(func=query_google_docs_documents), FunctionTool(func=query_google_docs_comments), FunctionTool(func=query_google_docs_revision_history), FunctionTool(func=query_finance_3_records), FunctionTool(func=query_finance_3_events), FunctionTool(func=list_documents), FunctionTool(func=read_document), FunctionTool(func=search_documents), FunctionTool(func=lookup_audit_report_generator_controls_playbook), FunctionTool(func=action_auditboard_recommend)]

# ── runtime tool backend ─────────────────────────────────────────────────
# GE_DATA_BACKEND=fixtures (default, local/offline) -> in-process FunctionTools.
# GE_DATA_BACKEND=mcp (cloud) -> tools resolved from Agent Registry by name.
# Auth: ADC / Agent Runtime agent identity via GcpAuthProvider (no hardcoded URL).
# department: finance
import os as _os
_BACKEND = _os.environ.get("GE_DATA_BACKEND", "fixtures")
_PROJECT = _os.environ.get("GOOGLE_CLOUD_PROJECT", "")
_LOCATION = _os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
_AGENT_ID = _os.environ.get("GE_AGENT_ID", "audit_report_generator")
# Registry server id this agent registers as (override via env if needed).
_MCP_SERVER = _os.environ.get("GE_MCP_SERVER", "audit-report-generator")

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
        "mcpServers/audit-report-generator",
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
