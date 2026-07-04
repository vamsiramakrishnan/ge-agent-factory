---
type: Agent Tool
title: action_servicenow_open_hr_ticket
description: "Open an HR ticket when the assistant cannot ground its answer with cited evidence, routing the question to the People team with the original chat transcript and confluence search trail attached."
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

# action_servicenow_open_hr_ticket

Open an HR ticket when the assistant cannot ground its answer with cited evidence, routing the question to the People team with the original chat transcript and confluence search trail attached.

- **Kind:** action
- **Source system:** [Workday](/systems/workday.md)
- **API:** POST /api/now/v1/table/hr_case

## Inputs

- employee_id
- question_text
- search_trail

## Outputs

- hr_ticket_id
- routing_assignment

## Side Effects

- May change Workday state because the spec classifies it as action.

## Idempotency

Declared idempotency key: employee_id+question_hash.

## Confirmation

- [Confirmation policy — action_servicenow_open_hr_ticket](/policies/confirmation-action-servicenow-open-hr-ticket.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [contextual_answer_generation](/workflow/contextual-answer-generation.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- employee_id
- question_text
- search_trail

## Produces

- hr_ticket_id
- routing_assignment

# Examples

```
action_servicenow_open_hr_ticket(employee_id=<employee_id>, question_text=<question_text>, search_trail=<search_trail>)
```

# Citations

- [Workday](/systems/workday.md)
- [Confirmation policy — action_servicenow_open_hr_ticket](/policies/confirmation-action-servicenow-open-hr-ticket.md)
- [Idempotency policy — action_servicenow_open_hr_ticket](/policies/idempotency-action-servicenow-open-hr-ticket.md)
