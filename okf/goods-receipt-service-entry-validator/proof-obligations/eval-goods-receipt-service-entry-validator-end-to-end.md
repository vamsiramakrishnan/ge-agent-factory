---
type: Proof Obligation
title: "Golden eval obligation — Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-goods-receipt-service-entry-validator-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [goods-receipt-service-entry-validator-end-to-end](/tests/goods-receipt-service-entry-validator-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_migo_purchase_orders](/tools/query-sap-s-4hana-mm-migo-purchase-orders.md)
- [query_wms_wms_records](/tools/query-wms-wms-records.md)
- [query_iot_rfid_iot_rfid_records](/tools/query-iot-rfid-iot-rfid-records.md)
- [lookup_goods_receipt_service_entry_validator_policy_guide](/tools/lookup-goods-receipt-service-entry-validator-policy-guide.md)
- [action_sap_s_4hana_mm_migo_trigger](/tools/action-sap-s-4hana-mm-migo-trigger.md)

## Entities that must be referenced

- purchase_orders
- wms_records
- iot_rfid_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute trigger without two-system evidence

# Citations

- [goods-receipt-service-entry-validator-policy-guide](/documents/goods-receipt-service-entry-validator-policy-guide.md)
