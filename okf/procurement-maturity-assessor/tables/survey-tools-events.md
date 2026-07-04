---
type: Data Entity
title: survey_tools_events
description: Data entity survey_tools_events owned by Survey Tools.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# survey_tools_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| survey_tools_record_id | ref | required |

# Citations

- Owned by [Survey Tools](/systems/survey-tools.md)
