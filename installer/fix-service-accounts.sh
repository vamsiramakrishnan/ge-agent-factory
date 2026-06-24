#!/usr/bin/env bash
# Remediate Cloud Run service-account drift (idempotent).
#
# The factory's browser-facing services must NOT run as the default compute SA
# (which carries ~Editor: bigquery.admin, artifactregistry.admin, ...). This binds
# the dedicated least-privilege SAs that terraform defines, both granting the roles
# those SAs need AND reassigning each service onto them. Safe to re-run.
#
#   runtime SA  ->  gateway, console   (ge-agent-factory-runtime@)
#   runner  SA  ->  worker             (ge-agent-factory-runner@)
#
# Usage: PROJECT_ID=my-proj REGION=us-central1 ./installer/fix-service-accounts.sh
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-us-central1}"
RUNTIME="ge-agent-factory-runtime@${PROJECT_ID}.iam.gserviceaccount.com"
RUNNER="ge-agent-factory-runner@${PROJECT_ID}.iam.gserviceaccount.com"
FACTORY_BUCKET="${PROJECT_ID}-ge-agent-factory"
DATA_BUCKET="${PROJECT_ID}-ge-agent-data"

grant_proj() { gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$1" --role="$2" --condition=None >/dev/null; }

echo "• Ensuring dedicated SAs carry their roles…"
for r in roles/datastore.user roles/cloudtasks.enqueuer roles/cloudbuild.builds.editor \
         roles/run.invoker roles/discoveryengine.editor roles/serviceusage.serviceUsageConsumer \
         roles/logging.logWriter roles/aiplatform.user; do grant_proj "$RUNTIME" "$r"; done
for r in roles/datastore.user roles/cloudtasks.enqueuer roles/cloudbuild.builds.editor \
         roles/run.invoker roles/run.developer roles/aiplatform.user roles/discoveryengine.editor \
         roles/bigquery.dataEditor roles/bigquery.jobUser roles/artifactregistry.writer \
         roles/secretmanager.secretAccessor roles/serviceusage.serviceUsageConsumer \
         roles/iam.serviceAccountUser roles/iam.serviceAccountTokenCreator roles/logging.logWriter; do grant_proj "$RUNNER" "$r"; done

# runtime mints OIDC AS runner (Cloud Tasks targets that need the runner identity).
gcloud iam service-accounts add-iam-policy-binding "$RUNNER" \
  --member="serviceAccount:$RUNTIME" --role="roles/iam.serviceAccountTokenCreator" --condition=None >/dev/null

echo "• Ensuring bucket-scoped storage access…"
for b in "$FACTORY_BUCKET" "$DATA_BUCKET"; do
  for sa in "$RUNNER" "$RUNTIME"; do
    gsutil iam ch "serviceAccount:${sa}:roles/storage.objectAdmin" "gs://$b" >/dev/null 2>&1 || echo "  (skip gs://$b for $sa)"
  done
done

echo "• Reassigning services off the default compute SA…"
gcloud run services update ge-agent-factory-worker  --project "$PROJECT_ID" --region "$REGION" --service-account="$RUNNER"  --quiet >/dev/null
gcloud run services update ge-agent-factory-console  --project "$PROJECT_ID" --region "$REGION" --service-account="$RUNTIME" --quiet >/dev/null
gcloud run services update ge-agent-factory-gateway  --project "$PROJECT_ID" --region "$REGION" --service-account="$RUNTIME" --quiet >/dev/null

echo "✓ Done. Current identities:"
for s in ge-agent-factory-worker ge-agent-factory-console ge-agent-factory-gateway; do
  printf "  %-30s %s\n" "$s" "$(gcloud run services describe "$s" --project "$PROJECT_ID" --region "$REGION" --format='value(spec.template.spec.serviceAccountName)')"
done
