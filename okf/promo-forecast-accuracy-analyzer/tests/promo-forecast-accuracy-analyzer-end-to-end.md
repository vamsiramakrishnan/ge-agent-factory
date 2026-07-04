---
type: Eval Scenario
title: Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cit...
description: "Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "promo-forecast-accuracy-analyzer-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [forecast-override-intake](/queries/forecast-override-intake.md)

## Mechanisms to call

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

## Success rubric

Action publish executed against Blue Yonder Demand Planning, with audit-trail entry and Promotions Manager notified of outcomes.

# Citations

- [Promo Forecast Accuracy Analyzer Retail Execution Playbook](/documents/promo-forecast-accuracy-analyzer-execution-playbook.md)
