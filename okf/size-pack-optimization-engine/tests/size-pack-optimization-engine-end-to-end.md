---
type: Eval Scenario
title: "Run the Size & Pack Optimization Engine workflow for the current period. Cite..."
description: "Run the Size & Pack Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "size-pack-optimization-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Size & Pack Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_recommend](/tools/action-oracle-retail-mfcs-recommend.md)

## Success rubric

Action recommend executed against Oracle Retail MFCS, with audit-trail entry and Merchandise Planner notified of outcomes.

# Citations

- [Size & Pack Optimization Engine Retail Execution Playbook](/documents/size-pack-optimization-engine-execution-playbook.md)
