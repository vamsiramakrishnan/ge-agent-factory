---
type: Query Capability
title: Receive goods receipt data from warehouse MIGO posting or IoT/RFID sensors at...
description: Receive goods receipt data from warehouse MIGO posting or IoT/RFID sensors at the dock. Correlate physical count data with delivery documentation.
source_id: "receipt-data-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive goods receipt data from warehouse MIGO posting or IoT/RFID sensors at the dock. Correlate physical count data with delivery documentation.

## Tools used

- [query_sap_s_4hana_mm_migo_purchase_orders](/tools/query-sap-s-4hana-mm-migo-purchase-orders.md)
- [query_iot_rfid_iot_rfid_records](/tools/query-iot-rfid-iot-rfid-records.md)
- [lookup_goods_receipt_service_entry_validator_policy_guide](/tools/lookup-goods-receipt-service-entry-validator-policy-guide.md)
- [action_sap_s_4hana_mm_migo_trigger](/tools/action-sap-s-4hana-mm-migo-trigger.md)

## Runs in

- [receipt_data_ingestion](/workflow/receipt-data-ingestion.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/goods-receipt-service-entry-validator-end-to-end.md)

# Citations

- [Goods Receipt & Service Entry Validator Procurement Policy Guide](/documents/goods-receipt-service-entry-validator-policy-guide.md)
