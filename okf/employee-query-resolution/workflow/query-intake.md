---
type: Workflow Stage
title: Query Intake
description: "Receive employee query via chat, email, or portal. Classify intent and extract key entities (policy type, employee ID, date range) for contextual resolution."
source_id: query_intake
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Intake

Receive employee query via chat, email, or portal. Classify intent and extract key entities (policy type, employee ID, date range) for contextual resolution.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)
- [action_google_chat_execute](/tools/action-google-chat-execute.md)

Next: [Context Retrieval](/workflow/context-retrieval.md)
