---
type: Eval Scenario
title: "Run the Leave & Accommodation Intake Agent workflow for the current period. C..."
description: "Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "leave-accommodation-intake-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [eligibility-pre-screening](/queries/eligibility-pre-screening.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [lookup_leave_accommodation_intake_agent_policy_handbook](/tools/lookup-leave-accommodation-intake-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Leave & Accommodation Intake Agent Policy Handbook](/documents/leave-accommodation-intake-agent-policy-handbook.md)
