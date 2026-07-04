---
type: Eval Scenario
title: Run the Employee Query Resolution workflow for the current period. Cite the r...
description: "Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "employee-query-resolution-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [context-retrieval](/queries/context-retrieval.md)

## Mechanisms to call

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_knowledge_base_knowledge_base_records](/tools/query-knowledge-base-knowledge-base-records.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)
- [action_google_chat_execute](/tools/action-google-chat-execute.md)

## Success rubric

Action execute executed against Google Chat, with audit-trail entry and Employee notified of outcomes.

# Citations

- [Employee Query Resolution Policy Handbook](/documents/employee-query-resolution-policy-handbook.md)
