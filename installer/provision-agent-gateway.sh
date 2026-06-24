#!/usr/bin/env bash
# Provision the managed Agent Gateway ONLY when it is not already available.
#
# Idempotent by design: checks for an existing AgentGateway via gcloud and exits
# early if found; otherwise runs a TARGETED terraform apply against the main stack
# (installer/terraform) so only the gateway + its API + IAM are created — the rest
# of the factory stack is left untouched. PLANS by default; pass --apply (or
# GE_APPLY=1) to create.
#
# Usage:
#   PROJECT_ID=my-proj ./installer/provision-agent-gateway.sh            # check + plan
#   PROJECT_ID=my-proj ./installer/provision-agent-gateway.sh --apply    # check + create if absent
set -euo pipefail

# NOTE: Agent Gateway is REGIONAL — use a region (us-central1), NOT 'global'.
# Using 'global' returns HTTP 501 unimplemented; a region provisions cleanly. The
# access form is only for semantic-governance/Agent-Runtime features, not gateway creation.
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
LOCATION="${LOCATION:-us-central1}"
GATEWAY_NAME="${GATEWAY_NAME:-ge-agent-factory-agw}"
APPLY=0
[[ "${GE_APPLY:-0}" == "1" ]] && APPLY=1
for arg in "$@"; do [[ "$arg" == "--apply" ]] && APPLY=1; done

if [[ -z "$PROJECT_ID" ]]; then
  echo "ERROR: set PROJECT_ID (env) or a gcloud default project." >&2
  exit 2
fi

TF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/terraform" && pwd)"
echo "Agent Gateway: project=$PROJECT_ID name=$GATEWAY_NAME location=$LOCATION"

# 1) Provision-when-not-available: skip entirely if it already exists.
if gcloud beta network-services agent-gateways describe "$GATEWAY_NAME" \
     --location="$LOCATION" --project="$PROJECT_ID" >/dev/null 2>&1; then
  echo "✓ Agent Gateway '$GATEWAY_NAME' already provisioned — nothing to do."
  exit 0
fi
echo "• Agent Gateway '$GATEWAY_NAME' not found — provisioning."

# 2) Targeted terraform (only the gateway, its API, and its IAM). A targeted apply
# still requires every root variable that lacks a default, so resolve them here.
PROJECT_NUMBER="${PROJECT_NUMBER:-$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)' 2>/dev/null)}"
TARGETS=(
  -target="module.agent_gateway"
  -target="google_cloud_run_service_iam_member.agent_gateway_invokes_mcp"
)
TF_VARS=(
  -var "project_id=$PROJECT_ID"
  -var "project_number=${PROJECT_NUMBER}"
  -var "gemini_enterprise_app_id=${GEMINI_ENTERPRISE_APP_ID:-}"
  -var "agent_gateway_name=$GATEWAY_NAME"
  -var "agent_gateway_location=$LOCATION"
  -var "enable_agent_gateway=true"
)

terraform -chdir="$TF_DIR" init -input=false
terraform -chdir="$TF_DIR" plan -input=false "${TARGETS[@]}" "${TF_VARS[@]}"

if [[ "$APPLY" == "1" ]]; then
  echo "• Applying (creating the Agent Gateway only)…"
  terraform -chdir="$TF_DIR" apply -input=false -auto-approve "${TARGETS[@]}" "${TF_VARS[@]}"
  echo "✓ Provisioned. mTLS endpoint:"
  terraform -chdir="$TF_DIR" output -raw agent_gateway_mtls_endpoint 2>/dev/null || true
else
  echo "• Plan only. Re-run with --apply to create the gateway."
fi
