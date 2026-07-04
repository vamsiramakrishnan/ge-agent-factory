---
type: Proof Obligation
title: "Golden eval obligation — Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual."
description: golden eval proof obligation
source_id: "eval-pm-schedule-optimization-engine-vibration-conflict"
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

# Golden eval obligation — Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [pm-schedule-optimization-engine-vibration-conflict](/tests/pm-schedule-optimization-engine-vibration-conflict.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)

## Entities that must be referenced

- maintenance_work_orders
- sensor_readings
- asset_registry_entries

## Forbidden behaviors

- recommending the interval extension solely on maintenance_work_orders status without cross-checking sensor_readings
- silently extending the interval on a constraint asset without an escalation path

# Citations

- [pm-schedule-optimization-engine-sop](/documents/pm-schedule-optimization-engine-sop.md)
- [pm-interval-warranty-policy](/documents/pm-interval-warranty-policy.md)
