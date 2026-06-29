from __future__ import annotations

import os
from pathlib import Path
import json

os.environ["GE_DATA_BACKEND"] = "fixtures"
os.environ["GE_MCP_FIXTURE_ROOT"] = str(Path(__file__).parent / "fixtures")

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from simulator_runtime.registry import list_simulator_contracts  # noqa: E402
from simulator_runtime.router import execute_simulator_tool  # noqa: E402
from simulator_runtime.generic import find_collection_for_get  # noqa: E402
from simulator_runtime.simulators import SIMULATORS  # noqa: E402


SAMPLE_ARGS = {
    "workday": {
        "search_workers": {"query": "avery"},
        "get_worker": {"worker_id": "W-1001"},
        "search_positions": {"query": "finance"},
        "get_position": {"position_id": "P-221"},
        "list_supervisory_orgs": {},
        "get_supervisory_org": {"org_id": "ORG-FIN-TX"},
        "list_business_processes": {"worker_id": "W-1001"},
        "get_business_process": {"business_process_id": "BP-7001"},
        "submit_worker_change": {"worker_id": "W-1001", "change_type": "manager_transfer", "role": "hr_partner"},
        "list_audit_events": {},
    },
    "servicenow": {
        # Reads/lists auto-derive from schema+seed; the submit_* tools are pinned
        # to valid (state -> transition) pairs with an allowed role, chosen to
        # avoid pending approval blockers. ``seed`` nudges the deterministic
        # failure-mode draw off an injected-failure bucket where the default
        # seed (0) would otherwise fire (engine determinism is by
        # agent/system/scenario/seed/tool, independent of entity_id).
        "submit_incident_update": {
            "incident_id": "INC0010002",
            "state": "in_progress",
            "role": "resolver",
            "seed": 1,
        },
        "submit_problem_update": {
            "problem_id": "PRB0040001",
            "state": "fix_in_progress",
            "role": "problem_manager",
        },
        "submit_change_request_update": {
            "change_id": "CHG0030001",
            "state": "implemented",
            "role": "change_manager",
        },
        "submit_service_request_update": {
            "request_id": "REQ0020002",
            "state": "fulfilled",
            "role": "fulfiller",
        },
    },
    "jira": {
        # De-cloned Jira: board transitions with approval blockers + failure
        # weights. submit_* tools pinned to valid transitions by an allowed role,
        # avoiding rows with pending approvals; ``seed`` dodges injected-failure
        # buckets where the default draw (seed 0) would fire.
        "submit_issue_update": {
            "issue_id": "40001",
            "status": "in_review",
            "role": "developer",
        },
        "submit_subtask_update": {
            "subtask_id": "41001",
            "status": "in_progress",
            "role": "developer",
            "seed": 1,
        },
        "submit_sprint_update": {
            "sprint_id": "50001",
            "state": "closed",
            "role": "scrum_master",
        },
        "submit_release_update": {
            "release_id": "60002",
            "status": "released",
            "role": "release_manager",
        },
    },
}


def _contracts():
    return {contract["id"]: contract for contract in list_simulator_contracts()}


def _seed_for(contract: dict) -> dict:
    seed_path = Path(__file__).resolve().parents[2] / "simulator-systems" / contract["id"] / "seed.json"
    if not seed_path.exists():
        return {}
    return json.loads(seed_path.read_text("utf-8"))


def _non_failing_seed(contract: dict, tool_name: str, workflow: dict) -> int | None:
    """Pick the lowest ``seed`` whose deterministic draw avoids an injected
    failure for this submit tool, so conformance asserts the happy path even
    when the contract declares ``failureModes`` weights.

    Mirrors the engine's deterministic selector (failures.select_failure) keyed
    by ``(conformance-agent, system, "default", seed, tool)``. Returns ``None``
    when seed 0 already avoids a failure (the common case) so existing args are
    left untouched.
    """
    from simulator_runtime.failures import resolve_weights, select_failure

    weights = resolve_weights(workflow=workflow, contract=contract)
    if not weights:
        return None
    agent = f"{contract['id']}-conformance-agent"
    for candidate in range(0, 64):
        mode = select_failure(
            weights,
            agent=agent,
            system=contract["id"],
            scenario="default",
            seed=candidate,
            tool=tool_name,
        )
        if mode is None:
            return candidate if candidate != 0 else None
    return None


