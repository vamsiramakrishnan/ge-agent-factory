---
type: Proof Obligation
title: "Golden eval obligation — Run the Services Procurement & SOW Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-services-procurement-sow-manager-end-to-end"
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

# Golden eval obligation — Run the Services Procurement & SOW Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [services-procurement-sow-manager-end-to-end](/tests/services-procurement-sow-manager-end-to-end.md)


## Mechanisms

- [query_sap_fieldglass_gl_entries](/tools/query-sap-fieldglass-gl-entries.md)
- [query_beeline_beeline_records](/tools/query-beeline-beeline-records.md)
- [query_vms_platforms_vms_platforms_records](/tools/query-vms-platforms-vms-platforms-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_services_procurement_sow_manager_policy_guide](/tools/lookup-services-procurement-sow-manager-policy-guide.md)
- [action_sap_fieldglass_validate](/tools/action-sap-fieldglass-validate.md)

## Entities that must be referenced

- gl_entries
- beeline_records
- vms_platforms_records
- requisitions
- contract_system_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute validate without two-system evidence

# Citations

- [services-procurement-sow-manager-policy-guide](/documents/services-procurement-sow-manager-policy-guide.md)
