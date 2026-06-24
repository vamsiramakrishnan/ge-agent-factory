resource "google_service_account" "runner" {
  account_id   = local.runner_sa_id
  display_name = "GE Agent Factory Runner"
  description  = "Worker Cloud Run runtime, Cloud Tasks OIDC identity, and per-stage Cloud Build executor."
  depends_on   = [google_project_service.enabled]
}

resource "google_service_account" "gateway" {
  account_id   = local.gateway_sa_id
  display_name = "GE Presentation Runtime"
  description  = "Gateway Cloud Run runtime — enqueues Cloud Tasks, mints OIDC tokens, calls Discovery Engine."
  depends_on   = [google_project_service.enabled]
}

resource "google_service_account" "builder" {
  account_id   = local.builder_sa_id
  display_name = "GE Factory Builder"
  description  = "Custom Cloud Build executor for container image builds (gateway + worker)."
  depends_on   = [google_project_service.enabled]
}
