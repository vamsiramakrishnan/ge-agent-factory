variable "project_id" {
  description = "Target GCP project id where the factory will be deployed."
  type        = string
}

variable "project_number" {
  description = "Numeric GCP project number. Find via: gcloud projects describe <project_id> --format='value(projectNumber)'."
  type        = string
}

variable "region" {
  description = "Region for Cloud Run, Cloud Tasks, Artifact Registry, and the factory bucket."
  type        = string
  default     = "us-central1"
}

variable "firestore_location" {
  description = "Firestore database location id (multi-region 'nam5'/'eur3' or a single region)."
  type        = string
  default     = "nam5"
}

variable "gemini_enterprise_app_id" {
  description = "Existing Gemini Enterprise app resource name. Create the app in Cloud Console before installing."
  type        = string
}

variable "gemini_enterprise_location" {
  description = "Gemini Enterprise app location (usually 'global')."
  type        = string
  default     = "global"
}

variable "enable_iap" {
  description = "Enable direct Cloud Run IAP on the human-facing UI services (console/presentation): external ingress, but only IAP-authenticated users in var.iap_members may reach them. Gateway/worker are NOT IAP'd (they're external + IAM/OIDC-authenticated)."
  type        = bool
  default     = false
}

variable "iap_members" {
  description = "Principals granted 'IAP-secured Web App User' (roles/iap.httpsResourceAccessor) on the IAP'd UI services. Default: all Googlers."
  type        = list(string)
  default     = ["domain:google.com"]
}

variable "allow_public_gateway" {
  description = "Allow unauthenticated (allUsers) access to the gateway. Default false — the gateway is external but authenticated-only (callers present a Google identity token / IAM run.invoker). Intended only for throwaway demos."
  type        = bool
  default     = false
}

variable "enable_iap_lb" {
  description = "Legacy: front the gateway with the external HTTPS load balancer + IAP (iap_lb.tf) instead of leaving it on direct authenticated ingress. Requires var.domain. Off by default — most setups don't need the LB."
  type        = bool
  default     = false
}

variable "console_image" {
  description = "Container image for the console UI Cloud Run service. Empty = don't create the service (wire it when you have an image)."
  type        = string
  default     = ""
}

variable "presentation_image" {
  description = "Container image for a standalone presentation/deck UI Cloud Run service. Empty = don't create it (the gateway serves the deck today)."
  type        = string
  default     = ""
}

variable "iap_member" {
  description = "Deprecated: single legacy IAP principal for the LB backend (iap_lb.tf). Prefer var.iap_members for the direct Cloud Run IAP path."
  type        = string
  default     = ""
}

variable "iap_backend_service_id" {
  description = "Numeric backend service id of the IAP-fronted load balancer. Populated after scripts/enable-iap.sh creates the LB; used to build IAP_EXPECTED_AUDIENCE for the gateway's middleware."
  type        = string
  default     = ""
}

