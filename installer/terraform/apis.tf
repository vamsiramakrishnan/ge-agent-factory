locals {
  required_apis = [
    "aiplatform.googleapis.com",
    "artifactregistry.googleapis.com",
    "bigquery.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudtasks.googleapis.com",
    "discoveryengine.googleapis.com",
    "firestore.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "serviceusage.googleapis.com",
    "storage.googleapis.com",
  ]
  # Direct Cloud Run IAP needs the IAP API only; the legacy LB path also needs compute.
  iap_apis = concat(
    var.enable_iap ? ["iap.googleapis.com"] : [],
    var.enable_iap_lb ? ["iap.googleapis.com", "compute.googleapis.com"] : [],
  )
  data_apis = concat(
    var.enable_alloydb ? ["alloydb.googleapis.com", "servicenetworking.googleapis.com", "compute.googleapis.com"] : [],
    var.enable_bigtable ? ["bigtable.googleapis.com", "bigtableadmin.googleapis.com"] : [],
  )
  mcp_apis = var.enable_mcp ? ["agentregistry.googleapis.com"] : []
  # Managed Agent Gateway — the setup guide requires this full set (networking +
  # security + Model Armor + registry). NOTE: the gateway is REGIONAL — use a region
  # (us-central1), not 'global', or creation returns 501 unimplemented.
  agent_gateway_apis = var.enable_agent_gateway ? [
    "networkservices.googleapis.com",
    "networksecurity.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",
    "modelarmor.googleapis.com",
    "agentregistry.googleapis.com",
    "aiplatform.googleapis.com",
  ] : []
  all_apis           = distinct(concat(local.required_apis, local.iap_apis, local.data_apis, local.mcp_apis, local.agent_gateway_apis))
}

resource "google_project_service" "enabled" {
  for_each                   = toset(local.all_apis)
  project                    = var.project_id
  service                    = each.value
  disable_dependent_services = false
  disable_on_destroy         = false
}

# Service-agent identities — explicit creation, not relying on first-API-use
# auto-creation (which is unreliable for downstream IAM bindings).
resource "google_project_service_identity" "discoveryengine" {
  provider   = google-beta
  project    = var.project_id
  service    = "discoveryengine.googleapis.com"
  depends_on = [google_project_service.enabled]
}

resource "google_project_service_identity" "aiplatform" {
  provider   = google-beta
  project    = var.project_id
  service    = "aiplatform.googleapis.com"
  depends_on = [google_project_service.enabled]
}
