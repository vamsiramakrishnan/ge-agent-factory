---
type: Data Entity
title: scenario_runs
description: Data entity scenario_runs owned by Kinaxis RapidResponse.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# scenario_runs

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| run_number | number | required |
| scenario_type | enum | required; values: capacity_constraint, demand_surge, supplier_disruption, network_redesign, inventory_optimization |
| solver_status | enum | required; values: optimal, feasible, infeasible, timeout |
| service_level_pct | float | required |
| projected_inventory_value_usd | number | required |
| run_duration_seconds | number |  |
| baseline_run | boolean | required |
| run_date | date | required |
| planner_email | internet.email | required |

# Citations

- Owned by [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
