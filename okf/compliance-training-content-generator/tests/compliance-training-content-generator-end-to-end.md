---
type: Eval Scenario
title: Run the Compliance Training Content Generator workflow for the current period...
description: "Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "compliance-training-content-generator-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [publishing-tracking](/queries/publishing-tracking.md)

## Mechanisms to call

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_compliance_training_content_generator_policy_handbook](/tools/lookup-compliance-training-content-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Success rubric

Action generate executed against LMS, with audit-trail entry and Compliance Officer notified of outcomes.

# Citations

- [Compliance Training Content Generator Policy Handbook](/documents/compliance-training-content-generator-policy-handbook.md)
