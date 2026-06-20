resource "google_cloud_tasks_queue" "factory_stages" {
  name     = local.tasks_queue
  location = var.region

  rate_limits {
    max_dispatches_per_second = 10
    max_concurrent_dispatches = 100
  }

  retry_config {
    max_attempts  = 5
    min_backoff   = "10s"
    max_backoff   = "300s"
    max_doublings = 3
  }

  depends_on = [google_project_service.enabled]
}
