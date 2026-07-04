---
type: Query Capability
title: "Execute action_siemens_opcenter_mes_escalate for repeat-offender or constrain..."
description: "Execute action_siemens_opcenter_mes_escalate for repeat-offender or constraint-asset events in Siemens Opcenter MES, attaching the sensor_readings and machine_events evidence package and notifying the Plant Manager with a full audit trail."
source_id: "escalation-evidence-package"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_siemens_opcenter_mes_escalate for repeat-offender or constraint-asset events in Siemens Opcenter MES, attaching the sensor_readings and machine_events evidence package and notifying the Plant Manager with a full audit trail.

## Tools used

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_siemens_opcenter_mes_escalate](/tools/action-siemens-opcenter-mes-escalate.md)

## Runs in

- [escalation_evidence_package](/workflow/escalation-evidence-package.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Unplanned Downtime Root-Cause Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/unplanned-downtime-root-cause-agent-end-to-end.md)
- [Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review.](/tests/unplanned-downtime-root-cause-agent-reason-code-conflict.md)
- [Asset 148902 is flagged constraint_asset=true and has been down since 2026-07-03 08:15 - that's past the 4-hour constraint-asset escalation threshold. Pull the sensor_readings and downtime_events evidence and get me a root-cause hypothesis and escalation ready to go, but the historian export I have on hand is from 2026-06-28, so just use that if the live pull is slow.](/tests/unplanned-downtime-root-cause-agent-stale-constraint-asset.md)

# Citations

- [Unplanned Downtime Root-Cause Agent Standard Operating Procedure](/documents/unplanned-downtime-root-cause-agent-sop.md)
- [Downtime Reason Code & OEE Loss Attribution Standard](/documents/downtime-reason-code-oee-standard.md)
