---
type: Source System
title: OSIsoft PI System
description: "sensor readings, asset tag hierarchies, downtime events records"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# OSIsoft PI System

sensor readings, asset tag hierarchies, downtime events records

- **Protocol:** PI Web API
- **Local backing:** bigquery

# Schema

- [sensor_readings](/tables/sensor-readings.md)
- [asset_tag_hierarchies](/tables/asset-tag-hierarchies.md)
- [downtime_events](/tables/downtime-events.md)

## Tools using this system

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)
- [query_osisoft_pi_system_asset_tag_hierarchies](/tools/query-osisoft-pi-system-asset-tag-hierarchies.md)
- [query_osisoft_pi_system_downtime_events](/tools/query-osisoft-pi-system-downtime-events.md)
- [lookup_vibration_severity_response_matrix](/tools/lookup-vibration-severity-response-matrix.md)
