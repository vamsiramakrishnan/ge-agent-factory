---
type: Workflow Stage
title: "Override Recommendation & Playbook Citation"
description: Draft an override_units recommendation with confidence bounds and cite the governing sections of the Demand Forecast Exception Agent Retail Execution Playbook via lookup_demand_forecast_exception_agent_execution_playbook before surfacing to the Demand Planner.
source_id: override_recommendation_playbook_citation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Override Recommendation & Playbook Citation

Draft an override_units recommendation with confidence bounds and cite the governing sections of the Demand Forecast Exception Agent Retail Execution Playbook via lookup_demand_forecast_exception_agent_execution_playbook before surfacing to the Demand Planner.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

Next: [Publish & Forecast-Value-Added Scoring](/workflow/publish-forecast-value-added-scoring.md)
