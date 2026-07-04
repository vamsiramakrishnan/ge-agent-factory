---
type: Eval Scenario
title: "It's the last day of the demand-ratchet true-up window. The OSIsoft PI System..."
description: "It's the last day of the demand-ratchet true-up window. The OSIsoft PI System sensor_readings for asset 151204 (tag_id 519087) were last refreshed 30 hours ago, and the proposed conservation action would only shed load for 2 hours — right across the site's 15-minute peak demand interval. Should we publish the recommendation to Sphera EHS now?"
source_id: "energy-intensity-monitoring-engine-stale-evidence-ratchet-edge"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# It's the last day of the demand-ratchet true-up window. The OSIsoft PI System sensor_readings for asset 151204 (tag_id 519087) were last refreshed 30 hours ago, and the proposed conservation action would only shed load for 2 hours — right across the site's 15-minute peak demand interval. Should we publish the recommendation to Sphera EHS now?

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
- [Site Utility Rate & Demand Charge Schedule](/documents/site-utility-rate-and-demand-charge-schedule.md)
