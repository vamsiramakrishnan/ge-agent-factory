import os
from pathlib import Path

os.environ["GE_DATA_BACKEND"] = "fixtures"
os.environ["GE_MCP_FIXTURE_ROOT"] = str(Path(__file__).parent / "fixtures")

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from server import load_agent_manifest, build_tools  # noqa: E402
from simulator_runtime.router import execute_simulator_tool, list_simulators  # noqa: E402


def test_loads_agent_manifest_and_builds_tools():
    manifest = load_agent_manifest("demo-agent")
    assert manifest["id"] == "demo_agent_mcp_tools"
    tools = build_tools("demo-agent")
    names = {t["name"] for t in tools}
    assert "list_systems" in names
    assert "query_invoices" in names


def test_unknown_agent_raises():
    try:
        load_agent_manifest("nope")
        assert False, "expected KeyError/FileNotFoundError"
    except (KeyError, FileNotFoundError):
        pass


def test_lists_system_simulators():
    simulators = list_simulators()["simulators"]
    ids = {sim["id"] for sim in simulators}
    assert "workday" in ids
    assert "servicenow" in ids
    workday = next(sim for sim in simulators if sim["id"] == "workday")
    assert workday["seedPath"].endswith("simulator-systems/workday/seed.json")
    assert workday["schemaPath"].endswith("simulator-systems/workday/schema.json")
    assert workday["toolsPath"].endswith("simulator-systems/workday/tools.json")
    assert workday["schemaExtension"]["collections"]["workers"] == "worker_id"
    assert workday["schema"]["collections"]["positions"]["primaryKey"] == "position_id"
    assert "search_positions" in workday["tools"]


def test_workday_simulator_search_and_get_worker():
    manifest = load_agent_manifest("workday-agent")
    by_name = {tool["name"]: tool for tool in manifest["tools"]}
    search = execute_simulator_tool("workday-agent", by_name["search_workers"], {"query": "avery"})
    assert search["status"] == "ok"
    assert search["source_system"] == "Workday"
    assert search["data"]["workers"][0]["worker_id"] == "W-1001"

    profile = execute_simulator_tool("workday-agent", by_name["get_worker"], {"worker_id": "W-1001"})
    assert profile["data"]["worker"]["name"] == "Avery Johnson"
    assert profile["data"]["worker"]["business_title"] == "Senior HR Operations Partner"
    assert profile["data"]["events"][0]["status"] == "pending_approval"
    assert profile["data"]["events"][0]["business_process_id"] == "BP-7001"


def test_workday_expanded_schema_tools():
    search_positions = {
        "name": "search_positions",
        "simulator": {"system_id": "workday", "tool": "search_positions"},
    }
    positions = execute_simulator_tool("workday-agent", search_positions, {"query": "finance"})
    assert positions["status"] == "ok"
    assert positions["data"]["positions"][0]["position_id"] == "P-221"

    get_org = {
        "name": "get_supervisory_org",
        "simulator": {"system_id": "workday", "tool": "get_supervisory_org"},
    }
    org = execute_simulator_tool("workday-agent", get_org, {"org_id": "ORG-FIN-TX"})
    assert org["data"]["supervisory_org"]["name"] == "Finance Transformation"
    assert org["data"]["workers"][0]["worker_id"] == "W-1002"

    get_process = {
        "name": "get_business_process",
        "simulator": {"system_id": "workday", "tool": "get_business_process"},
    }
    process = execute_simulator_tool("workday-agent", get_process, {"business_process_id": "BP-7001"})
    assert process["data"]["business_process"]["status"] == "pending_approval"
    assert process["data"]["steps"][1]["approver_role"] == "finance_partner"


def test_workday_mutation_enforces_permissions_and_audit():
    manifest = load_agent_manifest("workday-agent")
    by_name = {tool["name"]: tool for tool in manifest["tools"]}

    denied = execute_simulator_tool(
        "workday-agent",
        by_name["submit_worker_change"],
        {"worker_id": "W-1001", "change_type": "manager_transfer", "role": "employee"},
    )
    assert denied["status"] == "error"
    assert denied["error"]["code"] == "permission_denied"

    submitted = execute_simulator_tool(
        "workday-agent",
        by_name["submit_worker_change"],
        {"worker_id": "W-1001", "change_type": "manager_transfer", "target_manager_id": "W-1003", "role": "hr_partner"},
    )
    assert submitted["status"] == "ok"
    assert submitted["data"]["worker_event"]["status"] == "pending_approval"
    assert submitted["data"]["audit_event"]["outcome"] == "pending_approval"


def test_servicenow_simulator_search_get_and_approvals():
    # De-cloned ServiceNow: ITIL object model (incidents/problems/change_requests/
    # service_requests) on the generic engine, vendor-shaped endpoint tools.
    manifest = load_agent_manifest("servicenow-agent")
    by_name = {tool["name"]: tool for tool in manifest["tools"]}
    search = execute_simulator_tool("servicenow-agent", by_name["search_incidents"], {"query": "payroll"})
    assert search["status"] == "ok"
    assert search["source_system"] == "ServiceNow"
    assert search["data"]["incidents"][0]["incident_id"] == "INC0010001"

    incident = execute_simulator_tool("servicenow-agent", by_name["get_incident"], {"incident_id": "INC0010001"})
    assert incident["status"] == "ok"
    assert incident["data"]["incident"]["state"] == "in_progress"
    assert incident["data"]["incident"]["priority"] == "1"

    service_request = execute_simulator_tool(
        "servicenow-agent", by_name["get_service_request"], {"request_id": "REQ0020001"}
    )
    assert service_request["status"] == "ok"
    assert service_request["data"]["service_request"]["state"] == "approval"
    assert service_request["data"]["service_request"]["approval_state"] == "requested"

    approvals = execute_simulator_tool("servicenow-agent", by_name["list_pending_approvals"], {})
    assert {a["approval_id"] for a in approvals["data"]["approvals"]} >= {"APR-5001", "APR-5002"}


def test_servicenow_mutation_enforces_role_and_state_rules():
    manifest = load_agent_manifest("servicenow-agent")
    by_name = {tool["name"]: tool for tool in manifest["tools"]}

    # A requester role is not in the resolver/itil/incident_manager allow-list.
    denied = execute_simulator_tool(
        "servicenow-agent",
        by_name["submit_incident_update"],
        {"incident_id": "INC0010001", "state": "on_hold", "role": "requester"},
    )
    assert denied["status"] == "error"
    assert denied["error"]["code"] == "permission_denied"

    # REQ0020001 -> in_progress is blocked by pending approval APR-5001.
    blocked = execute_simulator_tool(
        "servicenow-agent",
        by_name["submit_service_request_update"],
        {"request_id": "REQ0020001", "state": "in_progress", "role": "fulfiller"},
    )
    assert blocked["status"] == "error"
    assert blocked["error"]["code"] == "missing_approval"

    # Valid transition by an allowed role on a fresh incident (INC0010002: new).
    # seed nudges the deterministic failure draw off the injected-failure bucket.
    updated = execute_simulator_tool(
        "servicenow-agent",
        by_name["submit_incident_update"],
        {
            "incident_id": "INC0010002",
            "state": "in_progress",
            "note": "Triaged and assigned",
            "role": "resolver",
            "seed": 1,
        },
    )
    assert updated["status"] == "ok"
    assert updated["data"]["incident"]["state"] == "in_progress"
    assert updated["data"]["audit_event"]["outcome"] == "updated"
