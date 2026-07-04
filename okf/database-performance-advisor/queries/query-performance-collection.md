---
type: Query Capability
title: "Collect slow query logs from CloudSQL, database performance metrics from Data..."
description: "Collect slow query logs from CloudSQL, database performance metrics from Datadog, and query execution plans. Identify the top N most expensive queries by execution time and frequency."
source_id: "query-performance-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect slow query logs from CloudSQL, database performance metrics from Datadog, and query execution plans. Identify the top N most expensive queries by execution time and frequency.

## Tools used

- [query_cloudsql_cloudsql_records](/tools/query-cloudsql-cloudsql-records.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_database_performance_advisor_runbook](/tools/lookup-database-performance-advisor-runbook.md)
- [action_cloudsql_create](/tools/action-cloudsql-create.md)

## Runs in

- [query_performance_collection](/workflow/query-performance-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/database-performance-advisor-end-to-end.md)

# Citations

- [Database Performance Advisor Operations Runbook](/documents/database-performance-advisor-runbook.md)
