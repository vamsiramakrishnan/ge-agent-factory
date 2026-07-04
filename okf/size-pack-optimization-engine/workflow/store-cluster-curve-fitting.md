---
type: Workflow Stage
title: "Store-Cluster Curve Fitting"
description: "Compare each store cluster's transaction-level size mix against analytics_events and historical_metrics in BigQuery to fit a localized size curve and flag classes where the chain-average curve diverges from cluster-level sell-through."
source_id: store_cluster_curve_fitting
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store-Cluster Curve Fitting

Compare each store cluster's transaction-level size mix against analytics_events and historical_metrics in BigQuery to fit a localized size curve and flag classes where the chain-average curve diverges from cluster-level sell-through.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)

Next: [Pack Ratio & Rounding Reconciliation](/workflow/pack-ratio-rounding-reconciliation.md)
