---
type: Eval Scenario
title: "Run the Goods Receipt & Service Entry Validator workflow for the current peri..."
description: "Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "goods-receipt-service-entry-validator-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [receipt-data-ingestion](/queries/receipt-data-ingestion.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_migo_purchase_orders](/tools/query-sap-s-4hana-mm-migo-purchase-orders.md)
- [query_wms_wms_records](/tools/query-wms-wms-records.md)
- [query_iot_rfid_iot_rfid_records](/tools/query-iot-rfid-iot-rfid-records.md)
- [lookup_goods_receipt_service_entry_validator_policy_guide](/tools/lookup-goods-receipt-service-entry-validator-policy-guide.md)
- [action_sap_s_4hana_mm_migo_trigger](/tools/action-sap-s-4hana-mm-migo-trigger.md)

## Success rubric

Action trigger executed against SAP S/4HANA MM (MIGO), with audit-trail entry and Buyer notified of outcomes.

# Citations

- [Goods Receipt & Service Entry Validator Procurement Policy Guide](/documents/goods-receipt-service-entry-validator-policy-guide.md)
