from __future__ import annotations

import json
import os
from copy import deepcopy
from pathlib import Path
from typing import Any

from simulator_runtime import config, overlay
from simulator_runtime.audit import audit_event
from simulator_runtime.generic import build_generic_handlers
from simulator_runtime.registry import get_simulator_contract, list_simulator_contracts


WORKDAY_SEED = {
    "workers": [
        {
            "worker_id": "W-1001",
            "name": "Avery Johnson",
            "email": "avery.johnson@example.com",
            "status": "active",
            "position_id": "P-220",
            "manager_id": "W-1003",
            "supervisory_org_id": "ORG-HR-OPS",
            "cost_center": "HR-110",
            "company": "GE Aerospace",
            "country": "US",
            "location": "Chicago, IL",
            "worker_type": "employee",
        },
        {
            "worker_id": "W-1002",
            "name": "Mina Patel",
            "email": "mina.patel@example.com",
            "status": "active",
            "position_id": "P-221",
            "manager_id": "W-1003",
            "supervisory_org_id": "ORG-FIN-TX",
            "cost_center": "FIN-210",
            "company": "GE Vernova",
            "country": "US",
            "location": "New York, NY",
            "worker_type": "employee",
        },
        {
            "worker_id": "W-1003",
            "name": "Jordan Lee",
            "email": "jordan.lee@example.com",
            "status": "active",
            "position_id": "P-100",
            "manager_id": None,
            "supervisory_org_id": "ORG-EXEC",
            "cost_center": "EXEC-001",
            "company": "GE Corporate",
            "country": "US",
            "location": "San Francisco, CA",
            "worker_type": "manager",
        },
    ],
    "positions": [
        {
            "position_id": "P-100",
            "title": "VP, Enterprise Transformation",
            "job_profile": "Executive Leader",
            "supervisory_org_id": "ORG-EXEC",
            "cost_center": "EXEC-001",
            "location": "San Francisco, CA",
            "status": "filled",
            "worker_id": "W-1003",
        },
        {
            "position_id": "P-220",
            "title": "HR Operations Partner",
            "job_profile": "HR Partner III",
            "supervisory_org_id": "ORG-HR-OPS",
            "cost_center": "HR-110",
            "location": "Chicago, IL",
            "status": "filled",
            "worker_id": "W-1001",
        },
        {
            "position_id": "P-221",
            "title": "Finance Transformation Analyst",
            "job_profile": "Financial Analyst II",
            "supervisory_org_id": "ORG-FIN-TX",
            "cost_center": "FIN-210",
            "location": "New York, NY",
            "status": "filled",
            "worker_id": "W-1002",
        },
    ],
    "supervisory_orgs": [
        {
            "org_id": "ORG-EXEC",
            "name": "Enterprise Transformation Office",
            "manager_id": "W-1003",
            "parent_org_id": None,
            "cost_center": "EXEC-001",
            "company": "GE Corporate",
        },
        {
            "org_id": "ORG-HR-OPS",
            "name": "HR Operations",
            "manager_id": "W-1003",
            "parent_org_id": "ORG-EXEC",
            "cost_center": "HR-110",
            "company": "GE Aerospace",
        },
        {
            "org_id": "ORG-FIN-TX",
            "name": "Finance Transformation",
            "manager_id": "W-1003",
            "parent_org_id": "ORG-EXEC",
            "cost_center": "FIN-210",
            "company": "GE Vernova",
        },
    ],
    "business_processes": [
        {
            "business_process_id": "BP-7001",
            "worker_id": "W-1001",
            "type": "transfer",
            "status": "pending_approval",
            "initiated_by": "hr.partner@example.com",
            "current_step_id": "BPS-7001-2",
        }
    ],
    "business_process_steps": [
        {
            "step_id": "BPS-7001-1",
            "business_process_id": "BP-7001",
            "step_name": "Manager Review",
            "approver_role": "manager",
            "status": "approved",
        },
        {
            "step_id": "BPS-7001-2",
            "business_process_id": "BP-7001",
            "step_name": "Finance Partner Review",
            "approver_role": "finance_partner",
            "status": "requested",
        },
    ],
    "worker_events": [
        {
            "event_id": "E-9001",
            "worker_id": "W-1001",
            "event_type": "manager_transfer",
            "status": "pending_approval",
            "reason": "cost_center_mismatch",
            "target_manager_id": "W-1003",
        }
    ],
    "audit_events": [],
}

