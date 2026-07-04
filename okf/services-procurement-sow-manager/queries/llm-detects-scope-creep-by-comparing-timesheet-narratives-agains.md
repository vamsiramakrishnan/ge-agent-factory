---
type: Query Capability
title: "LLM detects scope creep by comparing timesheet narratives against SOW scope: ..."
description: "LLM detects scope creep by comparing timesheet narratives against SOW scope: 'SOW covers Phase 1 system design but timesheets show user acceptance testing support — this is Phase 3 work charged against Phase 1.'"
source_id: "llm-detects-scope-creep-by-comparing-timesheet-narratives-agains"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM detects scope creep by comparing timesheet narratives against SOW scope: 'SOW covers Phase 1 system design but timesheets show user acceptance testing support — this is Phase 3 work charged against Phase 1.'

## Tools used

- [query_sap_fieldglass_gl_entries](/tools/query-sap-fieldglass-gl-entries.md)
- [query_beeline_beeline_records](/tools/query-beeline-beeline-records.md)
- [query_vms_platforms_vms_platforms_records](/tools/query-vms-platforms-vms-platforms-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_services_procurement_sow_manager_policy_guide](/tools/lookup-services-procurement-sow-manager-policy-guide.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Services Procurement & SOW Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/services-procurement-sow-manager-end-to-end.md)

# Citations

- [Services Procurement & SOW Manager Procurement Policy Guide](/documents/services-procurement-sow-manager-policy-guide.md)
