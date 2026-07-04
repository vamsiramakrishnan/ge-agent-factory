---
type: Eval Scenario
title: Run the PM Schedule Optimization Engine workflow for the current period. Cite...
description: "Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "pm-schedule-optimization-engine-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

## Success rubric

Action route executed against IBM Maximo, with audit-trail entry and Maintenance Planner notified of outcomes.

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
