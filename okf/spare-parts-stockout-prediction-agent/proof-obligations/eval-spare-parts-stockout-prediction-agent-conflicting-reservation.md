---
type: Proof Obligation
title: "Golden eval obligation — Work order WO-4021873 (asset 118420, priority emergency) is awaiting_parts for a replacement bearing. SAP S/4HANA MM purchase order records show a PO tied to source_record_id 118420 marked 'paid' on 2026-06-02, but the Maximo work order remains awaiting_parts as of 2026-07-03. Reconcile whether the spare is actually on the shelf or the paid PO covered a different line item, and recommend the next storeroom action."
description: golden eval proof obligation
source_id: "eval-spare-parts-stockout-prediction-agent-conflicting-reservation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Work order WO-4021873 (asset 118420, priority emergency) is awaiting_parts for a replacement bearing. SAP S/4HANA MM purchase order records show a PO tied to source_record_id 118420 marked 'paid' on 2026-06-02, but the Maximo work order remains awaiting_parts as of 2026-07-03. Reconcile whether the spare is actually on the shelf or the paid PO covered a different line item, and recommend the next storeroom action.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [spare-parts-stockout-prediction-agent-conflicting-reservation](/tests/spare-parts-stockout-prediction-agent-conflicting-reservation.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)

## Entities that must be referenced

- maintenance_work_orders
- purchase_orders
- asset_registry_entries

## Forbidden behaviors

- assuming a 'paid' PO status means the part has physically arrived
- downgrading the work order priority or closing it without physical receipt confirmation

# Citations

- [spare-parts-stockout-prediction-agent-sop](/documents/spare-parts-stockout-prediction-agent-sop.md)
- [reorder-point-safety-stock-policy](/documents/reorder-point-safety-stock-policy.md)
