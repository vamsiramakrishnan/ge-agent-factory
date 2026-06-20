from __future__ import annotations

from types import SimpleNamespace

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime.generic import STATE, build_generic_handlers  # noqa: E402
from simulator_runtime.simulators import SimulatorError  # noqa: E402


def test_generic_handlers_cover_scaffolded_pack_basics():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "suppliers": {"primaryKey": "supplier_id"},
                "approvals": {"primaryKey": "approval_id"},
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {"name": "search_suppliers"},
                {"name": "get_supplier"},
                {"name": "submit_supplier_update"},
                {"name": "list_pending_approvals"},
                {"name": "list_audit_events"},
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "submit_supplier_update": {
                    "primitive": "state_machine_update",
                    "collection": "suppliers",
                    "primaryKey": "supplier_id",
                    "roleArg": "role",
                    "allowedRoles": ["buyer"],
                    "stateField": "status",
                    "targetStateArg": "status",
                    "transitions": {
                        "active": ["pending_approval"],
                        "pending_approval": ["approved", "rejected"],
                    },
                    "approvalBlockers": [
                        {
                            "collection": "approvals",
                            "sourceRecordField": "source_record_id",
                            "states": ["requested"],
                            "blockedTargetStates": ["approved"],
                        }
                    ],
                }
            }
        },
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(
        agent_id="agent-1",
        system_id="generic_contract",
        scenario_id="scenario-1",
        actor="buyer@example.com",
        role="buyer",
    )
    STATE["agent-1:generic_contract:scenario-1:generic"] = {
        "suppliers": [{"supplier_id": "SUP-001", "name": "Acme Components", "status": "active"}],
        "approvals": [{"approval_id": "APR-001", "source_record_id": "SUP-001", "state": "requested"}],
        "audit_events": [],
    }

    search = handlers["search_suppliers"](ctx, {"query": "acme"})
    supplier = handlers["get_supplier"](ctx, {"supplier_id": "SUP-001"})
    approvals = handlers["list_pending_approvals"](ctx, {"source_record_id": "SUP-001"})
    updated = handlers["submit_supplier_update"](ctx, {"supplier_id": "SUP-001", "status": "pending_approval", "role": "buyer"})
    audit = handlers["list_audit_events"](ctx, {})

    assert search["suppliers"][0]["supplier_id"] == "SUP-001"
    assert supplier["supplier"]["name"] == "Acme Components"
    assert approvals["approvals"][0]["approval_id"] == "APR-001"
    assert updated["supplier"]["status"] == "pending_approval"
    assert len(audit["audit_events"]) >= 4


