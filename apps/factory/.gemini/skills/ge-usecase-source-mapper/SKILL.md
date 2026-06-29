---
name: ge-usecase-source-mapper
description: |
  Use to inspect GE slide use cases and classify each source system into a
  datastore collection. Reads src/components/slides/use-cases architecture
  metadata and emits source maps for OLTP SQL, OLTP NoSQL, OLAP, unstructured
  blobs, API/service adapters, and runtime/model dependencies.
triggers:
  - "source map"
  - "right data source"
  - "use case sources"
  - "datastore collection"
  - "API"
  - "MCP"
  - "service adapter"
  - "src/components/slides/use-cases"
outputs:
  primary: docs/use-case-data-source-map.md
  secondary: [src/use-case-source-map.generated.json]
resources:
  scripts: []
  references:
    - path: references/source-classification.md
      purpose: Source-system classification rules.
      use_when: A source can map to more than one datastore class.
  assets:
    - path: assets/source-map.yaml
      purpose: Template datastore collection output.
      use_when: Creating a use-case source map.
---

# GE Use Case Source Mapper

Use this before generating mock data. The source slide is the authority for systems, protocols, direction, and data responsibilities.

## Commands

```bash
factory sources --slides ../../src/components/slides/use-cases
rg -n "<UseCaseName>|<SystemName>" docs/use-case-data-source-map.md
```

## Classification

- `operational_system` -> OLTP SQL, usually AlloyDB.
- `collaboration_event` -> OLTP NoSQL, Firestore by default, Bigtable for high-volume time series.
- `analytics_warehouse` or `external_feed` -> OLAP, BigQuery.
- `document_store` -> unstructured blob store, Cloud Storage plus manifest.
- Service protocols such as REST API, GraphQL, gRPC, RFC/BAPI, SOAP, SFTP/API -> API/source adapter package under `mock_data/apis/`; also map the system to a datastore if it owns records.
- `ai_or_model` -> runtime dependency; do not create source tables.

## Output Contract

Each selected use case must become a datastore collection, not a single datastore:

```yaml
datastores:
  - id: alloydb
    class: OLTP
  - id: firestore
    class: OLTP_NOSQL
  - id: bigquery
    class: OLAP
  - id: gcs
    class: UNSTRUCTURED_BLOB
apiContracts:
  - system: Workday
    protocol: REST API
    path: /systems/workday/read
    localBacking: mock_data/apis/fixtures/workday_read.json
```

Then hand off to `factory plan-data --dir <workspace> --usecase <UseCaseName>`.

## Bundled Resources

- `references/source-classification.md`: when classifying ambiguous source systems.
- `assets/source-map.yaml`: source-map output template.
