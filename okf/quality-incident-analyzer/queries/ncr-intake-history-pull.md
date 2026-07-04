---
type: Query Capability
title: Receive NCR notification from SAP QM system. Pull historical quality data for...
description: "Receive NCR notification from SAP QM system. Pull historical quality data for the affected supplier, part, and plant. Trigger CAPA workflow in tracking system."
source_id: "ncr-intake-history-pull"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive NCR notification from SAP QM system. Pull historical quality data for the affected supplier, part, and plant. Trigger CAPA workflow in tracking system.

## Tools used

- [query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records](/tools/query-sap-qm-qm01-qm02-sap-qm-qm01-qm02-records.md)
- [query_quality_management_systems_quality_management_systems_records](/tools/query-quality-management-systems-quality-management-systems-records.md)
- [query_capa_tools_capa_tools_records](/tools/query-capa-tools-capa-tools-records.md)
- [lookup_quality_incident_analyzer_policy_guide](/tools/lookup-quality-incident-analyzer-policy-guide.md)
- [action_sap_qm_qm01_qm02_generate](/tools/action-sap-qm-qm01-qm02-generate.md)

## Runs in

- [ncr_intake_history_pull](/workflow/ncr-intake-history-pull.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/quality-incident-analyzer-end-to-end.md)

# Citations

- [Quality Incident Analyzer Procurement Policy Guide](/documents/quality-incident-analyzer-policy-guide.md)
