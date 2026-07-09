# Human-facing UI services (console + presentation/deck). External ingress,
# AUTHENTICATED-ONLY: by DEFAULT (enable_iap = false) access is governed by IAM
# run.invoker — no allUsers binding, so callers need a Google identity token; the
# service fails closed. Set enable_iap = true to add DIRECT Cloud Run IAP, which
# additionally restricts access to the principals in var.iap_members (e.g. all
# Googlers). IAP is therefore OPT-IN, not the default. No load balancer.
#
# Each service is image-gated: it's created only when its image var is set, so the
# resources + IAP wiring live in Terraform and activate once you supply an image.
# Presentation is UI-only; real factory work goes through the console/API gateway.

resource "google_cloud_run_v2_service" "console" {
  count    = var.console_image != "" ? 1 : 0
  provider = google-beta # iap_enabled on Cloud Run v2 is a beta-provider field
  name     = "ge-agent-factory-console"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  # Direct Cloud Run IAP — access is governed by the iap.httpsResourceAccessor
  # bindings below (var.iap_members), not by allUsers.
  iap_enabled = var.enable_iap

  template {
    service_account = google_service_account.gateway.email
    timeout         = "300s"
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }
    containers {
      image = var.console_image
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        startup_cpu_boost = true
      }
      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "API_GATEWAY_URL"
        value = google_cloud_run_v2_service.gateway.uri
      }
      # Deployed console delegates mutating work through the gateway/CLI runtime
      # instead of executing UI-only code paths.
      env {
        name  = "GE_GATEWAY_TRANSPORT"
        value = "direct"
      }
      env {
        name  = "GE_LEDGER_BACKEND"
        value = "firestore"
      }
      env {
        name  = "GE_FIRESTORE_DATABASE"
        value = "(default)"
      }
      env {
        name  = "GE_FIRESTORE_COLLECTION"
        value = "factoryRuns"
      }
    }
  }

  lifecycle {
    ignore_changes = [client, client_version]
  }
  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_v2_service" "presentation" {
  count    = var.presentation_image != "" ? 1 : 0
  provider = google-beta # iap_enabled on Cloud Run v2 is a beta-provider field
  name     = "ge-agent-factory-presentation"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  iap_enabled = var.enable_iap

  template {
    service_account = google_service_account.gateway.email
    timeout         = "300s"
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }
    containers {
      image = var.presentation_image
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        startup_cpu_boost = true
      }
      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "API_GATEWAY_URL"
        value = google_cloud_run_v2_service.gateway.uri
      }
    }
  }

  lifecycle {
    ignore_changes = [client, client_version]
  }
  depends_on = [google_project_service.enabled]
}

# ── Direct Cloud Run IAP access: grant each member IAP-secured Web App User on each
#    UI service that exists. Reusable across both services × all configured members. ──
locals {
  ui_services = merge(
    var.console_image != "" ? { console = google_cloud_run_v2_service.console[0].name } : {},
    var.presentation_image != "" ? { presentation = google_cloud_run_v2_service.presentation[0].name } : {},
  )
  iap_accessor_bindings = var.enable_iap ? flatten([
    for svc_key, svc_name in local.ui_services : [
      for m in var.iap_members : {
        key     = "${svc_key}::${m}"
        service = svc_name
        member  = m
      }
    ]
  ]) : []
}

resource "google_iap_web_cloud_run_service_iam_member" "ui_accessor" {
  for_each               = { for b in local.iap_accessor_bindings : b.key => b }
  project                = var.project_id
  location               = var.region
  cloud_run_service_name = each.value.service
  role                   = "roles/iap.httpsResourceAccessor"
  member                 = each.value.member
  depends_on             = [google_project_service.enabled]
}

# Native Cloud Run IAP forwards requests to the service as the IAP service agent,
# which must hold run.invoker on each IAP'd service.
resource "google_project_service_identity" "iap" {
  count      = var.enable_iap && length(local.ui_services) > 0 ? 1 : 0
  provider   = google-beta
  project    = var.project_id
  service    = "iap.googleapis.com"
  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_v2_service_iam_member" "ui_iap_invoker" {
  for_each = var.enable_iap ? local.ui_services : {}
  project  = var.project_id
  location = var.region
  name     = each.value
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_project_service_identity.iap[0].email}"
}

output "console_url" {
  description = "Console UI URL (empty unless console_image is set)."
  value       = var.console_image != "" ? google_cloud_run_v2_service.console[0].uri : ""
}

output "presentation_url" {
  description = "Standalone presentation UI URL (empty unless presentation_image is set)."
  value       = var.presentation_image != "" ? google_cloud_run_v2_service.presentation[0].uri : ""
}
