# Agent Runtime agent-identity (Preview) IAM. Roles granted here mirror the runtime
# role set granted to the runtime SA in data_plane.tf/mcp.tf, but target the SPIFFE
# principalSet so every agent in the project carries them. SA remains the fallback
# when identity_type is unset at deploy. See
# docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md (Agent Identity).

locals {
  agent_identity_trust_domain = var.agent_identity_org_id != "" ? "agents.global.org-${var.agent_identity_org_id}.system.id.goog" : ""
  agent_identity_principalset = local.agent_identity_trust_domain != "" ? "principalSet://${local.agent_identity_trust_domain}/attribute.platformContainer/aiplatform/projects/${var.project_number}" : ""
  # Runtime role set the agents need at call time (read/write per-agent stores, 1P MCP, base).
  agent_identity_roles = var.enable_agent_identity && local.agent_identity_principalset != "" ? toset([
    "roles/mcp.toolUser",
    "roles/agentregistry.viewer",
    "roles/bigquery.dataEditor",
    "roles/bigquery.jobUser",
    "roles/datastore.user",
    "roles/bigtable.user",
    "roles/alloydb.client",
    "roles/secretmanager.secretAccessor",
    "roles/aiplatform.expressUser",
    "roles/serviceusage.serviceUsageConsumer",
  ]) : []
}

resource "google_project_iam_member" "agent_identity" {
  for_each = local.agent_identity_roles
  project  = var.project_id
  role     = each.value
  member   = local.agent_identity_principalset
}

# Object access to the shared agent-data bucket (uniform BLA; non-legacy role).
resource "google_storage_bucket_iam_member" "agent_identity_data" {
  count  = var.enable_agent_identity && var.enable_gcs_data && local.agent_identity_principalset != "" ? 1 : 0
  bucket = google_storage_bucket.data[0].name
  role   = "roles/storage.objectAdmin"
  member = local.agent_identity_principalset
}

output "agent_identity_principalset" {
  value = var.enable_agent_identity ? local.agent_identity_principalset : ""
}
