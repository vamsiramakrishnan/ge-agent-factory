# BigQuery Package Contract

Use this reference only when creating or auditing `mock_data/olap/bigquery/**`.

BigQuery packages are for analytical facts, dimensions, snapshots, metrics, model scoring outputs, and external feed snapshots. Snowfakery may generate the rows; this package owns BigQuery shape and loading.

Expected files:

```text
mock_data/olap/bigquery/package.yaml
mock_data/olap/bigquery/schema/<table>.schema.json
mock_data/olap/bigquery/data/<table>.ndjson
mock_data/olap/bigquery/load-bigquery.sh
```

Requirements:

- Table names are BigQuery-safe and domain-specific.
- Schemas use explicit BigQuery types.
- NDJSON rows match schemas exactly.
- Partitioning/clustering is specified when dates or entity keys exist.
- Package manifest records source use case, seed, row counts, and upstream source systems.
- Loader uses `GOOGLE_CLOUD_PROJECT`, `BQ_DATASET`, and `LOCATION`.

Reject packages that only create generic `name/value/status` tables unless the source system truly has that shape.
