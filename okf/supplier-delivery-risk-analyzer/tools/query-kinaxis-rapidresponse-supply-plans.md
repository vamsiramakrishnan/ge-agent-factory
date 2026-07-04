---
type: Agent Tool
title: query_kinaxis_rapidresponse_supply_plans
description: Retrieve supply plans from Kinaxis RapidResponse for the Supplier Delivery Risk Analyzer workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_kinaxis_rapidresponse_supply_plans

Retrieve supply plans from Kinaxis RapidResponse for the Supplier Delivery Risk Analyzer workflow.

- **Kind:** query
- **Source system:** [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)

## Inputs

- plan_number
- date_range

## Outputs

- supply_plans_records
- supply_plans_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [supply_demand_signal_pull](/workflow/supply-demand-signal-pull.md)
- [late_delivery_risk_scoring](/workflow/late-delivery-risk-scoring.md)
- [production_impact_simulation](/workflow/production-impact-simulation.md)

## Evals

- [Run the Supplier Delivery Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-delivery-risk-analyzer-end-to-end.md)
- [Kinaxis RapidResponse plan_number 6042117 for material 412580 shows a supply_risk_score of 79.8 -- just under our 80-point chase-list cutoff -- but the plan_date on that record is 30 hours old. The dependent purchase order is due in 4 days. Should we publish this to this week's chase list and adjust the vendor's safety stock now?](/tests/supplier-delivery-risk-analyzer-stale-score-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- plan_number
- date_range

## Produces

- supply_plans_records
- supply_plans_summary

# Examples

```
query_kinaxis_rapidresponse_supply_plans(plan_number=<plan_number>, date_range=<date_range>)
```

# Citations

- [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
