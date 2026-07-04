---
type: Data Entity
title: retrospective_reports
description: Data entity retrospective_reports owned by Looker.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# retrospective_reports

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| cycle_id | ref | required |
| body | lorem.paragraph | required |
| recommendations | lorem.paragraph | required |

# Citations

- Owned by [Looker](/systems/looker.md)
