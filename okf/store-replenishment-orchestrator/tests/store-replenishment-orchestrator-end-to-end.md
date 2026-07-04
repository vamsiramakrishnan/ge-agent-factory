---
type: Eval Scenario
title: Run the Store Replenishment Orchestrator workflow for the current period. Cit...
description: "Run the Store Replenishment Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "store-replenishment-orchestrator-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Store Replenishment Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

## Success rubric

Action approve executed against Oracle Retail MFCS, with audit-trail entry and Allocation Analyst notified of outcomes.

# Citations

- [Store Replenishment Orchestrator Retail Execution Playbook](/documents/store-replenishment-orchestrator-execution-playbook.md)
