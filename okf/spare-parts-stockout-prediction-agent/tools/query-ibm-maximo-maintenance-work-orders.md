---
type: Agent Tool
title: query_ibm_maximo_maintenance_work_orders
description: Retrieve maintenance work orders from IBM Maximo for the Spare Parts Stockout Prediction Agent workflow.
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

# query_ibm_maximo_maintenance_work_orders

Retrieve maintenance work orders from IBM Maximo for the Spare Parts Stockout Prediction Agent workflow.

- **Kind:** query
- **Source system:** [IBM Maximo](/systems/ibm-maximo.md)

## Inputs

- work_order_number
- asset_number
- date_range

## Outputs

- maintenance_work_orders_records
- maintenance_work_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IBM Maximo](/systems/ibm-maximo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [demand_signal_aggregation](/workflow/demand-signal-aggregation.md)
- [coverage_lead_time_exposure_check](/workflow/coverage-lead-time-exposure-check.md)
- [requisition_execution_audit](/workflow/requisition-execution-audit.md)

## Evals

- [Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spare-parts-stockout-prediction-agent-end-to-end.md)
- [Work order WO-4021873 (asset 118420, priority emergency) is awaiting_parts for a replacement bearing. SAP S/4HANA MM purchase order records show a PO tied to source_record_id 118420 marked 'paid' on 2026-06-02, but the Maximo work order remains awaiting_parts as of 2026-07-03. Reconcile whether the spare is actually on the shelf or the paid PO covered a different line item, and recommend the next storeroom action.](/tests/spare-parts-stockout-prediction-agent-conflicting-reservation.md)
- [Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) has zero on-hand quantity for its critical die-change bearing. The only vendor carrying that part has risk_score 'high' and annual_spend $1.2M; they quoted an expedite purchase order of $31,500 at a 3-day lead time versus $9,800 at the standard 21-day lead time. Recommend whether to place the expedite requisition.](/tests/spare-parts-stockout-prediction-agent-expedite-threshold.md)

## Evidence emitted

- source_system_record

## Required inputs

- work_order_number
- asset_number
- date_range

## Produces

- maintenance_work_orders_records
- maintenance_work_orders_summary

# Examples

```
query_ibm_maximo_maintenance_work_orders(work_order_number=<work_order_number>, asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [IBM Maximo](/systems/ibm-maximo.md)
