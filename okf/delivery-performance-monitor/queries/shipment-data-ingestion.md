---
type: Query Capability
title: "Ingest ASN data from suppliers, track shipments via carrier APIs and IoT/GPS...."
description: "Ingest ASN data from suppliers, track shipments via carrier APIs and IoT/GPS. Compare actual transit against delivery schedules in SAP MM. Trigger exception alerts on deviations."
source_id: "shipment-data-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest ASN data from suppliers, track shipments via carrier APIs and IoT/GPS. Compare actual transit against delivery schedules in SAP MM. Trigger exception alerts on deviations.

## Tools used

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_asn_data_asn_data_records](/tools/query-asn-data-asn-data-records.md)
- [query_iot_gps_tracking_iot_gps_tracking_records](/tools/query-iot-gps-tracking-iot-gps-tracking-records.md)
- [lookup_delivery_performance_monitor_policy_guide](/tools/lookup-delivery-performance-monitor-policy-guide.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Runs in

- [shipment_data_ingestion](/workflow/shipment-data-ingestion.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/delivery-performance-monitor-end-to-end.md)

# Citations

- [Delivery Performance Monitor Procurement Policy Guide](/documents/delivery-performance-monitor-policy-guide.md)
