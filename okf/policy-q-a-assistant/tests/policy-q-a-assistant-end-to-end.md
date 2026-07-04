---
type: Eval Scenario
title: "Run the Policy Q&A Assistant workflow for the current period. Cite the releva..."
description: "Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "policy-q-a-assistant-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [policy-retrieval](/queries/policy-retrieval.md)

## Mechanisms to call

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_sharepoint_documents](/tools/query-sharepoint-documents.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_policy_q_a_assistant_policy_handbook](/tools/lookup-policy-q-a-assistant-policy-handbook.md)

## Success rubric

Employee receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Policy Q&A Assistant Policy Handbook](/documents/policy-q-a-assistant-policy-handbook.md)
