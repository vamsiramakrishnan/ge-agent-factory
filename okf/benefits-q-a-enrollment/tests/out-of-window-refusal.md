---
type: Eval Scenario
title: I had a baby 11 months ago — can you still add my child to family coverage to...
description: "I had a baby 11 months ago — can you still add my child to family coverage today?"
source_id: "out-of-window-refusal"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# I had a baby 11 months ago — can you still add my child to family coverage today?

## Validates

- [question-understanding](/queries/question-understanding.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_life_events](/tools/query-workday-life-events.md)
- [evidence_life_event_sop](/tools/evidence-life-event-sop.md)

## Success rubric

Refuse the enrollment, cite the QLE window from the SOP, and route the employee to the next open enrollment.

# Citations

- [Qualified Life Event Processing SOP](/documents/life-event-processing-sop.md)
