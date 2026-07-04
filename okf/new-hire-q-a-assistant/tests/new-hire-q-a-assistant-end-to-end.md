---
type: Eval Scenario
title: "Run the New Hire Q&A Assistant workflow for the current period. Cite the rele..."
description: "Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "new-hire-q-a-assistant-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [knowledge-indexing](/queries/knowledge-indexing.md)

## Mechanisms to call

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_new_hire_q_a_assistant_policy_handbook](/tools/lookup-new-hire-q-a-assistant-policy-handbook.md)

## Success rubric

New Hire receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [New Hire Q&A Assistant Policy Handbook](/documents/new-hire-q-a-assistant-policy-handbook.md)
