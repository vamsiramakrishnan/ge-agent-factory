---
type: Eval Scenario
title: Run the OKR Progress Tracker Agent workflow for the current period. Cite the ...
description: "Run the OKR Progress Tracker Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "okr-progress-tracker-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the OKR Progress Tracker Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [progress-signal-collection](/queries/progress-signal-collection.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_okr_progress_tracker_agent_policy_handbook](/tools/lookup-okr-progress-tracker-agent-policy-handbook.md)

## Success rubric

Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [OKR Progress Tracker Agent Policy Handbook](/documents/okr-progress-tracker-agent-policy-handbook.md)
