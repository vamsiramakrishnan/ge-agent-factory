---
type: Workflow Stage
title: "Rolling-Average Threshold Screening"
description: "Compare each emission_source's co2e_tonnes trend against historical_metrics and cached_aggregates baselines in BigQuery to flag any pollutant rolling average heading toward its permit_limit_tonnes before the quarter closes."
source_id: rolling_average_threshold_screening
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Rolling-Average Threshold Screening

Compare each emission_source's co2e_tonnes trend against historical_metrics and cached_aggregates baselines in BigQuery to flag any pollutant rolling average heading toward its permit_limit_tonnes before the quarter closes.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Exceedance & Downtime Reconciliation](/workflow/exceedance-downtime-reconciliation.md)
