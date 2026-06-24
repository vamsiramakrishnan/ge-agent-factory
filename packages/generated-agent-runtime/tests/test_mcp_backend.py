import pytest
import builtins

from generated_agent_runtime.mcp_backend import (
    BackendConfig,
    mcp_server_resource_name,
    resolve_source_adapters,
    wrap_function_tools,
)


def test_backend_config_from_env_defaults_and_server_name():
    config = BackendConfig.from_env({"GE_MCP_SERVER": "hr"})
    assert config.backend == "fixtures"
    assert config.location == "global"
    assert config.mcp_server_names == ("hr",)


def test_mcp_server_resource_name_adds_prefix_once():
    assert mcp_server_resource_name("hr") == "mcpServers/hr"
    assert mcp_server_resource_name("mcpServers/hr") == "mcpServers/hr"


def test_resolve_source_adapters_returns_fixtures_by_default():
    fixtures = [object()]
    assert resolve_source_adapters(fixtures) == fixtures


def test_resolve_source_adapters_honors_explicit_fixture_backend():
    fixtures = ["lookup"]
    assert resolve_source_adapters(fixtures, backend="fixtures") == fixtures


def test_wrap_function_tools_reports_missing_adk(monkeypatch):
    original_import = builtins.__import__

    def blocked_import(name, *args, **kwargs):
        if name.startswith("google.adk"):
            raise ImportError("blocked for test")
        return original_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", blocked_import)
    with pytest.raises(ImportError):
        wrap_function_tools([lambda: None])
