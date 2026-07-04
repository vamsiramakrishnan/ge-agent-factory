---
type: Workflow Stage
title: Retrieve Records
description: Query safety incidents and permit records from Sphera EHS and correlate with OSIsoft PI System for the Energy Intensity Monitoring Engine workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query safety incidents and permit records from Sphera EHS and correlate with OSIsoft PI System for the Energy Intensity Monitoring Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
