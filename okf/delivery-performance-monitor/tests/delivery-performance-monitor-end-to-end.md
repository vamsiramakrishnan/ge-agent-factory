---
type: Eval Scenario
title: Run the Delivery Performance Monitor workflow for the current period. Cite th...
description: "Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "delivery-performance-monitor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [shipment-data-ingestion](/queries/shipment-data-ingestion.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_tms_tms_records](/tools/query-tms-tms-records.md)
- [query_asn_data_asn_data_records](/tools/query-asn-data-asn-data-records.md)
- [query_iot_gps_tracking_iot_gps_tracking_records](/tools/query-iot-gps-tracking-iot-gps-tracking-records.md)
- [lookup_delivery_performance_monitor_policy_guide](/tools/lookup-delivery-performance-monitor-policy-guide.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA MM, with audit-trail entry and Supplier Relationship Manager notified of outcomes.

# Citations

- [Delivery Performance Monitor Procurement Policy Guide](/documents/delivery-performance-monitor-policy-guide.md)
