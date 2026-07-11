resource "google_cloud_run_v2_service" "worker" {
  name     = local.worker_service
  location = var.region
  # Authenticated-only (no allUsers binding); Cloud Tasks invokes via OIDC as the
  # runner SA. Default ingress is ALL; set var.worker_ingress to
  # INGRESS_TRAFFIC_INTERNAL_ONLY as part of the hardening cutover — but only once
  # the callers (Cloud Tasks queue + gateway) route through VPC egress, otherwise
  # internal ingress breaks task delivery. See the security rollout notes.
  ingress = var.worker_ingress

  template {
    service_account                  = google_service_account.runner.email
    timeout                          = "1800s"
    max_instance_request_concurrency = 1

    scaling {
      min_instance_count = var.factory_worker_min_instances
      max_instance_count = var.factory_worker_max_instances
    }

    containers {
      image = var.worker_image

      resources {
        limits = {
          cpu    = "8"
          memory = "32Gi"
        }
        startup_cpu_boost = true
      }

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "GOOGLE_CLOUD_PROJECT_NUMBER"
        value = var.project_number
      }
      env {
        name  = "GE_AGENT_FACTORY_BUCKET"
        value = google_storage_bucket.factory.name
      }
      env {
        name  = "GE_AGENT_FACTORY_QUEUE"
        value = google_cloud_tasks_queue.factory_stages.name
      }
      env {
        name  = "GE_AGENT_FACTORY_REGION"
        value = var.region
      }
      env {
        name  = "GE_AGENT_FACTORY_SERVICE_ACCOUNT"
        value = google_service_account.runner.email
      }
      env {
        name  = "GEMINI_ENTERPRISE_APP_ID"
        value = var.gemini_enterprise_app_id
      }
      env {
        name  = "GEMINI_ENTERPRISE_LOCATION"
        value = var.gemini_enterprise_location
      }
      env {
        name  = "GOOGLE_GENAI_LOCATION"
        value = var.gemini_enterprise_location
      }
      env {
        name  = "GE_AGENT_FACTORY_BUILDER_IMAGE"
        value = local.builder_image
      }
    }
  }

  # Image is rewritten by build-and-deploy.sh; don't fight Terraform on it.
  lifecycle {
    ignore_changes = [client, client_version]
  }

  depends_on = [
    google_project_service.enabled,
    google_project_iam_member.runner,
    google_storage_bucket_iam_member.runner_bucket_admin,
  ]
}

resource "google_cloud_run_v2_service" "gateway" {
  name     = local.gateway_service
  location = var.region
  # External ingress allowed, authenticated-only (no IAP). Only the legacy LB path
  # (enable_iap_lb) restricts ingress to the load balancer.
  ingress = var.enable_iap_lb ? "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER" : "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.gateway.email
    timeout         = "300s"

    scaling {
      min_instance_count = var.factory_gateway_min_instances
      max_instance_count = var.factory_gateway_max_instances
    }

    containers {
      image = var.gateway_image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "8"
          memory = "32Gi"
        }
        startup_cpu_boost = true
      }

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "GEMINI_ENTERPRISE_APP_ID"
        value = var.gemini_enterprise_app_id
      }
      env {
        name  = "GEMINI_ENTERPRISE_LOCATION"
        value = var.gemini_enterprise_location
      }
      env {
        name  = "GOOGLE_CLOUD_LOCATION"
        value = var.gemini_enterprise_location
      }
      env {
        name  = "GOOGLE_GENAI_USE_VERTEXAI"
        value = "TRUE"
      }
      env {
        name  = "GOOGLE_GENAI_LOCATION"
        value = var.gemini_enterprise_location
      }
      env {
        name  = "GE_AGENT_FACTORY_WORKER_URL"
        value = google_cloud_run_v2_service.worker.uri
      }
      env {
        name  = "GE_AGENT_FACTORY_BUCKET"
        value = google_storage_bucket.factory.name
      }
      env {
        name  = "GE_AGENT_FACTORY_QUEUE"
        value = google_cloud_tasks_queue.factory_stages.name
      }
      env {
        name  = "GE_AGENT_FACTORY_REGION"
        value = var.region
      }
      env {
        name  = "GE_AGENT_FACTORY_SERVICE_ACCOUNT"
        value = google_service_account.runner.email
      }
      env {
        name  = "GE_ENABLE_AGENT_PROVISION"
        value = "true"
      }
      # The gateway is authenticated via IAM/OIDC, not IAP. REQUIRE_IAP/audience only
      # apply on the legacy LB+IAP path (enable_iap_lb).
      env {
        name  = "REQUIRE_IAP"
        value = var.enable_iap_lb ? "true" : "false"
      }
      env {
        name  = "IAP_EXPECTED_AUDIENCE"
        value = var.enable_iap_lb && var.iap_backend_service_id != "" ? "/projects/${var.project_number}/global/backendServices/${var.iap_backend_service_id}" : ""
      }
      # OIDC fallback for service-account callers.
      # Comma-separated audiences they may mint tokens for. Leave empty to deny.
      env {
        name  = "OIDC_ALLOWED_AUDIENCES"
        value = var.oidc_allowed_audiences
      }
    }
  }

  lifecycle {
    ignore_changes = [client, client_version]
  }

  depends_on = [
    google_project_service.enabled,
    google_project_iam_member.gateway,
    google_storage_bucket_iam_member.gateway_bucket_admin,
  ]
}

# Gateway is external but AUTHENTICATED-ONLY by default: no allUsers binding, so
# callers must present a Google identity token (IAM run.invoker / the `ge` auto-proxy).
# allUsers is granted only behind the explicit allow_public_gateway escape hatch.
resource "google_cloud_run_v2_service_iam_member" "gateway_public" {
  count    = var.allow_public_gateway ? 1 : 0
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.gateway.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
