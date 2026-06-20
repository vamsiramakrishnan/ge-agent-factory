# ADK Agent Structure For Mock Systems

Use this reference before generating or editing ADK agent code. Prefer
`agents-cli scaffold` for real projects; use this structure when building a
small harness-local prototype or when adapting generated code.

## Preferred CLI Flow

Create a prototype ADK agent:

```bash
agents-cli scaffold create mock-root-agent \
  --agent adk \
  --prototype \
  --deployment-target agent_runtime \
  --agent-guidance-filename GEMINI.md
```

Create an A2A mock agent:

```bash
agents-cli scaffold create mock-specialist-agent \
  --agent adk_a2a \
  --prototype \
  --deployment-target cloud_run \
  --agent-guidance-filename GEMINI.md
```

Enhance an existing ADK prototype for deployment:

```bash
agents-cli scaffold enhance . \
  --deployment-target agent_runtime \
  --agent-directory app \
  --agent-guidance-filename GEMINI.md
```

Run locally:

```bash
uv sync
uv run adk web
uv run agents-cli run "List available mock systems and explain what data exists."
```

Evaluate:

```bash
uv run agents-cli eval run
```

Deploy only after explicit human approval:

```bash
agents-cli deploy --project "$GOOGLE_CLOUD_PROJECT" --region "$GOOGLE_CLOUD_LOCATION" --no-confirm-project
```

Publish only after explicit human approval:

```bash
agents-cli publish gemini-enterprise \
  --gemini-enterprise-app-id "$GEMINI_ENTERPRISE_APP_ID" \
  --display-name "Mock Demo Agent" \
  --description "Composes generated mock systems for demo scenarios." \
  --registration-type adk
```

## Minimal uv Project Layout

```text
mock-root-agent/
├── pyproject.toml
├── .env.example
├── GEMINI.md
├── app/
│   ├── __init__.py
│   ├── agent.py
│   ├── tools.py
│   └── mock_registry.py
├── eval/
│   └── evalset.json
└── tests/
    └── smoke_test.py
```

For repo-local generated mocks:

```text
mock_systems/
├── scenarios/<scenario>.yaml
├── generated/<scenario>/manifest.json
├── generated/<scenario>/tables/*.csv
├── generated/<scenario>/documents/*.md
└── src/
    ├── generate.js
    └── adapters/
        ├── adk-tools.py
        ├── api-server.js
        ├── mcp-server.js
        └── a2a-agent/
```

## pyproject.toml

Use Python 3.11-compatible bounds unless the scaffolded project says otherwise.

```toml
[project]
name = "mock-root-agent"
version = "0.1.0"
requires-python = ">=3.10,<3.13"
dependencies = [
  "google-adk>=1.26.0",
  "google-genai>=1.9.0",
  "python-dotenv>=1.0.0",
  "pydantic>=2.0.0",
]

[tool.adk]
project_type = "agent"

[tool.uv]
environments = [
  "sys_platform == 'linux'",
]
```

For Agent Registry A2A composition, add:

```toml
dependencies = [
  "google-adk[a2a]>=1.26.0",
  "httpx>=0.27.0",
  "google-auth>=2.0.0",
]
```

For Agent Registry MCP auth, add:

```toml
dependencies = [
  "google-adk[agent-identity]>=1.26.0",
]
```

## .env.example

```bash
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=global
MOCK_SYSTEMS_ROOT=../mock_systems/generated
MOCK_SCENARIO_ID=hr-transformation
```

## app/__init__.py

```python
from .agent import root_agent

__all__ = ["root_agent"]
```

## app/mock_registry.py

```python
from __future__ import annotations

import json
import os
from pathlib import Path


def scenario_root() -> Path:
    root = Path(os.environ.get("MOCK_SYSTEMS_ROOT", "../mock_systems/generated"))
    scenario_id = os.environ.get("MOCK_SCENARIO_ID", "hr-transformation")
    return (Path.cwd() / root / scenario_id).resolve()


def load_manifest() -> dict:
    path = scenario_root() / "manifest.json"
    return json.loads(path.read_text(encoding="utf-8"))
```

## app/tools.py

Use local ADK function tools for data fixtures and tiny API mocks.

```python
from __future__ import annotations

import csv
from pathlib import Path
from typing import Any

from google.adk.tools import FunctionTool

from .mock_registry import load_manifest, scenario_root


def list_mock_systems() -> dict[str, Any]:
    """List mock systems and datasets available in the current scenario."""
    manifest = load_manifest()
    return {
        "scenario": manifest["id"],
        "systems": manifest.get("systems", []),
        "tables": [table["name"] for table in manifest.get("tables", [])],
        "documents": manifest.get("documents", []),
    }


def get_table_schema(table_name: str) -> dict[str, Any]:
    """Return schema metadata for a generated table."""
    manifest = load_manifest()
    for table in manifest.get("tables", []):
        if table["name"] == table_name:
            return table
    return {"error": f"unknown table: {table_name}"}


def preview_table(table_name: str, limit: int = 20) -> dict[str, Any]:
    """Return up to limit rows from a generated CSV table."""
    manifest = load_manifest()
    table = next((item for item in manifest.get("tables", []) if item["name"] == table_name), None)
    if table is None:
        return {"error": f"unknown table: {table_name}"}
    limit = max(1, min(int(limit), 100))
    path = scenario_root() / table["path"]
    with path.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))[:limit]
    return {"table": table_name, "rows": rows, "limit": limit}


mock_tools = [
    FunctionTool(func=list_mock_systems),
    FunctionTool(func=get_table_schema),
    FunctionTool(func=preview_table),
]
```

## app/agent.py

```python
from google.adk.agents import Agent

from .tools import mock_tools

root_agent = Agent(
    name="mock_root_agent",
    model="gemini-flash-latest",
    instruction=(
        "You are a transparent demo agent. Use the mock tools to inspect "
        "available systems, schemas, and fixture rows before answering. "
        "Never invent tables, columns, IDs, or anomaly evidence."
    ),
    tools=mock_tools,
)
```

## MCP Mock Agent Structure

Use an MCP mock when you need protocol compatibility with a real MCP server.
Keep the MCP server separate from the root ADK app.

```text
mock_systems/src/adapters/mcp-server.js
```

ADK should connect to it via `McpToolset`. If it becomes a shared governed
resource, register it in Agent Registry and consume it with
`AgentRegistry.get_mcp_toolset(...)`.

## A2A Mock Agent Structure

Use `agents-cli scaffold create --agent adk_a2a`; do not hand-roll A2A server
schemas. The root ADK agent can consume it directly during prototype work or
with `AgentRegistry.get_remote_a2a_agent(...)` after registration.

## Precision Rules For Gemini CLI

- Do not invent ADK import paths. Use installed `google-agents-cli-adk-code` or ADK docs MCP when unsure.
- Do not create deployment or Terraform files manually if `agents-cli scaffold enhance` can generate them.
- Do not alter generated `[tool.agents-cli]`, `[tool.adk]`, deployment, or app package metadata unless the user asks.
- Keep fixture adapters limit-bound: no unbounded table dumps.
- Preserve `deployment_metadata.json` after deploy; publish uses it.
- Use `uv run ...` inside ADK projects so the right environment is active.
