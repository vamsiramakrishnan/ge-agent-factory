# Installer Terraform module

Provisions everything the GE Agent Factory needs in a single GCP project:

| Layer | Resources |
|------|-----------|
| APIs | 14 required services enabled, plus 2 explicit service-agent identities (Discovery Engine, Vertex AI) |
| Identity | `ge-agent-factory-runner`, `ge-agent-factory-runtime`, `ge-agent-factory-builder` service accounts |
| IAM | Project-level role bindings (least-privilege per SA), bucket-scoped `storage.objectAdmin`, Cloud Run invoker for gateway + Discovery Engine service agent |
| Storage | `<project>-ge-agent-factory` bucket, 30-day lifecycle on `runs/` |
| Firestore | Native-mode database (`(default)`) |
| Cloud Tasks | `ge-agent-factory-stages` queue |
| Artifact Registry | `ge-agent-factory` Docker repository |
| Cloud Run | `ge-agent-factory-gateway` (gateway, 8 vCPU / 32Gi) and `ge-agent-factory-worker` services |
| IAP LB (optional) | Full external HTTPS LB: global IP, serverless NEG, backend service with IAP, URL map, managed SSL cert, forwarding rule, OAuth brand/client (`iap_lb.tf`, gated on `enable_iap` + `domain`) |
| Cloud Build (optional) | `google_cloudbuild_trigger` to redeploy the gateway from the repo (`cloudbuild.tf`, gated on `create_build_trigger`) |

## Driving it with `ge`

The `ge` CLI is the front door — it wraps this module:

```
ge up        # terraform apply → build+push images → re-apply with images → ge init → ge doctor
ge infra <init|plan|apply|output|destroy>   # vars auto-derived from .ge.json; writes installer/values.tfvars
ge build     # build + push gateway/worker images into the Artifact Registry this module creates
```

`ge init` reads this module's outputs as its config source of truth.

> **The hosted demo (`vital-octagon-19612`) is hand-managed, NOT Terraform-managed.**
> Do not run `terraform apply` against it — this module is for end users standing
> up their own copy. The demo's resources were created by hand and reconciling
> them into state is out of scope.

## IAP load balancer

With `enable_iap = true` and a `domain`, `iap_lb.tf` provisions the whole LB
declaratively. Provide an OAuth client via `iap_oauth_client_id/secret`, or set
`create_oauth_client = true` (Internal brand only, one per project). After the
first apply: point an A record for `domain` at the `gateway_lb_ip` output, then
set `iap_backend_service_id` to the numeric id in the `iap_audience` output and
re-apply so the gateway's `IAP_EXPECTED_AUDIENCE` resolves (see two-phase note).

## Two-phase apply

Cloud Run services need container images, but `terraform apply` runs before
`build-and-deploy.sh` has built them. The module handles this by defaulting
both image inputs to a public placeholder (`us-docker.pkg.dev/cloudrun/container/hello`):

1. **First apply** — `terraform apply -var-file=../values.tfvars`
   Provisions APIs, SAs, bindings, storage, queue, registry, and Cloud Run
   services running the hello image.
2. **Build** — `installer/build-and-deploy.sh` builds the gateway + worker
   containers, pushes them to the Artifact Registry repo this module created,
   then re-applies Terraform with `-var gateway_image=...` and `-var worker_image=...`.
3. **Verify** — `installer/verify.sh` calls `POST /api/factory/preflight`
   against the deployed gateway and prints structured check results.

## Safety notes

- Uses `google_project_iam_member` (read-modify-write with etag), **not**
  `google_project_iam_policy` (which would overwrite the entire policy).
- `google_firestore_database` has `lifecycle.prevent_destroy = true` — once
  created, Firestore cannot be deleted without project deletion.
- Service-agent identities are created via `google_project_service_identity`
  rather than relying on first-API-use auto-creation (which is unreliable for
  downstream IAM bindings).
- IAP setup is partial — the LB, NEG, backend service, and OAuth consent
  screen are not Terraformed. See `scripts/enable-iap.sh`.

## State

Local `terraform.tfstate` by default. **State contains sensitive material**
(generated secrets, DSNs, IAM bindings) — for any shared/non-throwaway project use a
remote GCS backend with versioning + restricted IAM.

Create the state bucket once (uniform access + versioning):

```bash
gcloud storage buckets create gs://${PROJECT_ID}-tfstate \
  --project "${PROJECT_ID}" \
  --location us-central1 \
  --uniform-bucket-level-access
gcloud storage buckets update gs://${PROJECT_ID}-tfstate --versioning
```

Add the backend block to `main.tf` (backend config can't use variables, so leave the
bucket out of the block and pass it at `init`):

```hcl
terraform {
  backend "gcs" {
    prefix = "ge-agent-factory"
  }
}
```

```bash
terraform -chdir=installer/terraform init \
  -backend-config="bucket=${PROJECT_ID}-tfstate" \
  -backend-config="prefix=ge-agent-factory"
```

Restrict the bucket to the operators/CI identities that run `terraform`. Sensitive
outputs/variables are marked `sensitive` so they aren't printed by `terraform output`.

## Variables

See `variables.tf` for the full list. Minimum required (in `values.tfvars`):

- `project_id`
- `project_number`
- `gemini_enterprise_app_id`

`enable_iap = true` also requires `iap_member` and a follow-up run of
`scripts/enable-iap.sh`.
