---
type: Workflow Stage
title: Segment Loss Ratio Decomposition
description: "Re-cut analytics_events against historical_metrics and cached_aggregates in BigQuery via query_bigquery_analytics_events to split each cell's movement into severity, frequency, and large-loss components across 400+ state/class/tier/cohort combinations."
source_id: segment_loss_ratio_decomposition
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Segment Loss Ratio Decomposition

Re-cut analytics_events against historical_metrics and cached_aggregates in BigQuery via query_bigquery_analytics_events to split each cell's movement into severity, frequency, and large-loss components across 400+ state/class/tier/cohort combinations.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)

Next: [Credibility-Weighted Trend Confirmation](/workflow/credibility-weighted-trend-confirmation.md)
