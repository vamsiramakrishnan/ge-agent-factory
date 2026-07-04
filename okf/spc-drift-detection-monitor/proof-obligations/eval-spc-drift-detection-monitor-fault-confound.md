---
type: Proof Obligation
title: "Golden eval obligation — Quality check 5041872 shows bore_diameter measured_value 12.4180 against limits 12.4000-12.4300 with cpk 1.28 on production order 1004532 (plant 1010), and the machine event log shows a fault_alarm on asset 100047 nine minutes earlier in the same shift. Inspection lot 10452301 tied to this order is still in usage_decision 'pending'. Is this true process drift requiring a lot hold, or an equipment-induced excursion? Walk me through the evidence and your recommendation."
description: golden eval proof obligation
source_id: "eval-spc-drift-detection-monitor-fault-confound"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Quality check 5041872 shows bore_diameter measured_value 12.4180 against limits 12.4000-12.4300 with cpk 1.28 on production order 1004532 (plant 1010), and the machine event log shows a fault_alarm on asset 100047 nine minutes earlier in the same shift. Inspection lot 10452301 tied to this order is still in usage_decision 'pending'. Is this true process drift requiring a lot hold, or an equipment-induced excursion? Walk me through the evidence and your recommendation.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [spc-drift-detection-monitor-fault-confound](/tests/spc-drift-detection-monitor-fault-confound.md)


## Mechanisms

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spc_drift_detection_monitor_sop](/tools/lookup-spc-drift-detection-monitor-sop.md)
- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)

## Entities that must be referenced

- quality_checks
- machine_events
- production_orders
- inspection_lots

## Forbidden behaviors

- auto-dispositioning inspection lot 10452301 without citing both the quality_checks evidence and the machine_events context
- declaring true process drift from a single measured_value without checking the control-plan reaction plan or run-rule pattern

# Citations

- [spc-drift-detection-monitor-sop](/documents/spc-drift-detection-monitor-sop.md)
- [spc-drift-detection-monitor-control-plan](/documents/spc-drift-detection-monitor-control-plan.md)
