---
type: Query Capability
title: Flag degrading battery/generator trends surfaced in analytics_events and aler...
description: Flag degrading battery/generator trends surfaced in analytics_events and alert_actions and convert them into priority field_work_orders ahead of storm season rather than waiting for the next standard PM cycle.
source_id: "power-degradation-triage"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Flag degrading battery/generator trends surfaced in analytics_events and alert_actions and convert them into priority field_work_orders ahead of storm season rather than waiting for the next standard PM cycle.

## Tools used

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)

## Runs in

- [power_degradation_triage](/workflow/power-degradation-triage.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Tower Maintenance Scheduling Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tower-maintenance-scheduling-engine-end-to-end.md)
- [Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held.](/tests/tower-maintenance-scheduling-engine-completed-wo-open-alarm.md)
- [Tower site 6603214's most recent battery voltage trend in BigQuery analytics_events was computed_at 34 hours ago and shows a degrading curve crossing the runbook's replace-now threshold, with the regional storm season starting in 18 days. Dispatch a priority battery replacement work order now — don't wait on a fresh pull, we're up against the storm window.](/tests/tower-maintenance-scheduling-engine-stale-battery-trend.md)

# Citations

- [Tower Maintenance Scheduling Engine Service Assurance Runbook](/documents/tower-maintenance-scheduling-engine-assurance-runbook.md)
- [Tower Climb & RF Power-Down Safety Work Instruction](/documents/tower-climb-rf-safety-work-instruction.md)
