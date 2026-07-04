---
type: Query Capability
title: Create structured task items in Asana/Jira with owners and deadlines. Set cal...
description: Create structured task items in Asana/Jira with owners and deadlines. Set calendar entries in Google Calendar with recurring reminders and escalation triggers for approaching deadlines.
source_id: "task-calendar-creation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create structured task items in Asana/Jira with owners and deadlines. Set calendar entries in Google Calendar with recurring reminders and escalation triggers for approaching deadlines.

## Tools used

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_asana_jira_issues](/tools/query-asana-jira-issues.md)
- [action_icertis_create](/tools/action-icertis-create.md)

## Runs in

- [task_calendar_creation](/workflow/task-calendar-creation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/obligation-mining-tracking-end-to-end.md)

# Citations

- [Obligation Mining & Tracking Procurement Policy Guide](/documents/obligation-mining-tracking-policy-guide.md)
