---
type: Eval Scenario
title: Run the Employee Communication Drafter workflow for the current period. Cite ...
description: "Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "employee-communication-drafter-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-channel-distribution](/queries/multi-channel-distribution.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_intranet_intranet_records](/tools/query-intranet-intranet-records.md)
- [lookup_employee_communication_drafter_policy_handbook](/tools/lookup-employee-communication-drafter-policy-handbook.md)
- [action_google_docs_draft](/tools/action-google-docs-draft.md)

## Success rubric

Action draft executed against Google Docs, with audit-trail entry and Internal Comms notified of outcomes.

# Citations

- [Employee Communication Drafter Policy Handbook](/documents/employee-communication-drafter-policy-handbook.md)
