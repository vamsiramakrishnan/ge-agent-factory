---
type: Workflow Stage
title: Audit Finding Intake
description: "Receive audit report from SAP GRC, parse finding narratives, extract structured data (finding type, severity, affected supplier, evidence). Create CAPA items in tracking system with assigned owners and deadlines."
source_id: audit_finding_intake
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Audit Finding Intake

Receive audit report from SAP GRC, parse finding narratives, extract structured data (finding type, severity, affected supplier, evidence). Create CAPA items in tracking system with assigned owners and deadlines.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)
- [action_sap_grc_generate](/tools/action-sap-grc-generate.md)

Next: [Recurrence Pattern Detection](/workflow/recurrence-pattern-detection.md)
