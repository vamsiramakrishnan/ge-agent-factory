---
type: Workflow Stage
title: Historian Window Pull
description: Pull the surrounding sensor_readings window and resolve asset_tag_hierarchies from OSIsoft PI System via query_osisoft_pi_system_sensor_readings and query_osisoft_pi_system_asset_tag_hierarchies to anchor the event to a physical equipment_unit and confirm functional_location_active status.
source_id: historian_window_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Historian Window Pull

Pull the surrounding sensor_readings window and resolve asset_tag_hierarchies from OSIsoft PI System via query_osisoft_pi_system_sensor_readings and query_osisoft_pi_system_asset_tag_hierarchies to anchor the event to a physical equipment_unit and confirm functional_location_active status.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

Next: [Failure Signature Correlation](/workflow/failure-signature-correlation.md)
