"""Generic multi-tenant MCP server for GE Agent Factory.

Deployed once per department as ge-agent-factory-mcp-<dept>. Each request carries
?agent=<id>; the server loads that agent's mcp-tools.json + store coordinates and
exposes tools. GE_DATA_BACKEND=fixtures serves bundled/GCS fixtures; =mcp queries
per-agent stores. This module keeps tool *definitions* generic; backend execution
is dispatched by GE_DATA_BACKEND.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

# The simulator engine is a standalone package (packages/simulator-runtime) and is
# corpus-agnostic. Point it at this app's pack corpus unless the deployment already set
# GE_SIMULATOR_SYSTEMS_DIR (e.g. the container does). Resolution in simulator_runtime is
# lazy, so this is the only wiring needed and keeps behaviour identical to before.
import simulator_runtime

if not os.environ.get(simulator_runtime.PACKS_DIR_ENV):
    _CORPUS = Path(__file__).resolve().parents[1] / "simulator-systems"
    if (_CORPUS / "registry.json").is_file():
        simulator_runtime.configure(packs_dir=_CORPUS)

from simulator_runtime.router import execute_simulator_tool, is_simulator_tool, list_simulators

BACKEND = os.environ.get("GE_DATA_BACKEND", "fixtures")
DATA_BUCKET = os.environ.get("GE_AGENT_DATA_BUCKET", "")
FIXTURE_ROOT = os.environ.get("GE_MCP_FIXTURE_ROOT", "/srv/fixtures")


def _read_fixture_manifest(agent_id: str) -> dict[str, Any]:
    path = Path(FIXTURE_ROOT) / "agents" / agent_id / "mcp-tools.json"
    if not path.exists():
        raise FileNotFoundError(f"no manifest for agent {agent_id} at {path}")
    return json.loads(path.read_text("utf-8"))


def _read_gcs_manifest(agent_id: str) -> dict[str, Any]:
    from google.cloud import storage  # imported lazily; absent in offline tests

    client = storage.Client()
    blob = client.bucket(DATA_BUCKET).blob(f"agents/{agent_id}/mcp-tools.json")
    if not blob.exists():
        raise KeyError(f"no manifest for agent {agent_id} in gs://{DATA_BUCKET}")
    return json.loads(blob.download_as_text())


def load_agent_manifest(agent_id: str) -> dict[str, Any]:
    """Load an agent's tool manifest from fixtures (offline/local) or GCS (cloud)."""
    if BACKEND == "fixtures":
        return _read_fixture_manifest(agent_id)
    return _read_gcs_manifest(agent_id)


def build_tools(agent_id: str) -> list[dict[str, Any]]:
    """Return the agent's tool descriptors (name/description/inputSchema)."""
    return load_agent_manifest(agent_id).get("tools", [])


def make_app():
    """Build the FastMCP ASGI app. Tools are registered per-agent at call time via
    a router that reads ?agent=<id>. Kept thin so the module imports without a
    network/credentials dependency (tests import load_agent_manifest/build_tools)."""
    from fastmcp import FastMCP

    mcp = FastMCP("ge-agent-factory-mcp")

    @mcp.tool()
    def list_agent_tools(agent: str) -> list[dict[str, Any]]:
        """List the tools available for a given agent id."""
        return build_tools(agent)

    @mcp.tool()
    def list_system_simulators() -> dict[str, Any]:
        """List stateful upstream-system simulators supported by this MCP service."""
        return list_simulators()

    @mcp.tool()
    def synthesize_simulator(
        description: str = "",
        display_name: str | None = None,
        mode: str = "nl",
        samples: dict[str, Any] | None = None,
        openapi: dict[str, Any] | None = None,
        seed: int = 42,
        use_llm: bool = True,
    ) -> dict[str, Any]:
        """Synthesize a NEW stateful simulator from a natural-language description (mode=nl),
        example rows (mode=samples), or an OpenAPI spec (mode=openapi) and mount it LIVE — no
        redeploy. Returns the new system id, its tools, and seed row counts so the caller can
        immediately bind the tools to an agent."""
        import synthesis  # lazy: keeps server import free of the genai dependency

        spec: dict[str, Any] = {
            "mode": mode, "description": description, "displayName": display_name,
            "seed": seed, "use_llm": use_llm,
        }
        if samples is not None:
            spec["samples"] = samples
        if openapi is not None:
            spec["openapi"] = openapi
        result = synthesis.synthesize_system(spec)
        result.pop("contract", None)  # keep the MCP response compact
        return result

    @mcp.tool()
    def call_agent_tool(agent: str, tool: str, args: dict[str, Any] | None = None) -> dict[str, Any]:
        """Invoke an agent tool. fixtures backend echoes a deterministic record;
        the store backend (GE_DATA_BACKEND=mcp) queries the per-agent stores."""
        manifest = load_agent_manifest(agent)
        by_name = {t["name"]: t for t in manifest.get("tools", [])}
        if tool not in by_name:
            raise KeyError(f"tool {tool} not defined for agent {agent}")
        if is_simulator_tool(by_name[tool]):
            return execute_simulator_tool(agent, by_name[tool], args or {})
        if BACKEND == "fixtures":
            return {"agent": agent, "tool": tool, "args": args or {}, "deterministic": True}
        from store_backend import execute_tool  # added in Task 7

        return execute_tool(agent, by_name[tool], args or {})

    return mcp


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    make_app().run(transport="http", host="0.0.0.0", port=port)
