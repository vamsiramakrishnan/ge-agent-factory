---
type: Proof Obligation
title: "Golden eval obligation — Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-procurement-policy-assistant-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Procurement Policy Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [procurement-policy-assistant-end-to-end](/tests/procurement-policy-assistant-end-to-end.md)


## Mechanisms

- [query_sharepoint_google_drive_documents](/tools/query-sharepoint-google-drive-documents.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [lookup_procurement_policy_assistant_policy_guide](/tools/lookup-procurement-policy-assistant-policy-guide.md)
- [action_sharepoint_google_drive_route](/tools/action-sharepoint-google-drive-route.md)

## Entities that must be referenced

- documents
- requisitions
- suppliers

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [procurement-policy-assistant-policy-guide](/documents/procurement-policy-assistant-policy-guide.md)
