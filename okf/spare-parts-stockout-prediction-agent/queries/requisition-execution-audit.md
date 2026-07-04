---
type: Query Capability
title: Execute action_ibm_maximo_recommend against IBM Maximo with a full audit trai...
description: "Execute action_ibm_maximo_recommend against IBM Maximo with a full audit trail for the approved requisition, and escalate any expedite or high-risk-vendor exceptions to the MRO Storeroom Manager."
source_id: "requisition-execution-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_ibm_maximo_recommend against IBM Maximo with a full audit trail for the approved requisition, and escalate any expedite or high-risk-vendor exceptions to the MRO Storeroom Manager.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

## Runs in

- [requisition_execution_audit](/workflow/requisition-execution-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spare-parts-stockout-prediction-agent-end-to-end.md)
- [Work order WO-4021873 (asset 118420, priority emergency) is awaiting_parts for a replacement bearing. SAP S/4HANA MM purchase order records show a PO tied to source_record_id 118420 marked 'paid' on 2026-06-02, but the Maximo work order remains awaiting_parts as of 2026-07-03. Reconcile whether the spare is actually on the shelf or the paid PO covered a different line item, and recommend the next storeroom action.](/tests/spare-parts-stockout-prediction-agent-conflicting-reservation.md)
- [Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) has zero on-hand quantity for its critical die-change bearing. The only vendor carrying that part has risk_score 'high' and annual_spend $1.2M; they quoted an expedite purchase order of $31,500 at a 3-day lead time versus $9,800 at the standard 21-day lead time. Recommend whether to place the expedite requisition.](/tests/spare-parts-stockout-prediction-agent-expedite-threshold.md)

# Citations

- [Spare Parts Stockout Prediction Agent Standard Operating Procedure](/documents/spare-parts-stockout-prediction-agent-sop.md)
- [Reorder Point and Safety Stock Policy](/documents/reorder-point-safety-stock-policy.md)
