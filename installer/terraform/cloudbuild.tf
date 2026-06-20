# Optional: Cloud Build trigger that builds + pushes the gateway image from the
# repo on push, using the root cloudbuild.yaml. Gated on create_build_trigger.
#
# Builds-only: the trigger does NOT deploy. Terraform owns Cloud Run config; bind a
# freshly built image with `ge infra apply --gateway-image ...:<sha>`. Cloud Run env
# vars / ingress / SA / scaling / IAM therefore stay Terraform-managed and are not
# clobbered on every push.
#
# The factory's per-stage builds are submitted directly by the worker
# (gcloud builds submit --no-source --config cloudbuild.factory-stage.yaml) and
# do NOT need a trigger.

resource "google_cloudbuild_trigger" "gateway_deploy" {
  count    = var.create_build_trigger && var.repo_name != "" ? 1 : 0
  project  = var.project_id
  name     = "${local.gateway_service}-build"
  filename = "cloudbuild.yaml"

  trigger_template {
    repo_name   = var.repo_name
    branch_name = var.branch_name
  }

  # Build/push only — image tag inputs. No env/IAP substitutions (Terraform owns
  # those on the Cloud Run service).
  substitutions = {
    _REGION       = var.region
    _SERVICE_NAME = local.gateway_service
    _AR_REPO      = google_artifact_registry_repository.containers.repository_id
  }

  depends_on = [google_project_service.enabled]
}
