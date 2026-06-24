#!/usr/bin/env bash
# Guides the operator through the IAP setup that Terraform deliberately does
# NOT automate (OAuth consent screen, OAuth client, LB + NEG + backend service).
# Where commands are safe to run unattended, runs them. Where a human decision
# is required (consent screen brand, support email), prints the link + the
# values you'll need.
#
# Run AFTER `terraform apply -var-file=values.tfvars` succeeded with
# enable_iap = true and the gateway is reachable.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALLER_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TF_DIR="${INSTALLER_DIR}/terraform"
VARS_FILE="${INSTALLER_DIR}/values.tfvars"

for bin in terraform gcloud jq; do
  if ! command -v "${bin}" >/dev/null 2>&1; then
    echo "${bin} not found on PATH" >&2
    exit 1
  fi
done

cd "${TF_DIR}"
OUTPUTS_JSON="$(terraform output -json)"

get() {
  printf '%s' "${OUTPUTS_JSON}" | jq -r ".${1}.value // empty"
}

PROJECT_ID="$(get project_id)"
PROJECT_NUMBER="$(get project_number)"
REGION="$(get region)"
GATEWAY_SERVICE="$(get gateway_service_name)"
ENABLE_IAP="$(get enable_iap)"

if [[ "${ENABLE_IAP}" != "true" ]]; then
  echo "Terraform output enable_iap=${ENABLE_IAP}." >&2
  echo "Set enable_iap = true in values.tfvars and re-apply before running this." >&2
  exit 1
fi

NEG_NAME="${GATEWAY_SERVICE}-neg"
BACKEND_NAME="${GATEWAY_SERVICE}-backend"
URL_MAP_NAME="${GATEWAY_SERVICE}-url-map"
HTTPS_PROXY_NAME="${GATEWAY_SERVICE}-https-proxy"
FORWARDING_RULE_NAME="${GATEWAY_SERVICE}-https-rule"
CERT_NAME="${GATEWAY_SERVICE}-cert"
IP_NAME="${GATEWAY_SERVICE}-ip"

cat <<EOF
This walks you through the parts of IAP that Terraform can't do safely:
  1. OAuth consent screen (manual, one time per project)
  2. OAuth 2.0 client (manual; produces the client id + secret IAP needs)
  3. Reserve a global IP
  4. Serverless NEG -> backend service with IAP enabled
  5. URL map -> HTTPS proxy -> forwarding rule -> managed SSL cert
  6. Re-apply Terraform with the backend service id so the gateway's
     IAP_EXPECTED_AUDIENCE env var resolves.

Project:  ${PROJECT_ID} (${PROJECT_NUMBER})
Region:   ${REGION}
Service:  ${GATEWAY_SERVICE}

EOF

