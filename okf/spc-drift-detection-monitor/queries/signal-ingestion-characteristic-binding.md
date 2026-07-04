---
type: Query Capability
title: "Stream in-line quality_checks measurements and machine_events from Siemens Op..."
description: "Stream in-line quality_checks measurements and machine_events from Siemens Opcenter MES alongside inspection_lots from SAP S/4HANA QM, binding each measured_value to its characteristic, production_order, and spec limits via query_siemens_opcenter_mes_production_orders and query_sap_s_4hana_qm_inspection_lots."
source_id: "signal-ingestion-characteristic-binding"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Stream in-line quality_checks measurements and machine_events from Siemens Opcenter MES alongside inspection_lots from SAP S/4HANA QM, binding each measured_value to its characteristic, production_order, and spec limits via query_siemens_opcenter_mes_production_orders and query_sap_s_4hana_qm_inspection_lots.

## Tools used

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

## Runs in

- [signal_ingestion_characteristic_binding](/workflow/signal-ingestion-characteristic-binding.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spc-drift-detection-monitor-end-to-end.md)
- [Quality check 5041872 shows bore_diameter measured_value 12.4180 against limits 12.4000-12.4300 with cpk 1.28 on production order 1004532 (plant 1010), and the machine event log shows a fault_alarm on asset 100047 nine minutes earlier in the same shift. Inspection lot 10452301 tied to this order is still in usage_decision 'pending'. Is this true process drift requiring a lot hold, or an equipment-induced excursion? Walk me through the evidence and your recommendation.](/tests/spc-drift-detection-monitor-fault-confound.md)
- [The last quality_checks record for hardness_hrc on production order 1002210 (plant 2040) is timestamped 41 hours ago and shows cpk 1.31, just under the 1.33 minimum. No fresher check has been logged since the night shift change. Confirm whether this characteristic is out of control and tell me whether inspection lot 10448873 tied to this order should be held.](/tests/spc-drift-detection-monitor-stale-cpk-edge.md)

# Citations

- [SPC Drift Detection Monitor Standard Operating Procedure](/documents/spc-drift-detection-monitor-sop.md)
- [CTQ Characteristic Control Plan and Out-of-Control Reaction Plan](/documents/spc-drift-detection-monitor-control-plan.md)
