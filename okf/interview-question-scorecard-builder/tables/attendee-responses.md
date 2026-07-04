---
type: Data Entity
title: attendee_responses
description: Data entity attendee_responses owned by Google Calendar.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# attendee_responses

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| respondent_id | seq | required |
| question_code | lorem.words | required |
| score | number | required |
| comment | lorem.sentence |  |
| submitted_at | date | required |

# Citations

- Owned by [Google Calendar](/systems/google-calendar.md)
