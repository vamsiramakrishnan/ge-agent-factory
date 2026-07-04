---
type: Workflow Stage
title: "Scenario Intake & Assumption Framing"
description: "Capture the what-if trigger (demand-shift, capacity-loss, or supplier-disruption) raised in the S&OP meeting and pull the relevant demand_signals and supply_plans rows from Kinaxis RapidResponse via query_kinaxis_rapidresponse_supply_plans to scope which material_number and customer_name records are in play."
source_id: scenario_intake_assumption_framing
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Scenario Intake & Assumption Framing

Capture the what-if trigger (demand-shift, capacity-loss, or supplier-disruption) raised in the S&OP meeting and pull the relevant demand_signals and supply_plans rows from Kinaxis RapidResponse via query_kinaxis_rapidresponse_supply_plans to scope which material_number and customer_name records are in play.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)
- [action_kinaxis_rapidresponse_publish](/tools/action-kinaxis-rapidresponse-publish.md)

Next: [Scenario Execution in RapidResponse](/workflow/scenario-execution-in-rapid-response.md)
