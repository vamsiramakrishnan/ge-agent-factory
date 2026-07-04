---
type: Data Entity
title: assessment_platform_events
description: Data entity assessment_platform_events owned by Assessment Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# assessment_platform_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| assessment_platform_record_id | ref | required |

# Citations

- Owned by [Assessment Platform](/systems/assessment-platform.md)
