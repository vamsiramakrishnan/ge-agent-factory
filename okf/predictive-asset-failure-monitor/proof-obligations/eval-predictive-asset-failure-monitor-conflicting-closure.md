---
type: Proof Obligation
title: "Golden eval obligation — Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenance_work_orders record WO-4021873 marked 'complete' as of yesterday for a bearing_wear failure_mode, but the last six hours of sensor_readings still show vibration_mm_s trending upward toward the alarm_high_limit. Reconcile these two records and tell me whether the asset is actually healthy."
description: golden eval proof obligation
source_id: "eval-predictive-asset-failure-monitor-conflicting-closure"
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

# Golden eval obligation — Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenance_work_orders record WO-4021873 marked 'complete' as of yesterday for a bearing_wear failure_mode, but the last six hours of sensor_readings still show vibration_mm_s trending upward toward the alarm_high_limit. Reconcile these two records and tell me whether the asset is actually healthy.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [predictive-asset-failure-monitor-conflicting-closure](/tests/predictive-asset-failure-monitor-conflicting-closure.md)


## Mechanisms

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)

## Entities that must be referenced

- sensor_readings
- maintenance_work_orders
- failure_codes

## Forbidden behaviors

- declaring the asset healthy solely because the linked work order status is 'complete'
- closing or suppressing the alert without a fresh sensor re-query

# Citations

- [predictive-asset-failure-monitor-sop](/documents/predictive-asset-failure-monitor-sop.md)
