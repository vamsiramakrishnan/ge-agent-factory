---
type: Workflow Stage
title: "Baseline & Variance Comparison"
description: "Query analytics_events against historical_metrics and cached_aggregates in BigQuery to compare the current period's OEE against baseline and flag variance_pct outliers per line and SKU."
source_id: baseline_variance_comparison
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Variance Comparison

Query analytics_events against historical_metrics and cached_aggregates in BigQuery to compare the current period's OEE against baseline and flag variance_pct outliers per line and SKU.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)

Next: [Loss Bucket Decomposition & Dollarization](/workflow/loss-bucket-decomposition-dollarization.md)
