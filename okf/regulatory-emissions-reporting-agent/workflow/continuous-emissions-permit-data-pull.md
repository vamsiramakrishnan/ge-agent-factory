---
type: Workflow Stage
title: "Continuous Emissions & Permit Data Pull"
description: "Pull today's emissions_readings and permit_records from Sphera EHS and correlate them with sensor_readings from the OSIsoft PI System so every CEMS-derived co2e_tonnes value has a matching continuous monitor reading before the reporting clock starts."
source_id: continuous_emissions_permit_data_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Continuous Emissions & Permit Data Pull

Pull today's emissions_readings and permit_records from Sphera EHS and correlate them with sensor_readings from the OSIsoft PI System so every CEMS-derived co2e_tonnes value has a matching continuous monitor reading before the reporting clock starts.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_regulatory_emissions_reporting_agent_sop](/tools/lookup-regulatory-emissions-reporting-agent-sop.md)
- [action_sphera_ehs_draft](/tools/action-sphera-ehs-draft.md)

Next: [Rolling-Average Threshold Screening](/workflow/rolling-average-threshold-screening.md)
