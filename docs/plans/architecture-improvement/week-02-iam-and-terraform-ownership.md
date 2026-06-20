# Week 2: IAM And Terraform Ownership

## Goal

Make infrastructure ownership clear and reduce privilege. Terraform should own long-lived Cloud Run configuration, IAM, ingress, IAP, and data stores. Cloud Build should build images, not silently overwrite service configuration.

## Primary Risks Addressed

- Public-by-default gateway paired with high-privilege runtime service accounts.
- Project-wide IAM grants composing into escalation paths.
- Terraform state containing secrets without an explicit secured backend.
- Cloud Build or scripts clobbering Terraform-managed Cloud Run env vars.
- IAP split between Terraform and imperative scripts.

## Scope

### 1. Make Private Access The Default

Target areas:

- `installer/terraform/variables.tf`
- `installer/terraform/cloud_run.tf`
- `installer/terraform/iap_lb.tf`
- `installer/terraform/README.md`

Implementation tasks:

- Change the default production posture to private/IAP-oriented access.
- Replace implicit public gateway behavior with explicit `allow_public_gateway`.
- Add Terraform validation that prevents accidental public exposure when IAP variables are incomplete.
- Document the local development path separately from production access.

Acceptance criteria:

- A default Terraform apply does not create an unauthenticated public gateway unless explicitly requested.
- Terraform plan clearly shows public exposure only when `allow_public_gateway=true`.

### 2. Split Service Account Privileges

Target areas:

- `installer/terraform/iam.tf`
- `installer/terraform/service_accounts.tf`
- `installer/terraform/tasks.tf`
- `installer/terraform/data_plane.tf`
- `installer/terraform/agent_identity.tf`

Implementation tasks:

- Define identities by job:
  - gateway service account: enqueue and invoke only.
  - runner service account: stage execution only.
  - builder service account: build and push only.
  - agent runtime identity: data/tool access only, scoped by environment or agent group.
- Remove project-level `roles/iam.serviceAccountTokenCreator` where a service-account-level binding is enough.
- Scope `roles/iam.serviceAccountUser` to the exact service accounts that need impersonation.
- Replace broad secret access with per-secret IAM where possible.
- Replace broad storage admin with bucket-level object roles.
- Review whether gateway truly needs Cloud Build permissions.

Acceptance criteria:

- No service account has `TokenCreator` at project scope unless there is a documented exception.
- Gateway cannot deploy Cloud Run services.
- Builder cannot read all secrets.
- Runner has only the permissions needed for stage execution.

### 3. Consolidate Cloud Run Deployment Ownership

Target areas:

- `cloudbuild.yaml`
- `installer/build-and-deploy.sh`
- `tools/lib/factory-core.mjs`
- `installer/terraform/cloud_run.tf`

Implementation tasks:

- Make Cloud Build build and push images only.
- Make Terraform update Cloud Run image references.
- Remove `gcloud run deploy --set-env-vars` paths or replace with wrappers that call Terraform.
- Remove hardcoded worker URLs from Cloud Build config.
- Add a deploy contract document:
  - which tool builds images
  - which tool applies services
  - where env vars live
  - how emergency deploys are handled.

Acceptance criteria:

- No normal deploy path overwrites Terraform-managed Cloud Run env vars.
- Build output returns image tags.
- Terraform apply binds those image tags to services.

### 4. Terraform State And Secret Handling

Target areas:

- `installer/terraform/main.tf`
- `installer/terraform/README.md`
- `installer/values.example.tfvars`
- `docs/OPERATIONS.md`

Implementation tasks:

- Add documented GCS backend setup with:
  - uniform bucket-level access
  - versioning
  - restricted IAM
  - optional retention policy.
- Document that Terraform state contains sensitive material.
- Prefer externally-created Secret Manager versions for OAuth and DSN secrets where feasible.
- Mark sensitive outputs and variables consistently.

Acceptance criteria:

- New operators have a clear remote backend setup path.
- Sensitive variables are not printed by outputs.
- State sensitivity is documented before `terraform apply`.

### 5. Resolve IAP Ownership

Target areas:

- `installer/terraform/iap_lb.tf`
- `installer/scripts/enable-iap.sh`
- `installer/terraform/README.md`

Implementation tasks:

- Choose Terraform as the owner for IAP/LB resources.
- Convert `enable-iap.sh` into a read-only diagnostic helper or remove it.
- Add preconditions for:
  - domain
  - OAuth client ID/secret
  - support email when needed
  - IAP member.
- Avoid Terraform creation of deprecated IAP OAuth brand/client paths unless explicitly supported.

Acceptance criteria:

- There is one documented IAP implementation path.
- The script no longer creates duplicate LB/IAP resources.

## Suggested PR Breakdown

1. Public gateway escape hatch and docs.
2. IAM split and scoped bindings.
3. Cloud Build builds-only flow.
4. Remote backend documentation and sensitive-state handling.
5. IAP ownership cleanup.

## Validation

- Run `terraform fmt`.
- Run `terraform validate`.
- Capture `terraform plan` for default private mode.
- Capture `terraform plan` for explicit public gateway mode.
- Verify Cloud Run env vars remain stable after image update.

## Implementation Details

### Terraform Variable Changes

