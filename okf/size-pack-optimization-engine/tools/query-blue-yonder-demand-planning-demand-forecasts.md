---
type: Agent Tool
title: query_blue_yonder_demand_planning_demand_forecasts
description: "Retrieve demand forecasts from Blue Yonder Demand Planning for the Size & Pack Optimization Engine workflow."
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

Retrieve demand forecasts from Blue Yonder Demand Planning for the Size & Pack Optimization Engine workflow.

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

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Size & Pack Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/size-pack-optimization-engine-end-to-end.md)

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
