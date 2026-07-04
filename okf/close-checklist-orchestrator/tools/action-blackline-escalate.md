---
type: Agent Tool
title: action_blackline_escalate
description: Execute the escalate step in BlackLine after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_blackline_escalate

Execute the escalate step in BlackLine after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [BlackLine](/systems/blackline.md)
- **API:** POST /api/blackline/escalate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change BlackLine state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_blackline_escalate](/policies/confirmation-action-blackline-escalate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [escalation_reporting](/workflow/escalation-reporting.md)

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

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
action_blackline_escalate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [BlackLine](/systems/blackline.md)
- [Confirmation policy — action_blackline_escalate](/policies/confirmation-action-blackline-escalate.md)
- [Idempotency policy — action_blackline_escalate](/policies/idempotency-action-blackline-escalate.md)
