---
type: Eval Scenario
title: Run the Predictive Asset Failure Monitor workflow for the current period. Cit...
description: "Run the Predictive Asset Failure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "predictive-asset-failure-monitor-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Predictive Asset Failure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

## Success rubric

Action recommend executed against IBM Maximo, with audit-trail entry and Reliability Engineer notified of outcomes.

# Citations

- [Predictive Asset Failure Monitor Standard Operating Procedure](/documents/predictive-asset-failure-monitor-sop.md)
