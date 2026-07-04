---
type: Workflow Stage
title: "Trend Clustering & Leading-Indicator Correlation"
description: "Run query_bigquery_analytics_events against historical_metrics baselines in BigQuery to cluster emerging unsafe conditions and test which clusters historically preceded recordable and lost-time DART incidents."
source_id: trend_clustering_leading_indicator_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trend Clustering & Leading-Indicator Correlation

Run query_bigquery_analytics_events against historical_metrics baselines in BigQuery to cluster emerging unsafe conditions and test which clusters historically preceded recordable and lost-time DART incidents.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)

Next: [Cross-System Evidence Reconciliation](/workflow/cross-system-evidence-reconciliation.md)
