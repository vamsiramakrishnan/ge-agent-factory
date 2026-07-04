---
type: Agent Tool
title: action_oracle_retail_mfcs_escalate
description: Execute the escalate step in Oracle Retail MFCS after the agent has gathered evidence and validated escalation gates.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_oracle_retail_mfcs_escalate

Execute the escalate step in Oracle Retail MFCS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
- **API:** POST /api/oracle_retail_mfcs/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Oracle Retail MFCS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_oracle_retail_mfcs_escalate](/policies/confirmation-action-oracle-retail-mfcs-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [reset_window_trigger_evidence_intake](/workflow/reset-window-trigger-evidence-intake.md)
- [sales_rate_planogram_reconciliation](/workflow/sales-rate-planogram-reconciliation.md)
- [playbook_gated_evidence_validation](/workflow/playbook-gated-evidence-validation.md)
- [corrective_task_assignment_chronic_non_compliance_escalation](/workflow/corrective-task-assignment-chronic-non-compliance-escalation.md)

## Evals

- [Run the Planogram Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/planogram-compliance-analyzer-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_oracle_retail_mfcs_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
- [Confirmation policy — action_oracle_retail_mfcs_escalate](/policies/confirmation-action-oracle-retail-mfcs-escalate.md)
- [Idempotency policy — action_oracle_retail_mfcs_escalate](/policies/idempotency-action-oracle-retail-mfcs-escalate.md)
