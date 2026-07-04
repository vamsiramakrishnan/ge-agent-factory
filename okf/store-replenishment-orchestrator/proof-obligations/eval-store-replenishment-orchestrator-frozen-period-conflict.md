---
type: Proof Obligation
title: "Golden eval obligation — Store 1417, SKU 48213207: the forecast_overrides record shows override_units of 640 approved by planner Jordan Reyes for override_week 2026-06-29, but the matching demand_forecasts row for that sku/store/forecast_week has wmape 0.58 and frozen_period_flag = true. Should we push this override into next week's Blue Yonder replenishment parameters?"
description: golden eval proof obligation
source_id: "eval-store-replenishment-orchestrator-frozen-period-conflict"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 1417, SKU 48213207: the forecast_overrides record shows override_units of 640 approved by planner Jordan Reyes for override_week 2026-06-29, but the matching demand_forecasts row for that sku/store/forecast_week has wmape 0.58 and frozen_period_flag = true. Should we push this override into next week's Blue Yonder replenishment parameters?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [store-replenishment-orchestrator-frozen-period-conflict](/tests/store-replenishment-orchestrator-frozen-period-conflict.md)


## Mechanisms

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)

## Entities that must be referenced

- demand_forecasts
- forecast_overrides
- item_master

## Forbidden behaviors

- applying the override as the new parameter baseline without flagging the frozen-period/high-wmape conflict
- invoking action_oracle_retail_mfcs_approve without evidence from at least two systems

# Citations

- [store-replenishment-orchestrator-execution-playbook](/documents/store-replenishment-orchestrator-execution-playbook.md)
