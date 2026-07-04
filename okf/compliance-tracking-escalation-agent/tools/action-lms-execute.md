---
type: Agent Tool
title: action_lms_execute
description: Execute the execute step in LMS after the agent has gathered evidence and validated escalation gates.
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

# action_lms_execute

Execute the execute step in LMS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [LMS](/systems/lms.md)
- **API:** POST /api/lms/execute

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change LMS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_lms_execute](/policies/confirmation-action-lms-execute.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LMS](/systems/lms.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-tracking-escalation-agent-end-to-end.md)

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
action_lms_execute(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [LMS](/systems/lms.md)
- [Confirmation policy — action_lms_execute](/policies/confirmation-action-lms-execute.md)
- [Idempotency policy — action_lms_execute](/policies/idempotency-action-lms-execute.md)
