# ADK Registration Model

This repo should treat ADK integration as three separate layers. Do not use the old generated `make register-gemini-enterprise` flow as the primary path unless maintaining backwards compatibility with generated demos.

## 1. Define Tools Inside The ADK Agent

Use this when the agent owns the tool implementation.

- Python function tools live in the ADK project, usually `app/tools.py`.
- The root agent imports the tool and passes it in `tools=[...]`, usually in `app/agent.py`.
- For new ADK projects, scaffold first:

```bash
agents-cli scaffold create <project-name> --agent adk --prototype --agent-guidance-filename GEMINI.md
```

- For this generator or another existing project, enhance instead of manually inventing deployment files:

```bash
agents-cli scaffold enhance . --deployment-target agent_runtime
```

Use the official installed skills:

- `google-agents-cli-workflow`
- `google-agents-cli-adk-code`
- `google-agents-cli-scaffold`
- `google-agents-cli-eval`

## 2. Use Registered MCP Servers Or Remote Agents From ADK

Use this when the tool or sub-agent is governed outside the current ADK codebase.

There are two related registry concepts:

- **Cloud API Registry / Google MCP servers**: discover and enable Google or organization MCP servers. These become ADK `McpToolset` objects.
- **Google Cloud Agent Registry ADK integration**: discover registered MCP servers and A2A agents from ADK code with `AgentRegistry`.

Enable Google Cloud MCP servers before expecting the agent to use them:

```bash
gcloud beta services mcp enable bigquery.googleapis.com --project="$GOOGLE_CLOUD_PROJECT"
gcloud beta services mcp enable mapstools.googleapis.com --project="$GOOGLE_CLOUD_PROJECT"
```

List MCP servers visible to the project:

```bash
gcloud beta api-registry mcp servers list --project="$GOOGLE_CLOUD_PROJECT"
```

Use Cloud API Registry MCP toolsets in ADK code when you know the MCP server resource name:

```python
from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.api_registry import ApiRegistry

PROJECT_ID = "your-project-id"
MCP_SERVER_NAME = "projects/your-project-id/locations/global/mcpServers/your-mcp-server-name"

def header_provider(context):
    return {"x-goog-user-project": PROJECT_ID}

api_registry = ApiRegistry(
    api_registry_project_id=PROJECT_ID,
    header_provider=header_provider,
)

registry_tools = api_registry.get_toolset(
    mcp_server_name=MCP_SERVER_NAME,
)

root_agent = LlmAgent(
    model="gemini-flash-latest",
    name="registry_backed_agent",
    instruction="Use registered tools where appropriate.",
    tools=[registry_tools],
)
```

Use Agent Registry when composing with registered MCP servers and A2A agents:

```python
import os
from google.adk.agents.llm_agent import LlmAgent
from google.adk.integrations.agent_registry import AgentRegistry

project_id = os.environ["GOOGLE_CLOUD_PROJECT"]
location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")

registry = AgentRegistry(project_id=project_id, location=location)

mcp_toolset = registry.get_mcp_toolset(
    mcp_server_name=f"projects/{project_id}/locations/{location}/mcpServers/YOUR_MCP_SERVER_ID",
)

remote_agent = registry.get_remote_a2a_agent(
    agent_name=f"projects/{project_id}/locations/{location}/agents/YOUR_AGENT_ID",
)

root_agent = LlmAgent(
    model="gemini-flash-latest",
    name="composed_agent",
    instruction="Use governed tools and sub-agents.",
    tools=[mcp_toolset],
    sub_agents=[remote_agent],
)
```

Required runtime setup:

- Enable `cloudapiregistry.googleapis.com`, `apihub.googleapis.com`, and the target Google APIs.
- Authenticate with Application Default Credentials for development.
- Grant viewer access for listing registry entries and service-specific roles for tool execution.
- For BigQuery MCP, grant `bigquery.jobUser` and `bigquery.dataViewer` to the runtime identity.
- For Maps MCP, configure the required API key or project auth expected by the server.

## 3. Deploy The ADK Agent

Gemini Enterprise registration needs a deployed, reachable agent first. Prefer Agent Runtime for standard ADK agents:

```bash
agents-cli scaffold enhance . --deployment-target agent_runtime
agents-cli deploy --project "$GOOGLE_CLOUD_PROJECT" --region "$GOOGLE_CLOUD_LOCATION" --no-confirm-project
```

`agents-cli deploy` writes `deployment_metadata.json`. Preserve this file because `agents-cli publish gemini-enterprise` can auto-detect Agent Runtime IDs and registration mode from it.

Use `google-agents-cli-deploy` for deployment details and do not run deployment without explicit human approval.

## 4. Publish To Gemini Enterprise

