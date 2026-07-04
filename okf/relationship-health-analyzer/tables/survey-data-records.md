---
type: Data Entity
title: survey_data_records
description: Data entity survey_data_records owned by Survey Data.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# survey_data_records

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

- Owned by [Survey Data](/systems/survey-data.md)
