---
type: Query Capability
title: "Execute the escalate step in SAP S/4HANA QM with a full audit trail, and esca..."
description: "Execute the escalate step in SAP S/4HANA QM with a full audit trail, and escalate exceptions to the Quality Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in SAP S/4HANA QM with a full audit trail, and escalate exceptions to the Quality Manager.

## Tools used

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the CAPA Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capa-orchestration-agent-end-to-end.md)

# Citations

- [CAPA Orchestration Agent Standard Operating Procedure](/documents/capa-orchestration-agent-sop.md)
