---
type: Workflow Stage
title: "KVI Move Detection & Elasticity Scoring"
description: "Flag key-value items via kvi_flag in elasticity_models, and score each detected competitor move using own_price_elasticity and cross_price_elasticity against historical_metrics and analytics_events in BigQuery."
source_id: kvi_move_detection_elasticity_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# KVI Move Detection & Elasticity Scoring

Flag key-value items via kvi_flag in elasticity_models, and score each detected competitor move using own_price_elasticity and cross_price_elasticity against historical_metrics and analytics_events in BigQuery.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)

Next: [Respond/Hold/Partial-Match Modeling](/workflow/respond-hold-partial-match-modeling.md)
