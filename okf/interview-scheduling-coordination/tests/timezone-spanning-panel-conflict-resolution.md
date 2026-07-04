---
type: Eval Scenario
title: "Schedule interviews for candidate C-67890 with a 3-person panel spanning US-W..."
description: "Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate."
source_id: "timezone-spanning-panel-conflict-resolution"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.

## Validates

- [panel-availability](/queries/panel-availability.md)

## Mechanisms to call

- [query_greenhouse_candidates](/tools/query-greenhouse-candidates.md)
- [query_greenhouse_interview_panels](/tools/query-greenhouse-interview-panels.md)
- [query_workday_interviewers](/tools/query-workday-interviewers.md)
- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [evidence_scheduling_etiquette_sop](/tools/evidence-scheduling-etiquette-sop.md)

## Success rubric

Either a slot that respects all time zones with buffer, or escalation to recruiting coordinator explaining the constraint conflict.

# Citations

- [Scheduling Etiquette SOP](/documents/scheduling-etiquette-sop.md)
