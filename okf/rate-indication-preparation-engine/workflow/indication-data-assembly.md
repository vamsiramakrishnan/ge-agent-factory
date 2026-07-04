---
type: Workflow Stage
title: Indication Data Assembly
description: "Pull earned premium at current rate level, developed and trended losses, and expense provisions from BigQuery's historical_metrics, analytics_events, and cached_aggregates tables for the state/line under review."
source_id: indication_data_assembly
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Indication Data Assembly

Pull earned premium at current rate level, developed and trended losses, and expense provisions from BigQuery's historical_metrics, analytics_events, and cached_aggregates tables for the state/line under review.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_rate_indication_preparation_engine_authority_guide](/tools/lookup-rate-indication-preparation-engine-authority-guide.md)

Next: [Trend & Loss Development Selection](/workflow/trend-loss-development-selection.md)
