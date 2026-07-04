---
type: Workflow Stage
title: Booking Data Collection
description: "Pull room booking data from Google Calendar: bookings, actual attendee counts (from check-ins), no-shows, and cancellation patterns. Enrich with department and team data from Google Workspace."
source_id: booking_data_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Booking Data Collection

Pull room booking data from Google Calendar: bookings, actual attendee counts (from check-ins), no-shows, and cancellation patterns. Enrich with department and team data from Google Workspace.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_meeting_room_resource_optimizer_runbook](/tools/lookup-meeting-room-resource-optimizer-runbook.md)
- [action_google_calendar_recommend](/tools/action-google-calendar-recommend.md)

Next: [Utilization Analytics](/workflow/utilization-analytics.md)
