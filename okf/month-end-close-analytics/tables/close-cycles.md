---
type: Data Entity
title: close_cycles
description: Data entity close_cycles owned by BlackLine.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# close_cycles

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| cycle_id | lorem.sentence | required |
| target_days | number | required |
| actual_days | number | required |
| status | enum | required; values: open, closed, reviewed |

# Citations

- Owned by [BlackLine](/systems/blackline.md)
