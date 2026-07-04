---
type: Proof Obligation
title: "Golden eval obligation — Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-promo-forecast-accuracy-analyzer-end-to-end"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [promo-forecast-accuracy-analyzer-end-to-end](/tests/promo-forecast-accuracy-analyzer-end-to-end.md)


## Mechanisms

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

## Entities that must be referenced

- demand_forecasts
- price_recommendations
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [promo-forecast-accuracy-analyzer-execution-playbook](/documents/promo-forecast-accuracy-analyzer-execution-playbook.md)
