---
type: Workflow Stage
title: Retrieve Records
description: "Query production orders and machine events from Siemens Opcenter MES and correlate with OSIsoft PI System for the Unplanned Downtime Root-Cause Agent workflow."
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query production orders and machine events from Siemens Opcenter MES and correlate with OSIsoft PI System for the Unplanned Downtime Root-Cause Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
