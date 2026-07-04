---
type: Eval Scenario
title: Run the Changeover Time Optimization Agent workflow for the current period. C...
description: "Run the Changeover Time Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "changeover-time-optimization-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Changeover Time Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [changeover-log-correlation](/queries/changeover-log-correlation.md)

## Mechanisms to call

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)
- [action_sap_s_4hana_pp_route](/tools/action-sap-s-4hana-pp-route.md)

## Success rubric

Action route executed against SAP S/4HANA PP, with audit-trail entry and Production Supervisor notified of outcomes.

# Citations

- [Changeover Time Optimization Agent Standard Operating Procedure](/documents/changeover-time-optimization-agent-sop.md)
