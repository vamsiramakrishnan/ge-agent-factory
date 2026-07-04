---
type: Eval Scenario
title: "Run the Pre-boarding Orchestration Agent workflow for the current period. Cit..."
description: "Run the Pre-boarding Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "pre-boarding-orchestration-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Pre-boarding Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cross-functional-orchestration](/queries/cross-functional-orchestration.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_pre_boarding_orchestration_agent_policy_handbook](/tools/lookup-pre-boarding-orchestration-agent-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Success rubric

Action assign executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Pre-boarding Orchestration Agent Policy Handbook](/documents/pre-boarding-orchestration-agent-policy-handbook.md)
