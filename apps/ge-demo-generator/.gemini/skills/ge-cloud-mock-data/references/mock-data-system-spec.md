# Mock Data System Spec

## Goal

The GE Demo Generator should create enterprise demo workspaces where the data is credible enough to support agent reasoning, validation, and optional Google Cloud deployment. The system must not generate only a scaffold with generic rows. It must generate a compact but complete data product.

Snowfakery is the first-class YAML control plane for structured row generation. Use it for OLTP SQL, OLTP NoSQL document/event rows, and OLAP fact/snapshot tables. Faker can still supply primitive values underneath a recipe, but agents and humans should inspect and edit YAML recipes rather than opaque generator code.

The GE CLI owns planning and packaging. It reads slide use cases, classifies source systems, builds a collection of datastore targets, writes Snowfakery recipes for structured data, then invokes datastore-specific packagers. Do not collapse all source systems into a single BigQuery package unless the use case is genuinely warehouse-only.

Implemented backend hooks:

- `ge-mock generate`: default GE/Faker local fixture generation.
- `ge-mock sources`: extract and classify source systems from `src/components/slides/use-cases`.
- `ge-mock plan-data`: build `mock_data/plan/data-plan.yaml` as a collection of datastores and service adapters, then write the canonical structured Snowfakery recipe.
- `ge-mock snowfakery-recipe`: export a Snowfakery YAML recipe under `mock_data/snowfakery/`.
- `ge-mock data-plan`: create the currently implemented BigQuery and Cloud Storage deployable package.

Target packagers are intentionally separate:

- OLTP SQL packager: AlloyDB for PostgreSQL DDL, relationships, load files, and scripts.
- OLTP NoSQL packager: Firestore document JSON and Bigtable row-key/column-family packages.
- OLAP packager: BigQuery schemas and NDJSON/CSV load files.
- Blob packager: Cloud Storage objects plus `documents_manifest`.

## Folder Contract

Use separate folders for separate concerns:

- `fixtures/`: local-first data consumed by ADK tools and tests.
- `mock_systems/`: scenario schema, source-system definitions, and pipeline state.
- `mock_data/plan/`: datastore collection plan and package routing.
- `mock_data/snowfakery/`: Snowfakery YAML recipes and generated structured rows.
- `mock_data/oltp/`: AlloyDB, Firestore, and Bigtable operational packages.
- `mock_data/olap/`: BigQuery analytical packages.
- `mock_data/blobs/`: generated PDF/DOCX/Markdown/source evidence and object manifests.
- `mock_data/cloud/`: deployable data package for Google Cloud.
- `mock_data/apis/`: OpenAPI contracts, JSON-backed API fixtures, MCP tool manifests, and optional service adapter package.
- `artifacts/`: validation reports, deploy plans, publish plans, and generated evidence, not bulk data.

`mock_data/cloud/` must contain:

- `cloud-data-manifest.json`
- `bigquery/schemas/<table>.schema.json`
- `bigquery/ndjson/<table>.jsonl`
- `bigquery/schemas/documents_manifest.schema.json`
- `bigquery/ndjson/documents_manifest.jsonl`
- `load-to-google-cloud.sh`

`artifacts/deploy-plan.json` must point to the data package and explain the target resources.

## Target Mapping

Use these defaults unless the user asks otherwise:

- OLTP SQL records: AlloyDB for PostgreSQL.
- OLTP NoSQL document/JSON records: Firestore.
- OLTP NoSQL high-volume keyed/time-series events: Bigtable.
- OLAP facts, snapshots, scores, and feed tables: BigQuery.
- Source documents and long-form evidence: Cloud Storage objects.
- Document search metadata: BigQuery `documents_manifest`.
- Agent code: ADK local runtime first, then Agent Runtime only on explicit deployment.
- Tool access to cloud data: datastore-specific ADK tools or MCP connectors, once the user asks for live cloud wiring.

Before choosing tables, inspect `docs/use-case-data-source-map.md`, generated from `src/components/slides/use-cases`. The slide architecture `connections` are more authoritative than generic system-name heuristics because they include `description`, `direction`, `protocol`, and `category`.

Source class mapping:

