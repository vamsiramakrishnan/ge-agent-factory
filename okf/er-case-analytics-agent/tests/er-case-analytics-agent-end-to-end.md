---
type: Eval Scenario
title: Run the ER Case Analytics Agent workflow for the current period. Cite the rel...
description: "Run the ER Case Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "er-case-analytics-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ER Case Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [case-data-aggregation](/queries/case-data-aggregation.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_er_case_analytics_agent_policy_handbook](/tools/lookup-er-case-analytics-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Success rubric

Action recommend executed against ServiceNow, with audit-trail entry and ER Lead notified of outcomes.

# Citations

- [ER Case Analytics Agent Policy Handbook](/documents/er-case-analytics-agent-policy-handbook.md)
