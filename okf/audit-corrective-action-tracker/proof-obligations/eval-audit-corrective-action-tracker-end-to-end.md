---
type: Proof Obligation
title: "Golden eval obligation — Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-audit-corrective-action-tracker-end-to-end"
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

# Golden eval obligation — Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [audit-corrective-action-tracker-end-to-end](/tests/audit-corrective-action-tracker-end-to-end.md)


## Mechanisms

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_audit_tools_audit_tools_records](/tools/query-audit-tools-audit-tools-records.md)
- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_capa_tracking_capa_tracking_records](/tools/query-capa-tracking-capa-tracking-records.md)
- [lookup_audit_corrective_action_tracker_policy_guide](/tools/lookup-audit-corrective-action-tracker-policy-guide.md)
- [action_sap_grc_generate](/tools/action-sap-grc-generate.md)

## Entities that must be referenced

- control_tests
- audit_tools_records
- ariba_slp_records
- capa_tracking_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [audit-corrective-action-tracker-policy-guide](/documents/audit-corrective-action-tracker-policy-guide.md)
