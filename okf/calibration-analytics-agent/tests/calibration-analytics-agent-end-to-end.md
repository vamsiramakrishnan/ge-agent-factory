---
type: Eval Scenario
title: Run the Calibration Analytics Agent workflow for the current period. Cite the...
description: "Run the Calibration Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "calibration-analytics-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Calibration Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [rating-data-assembly](/queries/rating-data-assembly.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_calibration_analytics_agent_policy_handbook](/tools/lookup-calibration-analytics-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Success rubric

Action recommend executed against Workday, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Calibration Analytics Agent Policy Handbook](/documents/calibration-analytics-agent-policy-handbook.md)
