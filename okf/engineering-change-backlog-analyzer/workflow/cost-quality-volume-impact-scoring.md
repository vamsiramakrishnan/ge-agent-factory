---
type: Workflow Stage
title: "Cost, Quality & Volume Impact Scoring"
description: "Score each clustered request on cost impact, quality risk, and affected_item_count using historical_metrics and analytics_events pulled from BigQuery via query_bigquery_historical_metrics and query_bigquery_analytics_events, benchmarked against the Open change requests older than 90 days and duplicate-rate KPI baselines."
source_id: cost_quality_volume_impact_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cost, Quality & Volume Impact Scoring

Score each clustered request on cost impact, quality risk, and affected_item_count using historical_metrics and analytics_events pulled from BigQuery via query_bigquery_historical_metrics and query_bigquery_analytics_events, benchmarked against the Open change requests older than 90 days and duplicate-rate KPI baselines.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)

Next: [SOP & Export-Control Evidence Validation](/workflow/sop-export-control-evidence-validation.md)
