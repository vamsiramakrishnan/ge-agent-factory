---
type: Agent Tool
title: query_kinaxis_rapidresponse_supply_plans
description: Retrieve supply plans from Kinaxis RapidResponse for the Material Shortage Early Warning Monitor workflow.
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

Retrieve supply plans from Kinaxis RapidResponse for the Material Shortage Early Warning Monitor workflow.

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

- [coverage_netting](/workflow/coverage-netting.md)
- [exception_scoring_prioritization](/workflow/exception-scoring-prioritization.md)

## Evals

- [Run the Material Shortage Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/material-shortage-early-warning-monitor-end-to-end.md)
- [Supply plan 6042117 for material_number 431208 is plan_status committed with planned_supply_qty 1,200 units landing 2026-07-18, but the linked purchase order (source_record_id 8891, vendor Meridian Fasteners Inc, amount $18,400) carries due_date 2026-08-02 -- after the line needs it. Scenario run 100482 dated 2026-07-01 also shows solver_status infeasible for this material at plant 1020. Reconcile the shortage and tell me what to do before tomorrow's build.](/tests/material-shortage-early-warning-monitor-conflicting-evidence-reconciliation.md)

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
