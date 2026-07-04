---
type: Agent Tool
title: action_google_calendar_recommend
description: Execute the recommend step in Google Calendar after the agent has gathered evidence and validated escalation gates.
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

# action_google_calendar_recommend

Execute the recommend step in Google Calendar after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Calendar](/systems/google-calendar.md)
- **API:** POST /api/google_calendar/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Calendar state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_calendar_recommend](/policies/confirmation-action-google-calendar-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Calendar](/systems/google-calendar.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [booking_data_collection](/workflow/booking-data-collection.md)
- [optimization_recommendations](/workflow/optimization-recommendations.md)

## Evals

- [Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/meeting-room-resource-optimizer-end-to-end.md)

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
action_google_calendar_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Calendar](/systems/google-calendar.md)
- [Confirmation policy — action_google_calendar_recommend](/policies/confirmation-action-google-calendar-recommend.md)
- [Idempotency policy — action_google_calendar_recommend](/policies/idempotency-action-google-calendar-recommend.md)
