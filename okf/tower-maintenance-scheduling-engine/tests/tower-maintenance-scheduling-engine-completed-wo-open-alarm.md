---
type: Eval Scenario
title: "Work order 30481022 at premise 4417290 shows wo_status='completed' for site_m..."
description: "Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held."
source_id: "tower-maintenance-scheduling-engine-completed-wo-open-alarm"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held.

## Validates

- [site-alarm-intake](/queries/site-alarm-intake.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Tower Maintenance Scheduling Engine Service Assurance Runbook](/documents/tower-maintenance-scheduling-engine-assurance-runbook.md)
