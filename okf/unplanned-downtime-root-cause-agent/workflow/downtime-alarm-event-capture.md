---
type: Workflow Stage
title: "Downtime & Alarm Event Capture"
description: "Detect fault_alarm, e_stop, and warning_alarm machine_events in Siemens Opcenter MES alongside downtime_category events in OSIsoft PI System downtime_events, keyed by asset_number and production_order_id so the trigger window is anchored before any evidence pull begins."
source_id: downtime_alarm_event_capture
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Downtime & Alarm Event Capture

Detect fault_alarm, e_stop, and warning_alarm machine_events in Siemens Opcenter MES alongside downtime_category events in OSIsoft PI System downtime_events, keyed by asset_number and production_order_id so the trigger window is anchored before any evidence pull begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)

Next: [Historian Window Pull](/workflow/historian-window-pull.md)
