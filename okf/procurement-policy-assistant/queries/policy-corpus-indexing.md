---
type: Query Capability
title: Index policy documents from SharePoint/Google Drive. Keep corpus in sync on u...
description: Index policy documents from SharePoint/Google Drive. Keep corpus in sync on updates. Route unanswered questions to policy owners for continuous knowledge improvement.
source_id: "policy-corpus-indexing"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Index policy documents from SharePoint/Google Drive. Keep corpus in sync on updates. Route unanswered questions to policy owners for continuous knowledge improvement.

## Tools used

- [query_sharepoint_google_drive_documents](/tools/query-sharepoint-google-drive-documents.md)
- [lookup_procurement_policy_assistant_policy_guide](/tools/lookup-procurement-policy-assistant-policy-guide.md)
- [action_sharepoint_google_drive_route](/tools/action-sharepoint-google-drive-route.md)

## Runs in

- [policy_corpus_indexing](/workflow/policy-corpus-indexing.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-policy-assistant-end-to-end.md)

# Citations

- [Procurement Policy Assistant Procurement Policy Guide](/documents/procurement-policy-assistant-policy-guide.md)
