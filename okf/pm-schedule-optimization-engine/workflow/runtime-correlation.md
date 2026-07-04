---
type: Workflow Stage
title: Runtime Correlation
description: "Correlate PM findings against OSIsoft PI System sensor_readings, asset_tag_hierarchies, and downtime_events to confirm whether a zero-finding record reflects a genuinely healthy asset or an under-monitored one."
source_id: runtime_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Runtime Correlation

Correlate PM findings against OSIsoft PI System sensor_readings, asset_tag_hierarchies, and downtime_events to confirm whether a zero-finding record reflects a genuinely healthy asset or an under-monitored one.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pm_schedule_optimization_engine_sop](/tools/lookup-pm-schedule-optimization-engine-sop.md)

Next: [Interval Scoring](/workflow/interval-scoring.md)
