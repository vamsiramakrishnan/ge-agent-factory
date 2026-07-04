---
type: Agent Tool
title: action_workday_provision
description: Execute the provision step in Workday after the agent has gathered evidence and validated escalation gates.
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

# action_workday_provision

Execute the provision step in Workday after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Workday](/systems/workday.md)
- **API:** POST /api/workday/provision

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

- [Confirmation policy — action_workday_provision](/policies/confirmation-action-workday-provision.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [exit_trigger](/workflow/exit-trigger.md)

## Evals

- [Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offboarding-orchestration-end-to-end.md)

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
action_workday_provision(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Workday](/systems/workday.md)
- [Confirmation policy — action_workday_provision](/policies/confirmation-action-workday-provision.md)
- [Idempotency policy — action_workday_provision](/policies/idempotency-action-workday-provision.md)
