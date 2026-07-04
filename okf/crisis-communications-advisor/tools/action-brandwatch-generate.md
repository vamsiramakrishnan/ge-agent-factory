---
type: Agent Tool
title: action_brandwatch_generate
description: Execute the generate step in Brandwatch after the agent has gathered evidence and validated escalation gates.
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

# action_brandwatch_generate

Execute the generate step in Brandwatch after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Brandwatch](/systems/brandwatch.md)
- **API:** POST /api/brandwatch/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Brandwatch state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_brandwatch_generate](/policies/confirmation-action-brandwatch-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Brandwatch](/systems/brandwatch.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_detection](/workflow/signal-detection.md)
- [response_strategy](/workflow/response-strategy.md)

## Evals

- [Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/crisis-communications-advisor-end-to-end.md)

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
action_brandwatch_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Brandwatch](/systems/brandwatch.md)
- [Confirmation policy — action_brandwatch_generate](/policies/confirmation-action-brandwatch-generate.md)
- [Idempotency policy — action_brandwatch_generate](/policies/idempotency-action-brandwatch-generate.md)
