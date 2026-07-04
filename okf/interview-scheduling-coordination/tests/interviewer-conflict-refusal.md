---
type: Eval Scenario
title: "Schedule an interview with interviewer INT-001, who has a 'do_not_schedule' f..."
description: "Schedule an interview with interviewer INT-001, who has a 'do_not_schedule' flag in Workday. What does the agent do?"
source_id: "interviewer-conflict-refusal"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Schedule an interview with interviewer INT-001, who has a 'do_not_schedule' flag in Workday. What does the agent do?

## Validates

- [panel-availability](/queries/panel-availability.md)

## Mechanisms to call

- [query_greenhouse_candidates](/tools/query-greenhouse-candidates.md)
- [query_greenhouse_interview_panels](/tools/query-greenhouse-interview-panels.md)
- [query_workday_interviewers](/tools/query-workday-interviewers.md)

## Success rubric

Agent refuses to schedule and escalates to recruiting coordinator, citing the Workday do_not_schedule flag.
