---
type: Eval Scenario
title: "Run the Meeting Room & Resource Optimizer workflow for the current period. Ci..."
description: "Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "meeting-room-resource-optimizer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [booking-data-collection](/queries/booking-data-collection.md)

## Mechanisms to call

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_meeting_room_resource_optimizer_runbook](/tools/lookup-meeting-room-resource-optimizer-runbook.md)
- [action_google_calendar_recommend](/tools/action-google-calendar-recommend.md)

## Success rubric

Action recommend executed against Google Calendar, with audit-trail entry and End User Support Lead notified of outcomes.

# Citations

- [Meeting Room & Resource Optimizer Operations Runbook](/documents/meeting-room-resource-optimizer-runbook.md)
