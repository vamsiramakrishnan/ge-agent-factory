---
type: Agent Tool
title: query_blue_yonder_demand_planning_forecast_overrides
description: Retrieve forecast overrides from Blue Yonder Demand Planning for the Promo Forecast Accuracy Analyzer workflow.
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

# query_blue_yonder_demand_planning_forecast_overrides

Retrieve forecast overrides from Blue Yonder Demand Planning for the Promo Forecast Accuracy Analyzer workflow.

- **Kind:** query
- **Source system:** [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)

## Inputs

- sku
- store_number
- date_range

## Outputs

- forecast_overrides_records

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

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- sku
- store_number
- date_range

## Produces

- forecast_overrides_records

# Examples

```
query_blue_yonder_demand_planning_forecast_overrides(sku=<sku>, store_number=<store_number>, date_range=<date_range>)
```

# Citations

- [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)
