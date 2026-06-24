"""Auto-generated smoke tests for: ap_aging_analyzer"""
import json, csv, os
from pathlib import Path
import pytest

FIX = Path(os.environ.get("FIXTURES_ROOT", str(Path(__file__).resolve().parent.parent / "fixtures")))

class TestFixtures:
    def test_manifest(self):
        m = json.loads((FIX / "manifest.json").read_text())
        assert m["id"] == "ap_aging_analyzer"

    def test_gl_entries_exists(self):
        p = FIX / "tables/gl_entries.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_subledger_balances_exists(self):
        p = FIX / "tables/subledger_balances.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_open_items_exists(self):
        p = FIX / "tables/open_items.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_analytics_events_exists(self):
        p = FIX / "tables/analytics_events.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_historical_metrics_exists(self):
        p = FIX / "tables/historical_metrics.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_cached_aggregates_exists(self):
        p = FIX / "tables/cached_aggregates.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_dashboards_exists(self):
        p = FIX / "tables/dashboards.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_explore_queries_exists(self):
        p = FIX / "tables/explore_queries.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

    def test_metric_definitions_exists(self):
        p = FIX / "tables/metric_definitions.json"
        assert p.exists()
        data = json.loads(p.read_text()) if p.suffix == ".json" else list(csv.DictReader(p.open(newline="")))
        assert len(data) > 0

class TestTools:
    def test_import(self):
        from app.tools import source_adapters
        assert len(source_adapters) >= 12

    def test_list_systems(self):
        from app.tools import list_systems
        r = list_systems()
        assert len(r["tables"]) == 9

    def test_query_sap_s_4hana_fi_gl_entries(self):
        from app.tools import query_sap_s_4hana_fi_gl_entries
        r = query_sap_s_4hana_fi_gl_entries(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_sap_s_4hana_fi_subledger_balances(self):
        from app.tools import query_sap_s_4hana_fi_subledger_balances
        r = query_sap_s_4hana_fi_subledger_balances(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_sap_s_4hana_fi_open_items(self):
        from app.tools import query_sap_s_4hana_fi_open_items
        r = query_sap_s_4hana_fi_open_items(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_bigquery_analytics_events(self):
        from app.tools import query_bigquery_analytics_events
        r = query_bigquery_analytics_events(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_bigquery_historical_metrics(self):
        from app.tools import query_bigquery_historical_metrics
        r = query_bigquery_historical_metrics(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_bigquery_cached_aggregates(self):
        from app.tools import query_bigquery_cached_aggregates
        r = query_bigquery_cached_aggregates(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_looker_dashboards(self):
        from app.tools import query_looker_dashboards
        r = query_looker_dashboards(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_looker_explore_queries(self):
        from app.tools import query_looker_explore_queries
        r = query_looker_explore_queries(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

    def test_query_looker_metric_definitions(self):
        from app.tools import query_looker_metric_definitions
        r = query_looker_metric_definitions(limit=5)
        assert r["total"] > 0
        assert r.get("source_system")

class TestBehaviorContract:
    def test_contract_tools_importable(self):
        from app import tools as tools_module
        for fn in ["query_sap_s_4hana_fi_gl_entries","query_bigquery_analytics_events","query_looker_dashboards","lookup_ap_aging_analyzer_controls_playbook","action_sap_s_4hana_fi_generate"]:
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
        result = getattr(tools_module, "action_sap_s_4hana_fi_generate")(**{"target_id":"test_target_id","rationale":"test_rationale"})
        assert result.get("audit_trail")
        event_path = tmp_path / "action-events.jsonl"
        assert event_path.exists()
        assert "action_sap_s_4hana_fi_generate" in event_path.read_text()

    def test_write_tool_requires_multi_system_evidence(self):
        import asyncio
        from app.agent import enforce_tool_contract
        class _Tool:
            name = "action_sap_s_4hana_fi_generate"
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
