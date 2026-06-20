#!/usr/bin/env bash
# Smoke-tests the deployed gateway by calling /api/factory/preflight with the
# operator's own identity token. The endpoint runs the same structured checks
# the React UI uses (10 APIs enabled, SAs present, GE app reachable, bucket
# reachable). Prints the pass/fail summary and exits non-zero on any failure.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="${SCRIPT_DIR}/terraform"

for bin in terraform gcloud jq curl; do
  if ! command -v "${bin}" >/dev/null 2>&1; then
    echo "${bin} not found on PATH" >&2
    exit 1
  fi
done

cd "${TF_DIR}"
OUTPUTS_JSON="$(terraform output -json 2>/dev/null || true)"
if [[ -z "${OUTPUTS_JSON}" || "${OUTPUTS_JSON}" == "{}" ]]; then
  echo "No Terraform outputs found — run terraform apply first." >&2
  exit 1
fi

get() {
  printf '%s' "${OUTPUTS_JSON}" | jq -r ".${1}.value // empty"
}

PROJECT_ID="$(get project_id)"
PROJECT_NUMBER="$(get project_number)"
GATEWAY_URL="$(get gateway_url)"
FACTORY_BUCKET="$(get factory_bucket)"
RUNNER_SA="$(get runner_service_account)"
GE_APP_ID="$(get gemini_enterprise_app_id)"

if [[ -z "${GATEWAY_URL}" ]]; then
  echo "gateway_url output is empty — has terraform apply with real images completed?" >&2
  exit 1
fi

# Cloud Run with --no-allow-unauthenticated needs an identity token whose
# audience is the service URL.
TOKEN="$(gcloud auth print-identity-token --audiences="${GATEWAY_URL}")"

PAYLOAD="$(jq -n \
  --arg project "${PROJECT_ID}" \
  --arg projectNum "${PROJECT_NUMBER}" \
  --arg bucket "${FACTORY_BUCKET}" \
  --arg sa "${RUNNER_SA}" \
  --arg geApp "${GE_APP_ID}" \
  '{project_id: $project, project_number: $projectNum, bucket: $bucket, service_account: $sa, gemini_enterprise_app_id: $geApp}')"

echo "Calling ${GATEWAY_URL}/api/factory/preflight ..."
echo

RESPONSE="$(curl -sS \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -X POST \
  --data "${PAYLOAD}" \
  "${GATEWAY_URL}/api/factory/preflight")"

if [[ -z "${RESPONSE}" ]]; then
  echo "Empty response from gateway." >&2
  exit 1
fi

# Pretty-print and decide exit code.
printf '%s\n' "${RESPONSE}" | jq .

OK="$(printf '%s' "${RESPONSE}" | jq -r '.ok // false')"
if [[ "${OK}" != "true" ]]; then
  echo
  echo "Preflight FAILED — see check results above." >&2
  exit 1
fi

echo
echo "Preflight passed."
