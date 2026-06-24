# MCP tool plane IAM. The runner + runtime SAs call 1P managed MCP servers
# (roles/mcp.toolUser → mcp.tools.call) and register custom MCP servers in Agent
# Registry (roles/agentregistry.editor). Per-product data roles are granted by
# data_plane.tf. See docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md.

locals {
  mcp_sas = [google_service_account.runner.email, google_service_account.gateway.email]
}

resource "google_project_iam_member" "mcp_tool_user" {
  for_each = var.enable_mcp ? toset(local.mcp_sas) : []
  project  = var.project_id
  role     = "roles/mcp.toolUser"
  member   = "serviceAccount:${each.value}"
}

resource "google_project_iam_member" "agentregistry_editor" {
  for_each = var.enable_mcp ? toset(local.mcp_sas) : []
  project  = var.project_id
  role     = "roles/agentregistry.editor"
  member   = "serviceAccount:${each.value}"
}

# Resolve/consume registered MCP toolsets at runtime (AgentRegistry.get_mcp_toolset).
resource "google_project_iam_member" "agentregistry_viewer" {
  for_each = var.enable_mcp ? toset(local.mcp_sas) : []
  project  = var.project_id
  role     = "roles/agentregistry.viewer"
  member   = "serviceAccount:${each.value}"
}

output "mcp_enabled" {
  value = var.enable_mcp
}
