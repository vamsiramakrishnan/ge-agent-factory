---
type: Workflow Stage
title: "Bad-actor candidate pull"
description: "Query maintenance_work_orders, asset_registry_entries, and failure_codes from IBM Maximo and correlate against sensor_readings and downtime_events from OSIsoft PI System to build the candidate asset population for the period."
source_id: bad_actor_candidate_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Bad-actor candidate pull

Query maintenance_work_orders, asset_registry_entries, and failure_codes from IBM Maximo and correlate against sensor_readings and downtime_events from OSIsoft PI System to build the candidate asset population for the period.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)
- [action_ibm_maximo_publish](/tools/action-ibm-maximo-publish.md)

Next: [Composite index scoring](/workflow/composite-index-scoring.md)
