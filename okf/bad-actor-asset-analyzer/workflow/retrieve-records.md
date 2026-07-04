---
type: Workflow Stage
title: Retrieve Records
description: Query maintenance work orders and asset registry entries from IBM Maximo and correlate with OSIsoft PI System for the Bad Actor Asset Analyzer workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query maintenance work orders and asset registry entries from IBM Maximo and correlate with OSIsoft PI System for the Bad Actor Asset Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)
- [action_ibm_maximo_publish](/tools/action-ibm-maximo-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
