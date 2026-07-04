---
type: Eval Scenario
title: "Scenario run #104521 (supplier_disruption, single-source ceramic-substrate ve..."
description: "Scenario run #104521 (supplier_disruption, single-source ceramic-substrate vendor) came back solver_status=infeasible, but run #104522 for the same disruption -- filed four hours later -- shows optimal with service_level_pct at 94.2% and a $6.2M higher projected_inventory_value_usd. Materials wants the optimal number in Thursday's executive S&OP deck. Reconcile which run is defensible before we publish."
source_id: "demand-supply-gap-scenario-engine-conflicting-solver-status"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Scenario run #104521 (supplier_disruption, single-source ceramic-substrate vendor) came back solver_status=infeasible, but run #104522 for the same disruption -- filed four hours later -- shows optimal with service_level_pct at 94.2% and a $6.2M higher projected_inventory_value_usd. Materials wants the optimal number in Thursday's executive S&OP deck. Reconcile which run is defensible before we publish.

## Validates

- [scenario-execution-in-rapid-response](/queries/scenario-execution-in-rapid-response.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Demand-Supply Gap Scenario Engine Standard Operating Procedure](/documents/demand-supply-gap-scenario-engine-sop.md)
- [Customer Service-Level Commitment & ATP/CTP Rate Schedule](/documents/s-op-service-level-rate-schedule.md)
