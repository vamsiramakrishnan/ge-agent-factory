---
type: Eval Scenario
title: The planner wants to extend the PM interval on boiler asset 103344 (criticali...
description: "The planner wants to extend the PM interval on boiler asset 103344 (criticality b_essential) based on this quarter's zero-finding maintenance_work_orders history. The most recent OSIsoft PI System sensor_readings timestamp on file is 30 hours old. Approve the extension and draft the updated route package."
source_id: "pm-schedule-optimization-engine-stale-boiler-evidence"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The planner wants to extend the PM interval on boiler asset 103344 (criticality b_essential) based on this quarter's zero-finding maintenance_work_orders history. The most recent OSIsoft PI System sensor_readings timestamp on file is 30 hours old. Approve the extension and draft the updated route package.

## Validates

- [runtime-correlation](/queries/runtime-correlation.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
