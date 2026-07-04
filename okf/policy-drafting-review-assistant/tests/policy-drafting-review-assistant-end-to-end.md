---
type: Eval Scenario
title: "Run the Policy Drafting & Review Assistant workflow for the current period. C..."
description: "Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "policy-drafting-review-assistant-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [publishing-version-control](/queries/publishing-version-control.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [query_sharepoint_documents](/tools/query-sharepoint-documents.md)
- [lookup_policy_drafting_review_assistant_policy_handbook](/tools/lookup-policy-drafting-review-assistant-policy-handbook.md)
- [action_google_docs_publish](/tools/action-google-docs-publish.md)

## Success rubric

Action publish executed against Google Docs, with audit-trail entry and ER Lead notified of outcomes.

# Citations

- [Policy Drafting & Review Assistant Policy Handbook](/documents/policy-drafting-review-assistant-policy-handbook.md)
