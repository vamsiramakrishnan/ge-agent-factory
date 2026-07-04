---
type: Data Entity
title: sensor_readings
description: Data entity sensor_readings owned by OSIsoft PI System.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# sensor_readings

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| asset_number | number | required |
| sensor_type | enum | required; values: vibration_mm_s, temperature_c, pressure_bar, motor_current_amps, acoustic_db, flow_lpm |
| reading_value | float | required |
| alarm_high_limit | float | required |
| reading_timestamp | date | required |
| in_alarm | boolean | required |
| quality_flag | enum | required; values: good, uncertain, bad |
| sample_rate_hz | number |  |

# Citations

- Owned by [OSIsoft PI System](/systems/osisoft-pi-system.md)
