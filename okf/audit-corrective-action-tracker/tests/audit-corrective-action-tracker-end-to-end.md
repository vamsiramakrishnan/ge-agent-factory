---
type: Eval Scenario
title: "Run the Audit & Corrective Action Tracker workflow for the current period. Ci..."
description: "Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "audit-corrective-action-tracker-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [audit-finding-intake](/queries/audit-finding-intake.md)

## Mechanisms to call

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)
- [action_sap_grc_generate](/tools/action-sap-grc-generate.md)

## Success rubric

Action generate executed against SAP GRC, with audit-trail entry and Supplier Risk Analyst notified of outcomes.

# Citations

- [Audit & Corrective Action Tracker Procurement Policy Guide](/documents/audit-corrective-action-tracker-policy-guide.md)