SERVICENOW_SEED = {
    "tickets": [
        {
            "ticket_id": "INC0010001",
            "type": "incident",
            "short_description": "Payroll integration latency above threshold",
            "state": "in_progress",
            "priority": "2",
            "assignment_group": "Enterprise Integrations",
            "requester": "mina.patel@example.com",
            "configuration_item": "workday-payroll-connector",
            "sla": "at_risk",
        },
        {
            "ticket_id": "REQ0010100",
            "type": "service_request",
            "short_description": "Provision finance analyst access",
            "state": "pending_approval",
            "priority": "3",
            "assignment_group": "Identity Operations",
            "requester": "avery.johnson@example.com",
            "configuration_item": "okta-finance-app",
            "sla": "on_track",
        },
        {
            "ticket_id": "CHG0010200",
            "type": "change_request",
            "short_description": "Deploy procurement supplier portal update",
            "state": "assess",
            "priority": "3",
            "assignment_group": "Procurement Platforms",
            "requester": "jordan.lee@example.com",
            "configuration_item": "supplier-portal",
            "sla": "on_track",
            "risk": "moderate",
        },
    ],
    "approvals": [
        {
            "approval_id": "APR-5001",
            "ticket_id": "REQ0010100",
            "approver": "finance.manager@example.com",
            "state": "requested",
            "reason": "manager approval required for finance application access",
        },
        {
            "approval_id": "APR-5002",
            "ticket_id": "CHG0010200",
            "approver": "change.manager@example.com",
            "state": "requested",
            "reason": "moderate-risk production change",
        },
    ],
    "audit_events": [],
}

STATE: dict[str, dict[str, Any]] = {}
FALLBACK_PRIMARY_KEYS = {"audit_events": "event_id"}


def _primary_key_for_collection(system_id: str, collection: str) -> str | None:
    try:
        schema = get_simulator_contract(system_id).get("schema") or {}
        return schema.get("collections", {}).get(collection, {}).get("primaryKey") or FALLBACK_PRIMARY_KEYS.get(collection)
    except KeyError:
        return FALLBACK_PRIMARY_KEYS.get(collection)


class SimulatorError(Exception):
    def __init__(self, code: str, message: str, *, audit: dict[str, Any] | None = None):
        super().__init__(message)
        self.code = code
        self.audit = audit


def _state_key(ctx) -> str:
    return f"{ctx.agent_id}:{ctx.system_id}:{ctx.scenario_id}"


def _read_json(path: Path) -> dict[str, Any] | None:
    try:
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None
    return None


def _merge_collection(base_items: list[dict[str, Any]], overlay_items: list[dict[str, Any]], key_field: str | None) -> list[dict[str, Any]]:
    if not key_field:
        return [*base_items, *overlay_items]
    by_id = {
        str(item.get(key_field)): deepcopy(item)
        for item in base_items
        if item.get(key_field) is not None
    }
    passthrough = [deepcopy(item) for item in base_items if item.get(key_field) is None]
    for item in overlay_items:
        item_id = item.get(key_field)
        if item_id is None:
            passthrough.append(deepcopy(item))
            continue
        existing = by_id.get(str(item_id), {})
        by_id[str(item_id)] = {**existing, **deepcopy(item)}
    return [*by_id.values(), *passthrough]


def _merge_seed(base: dict[str, Any], overlay: dict[str, Any] | None, system_id: str | None = None) -> dict[str, Any]:
    merged = deepcopy(base)
    if not overlay:
        return merged
    for key, value in overlay.items():
        if isinstance(value, list) and isinstance(merged.get(key), list):
            merged[key] = _merge_collection(merged[key], value, _primary_key_for_collection(system_id or "", key))
        elif isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = {**merged[key], **deepcopy(value)}
        else:
            merged[key] = deepcopy(value)
    return merged


def _seed_overlay(system_id: str) -> dict[str, Any] | None:
    seed_root = os.environ.get("GE_SIMULATOR_SEED_ROOT")
    candidates = []
    if seed_root:
        candidates.append(Path(seed_root) / system_id / "seed.json")
    candidates.append(config.packs_dir() / system_id / "seed.json")
    overlay: dict[str, Any] = {}
    found = False
    for path in candidates:
        payload = _read_json(path)
        if payload is not None:
            overlay = _merge_seed(overlay, payload, system_id)
            found = True
    return overlay if found else None


