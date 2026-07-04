---
type: Query Capability
title: "Monitor Google Calendar for upcoming 1:1 meetings. Trigger context assembly 2..."
description: "Monitor Google Calendar for upcoming 1:1 meetings. Trigger context assembly 24 hours before each scheduled session."
source_id: "meeting-detection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor Google Calendar for upcoming 1:1 meetings. Trigger context assembly 24 hours before each scheduled session.

## Tools used

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_1_1_meeting_prep_policy_handbook](/tools/lookup-1-1-meeting-prep-policy-handbook.md)
- [action_google_calendar_generate](/tools/action-google-calendar-generate.md)

## Runs in

- [meeting_detection](/workflow/meeting-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/1-1-meeting-prep-end-to-end.md)

# Citations

- [1:1 Meeting Prep Policy Handbook](/documents/1-1-meeting-prep-policy-handbook.md)
