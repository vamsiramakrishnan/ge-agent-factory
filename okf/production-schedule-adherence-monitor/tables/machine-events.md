---
type: Data Entity
title: machine_events
description: Data entity machine_events owned by Siemens Opcenter MES.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# machine_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| asset_number | number | required |
| event_type | enum | required; values: cycle_complete, state_change, warning_alarm, fault_alarm, e_stop, guard_door_open |
| event_code | number | required |
| severity | enum | required; values: info, warning, critical |
| event_timestamp | date | required |
| duration_seconds | number |  |
| acknowledged | boolean | required |
| operator_name | person.fullName |  |
| production_order_id | ref | required |

# Citations

- Owned by [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
