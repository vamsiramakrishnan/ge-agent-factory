---
type: Eval Scenario
title: "Line 3's OSIsoft PI System sensor_readings show asset 148802 (tag_id 512340) ..."
description: "Line 3's OSIsoft PI System sensor_readings show asset 148802 (tag_id 512340) running 22% above its alarm_high_limit for six straight hours on 2026-06-29, but BigQuery historical_metrics for that same period shows energy intensity within baseline for the line. Reconcile the two before recommending a publish."
source_id: "energy-intensity-monitoring-engine-conflicting-readings"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Line 3's OSIsoft PI System sensor_readings show asset 148802 (tag_id 512340) running 22% above its alarm_high_limit for six straight hours on 2026-06-29, but BigQuery historical_metrics for that same period shows energy intensity within baseline for the line. Reconcile the two before recommending a publish.

## Validates

- [equipment-attribution-downtime-cross-check](/queries/equipment-attribution-downtime-cross-check.md)

## Mechanisms to call

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Energy Intensity Monitoring Engine Standard Operating Procedure](/documents/energy-intensity-monitoring-engine-sop.md)
