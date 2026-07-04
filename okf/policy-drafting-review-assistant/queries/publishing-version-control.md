---
type: Query Capability
title: "Version-controlled publishing to Google Docs with change tracking, stakeholde..."
description: "Version-controlled publishing to Google Docs with change tracking, stakeholder notification, and automated change log generation."
source_id: "publishing-version-control"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Version-controlled publishing to Google Docs with change tracking, stakeholder notification, and automated change log generation.

## Tools used

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_policy_drafting_review_assistant_policy_handbook](/tools/lookup-policy-drafting-review-assistant-policy-handbook.md)
- [action_google_docs_publish](/tools/action-google-docs-publish.md)

## Runs in

- [publishing_version_control](/workflow/publishing-version-control.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-drafting-review-assistant-end-to-end.md)

# Citations

- [Policy Drafting & Review Assistant Policy Handbook](/documents/policy-drafting-review-assistant-policy-handbook.md)
