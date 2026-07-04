---
type: Eval Scenario
title: Run the Onboarding Orchestration workflow for the current period. Cite the re...
description: "Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "onboarding-orchestration-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [task-orchestration](/queries/task-orchestration.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_onboarding_orchestration_policy_handbook](/tools/lookup-onboarding-orchestration-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Success rubric

Action assign executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Onboarding Orchestration Policy Handbook](/documents/onboarding-orchestration-policy-handbook.md)