- `operational_system`: source records, status transitions, workflow objects, audit trails. Mock as AlloyDB SQL by default; Firestore/Bigtable only when the records are document/event shaped.
- `analytics_warehouse`: facts, metrics, snapshots, scoring outputs, time series. Generate OLAP rows with Snowfakery and package as BigQuery-native analytical tables.
- `document_store`: policies, guides, contracts, ADRs, PDFs, long-form evidence. Mock as Cloud Storage documents plus `documents_manifest`.
- `collaboration_event`: chat, email, calendar, task, comment, approval, notification events. Mock as Firestore documents by default; Bigtable when volume/time-series semantics dominate.
- `external_feed`: market, risk, benchmark, intent, review, commodity, and third-party signals. Mock as provider snapshot/feed tables with timestamps and provenance.
- `ai_or_model`: Vertex AI, Gemini, Document AI, BigQuery ML. Do not generate fake source tables for the model itself; generate eval prompts, model outputs, and downstream result tables only when useful.

`mock_data/plan/data-plan.yaml` must expose a top-level `datastores` collection because one use case can have many types of systems. Each datastore item should include `id`, `class`, `primary`, `systems`, `entities`, and `packager`.

## Data Quality Requirements

Each use case should have at least:

- One primary entity table.
- One source-system or transaction table.
- One evidence or audit table/document.
- Domain-specific columns, not only `name`, `value`, `status`.
- Deterministic edge cases that prove the workflow.
- A success metric fixture or eval prompt tied to the slide KPI.

For HR benefits, examples include:

- Employees: employee ID, Workday record ID, location, eligibility, life event, dependents.
- Plans: plan ID, carrier, premium, deductible, network type, eligibility rules.
- Enrollments: enrollment ID, employee ID, plan ID, coverage tier, effective date, carrier sync status.
- Chat/audit: message ID, employee ID, channel, notification status, audit trail.

For `Benefits Q&A & Enrollment`, the slide source map requires:

- Workday: operational employee/profile/life-event data.
- Benefitfocus or Benefits Platform: plan catalog, eligibility rules, enrollment status, carrier sync events.
- Google Drive: benefits plan documents, SPDs, enrollment guides in document storage.
- Google Chat: employee conversation and notification events.
- Vertex AI/Gemini: reasoning runtime, not a mock data table.
- REST/gRPC/GraphQL/RFC/SFTP/API: service adapter. Generate `mock_data/apis/openapi.json`, `mock_data/apis/fixtures/`, and `mock_data/apis/mcp-tools.json`; add datastore packages only for records the API owns.

## Validation Gates

Run these before reporting readiness:

```bash
ge-mock sources --slides ../../src/components/slides/use-cases
ge-mock plan-data --dir <workspace> --usecase <UseCaseName>
ge-mock snowfakery-recipe --dir <workspace>
ge-mock data-plan --dir <workspace> --project <project> --location <location>
ge-mock status --dir <workspace>
uv run pytest
```

Inspect:

- NDJSON parses line by line.
- `mock_data/plan/data-plan.yaml` contains multiple datastore entries for multi-system use cases.
- `mock_data/snowfakery/structured.recipe.yml` includes OLTP and OLAP structured entities.
- BigQuery schema files are arrays of fields with `name`, `type`, and `mode`.
- Row counts match `fixtures/manifest.json`.
- `mock_data/cloud/load-to-google-cloud.sh` only mutates cloud when explicitly run.
- `mock_data/apis/fixtures/index.json` exists for API-backed systems and drives REST/MCP/ADK source adapters locally.
- Agent tools can answer with source-system evidence.

## Google Cloud Load Plan

The load script should:

1. Enable `storage.googleapis.com` and `bigquery.googleapis.com`.
2. Create or reuse a Cloud Storage bucket.
3. Create or reuse a BigQuery dataset.
4. Upload NDJSON table files to `gs://<bucket>/<prefix>/tables/`.
5. Upload documents to `gs://<bucket>/<prefix>/documents/`.
6. Load BigQuery tables using explicit schema files.
7. Load `documents_manifest` so tools can cite Cloud Storage document URIs.

Do not deploy the agent, register Agent Registry services, or publish to Gemini Enterprise as part of data packaging.