def test_generic_update_workflow_blocks_invalid_transition():
    contract = {
        "id": "generic_contract",
        "schema": {"collections": {"suppliers": {"primaryKey": "supplier_id"}, "audit_events": {"primaryKey": "event_id"}}},
        "toolCatalog": {"tools": [{"name": "submit_supplier_update"}]},
        "workflowCatalog": {
            "toolHandlers": {
                "submit_supplier_update": {
                    "primitive": "state_machine_update",
                    "collection": "suppliers",
                    "primaryKey": "supplier_id",
                    "roleArg": "role",
                    "allowedRoles": ["buyer"],
                    "stateField": "status",
                    "targetStateArg": "status",
                    "transitions": {"active": ["pending_approval"]},
                }
            }
        },
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-2", system_id="generic_contract", scenario_id="scenario-2", actor="buyer@example.com", role="buyer")
    STATE["agent-2:generic_contract:scenario-2:generic"] = {
        "suppliers": [{"supplier_id": "SUP-001", "name": "Acme Components", "status": "active"}],
        "audit_events": [],
    }

    try:
        handlers["submit_supplier_update"](ctx, {"supplier_id": "SUP-001", "status": "closed", "role": "buyer"})
    except SimulatorError as error:
        assert error.code == "invalid_state_transition"
    else:
        raise AssertionError("expected invalid_state_transition")


def test_generic_search_respects_declared_structured_filters():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "users": {
                    "primaryKey": "user_id",
                    "fields": {
                        "user_id": "string",
                        "name": "string",
                        "status": "string",
                        "company_code": "string",
                        "cost_center": "string",
                    },
                },
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "search_users",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string"},
                            "status": {"type": "string"},
                            "company_code": {"type": "string"},
                            "cost_center": {"type": "string"},
                            "limit": {"type": "integer"},
                        },
                    },
                }
            ]
        },
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-3", system_id="generic_contract", scenario_id="scenario-3", actor="buyer@example.com", role="buyer")
    STATE["agent-3:generic_contract:scenario-3:generic"] = {
        "users": [
            {"user_id": "USR-001", "name": "Avery Adams", "status": "active", "company_code": "1000", "cost_center": "FIN-TX"},
            {"user_id": "USR-002", "name": "Avery Baker", "status": "active", "company_code": "2000", "cost_center": "FIN-TX"},
            {"user_id": "USR-003", "name": "Mina Chen", "status": "inactive", "company_code": "1000", "cost_center": "OPS-NY"},
        ],
        "audit_events": [],
    }

    result = handlers["search_users"](ctx, {"query": "avery", "company_code": "1000", "cost_center": "FIN-TX"})

    assert [row["user_id"] for row in result["users"]] == ["USR-001"]


def test_generic_search_maps_status_filter_to_state_rows():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "tickets": {"primaryKey": "ticket_id", "fields": {"ticket_id": "string", "state": "string", "short_description": "string"}},
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "search_tickets",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string"},
                            "status": {"type": "string"},
                        },
                    },
                }
            ]
        },
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-4", system_id="generic_contract", scenario_id="scenario-4", actor="buyer@example.com", role="buyer")
    STATE["agent-4:generic_contract:scenario-4:generic"] = {
        "tickets": [
            {"ticket_id": "T-001", "state": "resolved", "short_description": "Payroll export failed"},
            {"ticket_id": "T-002", "state": "new", "short_description": "Payroll import pending"},
        ],
        "audit_events": [],
    }

    result = handlers["search_tickets"](ctx, {"query": "payroll", "status": "resolved"})

    assert [row["ticket_id"] for row in result["tickets"]] == ["T-001"]


def test_generic_get_resolves_es_plural_collections():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "business_processes": {"primaryKey": "business_process_id"},
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {"tools": [{"name": "get_business_process"}]},
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-5", system_id="generic_contract", scenario_id="scenario-5", actor="hr@example.com", role="hr_partner")
    STATE["agent-5:generic_contract:scenario-5:generic"] = {
        "business_processes": [{"business_process_id": "BP-001", "status": "pending_approval"}],
        "audit_events": [],
    }

    result = handlers["get_business_process"](ctx, {"business_process_id": "BP-001"})

    assert result["business_process"]["status"] == "pending_approval"


