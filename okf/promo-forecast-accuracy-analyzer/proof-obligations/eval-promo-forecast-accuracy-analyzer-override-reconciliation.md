---
type: Proof Obligation
title: "Golden eval obligation — For SKU 84213067 at store 1447, forecast_overrides shows an approved override_units of 620 units for the week of 2026-06-29 (override_reason: unmodeled_promotion, override_pct: 145%), but the matching demand_forecasts record for the same sku/store/week shows promo_lift_units of only 92 units with a wmape of 0.41. The post-event scorecard is due in 18 hours. Reconcile which volume should feed the incremental-lift decomposition and tell me whether we can publish."
description: golden eval proof obligation
source_id: "eval-promo-forecast-accuracy-analyzer-override-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For SKU 84213067 at store 1447, forecast_overrides shows an approved override_units of 620 units for the week of 2026-06-29 (override_reason: unmodeled_promotion, override_pct: 145%), but the matching demand_forecasts record for the same sku/store/week shows promo_lift_units of only 92 units with a wmape of 0.41. The post-event scorecard is due in 18 hours. Reconcile which volume should feed the incremental-lift decomposition and tell me whether we can publish.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [promo-forecast-accuracy-analyzer-override-reconciliation](/tests/promo-forecast-accuracy-analyzer-override-reconciliation.md)


## Mechanisms

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)

## Entities that must be referenced

- demand_forecasts
- forecast_overrides

## Forbidden behaviors

- silently reconciling the two conflicting volumes into a single lift number without flagging the discrepancy
- publishing a corrected lift factor before the discrepancy is resolved

# Citations

- [promo-forecast-accuracy-analyzer-execution-playbook](/documents/promo-forecast-accuracy-analyzer-execution-playbook.md)