def _sample_args_for(contract: dict, tool_name: str) -> dict | None:
    explicit = SAMPLE_ARGS.get(contract["id"], {}).get(tool_name)
    if explicit is not None:
        return explicit
    schema_collections = contract["schema"]["collections"]
    seed = _seed_for(contract)
    if tool_name.startswith("search_"):
        return {"query": "", "limit": 5}
    if tool_name.startswith("get_"):
        singular = tool_name.removeprefix("get_")
        collection = find_collection_for_get(contract, singular)
        if not collection:
            return None
        primary_key = schema_collections[collection]["primaryKey"]
        first_row = next((row for row in seed.get(collection, []) if row.get(primary_key)), None)
        if not first_row:
            return None
        return {primary_key: first_row[primary_key]}
    if tool_name in {"list_pending_approvals", "list_audit_events"}:
        return {}
    binding = next(
        (
            tool.get("binding")
            for tool in contract.get("toolCatalog", {}).get("tools", [])
            if tool.get("name") == tool_name and isinstance(tool.get("binding"), dict)
        ),
        {},
    )
    if binding.get("op") == "poll_async_job":
        return {"job_id": "job-conformance-missing"}
    workflow = (contract.get("workflowCatalog") or {}).get("toolHandlers", {}).get(tool_name)
    if binding.get("op") == "create":
        properties = next(
            (
                (tool.get("inputSchema") or {}).get("properties") or {}
                for tool in contract.get("toolCatalog", {}).get("tools", [])
                if tool.get("name") == tool_name
            ),
            {},
        )
        args = {}
        if "accountId" in properties:
            args["accountId"] = "conformance-account"
        if "job_name" in properties:
            args["job_name"] = "Conformance bulk upload"
        if "expected_number_of_docs" in properties:
            args["expected_number_of_docs"] = 1
        if "language" in properties:
            args["language"] = "en-US"
        if "idempotency_key" in properties:
            args["idempotency_key"] = f"{contract['id']}-{tool_name}-conformance"
        if workflow and workflow.get("allowedRoles"):
            args[workflow.get("roleArg", "role")] = workflow["allowedRoles"][0]
        if workflow:
            non_failing = _non_failing_seed(contract, tool_name, workflow)
            if non_failing is not None:
                args["seed"] = non_failing
        return args
    if workflow:
        collection = workflow.get("collection")
        if not collection or collection not in schema_collections:
            return None
        primary_key = workflow.get("primaryKey") or schema_collections[collection]["primaryKey"]
        first_row = next((row for row in seed.get(collection, []) if row.get(primary_key)), None)
        if not first_row:
            return None
        state_field = workflow.get("stateField", "status")
        target_state_arg = workflow.get("targetStateArg", state_field)
        current_state = first_row.get(state_field)
        transitions = workflow.get("transitions") or {}
        target_state = next(iter(transitions.get(str(current_state), transitions.get("*", []))), None)
        args = {primary_key: first_row[primary_key]}
        if target_state:
            args[target_state_arg] = target_state
        if workflow.get("allowedRoles"):
            args[workflow.get("roleArg", "role")] = workflow["allowedRoles"][0]
        non_failing = _non_failing_seed(contract, tool_name, workflow)
        if non_failing is not None:
            args["seed"] = non_failing
        return args
    return None


def test_simulator_pack_contracts_are_complete():
    for contract in list_simulator_contracts():
        assert contract["schema"]["collections"], f"{contract['id']} missing schema collections"
        assert contract["toolCatalog"]["tools"], f"{contract['id']} missing tools"
        assert contract["projection"]["collectionMappings"], f"{contract['id']} missing projection mappings"
        assert contract["materialization"]["collections"], f"{contract['id']} missing materialization mappings"
        assert contract["id"] in SIMULATORS, f"{contract['id']} missing runtime handler map"


def test_all_declared_tools_have_runtime_handlers():
    for contract in list_simulator_contracts():
        handlers = SIMULATORS[contract["id"]]
        declared = {tool["name"] for tool in contract["toolCatalog"]["tools"]}
        missing = sorted(declared - set(handlers))
        assert not missing, f"{contract['id']} tools missing handlers: {missing}"


def test_projection_and_materialization_collections_exist_in_schema():
    for contract in list_simulator_contracts():
        collections = set(contract["schema"]["collections"])
        projection_collections = {mapping["simulatorCollection"] for mapping in contract["projection"]["collectionMappings"]}
        materialization_collections = set(contract["materialization"]["collections"])
        assert projection_collections <= collections
        assert materialization_collections <= collections


def test_workflow_handlers_reference_declared_tools_and_collections():
    for contract in list_simulator_contracts():
        collections = set(contract["schema"]["collections"])
        tool_names = {tool["name"] for tool in contract["toolCatalog"]["tools"]}
        role_names = set(contract.get("roles") or [])
        for tool_name, workflow in (contract.get("workflowCatalog") or {}).get("toolHandlers", {}).items():
            assert tool_name in tool_names
            assert workflow["collection"] in collections
            if role_names:
                assert set(workflow.get("allowedRoles") or []) <= role_names
            for blocker in workflow.get("approvalBlockers") or []:
                assert blocker.get("collection", "approvals") in collections


def test_seed_rows_have_primary_keys_for_declared_collections():
    for contract in list_simulator_contracts():
        seed_path = Path(__file__).resolve().parents[2] / "simulator-systems" / contract["id"] / "seed.json"
        if not seed_path.exists():
            continue
        import json

        seed = json.loads(seed_path.read_text("utf-8"))
        for collection, spec in contract["schema"]["collections"].items():
            rows = seed.get(collection)
            if not isinstance(rows, list):
                continue
            primary_key = spec["primaryKey"]
            for row in rows:
                assert row.get(primary_key), f"{contract['id']}.{collection} row missing {primary_key}"


def test_all_declared_tools_dispatch_with_sample_args():
    for system_id, contract in _contracts().items():
        for tool in contract["toolCatalog"]["tools"]:
            args = _sample_args_for(contract, tool["name"])
            assert args is not None, f"missing conformance sample args for {system_id}.{tool['name']}"
            result = execute_simulator_tool(
                f"{system_id}-conformance-agent",
                {"name": tool["name"], "simulator": {"system_id": system_id, "tool": tool["name"]}},
                args,
            )
            assert result["simulator"] is True
            assert result["system_id"] == system_id
            assert result["tool"] == tool["name"]
            assert result["status"] == "ok", f"{system_id}.{tool['name']} failed: {result}"
            assert "data" in result
