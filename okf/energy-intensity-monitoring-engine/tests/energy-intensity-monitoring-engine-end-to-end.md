---
type: Eval Scenario
title: Run the Energy Intensity Monitoring Engine workflow for the current period. C...
description: "Run the Energy Intensity Monitoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "energy-intensity-monitoring-engine-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Energy Intensity Monitoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [sop-permit-evidence-gate](/queries/sop-permit-evidence-gate.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

## Success rubric

Action publish executed against Sphera EHS, with audit-trail entry and Sustainability Lead notified of outcomes.

# Citations

- [Energy Intensity Monitoring Engine Standard Operating Procedure](/documents/energy-intensity-monitoring-engine-sop.md)
