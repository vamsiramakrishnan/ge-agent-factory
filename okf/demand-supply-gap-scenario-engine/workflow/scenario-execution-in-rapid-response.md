---
type: Workflow Stage
title: Scenario Execution in RapidResponse
description: "Runs the scenario_runs simulation in Kinaxis RapidResponse across scenario_type variants (capacity_constraint, demand_surge, supplier_disruption, network_redesign, inventory_optimization), tracks solver_status (optimal/feasible/infeasible/timeout), and lands service_level_pct and projected_inventory_value_usd outputs in BigQuery for comparison."
source_id: scenario_execution_in_rapid_response
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Scenario Execution in RapidResponse

Runs the scenario_runs simulation in Kinaxis RapidResponse across scenario_type variants (capacity_constraint, demand_surge, supplier_disruption, network_redesign, inventory_optimization), tracks solver_status (optimal/feasible/infeasible/timeout), and lands service_level_pct and projected_inventory_value_usd outputs in BigQuery for comparison.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)
- [action_kinaxis_rapidresponse_publish](/tools/action-kinaxis-rapidresponse-publish.md)

Next: [Gap Attribution & Financial Translation](/workflow/gap-attribution-financial-translation.md)
