---
type: Eval Scenario
title: Run the Competitive Price Response Agent workflow for the current period. Cit...
description: "Run the Competitive Price Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "competitive-price-response-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Competitive Price Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [kvi-move-detection-elasticity-scoring](/queries/kvi-move-detection-elasticity-scoring.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)

## Success rubric

Action recommend executed against Revionics Price Optimization, with audit-trail entry and Pricing Manager notified of outcomes.

# Citations

- [Competitive Price Response Agent Retail Execution Playbook](/documents/competitive-price-response-agent-execution-playbook.md)
