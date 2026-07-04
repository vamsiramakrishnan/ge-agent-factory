---
type: Workflow Stage
title: Query Performance Collection
description: "Collect slow query logs from CloudSQL, database performance metrics from Datadog, and query execution plans. Identify the top N most expensive queries by execution time and frequency."
source_id: query_performance_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Performance Collection

Collect slow query logs from CloudSQL, database performance metrics from Datadog, and query execution plans. Identify the top N most expensive queries by execution time and frequency.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_cloudsql_cloudsql_records](/tools/query-cloudsql-cloudsql-records.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_database_performance_advisor_runbook](/tools/lookup-database-performance-advisor-runbook.md)
- [action_cloudsql_create](/tools/action-cloudsql-create.md)

Next: [Query Plan & Index Analysis](/workflow/query-plan-index-analysis.md)
