---
type: Eval Scenario
title: Run the Production Schedule Adherence Monitor workflow for the current period...
description: "Run the Production Schedule Adherence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "production-schedule-adherence-monitor-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Production Schedule Adherence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_production_schedule_adherence_monitor_sop](/tools/lookup-production-schedule-adherence-monitor-sop.md)
- [action_sap_s_4hana_pp_publish](/tools/action-sap-s-4hana-pp-publish.md)

## Success rubric

Action publish executed against SAP S/4HANA PP, with audit-trail entry and Production Scheduler notified of outcomes.

# Citations

- [Production Schedule Adherence Monitor Standard Operating Procedure](/documents/production-schedule-adherence-monitor-sop.md)
