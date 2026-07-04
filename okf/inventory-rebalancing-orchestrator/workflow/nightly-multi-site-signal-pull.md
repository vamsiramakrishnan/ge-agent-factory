---
type: Workflow Stage
title: "Nightly Multi-Site Signal Pull"
description: "Pull supply_plans, demand_signals, and scenario_runs from Kinaxis RapidResponse across all plants (1010, 1020, 2040, 3100, external_vendor) via query_kinaxis_rapidresponse_supply_plans, query_kinaxis_rapidresponse_demand_signals, and query_kinaxis_rapidresponse_scenario_runs to establish tonight's baseline stock and demand picture."
source_id: nightly_multi_site_signal_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Multi-Site Signal Pull

Pull supply_plans, demand_signals, and scenario_runs from Kinaxis RapidResponse across all plants (1010, 1020, 2040, 3100, external_vendor) via query_kinaxis_rapidresponse_supply_plans, query_kinaxis_rapidresponse_demand_signals, and query_kinaxis_rapidresponse_scenario_runs to establish tonight's baseline stock and demand picture.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)

Next: [Surplus-Deficit Matching](/workflow/surplus-deficit-matching.md)
