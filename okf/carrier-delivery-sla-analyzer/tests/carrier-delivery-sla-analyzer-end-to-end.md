---
type: Eval Scenario
title: Run the Carrier Delivery SLA Analyzer workflow for the current period. Cite t...
description: "Run the Carrier Delivery SLA Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "carrier-delivery-sla-analyzer-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Carrier Delivery SLA Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)
- [action_manhattan_active_wm_recommend](/tools/action-manhattan-active-wm-recommend.md)

## Success rubric

Action recommend executed against Manhattan Active WM, with audit-trail entry and Transportation Manager notified of outcomes.

# Citations

- [Carrier Delivery SLA Analyzer Retail Execution Playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
