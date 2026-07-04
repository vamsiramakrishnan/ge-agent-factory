---
type: Proof Obligation
title: "Golden eval obligation — Run the Audit Finding Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-audit-finding-tracker-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Audit Finding Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [audit-finding-tracker-end-to-end](/tests/audit-finding-tracker-end-to-end.md)


## Mechanisms

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_audit_finding_tracker_controls_playbook](/tools/lookup-audit-finding-tracker-controls-playbook.md)
- [action_auditboard_execute](/tools/action-auditboard-execute.md)

## Entities that must be referenced

- auditboard_records
- tickets
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [audit-finding-tracker-controls-playbook](/documents/audit-finding-tracker-controls-playbook.md)
