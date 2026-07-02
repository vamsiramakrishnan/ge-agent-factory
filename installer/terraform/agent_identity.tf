# Agent Runtime agent-identity (Preview) IAM. Roles granted here mirror the runtime
# role set granted to the runtime SA in data_plane.tf/mcp.tf, but target the SPIFFE
# principalSet so every agent in the project carries them. SA remains the fallback
# when identity_type is unset at deploy. See
# docs/design-specs/specs/2026-06-01-mcp-tool-plane-design.md (Agent Identity) and
# https://docs.cloud.google.com/iam/docs/agent-identity-overview.

# Derive the org id (and validate the project) from the project itself, so
# enable_agent_identity is NOT a silent no-op when agent_identity_org_id is left
# empty. data.google_project.org_id is the bare numeric org id when the project
# is org-parented; "" otherwise.
data "google_project" "this" {
  project_id = var.project_id
}

locals {
  # Org id resolution: explicit override wins; otherwise derive from the project.
  # try() guards the null/folder-parented case (org_id absent -> "").
  agent_identity_derived_org      = try(trimprefix(data.google_project.this.org_id, "organizations/"), "")
  agent_identity_org_id_effective = var.agent_identity_org_id != "" ? var.agent_identity_org_id : local.agent_identity_derived_org
  agent_identity_trust_domain     = local.agent_identity_org_id_effective != "" ? "agents.global.org-${local.agent_identity_org_id_effective}.system.id.goog" : ""
  # principalSet covering every Agent Runtime agent in this project. Syntax per
  # https://docs.cloud.google.com/iam/docs/auth-agent-own-identity (grant to all
  # agents in a project): principalSet://<trust-domain>/attribute.platformContainer/aiplatform/projects/<number>
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

# Fail loud: enabling agent identity without a resolvable trust domain would
# silently grant nothing, so agents would deploy WITH an Agent Identity but ZERO
# IAM — the exact "we thought we enabled it" trap. Stop the apply with an
# actionable message instead of granting nothing.
resource "terraform_data" "agent_identity_guard" {
  count = var.enable_agent_identity ? 1 : 0
  lifecycle {
    precondition {
      condition     = local.agent_identity_principalset != ""
      error_message = "enable_agent_identity = true but the SPIFFE trust domain could not be resolved (agent_identity_org_id is empty and the project's org_id could not be derived — e.g. a folder-parented project). Set agent_identity_org_id to your numeric organization id, or set enable_agent_identity = false. Otherwise deployed agents receive an Agent Identity with NO IAM permissions and fail at runtime."
    }
  }
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

# Surface the resolved org id so an operator can confirm at a glance whether
# agent identity actually resolved (vs. silently granting nothing).
output "agent_identity_org_id_resolved" {
  value = local.agent_identity_org_id_effective
}
