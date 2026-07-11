locals {
  # Worker Cloud Run runtime + Cloud Tasks OIDC identity.
  #
  # Security hardening Stage B (docs/runbooks/security-hardening-cutover.md): the
  # worker now submits Cloud Builds AS the builder SA (factory-worker.js passes
  # --service-account), so the runner SA NO LONGER carries roles/cloudbuild.builds.editor.
  # The runner impersonates the builder via roles/iam.serviceAccountTokenCreator scoped
  # to the builder SA (google_service_account_iam_member.runner_can_impersonate_builder
  # below) — not project-wide build-edit rights.
  #
  # CRITICAL: roles/cloudbuild.builds.editor was the ONLY role granting the runner
  # cloudbuild.builds.create. Submitting a build (even one that RUNS as the builder SA)
  # still requires the CALLER to hold builds.create. So dropping editor alone would break
  # build submission entirely. The runner instead gets the minimal custom role
  # google_project_iam_custom_role.build_submitter (create + get + list) below. This was
  # verified live: runner with ONLY the custom role + actAs on builder submits builds OK.
  #
  # roles/iam.serviceAccountUser is KEPT here intentionally: the Cloud Run deploy
  # (ship) stage still acts as a service account through the runner. Remove it only if
  # the ship stage is likewise moved to a dedicated deploy SA (Stage B4 nuance in the
  # runbook) — verify a deploy first.
  runner_roles = [
    "roles/datastore.user",
    "roles/cloudtasks.enqueuer",
    "roles/run.invoker",
    "roles/run.developer",
    "roles/aiplatform.user",
    "roles/discoveryengine.editor",
    "roles/bigquery.dataEditor",
    "roles/bigquery.jobUser",
    "roles/artifactregistry.writer",
    "roles/secretmanager.secretAccessor",
    "roles/serviceusage.serviceUsageConsumer",
    "roles/iam.serviceAccountUser",
    "roles/iam.serviceAccountTokenCreator",
    "roles/logging.logWriter",
    "roles/logging.viewer",
    # NOTE: roles/cloudbuild.builds.editor intentionally absent — replaced by the
    # build_submitter custom role granted via google_project_iam_member.runner_build_submitter.
  ]

  # Gateway runtime — needs to enqueue Cloud Tasks, sign OIDC tokens,
  # list Discovery Engine agents, talk to Firestore.
  gateway_roles = [
    "roles/datastore.user",
    "roles/cloudtasks.enqueuer",
    "roles/cloudbuild.builds.editor",
    "roles/run.invoker",
    "roles/discoveryengine.editor",
    "roles/iam.serviceAccountTokenCreator",
    "roles/serviceusage.serviceUsageConsumer",
    "roles/logging.logWriter",
  ]

  # Cloud Build executor — runs ALL factory builds (gateway/worker container builds
  # AND, after hardening Stage B, the per-stage factory builds the worker submits
  # via --service-account). Needs: builds.builder (run builds), iam.serviceAccountUser
  # (act as itself for the build), logging.logWriter (mandatory when a user-specified
  # build SA writes logs), storage.admin (build source + the --gcs-log-dir logs
  # bucket), artifactregistry.writer (push images). Matches Stage B of the runbook.
  builder_roles = [
    "roles/cloudbuild.builds.builder",
    "roles/aiplatform.user",
    "roles/discoveryengine.editor",
    "roles/artifactregistry.writer",
    "roles/storage.admin",
    "roles/logging.logWriter",
    "roles/iam.serviceAccountUser",
    "roles/serviceusage.serviceUsageConsumer",
  ]
}

# Project-level bindings. google_project_iam_member uses read-modify-write with
# etag (correct) — google_project_iam_policy would clobber the policy, NEVER use it.
resource "google_project_iam_member" "runner" {
  for_each = toset(local.runner_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.runner.email}"
}

resource "google_project_iam_member" "gateway" {
  for_each = toset(local.gateway_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.gateway.email}"
}

