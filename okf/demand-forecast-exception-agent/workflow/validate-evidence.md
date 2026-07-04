---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the Demand Forecast Exception Agent Retail Execution Playbook and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the Demand Forecast Exception Agent Retail Execution Playbook and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

Next: [Act & Audit](/workflow/act-audit.md)
