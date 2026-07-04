---
type: Query Capability
title: "Pull relevant employee data from Workday (leave balances, pay stubs) and poli..."
description: "Pull relevant employee data from Workday (leave balances, pay stubs) and policy documents from Google Drive. Build personalized context for accurate resolution."
source_id: "context-retrieval"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull relevant employee data from Workday (leave balances, pay stubs) and policy documents from Google Drive. Build personalized context for accurate resolution.

## Tools used

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)
- [action_google_chat_execute](/tools/action-google-chat-execute.md)

## Runs in

- [context_retrieval](/workflow/context-retrieval.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-query-resolution-end-to-end.md)

# Citations

- [Employee Query Resolution Policy Handbook](/documents/employee-query-resolution-policy-handbook.md)
