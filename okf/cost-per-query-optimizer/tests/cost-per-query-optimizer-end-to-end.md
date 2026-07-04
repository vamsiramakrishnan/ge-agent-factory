---
type: Eval Scenario
title: "Run the Cost-per-Query Optimizer workflow for the current period. Cite the re..."
description: "Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cost-per-query-optimizer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [query-cost-profiling](/queries/query-cost-profiling.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_admin_analytics_events](/tools/query-bigquery-admin-analytics-events.md)
- [lookup_cost_per_query_optimizer_runbook](/tools/lookup-cost-per-query-optimizer-runbook.md)
- [action_bigquery_recommend](/tools/action-bigquery-recommend.md)

## Success rubric

Action recommend executed against BigQuery, with audit-trail entry and Data Platform Lead notified of outcomes.

# Citations

- [Cost-per-Query Optimizer Operations Runbook](/documents/cost-per-query-optimizer-runbook.md)
