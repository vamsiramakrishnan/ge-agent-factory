---
type: Query Capability
title: "Cross-reference on-hand and on-order quantities in SAP S/4HANA MM purchase_or..."
description: "Cross-reference on-hand and on-order quantities in SAP S/4HANA MM purchase_orders against vendor lead times in vendors records (query_sap_s_4hana_mm_purchase_orders) to identify SKUs whose coverage window has closed."
source_id: "coverage-lead-time-exposure-check"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference on-hand and on-order quantities in SAP S/4HANA MM purchase_orders against vendor lead times in vendors records (query_sap_s_4hana_mm_purchase_orders) to identify SKUs whose coverage window has closed.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)

## Runs in

- [coverage_lead_time_exposure_check](/workflow/coverage-lead-time-exposure-check.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spare-parts-stockout-prediction-agent-end-to-end.md)
- [Work order WO-4021873 (asset 118420, priority emergency) is awaiting_parts for a replacement bearing. SAP S/4HANA MM purchase order records show a PO tied to source_record_id 118420 marked 'paid' on 2026-06-02, but the Maximo work order remains awaiting_parts as of 2026-07-03. Reconcile whether the spare is actually on the shelf or the paid PO covered a different line item, and recommend the next storeroom action.](/tests/spare-parts-stockout-prediction-agent-conflicting-reservation.md)
- [Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) has zero on-hand quantity for its critical die-change bearing. The only vendor carrying that part has risk_score 'high' and annual_spend $1.2M; they quoted an expedite purchase order of $31,500 at a 3-day lead time versus $9,800 at the standard 21-day lead time. Recommend whether to place the expedite requisition.](/tests/spare-parts-stockout-prediction-agent-expedite-threshold.md)

# Citations

- [Spare Parts Stockout Prediction Agent Standard Operating Procedure](/documents/spare-parts-stockout-prediction-agent-sop.md)
- [Reorder Point and Safety Stock Policy](/documents/reorder-point-safety-stock-policy.md)
