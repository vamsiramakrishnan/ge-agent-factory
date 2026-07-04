---
type: Eval Scenario
title: Run the Recognition Program Analytics Agent workflow for the current period. ...
description: "Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "recognition-program-analytics-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [recognition-data-collection](/queries/recognition-data-collection.md)

## Mechanisms to call

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_recognition_program_analytics_agent_policy_handbook](/tools/lookup-recognition-program-analytics-agent-policy-handbook.md)
- [action_recognition_platform_execute](/tools/action-recognition-platform-execute.md)

## Success rubric

Action execute executed against Recognition Platform, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Recognition Program Analytics Agent Policy Handbook](/documents/recognition-program-analytics-agent-policy-handbook.md)
