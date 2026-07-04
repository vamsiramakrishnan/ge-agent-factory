---
type: Eval Scenario
title: "Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant s..."
description: "Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "1-1-meeting-prep-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [meeting-detection](/queries/meeting-detection.md)

## Mechanisms to call

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_1_1_meeting_prep_policy_handbook](/tools/lookup-1-1-meeting-prep-policy-handbook.md)
- [action_google_calendar_generate](/tools/action-google-calendar-generate.md)

## Success rubric

Action generate executed against Google Calendar, with audit-trail entry and Manager notified of outcomes.

# Citations

- [1:1 Meeting Prep Policy Handbook](/documents/1-1-meeting-prep-policy-handbook.md)
