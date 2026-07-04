---
type: Proof Obligation
title: "Golden eval obligation — Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse."
description: golden eval proof obligation
source_id: "eval-happy-path-full-panel-scheduling"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [happy-path-full-panel-scheduling](/tests/happy-path-full-panel-scheduling.md)


## Mechanisms

- [query_greenhouse_candidates](/tools/query-greenhouse-candidates.md)
- [query_greenhouse_interview_panels](/tools/query-greenhouse-interview-panels.md)
- [query_workday_interviewers](/tools/query-workday-interviewers.md)
- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [action_google_calendar_create_event](/tools/action-google-calendar-create-event.md)
- [action_greenhouse_log_scheduled_interview](/tools/action-greenhouse-log-scheduled-interview.md)
- [evidence_interview_panel_policy](/tools/evidence-interview-panel-policy.md)
- [evidence_scheduling_etiquette_sop](/tools/evidence-scheduling-etiquette-sop.md)

## Entities that must be referenced

- candidates
- interview_panels
- interviewers
- scheduled_interviews

## Forbidden behaviors

- do not invent a Zoom link
- do not ignore timezone-buffer SOP
- do not schedule interviewer with do_not_schedule flag

# Citations

- [interview-panel-composition-policy](/documents/interview-panel-composition-policy.md)
- [scheduling-etiquette-sop](/documents/scheduling-etiquette-sop.md)
