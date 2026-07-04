---
type: Data Entity
title: close_tasks
description: Data entity close_tasks owned by BlackLine.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# close_tasks

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| cycle_id | ref | required |
| task_name | lorem.sentence | required |
| assignee | person.fullName | required |
| status | enum | required; values: not_started, in_progress, completed, blocked |
| planned_duration_hours | number | required |
| actual_duration_hours | number | required |
| dependency_id | ref |  |

# Citations

- Owned by [BlackLine](/systems/blackline.md)
