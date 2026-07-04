---
type: Agent Tool
title: query_google_calendar_availability
description: "Find free slots across all panelists and candidate within a 5-day window, respecting time zones and 15-minute buffer slots."
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

# query_google_calendar_availability

Find free slots across all panelists and candidate within a 5-day window, respecting time zones and 15-minute buffer slots.

- **Kind:** query
- **Source system:** [Google Calendar](/systems/google-calendar.md)

## Inputs

- attendee_emails
- time_zone_list
- preferred_date_range

## Outputs

- available_slots
- conflict_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Calendar](/systems/google-calendar.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [panel_availability](/workflow/panel-availability.md)
- [optimal_scheduling](/workflow/optimal-scheduling.md)
- [booking_confirmation](/workflow/booking-confirmation.md)

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)
- [Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.](/tests/timezone-spanning-panel-conflict-resolution.md)

## Evidence emitted

- source_system_record

## Required inputs

- attendee_emails
- time_zone_list
- preferred_date_range

## Produces

- available_slots
- conflict_summary

# Examples

```
query_google_calendar_availability(attendee_emails=<attendee_emails>, time_zone_list=<time_zone_list>, preferred_date_range=<preferred_date_range>)
```

# Citations

- [Google Calendar](/systems/google-calendar.md)
