---
type: Eval Scenario
title: Run the Database Performance Advisor workflow for the current period. Cite th...
description: "Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "database-performance-advisor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [query-performance-collection](/queries/query-performance-collection.md)

## Mechanisms to call

- [query_cloudsql_cloudsql_records](/tools/query-cloudsql-cloudsql-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_database_performance_advisor_runbook](/tools/lookup-database-performance-advisor-runbook.md)
- [action_cloudsql_create](/tools/action-cloudsql-create.md)

## Success rubric

Action create executed against CloudSQL, with audit-trail entry and SRE Manager notified of outcomes.

# Citations

- [Database Performance Advisor Operations Runbook](/documents/database-performance-advisor-runbook.md)