Add or adjust variables in `installer/terraform/variables.tf`:

```hcl
variable "allow_public_gateway" {
  description = "Explicitly allow unauthenticated public gateway access. Intended only for demos/local throwaway projects."
  type        = bool
  default     = false
}

variable "require_iap" {
  description = "Require IAP/LB-fronted access for the gateway."
  type        = bool
  default     = true
}
```

Then replace public IAM logic with:

```hcl
resource "google_cloud_run_v2_service_iam_member" "gateway_public" {
  count    = var.allow_public_gateway ? 1 : 0
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.gateway.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

Add validation:

```hcl
validation {
  condition     = !(var.allow_public_gateway && var.require_iap)
  error_message = "allow_public_gateway and require_iap cannot both be true."
}
```

If Terraform validation cannot reference both variables directly in the current structure, use a `terraform_data` precondition or resource-level lifecycle precondition.

### IAM Target State

Refactor `installer/terraform/iam.tf` into explicit role groups:

- `gateway_project_roles`
  - `roles/datastore.user` only if gateway writes Firestore.
  - `roles/cloudtasks.enqueuer`.
  - `roles/run.invoker` only on the worker service, not project-wide.
  - `roles/logging.logWriter`.
- `runner_project_roles`
  - `roles/cloudbuild.builds.editor` only if runner starts Cloud Build.
  - `roles/run.developer` only if runner deploys runtimes.
  - `roles/aiplatform.user`.
  - `roles/discoveryengine.editor`.
  - `roles/serviceusage.serviceUsageConsumer`.
  - `roles/logging.logWriter`.
- `builder_project_roles`
  - `roles/cloudbuild.builds.builder`.
  - `roles/artifactregistry.writer`.
  - `roles/logging.logWriter`.

Move these from project scope to resource scope:

- `roles/run.invoker` -> `google_cloud_run_v2_service_iam_member`.
- `roles/storage.objectAdmin` -> bucket IAM only.
- `roles/secretmanager.secretAccessor` -> secret IAM for `alloydb_dsn` and named runtime secrets.
- `roles/iam.serviceAccountTokenCreator` -> service-account-level binding only where a caller mints a token as that specific service account.
- `roles/iam.serviceAccountUser` -> service-account-level binding on deploy target service accounts.

### Concrete IAM Refactor Steps

1. Add new resource-scoped bindings alongside existing project bindings.
2. Run `terraform plan` and confirm additive behavior.
3. Remove one broad role group at a time.
4. After each removal, run:
   - gateway preflight
   - factory canary
   - worker stage invocation
   - MCP doctor.

Do not remove all broad roles in one PR; it will be difficult to isolate the first missing permission.

### Cloud Build Ownership Change

Target deployment model:

1. `gcloud builds submit` builds:
   - gateway image
   - worker image
   - builder image.
2. Build command returns immutable image tags.
3. `ge infra apply --gateway-image <tag> --worker-image <tag>` applies them.
4. Terraform remains the only owner of:
   - env vars
   - ingress
   - service account
   - scaling
   - CPU/memory
   - IAM.

In `cloudbuild.yaml`, replace `gcloud run deploy` steps with image build/push steps. If Cloud Build must deploy temporarily, use `--update-env-vars`, not `--set-env-vars`, and include a comment that the path is deprecated.

### Terraform Backend Setup

Add documentation and optionally a helper target:

```bash
gcloud storage buckets create gs://${PROJECT_ID}-tfstate \
  --project "${PROJECT_ID}" \
  --location us-central1 \
  --uniform-bucket-level-access

gcloud storage buckets update gs://${PROJECT_ID}-tfstate \
  --versioning
```

Backend block option:

```hcl
terraform {
  backend "gcs" {
    bucket = "REPLACE_WITH_PROJECT_TFSTATE_BUCKET"
    prefix = "ge-agent-factory"
  }
}
```

Because backend config cannot use variables, document use of:

```bash
terraform -chdir=installer/terraform init \
  -backend-config="bucket=${PROJECT_ID}-tfstate" \
  -backend-config="prefix=ge-agent-factory"
```

### IAP Consolidation Details

Keep these Terraform-owned resources:

- global address
- serverless NEG
- backend service
- URL map
- target HTTPS proxy
- forwarding rule
- managed certificate
- IAP IAM binding.

Convert `installer/scripts/enable-iap.sh` to:

- check DNS target
- print existing LB/IAP resource status
- print required tfvars
- never create or mutate resources.

Rename it to `check-iap.sh` if practical.

### Tests And Checks

Add a static guard test or script:

- fail if `allUsers` appears in Terraform except in the explicit `allow_public_gateway` resource.
- fail if `roles/iam.serviceAccountTokenCreator` appears in `google_project_iam_member`.
- fail if `gcloud run deploy` appears in Cloud Build production deploy steps.

Candidate script:

- `installer/scripts/lint-terraform-security.sh`

### Migration Notes For Existing Projects

Document this rollout:

1. Apply additive scoped IAM.
2. Confirm canary works.
3. Remove broad project-level IAM.
4. Switch gateway to IAP/private mode.
5. Remove public invoker binding.
6. Re-run doctor.

## Out Of Scope

- Runtime service decomposition.
- Frontend bug fixes.
- Generated-data migration.
