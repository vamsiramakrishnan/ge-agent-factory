---
name: ge-olap-bigquery-packager
description: |
  Use to package Snowfakery-generated analytical rows for BigQuery: fact tables,
  dimension tables, metric snapshots, scoring outputs, external feed snapshots,
  schemas, NDJSON load files, and dataset manifests.
triggers:
  - "BigQuery"
  - "OLAP"
  - "analytics table"
  - "fact table"
  - "metric snapshot"
outputs:
  primary: mock_data/olap/bigquery/
  secondary: [mock_data/cloud/bigquery/, artifacts/deploy-plan.json]
resources:
  scripts: []
  references:
    - path: references/bigquery-package-contract.md
      purpose: BigQuery schema, NDJSON, manifest, and load-script contract.
      use_when: Creating or auditing BigQuery package files.
  assets:
    - path: assets/bigquery-package.yaml
      purpose: Template package manifest for BigQuery analytical data.
      use_when: Creating mock_data/olap/bigquery/package.yaml.
---

# GE OLAP BigQuery Packager

Use this for analytical data generated from Snowfakery or transformed from operational mocks.

## Current Command

```bash
ge-mock data-plan --dir <workspace> --project <project> --location US
```

## Package Contract

- BigQuery-safe table names.
- Explicit schema JSON.
- NDJSON load files.
- Dataset/table manifest.
- Load script that can create dataset and load tables when approved.

Snowfakery can generate OLAP rows. This skill owns the BigQuery-specific shape and load plan.

## Bundled Resources

- `references/bigquery-package-contract.md`: when creating schema/load manifests.
- `assets/bigquery-package.yaml`: package manifest template.
