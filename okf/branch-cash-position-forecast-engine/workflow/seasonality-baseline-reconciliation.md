---
type: Workflow Stage
title: "Seasonality & Baseline Reconciliation"
description: "Compare the current period's signal against BigQuery historical_metrics and cached_aggregates (query_bigquery_historical_metrics, query_bigquery_cached_aggregates) to check analytics_events variance_pct against seasonal norms and rule out stale or reporting-lag baselines before sizing next-day vault demand."
source_id: seasonality_baseline_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Seasonality & Baseline Reconciliation

Compare the current period's signal against BigQuery historical_metrics and cached_aggregates (query_bigquery_historical_metrics, query_bigquery_cached_aggregates) to check analytics_events variance_pct against seasonal norms and rule out stale or reporting-lag baselines before sizing next-day vault demand.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)

Next: [Vault Threshold & Shipment Sizing](/workflow/vault-threshold-shipment-sizing.md)
