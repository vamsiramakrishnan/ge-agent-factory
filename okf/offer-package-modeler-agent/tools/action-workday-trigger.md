---
type: Agent Tool
title: action_workday_trigger
description: Execute the trigger step in Workday after the agent has gathered evidence and validated escalation gates.
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

# action_workday_trigger

Execute the trigger step in Workday after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Workday](/systems/workday.md)
- **API:** POST /api/workday/trigger

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

- [Confirmation policy — action_workday_trigger](/policies/confirmation-action-workday-trigger.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [market_data_assembly](/workflow/market-data-assembly.md)
- [approval_generation](/workflow/approval-generation.md)

## Evals

- [Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offer-package-modeler-agent-end-to-end.md)

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
action_workday_trigger(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Workday](/systems/workday.md)
- [Confirmation policy — action_workday_trigger](/policies/confirmation-action-workday-trigger.md)
- [Idempotency policy — action_workday_trigger](/policies/idempotency-action-workday-trigger.md)
