---
type: Data Entity
title: matching_rules
description: Data entity matching_rules owned by BlackLine.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# matching_rules

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
