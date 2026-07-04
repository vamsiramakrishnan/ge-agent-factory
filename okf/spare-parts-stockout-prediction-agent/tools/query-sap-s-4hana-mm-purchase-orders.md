---
type: Agent Tool
title: query_sap_s_4hana_mm_purchase_orders
description: Retrieve purchase orders from SAP S/4HANA MM for the Spare Parts Stockout Prediction Agent workflow.
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

# query_sap_s_4hana_mm_purchase_orders

Retrieve purchase orders from SAP S/4HANA MM for the Spare Parts Stockout Prediction Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)

## Inputs

- lookup_key
- date_range

## Outputs

- purchase_orders_records
- purchase_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [demand_signal_aggregation](/workflow/demand-signal-aggregation.md)
- [coverage_lead_time_exposure_check](/workflow/coverage-lead-time-exposure-check.md)
- [reorder_policy_requisition_drafting](/workflow/reorder-policy-requisition-drafting.md)

## Evals

- [Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spare-parts-stockout-prediction-agent-end-to-end.md)
- [Work order WO-4021873 (asset 118420, priority emergency) is awaiting_parts for a replacement bearing. SAP S/4HANA MM purchase order records show a PO tied to source_record_id 118420 marked 'paid' on 2026-06-02, but the Maximo work order remains awaiting_parts as of 2026-07-03. Reconcile whether the spare is actually on the shelf or the paid PO covered a different line item, and recommend the next storeroom action.](/tests/spare-parts-stockout-prediction-agent-conflicting-reservation.md)
- [Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) has zero on-hand quantity for its critical die-change bearing. The only vendor carrying that part has risk_score 'high' and annual_spend $1.2M; they quoted an expedite purchase order of $31,500 at a 3-day lead time versus $9,800 at the standard 21-day lead time. Recommend whether to place the expedite requisition.](/tests/spare-parts-stockout-prediction-agent-expedite-threshold.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- purchase_orders_records
- purchase_orders_summary

# Examples

```
query_sap_s_4hana_mm_purchase_orders(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)
