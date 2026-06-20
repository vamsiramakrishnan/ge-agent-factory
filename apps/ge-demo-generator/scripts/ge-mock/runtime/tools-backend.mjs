// Runtime tool-backend switch for generated agents.
//
// app/tools.py defines the fixtures tools inline, then this module's output picks
// the backend at import time:
//   GE_DATA_BACKEND=fixtures (default, local/offline) -> in-process FunctionTools.
//   GE_DATA_BACKEND=mcp (cloud) -> tools resolved from Agent Registry by server name
//     via google.adk AgentRegistry.get_mcp_toolset(). Auth is ADC / Agent Runtime
//     agent identity, applied automatically by GcpAuthProvider. The registry holds
//     the endpoint + bindings, so the agent never hardcodes a URL.
//
// Refs: https://docs.cloud.google.com/agent-registry/manage-mcp-tools
//       https://docs.cloud.google.com/agent-registry/authenticate-toolsets

// 1P managed MCP OAuth scopes per store (kept for reference / source-integration).
export const ONE_PARTY_MCP_SCOPES = {
  bigquery: "https://www.googleapis.com/auth/bigquery",
  firestore: "https://www.googleapis.com/auth/datastore",
  bigtable: "https://www.googleapis.com/auth/bigtable.data",
  alloydb: "https://www.googleapis.com/auth/cloud-platform",
  gcs: "https://www.googleapis.com/auth/devstorage.read_write",
};

/**
 * Render the Python tail appended to app/tools.py. Assumes `source_adapters_fixtures`
 * is already defined above it. Returns a string.
 * The mcp backend resolves the agent's registered MCP server(s) from Agent Registry
 * by name (`mcpServers/<id>`) — "use the right tools via the registry".
 * @param {{agentId:string, department?:string, mcpServerName:string, onePartyServers?:string[]}} opts
 */
export function renderToolsModule({ agentId, department = "general", mcpServerName, onePartyServers = [] } = {}) {
  const serverName = mcpServerName || (agentId || "mock-agent").replace(/_/g, "-");
  // Additional registered servers to resolve (e.g. 1P managed MCP). Custom dept server first.
  const serverLines = [`        "mcpServers/${serverName}",`, ...onePartyServers.map((s) => `        "mcpServers/${s}",`)].join("\n");
  return [
    ``,
    `# ── runtime tool backend ─────────────────────────────────────────────────`,
    `# GE_DATA_BACKEND=fixtures (default, local/offline) -> in-process FunctionTools.`,
    `# GE_DATA_BACKEND=mcp (cloud) -> tools resolved from Agent Registry by name.`,
    `# Auth: ADC / Agent Runtime agent identity via GcpAuthProvider (no hardcoded URL).`,
    `# department: ${department}`,
    `import os as _os`,
    `_BACKEND = _os.environ.get("GE_DATA_BACKEND", "fixtures")`,
    `_PROJECT = _os.environ.get("GOOGLE_CLOUD_PROJECT", "")`,
    `_LOCATION = _os.environ.get("GOOGLE_CLOUD_LOCATION", "global")`,
    `_AGENT_ID = _os.environ.get("GE_AGENT_ID", "${agentId}")`,
    `# Registry server id this agent registers as (override via env if needed).`,
    `_MCP_SERVER = _os.environ.get("GE_MCP_SERVER", "${serverName}")`,
    ``,
    `def _mcp_toolsets():`,
    `    # Resolve registered MCP toolsets from Agent Registry. ADC (Agent Identity`,
    `    # or service account) authenticates both the registry lookup and the tool calls.`,
    `    from google.adk.auth.credential_manager import CredentialManager`,
    `    from google.adk.integrations.agent_identity import GcpAuthProvider`,
    `    from google.adk.integrations.agent_registry import AgentRegistry`,
    `    CredentialManager.register_auth_provider(GcpAuthProvider())`,
    `    registry = AgentRegistry(project_id=_PROJECT, location=_LOCATION)`,
    `    toolsets = []`,
    `    for _name in [`,
    serverLines,
    `    ]:`,
    `        try:`,
    `            toolsets.append(registry.get_mcp_toolset(mcp_server_name=_name))`,
    `        except Exception:  # a server not yet registered shouldn't crash startup`,
    `            pass`,
    `    return toolsets`,
    ``,
    `if _BACKEND == "mcp":`,
    `    source_adapters = _mcp_toolsets() or source_adapters_fixtures`,
    `else:`,
    `    source_adapters = source_adapters_fixtures`,
    `mock_tools = source_adapters  # Backwards-compatible alias for older harness validators.`,
    ``,
  ].join("\n");
}
