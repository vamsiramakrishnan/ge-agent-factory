resource "google_storage_bucket" "factory" {
  name                        = local.factory_bucket
  location                    = var.region
  force_destroy               = false
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  # Run artifacts age out after 30 days; permanent runs are kept under a
  # different prefix (e.g. 'releases/') and are exempt.
  lifecycle_rule {
    condition {
      age            = 30
      matches_prefix = ["runs/"]
    }
    action {
      type = "Delete"
    }
  }

  depends_on = [google_project_service.enabled]
}
