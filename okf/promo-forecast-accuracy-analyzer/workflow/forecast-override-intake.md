---
type: Workflow Stage
title: "Forecast & Override Intake"
description: "Pull demand_forecasts and forecast_overrides from Blue Yonder Demand Planning for the promoted sku/store weeks, checking seasonal_profiles seasonal_index and flagging any frozen_period_flag or approved_flag mismatches before decomposition begins."
source_id: forecast_override_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Forecast & Override Intake

Pull demand_forecasts and forecast_overrides from Blue Yonder Demand Planning for the promoted sku/store weeks, checking seasonal_profiles seasonal_index and flagging any frozen_period_flag or approved_flag mismatches before decomposition begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

Next: [Lift Decomposition & Cannibalization Check](/workflow/lift-decomposition-cannibalization-check.md)
