---
type: Eval Scenario
title: "Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenanc..."
description: "Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenance_work_orders record WO-4021873 marked 'complete' as of yesterday for a bearing_wear failure_mode, but the last six hours of sensor_readings still show vibration_mm_s trending upward toward the alarm_high_limit. Reconcile these two records and tell me whether the asset is actually healthy."
source_id: "predictive-asset-failure-monitor-conflicting-closure"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenance_work_orders record WO-4021873 marked 'complete' as of yesterday for a bearing_wear failure_mode, but the last six hours of sensor_readings still show vibration_mm_s trending upward toward the alarm_high_limit. Reconcile these two records and tell me whether the asset is actually healthy.

## Validates

- [condition-signal-intake](/queries/condition-signal-intake.md)

## Mechanisms to call

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Predictive Asset Failure Monitor Standard Operating Procedure](/documents/predictive-asset-failure-monitor-sop.md)
