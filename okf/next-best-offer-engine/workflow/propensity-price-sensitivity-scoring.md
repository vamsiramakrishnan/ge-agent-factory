---
type: Workflow Stage
title: "Propensity & Price-Sensitivity Scoring"
description: "Score each loyalty_id's category propensity and price elasticity by comparing analytics_events against BigQuery historical_metrics and cached_aggregates baselines, weighting recent store_shift_summaries seasonality."
source_id: propensity_price_sensitivity_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Propensity & Price-Sensitivity Scoring

Score each loyalty_id's category propensity and price elasticity by comparing analytics_events against BigQuery historical_metrics and cached_aggregates baselines, weighting recent store_shift_summaries seasonality.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)

Next: [Offer Selection Under Guardrails](/workflow/offer-selection-under-guardrails.md)
