# API Adapter Contract

Use this reference only when generating or auditing `mock_data/apis/**`.

## Required Artifacts

- `mock_data/apis/source-adapters.json`: source systems, protocols, methods, paths, evidence types, and deployment targets.
- `mock_data/apis/openapi.json`: OpenAPI 3.x contract for REST-like access.
- `mock_data/apis/fixtures/index.json`: deterministic JSON-backed API fixture index.
- `mock_data/apis/fixtures/<system>_<operation>.json`: request/response fixtures for local serving and tests.
- `mock_data/apis/mcp-tools.json`: MCP tool list with input schemas.
- `mock_data/apis/mcp-adapter/`: optional Express + MCP SSE adapter package.
- `mock_data/apis/deploy-adapter.sh`: plan-only deployment script; do not run by default.

## Source Adapter Shape

Each service source should include:

- `system`
- `protocol`
- `direction`
- `method`
- `path`
- `dataPackage`
- `evidence`

Read operations may be `GET`. Write, sync, apply, approve, update, and submit operations should be `POST` and require `idempotencyKey`.

## Evidence

Every adapter response should be able to return:

- `source_system`
- `source_record_id`
- `evidence_type`
- `audit_trail`
- `data`

The agent can cite these as source-system records and generated audit trail evidence.

## Deployment Boundary

Local path: deterministic fixture-backed adapter.

JSON-backed APIs are the default local path. Use them when the upstream system is an API, the demo needs request/response fidelity, and the same deterministic fixture should drive REST, MCP, and ADK source adapters.

Cloud path after explicit approval:

- Cloud Run service for the adapter.
- Optional API Gateway using `openapi.json`.
- Optional MCP registration in Agent Registry if the adapter is exposed as MCP.

Keep these separate from AlloyDB/Firestore/Bigtable/BigQuery/GCS package loading.