def _seed_for(system_id: str, base: dict[str, Any]) -> dict[str, Any]:
    return _merge_seed(base, _seed_overlay(system_id), system_id)


def _workday_state(ctx) -> dict[str, Any]:
    key = _state_key(ctx)
    if key not in STATE:
        STATE[key] = _seed_for("workday", WORKDAY_SEED)
    return STATE[key]


def _servicenow_state(ctx) -> dict[str, Any]:
    key = _state_key(ctx)
    if key not in STATE:
        STATE[key] = _seed_for("servicenow", SERVICENOW_SEED)
    return STATE[key]


def reset_state(ctx) -> dict[str, Any]:
    if ctx.system_id == "servicenow":
        STATE[_state_key(ctx)] = _seed_for("servicenow", SERVICENOW_SEED)
    else:
        STATE[_state_key(ctx)] = _seed_for("workday", WORKDAY_SEED)
    return {"ok": True, "scenario_id": ctx.scenario_id}


def search_workers(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    query = str(args.get("query") or "").lower()
    status = args.get("status")
    supervisory_org_id = args.get("supervisory_org_id")
    location = str(args.get("location") or "").lower()
    limit = int(args.get("limit") or 50)
    workers = state["workers"]
    if query:
        workers = [w for w in workers if query in str(w.get("name", "")).lower() or query in str(w.get("email", "")).lower()]
    if status:
        workers = [w for w in workers if w.get("status") == status]
    if supervisory_org_id:
        workers = [w for w in workers if w.get("supervisory_org_id") == supervisory_org_id]
    if location:
        workers = [w for w in workers if location in str(w.get("location", "")).lower()]
    event = audit_event(ctx=ctx, action="search_workers", entity="worker", entity_id="*", outcome="read")
    state["audit_events"].append(event)
    return {"workers": workers[:max(1, limit)], "audit_event": event}


def get_worker(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    worker_id = args.get("worker_id")
    worker = next((w for w in state["workers"] if w["worker_id"] == worker_id), None)
    if not worker:
        event = audit_event(ctx=ctx, action="get_worker", entity="worker", entity_id=str(worker_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"worker {worker_id} not found", audit=event)
    events = [e for e in state["worker_events"] if e["worker_id"] == worker_id]
    event = audit_event(ctx=ctx, action="get_worker", entity="worker", entity_id=worker_id, outcome="read")
    state["audit_events"].append(event)
    return {"worker": worker, "events": events, "audit_event": event}


def search_positions(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    query = str(args.get("query") or "").lower()
    status = args.get("status")
    cost_center = args.get("cost_center")
    org_id = args.get("supervisory_org_id")
    limit = int(args.get("limit") or 50)
    positions = state.get("positions", [])
    if query:
        positions = [p for p in positions if query in str(p.get("title", "")).lower() or query in str(p.get("job_profile", "")).lower()]
    if status:
        positions = [p for p in positions if p.get("status") == status]
    if cost_center:
        positions = [p for p in positions if p.get("cost_center") == cost_center]
    if org_id:
        positions = [p for p in positions if p.get("supervisory_org_id") == org_id]
    event = audit_event(ctx=ctx, action="search_positions", entity="position", entity_id="*", outcome="read")
    state["audit_events"].append(event)
    return {"positions": positions[:max(1, limit)], "audit_event": event}


def get_position(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    position_id = args.get("position_id")
    position = next((p for p in state.get("positions", []) if p.get("position_id") == position_id), None)
    if not position:
        event = audit_event(ctx=ctx, action="get_position", entity="position", entity_id=str(position_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"position {position_id} not found", audit=event)
    worker = next((w for w in state["workers"] if w.get("worker_id") == position.get("worker_id")), None)
    event = audit_event(ctx=ctx, action="get_position", entity="position", entity_id=position_id, outcome="read")
    state["audit_events"].append(event)
    return {"position": position, "worker": worker, "audit_event": event}


def list_supervisory_orgs(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    manager_id = args.get("manager_id")
    parent_org_id = args.get("parent_org_id")
    limit = int(args.get("limit") or 50)
    orgs = state.get("supervisory_orgs", [])
    if manager_id:
        orgs = [org for org in orgs if org.get("manager_id") == manager_id]
    if parent_org_id:
        orgs = [org for org in orgs if org.get("parent_org_id") == parent_org_id]
    event = audit_event(ctx=ctx, action="list_supervisory_orgs", entity="supervisory_org", entity_id="*", outcome="read")
    state["audit_events"].append(event)
    return {"supervisory_orgs": orgs[:max(1, limit)], "audit_event": event}


def get_supervisory_org(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    org_id = args.get("org_id")
    org = next((item for item in state.get("supervisory_orgs", []) if item.get("org_id") == org_id), None)
    if not org:
        event = audit_event(ctx=ctx, action="get_supervisory_org", entity="supervisory_org", entity_id=str(org_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"supervisory org {org_id} not found", audit=event)
    workers = [w for w in state["workers"] if w.get("supervisory_org_id") == org_id]
    positions = [p for p in state.get("positions", []) if p.get("supervisory_org_id") == org_id]
    event = audit_event(ctx=ctx, action="get_supervisory_org", entity="supervisory_org", entity_id=org_id, outcome="read")
    state["audit_events"].append(event)
    return {"supervisory_org": org, "workers": workers, "positions": positions, "audit_event": event}


def list_business_processes(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    worker_id = args.get("worker_id")
    process_type = args.get("type")
    status = args.get("status")
    limit = int(args.get("limit") or 50)
    processes = state.get("business_processes", [])
    if worker_id:
        processes = [bp for bp in processes if bp.get("worker_id") == worker_id]
    if process_type:
        processes = [bp for bp in processes if bp.get("type") == process_type]
    if status:
        processes = [bp for bp in processes if bp.get("status") == status]
    event = audit_event(ctx=ctx, action="list_business_processes", entity="business_process", entity_id=str(worker_id or "*"), outcome="read")
    state["audit_events"].append(event)
    return {"business_processes": processes[:max(1, limit)], "audit_event": event}


def get_business_process(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    process_id = args.get("business_process_id")
    process = next((bp for bp in state.get("business_processes", []) if bp.get("business_process_id") == process_id), None)
    if not process:
        event = audit_event(ctx=ctx, action="get_business_process", entity="business_process", entity_id=str(process_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"business process {process_id} not found", audit=event)
    steps = [step for step in state.get("business_process_steps", []) if step.get("business_process_id") == process_id]
    event = audit_event(ctx=ctx, action="get_business_process", entity="business_process", entity_id=process_id, outcome="read")
    state["audit_events"].append(event)
    return {"business_process": process, "steps": steps, "audit_event": event}


def submit_worker_change(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    worker_id = args.get("worker_id")
    change_type = args.get("change_type")
    if ctx.role not in {"hr_partner", "manager"}:
        event = audit_event(ctx=ctx, action="submit_worker_change", entity="worker", entity_id=str(worker_id), outcome="permission_denied")
        state["audit_events"].append(event)
        raise SimulatorError("permission_denied", f"role {ctx.role} cannot submit worker changes", audit=event)
    worker = next((w for w in state["workers"] if w["worker_id"] == worker_id), None)
    if not worker:
        event = audit_event(ctx=ctx, action="submit_worker_change", entity="worker", entity_id=str(worker_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"worker {worker_id} not found", audit=event)
    if change_type not in {"manager_transfer", "location_change", "cost_center_change"}:
        event = audit_event(ctx=ctx, action="submit_worker_change", entity="worker", entity_id=worker_id, outcome="validation_error", detail="unsupported change_type")
        state["audit_events"].append(event)
        raise SimulatorError("validation_error", f"unsupported change_type {change_type}", audit=event)

    event_id = f"E-{9000 + len(state['worker_events']) + 1}"
    worker_event = {
        "event_id": event_id,
        "worker_id": worker_id,
        "event_type": change_type,
        "status": "pending_approval",
        "reason": args.get("reason") or "submitted_by_agent",
        "target_manager_id": args.get("target_manager_id"),
        "target_cost_center": args.get("target_cost_center"),
    }
    state["worker_events"].append(worker_event)
    process_id = f"BP-{7000 + len(state.get('business_processes', [])) + 1}"
    step_id = f"BPS-{process_id}-1"
    state.setdefault("business_processes", []).append({
        "business_process_id": process_id,
        "worker_id": worker_id,
        "type": change_type,
        "status": "pending_approval",
        "initiated_by": ctx.actor,
        "current_step_id": step_id,
    })
    state.setdefault("business_process_steps", []).append({
        "step_id": step_id,
        "business_process_id": process_id,
        "step_name": "Manager Review",
        "approver_role": "manager",
        "status": "requested",
    })
    audit = audit_event(ctx=ctx, action="submit_worker_change", entity="worker_event", entity_id=event_id, outcome="pending_approval")
    state["audit_events"].append(audit)
    return {"worker_event": worker_event, "business_process_id": process_id, "audit_event": audit}


def list_audit_events(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _workday_state(ctx)
    limit = int(args.get("limit") or 50)
    return {"audit_events": state["audit_events"][-limit:]}


WORKDAY_TOOLS = {
    "search_workers": search_workers,
    "get_worker": get_worker,
    "search_positions": search_positions,
    "get_position": get_position,
    "list_supervisory_orgs": list_supervisory_orgs,
    "get_supervisory_org": get_supervisory_org,
    "list_business_processes": list_business_processes,
    "get_business_process": get_business_process,
    "submit_worker_change": submit_worker_change,
    "list_audit_events": list_audit_events,
    "reset_scenario": reset_state,
}


def search_tickets(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _servicenow_state(ctx)
    query = str(args.get("query") or "").lower()
    ticket_type = args.get("type")
    state_filter = args.get("state")
    tickets = state["tickets"]
    if query:
        tickets = [t for t in tickets if query in t["short_description"].lower() or query in t["ticket_id"].lower()]
    if ticket_type:
        tickets = [t for t in tickets if t["type"] == ticket_type]
    if state_filter:
        tickets = [t for t in tickets if t["state"] == state_filter]
    event = audit_event(ctx=ctx, action="search_tickets", entity="ticket", entity_id="*", outcome="read")
    state["audit_events"].append(event)
    return {"tickets": tickets, "audit_event": event}


def get_ticket(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _servicenow_state(ctx)
    ticket_id = args.get("ticket_id")
    ticket = next((t for t in state["tickets"] if t["ticket_id"] == ticket_id), None)
    if not ticket:
        event = audit_event(ctx=ctx, action="get_ticket", entity="ticket", entity_id=str(ticket_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"ticket {ticket_id} not found", audit=event)
    approvals = [a for a in state["approvals"] if a["ticket_id"] == ticket_id]
    event = audit_event(ctx=ctx, action="get_ticket", entity="ticket", entity_id=ticket_id, outcome="read")
    state["audit_events"].append(event)
    return {"ticket": ticket, "approvals": approvals, "audit_event": event}


def submit_ticket_update(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _servicenow_state(ctx)
    ticket_id = args.get("ticket_id")
    target_state = args.get("state")
    note = args.get("note")
    if ctx.role not in {"resolver", "change_manager", "service_owner"}:
        event = audit_event(ctx=ctx, action="submit_ticket_update", entity="ticket", entity_id=str(ticket_id), outcome="permission_denied")
        state["audit_events"].append(event)
        raise SimulatorError("permission_denied", f"role {ctx.role} cannot update tickets", audit=event)
    ticket = next((t for t in state["tickets"] if t["ticket_id"] == ticket_id), None)
    if not ticket:
        event = audit_event(ctx=ctx, action="submit_ticket_update", entity="ticket", entity_id=str(ticket_id), outcome="not_found")
        state["audit_events"].append(event)
        raise SimulatorError("not_found", f"ticket {ticket_id} not found", audit=event)
    if target_state == "closed" and any(a["ticket_id"] == ticket_id and a["state"] == "requested" for a in state["approvals"]):
        event = audit_event(ctx=ctx, action="submit_ticket_update", entity="ticket", entity_id=ticket_id, outcome="missing_approval", detail="pending approval blocks closure")
        state["audit_events"].append(event)
        raise SimulatorError("missing_approval", f"ticket {ticket_id} has pending approvals", audit=event)
    if target_state:
        allowed = {
            "new": {"in_progress", "cancelled"},
            "in_progress": {"resolved", "pending_approval"},
            "pending_approval": {"in_progress", "cancelled"},
            "assess": {"authorize", "cancelled"},
            "authorize": {"scheduled", "cancelled"},
            "scheduled": {"implemented", "cancelled"},
            "implemented": {"closed"},
            "resolved": {"closed", "in_progress"},
        }
        if target_state not in allowed.get(ticket["state"], set()):
            event = audit_event(ctx=ctx, action="submit_ticket_update", entity="ticket", entity_id=ticket_id, outcome="invalid_state_transition", detail=f"{ticket['state']} -> {target_state}")
            state["audit_events"].append(event)
            raise SimulatorError("invalid_state_transition", f"cannot transition {ticket_id} from {ticket['state']} to {target_state}", audit=event)
        ticket["state"] = target_state
    if note:
        ticket["last_note"] = note
    event = audit_event(ctx=ctx, action="submit_ticket_update", entity="ticket", entity_id=ticket_id, outcome="updated", detail=note)
    state["audit_events"].append(event)
    return {"ticket": ticket, "audit_event": event}


def list_pending_approvals(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _servicenow_state(ctx)
    ticket_id = args.get("ticket_id")
    approvals = [a for a in state["approvals"] if a["state"] == "requested"]
    if ticket_id:
        approvals = [a for a in approvals if a["ticket_id"] == ticket_id]
    event = audit_event(ctx=ctx, action="list_pending_approvals", entity="approval", entity_id=str(ticket_id or "*"), outcome="read")
    state["audit_events"].append(event)
    return {"approvals": approvals, "audit_event": event}


def list_servicenow_audit_events(ctx, args: dict[str, Any]) -> dict[str, Any]:
    state = _servicenow_state(ctx)
    limit = int(args.get("limit") or 50)
    return {"audit_events": state["audit_events"][-limit:]}


SERVICENOW_TOOLS = {
    "search_tickets": search_tickets,
    "get_ticket": get_ticket,
    "submit_ticket_update": submit_ticket_update,
    "list_pending_approvals": list_pending_approvals,
    "list_audit_events": list_servicenow_audit_events,
}


# Handlers are built lazily, per system, and cached — so importing this module no longer
# hydrates all 54 contracts and builds every handler map up front (the old eager
# `SIMULATORS = _load_simulators()`). Overlay/BYO systems resolve through the same path.
_HANDLER_CACHE: dict[str, dict[str, Any]] = {}


def _build_handlers_for(contract: dict[str, Any]) -> dict[str, Any]:
    generic_handlers = build_generic_handlers(contract)
    plugin = contract.get("plugin") or {}
    handler_map = plugin.get("handlerMap")
    explicit_handlers = globals().get(handler_map) if handler_map else None
    return {**generic_handlers, **(explicit_handlers or {})}


def get_simulator_handlers(system_id: str, tenant: str | None = None) -> dict[str, Any] | None:
    """Resolve (and cache) the handler map for a system. ``None`` if unknown/empty."""
    cached = _HANDLER_CACHE.get(system_id)
    if cached is not None:
        return cached
    try:
        contract = get_simulator_contract(system_id, tenant)
    except KeyError:
        return None
    handlers = _build_handlers_for(contract)
    if handlers:
        _HANDLER_CACHE[system_id] = handlers
    return handlers or None


def reset_handler_cache(system_id: str | None = None) -> None:
    """Drop the handler cache. With ``system_id`` drop just that entry; else clear all.

    Registered as an overlay change-listener (see below) so re-registering a synthesized
    pack under an existing id invalidates its stale handler map — the BYO refine loop.
    """
    if system_id is None:
        _HANDLER_CACHE.clear()
    else:
        _HANDLER_CACHE.pop(system_id, None)


# Invalidate the (per-id) handler cache whenever the overlay mounts/removes a pack, so a
# re-synthesized contract under the same id is served fresh. Registered via the overlay's
# change-listener hook to avoid an overlay→simulators import cycle.
overlay.register_change_listener(reset_handler_cache)


class _LazySimulators:
    """Backward-compatible mapping over handler maps, materialized on demand.

    Preserves the historical ``SIMULATORS`` surface — ``.get(id)``, ``id in SIMULATORS``,
    ``SIMULATORS[id]`` and iteration over known system ids — without the eager build.
    """

    def get(self, system_id: str, default: Any = None) -> Any:
        handlers = get_simulator_handlers(system_id)
        return handlers if handlers is not None else default

    def __getitem__(self, system_id: str) -> dict[str, Any]:
        handlers = get_simulator_handlers(system_id)
        if handlers is None:
            raise KeyError(system_id)
        return handlers

    def __contains__(self, system_id: object) -> bool:
        return isinstance(system_id, str) and get_simulator_handlers(system_id) is not None

    def __iter__(self):
        ids = {contract["id"] for contract in list_simulator_contracts() if contract.get("id")}
        return iter(ids)

    def keys(self):
        return list(self.__iter__())


SIMULATORS = _LazySimulators()
