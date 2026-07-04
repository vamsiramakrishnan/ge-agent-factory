---
type: Workflow Stage
title: Retrieve Records
description: Query sensor readings and asset tag hierarchies from OSIsoft PI System and correlate with IBM Maximo for the Predictive Asset Failure Monitor workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query sensor readings and asset tag hierarchies from OSIsoft PI System and correlate with IBM Maximo for the Predictive Asset Failure Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
