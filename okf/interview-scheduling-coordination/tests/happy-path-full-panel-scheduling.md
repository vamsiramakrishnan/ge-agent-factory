---
type: Eval Scenario
title: "Schedule a final-round interview for candidate C-12345 at requisition REQ-789..."
description: "Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse."
source_id: "happy-path-full-panel-scheduling"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.

## Validates

- [panel-availability](/queries/panel-availability.md)

## Mechanisms to call

- [query_greenhouse_candidates](/tools/query-greenhouse-candidates.md)
- [query_greenhouse_interview_panels](/tools/query-greenhouse-interview-panels.md)
- [query_workday_interviewers](/tools/query-workday-interviewers.md)
- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [action_google_calendar_create_event](/tools/action-google-calendar-create-event.md)
- [action_greenhouse_log_scheduled_interview](/tools/action-greenhouse-log-scheduled-interview.md)
- [evidence_interview_panel_policy](/tools/evidence-interview-panel-policy.md)
- [evidence_scheduling_etiquette_sop](/tools/evidence-scheduling-etiquette-sop.md)

## Success rubric

Calendar events created for all panelists with Zoom link and prep materials, confirmations sent, and Greenhouse interview record updated with event ID and status.

# Citations

- [Interview Panel Composition Policy](/documents/interview-panel-composition-policy.md)
- [Scheduling Etiquette SOP](/documents/scheduling-etiquette-sop.md)
