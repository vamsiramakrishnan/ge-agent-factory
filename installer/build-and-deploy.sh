#!/usr/bin/env bash
# Two-phase finisher for the installer:
#   1. Read Terraform outputs (project, region, artifact repo, SAs).
#   2. Build + push the gateway and worker images via Cloud Build into the
#      Terraform-created Artifact Registry repo.
#   3. Re-apply Terraform with gateway_image / worker_image pinned to the
#      freshly-built SHAs so Cloud Run replaces the placeholder hello images.
#   4. Generate apps/presentation/.env.local for local development.
#
# Prereqs: terraform apply has already succeeded once with placeholder images.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TF_DIR="${SCRIPT_DIR}/terraform"
VARS_FILE="${SCRIPT_DIR}/values.tfvars"

if [[ ! -f "${VARS_FILE}" ]]; then
  echo "Missing ${VARS_FILE} — copy values.example.tfvars first and fill it in." >&2
  exit 1
fi

for bin in terraform gcloud jq git; do
  if ! command -v "${bin}" >/dev/null 2>&1; then
    echo "${bin} not found on PATH" >&2
    exit 1
  fi
done

cd "${TF_DIR}"

OUTPUTS_JSON="$(terraform output -json 2>/dev/null || true)"
if [[ -z "${OUTPUTS_JSON}" || "${OUTPUTS_JSON}" == "{}" ]]; then
  echo "No Terraform outputs found. Run 'terraform init && terraform apply -var-file=${VARS_FILE}' first." >&2
  exit 1
fi

get() {
  printf '%s' "${OUTPUTS_JSON}" | jq -r ".${1}.value // empty"
}

PROJECT_ID="$(get project_id)"
REGION="$(get region)"
ARTIFACT_REPO="$(get artifact_repository)"
GATEWAY_SERVICE="$(get gateway_service_name)"
WORKER_SERVICE="$(get worker_service_name)"

if [[ -z "${PROJECT_ID}" || -z "${REGION}" || -z "${ARTIFACT_REPO}" ]]; then
  echo "Terraform outputs missing required values (project_id/region/artifact_repository)." >&2
  exit 1
fi

# Tag every build with the short SHA so subsequent applies show a real diff.
TAG="$(cd "${REPO_ROOT}" && git rev-parse --short HEAD 2>/dev/null || date -u +%Y%m%d-%H%M%S)"
GATEWAY_IMAGE="${ARTIFACT_REPO}/${GATEWAY_SERVICE}:${TAG}"
WORKER_IMAGE="${ARTIFACT_REPO}/${WORKER_SERVICE}:${TAG}"
# Console UI image (the canonical operator UI). Built + deployed by default; set
# DEPLOY_CONSOLE=false to skip. The console Cloud Run service activates only once
# console_image is passed to Terraform (installer/terraform/ui_services.tf).
DEPLOY_CONSOLE="${DEPLOY_CONSOLE:-true}"
CONSOLE_SERVICE="ge-agent-factory-console"
CONSOLE_IMAGE="${ARTIFACT_REPO}/${CONSOLE_SERVICE}:${TAG}"
AR_REPO_ID="$(basename "${ARTIFACT_REPO}")"

echo "Project:        ${PROJECT_ID}"
echo "Region:         ${REGION}"
echo "Gateway image:  ${GATEWAY_IMAGE}"
echo "Worker image:   ${WORKER_IMAGE}"
[[ "${DEPLOY_CONSOLE}" == "true" ]] && echo "Console image:  ${CONSOLE_IMAGE}"
echo

gcloud config set project "${PROJECT_ID}" >/dev/null

echo "==> Building gateway image (Cloud Build)..."
# Gateway owns the runtime /api/factory surface and builds from apps/factory,
# with the repo-root context for packages/ and tools/lib/*.
gcloud builds submit "${REPO_ROOT}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --config="${REPO_ROOT}/apps/factory/cloudbuild.gateway.yaml" \
  --substitutions="_IMAGE=${GATEWAY_IMAGE}" \
  --gcs-source-staging-dir="gs://${PROJECT_ID}-ge-agent-factory/cloudbuild/source"

echo "==> Building worker image (Cloud Build)..."
# The worker imports @ge/run-ledger + @ge/okf (packages/) and tools/lib/*, all OUTSIDE
# apps/factory, so build from the repo-root context via its cloudbuild config
# (--tag only sees the app dir) — symmetric with the gateway/console builds above.
gcloud builds submit "${REPO_ROOT}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --config="${REPO_ROOT}/apps/factory/cloudbuild.worker.yaml" \
  --substitutions="_IMAGE=${WORKER_IMAGE}" \
  --gcs-source-staging-dir="gs://${PROJECT_ID}-ge-agent-factory/cloudbuild/source"

if [[ "${DEPLOY_CONSOLE}" == "true" ]]; then
  echo "==> Building console image (Cloud Build)..."
  # The console image needs a custom Dockerfile (tools/ + generator), so build via
  # its cloudbuild config rather than --tag (which only uses ./Dockerfile).
  gcloud builds submit "${REPO_ROOT}" \
    --project="${PROJECT_ID}" \
    --region="${REGION}" \
    --config="${REPO_ROOT}/apps/console/cloudbuild.yaml" \
    --substitutions="_REGION=${REGION},_AR_REPO=${AR_REPO_ID},_SERVICE_NAME=${CONSOLE_SERVICE},_TAG=${TAG}" \
    --gcs-source-staging-dir="gs://${PROJECT_ID}-ge-agent-factory/cloudbuild/source"
fi

echo
echo "==> Re-applying Terraform with real image URIs..."
TF_ARGS=(-var-file="${VARS_FILE}" -var="gateway_image=${GATEWAY_IMAGE}" -var="worker_image=${WORKER_IMAGE}")
[[ "${DEPLOY_CONSOLE}" == "true" ]] && TF_ARGS+=(-var="console_image=${CONSOLE_IMAGE}")
terraform apply "${TF_ARGS[@]}" -auto-approve

echo
echo "==> Generating apps/presentation/.env.local..."
"${SCRIPT_DIR}/scripts/generate-env.sh"

echo
echo "Done. Gateway URL: $(get gateway_url)"
[[ "${DEPLOY_CONSOLE}" == "true" ]] && echo "Console URL: $(get console_url)"
echo "Run installer/verify.sh to confirm preflight checks pass."
