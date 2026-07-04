---
type: Data Entity
title: scheduled_interviews
description: Data entity scheduled_interviews owned by Greenhouse.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# scheduled_interviews

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| candidate_id | ref | required |
| panel_id | ref | required |
| slot_start | date.futureDate | required |
| slot_end | date.futureDate | required |
| zoom_link | internet.url | required |
| status | enum | required; values: scheduled, confirmed, rescheduled, completed, cancelled |

# Citations

- Owned by [Greenhouse](/systems/greenhouse.md)
