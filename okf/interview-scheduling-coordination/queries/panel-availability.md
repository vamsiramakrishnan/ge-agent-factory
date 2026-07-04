---
type: Query Capability
title: Identify required interviewers from Greenhouse stage configuration. Scan Goog...
description: Identify required interviewers from Greenhouse stage configuration. Scan Google Calendar for availability across panelists and candidate.
source_id: "panel-availability"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identify required interviewers from Greenhouse stage configuration. Scan Google Calendar for availability across panelists and candidate.

## Tools used

- [query_greenhouse_candidates](/tools/query-greenhouse-candidates.md)
- [query_greenhouse_interview_panels](/tools/query-greenhouse-interview-panels.md)
- [query_workday_interviewers](/tools/query-workday-interviewers.md)
- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [action_google_calendar_create_event](/tools/action-google-calendar-create-event.md)
- [action_greenhouse_log_scheduled_interview](/tools/action-greenhouse-log-scheduled-interview.md)
- [evidence_interview_panel_policy](/tools/evidence-interview-panel-policy.md)
- [evidence_scheduling_etiquette_sop](/tools/evidence-scheduling-etiquette-sop.md)

## Runs in

- [panel_availability](/workflow/panel-availability.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)
- [Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.](/tests/timezone-spanning-panel-conflict-resolution.md)
- [Schedule an interview with interviewer INT-001, who has a 'do_not_schedule' flag in Workday. What does the agent do?](/tests/interviewer-conflict-refusal.md)

# Citations

- [Interview Panel Composition Policy](/documents/interview-panel-composition-policy.md)
- [Scheduling Etiquette SOP](/documents/scheduling-etiquette-sop.md)
