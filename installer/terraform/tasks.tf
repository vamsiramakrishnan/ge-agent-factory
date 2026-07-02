resource "google_cloud_tasks_queue" "factory_stages" {
  name     = local.tasks_queue
  location = var.region

  rate_limits {
    max_dispatches_per_second = 10
    # Mirrors the worker's real fleet-wide parallelism: cloud_run.tf caps the
    # worker at max_instance_count = 10 × max_instance_request_concurrency = 1.
    # Dispatching more than 10 concurrent tasks just piles requests onto a
    # saturated service and burns attempts against retry_config.max_attempts.
    # Scale-up path (raise BOTH together, it's a cost decision needing a live
    # env): docs/plans/taste-campaign/09-cloud-factory.md §C7.
    max_concurrent_dispatches = 10
  }

  # Retry backstop: even if the worker misclassifies a deterministic failure as
  # transient (returns 503), Cloud Tasks must NOT redeliver a poisoned stage
  # forever (see run-m9anhe-9393: load_data 500 looped every ~30s indefinitely).
  # max_attempts is the SOLE bound; the worker ACKs permanent failures with 2xx, so
  # it only applies to genuinely transient (5xx/timeout/quota) retries.
  #
  # Timeout triangle (taste-campaign 09 §C1): task creation sets
  # dispatchDeadline = 1800s (apps/factory/src/factory-worker.js
  # TASK_DISPATCH_DEADLINE) to match the worker's Cloud Run timeout
  # (cloud_run.tf: 1800s), so a long stage is never concurrently redelivered
  # mid-attempt. There is deliberately NO max_retry_duration here: with 1800s
  # attempts, a 600s wall-clock retry window expired before a single long
  # transient attempt could retry even once — the count cap is the correct bound.
  retry_config {
    max_attempts  = 5
    min_backoff   = "10s"
    max_backoff   = "300s"
    max_doublings = 3
  }

  depends_on = [google_project_service.enabled]
}
