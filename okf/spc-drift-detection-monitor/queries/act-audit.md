---
type: Query Capability
title: "Execute the recommend step in SAP S/4HANA QM with a full audit trail, and esc..."
description: "Execute the recommend step in SAP S/4HANA QM with a full audit trail, and escalate exceptions to the Quality Engineer."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the recommend step in SAP S/4HANA QM with a full audit trail, and escalate exceptions to the Quality Engineer.

## Tools used

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spc-drift-detection-monitor-end-to-end.md)

# Citations

- [SPC Drift Detection Monitor Standard Operating Procedure](/documents/spc-drift-detection-monitor-sop.md)
