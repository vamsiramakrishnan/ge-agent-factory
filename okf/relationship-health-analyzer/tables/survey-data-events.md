---
type: Data Entity
title: survey_data_events
description: Data entity survey_data_events owned by Survey Data.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# survey_data_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| survey_data_record_id | ref | required |

# Citations

- Owned by [Survey Data](/systems/survey-data.md)
