---
type: Eval Scenario
title: Run the Bad Actor Asset Analyzer workflow for the current period. Cite the re...
description: "Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "bad-actor-asset-analyzer-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [bad-actor-candidate-pull](/queries/bad-actor-candidate-pull.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)
- [action_ibm_maximo_publish](/tools/action-ibm-maximo-publish.md)

## Success rubric

Action publish executed against IBM Maximo, with audit-trail entry and Reliability Engineer notified of outcomes.

# Citations

- [Bad Actor Asset Analyzer Standard Operating Procedure](/documents/bad-actor-asset-analyzer-sop.md)
