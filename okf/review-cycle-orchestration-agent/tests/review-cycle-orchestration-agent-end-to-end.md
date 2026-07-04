---
type: Eval Scenario
title: Run the Review Cycle Orchestration Agent workflow for the current period. Cit...
description: "Run the Review Cycle Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "review-cycle-orchestration-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Review Cycle Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cycle-launch](/queries/cycle-launch.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_review_cycle_orchestration_agent_policy_handbook](/tools/lookup-review-cycle-orchestration-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Review Cycle Orchestration Agent Policy Handbook](/documents/review-cycle-orchestration-agent-policy-handbook.md)
