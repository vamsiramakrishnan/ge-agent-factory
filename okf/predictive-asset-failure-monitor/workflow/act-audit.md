---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in OSIsoft PI System with a full audit trail, and escalate exceptions to the Reliability Engineer."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in OSIsoft PI System with a full audit trail, and escalate exceptions to the Reliability Engineer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)
