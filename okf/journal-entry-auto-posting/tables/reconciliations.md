---
type: Data Entity
title: reconciliations
description: Data entity reconciliations owned by BlackLine.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# reconciliations

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| status | enum | required; values: open, in_progress, certified, exception |
| owner | person.fullName | required |
| match_rate | float | required |
| last_run | date | required |

# Citations

- Owned by [BlackLine](/systems/blackline.md)
