# Source Classification

Use this reference only when a source system is ambiguous.

Classify each system by the data it owns in the workflow, not by brand name alone.

## Classes

- `OLTP_SQL`: transactional records, relational eligibility, lifecycle status, approvals, claims, invoices.
- `OLTP_NOSQL_FIRESTORE`: document records, app state, chat/session/task state, denormalized workflow objects.
- `OLTP_NOSQL_BIGTABLE`: high-volume keyed events, telemetry, time series, clickstreams, sensor-like records.
- `OLAP_BIGQUERY`: facts, dimensions, snapshots, score outputs, operational analytics, external feed snapshots.
- `UNSTRUCTURED_GCS`: PDFs, DOCX, contracts, policy docs, emails, transcripts, evidence blobs.
- `API_SERVICE_ADAPTER`: REST, GraphQL, gRPC, RFC/BAPI, SOAP, SFTP/API, webhook, or MCP service boundary. Generate OpenAPI, JSON-backed fixtures, MCP tools, and optional Cloud Run/API Gateway plan.
- `RUNTIME_DEPENDENCY`: AI model, ADK runtime, registry, deployment target; not source data.

## Output

Emit a datastore collection:

```yaml
datastores:
  - id: alloydb
    class: OLTP_SQL
    owns: [transactional_records]
  - id: firestore
    class: OLTP_NOSQL_FIRESTORE
    owns: [workflow_state]
  - id: bigquery
    class: OLAP_BIGQUERY
    owns: [metrics]
  - id: gcs
    class: UNSTRUCTURED_GCS
    owns: [documents]
apiContracts:
  - system: Workday
    protocol: REST API
    localBacking: mock_data/apis/fixtures/workday_read.json
    deployTarget: Cloud Run/API Gateway optional
```