def test_generic_search_supports_query_dsl_sort_and_pagination():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "issues": {
                    "primaryKey": "issue_id",
                    "fields": {
                        "issue_id": "string",
                        "key": "string",
                        "summary": "string",
                        "status": "string",
                        "priority": "string",
                        "updated_at": "string",
                    },
                },
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "search_issues",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string"},
                            "priority": {"type": "string"},
                            "updated_since": {"type": "string"},
                            "startAt": {"type": "integer"},
                            "maxResults": {"type": "integer"},
                        },
                    },
                    "binding": {
                        "op": "search",
                        "collection": "issues",
                        "query": {
                            "textFields": ["key", "summary"],
                            "filters": {
                                "priority": {"field": "priority", "op": "in"},
                                "updated_since": {"field": "updated_at", "op": "gte"},
                            },
                            "defaultSort": [{"field": "updated_at", "direction": "desc"}],
                            "pagination": {"style": "offset", "defaultLimit": 2, "maxLimit": 2},
                        },
                    },
                }
            ]
        },
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-6", system_id="generic_contract", scenario_id="scenario-6", actor="dev@example.com", role="developer")
    STATE["agent-6:generic_contract:scenario-6:generic"] = {
        "issues": [
            {"issue_id": "I-1", "key": "HR-1", "summary": "Benefits enrollment failed", "status": "open", "priority": "high", "updated_at": "2026-06-18T09:00:00Z"},
            {"issue_id": "I-2", "key": "HR-2", "summary": "Benefits file queued", "status": "open", "priority": "medium", "updated_at": "2026-06-19T09:00:00Z"},
            {"issue_id": "I-3", "key": "FIN-1", "summary": "Finance extract failed", "status": "open", "priority": "high", "updated_at": "2026-06-17T09:00:00Z"},
            {"issue_id": "I-4", "key": "HR-3", "summary": "Benefits carrier retry", "status": "closed", "priority": "high", "updated_at": "2026-06-16T09:00:00Z"},
        ],
        "audit_events": [],
    }

    first_page = handlers["search_issues"](ctx, {"query": "benefits", "priority": "high,medium", "updated_since": "2026-06-17", "maxResults": 1})
    second_page = handlers["search_issues"](ctx, {"query": "benefits", "priority": "high,medium", "updated_since": "2026-06-17", "startAt": 1, "maxResults": 1})

    assert [row["issue_id"] for row in first_page["issues"]] == ["I-2"]
    assert first_page["page"]["total"] == 2
    assert first_page["page"]["next_offset"] == 1
    assert [row["issue_id"] for row in second_page["issues"]] == ["I-1"]


def test_generic_get_attaches_requested_relations():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "requisitions": {
                    "primaryKey": "requisition_id",
                    "relations": {
                        "lines": {
                            "collection": "requisition_lines",
                            "localField": "requisition_id",
                            "foreignField": "requisition_id",
                            "many": True,
                        },
                        "approvals": {
                            "collection": "approvals",
                            "localField": "requisition_id",
                            "foreignField": "source_record_id",
                            "many": True,
                        },
                    },
                },
                "requisition_lines": {"primaryKey": "line_id"},
                "approvals": {"primaryKey": "approval_id"},
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {"tools": [{"name": "get_requisition"}]},
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-7", system_id="generic_contract", scenario_id="scenario-7", actor="buyer@example.com", role="buyer")
    STATE["agent-7:generic_contract:scenario-7:generic"] = {
        "requisitions": [{"requisition_id": "REQ-1", "status": "submitted"}],
        "requisition_lines": [
            {"line_id": "LINE-1", "requisition_id": "REQ-1", "description": "Laptop"},
            {"line_id": "LINE-2", "requisition_id": "REQ-2", "description": "Monitor"},
        ],
        "approvals": [{"approval_id": "APR-1", "source_record_id": "REQ-1", "state": "requested"}],
        "audit_events": [],
    }

    result = handlers["get_requisition"](ctx, {"requisition_id": "REQ-1", "includes": "lines,approvals"})

    assert result["requisition"]["status"] == "submitted"
    assert [line["line_id"] for line in result["lines"]] == ["LINE-1"]
    assert [approval["approval_id"] for approval in result["approvals"]] == ["APR-1"]