variable "gateway_image" {
  description = "Container image for the gateway Cloud Run service. Defaults to the public hello image so the first apply succeeds before containers exist; build-and-deploy.sh re-applies with a real image."
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "worker_image" {
  description = "Container image for the worker Cloud Run service. Same placeholder pattern as gateway_image."
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "oidc_allowed_audiences" {
  description = "Comma-separated audiences the gateway's IAP middleware will accept on an OIDC bearer token. After first apply, set this to the gateway URL so service-account callers can call an IAP-protected gateway. Leave empty to deny all service-account callers."
  type        = string
  default     = ""
}

variable "factory_bucket_name" {
  description = "Override the artifact bucket name. Default is '<project_id>-ge-agent-factory'."
  type        = string
  default     = ""
}

# ── IAP load balancer (iap_lb.tf) ────────────────────────────────────────────

variable "domain" {
  description = "DNS hostname for the IAP-fronted gateway (e.g. factory.example.com). Required to build the Terraformed external HTTPS load balancer + managed SSL cert when enable_iap is true. Point an A record at the output gateway_lb_ip after apply."
  type        = string
  default     = ""
}

variable "create_oauth_client" {
  description = "Create the IAP OAuth brand + client via Terraform. NOTE: google_iap_brand only creates an Internal brand, one per project, and fails if a brand already exists. If false, supply iap_oauth_client_id/secret from a manually-created OAuth client."
  type        = bool
  default     = false
}

variable "iap_support_email" {
  description = "Support email for the IAP OAuth consent brand. Required when create_oauth_client is true."
  type        = string
  default     = ""
}

variable "iap_oauth_client_id" {
  description = "Existing IAP OAuth 2.0 client id. Used when create_oauth_client is false."
  type        = string
  default     = ""
}

variable "iap_oauth_client_secret" {
  description = "Existing IAP OAuth 2.0 client secret. Used when create_oauth_client is false."
  type        = string
  default     = ""
  sensitive   = true
}

# ── Cloud Build trigger (cloudbuild.tf) ──────────────────────────────────────

variable "create_build_trigger" {
  description = "Create a Cloud Build trigger that redeploys the gateway from the repo on push."
  type        = bool
  default     = false
}

variable "repo_name" {
  description = "Cloud Source Repository name for the gateway deploy trigger (e.g. 'ge-agent-factory-gateway'). Required when create_build_trigger is true."
  type        = string
  default     = ""
}

variable "branch_name" {
  description = "Branch the gateway deploy trigger watches."
  type        = string
  default     = "master"
}

# ── Data plane (data_plane.tf) ───────────────────────────────────────────────
# All stores are provisioned by default. enable_* exist for teardown/cost control.

variable "enable_bigquery" {
  description = "Provision BigQuery IAM (datasets are per-agent, created at load_data)."
  type        = bool
  default     = true
}

variable "enable_gcs_data" {
  description = "Provision the shared agent-data GCS bucket."
  type        = bool
  default     = true
}

variable "enable_alloydb" {
  description = "Provision a shared AlloyDB cluster + instance + DSN secret (per-agent databases at load_data). Cost driver."
  type        = bool
  default     = true
}

variable "enable_bigtable" {
  description = "Provision a shared Bigtable instance (per-agent tables at load_data). Cost driver."
  type        = bool
  default     = true
}

variable "enable_firestore" {
  description = "Grant Firestore (datastore.user) IAM; per-agent named databases are created at load_data."
  type        = bool
  default     = true
}

variable "data_bucket_name" {
  description = "Override the agent-data bucket name. Default '<project_id>-ge-agent-data'."
  type        = string
  default     = ""
}

variable "bq_data_location" {
  description = "BigQuery data location for per-agent datasets."
  type        = string
  default     = "US"
}

variable "vpc_network" {
  description = "VPC network for AlloyDB private services access."
  type        = string
  default     = "default"
}

variable "alloydb_password" {
  description = "AlloyDB postgres user password. Generated if empty."
  type        = string
  default     = ""
  sensitive   = true
}

# ── MCP tool plane (mcp.tf) ──────────────────────────────────────────────────

variable "enable_mcp" {
  description = "Grant MCP IAM (mcp.toolUser for calling 1P managed MCP servers; agentregistry.editor for registering custom MCP servers) and enable the Agent Registry API."
  type        = bool
  default     = true
}

# ── Agent identity (agent_identity.tf) — Preview ─────────────────────────────

variable "enable_agent_identity" {
  description = "Grant the runtime role set + run.invoker to the Agent Runtime agent-identity principalSet (Preview). When false, only the attached runtime SA carries these roles."
  type        = bool
  default     = true
}

variable "agent_identity_org_id" {
  description = "Organization ID for the agent-identity SPIFFE trust domain. Required for automatic Agent Identity principalSet grants; empty skips those grants."
  type        = string
  default     = ""
}

variable "worker_ingress" {
  # Hardening cutover Stage C1 (ACCEPTED POSTURE): the worker stays ingress=ALL,
  # authenticated-only. Internal ingress is intentionally NOT used because Cloud Tasks
  # delivers stage callbacks over the worker's PUBLIC run.app endpoint — internal-only
  # ingress would block task delivery and stall the pipeline. The worker has no allUsers
  # binding; every caller presents an OIDC token / roles/run.invoker, so the residual
  # risk (a valid Google identity holding the invoker role) is low and accepted.
  # Flip to INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER only if you also adopt Stage C2
  # (internal HTTP LB + Serverless NEG fronting the worker). See
  # docs/runbooks/security-hardening-cutover.md (Stage C).
  description = "Cloud Run ingress for the worker. Default ALL (authenticated-only) — the accepted Stage C1 posture; Cloud Tasks delivers over the public endpoint so internal-only would stall the pipeline. Change only with Stage C2 (internal HTTP LB)."
  type        = string
  default     = "INGRESS_TRAFFIC_ALL"
  validation {
    condition     = contains(["INGRESS_TRAFFIC_ALL", "INGRESS_TRAFFIC_INTERNAL_ONLY", "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"], var.worker_ingress)
    error_message = "worker_ingress must be a valid Cloud Run ingress value."
  }
}

# ── Managed Agent Gateway (agent_gateway.tf) ─────────────────────────────────

variable "enable_agent_gateway" {
  description = "Provision the managed Agent Gateway in front of the MCP plane."
  type        = bool
  default     = true
}

variable "agent_gateway_name" {
  description = "Name of the managed Agent Gateway resource."
  type        = string
  default     = "ge-agent-factory-agw"
}

variable "agent_gateway_location" {
  description = "Region of the Agent Gateway. Agent Gateway is REGIONAL (not global). Per the setup guide, a Gemini Enterprise 'global'/'us' app maps to gateway region us-central1; 'eu' → europe-west1."
  type        = string
  default     = "us-central1"
}

variable "agent_gateway_protocols" {
  description = "Protocols the gateway fronts. The factory exposes MCP tool servers."
  type        = list(string)
  default     = ["MCP"]
}

variable "agent_gateway_access_path" {
  description = "Google-managed operating mode. AGENT_TO_ANYWHERE (default) = govern an agent's egress to MCP servers registered in Agent Registry (our case; uses registries; works on Agent Runtime + Gemini Enterprise). CLIENT_TO_AGENT = ingress to an agent (Agent-Runtime only; omits registries)."
  type        = string
  default     = "AGENT_TO_ANYWHERE"
  validation {
    condition     = contains(["CLIENT_TO_AGENT", "AGENT_TO_ANYWHERE"], var.agent_gateway_access_path)
    error_message = "agent_gateway_access_path must be CLIENT_TO_AGENT or AGENT_TO_ANYWHERE."
  }
}

variable "agent_gateway_egress_network_attachment" {
  description = "Optional Network Attachment URI for egress (projects/{p}/regions/{r}/networkAttachments/{n}); null = managed default egress."
  type        = string
  default     = null
}

variable "agent_gateway_registries" {
  description = "Agent Registry ids the gateway fronts (the factory registers custom MCP servers in Agent Registry)."
  type        = list(string)
  default     = []
}

variable "agent_gateway_mcp_services" {
  description = "MCP Cloud Run services the gateway's Service Extensions SA is granted run.invoker on."
  type        = list(string)
  default = [
    "ge-agent-factory-mcp-finance",
    "ge-agent-factory-mcp-hr",
    "ge-agent-factory-mcp-it",
    "ge-agent-factory-mcp-marketing",
    "ge-agent-factory-mcp-procurement",
  ]
}

variable "agent_gateway_grant_mcp_invoker" {
  description = "Grant the gateway's Service Extensions SA roles/run.invoker on the MCP services."
  type        = bool
  default     = true
}

variable "agent_gateway_authz_action" {
  # Single lever for the gateway's IAP authz enforcement mode (the
  # iamEnforcementMode field on the authz extension). DRY_RUN = audit-only (logs
  # decisions, blocks nothing); ENFORCED = actually deny unauthorized calls.
  # Terraform renders installer/agent-gateway-authz/iap-request-authz-extension.yaml
  # from this var; the operator re-imports the rendered YAML via gcloud to apply.
  # Default DRY_RUN to stay safe — flip to ENFORCED only after the dry-run decision
  # logs look right (see installer/AGENT-GATEWAY.md / the hardening runbook).
  description = "Agent Gateway IAP authz enforcement mode: DRY_RUN (audit-only, default) or ENFORCED. Flipping to ENFORCED re-renders the authz-extension YAML; re-import it via gcloud to apply."
  type        = string
  default     = "DRY_RUN"
  validation {
    condition     = contains(["DRY_RUN", "ENFORCED"], var.agent_gateway_authz_action)
    error_message = "agent_gateway_authz_action must be DRY_RUN or ENFORCED."
  }
}
