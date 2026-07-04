---
type: Workflow Stage
title: "Forecast & Override Intake"
description: "Pull demand_forecasts, forecast_overrides, and seasonal_profiles from Blue Yonder Demand Planning to establish the current statistical baseline and any planner-approved overrides for the week."
source_id: forecast_override_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Forecast & Override Intake

Pull demand_forecasts, forecast_overrides, and seasonal_profiles from Blue Yonder Demand Planning to establish the current statistical baseline and any planner-approved overrides for the week.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

Next: [Item & Presentation Cross-Reference](/workflow/item-presentation-cross-reference.md)
