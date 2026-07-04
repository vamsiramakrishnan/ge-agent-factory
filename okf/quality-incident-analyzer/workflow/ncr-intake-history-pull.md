---
type: Workflow Stage
title: "NCR Intake & History Pull"
description: "Receive NCR notification from SAP QM system. Pull historical quality data for the affected supplier, part, and plant. Trigger CAPA workflow in tracking system."
source_id: ncr_intake_history_pull
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# NCR Intake & History Pull

Receive NCR notification from SAP QM system. Pull historical quality data for the affected supplier, part, and plant. Trigger CAPA workflow in tracking system.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records](/tools/query-sap-qm-qm01-qm02-sap-qm-qm01-qm02-records.md)
- [query_quality_management_systems_quality_management_systems_records](/tools/query-quality-management-systems-quality-management-systems-records.md)
- [query_capa_tools_capa_tools_records](/tools/query-capa-tools-capa-tools-records.md)
- [lookup_quality_incident_analyzer_policy_guide](/tools/lookup-quality-incident-analyzer-policy-guide.md)
- [action_sap_qm_qm01_qm02_generate](/tools/action-sap-qm-qm01-qm02-generate.md)

Next: [Pattern Detection & Classification](/workflow/pattern-detection-classification.md)
