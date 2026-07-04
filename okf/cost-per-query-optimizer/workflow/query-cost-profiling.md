---
type: Workflow Stage
title: Query Cost Profiling
description: "Analyze BigQuery INFORMATION_SCHEMA to rank queries by cost. Identify full table scans, cross-region reads, and queries that could benefit from materialized views or BI Engine."
source_id: query_cost_profiling
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Cost Profiling

Analyze BigQuery INFORMATION_SCHEMA to rank queries by cost. Identify full table scans, cross-region reads, and queries that could benefit from materialized views or BI Engine.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_bigquery_admin_analytics_events](/tools/query-bigquery-admin-analytics-events.md)
- [lookup_cost_per_query_optimizer_runbook](/tools/lookup-cost-per-query-optimizer-runbook.md)
- [action_bigquery_recommend](/tools/action-bigquery-recommend.md)

Next: [Optimization Opportunity Detection](/workflow/optimization-opportunity-detection.md)
