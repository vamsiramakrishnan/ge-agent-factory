---
type: Data Entity
title: survey_responses
description: Data entity survey_responses owned by Qualtrics.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# survey_responses

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

- Owned by [Qualtrics](/systems/qualtrics.md)
