---
type: Agent Tool
title: action_duck_creek_policy_escalate
description: Execute the escalate step in Duck Creek Policy after the agent has gathered evidence and validated escalation gates.
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

# action_duck_creek_policy_escalate

Execute the escalate step in Duck Creek Policy after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)
- **API:** POST /api/duck_creek_policy/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Duck Creek Policy state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_duck_creek_policy_escalate](/policies/confirmation-action-duck-creek-policy-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [holder_request_intake_policy_match](/workflow/holder-request-intake-policy-match.md)
- [coverage_limits_verification](/workflow/coverage-limits-verification.md)
- [acord_generation_docu_sign_delivery](/workflow/acord-generation-docu-sign-delivery.md)
- [escalation_kpi_reconciliation](/workflow/escalation-kpi-reconciliation.md)

## Evals

- [Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/certificate-of-insurance-issuance-agent-end-to-end.md)

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
action_duck_creek_policy_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)
- [Confirmation policy — action_duck_creek_policy_escalate](/policies/confirmation-action-duck-creek-policy-escalate.md)
- [Idempotency policy — action_duck_creek_policy_escalate](/policies/idempotency-action-duck-creek-policy-escalate.md)
