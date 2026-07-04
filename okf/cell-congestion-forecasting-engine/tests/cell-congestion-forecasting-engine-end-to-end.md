---
type: Eval Scenario
title: Run the Cell Congestion Forecasting Engine workflow for the current period. C...
description: "Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cell-congestion-forecasting-engine-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)
- [action_ericsson_network_manager_publish](/tools/action-ericsson-network-manager-publish.md)

## Success rubric

Action publish executed against Ericsson Network Manager, with audit-trail entry and Capacity Planner notified of outcomes.

# Citations

- [Cell Congestion Forecasting Engine Service Assurance Runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
