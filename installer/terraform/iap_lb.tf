# External HTTPS load balancer fronting the gateway with IAP, fully in
# Terraform. Gated on enable_iap AND a domain (for the managed SSL cert).
#
# Two-phase note: the gateway Cloud Run service can't reference the backend
# service's audience without a dependency cycle (the backend's NEG points at the
# gateway). So after the first apply, read the `iap_audience` output and set
# var.iap_backend_service_id to populate IAP_EXPECTED_AUDIENCE on the gateway
# (a second apply). DNS: point an A record for var.domain at output gateway_lb_ip.

locals {
  # Legacy LB+IAP path (opt-in via enable_iap_lb). Direct Cloud Run IAP
  # (var.enable_iap) is preferred for the UI services and needs no LB.
  iap_lb_enabled = var.enable_iap_lb && var.domain != ""
  oauth_client_id = var.iap_oauth_client_id != "" ? var.iap_oauth_client_id : (
    var.create_oauth_client && local.iap_lb_enabled ? google_iap_client.gateway[0].client_id : ""
  )
  oauth_client_secret = var.iap_oauth_client_secret != "" ? var.iap_oauth_client_secret : (
    var.create_oauth_client && local.iap_lb_enabled ? google_iap_client.gateway[0].secret : ""
  )
}

resource "google_iap_brand" "gateway" {
  count             = local.iap_lb_enabled && var.create_oauth_client ? 1 : 0
  project           = var.project_id
  support_email     = var.iap_support_email
  application_title = "GE Agent Factory"
  depends_on        = [google_project_service.enabled]
}

resource "google_iap_client" "gateway" {
  count        = local.iap_lb_enabled && var.create_oauth_client ? 1 : 0
  display_name = "GE Agent Factory Gateway"
  brand        = google_iap_brand.gateway[0].name
}

resource "google_compute_global_address" "gateway" {
  count   = local.iap_lb_enabled ? 1 : 0
  project = var.project_id
  name    = "${local.gateway_service}-ip"
}

resource "google_compute_region_network_endpoint_group" "gateway" {
  count                 = local.iap_lb_enabled ? 1 : 0
  project               = var.project_id
  name                  = "${local.gateway_service}-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = google_cloud_run_v2_service.gateway.name
  }
}

resource "google_compute_backend_service" "gateway" {
  count                 = local.iap_lb_enabled ? 1 : 0
  project               = var.project_id
  name                  = "${local.gateway_service}-backend"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.gateway[0].id
  }

  iap {
    enabled              = true
    oauth2_client_id     = local.oauth_client_id
    oauth2_client_secret = local.oauth_client_secret
  }
}

resource "google_compute_url_map" "gateway" {
  count           = local.iap_lb_enabled ? 1 : 0
  project         = var.project_id
  name            = "${local.gateway_service}-urlmap"
  default_service = google_compute_backend_service.gateway[0].id
}

resource "google_compute_managed_ssl_certificate" "gateway" {
  count   = local.iap_lb_enabled ? 1 : 0
  project = var.project_id
  name    = "${local.gateway_service}-cert"
  managed {
    domains = [var.domain]
  }
}

resource "google_compute_target_https_proxy" "gateway" {
  count            = local.iap_lb_enabled ? 1 : 0
  project          = var.project_id
  name             = "${local.gateway_service}-https-proxy"
  url_map          = google_compute_url_map.gateway[0].id
  ssl_certificates = [google_compute_managed_ssl_certificate.gateway[0].id]
}

resource "google_compute_global_forwarding_rule" "gateway" {
  count                 = local.iap_lb_enabled ? 1 : 0
  project               = var.project_id
  name                  = "${local.gateway_service}-fr"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_https_proxy.gateway[0].id
  ip_address            = google_compute_global_address.gateway[0].id
  port_range            = "443"
}

# Grant the principal IAP access to the backend (tighter than project-level).
resource "google_iap_web_backend_service_iam_member" "accessor" {
  count               = local.iap_lb_enabled && var.iap_member != "" ? 1 : 0
  project             = var.project_id
  web_backend_service = google_compute_backend_service.gateway[0].name
  role                = "roles/iap.httpsResourceAccessor"
  member              = var.iap_member
}
