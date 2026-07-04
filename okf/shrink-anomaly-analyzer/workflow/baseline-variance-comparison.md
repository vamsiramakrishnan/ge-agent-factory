---
type: Workflow Stage
title: Baseline Variance Comparison
description: "Compare the store-week's analytics_events against historical_metrics and cached_aggregates in BigQuery to size the shrink-rate variance_pct against the 2.3%-to-1.4%-of-sales baseline."
source_id: baseline_variance_comparison
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Variance Comparison

Compare the store-week's analytics_events against historical_metrics and cached_aggregates in BigQuery to size the shrink-rate variance_pct against the 2.3%-to-1.4%-of-sales baseline.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)

Next: [Case File Assembly & Risk Ranking](/workflow/case-file-assembly-risk-ranking.md)
