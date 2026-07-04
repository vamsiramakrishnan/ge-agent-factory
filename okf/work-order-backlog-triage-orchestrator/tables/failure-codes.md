---
type: Data Entity
title: failure_codes
description: Data entity failure_codes owned by IBM Maximo.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# failure_codes

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| failure_code | number | required |
| failure_mode | enum | required; values: bearing_wear, seal_leak, motor_overload, sensor_drift, belt_break, hydraulic_failure, electrical_short, lubrication_failure |
| failure_mechanism | enum | required; values: fatigue, corrosion, erosion, overload, contamination, misalignment |
| detection_method | enum | required; values: vibration_analysis, thermography, oil_analysis, operator_round, run_to_failure |
| mean_time_between_failures_hours | float | required |
| mean_time_to_repair_hours | float | required |
| occurrences_ytd | number | required |
| description | lorem.sentence |  |

# Citations

- Owned by [IBM Maximo](/systems/ibm-maximo.md)
