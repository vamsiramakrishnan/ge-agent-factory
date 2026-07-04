---
type: Agent Tool
title: query_blue_yonder_demand_planning_demand_forecasts
description: Retrieve demand forecasts from Blue Yonder Demand Planning for the Promo Forecast Accuracy Analyzer workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_blue_yonder_demand_planning_demand_forecasts

Retrieve demand forecasts from Blue Yonder Demand Planning for the Promo Forecast Accuracy Analyzer workflow.

- **Kind:** query
- **Source system:** [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)

## Inputs

- sku
- store_number
- date_range

## Outputs

- demand_forecasts_records
- demand_forecasts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [forecast_override_intake](/workflow/forecast-override-intake.md)
- [publish_escalate](/workflow/publish-escalate.md)

## Evals

- [Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/promo-forecast-accuracy-analyzer-end-to-end.md)
- [For SKU 84213067 at store 1447, forecast_overrides shows an approved override_units of 620 units for the week of 2026-06-29 (override_reason: unmodeled_promotion, override_pct: 145%), but the matching demand_forecasts record for the same sku/store/week shows promo_lift_units of only 92 units with a wmape of 0.41. The post-event scorecard is due in 18 hours. Reconcile which volume should feed the incremental-lift decomposition and tell me whether we can publish.](/tests/promo-forecast-accuracy-analyzer-override-reconciliation.md)

## Evidence emitted

- sql_result

## Required inputs

- sku
- store_number
- date_range

## Produces

- demand_forecasts_records
- demand_forecasts_summary

# Examples

```
query_blue_yonder_demand_planning_demand_forecasts(sku=<sku>, store_number=<store_number>, date_range=<date_range>)
```

# Citations

- [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)
