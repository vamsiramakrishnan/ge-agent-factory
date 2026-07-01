// Pure derivers/renderers for the cloud-data packager (buildCloudDataArtifacts in
// factory.mjs). Extracted verbatim — each takes already-loaded inputs (manifest,
// table rows, resolved project/dataset/bucket/prefix) and returns a plain
// value/string; the caller owns all file I/O and pipeline/manifest mutation.

import { bigQuerySafeName, bigQueryType } from "./bigquery-types.mjs";

// Derive a table's BigQuery schema + its cloud-data-manifest.json table record.
// Samples the actual row values per column so decimal-bearing fields are typed
// FLOAT64 even when the schema collapsed them to "number".
export function buildCloudTableRecord({ table, rows, project, location, dataset, bucket, prefix, manifestId }) {
  const tableId = bigQuerySafeName(table.name);
  const schema = (table.columns || []).map((col) => {
    const sampledValues = rows.map((r) => r?.[col.name]).filter((v) => v != null);
    return {
      name: bigQuerySafeName(col.name),
      type: bigQueryType(col, sampledValues),
      mode: "NULLABLE",
      description: `Generated mock field from ${manifestId || "scenario"} fixture ${table.name}.${col.name}`,
    };
  });
  const schemaPathRel = `mock_data/cloud/bigquery/schemas/${tableId}.schema.json`;
  const ndjsonPathRel = `mock_data/cloud/bigquery/ndjson/${tableId}.jsonl`;
  return {
    schema,
    schemaPathRel,
    ndjsonPathRel,
    record: {
      name: table.name,
      tableId,
      rowCount: rows.length,
      primaryKey: table.primaryKey || "id",
      schemaPath: schemaPathRel,
      ndjsonPath: ndjsonPathRel,
      gcsUri: `gs://${bucket}/${prefix}/tables/${tableId}.jsonl`,
      bigQueryTable: `${project}.${dataset}.${tableId}`,
      loadCommand: `bq load --location=${location} --replace --source_format=NEWLINE_DELIMITED_JSON ${project}:${dataset}.${tableId} gs://${bucket}/${prefix}/tables/${tableId}.jsonl ${schemaPathRel}`,
    },
  };
}

// The evidence-document manifest: one row + BigQuery schema entry per document,
// materialized as its own documents_manifest table.
export function buildDocumentManifest(manifest, { bucket, prefix }) {
  const documentRows = (manifest.documents || []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type || "document",
    source_path: doc.path,
    gcs_uri: `gs://${bucket}/${prefix}/${doc.path}`,
    word_count: doc.wordCount || null,
    linked_entities: Array.isArray(doc.linkedEntities) ? doc.linkedEntities.join(",") : "",
  }));
  const documentManifestSchema = [
    { name: "id", type: "STRING", mode: "REQUIRED" },
    { name: "title", type: "STRING", mode: "NULLABLE" },
    { name: "type", type: "STRING", mode: "NULLABLE" },
    { name: "source_path", type: "STRING", mode: "NULLABLE" },
    { name: "gcs_uri", type: "STRING", mode: "NULLABLE" },
    { name: "word_count", type: "INT64", mode: "NULLABLE" },
    { name: "linked_entities", type: "STRING", mode: "NULLABLE" },
  ];
  return { documentRows, documentManifestSchema };
}

