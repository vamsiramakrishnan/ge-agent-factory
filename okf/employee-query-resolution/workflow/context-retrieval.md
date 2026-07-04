---
type: Workflow Stage
title: Context Retrieval
description: "Pull relevant employee data from Workday (leave balances, pay stubs) and policy documents from Google Drive. Build personalized context for accurate resolution."
source_id: context_retrieval
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Retrieval

Pull relevant employee data from Workday (leave balances, pay stubs) and policy documents from Google Drive. Build personalized context for accurate resolution.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)
- [action_google_chat_execute](/tools/action-google-chat-execute.md)

Next: [Answer Generation](/workflow/answer-generation.md)
