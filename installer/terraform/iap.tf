# Full IAP setup for a Cloud Run service requires:
#   1. A global external HTTPS load balancer with a serverless NEG → gateway
#   2. A backend service on the LB with iap { enabled = true, oauth2_client_id, oauth2_client_secret }
#   3. An OAuth 2.0 client (which requires a configured OAuth consent screen — manual)
#
# Terraform can't fully automate (3); the consent screen is a one-time manual
# step in the Cloud Console. scripts/enable-iap.sh walks an operator through
# the rest after the initial `terraform apply` succeeds with enable_iap=true.
#
# Once the backend service exists and you know its numeric id, set
# var.iap_backend_service_id to populate IAP_EXPECTED_AUDIENCE on the gateway.

resource "google_project_iam_member" "iap_user_access" {
  count   = var.enable_iap && var.iap_member != "" ? 1 : 0
  project = var.project_id
  role    = "roles/iap.httpsResourceAccessor"
  member  = var.iap_member
}
