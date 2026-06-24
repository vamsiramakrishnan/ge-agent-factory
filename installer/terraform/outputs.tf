output "project_id" {
  value = var.project_id
}

output "project_number" {
  value = var.project_number
}

output "region" {
  value = var.region
}

output "factory_bucket" {
  value = google_storage_bucket.factory.name
}

output "artifact_repository" {
  description = "Fully-qualified Artifact Registry URI for pushing container images."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.containers.repository_id}"
}

output "runner_service_account" {
  value = google_service_account.runner.email
}

output "gateway_service_account" {
  value = google_service_account.gateway.email
}

output "builder_service_account" {
  value = google_service_account.builder.email
}

output "tasks_queue" {
  value = google_cloud_tasks_queue.factory_stages.name
}

output "gateway_url" {
  value = google_cloud_run_v2_service.gateway.uri
}

output "worker_url" {
  value = google_cloud_run_v2_service.worker.uri
}

output "gateway_service_name" {
  value = google_cloud_run_v2_service.gateway.name
}

output "worker_service_name" {
  value = google_cloud_run_v2_service.worker.name
}

output "enable_iap" {
  value = var.enable_iap
}

output "iap_audience_hint" {
  description = "Hint for IAP_EXPECTED_AUDIENCE; replace BACKEND_SERVICE_ID with the numeric id from `gcloud compute backend-services describe`."
  value       = var.enable_iap ? "/projects/${var.project_number}/global/backendServices/BACKEND_SERVICE_ID" : ""
}

output "gemini_enterprise_app_id" {
  value = var.gemini_enterprise_app_id
}

output "gemini_enterprise_location" {
  value = var.gemini_enterprise_location
}

output "gateway_lb_ip" {
  description = "Static IP of the IAP load balancer. Point an A record for var.domain at this, then wait for the managed SSL cert to provision."
  value       = local.iap_lb_enabled ? google_compute_global_address.gateway[0].address : ""
}

output "iap_audience" {
  description = "Exact IAP_EXPECTED_AUDIENCE for the gateway. After first apply, set var.iap_backend_service_id to the numeric id embedded here and re-apply so the gateway env resolves."
  value       = local.iap_lb_enabled ? "/projects/${var.project_number}/global/backendServices/${google_compute_backend_service.gateway[0].generated_id}" : ""
}

# ── Managed Agent Gateway ──
output "agent_gateway_id" {
  description = "Full resource id of the managed Agent Gateway."
  value       = local.agent_gateway_enabled ? module.agent_gateway[0].agent_gateway_id : null
}

output "agent_gateway_mtls_endpoint" {
  description = "mTLS endpoint agents/clients connect to — the governed ingress for the MCP plane."
  value       = local.agent_gateway_enabled ? module.agent_gateway[0].mtls_endpoint : null
}

output "agent_gateway_root_certificates" {
  description = "Root certs agents use to validate the gateway (mTLS trust anchor)."
  value       = local.agent_gateway_enabled ? module.agent_gateway[0].root_certificates : null
  sensitive   = true
}

output "agent_gateway_service_extensions_account" {
  description = "SA the gateway's Service Extensions run as (granted run.invoker on the MCP services)."
  value       = local.agent_gateway_service_extensions_sa
}
