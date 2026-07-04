---
type: Workflow Stage
title: "SOP & Permit Evidence Gate"
description: "Validate the finding against the Energy Intensity Monitoring Engine Standard Operating Procedure and check permit_records and emissions_readings in Sphera EHS so a conservation recommendation never collides with an active LOTO, hot-work, or Title V constraint."
source_id: sop_permit_evidence_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP & Permit Evidence Gate

Validate the finding against the Energy Intensity Monitoring Engine Standard Operating Procedure and check permit_records and emissions_readings in Sphera EHS so a conservation recommendation never collides with an active LOTO, hot-work, or Title V constraint.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

Next: [Conservation Action Publish & Dashboard Refresh](/workflow/conservation-action-publish-dashboard-refresh.md)
