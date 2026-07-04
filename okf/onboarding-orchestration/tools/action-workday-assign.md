---
type: Agent Tool
title: action_workday_assign
description: Execute the assign step in Workday after the agent has gathered evidence and validated escalation gates.
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

# action_workday_assign

Execute the assign step in Workday after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Workday](/systems/workday.md)
- **API:** POST /api/workday/assign

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Workday state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_workday_assign](/policies/confirmation-action-workday-assign.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [onboarding_plan_generation](/workflow/onboarding-plan-generation.md)
- [task_orchestration](/workflow/task-orchestration.md)

## Evals

- [Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/onboarding-orchestration-end-to-end.md)

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
action_workday_assign(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Workday](/systems/workday.md)
- [Confirmation policy — action_workday_assign](/policies/confirmation-action-workday-assign.md)
- [Idempotency policy — action_workday_assign](/policies/idempotency-action-workday-assign.md)
