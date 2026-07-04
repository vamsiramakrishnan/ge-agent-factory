---
type: Query Capability
title: "Calendar events created with video conferencing links, prep materials attache..."
description: "Calendar events created with video conferencing links, prep materials attached, and confirmation sent to all participants."
source_id: "booking-confirmation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calendar events created with video conferencing links, prep materials attached, and confirmation sent to all participants.

## Tools used

- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [action_google_calendar_create_event](/tools/action-google-calendar-create-event.md)

## Runs in

- [booking_confirmation](/workflow/booking-confirmation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)
- [Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.](/tests/timezone-spanning-panel-conflict-resolution.md)

# Citations

- [Interview Panel Composition Policy](/documents/interview-panel-composition-policy.md)
- [Scheduling Etiquette SOP](/documents/scheduling-etiquette-sop.md)