Use this when the deployed ADK agent should appear as a Gemini Enterprise agent/tool.

Prerequisites:

- A Gemini Enterprise app already exists.
- The ADK agent is deployed to Agent Runtime, Cloud Run, or GKE.
- For Agent Runtime, `deployment_metadata.json` exists.

Preferred command for Agent Runtime:

```bash
agents-cli publish gemini-enterprise \
  --gemini-enterprise-app-id "$GEMINI_ENTERPRISE_APP_ID" \
  --display-name "Demo Agent" \
  --description "Analyzes demo data and registered tools" \
  --registration-type adk
```

Fully explicit ADK registration:

```bash
agents-cli publish gemini-enterprise \
  --agent-runtime-id "$AGENT_RUNTIME_ID" \
  --gemini-enterprise-app-id "$GEMINI_ENTERPRISE_APP_ID" \
  --display-name "Demo Agent" \
  --description "Analyzes demo data and registered tools" \
  --tool-description "Answers business questions with governed tools" \
  --registration-type adk
```

A2A registration, usually for Cloud Run or explicit A2A agents:

```bash
agents-cli publish gemini-enterprise \
  --registration-type a2a \
  --agent-card-url "$AGENT_CARD_URL" \
  --gemini-enterprise-app-id "$GEMINI_ENTERPRISE_APP_ID" \
  --display-name "A2A Demo Agent"
```

Use `google-agents-cli-publish` for publishing details. Prefer `agents-cli publish gemini-enterprise` over the legacy `make register-gemini-enterprise` command.

### Direct REST Registration

Use this when the harness needs exact control over the Gemini Enterprise registration request or when `agents-cli publish gemini-enterprise` is not available.

Official REST shape:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -H "X-Goog-User-Project: ${PROJECT_ID}" \
  "https://${ENDPOINT_LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${APP_LOCATION}/collections/default_collection/engines/${APP_ID}/assistants/default_assistant/agents" \
  --data-binary @registration.json
```

Minimal ADK registration payload:

```json
{
  "displayName": "Demo Agent",
  "description": "Analyzes demo data and registered tools",
  "adkAgentDefinition": {
    "toolSettings": {
      "toolDescription": "Answers business questions with governed tools"
    },
    "provisionedReasoningEngine": {
      "reasoningEngine": "projects/PROJECT_ID/locations/RESOURCE_LOCATION/reasoningEngines/RESOURCE_ID"
    }
  }
}
```

With OAuth user consent:

```json
{
  "displayName": "Demo Agent",
  "description": "Analyzes demo data and registered tools",
  "adkAgentDefinition": {
    "toolSettings": {
      "toolDescription": "Answers business questions with governed tools"
    },
    "provisionedReasoningEngine": {
      "reasoningEngine": "projects/PROJECT_ID/locations/RESOURCE_LOCATION/reasoningEngines/RESOURCE_ID"
    },
    "authorizations": [
      "projects/PROJECT_NUMBER/locations/global/authorizations/AUTHORIZATION_ID"
    ]
  }
}
```

Repo helper:

```bash
PROJECT_ID="$GOOGLE_CLOUD_PROJECT" \
APP_ID="your-gemini-enterprise-engine-id" \
APP_LOCATION="global" \
RESOURCE_LOCATION="us-central1" \
RESOURCE_ID="1234567890" \
DISPLAY_NAME="Demo Agent" \
DESCRIPTION="Analyzes demo data and registered tools" \
TOOL_DESCRIPTION="Answers business questions with governed tools" \
npm run register:gemini-enterprise
```

Use `AGENT_RUNTIME_ID` instead of `RESOURCE_LOCATION`/`RESOURCE_ID` if you already have the full reasoning engine resource name.

Optional OAuth authorization:

```bash
AUTH_RESOURCE_NAME="projects/PROJECT_NUMBER/locations/global/authorizations/AUTHORIZATION_ID" \
npm run register:gemini-enterprise
```

If the agent needs OAuth and no authorization exists yet, create one in Gemini Enterprise first or use the Google Cloud documentation's `authorizations` REST endpoint. Then pass the resulting full resource name as `AUTH_RESOURCE_NAME`.

## Practical Rule For This Harness

When Gemini is asked to add or register tools:

1. If the tool is local business logic, implement it as an ADK function tool.
2. If the tool is a Google Cloud API capability, enable the MCP server and consume it via Cloud API Registry or Agent Registry.
3. If the tool is another deployed agent, register/use it as A2A through Agent Registry.
4. Only after the root ADK agent is working and deployed, publish the root agent to Gemini Enterprise.
5. For Gemini Enterprise registration, prefer `agents-cli publish gemini-enterprise`; use `scripts/register-gemini-enterprise-adk.sh` when an explicit REST call is required.
