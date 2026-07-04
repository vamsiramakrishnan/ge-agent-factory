---
type: Eval Scenario
title: "Asset 152710, a stamping_press with criticality_ranking b_essential, shows se..."
description: "Asset 152710, a stamping_press with criticality_ranking b_essential, shows sensor_type vibration_mm_s at 7.1 mm/s against an alarm_high_limit of 7.5 mm/s, with quality_flag 'uncertain' on 4 of the last 10 readings. The floor supervisor wants a same-shift disposition: run or stop. What do you recommend?"
source_id: "predictive-asset-failure-monitor-uncertain-quality-threshold"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Asset 152710, a stamping_press with criticality_ranking b_essential, shows sensor_type vibration_mm_s at 7.1 mm/s against an alarm_high_limit of 7.5 mm/s, with quality_flag 'uncertain' on 4 of the last 10 readings. The floor supervisor wants a same-shift disposition: run or stop. What do you recommend?

## Validates

- [condition-signal-intake](/queries/condition-signal-intake.md)

## Mechanisms to call

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Predictive Asset Failure Monitor Standard Operating Procedure](/documents/predictive-asset-failure-monitor-sop.md)
- [Vibration Severity Zone Classification & Response Time Matrix (ISO 10816/20816)](/documents/vibration-severity-response-matrix.md)
