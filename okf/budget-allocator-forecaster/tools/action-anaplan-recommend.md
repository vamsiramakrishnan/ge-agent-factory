---
type: Agent Tool
title: action_anaplan_recommend
description: Execute the recommend step in Anaplan after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_anaplan_recommend

Execute the recommend step in Anaplan after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Anaplan](/systems/anaplan.md)
- **API:** POST /api/anaplan/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Anaplan state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_anaplan_recommend](/policies/confirmation-action-anaplan-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Anaplan](/systems/anaplan.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [variance_interpretation](/workflow/variance-interpretation.md)

## Evals

- [Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/budget-allocator-forecaster-end-to-end.md)

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
action_anaplan_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Anaplan](/systems/anaplan.md)
- [Confirmation policy — action_anaplan_recommend](/policies/confirmation-action-anaplan-recommend.md)
- [Idempotency policy — action_anaplan_recommend](/policies/idempotency-action-anaplan-recommend.md)
