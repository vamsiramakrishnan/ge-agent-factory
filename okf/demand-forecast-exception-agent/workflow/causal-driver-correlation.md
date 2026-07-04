---
type: Workflow Stage
title: Causal Driver Correlation
description: "Cross-reference flagged SKU-store exceptions against analytics_events and historical_metrics in BigQuery to attach weather, promo, and social-signal context before severity scoring."
source_id: causal_driver_correlation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Causal Driver Correlation

Cross-reference flagged SKU-store exceptions against analytics_events and historical_metrics in BigQuery to attach weather, promo, and social-signal context before severity scoring.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)

Next: [Seasonal Profile Cross-Check](/workflow/seasonal-profile-cross-check.md)