def test_generic_search_supports_odata_search_filter_ctoken_and_direction():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "agreements": {
                    "primaryKey": "agreement_id",
                    "fields": {
                        "agreement_id": "string",
                        "title": "string",
                        "summary": "string",
                        "status": "string",
                        "effective_date": "string",
                        "party_names": "array:string",
                    },
                },
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "search_agreements",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "$search": {"type": "string"},
            "$filter": {"type": "string"},
                            "$top": {"type": "integer"},
                            "ctoken": {"type": "string"},
                            "$orderby": {"type": "string"},
                        },
                    },
                    "binding": {
                        "op": "search",
                        "collection": "agreements",
                        "query": {
                            "textFields": ["title", "summary", "party_names"],
                            "pagination": {"style": "continuation-token", "defaultLimit": 2, "maxLimit": 2},
                        },
                    },
                }
            ]
        },
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-8", system_id="generic_contract", scenario_id="scenario-8", actor="legal@example.com", role="legal_reviewer")
    STATE["agent-8:generic_contract:scenario-8:generic"] = {
        "agreements": [
            {
                "agreement_id": "AGR-1",
                "title": "Acme master services agreement",
                "summary": "Renewal and support services",
                "status": "COMPLETE",
                "effective_date": "2026-03-01",
                "party_names": ["Acme Corp", "GE Aerospace"],
            },
            {
                "agreement_id": "AGR-2",
                "title": "Acme statement of work",
                "summary": "Implementation services",
                "status": "COMPLETE",
                "effective_date": "2026-05-01",
                "party_names": ["Acme Corp", "GE Vernova"],
            },
            {
                "agreement_id": "AGR-3",
                "title": "Beta supplier addendum",
                "summary": "Renewal",
                "status": "PENDING",
                "effective_date": "2026-04-01",
                "party_names": ["Beta Ltd"],
            },
        ],
        "audit_events": [],
    }

    first_page = handlers["search_agreements"](
        ctx,
        {
            "$search": "Acme",
            "$filter": "status eq 'COMPLETE' and provisions/effective_date ge 2026-01-01",
            "$orderby": "effective_date desc",
            "$top": 1,
        },
    )
    second_page = handlers["search_agreements"](
        ctx,
        {
            "$search": "Acme",
            "$filter": "status eq 'COMPLETE' and provisions/effective_date ge 2026-01-01",
            "$orderby": "effective_date desc",
            "$top": 1,
            "ctoken": first_page["page"]["next_ctoken"],
        },
    )

    assert [row["agreement_id"] for row in first_page["agreements"]] == ["AGR-2"]
    assert first_page["page"]["total"] == 2
    assert first_page["page"]["next_ctoken"] == "1"
    assert [row["agreement_id"] for row in second_page["agreements"]] == ["AGR-1"]


def test_generic_search_supports_openapi_filter_search_lists_and_colon_sort():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "users": {
                    "primaryKey": "user_id",
                    "fields": {
                        "user_id": "string",
                        "email": "string",
                        "status": "string",
                        "last_login": "string",
                        "tags": "array:string",
                    },
                },
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "search_users",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string"},
                            "q": {"type": "string"},
                            "filter": {"type": "string"},
                            "search": {"type": "string"},
                            "fieldSelector": {"type": "string"},
                            "sort_by": {"type": "string"},
                            "count": {"type": "integer"},
                            "startKey": {"type": "string"},
                            "limit": {"type": "integer"},
                        },
                    },
                    "binding": {
                        "op": "search",
                        "collection": "users",
                        "query": {
                            "textFields": ["email", "status", "tags"],
                            "filters": {
                                "fieldSelector": {"field": "email", "op": "contains"},
                            },
                            "cursorFields": ["email"],
                            "pagination": {"style": "cursor", "defaultLimit": 10, "maxLimit": 50},
                        },
                    },
                }
            ]
        },
        "workflowCatalog": {"toolHandlers": {}},
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-10", system_id="generic_contract", scenario_id="scenario-10", actor="identity@example.com", role="identity_admin")
    STATE["agent-10:generic_contract:scenario-10:generic"] = {
        "users": [
            {"user_id": "USR-1", "email": "avery@example.com", "status": "ACTIVE", "last_login": "2026-06-18T09:00:00Z", "tags": ["hr", "privileged"]},
            {"user_id": "USR-2", "email": "mina@example.com", "status": "ACTIVE", "last_login": "2026-06-19T09:00:00Z", "tags": ["finance"]},
            {"user_id": "USR-3", "email": "sam@example.com", "status": "SUSPENDED", "last_login": "2026-06-17T09:00:00Z", "tags": ["engineering", "privileged"]},
        ],
        "audit_events": [],
    }

    label_match = handlers["search_users"](ctx, {"query": "privileged", "sort_by": "last_login:desc"})
    filtered = handlers["search_users"](ctx, {"filter": "profile/email eq 'avery@example.com'"})
    searched = handlers["search_users"](ctx, {"search": "status eq 'ACTIVE'", "sort_by": "last_login:desc"})
    selected = handlers["search_users"](ctx, {"fieldSelector": "metadata.email=sam@example.com"})
    cursor_page = handlers["search_users"](ctx, {"startKey": "mina@example.com", "count": 1, "sort_by": "email:asc"})

    assert [row["user_id"] for row in label_match["users"]] == ["USR-1", "USR-3"]
    assert [row["user_id"] for row in filtered["users"]] == ["USR-1"]
    assert [row["user_id"] for row in searched["users"]] == ["USR-2", "USR-1"]
    assert [row["user_id"] for row in selected["users"]] == ["USR-3"]
    assert [row["user_id"] for row in cursor_page["users"]] == ["USR-2"]
    assert cursor_page["page"]["next_cursor"] == "2"


