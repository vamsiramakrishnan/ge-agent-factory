---
type: Eval Scenario
title: "Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is log..."
description: "Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual."
source_id: "pm-schedule-optimization-engine-vibration-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual.

## Validates

- [runtime-correlation](/queries/runtime-correlation.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
- [PM Interval Revision & OEM Warranty Compliance Policy](/documents/pm-interval-warranty-policy.md)