// The bash script that loads the packaged tables + documents into BigQuery/GCS.
// Written to disk, never executed by the factory itself.
export function renderCloudLoadScript({ project, location, dataset, bucket, prefix, scenario, tables }) {
  const commands = [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "",
    `PROJECT="${"${GOOGLE_CLOUD_PROJECT:-"}${project}${"}"}"`,
    `LOCATION="${"${GOOGLE_CLOUD_LOCATION:-"}${location}${"}"}"`,
    `DATASET="${"${BQ_DATASET:-"}${dataset}${"}"}"`,
    `BUCKET="${"${GCS_BUCKET:-"}${bucket}${"}"}"`,
    `PREFIX="${"${GCS_PREFIX:-"}${prefix}${"}"}"`,
    "",
    "if [ \"${GE_SKIP_SERVICE_ENABLE:-0}\" != \"1\" ]; then",
    "  gcloud services enable storage.googleapis.com bigquery.googleapis.com --project \"${PROJECT}\"",
    "else",
    "  echo \"Skipping API enablement; factory provision owns required APIs.\"",
    "fi",
    "if [ \"${GE_SKIP_BUCKET_CREATE:-0}\" = \"1\" ]; then",
    "  echo \"Skipping bucket creation/check; factory provision owns gs://${BUCKET}.\"",
    "elif ! gcloud storage buckets describe \"gs://${BUCKET}\" >/dev/null 2>&1; then",
    "  gcloud storage buckets create \"gs://${BUCKET}\" --project \"${PROJECT}\" --location \"${LOCATION}\"",
    "fi",
    `bq --location="\${LOCATION}" mk --dataset --description ${JSON.stringify(`GE mock data for ${scenario}`)} "\${PROJECT}:\${DATASET}" >/dev/null 2>&1 || true`,
    "",
    "gcloud storage cp mock_data/cloud/bigquery/ndjson/*.jsonl \"gs://${BUCKET}/${PREFIX}/tables/\"",
    "if [ -d fixtures/documents ]; then gcloud storage cp --recursive fixtures/documents \"gs://${BUCKET}/${PREFIX}/documents\"; fi",
    "",
    "# Publish this agent's MCP tool manifest to the shared agent-data bucket so the",
    "# per-department MCP service can resolve it at runtime via ?agent=<id>. The worker",
    "# sets GE_AGENT_DATA_BUCKET + GE_AGENT_ID; skipped (degrades) when unset (local runs).",
    "if [ -n \"${GE_AGENT_DATA_BUCKET:-}\" ] && [ -n \"${GE_AGENT_ID:-}\" ] && [ -f mock_data/cloud/mcp-tools.json ]; then",
    "  gcloud storage cp mock_data/cloud/mcp-tools.json \"gs://${GE_AGENT_DATA_BUCKET}/agents/${GE_AGENT_ID}/mcp-tools.json\"",
    "  echo \"Published MCP tool manifest → gs://${GE_AGENT_DATA_BUCKET}/agents/${GE_AGENT_ID}/mcp-tools.json\"",
    "else",
    "  echo \"Skipping MCP tool manifest publish (needs GE_AGENT_DATA_BUCKET + GE_AGENT_ID + mock_data/cloud/mcp-tools.json)\"",
    "fi",
    "",
    ...tables.map((table) => `bq load --location="\${LOCATION}" --replace --source_format=NEWLINE_DELIMITED_JSON "\${PROJECT}:\${DATASET}.${table.tableId}" "gs://\${BUCKET}/\${PREFIX}/tables/${table.tableId}.jsonl" "${table.schemaPath}"`),
    `bq load --location="\${LOCATION}" --replace --source_format=NEWLINE_DELIMITED_JSON "\${PROJECT}:\${DATASET}.documents_manifest" "gs://\${BUCKET}/\${PREFIX}/tables/documents_manifest.jsonl" "mock_data/cloud/bigquery/schemas/documents_manifest.schema.json"`,
    "",
    `echo "Loaded GE mock data to BigQuery dataset \${PROJECT}:\${DATASET} and Cloud Storage gs://\${BUCKET}/\${PREFIX}"`,
    "",
  ];
  return commands.join("\n");
}

// The cloud-data-manifest.json plan: target rationale, resolved GCP coordinates,
// artifact paths, and per-table/document records. Written verbatim to disk and
// (with nextCommands appended) to artifacts/deploy-plan.json.
export function buildCloudDataPlan({ scenario, generatedAt, project, location, dataset, bucket, prefix, tables, documentRows, manifest }) {
  return {
    id: `${scenario}-cloud-data`,
    generatedAt,
    mode: "mock_data_cloud_plan",
    target: {
      structured: "BigQuery native tables",
      unstructured: "Cloud Storage objects plus BigQuery documents_manifest table",
      reason: "BigQuery is the right deploy target for deterministic relational mock tables; Cloud Storage keeps source documents inspectable and portable.",
    },
    googleCloud: {
      project,
      location,
      dataset,
      bucket,
      prefix,
      requiredApis: ["storage.googleapis.com", "bigquery.googleapis.com"],
    },
    artifacts: {
      directory: "mock_data/cloud",
      loadScript: "mock_data/cloud/load-to-google-cloud.sh",
      deployPlan: "artifacts/deploy-plan.json",
      mcpToolManifest: "mock_data/cloud/mcp-tools.json",
    },
    tables,
    documents: {
      count: documentRows.length,
      manifestTable: `${project}.${dataset}.documents_manifest`,
      manifestNdjsonPath: "mock_data/cloud/bigquery/ndjson/documents_manifest.jsonl",
      manifestSchemaPath: "mock_data/cloud/bigquery/schemas/documents_manifest.schema.json",
      storageUriPrefix: `gs://${bucket}/${prefix}/documents/`,
    },
    validation: {
      deterministicSeed: manifest.seed,
      totalRows: manifest.totalRows,
      sourceManifest: "fixtures/manifest.json",
    },
  };
}
