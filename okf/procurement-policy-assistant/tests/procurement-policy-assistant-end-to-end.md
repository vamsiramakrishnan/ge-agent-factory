---
type: Eval Scenario
title: Run the Procurement Policy Assistant workflow for the current period. Cite th...
description: "Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "procurement-policy-assistant-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [policy-corpus-indexing](/queries/policy-corpus-indexing.md)

## Mechanisms to call

- [query_sharepoint_google_drive_documents](/tools/query-sharepoint-google-drive-documents.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [lookup_procurement_policy_assistant_policy_guide](/tools/lookup-procurement-policy-assistant-policy-guide.md)
- [action_sharepoint_google_drive_route](/tools/action-sharepoint-google-drive-route.md)

## Success rubric

Action route executed against SharePoint/Google Drive, with audit-trail entry and All Procurement Staff notified of outcomes.

# Citations

- [Procurement Policy Assistant Procurement Policy Guide](/documents/procurement-policy-assistant-policy-guide.md)
