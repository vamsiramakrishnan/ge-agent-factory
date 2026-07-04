---
type: Workflow Stage
title: Nightly Exception Scan
description: "Query demand_forecasts and forecast_overrides from Blue Yonder Demand Planning for the week's item-location rows, flagging any where wmape or bias_pct breaches tolerance, gated by frozen_period_flag."
source_id: nightly_exception_scan
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Exception Scan

Query demand_forecasts and forecast_overrides from Blue Yonder Demand Planning for the week's item-location rows, flagging any where wmape or bias_pct breaches tolerance, gated by frozen_period_flag.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

Next: [Causal Driver Correlation](/workflow/causal-driver-correlation.md)