def test_generic_create_binding_creates_rows_and_replays_idempotently():
    contract = {
        "id": "generic_contract",
        "schema": {
            "collections": {
                "bulk_jobs": {
                    "primaryKey": "job_id",
                    "fields": {
                        "job_id": "string",
                        "name": "string",
                        "status": "string",
                        "expected_number_of_docs": "integer",
                    },
                },
                "audit_events": {"primaryKey": "event_id"},
            }
        },
        "toolCatalog": {
            "tools": [
                {
                    "name": "create_bulk_upload_job",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "job_name": {"type": "string"},
                            "expected_number_of_docs": {"type": "integer"},
                            "role": {"type": "string"},
                            "idempotency_key": {"type": "string"},
                        },
                    },
                    "binding": {
                        "op": "create",
                        "collection": "bulk_jobs",
                        "primaryKey": "job_id",
                        "idPrefix": "JOB",
                        "defaults": {"status": "OPEN"},
                        "fieldMap": {"job_name": "name"},
                    },
                }
            ]
        },
        "workflowCatalog": {
            "toolHandlers": {
                "create_bulk_upload_job": {
                    "primitive": "create_record",
                    "collection": "bulk_jobs",
                    "primaryKey": "job_id",
                    "roleArg": "role",
                    "allowedRoles": ["contract_manager"],
                }
            }
        },
    }
    handlers = build_generic_handlers(contract)
    ctx = SimpleNamespace(agent_id="agent-9", system_id="generic_contract", scenario_id="scenario-9", actor="legal@example.com", role="contract_manager")
    STATE["agent-9:generic_contract:scenario-9:generic"] = {"bulk_jobs": [], "audit_events": []}

    first = handlers["create_bulk_upload_job"](
        ctx,
        {
            "job_name": "Q3 supplier paper refresh",
            "expected_number_of_docs": 12,
            "role": "contract_manager",
            "idempotency_key": "bulk-job-1",
        },
    )
    replay = handlers["create_bulk_upload_job"](
        ctx,
        {
            "job_name": "Q3 supplier paper refresh",
            "expected_number_of_docs": 12,
            "role": "contract_manager",
            "idempotency_key": "bulk-job-1",
        },
    )

    assert first["bulk_job"]["job_id"] == "JOB-0001"
    assert first["bulk_job"]["name"] == "Q3 supplier paper refresh"
    assert first["bulk_job"]["status"] == "OPEN"
    assert replay == first
    assert len(STATE["agent-9:generic_contract:scenario-9:generic"]["bulk_jobs"]) == 1
