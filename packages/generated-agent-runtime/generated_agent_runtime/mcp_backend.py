"""MCP backend selection helpers for generated fixture tools."""

from __future__ import annotations

import os
from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass
from typing import Any, Callable

BACKEND_ENV = "GE_DATA_BACKEND"
PROJECT_ENV = "GOOGLE_CLOUD_PROJECT"
LOCATION_ENV = "GOOGLE_CLOUD_LOCATION"
MCP_SERVER_ENV = "GE_MCP_SERVER"
DEFAULT_BACKEND = "fixtures"
DEFAULT_LOCATION = "global"


@dataclass(frozen=True)
class BackendConfig:
    """Environment-derived backend settings for generated tools."""

    backend: str = DEFAULT_BACKEND
    project_id: str = ""
    location: str = DEFAULT_LOCATION
    mcp_server_names: Sequence[str] = ()

    @classmethod
    def from_env(cls, env: Mapping[str, str] | None = None) -> "BackendConfig":
        source_env = os.environ if env is None else env
        server = source_env.get(MCP_SERVER_ENV, "")
        return cls(
            backend=source_env.get(BACKEND_ENV, DEFAULT_BACKEND),
            project_id=source_env.get(PROJECT_ENV, ""),
            location=source_env.get(LOCATION_ENV, DEFAULT_LOCATION),
            mcp_server_names=(server,) if server else (),
        )


def mcp_server_resource_name(name: str) -> str:
    """Return the Agent Registry resource name for an MCP server id."""

    return name if name.startswith("mcpServers/") else f"mcpServers/{name}"


def wrap_function_tools(functions: Iterable[Callable[..., Any]]) -> list[Any]:
    """Wrap Python callables as ADK ``FunctionTool`` instances."""

    try:
        from google.adk.tools import FunctionTool
    except ImportError as exc:
        raise ImportError(
            "google-adk is required to wrap fixture functions as FunctionTool objects"
        ) from exc
    return [FunctionTool(func=func) for func in functions]


def load_mcp_toolsets(
    *,
    project_id: str,
    location: str = DEFAULT_LOCATION,
    mcp_server_names: Sequence[str],
    suppress_errors: bool = True,
) -> list[Any]:
    """Resolve registered MCP toolsets from Agent Registry."""

    try:
        from google.adk.auth.credential_manager import CredentialManager
        from google.adk.integrations.agent_identity import GcpAuthProvider
        from google.adk.integrations.agent_registry import AgentRegistry
    except ImportError as exc:
        raise ImportError("google-adk is required for GE_DATA_BACKEND=mcp") from exc

    CredentialManager.register_auth_provider(GcpAuthProvider())
    registry = AgentRegistry(project_id=project_id, location=location)
    toolsets: list[Any] = []
    for name in mcp_server_names:
        try:
            toolsets.append(
                registry.get_mcp_toolset(mcp_server_name=mcp_server_resource_name(name))
            )
        except Exception:
            if not suppress_errors:
                raise
    return toolsets


def resolve_source_adapters(
    fixture_adapters: Iterable[Any],
    *,
    env: Mapping[str, str] | None = None,
    backend: str | None = None,
    project_id: str | None = None,
    location: str | None = None,
    mcp_server_names: Sequence[str] | None = None,
    suppress_mcp_errors: bool = True,
) -> list[Any]:
    """Select fixture adapters or registered MCP toolsets."""

    config = BackendConfig.from_env(env)
    selected_backend = backend if backend is not None else config.backend
    fixtures = list(fixture_adapters)
    if selected_backend != "mcp":
        return fixtures

    names = tuple(mcp_server_names if mcp_server_names is not None else config.mcp_server_names)
    toolsets = load_mcp_toolsets(
        project_id=project_id if project_id is not None else config.project_id,
        location=location if location is not None else config.location,
        mcp_server_names=names,
        suppress_errors=suppress_mcp_errors,
    )
    return toolsets or fixtures
