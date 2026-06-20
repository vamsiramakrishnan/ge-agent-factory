---
name: ge-oltp-cloud-packager
description: |
  Use to package Snowfakery-generated OLTP data for Google Cloud operational
  datastores: AlloyDB for SQL, Firestore for document/JSON operational records,
  and Bigtable for high-volume keyed event/time-series data.
triggers:
  - "AlloyDB"
  - "Firestore"
  - "Firebase"
  - "Bigtable"
  - "OLTP packager"
  - "NoSQL"
outputs:
  primary: mock_data/oltp/
  secondary: [artifacts/deploy-plan.json]
resources:
  scripts: []
  references:
    - path: references/oltp-package-contract.md
      purpose: AlloyDB, Firestore/Firebase, and Bigtable package contracts.
      use_when: Creating or auditing operational datastore packages.
  assets:
    - path: assets/alloydb-package.yaml
      purpose: Template package manifest for OLTP SQL.
      use_when: Creating mock_data/oltp/alloydb/package.yaml.
    - path: assets/firestore-package.yaml
      purpose: Template package manifest for document/JSON operational data.
      use_when: Creating mock_data/oltp/firestore/package.yaml.
    - path: assets/bigtable-package.yaml
      purpose: Template package manifest for high-volume keyed data.
      use_when: Creating mock_data/oltp/bigtable/package.yaml.
---

# GE OLTP Cloud Packager

Use this after `ge-snowfakery-structured-data`.

## Target Rules

- AlloyDB: transactional SQL source systems, joins, constraints, workflow state.
- Firestore: document/JSON operational records, chat/session/task/approval state.
- Bigtable: high-volume keyed events, telemetry, or time-series operational streams.

## Package Contract

Expected future folders:

```text
mock_data/oltp/alloydb/
mock_data/oltp/firestore/
mock_data/oltp/bigtable/
```

Each package should contain schema/mapping, generated load files, and a load script. Do not run live loads without explicit user approval.

## Bundled Resources

- `references/oltp-package-contract.md`: when creating or auditing package files.
- `assets/alloydb-package.yaml`: AlloyDB package manifest template.
- `assets/firestore-package.yaml`: Firestore package manifest template.
- `assets/bigtable-package.yaml`: Bigtable package manifest template.
