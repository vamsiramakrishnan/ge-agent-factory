---
type: Data Entity
title: survey_tools_records
description: Data entity survey_tools_records owned by Survey Tools.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# survey_tools_records

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

- Owned by [Survey Tools](/systems/survey-tools.md)
