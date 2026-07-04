---
type: Proof Obligation
title: "Golden eval obligation — Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-pm-schedule-optimization-engine-end-to-end"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [pm-schedule-optimization-engine-end-to-end](/tests/pm-schedule-optimization-engine-end-to-end.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

## Entities that must be referenced

- maintenance_work_orders
- sensor_readings
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [pm-schedule-optimization-engine-sop](/documents/pm-schedule-optimization-engine-sop.md)
