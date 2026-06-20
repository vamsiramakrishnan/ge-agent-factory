# Managed Agent Gateway — the MCP plane's governed front door.
#
# Uses the official GoogleCloudPlatform/terraform-google-agent-gateway module
# (pinned to v0.5.0, git source — not yet on the public registry) to provision
# google_network_services_agent_gateway. This replaces ad-hoc per-service ingress
# to the MCP servers with a single managed mTLS endpoint + governed access +
# Service Extensions, and grants ONLY the gateway's Service Extensions identity
# run.invoker on the MCP services (agent-identity least privilege).
#
# Gated by var.enable_agent_gateway. The installer/provision-agent-gateway.sh
# helper provisions it only when it is not already present.

module "agent_gateway" {
  source = "git::https://github.com/GoogleCloudPlatform/terraform-google-agent-gateway.git?ref=v0.5.0"

  count = var.enable_agent_gateway ? 1 : 0

  project_id   = var.project_id
  gateway_name = var.agent_gateway_name
  location     = var.agent_gateway_location

  protocols                           = var.agent_gateway_protocols
  google_managed_governed_access_path = var.agent_gateway_access_path
  # Per the setup guide: AGENT_TO_ANYWHERE (egress) uses `registries` to govern an
  # agent's outbound calls to MCP servers registered in Agent Registry — this is our
  # use case. CLIENT_TO_AGENT (ingress) omits registries and is Agent-Runtime-only.
  registries                               = var.agent_gateway_access_path == "AGENT_TO_ANYWHERE" ? var.agent_gateway_registries : []
  network_config_egress_network_attachment = var.agent_gateway_egress_network_attachment
  labels                                   = { app = "ge-agent-factory", component = "agent-gateway" }
  description                              = "GE Agent Factory managed Agent Gateway (MCP plane front door)."

  depends_on = [google_project_service.enabled]
}

locals {
  agent_gateway_enabled = var.enable_agent_gateway && length(module.agent_gateway) > 0
  agent_gateway_service_extensions_sa = (
    local.agent_gateway_enabled
    ? module.agent_gateway[0].service_extensions_account
    : null
  )
  # for_each keys must be static (service names) — the gateway SA is apply-time and
  # only feeds the binding's `member`, not the set keys.
  agent_gateway_mcp_targets = (
    var.enable_agent_gateway && var.agent_gateway_grant_mcp_invoker
    ? toset(var.agent_gateway_mcp_services)
    : toset([])
  )
}

# Authz enforcement mode is codified as a single var (var.agent_gateway_authz_action).
# The terraform-google-agent-gateway module only creates the agentGateways resource;
# the authz extension + policy are applied out-of-band via gcloud from
# installer/agent-gateway-authz/. To keep IaC the source of truth for the DRY_RUN ⇄
# ENFORCED flip, Terraform RENDERS the extension YAML from a template driven by the var.
# Flip: `terraform apply -var agent_gateway_authz_action=ENFORCED`, then re-import the
# rendered YAML (see installer/AGENT-GATEWAY.md). Rollback: set it back to DRY_RUN.
resource "local_file" "agent_gateway_authz_extension" {
  filename = "${path.module}/../agent-gateway-authz/iap-request-authz-extension.yaml"
  content = templatefile("${path.module}/../agent-gateway-authz/iap-request-authz-extension.yaml.tftpl", {
    authz_action = var.agent_gateway_authz_action
  })
}

# Let ONLY the managed gateway's Service Extensions SA invoke the MCP services.
resource "google_cloud_run_service_iam_member" "agent_gateway_invokes_mcp" {
  for_each = local.agent_gateway_mcp_targets

  project  = var.project_id
  location = var.region
  service  = each.value
  role     = "roles/run.invoker"
  member   = "serviceAccount:${local.agent_gateway_service_extensions_sa}"
}
