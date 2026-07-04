---
type: Query Capability
title: "Receive employee query via chat, email, or portal. Classify intent and extrac..."
description: "Receive employee query via chat, email, or portal. Classify intent and extract key entities (policy type, employee ID, date range) for contextual resolution."
source_id: "query-intake"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive employee query via chat, email, or portal. Classify intent and extract key entities (policy type, employee ID, date range) for contextual resolution.

## Tools used

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)
- [action_google_chat_execute](/tools/action-google-chat-execute.md)

## Runs in

- [query_intake](/workflow/query-intake.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-query-resolution-end-to-end.md)

# Citations

- [Employee Query Resolution Policy Handbook](/documents/employee-query-resolution-policy-handbook.md)
