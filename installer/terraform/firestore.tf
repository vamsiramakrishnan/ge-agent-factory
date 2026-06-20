# Firestore is per-project and once created cannot be deleted without project
# deletion. If a database already exists, `terraform import` it before applying.
resource "google_firestore_database" "default" {
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = var.firestore_location
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"
  delete_protection_state     = "DELETE_PROTECTION_ENABLED"

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [google_project_service.enabled]
}
