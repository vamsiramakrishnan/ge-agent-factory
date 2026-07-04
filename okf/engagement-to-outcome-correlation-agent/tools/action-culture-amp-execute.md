---
type: Agent Tool
title: action_culture_amp_execute
description: Execute the execute step in Culture Amp after the agent has gathered evidence and validated escalation gates.
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

# action_culture_amp_execute

Execute the execute step in Culture Amp after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Culture Amp](/systems/culture-amp.md)
- **API:** POST /api/culture_amp/execute

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Culture Amp state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_culture_amp_execute](/policies/confirmation-action-culture-amp-execute.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Culture Amp](/systems/culture-amp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engagement-to-outcome-correlation-agent-end-to-end.md)

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
action_culture_amp_execute(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Culture Amp](/systems/culture-amp.md)
- [Confirmation policy — action_culture_amp_execute](/policies/confirmation-action-culture-amp-execute.md)
- [Idempotency policy — action_culture_amp_execute](/policies/idempotency-action-culture-amp-execute.md)
