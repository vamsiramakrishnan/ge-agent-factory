---
type: Agent Tool
title: action_guidewire_billingcenter_approve
description: Execute the approve step in Guidewire BillingCenter after the agent has gathered evidence and validated escalation gates.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_guidewire_billingcenter_approve

Execute the approve step in Guidewire BillingCenter after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
- **API:** POST /api/guidewire_billingcenter/approve

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Guidewire BillingCenter state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_guidewire_billingcenter_approve](/policies/confirmation-action-guidewire-billingcenter-approve.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire BillingCenter](/systems/guidewire-billingcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Payment Plan Recommendation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-plan-recommendation-agent-end-to-end.md)

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
action_guidewire_billingcenter_approve(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
- [Confirmation policy — action_guidewire_billingcenter_approve](/policies/confirmation-action-guidewire-billingcenter-approve.md)
- [Idempotency policy — action_guidewire_billingcenter_approve](/policies/idempotency-action-guidewire-billingcenter-approve.md)
