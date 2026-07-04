---
type: Workflow Stage
title: Meeting Detection
description: "Monitor Google Calendar for upcoming 1:1 meetings. Trigger context assembly 24 hours before each scheduled session."
source_id: meeting_detection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Meeting Detection

Monitor Google Calendar for upcoming 1:1 meetings. Trigger context assembly 24 hours before each scheduled session.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_1_1_meeting_prep_policy_handbook](/tools/lookup-1-1-meeting-prep-policy-handbook.md)
- [action_google_calendar_generate](/tools/action-google-calendar-generate.md)

Next: [Context Assembly](/workflow/context-assembly.md)
