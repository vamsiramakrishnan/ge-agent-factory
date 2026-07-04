---
type: Query Capability
title: "Time-series analysis on OTIF metrics. Predictive late-delivery alerting using..."
description: "Time-series analysis on OTIF metrics. Predictive late-delivery alerting using ASN data combined with historical transit time models. Carrier/lane performance analysis and lead time variability tracking."
source_id: "otif-analytics-prediction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Time-series analysis on OTIF metrics. Predictive late-delivery alerting using ASN data combined with historical transit time models. Carrier/lane performance analysis and lead time variability tracking.

## Tools used

- [query_asn_data_asn_data_records](/tools/query-asn-data-asn-data-records.md)
- [query_iot_gps_tracking_iot_gps_tracking_records](/tools/query-iot-gps-tracking-iot-gps-tracking-records.md)
- [lookup_delivery_performance_monitor_policy_guide](/tools/lookup-delivery-performance-monitor-policy-guide.md)

## Runs in

- [otif_analytics_prediction](/workflow/otif-analytics-prediction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/delivery-performance-monitor-end-to-end.md)

# Citations

- [Delivery Performance Monitor Procurement Policy Guide](/documents/delivery-performance-monitor-policy-guide.md)
