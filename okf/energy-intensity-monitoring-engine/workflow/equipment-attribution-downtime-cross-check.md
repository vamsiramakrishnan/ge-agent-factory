---
type: Workflow Stage
title: "Equipment Attribution & Downtime Cross-Check"
description: "Walk asset_tag_hierarchies down to the equipment_unit level and cross-reference downtime_events reason codes in OSIsoft PI System to name the specific asset most likely driving the anomaly, ruling out planned_maintenance or changeover explanations."
source_id: equipment_attribution_downtime_cross_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Equipment Attribution & Downtime Cross-Check

Walk asset_tag_hierarchies down to the equipment_unit level and cross-reference downtime_events reason codes in OSIsoft PI System to name the specific asset most likely driving the anomaly, ruling out planned_maintenance or changeover explanations.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)

Next: [SOP & Permit Evidence Gate](/workflow/sop-permit-evidence-gate.md)
