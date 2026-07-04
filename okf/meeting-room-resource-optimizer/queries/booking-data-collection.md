---
type: Query Capability
title: "Pull room booking data from Google Calendar: bookings, actual attendee counts..."
description: "Pull room booking data from Google Calendar: bookings, actual attendee counts (from check-ins), no-shows, and cancellation patterns. Enrich with department and team data from Google Workspace."
source_id: "booking-data-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull room booking data from Google Calendar: bookings, actual attendee counts (from check-ins), no-shows, and cancellation patterns. Enrich with department and team data from Google Workspace.

## Tools used

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_meeting_room_resource_optimizer_runbook](/tools/lookup-meeting-room-resource-optimizer-runbook.md)
- [action_google_calendar_recommend](/tools/action-google-calendar-recommend.md)

## Runs in

- [booking_data_collection](/workflow/booking-data-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/meeting-room-resource-optimizer-end-to-end.md)

# Citations

- [Meeting Room & Resource Optimizer Operations Runbook](/documents/meeting-room-resource-optimizer-runbook.md)
