resource "google_artifact_registry_repository" "containers" {
  location      = var.region
  repository_id = local.artifact_repo_id
  description   = "GE Agent Factory container images (gateway + worker)"
  format        = "DOCKER"

  depends_on = [google_project_service.enabled]
}
