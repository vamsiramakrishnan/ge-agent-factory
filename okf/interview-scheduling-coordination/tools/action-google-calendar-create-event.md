---
type: Agent Tool
title: action_google_calendar_create_event
description: "Create a calendar event with all panelists and candidate, attach Zoom link, and include prep materials as event description or attachment."
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

# action_google_calendar_create_event

Create a calendar event with all panelists and candidate, attach Zoom link, and include prep materials as event description or attachment.

- **Kind:** action
- **Source system:** [Google Calendar](/systems/google-calendar.md)
- **API:** POST /systems/google-calendar/events

## Inputs

- event_title
- start_time
- attendee_emails
- zoom_link
- prep_materials_link

## Outputs

- event_id
- zoom_link
- calendar_invite_id

## Side Effects

- May change Google Calendar state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_google_calendar_create_event](/policies/confirmation-action-google-calendar-create-event.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Calendar](/systems/google-calendar.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [panel_availability](/workflow/panel-availability.md)
- [booking_confirmation](/workflow/booking-confirmation.md)

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- event_title
- start_time
- attendee_emails
- zoom_link
- prep_materials_link

## Produces

- event_id
- zoom_link
- calendar_invite_id

# Examples

```
action_google_calendar_create_event(event_title=<event_title>, start_time=<start_time>, attendee_emails=<attendee_emails>, zoom_link=<zoom_link>, prep_materials_link=<prep_materials_link>)
```

# Citations

- [Google Calendar](/systems/google-calendar.md)
- [Confirmation policy — action_google_calendar_create_event](/policies/confirmation-action-google-calendar-create-event.md)
