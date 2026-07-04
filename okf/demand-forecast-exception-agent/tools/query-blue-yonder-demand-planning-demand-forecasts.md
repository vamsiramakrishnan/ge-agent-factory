---
type: Agent Tool
title: query_blue_yonder_demand_planning_demand_forecasts
description: Retrieve demand forecasts from Blue Yonder Demand Planning for the Demand Forecast Exception Agent workflow.
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

Retrieve demand forecasts from Blue Yonder Demand Planning for the Demand Forecast Exception Agent workflow.

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

- [nightly_exception_scan](/workflow/nightly-exception-scan.md)
- [override_recommendation_playbook_citation](/workflow/override-recommendation-playbook-citation.md)
- [publish_forecast_value_added_scoring](/workflow/publish-forecast-value-added-scoring.md)

## Evals

- [Run the Demand Forecast Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-forecast-exception-agent-end-to-end.md)
- [SKU 45213099 at store 1187 has a forecast_overrides request for the 2026-07-13 week: override_units of 640 against a statistical_baseline_units of 210 (override_pct roughly 205%), submitted with override_reason 'unmodeled_promotion'. The demand_forecasts row for that SKU-store-week has frozen_period_flag = true and wmape = 0.41. Should this override be auto-published tonight?](/tests/demand-forecast-exception-agent-frozen-period-override-edge.md)
- [The forecast_overrides row for SKU 78341122 at store 442, override_week 2026-07-06, shows approved_flag = true with override_units = 512 against statistical_baseline_units = 190 (override_reason: 'weather_event'). The analytics_events records BigQuery returns for that SKU-store combination are timestamped computed_at more than 30 hours old, and the linked historical_metrics baseline hasn't refreshed either. Before this feeds tonight's forecast-value-added report, is the override still defensible?](/tests/demand-forecast-exception-agent-stale-evidence-reconciliation.md)

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
