---
name: ge-cloud-mock-data
description: |
  Use to orchestrate cloud-ready deterministic data generation as a collection
  of datastores and service adapters. Composes source mapping, Snowfakery YAML
  structured generation, OLTP packagers for AlloyDB/Firestore/Bigtable, OLAP
  BigQuery packaging, unstructured blob packaging for Cloud Storage, and
  API/MCP adapter contracts for service protocols.
triggers:
  - "cloud mock data"
  - "deployable mock data"
  - "datastore collection"
  - "BigQuery"
  - "AlloyDB"
  - "Firestore"
  - "Firebase"
  - "Bigtable"
  - "Cloud Storage"
  - "Snowfakery"
  - "API"
  - "MCP"
  - "source adapter"
  - "data-plan"
  - "not a skeleton"
outputs:
  primary: mock_data/plan/data-plan.yaml
  secondary: [mock_data/snowfakery/structured.recipe.yml, mock_data/cloud/, mock_data/oltp/, mock_data/olap/, mock_data/blobs/, mock_data/apis/, artifacts/deploy-plan.json]
resources:
  scripts: []
  references:
    - path: references/mock-data-system-spec.md
      purpose: Full cloud-ready mock data package contract.
      use_when: Designing or auditing datastore collection outputs.
  assets:
    - path: assets/datastore-collection.yaml
      purpose: Template for multi-datastore source mapping.
      use_when: Creating mock_data/plan/data-plan.yaml.
---

# GE Cloud Data And Source Adapters

Use this as the deterministic data and source-adapter router. A serious use case usually needs a datastore collection plus API/MCP service adapters, not one generic table.

## Flow

```bash
factory sources --slides ../../src/components/slides/use-cases
factory plan-data --dir <workspace> --usecase <UseCaseName>
factory snowfakery-recipe --dir <workspace>
factory data-plan --dir <workspace> --project <gcp-project> --location US
```

Do not run generated cloud load scripts unless the user explicitly asks to mutate Google Cloud.

## Compose

1. `ge-usecase-source-mapper`: classify slide systems into datastore classes.
2. `ge-snowfakery-structured-data`: generate canonical YAML recipes for OLTP and OLAP rows.
3. `ge-oltp-cloud-packager`: package AlloyDB, Firestore, and Bigtable operational stores.
4. `ge-olap-bigquery-packager`: package BigQuery analytical tables.
5. `ge-unstructured-blob-packager`: package PDF/DOCX/Markdown/blob evidence for Cloud Storage.
6. `ge-api-service-adapter`: package REST/gRPC/GraphQL/RFC/SFTP API sources as OpenAPI, JSON-backed fixtures, and MCP SSE adapters.

## Datastore Rules

- OLTP SQL: AlloyDB.
- OLTP document/JSON: Firestore/Firebase.
- OLTP high-volume keyed/time-series: Bigtable.
- OLAP: BigQuery.
- Unstructured blobs: Cloud Storage plus BigQuery `documents_manifest`.
- Runtime/model systems: dependency, not source data.
- REST/GraphQL/gRPC/RFC/BAPI/SFTP/API systems: service adapters under `mock_data/apis/` plus a datastore package if they own records.

## Quality Gate

Reject generated work if:

- It maps a multi-system use case to one datastore.
- It uses generic `name/value/status` tables.
- It has no Snowfakery YAML for structured rows.
- It stores deployable mock data under `artifacts/` instead of `mock_data/`.
- It lacks a `mock_data/plan/data-plan.yaml` datastore collection.
- It has service protocols but lacks `mock_data/apis/source-adapters.json`, `mock_data/apis/fixtures/index.json`, `openapi.json`, and `mcp-tools.json`.

## Bundled Resources

- `references/mock-data-system-spec.md`: when designing package contracts.
- `assets/datastore-collection.yaml`: copy or adapt when creating a datastore collection plan.
- `docs/mock-data-generator-architecture.md`: when changing generator code.
- `docs/use-case-data-source-map.md`: when mapping a concrete use case.
