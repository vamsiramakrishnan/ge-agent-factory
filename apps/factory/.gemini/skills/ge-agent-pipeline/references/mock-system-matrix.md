# Mock System Matrix

## Data Mock

Use when the agent needs realistic records but no protocol boundary.

Artifacts:

- `scenario.yaml`
- `manifest.json`
- CSV/JSON tables
- external evidence documents
- seeded anomaly index

ADK integration:

- `list_tables`
- `get_schema`
- `query_table`
- `read_document`

Registration:

- Local ADK function tools only.
- Do not register with Agent Registry unless the data mock is exposed through an MCP server.
- Do not publish to Gemini Enterprise directly.

## API Mocker

Use when the real system is REST/HTTP, such as HRIS, ERP, CRM, ticketing, payroll, or inventory.

Artifacts:

- OpenAPI spec or route manifest
- fixture-backed route handlers
- deterministic error states
- auth simulation mode

ADK integration:

- Prefer ADK OpenAPI tools if the OpenAPI spec is useful to the model.
- Use local function tools if the API surface is tiny.

Registration:

- Local-only in prototype mode.
- Deploy as Cloud Run if another agent/service must call it over HTTP.
- Publish only the ADK agent that uses it, not the mock API itself.

## MCP Mocker

Use when you want the mock to match the interface of a real MCP server.

Artifacts:

- MCP tool names and schemas
- fixture-backed tool handlers
- local stdio or HTTP transport
- compatibility notes against the real MCP server

ADK integration:

- Use `McpToolset` for direct local/HTTP MCP usage.
- Use `AgentRegistry.get_mcp_toolset(...)` only for registered governed MCP resources.

Registration:

- Prototype: local MCP server wired directly to ADK.
- Governed/shared: register the MCP server in Agent Registry or use Cloud API Registry where supported.
- Gemini Enterprise sees the deployed ADK agent that consumes the MCP mock.

## A2A / Remote-Agent Mock

Use when the mock should behave like another autonomous agent.

Artifacts:

- Agent card
- A2A endpoint
- deterministic response policy
- scenario state fixtures

ADK integration:

- Use the A2A scaffold from `agents-cli scaffold create --agent adk_a2a`.
- Consume with `AgentRegistry.get_remote_a2a_agent(...)` when registered.

Registration:

- Prototype: direct remote A2A agent URL.
- Shared/governed: register as A2A in Agent Registry.
- Gemini Enterprise publishing uses `agents-cli publish gemini-enterprise --registration-type a2a --agent-card-url ...` for A2A agents.

## Composite Demo System

Use when a single business scenario needs multiple mocked systems.

Recommended composition:

- Data generator creates canonical entities and IDs.
- API mocker exposes transactional workflows.
- MCP mocker exposes analytical/query workflows.
- A2A mock agent simulates a specialist system.
- Root ADK agent composes them and is the only thing published to Gemini Enterprise.

