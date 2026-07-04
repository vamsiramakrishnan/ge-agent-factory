---
type: Query Capability
title: Rate card compliance engine validates every timesheet against contracted rate...
description: "Rate card compliance engine validates every timesheet against contracted rates, roles, and budget caps in real time"
source_id: "rate-card-compliance-engine-validates-every-timesheet-against-co"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Rate card compliance engine validates every timesheet against contracted rates, roles, and budget caps in real time

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
