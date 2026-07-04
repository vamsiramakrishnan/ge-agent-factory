---
type: Query Capability
title: Analyze BigQuery INFORMATION_SCHEMA to rank queries by cost. Identify full ta...
description: "Analyze BigQuery INFORMATION_SCHEMA to rank queries by cost. Identify full table scans, cross-region reads, and queries that could benefit from materialized views or BI Engine."
source_id: "query-cost-profiling"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze BigQuery INFORMATION_SCHEMA to rank queries by cost. Identify full table scans, cross-region reads, and queries that could benefit from materialized views or BI Engine.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_bigquery_admin_analytics_events](/tools/query-bigquery-admin-analytics-events.md)
- [lookup_cost_per_query_optimizer_runbook](/tools/lookup-cost-per-query-optimizer-runbook.md)
- [action_bigquery_recommend](/tools/action-bigquery-recommend.md)

## Runs in

- [query_cost_profiling](/workflow/query-cost-profiling.md)

## Evidence expected

- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cost-per-query-optimizer-end-to-end.md)

# Citations

- [Cost-per-Query Optimizer Operations Runbook](/documents/cost-per-query-optimizer-runbook.md)
