---
type: Data Entity
title: roi_reports
description: Data entity roi_reports owned by Looker.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# roi_reports

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| period | enum | required; values: week, month, quarter |
| top_campaign_id | ref | required |
| narrative | lorem.paragraphs | required |
| recommendations | lorem.sentences | required |
| created_at | date.recent | required |

# Citations

- Owned by [Looker](/systems/looker.md)
