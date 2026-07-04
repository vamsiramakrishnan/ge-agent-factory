---
type: Agent Tool
title: action_ukg_dimensions_escalate
description: Execute the escalate step in UKG Dimensions after the agent has gathered evidence and validated escalation gates.
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

# action_ukg_dimensions_escalate

Execute the escalate step in UKG Dimensions after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [UKG Dimensions](/systems/ukg-dimensions.md)
- **API:** POST /api/ukg_dimensions/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change UKG Dimensions state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ukg_dimensions_escalate](/policies/confirmation-action-ukg-dimensions-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [UKG Dimensions](/systems/ukg-dimensions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [task_schedule_pull](/workflow/task-schedule-pull.md)
- [visit_brief_escalation](/workflow/visit-brief-escalation.md)

## Evals

- [Run the Store Task Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-task-compliance-agent-end-to-end.md)

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
action_ukg_dimensions_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [UKG Dimensions](/systems/ukg-dimensions.md)
- [Confirmation policy — action_ukg_dimensions_escalate](/policies/confirmation-action-ukg-dimensions-escalate.md)
- [Idempotency policy — action_ukg_dimensions_escalate](/policies/idempotency-action-ukg-dimensions-escalate.md)
