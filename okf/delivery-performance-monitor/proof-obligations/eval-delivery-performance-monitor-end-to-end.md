---
type: Proof Obligation
title: "Golden eval obligation — Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-delivery-performance-monitor-end-to-end"
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

# Golden eval obligation — Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [delivery-performance-monitor-end-to-end](/tests/delivery-performance-monitor-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_tms_tms_records](/tools/query-tms-tms-records.md)
- [query_asn_data_asn_data_records](/tools/query-asn-data-asn-data-records.md)
- [query_iot_gps_tracking_iot_gps_tracking_records](/tools/query-iot-gps-tracking-iot-gps-tracking-records.md)
- [lookup_delivery_performance_monitor_policy_guide](/tools/lookup-delivery-performance-monitor-policy-guide.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Entities that must be referenced

- purchase_orders
- tms_records
- asn_data_records
- iot_gps_tracking_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [delivery-performance-monitor-policy-guide](/documents/delivery-performance-monitor-policy-guide.md)