resource "google_project_iam_member" "builder" {
  for_each = toset(local.builder_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.builder.email}"
}

# Minimal "submit + poll builds" role for the runner (Stage B4). Replaces the broad
# roles/cloudbuild.builds.editor: the runner only needs to CREATE a build (which runs
# as the builder SA) and GET/LIST it to poll status. See the runner_roles note above.
resource "google_project_iam_custom_role" "build_submitter" {
  role_id     = "geAgentFactoryBuildSubmitter"
  project     = var.project_id
  title       = "GE Agent Factory Build Submitter"
  description = "Submit + poll Cloud Builds; the build itself runs as the builder SA"
  permissions = [
    "cloudbuild.builds.create",
    "cloudbuild.builds.get",
    "cloudbuild.builds.list",
  ]
}

resource "google_project_iam_member" "runner_build_submitter" {
  project = var.project_id
  role    = google_project_iam_custom_role.build_submitter.id
  member  = "serviceAccount:${google_service_account.runner.email}"
}

# agents-cli --agent-identity creates the Agent Engine identity and then binds
# its runtime roles through the project IAM policy. Keep that capability on the
# dedicated build executor and limit it to the three project-policy operations
# the CLI uses instead of granting the broader Project IAM Admin role.
resource "google_project_iam_custom_role" "agent_identity_iam_binder" {
  role_id     = "geAgentFactoryIdentityIamBinder"
  project     = var.project_id
  title       = "GE Agent Factory Identity IAM Binder"
  description = "Read and update project IAM policy for agents-cli Agent Engine identity binding"
  permissions = [
    "resourcemanager.projects.get",
    "resourcemanager.projects.getIamPolicy",
    "resourcemanager.projects.setIamPolicy",
  ]
}

resource "google_project_iam_member" "builder_agent_identity_iam_binder" {
  project = var.project_id
  role    = google_project_iam_custom_role.agent_identity_iam_binder.id
  member  = "serviceAccount:${google_service_account.builder.email}"
}

# Bucket-scoped storage admin (least privilege over the factory bucket only).
resource "google_storage_bucket_iam_member" "runner_bucket_admin" {
  bucket = google_storage_bucket.factory.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.runner.email}"
}

resource "google_storage_bucket_iam_member" "gateway_bucket_admin" {
  bucket = google_storage_bucket.factory.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.gateway.email}"
}

# Gateway invokes worker (OIDC tokens minted by gateway SA, audience = worker URL).
resource "google_cloud_run_v2_service_iam_member" "gateway_invokes_worker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.worker.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.gateway.email}"
}

# Runner invokes worker (Cloud Tasks signs OIDC tokens with the runner SA).
resource "google_cloud_run_v2_service_iam_member" "runner_invokes_worker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.worker.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.runner.email}"
}

# Discovery Engine service agent invokes worker (required for A2A on Cloud Run).
resource "google_cloud_run_v2_service_iam_member" "discoveryengine_invokes_worker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.worker.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_project_service_identity.discoveryengine.email}"
}

# Aiplatform service agent: accesses Secret Manager when agents pull credentials.
resource "google_project_iam_member" "aiplatform_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_project_service_identity.aiplatform.email}"
}

# Gateway can mint OIDC tokens AS the runner SA (used when enqueueing Cloud Tasks
# whose target needs an OIDC token signed by the runner identity).
resource "google_service_account_iam_member" "gateway_can_impersonate_runner" {
  service_account_id = google_service_account.runner.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.gateway.email}"
}

# Security hardening Stage B: the runner (worker runtime) submits Cloud Builds AS the
# builder SA (factory-worker.js passes --service-account=<builder>). Submitting a build
# as another SA requires the caller to be a Token Creator ON that SA. Scoped to the
# builder SA only — this replaces the runner's project-wide cloudbuild.builds.editor.
# See docs/runbooks/security-hardening-cutover.md (Stage B1/B4).
resource "google_service_account_iam_member" "runner_can_impersonate_builder" {
  service_account_id = google_service_account.builder.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.runner.email}"
}
