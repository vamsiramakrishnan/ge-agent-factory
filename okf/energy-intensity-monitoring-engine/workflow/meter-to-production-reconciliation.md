---
type: Workflow Stage
title: "Meter-to-Production Reconciliation"
description: "Pull sensor_readings and asset_tag_hierarchies from OSIsoft PI System and join them against production output so kWh consumption lands per line and per product, not just per meter."
source_id: meter_to_production_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Meter-to-Production Reconciliation

Pull sensor_readings and asset_tag_hierarchies from OSIsoft PI System and join them against production output so kWh consumption lands per line and per product, not just per meter.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)

Next: [Baseline & Anomaly Detection](/workflow/baseline-anomaly-detection.md)
