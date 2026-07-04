---
type: Eval Scenario
title: Run the Change Communication Drafter workflow for the current period. Cite th...
description: "Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "change-communication-drafter-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cascade-delivery](/queries/cascade-delivery.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_change_communication_drafter_policy_handbook](/tools/lookup-change-communication-drafter-policy-handbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Success rubric

Action generate executed against Google Docs, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Change Communication Drafter Policy Handbook](/documents/change-communication-drafter-policy-handbook.md)
