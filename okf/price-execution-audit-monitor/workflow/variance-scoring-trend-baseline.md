---
type: Workflow Stage
title: "Variance Scoring & Trend Baseline"
description: "Score detected mismatches against analytics_events, historical_metrics, and cached_aggregates in BigQuery to separate one-off register errors from systemic price-zone feed failures and rank the Pricing Operations Manager's queue."
source_id: variance_scoring_trend_baseline
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Variance Scoring & Trend Baseline

Score detected mismatches against analytics_events, historical_metrics, and cached_aggregates in BigQuery to separate one-off register errors from systemic price-zone feed failures and rank the Pricing Operations Manager's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

Next: [Guardrail & Playbook Validation](/workflow/guardrail-playbook-validation.md)
