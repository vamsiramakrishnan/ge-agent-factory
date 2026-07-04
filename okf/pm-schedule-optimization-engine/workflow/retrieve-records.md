---
type: Workflow Stage
title: Retrieve Records
description: Query maintenance work orders and asset registry entries from IBM Maximo and correlate with OSIsoft PI System for the PM Schedule Optimization Engine workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query maintenance work orders and asset registry entries from IBM Maximo and correlate with OSIsoft PI System for the PM Schedule Optimization Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
