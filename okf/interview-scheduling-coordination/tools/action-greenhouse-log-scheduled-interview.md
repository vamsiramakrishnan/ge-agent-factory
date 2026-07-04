---
type: Agent Tool
title: action_greenhouse_log_scheduled_interview
description: "Update Greenhouse with scheduled interview event ID, Zoom link, and confirmation timestamp to close the scheduling workflow."
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

# action_greenhouse_log_scheduled_interview

Update Greenhouse with scheduled interview event ID, Zoom link, and confirmation timestamp to close the scheduling workflow.

- **Kind:** action
- **Source system:** [Greenhouse](/systems/greenhouse.md)
- **API:** PATCH /systems/greenhouse/interviews/{id}

## Inputs

- candidate_id
- interview_stage
- event_id
- zoom_link

## Outputs

- scheduled_interview_record

## Side Effects

- May change Greenhouse state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_greenhouse_log_scheduled_interview](/policies/confirmation-action-greenhouse-log-scheduled-interview.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Greenhouse](/systems/greenhouse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [panel_availability](/workflow/panel-availability.md)
- [optimal_scheduling](/workflow/optimal-scheduling.md)

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- candidate_id
- interview_stage
- event_id
- zoom_link

## Produces

- scheduled_interview_record

# Examples

```
action_greenhouse_log_scheduled_interview(candidate_id=<candidate_id>, interview_stage=<interview_stage>, event_id=<event_id>, zoom_link=<zoom_link>)
```

# Citations

- [Greenhouse](/systems/greenhouse.md)
- [Confirmation policy — action_greenhouse_log_scheduled_interview](/policies/confirmation-action-greenhouse-log-scheduled-interview.md)
