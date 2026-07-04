---
type: Proof Obligation
title: "Golden eval obligation — Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate."
description: golden eval proof obligation
source_id: "eval-timezone-spanning-panel-conflict-resolution"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [timezone-spanning-panel-conflict-resolution](/tests/timezone-spanning-panel-conflict-resolution.md)


## Mechanisms

- [query_greenhouse_candidates](/tools/query-greenhouse-candidates.md)
- [query_greenhouse_interview_panels](/tools/query-greenhouse-interview-panels.md)
- [query_workday_interviewers](/tools/query-workday-interviewers.md)
- [query_google_calendar_availability](/tools/query-google-calendar-availability.md)
- [evidence_scheduling_etiquette_sop](/tools/evidence-scheduling-etiquette-sop.md)

## Entities that must be referenced

- candidates
- interview_panels
- interviewers

## Forbidden behaviors

- do not violate timezone-buffer
- do not schedule during travel block

# Citations

- [scheduling-etiquette-sop](/documents/scheduling-etiquette-sop.md)
