# OLTP Package Contract

Use this reference only when creating or auditing `mock_data/oltp/**`.

## AlloyDB

Use for transactional source-system records that need SQL semantics: joins, constraints, lifecycle state, eligibility, enrollment, approvals, and audit trails.

Expected files:

```text
mock_data/oltp/alloydb/package.yaml
mock_data/oltp/alloydb/schema.sql
mock_data/oltp/alloydb/load-alloydb.sh
```

Package requirements:

- PostgreSQL-compatible DDL.
- Stable primary keys and foreign keys where relationships exist.
- Deterministic seed rows.
- Audit columns for source-system evidence.
- Loader reads `ALLOYDB_POSTGRES_DSN` and does not embed credentials.

## Firestore / Firebase

Use for document/JSON operational records: app state, chat state, tasks, approvals, notification records, and denormalized source snapshots.

Expected files:

```text
mock_data/oltp/firestore/package.yaml
mock_data/oltp/firestore/collections.json
mock_data/oltp/firestore/load-firestore.sh
```

Package requirements:

- Collection names and document IDs are deterministic.
- Documents include linked entity IDs from SQL/OLAP fixtures when applicable.
- Loader uses `GOOGLE_CLOUD_PROJECT` and never assumes auth is present.

## Bigtable

Use only for high-volume keyed event streams, telemetry, time series, click paths, or sensor-style operational data.

Expected files:

```text
mock_data/oltp/bigtable/package.yaml
mock_data/oltp/bigtable/table.yaml
mock_data/oltp/bigtable/mutations.ndjson
mock_data/oltp/bigtable/load-bigtable.sh
```

Package requirements:

- Row keys are documented.
- Column families are explicit.
- Mutations are deterministic NDJSON.
- Loader can create/describe the instance/table but should not hide required project settings.
