---
type: Eval Scenario
title: "Run the Unplanned Downtime Root-Cause Agent workflow for the current period. ..."
description: "Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "unplanned-downtime-root-cause-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)

## Success rubric

Action escalate executed against Siemens Opcenter MES, with audit-trail entry and Plant Manager notified of outcomes.

# Citations

- [Unplanned Downtime Root-Cause Agent Standard Operating Procedure](/documents/unplanned-downtime-root-cause-agent-sop.md)
