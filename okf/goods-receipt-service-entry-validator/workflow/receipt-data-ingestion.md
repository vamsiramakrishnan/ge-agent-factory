---
type: Workflow Stage
title: Receipt Data Ingestion
description: Receive goods receipt data from warehouse MIGO posting or IoT/RFID sensors at the dock. Correlate physical count data with delivery documentation.
source_id: receipt_data_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receipt Data Ingestion

Receive goods receipt data from warehouse MIGO posting or IoT/RFID sensors at the dock. Correlate physical count data with delivery documentation.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_mm_migo_purchase_orders](/tools/query-sap-s-4hana-mm-migo-purchase-orders.md)
- [query_iot_rfid_iot_rfid_records](/tools/query-iot-rfid-iot-rfid-records.md)
- [lookup_goods_receipt_service_entry_validator_policy_guide](/tools/lookup-goods-receipt-service-entry-validator-policy-guide.md)
- [action_sap_s_4hana_mm_migo_trigger](/tools/action-sap-s-4hana-mm-migo-trigger.md)

Next: [Service Entry Validation](/workflow/service-entry-validation.md)
