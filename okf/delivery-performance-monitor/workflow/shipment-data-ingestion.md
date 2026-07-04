---
type: Workflow Stage
title: Shipment Data Ingestion
description: "Ingest ASN data from suppliers, track shipments via carrier APIs and IoT/GPS. Compare actual transit against delivery schedules in SAP MM. Trigger exception alerts on deviations."
source_id: shipment_data_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Shipment Data Ingestion

Ingest ASN data from suppliers, track shipments via carrier APIs and IoT/GPS. Compare actual transit against delivery schedules in SAP MM. Trigger exception alerts on deviations.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_asn_data_asn_data_records](/tools/query-asn-data-asn-data-records.md)
- [query_iot_gps_tracking_iot_gps_tracking_records](/tools/query-iot-gps-tracking-iot-gps-tracking-records.md)
- [lookup_delivery_performance_monitor_policy_guide](/tools/lookup-delivery-performance-monitor-policy-guide.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

Next: [OTIF Analytics & Prediction](/workflow/otif-analytics-prediction.md)
