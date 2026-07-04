---
type: Eval Scenario
title: "For SKU 84213067 at store 1447, forecast_overrides shows an approved override..."
description: "For SKU 84213067 at store 1447, forecast_overrides shows an approved override_units of 620 units for the week of 2026-06-29 (override_reason: unmodeled_promotion, override_pct: 145%), but the matching demand_forecasts record for the same sku/store/week shows promo_lift_units of only 92 units with a wmape of 0.41. The post-event scorecard is due in 18 hours. Reconcile which volume should feed the incremental-lift decomposition and tell me whether we can publish."
source_id: "promo-forecast-accuracy-analyzer-override-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For SKU 84213067 at store 1447, forecast_overrides shows an approved override_units of 620 units for the week of 2026-06-29 (override_reason: unmodeled_promotion, override_pct: 145%), but the matching demand_forecasts record for the same sku/store/week shows promo_lift_units of only 92 units with a wmape of 0.41. The post-event scorecard is due in 18 hours. Reconcile which volume should feed the incremental-lift decomposition and tell me whether we can publish.

## Validates

- [forecast-override-intake](/queries/forecast-override-intake.md)

## Mechanisms to call

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Promo Forecast Accuracy Analyzer Retail Execution Playbook](/documents/promo-forecast-accuracy-analyzer-execution-playbook.md)
