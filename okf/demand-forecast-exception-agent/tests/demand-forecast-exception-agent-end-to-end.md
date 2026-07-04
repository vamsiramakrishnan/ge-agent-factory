---
type: Eval Scenario
title: Run the Demand Forecast Exception Agent workflow for the current period. Cite...
description: "Run the Demand Forecast Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "demand-forecast-exception-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Demand Forecast Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [analyze-detect](/queries/analyze-detect.md)

## Mechanisms to call

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

## Success rubric

Action publish executed against Blue Yonder Demand Planning, with audit-trail entry and Demand Planner notified of outcomes.

# Citations

- [Demand Forecast Exception Agent Retail Execution Playbook](/documents/demand-forecast-exception-agent-execution-playbook.md)
