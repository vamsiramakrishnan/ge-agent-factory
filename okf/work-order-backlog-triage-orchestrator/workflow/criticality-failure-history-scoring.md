---
type: Workflow Stage
title: "Criticality & failure-history scoring"
description: "Score each maintenance_work_order against asset_registry_entries.criticality_ranking and failure_codes recurrence (occurrences_ytd, mean_time_between_failures_hours), weighting the result against the trailing trend in BigQuery analytics_events and historical_metrics."
source_id: criticality_failure_history_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Criticality & failure-history scoring

Score each maintenance_work_order against asset_registry_entries.criticality_ranking and failure_codes recurrence (occurrences_ytd, mean_time_between_failures_hours), weighting the result against the trailing trend in BigQuery analytics_events and historical_metrics.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)

Next: [Parts & crew feasibility check](/workflow/parts-crew-feasibility-check.md)
