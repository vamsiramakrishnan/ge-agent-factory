---
type: Eval Scenario
title: Run the Headcount Planning Agent workflow for the current period. Cite the re...
description: "Run the Headcount Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "headcount-planning-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Headcount Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [hris-data-integration](/queries/hris-data-integration.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_headcount_planning_agent_controls_playbook](/tools/lookup-headcount-planning-agent-controls-playbook.md)
- [action_workday_sync](/tools/action-workday-sync.md)

## Success rubric

Action sync executed against Workday, with audit-trail entry and FP&A Director notified of outcomes.

# Citations

- [Headcount Planning Agent Controls Playbook](/documents/headcount-planning-agent-controls-playbook.md)
