---
type: Data Entity
title: feedback_records
description: Data entity feedback_records owned by Culture Amp.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# feedback_records

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

- Owned by [Culture Amp](/systems/culture-amp.md)
