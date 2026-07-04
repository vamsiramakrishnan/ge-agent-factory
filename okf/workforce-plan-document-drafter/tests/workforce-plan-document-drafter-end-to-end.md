---
type: Eval Scenario
title: Run the Workforce Plan Document Drafter workflow for the current period. Cite...
description: "Run the Workforce Plan Document Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "workforce-plan-document-drafter-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Workforce Plan Document Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [document-delivery](/queries/document-delivery.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_workforce_plan_document_drafter_policy_handbook](/tools/lookup-workforce-plan-document-drafter-policy-handbook.md)
- [action_google_docs_recommend](/tools/action-google-docs-recommend.md)

## Success rubric

Action recommend executed against Google Docs, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Workforce Plan Document Drafter Policy Handbook](/documents/workforce-plan-document-drafter-policy-handbook.md)
