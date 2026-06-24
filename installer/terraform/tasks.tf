resource "google_cloud_tasks_queue" "factory_stages" {
  name     = local.tasks_queue
  location = var.region

  rate_limits {
    max_dispatches_per_second = 10
    max_concurrent_dispatches = 100
  }

  # Retry backstop: even if the worker misclassifies a deterministic failure as
  # transient (returns 503), Cloud Tasks must NOT redeliver a poisoned stage
  # forever (see run-m9anhe-9393: load_data 500 looped every ~30s indefinitely).
  # max_attempts caps the count; max_retry_duration caps the wall-clock window so a
  # stage can't dead-loop. The worker ACKs permanent failures with 2xx, so these
  # bounds only apply to genuinely transient (5xx/timeout/quota) retries.
  retry_config {
    max_attempts       = 5
    max_retry_duration = "600s"
    min_backoff        = "10s"
    max_backoff        = "300s"
    max_doublings      = 3
  }

  depends_on = [google_project_service.enabled]
}
