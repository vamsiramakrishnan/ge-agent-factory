---
type: Workflow Stage
title: Historical Payment Pattern Reconciliation
description: "Compare today's settlement ladder against BigQuery historical_metrics, cached_aggregates, and analytics_events (query_bigquery_historical_metrics, query_bigquery_cached_aggregates, query_bigquery_analytics_events) to separate a genuine cash-out spike from routine seasonal variance before sizing the funding gap."
source_id: historical_payment_pattern_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Historical Payment Pattern Reconciliation

Compare today's settlement ladder against BigQuery historical_metrics, cached_aggregates, and analytics_events (query_bigquery_historical_metrics, query_bigquery_cached_aggregates, query_bigquery_analytics_events) to separate a genuine cash-out spike from routine seasonal variance before sizing the funding gap.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_intraday_liquidity_forecasting_engine_compliance_policy](/tools/lookup-intraday-liquidity-forecasting-engine-compliance-policy.md)

Next: [Risk Limit & Liquidity Buffer Cross-Check](/workflow/risk-limit-liquidity-buffer-cross-check.md)
