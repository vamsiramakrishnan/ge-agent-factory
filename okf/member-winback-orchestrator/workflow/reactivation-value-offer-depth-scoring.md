---
type: Workflow Stage
title: "Reactivation Value & Offer-Depth Scoring"
description: "Score each lapsed loyalty_id's predicted reactivation value against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) and test offer depth per inferred lapse reason to converge on the minimal viable incentive."
source_id: reactivation_value_offer_depth_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reactivation Value & Offer-Depth Scoring

Score each lapsed loyalty_id's predicted reactivation value against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) and test offer depth per inferred lapse reason to converge on the minimal viable incentive.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Playbook & Loyalty-Terms Guardrail Gating](/workflow/playbook-loyalty-terms-guardrail-gating.md)
