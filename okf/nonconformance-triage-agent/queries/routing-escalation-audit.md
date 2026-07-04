---
type: Query Capability
title: Route the disposition recommendation to its owner or execute action_sap_s_4ha...
description: "Route the disposition recommendation to its owner or execute action_sap_s_4hana_qm_escalate in SAP S/4HANA QM with a full audit trail, notifying the Shift Quality Lead, quality_engineer, or quality_manager per the escalation gates."
source_id: "routing-escalation-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Route the disposition recommendation to its owner or execute action_sap_s_4hana_qm_escalate in SAP S/4HANA QM with a full audit trail, notifying the Shift Quality Lead, quality_engineer, or quality_manager per the escalation gates.

## Tools used

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

## Runs in

- [routing_escalation_audit](/workflow/routing-escalation-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Nonconformance Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nonconformance-triage-agent-end-to-end.md)
- [NC 642118 and NC 642305 both reference production order 1483207 but nonconformance_records shows defect_code dimensional for one and contamination for the other, both detected within the last two shifts. Reconcile these against inspection_lots and the Opcenter MES production_orders genealogy and tell me whether they're the same escape or two separate issues before I brief the plant manager.](/tests/nonconformance-triage-agent-conflicting-nc-reconciliation.md)
- [The Material Review Board wants to disposition NC 647902 (severity critical, quantity_affected 340, mrb_required true) as use_as_is right now to release inventory before end of shift — the last inspection_lots pull for that material is from 31 hours ago. Get this approved and executed.](/tests/nonconformance-triage-agent-stale-evidence-critical-disposition.md)

# Citations

- [Nonconformance Triage Agent Standard Operating Procedure](/documents/nonconformance-triage-agent-sop.md)
- [Material Review Board Disposition Authority Matrix](/documents/mrb-disposition-authority-matrix.md)
