#!/usr/bin/env bash
set -euo pipefail

# Registers a deployed ADK Agent Runtime reasoning engine into a Gemini
# Enterprise app through the official Discovery Engine REST API.
#
# Required:
#   PROJECT_ID                 GCP project ID containing the Gemini Enterprise app.
#   APP_ID                     Gemini Enterprise engine/app ID.
#
# Agent Runtime:
#   AGENT_RUNTIME_ID           Full resource name, OR
#   RESOURCE_LOCATION          Reasoning engine location, e.g. us-central1.
#   RESOURCE_ID                Reasoning engine numeric ID.
#
# Optional:
#   APP_LOCATION               Gemini Enterprise app location. Default: global.
#   ENDPOINT_LOCATION          Discovery Engine endpoint prefix. Default: APP_LOCATION.
#   DISPLAY_NAME               Display name in Gemini Enterprise.
#   DESCRIPTION                Agent description.
#   TOOL_DESCRIPTION           Tool description exposed in Gemini Enterprise.
#   AUTH_RESOURCE_NAME         Full OAuth authorization resource name.
#   DRY_RUN=1                  Print request without sending it.

require_env() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "Missing required environment variable: $name" >&2
    exit 2
  fi
}

require_env PROJECT_ID
require_env APP_ID

APP_LOCATION="${APP_LOCATION:-global}"
ENDPOINT_LOCATION="${ENDPOINT_LOCATION:-$APP_LOCATION}"
DISPLAY_NAME="${DISPLAY_NAME:-ADK Demo Agent}"
DESCRIPTION="${DESCRIPTION:-ADK agent registered from the GE demo harness.}"
TOOL_DESCRIPTION="${TOOL_DESCRIPTION:-Use this ADK agent to answer task-specific business questions.}"

if [ -n "${AGENT_RUNTIME_ID:-}" ]; then
  REASONING_ENGINE="$AGENT_RUNTIME_ID"
else
  require_env RESOURCE_LOCATION
  require_env RESOURCE_ID
  REASONING_ENGINE="projects/${PROJECT_ID}/locations/${RESOURCE_LOCATION}/reasoningEngines/${RESOURCE_ID}"
fi

TMP_JSON="$(mktemp)"
trap 'rm -f "$TMP_JSON"' EXIT

DISPLAY_NAME="$DISPLAY_NAME" \
DESCRIPTION="$DESCRIPTION" \
TOOL_DESCRIPTION="$TOOL_DESCRIPTION" \
REASONING_ENGINE="$REASONING_ENGINE" \
AUTH_RESOURCE_NAME="${AUTH_RESOURCE_NAME:-}" \
node --input-type=module > "$TMP_JSON" <<'NODE'
const payload = {
  displayName: process.env.DISPLAY_NAME,
  description: process.env.DESCRIPTION,
  adkAgentDefinition: {
    toolSettings: {
      toolDescription: process.env.TOOL_DESCRIPTION,
    },
    provisionedReasoningEngine: {
      reasoningEngine: process.env.REASONING_ENGINE,
    },
  },
};

if (process.env.AUTH_RESOURCE_NAME) {
  payload.adkAgentDefinition.authorizations = [process.env.AUTH_RESOURCE_NAME];
}

process.stdout.write(JSON.stringify(payload, null, 2));
NODE

URL="https://${ENDPOINT_LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_ID}/locations/${APP_LOCATION}/collections/default_collection/engines/${APP_ID}/assistants/default_assistant/agents"

echo "Gemini Enterprise app: projects/${PROJECT_ID}/locations/${APP_LOCATION}/collections/default_collection/engines/${APP_ID}"
echo "Reasoning engine: ${REASONING_ENGINE}"
echo "Endpoint: ${URL}"

if [ "${DRY_RUN:-0}" = "1" ]; then
  echo
  echo "Payload:"
  cat "$TMP_JSON"
  exit 0
fi

TOKEN="$(gcloud auth print-access-token)"

curl -sS -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "X-Goog-User-Project: ${PROJECT_ID}" \
  "${URL}" \
  --data-binary "@${TMP_JSON}"
echo
