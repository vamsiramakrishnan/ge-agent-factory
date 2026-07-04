---
type: Agent Tool
title: action_benefits_platform_enroll
description: "Submit an enrollment change to the Benefits Platform; returns enrollment_id, carrier_sync_id, and an audit trail line that the agent must echo to the employee."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_benefits_platform_enroll

Submit an enrollment change to the Benefits Platform; returns enrollment_id, carrier_sync_id, and an audit trail line that the agent must echo to the employee.

- **Kind:** action
- **Source system:** [Benefits Platform](/systems/benefits-platform.md)
- **API:** POST /systems/benefits-platform/enrollments

## Inputs

- employee_id
- plan_id
- coverage_tier

## Outputs

- enrollment_id
- carrier_sync_id
- audit_trail

## Side Effects

- May change Benefits Platform state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_benefits_platform_enroll](/policies/confirmation-action-benefits-platform-enroll.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Benefits Platform](/systems/benefits-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [question_understanding](/workflow/question-understanding.md)
- [personalized_response](/workflow/personalized-response.md)

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- plan_id
- coverage_tier

## Produces

- enrollment_id
- carrier_sync_id
- audit_trail

# Examples

```
action_benefits_platform_enroll(employee_id=<employee_id>, plan_id=<plan_id>, coverage_tier=<coverage_tier>)
```

# Citations

- [Benefits Platform](/systems/benefits-platform.md)
- [Confirmation policy — action_benefits_platform_enroll](/policies/confirmation-action-benefits-platform-enroll.md)
