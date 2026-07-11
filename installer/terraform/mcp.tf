# MCP tool plane IAM. The runner + runtime SAs call 1P managed MCP servers
# (roles/mcp.toolUser → mcp.tools.call) and register custom MCP servers in Agent
# Registry (roles/agentregistry.editor). Per-product data roles are granted by
# data_plane.tf. See docs/design-specs/specs/2026-06-01-mcp-tool-plane-design.md.

locals {
  mcp_sas = {
    runner  = google_service_account.runner.email
    gateway = google_service_account.gateway.email
  }
}

resource "google_project_iam_member" "mcp_tool_user" {
  for_each = var.enable_mcp ? local.mcp_sas : {}
  project  = var.project_id
  role     = "roles/mcp.toolUser"
  member   = "serviceAccount:${each.value}"
}

resource "google_project_iam_member" "agentregistry_editor" {
  for_each = var.enable_mcp ? local.mcp_sas : {}
  project  = var.project_id
  role     = "roles/agentregistry.editor"
  member   = "serviceAccount:${each.value}"
}

# Resolve/consume registered MCP toolsets at runtime (AgentRegistry.get_mcp_toolset).
resource "google_project_iam_member" "agentregistry_viewer" {
  for_each = var.enable_mcp ? local.mcp_sas : {}
  project  = var.project_id
  role     = "roles/agentregistry.viewer"
  member   = "serviceAccount:${each.value}"
}

# Agent Registry MCP registration also binds the governed Agent Identity
# principalSet to the registry-backed MCP server through IAP. Keep this narrower
# than roles/iap.admin, which also grants tunnel and unrelated web policy access.
resource "google_project_iam_custom_role" "mcp_iap_policy_binder" {
  count       = var.enable_mcp ? 1 : 0
  project     = var.project_id
  role_id     = "geAgentFactoryMcpIapPolicyBinder"
  title       = "GE Agent Factory MCP IAP Policy Binder"
  description = "Allows the factory control plane to bind Agent Identity principals to Agent Registry MCP servers."
  permissions = [
    "iap.webServices.getIamPolicy",
    "iap.webServices.setIamPolicy",
  ]
}

resource "google_project_iam_member" "mcp_iap_policy_binder" {
  for_each = var.enable_mcp ? local.mcp_sas : {}
  project  = var.project_id
  role     = google_project_iam_custom_role.mcp_iap_policy_binder[0].id
  member   = "serviceAccount:${each.value}"
}

output "mcp_enabled" {
  value = var.enable_mcp
}
