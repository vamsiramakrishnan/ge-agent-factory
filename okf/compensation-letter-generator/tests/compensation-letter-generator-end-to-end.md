---
type: Eval Scenario
title: Run the Compensation Letter Generator workflow for the current period. Cite t...
description: "Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "compensation-letter-generator-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [compensation-data-pull](/queries/compensation-data-pull.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_compensation_letter_generator_policy_handbook](/tools/lookup-compensation-letter-generator-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Success rubric

Action generate executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Compensation Letter Generator Policy Handbook](/documents/compensation-letter-generator-policy-handbook.md)
