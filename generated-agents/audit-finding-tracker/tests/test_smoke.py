"""Auto-generated smoke tests for: audit_finding_tracker"""
import json, csv, os
from pathlib import Path
import pytest

FIX = Path(os.environ.get("FIXTURES_ROOT", str(Path(__file__).resolve().parent.parent / "fixtures")))

class TestFixtures:
    def test_manifest(self):
        m = json.loads((FIX / "manifest.json").read_text())
        assert m["id"] == "audit_finding_tracker"

    def test_auditboard_records_exists(self):
        p = FIX / "tables/auditboard_records.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_auditboard_events_exists(self):
        p = FIX / "tables/auditboard_events.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_auditboard_audit_trail_exists(self):
        p = FIX / "tables/auditboard_audit_trail.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_tickets_exists(self):
        p = FIX / "tables/tickets.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_change_requests_exists(self):
        p = FIX / "tables/change_requests.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_incidents_exists(self):
        p = FIX / "tables/incidents.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_finance_3_records_exists(self):
        p = FIX / "tables/finance_3_records.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_finance_3_events_exists(self):
        p = FIX / "tables/finance_3_events.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

class TestTools:
    def test_import(self):
        from app.tools import source_adapters
        assert len(source_adapters) >= 11

    def test_list_systems(self):
        from app.tools import list_systems
        r = list_systems()
        assert len(r["tables"]) == 8

    def test_query_auditboard_records(self):
        from app.tools import query_auditboard_records
        r = query_auditboard_records(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_auditboard_events(self):
        from app.tools import query_auditboard_events
        r = query_auditboard_events(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_auditboard_audit_trail(self):
        from app.tools import query_auditboard_audit_trail
        r = query_auditboard_audit_trail(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_servicenow_tickets(self):
        from app.tools import query_servicenow_tickets
        r = query_servicenow_tickets(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_servicenow_change_requests(self):
        from app.tools import query_servicenow_change_requests
        r = query_servicenow_change_requests(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_servicenow_incidents(self):
        from app.tools import query_servicenow_incidents
        r = query_servicenow_incidents(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_finance_3_records(self):
        from app.tools import query_finance_3_records
        r = query_finance_3_records(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_finance_3_events(self):
        from app.tools import query_finance_3_events
        r = query_finance_3_events(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

class TestBehaviorContract:
    def test_contract_tools_importable(self):
        from app import tools as tools_module
        for fn in ["query_auditboard_records","query_servicenow_tickets","query_finance_3_records","lookup_audit_finding_tracker_controls_playbook","action_auditboard_execute"]:
            assert hasattr(tools_module, fn), f"Contract tool {fn} missing from app.tools"

    def test_agent_instruction_is_task_specific(self):
        from app.agent import root_agent
        text = (root_agent.instruction or "")
        assert "PRIMARY OBJECTIVE" in text, "Agent instruction missing PRIMARY OBJECTIVE section"
        assert "ADK RUNTIME DESIGN" not in text, "build-time design notes leaked into the runtime prompt"
        assert "TOOL PLAYBOOK" in text, "Agent instruction missing TOOL PLAYBOOK section"
        assert len(text) > 400, "Agent instruction is too short to be task-specific"

    def test_agent_uses_advanced_adk_configuration(self):
        source = (Path(__file__).resolve().parent.parent / "app" / "agent.py").read_text()
        assert "generate_content_config=" in source
        assert "output_key=" in source
        assert "before_agent_callback=initialize_workflow_state" in source
        assert "before_tool_callback=enforce_tool_contract" in source
        assert "after_tool_callback=capture_tool_evidence" in source
        assert "description=" in source

    def test_tool_callbacks_accept_adk_signature(self):
        """Invoke the callbacks the way ADK does (by keyword) so a signature
        mismatch fails here, deterministically, instead of at runtime."""
        import asyncio
        from app.agent import enforce_tool_contract, capture_tool_evidence
        class _Tool:  # minimal stand-in for an ADK BaseTool
            name = "list_systems"
        class _Ctx:
            def __init__(self): self.state = {}
        # ADK: before_tool_callback(tool, args, tool_context)
        before = asyncio.run(enforce_tool_contract(tool=_Tool(), args={}, tool_context=_Ctx()))
        assert before is None or isinstance(before, dict)
        # ADK: after_tool_callback(tool, args, tool_context, tool_response)
        ctx = _Ctx()
        after = asyncio.run(capture_tool_evidence(tool=_Tool(), args={}, tool_context=ctx, tool_response={"source_system": "x", "audit_trail": "a"}))
        assert after is None or isinstance(after, dict)
        assert ctx.state.get("evidence_log") is not None

    def test_write_tools_emit_action_events(self, tmp_path, monkeypatch):
        monkeypatch.setenv("ACTION_EVENTS_PATH", str(tmp_path / "action-events.jsonl"))
        from app import tools as tools_module
        result = getattr(tools_module, "action_auditboard_execute")(**{"target_id":"test_target_id","rationale":"test_rationale"})
        assert result.get("audit_trail")
        event_path = tmp_path / "action-events.jsonl"
        assert event_path.exists()
        assert "action_auditboard_execute" in event_path.read_text()

    def test_write_tool_requires_multi_system_evidence(self):
        import asyncio
        from app.agent import enforce_tool_contract
        class _Tool:
            name = "action_auditboard_execute"
        class _Ctx:
            def __init__(self, evidence_log): self.state = {"evidence_log": evidence_log}
        args = {"target_id":"test_target_id","rationale":"test_rationale"}
        blocked = asyncio.run(enforce_tool_contract(tool=_Tool(), args=args, tool_context=_Ctx([])))
        assert blocked and blocked.get("error") == "insufficient_evidence"
        allowed = asyncio.run(enforce_tool_contract(tool=_Tool(), args=args, tool_context=_Ctx([{"source_system_id": "system_a"}, {"source_system_id": "system_b"}])))
        assert allowed is None

class TestGoldenEvals:
    def test_golden_evals_present(self):
        path = Path(__file__).resolve().parent.parent / "evals" / "golden.json"
        data = json.loads(path.read_text())
        assert data.get("primaryObjective"), "golden.json must echo the contract primaryObjective"
        assert data.get("evals"), "evals/golden.json must contain at least one eval"
        for ev in data["evals"]:
            assert ev.get("prompt"), "Each golden eval needs a prompt"
            assert ev.get("expectedToolCalls"), f"Eval {ev.get('id')} must declare expectedToolCalls"

class TestAgentsCliEvals:
    def test_agents_cli_eval_assets_present(self):
        root = Path(__file__).resolve().parent.parent
        evalset = root / "tests" / "eval" / "evalsets" / "ge_behavior_contract.evalset.json"
        config = root / "tests" / "eval" / "eval_config.json"
        optimization = root / "tests" / "eval" / "optimization_config.json"
        assert evalset.exists(), "agents-cli evalset missing"
        assert config.exists(), "agents-cli eval config missing"
        assert optimization.exists(), "agents-cli optimization config missing"
        data = json.loads(evalset.read_text())
        opt = json.loads(optimization.read_text())
        assert data.get("eval_cases"), "agents-cli evalset must include eval_cases"
        assert opt.get("train_dataset") == "tests/eval/evalsets/ge_behavior_contract.evalset.json"
