---
type: Agent Tool
title: action_sap_concur_submit
description: Execute the submit step in SAP Concur after the agent has gathered evidence and validated escalation gates.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sap_concur_submit

Execute the submit step in SAP Concur after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP Concur](/systems/sap-concur.md)
- **API:** POST /api/sap_concur/submit

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP Concur state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_concur_submit](/policies/confirmation-action-sap-concur-submit.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Concur](/systems/sap-concur.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

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
action_sap_concur_submit(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP Concur](/systems/sap-concur.md)
- [Confirmation policy — action_sap_concur_submit](/policies/confirmation-action-sap-concur-submit.md)
- [Idempotency policy — action_sap_concur_submit](/policies/idempotency-action-sap-concur-submit.md)
