import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from store_backend import plan_op, shape_envelope  # noqa: E402

WORKER_TOOL = {
    "name": "get_worker",
    "binding": {"op": "read", "store": "alloydb", "entity": "workers",
                "key": "worker_id", "sourceSystem": "Workday", "shape": "source_system_record"},
}
SUBMIT_TOOL = {
    "name": "submit_requisition",
    "binding": {"op": "action", "store": "bigquery", "entity": "requisitions",
                "key": "requisition_id", "sourceSystem": "Ariba", "shape": "source_system_record"},
}


def test_read_plans_a_keyed_lookup_against_the_bound_store():
    op = plan_op("acme-agent", WORKER_TOOL, {"worker_id": "W-42"})
    assert op["store"] == "alloydb"
    assert op["entity"] == "workers"
    assert op["namespace"] == "agent_acme_agent"   # per-agent object
    assert op["filters"] == {"worker_id": "W-42"}
    assert op["kind"] == "read"


def test_action_plans_an_append():
    op = plan_op("acme-agent", SUBMIT_TOOL, {"amount": 100})
    assert op["kind"] == "append"
    assert op["store"] == "bigquery"
    assert op["record"]["amount"] == 100


def test_envelope_carries_the_source_system_effect():
    env = shape_envelope(WORKER_TOOL["binding"], {"worker_id": "W-42", "name": "Ada"}, kind="read")
    assert env["source_system"] == "Workday"
    assert env["evidence_type"] == "source_system_record"
    assert "audit_trail" in env
    assert env["data"]["name"] == "Ada"


def test_unknown_tool_without_binding_raises():
    try:
        plan_op("a", {"name": "mystery"}, {})
        assert False
    except KeyError:
        pass
