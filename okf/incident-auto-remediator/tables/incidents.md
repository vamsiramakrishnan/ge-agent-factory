---
type: Data Entity
title: incidents
description: Data entity incidents owned by PagerDuty.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# incidents

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| alert_id | ref | required |
| severity | enum | required; values: Sev-4, Sev-3, Sev-2, Sev-1 |
| status | enum | required; values: triggered, acknowledged, resolved |
| fired_at | date.recent | required |
| outcome | enum | required; values: auto_resolved, manual_resolved, escalated |

# Citations

- Owned by [PagerDuty](/systems/pagerduty.md)
