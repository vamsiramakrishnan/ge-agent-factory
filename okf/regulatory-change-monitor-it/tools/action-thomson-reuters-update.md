---
type: Agent Tool
title: action_thomson_reuters_update
description: Execute the update step in Thomson Reuters after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_thomson_reuters_update

Execute the update step in Thomson Reuters after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Thomson Reuters](/systems/thomson-reuters.md)
- **API:** POST /api/thomson_reuters/update

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Thomson Reuters state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_thomson_reuters_update](/policies/confirmation-action-thomson-reuters-update.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Thomson Reuters](/systems/thomson-reuters.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [regulatory_scanning](/workflow/regulatory-scanning.md)
- [impact_assessment](/workflow/impact-assessment.md)

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

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
action_thomson_reuters_update(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Thomson Reuters](/systems/thomson-reuters.md)
- [Confirmation policy — action_thomson_reuters_update](/policies/confirmation-action-thomson-reuters-update.md)
- [Idempotency policy — action_thomson_reuters_update](/policies/idempotency-action-thomson-reuters-update.md)
