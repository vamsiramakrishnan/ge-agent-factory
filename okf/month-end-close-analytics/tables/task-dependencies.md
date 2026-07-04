---
type: Data Entity
title: task_dependencies
description: Data entity task_dependencies owned by BlackLine.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# task_dependencies

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| task_id | ref | required |
| depends_on_task_id | ref | required |
| wait_time_hours | number | required |

# Citations

- Owned by [BlackLine](/systems/blackline.md)
