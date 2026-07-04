---
type: Workflow Stage
title: Condition Signal Intake
description: "Pull vibration_mm_s, temperature_c, pressure_bar, and motor_current_amps sensor_readings plus asset_tag_hierarchies from the OSIsoft PI System and resolve each tag_id to its asset_registry_entries record in IBM Maximo."
source_id: condition_signal_intake
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Condition Signal Intake

Pull vibration_mm_s, temperature_c, pressure_bar, and motor_current_amps sensor_readings plus asset_tag_hierarchies from the OSIsoft PI System and resolve each tag_id to its asset_registry_entries record in IBM Maximo.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

Next: [Degradation Scoring & RUL Estimation](/workflow/degradation-scoring-rul-estimation.md)
