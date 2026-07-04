---
type: Workflow Stage
title: Composite index scoring
description: "Score each candidate asset on a weighted index of repair cost (maintenance_work_orders), downtime contribution (downtime_events), and failure frequency (failure_codes.occurrences_ytd), normalizing against historical_metrics and analytics_events baselines in BigQuery."
source_id: composite_index_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Composite index scoring

Score each candidate asset on a weighted index of repair cost (maintenance_work_orders), downtime contribution (downtime_events), and failure frequency (failure_codes.occurrences_ytd), normalizing against historical_metrics and analytics_events baselines in BigQuery.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)

Next: [Failure-mode clustering](/workflow/failure-mode-clustering.md)
