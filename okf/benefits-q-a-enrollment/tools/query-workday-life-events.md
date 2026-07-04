---
type: Agent Tool
title: query_workday_life_events
description: Confirm the QLE type and timestamp so the agent can prove the enrollment window is still open.
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

# query_workday_life_events

Confirm the QLE type and timestamp so the agent can prove the enrollment window is still open.

- **Kind:** query
- **Source system:** [Workday](/systems/workday.md)

## Inputs

- employee_id

## Outputs

- life_event_record

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [question_understanding](/workflow/question-understanding.md)

## Evals

- [I am employee EMP-0007. I just had a baby and need to move to a family Standard PPO. Please enroll me and confirm.](/tests/qle-family-tier-enrollment.md)
- [I had a baby 11 months ago — can you still add my child to family coverage today?](/tests/out-of-window-refusal.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id

## Produces

- life_event_record

# Examples

```
query_workday_life_events(employee_id=<employee_id>)
```

# Citations

- [Workday](/systems/workday.md)
