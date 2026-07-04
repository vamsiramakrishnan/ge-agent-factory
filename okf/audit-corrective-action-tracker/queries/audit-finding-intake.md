---
type: Query Capability
title: "Receive audit report from SAP GRC, parse finding narratives, extract structur..."
description: "Receive audit report from SAP GRC, parse finding narratives, extract structured data (finding type, severity, affected supplier, evidence). Create CAPA items in tracking system with assigned owners and deadlines."
source_id: "audit-finding-intake"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive audit report from SAP GRC, parse finding narratives, extract structured data (finding type, severity, affected supplier, evidence). Create CAPA items in tracking system with assigned owners and deadlines.

## Tools used

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)
- [action_sap_grc_generate](/tools/action-sap-grc-generate.md)

## Runs in

- [audit_finding_intake](/workflow/audit-finding-intake.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

# Citations

- [Audit & Corrective Action Tracker Procurement Policy Guide](/documents/audit-corrective-action-tracker-policy-guide.md)
