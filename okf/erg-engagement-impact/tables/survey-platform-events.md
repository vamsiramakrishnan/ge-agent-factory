---
type: Data Entity
title: survey_platform_events
description: Data entity survey_platform_events owned by Survey Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# survey_platform_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| survey_platform_record_id | ref | required |

# Citations

- Owned by [Survey Platform](/systems/survey-platform.md)
