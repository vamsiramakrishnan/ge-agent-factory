---
type: Workflow Stage
title: "Emerging-cluster & baseline detection"
description: Compare analytics_events variance_pct against historical_metrics and cached_aggregates baselines in BigQuery across consecutive metric_date periods to flag statistically significant emerging complaint clusters.
source_id: emerging_cluster_baseline_detection
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Emerging-cluster & baseline detection

Compare analytics_events variance_pct against historical_metrics and cached_aggregates baselines in BigQuery across consecutive metric_date periods to flag statistically significant emerging complaint clusters.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_complaint_root_cause_analyzer_assurance_runbook](/tools/lookup-complaint-root-cause-analyzer-assurance-runbook.md)

Next: [Cost-to-serve ranking & driver prioritization](/workflow/cost-to-serve-ranking-driver-prioritization.md)
