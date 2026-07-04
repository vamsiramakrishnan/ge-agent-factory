---
type: Data Entity
title: downtime_events
description: Data entity downtime_events owned by OSIsoft PI System.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# downtime_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| event_number | number | required |
| asset_number | number | required |
| downtime_category | enum | required; values: planned_maintenance, changeover, breakdown, material_shortage, quality_stop, operator_unavailable, minor_stop |
| duration_minutes | number | required |
| oee_loss_category | enum | required; values: availability, performance, quality |
| constraint_asset | boolean | required |
| reason_code | number | required |
| start_time | date | required |
| reported_by | person.fullName |  |
| sensor_reading_id | ref | required |

# Citations

- Owned by [OSIsoft PI System](/systems/osisoft-pi-system.md)
