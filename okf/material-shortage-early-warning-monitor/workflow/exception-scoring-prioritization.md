---
type: Workflow Stage
title: "Exception Scoring & Prioritization"
description: "Compare projected coverage against historical_metrics and analytics_events baselines in BigQuery (query_bigquery_analytics_events), weight in scenario_runs solver_status and service_level_pct, and rank open shortages by production impact for the Supply Planner's queue."
source_id: exception_scoring_prioritization
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Scoring & Prioritization

Compare projected coverage against historical_metrics and analytics_events baselines in BigQuery (query_bigquery_analytics_events), weight in scenario_runs solver_status and service_level_pct, and rank open shortages by production impact for the Supply Planner's queue.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)

Next: [SOP & Authority-Matrix Evidence Gate](/workflow/sop-authority-matrix-evidence-gate.md)
