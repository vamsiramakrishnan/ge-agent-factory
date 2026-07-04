---
type: Agent Tool
title: query_sap_s_4hana_qm_inspection_lots
description: Retrieve inspection lots from SAP S/4HANA QM for the CAPA Orchestration Agent workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s_4hana_qm_inspection_lots

Retrieve inspection lots from SAP S/4HANA QM for the CAPA Orchestration Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)

## Inputs

- inspection_lot_number
- date_range

## Outputs

- inspection_lots_records
- inspection_lots_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [capa_notification_intake](/workflow/capa-notification-intake.md)
- [stalled_task_escalation](/workflow/stalled-task-escalation.md)
- [effectiveness_verification_reopen_gate](/workflow/effectiveness-verification-reopen-gate.md)

## Evals

- [Run the CAPA Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capa-orchestration-agent-end-to-end.md)
- [CAPA-73408 (source: customer_complaint, root_cause_method: fishbone) is sitting in status 'effectiveness_check' with effectiveness_verified still false and a due_date of 2026-05-20 -- that's 45 days past due today. The linked nonconformance record NC-641207 (defect_code: contamination, severity: major) shows containment_complete=true but mrb_required=true with no MRB disposition attached in SAP QM. The owner wants to close it out today. Walk me through whether this can close.](/tests/capa-orchestration-agent-mrb-disposition-hold.md)

## Evidence emitted

- source_system_record

## Required inputs

- inspection_lot_number
- date_range

## Produces

- inspection_lots_records
- inspection_lots_summary

# Examples

```
query_sap_s_4hana_qm_inspection_lots(inspection_lot_number=<inspection_lot_number>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
