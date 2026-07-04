---
type: Workflow Stage
title: "Publish & Forecast-Value-Added Scoring"
description: "Execute action_blue_yonder_demand_planning_publish for approved forecast_overrides with a full audit trail, then score every published override against statistical_baseline_units on Looker dashboards."
source_id: publish_forecast_value_added_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Forecast-Value-Added Scoring

Execute action_blue_yonder_demand_planning_publish for approved forecast_overrides with a full audit trail, then score every published override against statistical_baseline_units on Looker dashboards.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)