read -r -p "Continue? [y/N] " confirm
if [[ "${confirm}" != "y" && "${confirm}" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

cat <<'EOF'

==> Step 1: OAuth consent screen
Open: https://console.cloud.google.com/apis/credentials/consent
  - User type: Internal (recommended) or External
  - App name, support email, developer contact: fill in
  - Save & continue through scopes / test users
This is a one-time setup per project.

==> Step 2: OAuth 2.0 client
Open: https://console.cloud.google.com/apis/credentials
  - + CREATE CREDENTIALS -> OAuth client ID
  - Application type: Web application
  - Authorized redirect URIs: leave empty for now (IAP fills these in)
  - Click CREATE; copy the Client ID and Client secret.

EOF

read -r -p "OAuth Client ID: " IAP_CLIENT_ID
read -r -s -p "OAuth Client secret: " IAP_CLIENT_SECRET
echo

if [[ -z "${IAP_CLIENT_ID}" || -z "${IAP_CLIENT_SECRET}" ]]; then
  echo "Both client id and secret are required." >&2
  exit 1
fi

echo
echo "==> Step 3: reserving a global IP address (${IP_NAME})..."
gcloud compute addresses create "${IP_NAME}" \
  --project="${PROJECT_ID}" \
  --global \
  --ip-version=IPV4 2>/dev/null || echo "  (already exists, skipping)"

IP_ADDRESS="$(gcloud compute addresses describe "${IP_NAME}" \
  --project="${PROJECT_ID}" --global --format='value(address)')"
echo "  IP: ${IP_ADDRESS}"

echo
echo "==> Step 4: creating serverless NEG and backend service..."
gcloud compute network-endpoint-groups create "${NEG_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --network-endpoint-type=serverless \
  --cloud-run-service="${GATEWAY_SERVICE}" 2>/dev/null || echo "  (NEG already exists, skipping)"

gcloud compute backend-services create "${BACKEND_NAME}" \
  --project="${PROJECT_ID}" \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --protocol=HTTPS 2>/dev/null || echo "  (backend service already exists, skipping)"

gcloud compute backend-services add-backend "${BACKEND_NAME}" \
  --project="${PROJECT_ID}" \
  --global \
  --network-endpoint-group="${NEG_NAME}" \
  --network-endpoint-group-region="${REGION}" 2>/dev/null || echo "  (backend already attached, skipping)"

echo "  Enabling IAP on backend service..."
gcloud compute backend-services update "${BACKEND_NAME}" \
  --project="${PROJECT_ID}" \
  --global \
  --iap=enabled,oauth2-client-id="${IAP_CLIENT_ID}",oauth2-client-secret="${IAP_CLIENT_SECRET}"

BACKEND_SERVICE_ID="$(gcloud compute backend-services describe "${BACKEND_NAME}" \
  --project="${PROJECT_ID}" --global --format='value(id)')"
echo "  Backend service id: ${BACKEND_SERVICE_ID}"

cat <<EOF

==> Step 5: URL map, HTTPS proxy, forwarding rule, managed cert
You need a DNS name pointing at ${IP_ADDRESS} before the managed SSL cert can
issue. Create the DNS A record now, then continue.

EOF

read -r -p "Hostname for the gateway (e.g. factory.example.com): " HOSTNAME
if [[ -z "${HOSTNAME}" ]]; then
  echo "Hostname required." >&2
  exit 1
fi

gcloud compute ssl-certificates create "${CERT_NAME}" \
  --project="${PROJECT_ID}" \
  --global \
  --domains="${HOSTNAME}" 2>/dev/null || echo "  (cert already exists, skipping)"

gcloud compute url-maps create "${URL_MAP_NAME}" \
  --project="${PROJECT_ID}" \
  --default-service="${BACKEND_NAME}" 2>/dev/null || echo "  (url-map already exists, skipping)"

gcloud compute target-https-proxies create "${HTTPS_PROXY_NAME}" \
  --project="${PROJECT_ID}" \
  --url-map="${URL_MAP_NAME}" \
  --ssl-certificates="${CERT_NAME}" 2>/dev/null || echo "  (https-proxy already exists, skipping)"

gcloud compute forwarding-rules create "${FORWARDING_RULE_NAME}" \
  --project="${PROJECT_ID}" \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --address="${IP_NAME}" \
  --target-https-proxy="${HTTPS_PROXY_NAME}" \
  --ports=443 2>/dev/null || echo "  (forwarding rule already exists, skipping)"

echo
echo "==> Step 6: re-applying Terraform with iap_backend_service_id=${BACKEND_SERVICE_ID}"
echo "    so the gateway's IAP_EXPECTED_AUDIENCE env var resolves."

cd "${TF_DIR}"
terraform apply \
  -var-file="${VARS_FILE}" \
  -var="iap_backend_service_id=${BACKEND_SERVICE_ID}" \
  -auto-approve

cat <<EOF

IAP wiring is complete.

  Backend service id:  ${BACKEND_SERVICE_ID}
  Audience env var:    /projects/${PROJECT_NUMBER}/global/backendServices/${BACKEND_SERVICE_ID}
  Hostname:            https://${HOSTNAME}

Next:
  - SSL cert provisioning takes 10-60 minutes after DNS resolves.
  - Verify managed cert status:
      gcloud compute ssl-certificates describe ${CERT_NAME} --global \\
        --project=${PROJECT_ID} --format='value(managed.status,managed.domainStatus)'
  - Update values.tfvars with iap_backend_service_id = "${BACKEND_SERVICE_ID}"
    so future plain 'terraform apply' runs stay idempotent.
EOF
