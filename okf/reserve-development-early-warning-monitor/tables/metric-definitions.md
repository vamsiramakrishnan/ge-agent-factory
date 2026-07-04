---
type: Data Entity
title: metric_definitions
description: Data entity metric_definitions owned by Looker.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# metric_definitions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| period | enum | required; values: day, week, month, quarter |
| metric_name | lorem.words | required |
| value | float | required |
| variance_pct | float | required |
| computed_at | date | required |

# Citations

- Owned by [Looker](/systems/looker.md)
