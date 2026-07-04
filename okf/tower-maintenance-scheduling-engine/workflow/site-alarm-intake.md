---
type: Workflow Stage
title: "Site & Alarm Intake"
description: "Pull open field_work_orders and technician_schedules from Oracle Field Service and correlate against Splunk log_events and alert_actions to see which tower sites currently have unresolved alarms or in-flight dispatches."
source_id: site_alarm_intake
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Site & Alarm Intake

Pull open field_work_orders and technician_schedules from Oracle Field Service and correlate against Splunk log_events and alert_actions to see which tower sites currently have unresolved alarms or in-flight dispatches.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)

Next: [Risk-Ranked Schedule Build](/workflow/risk-ranked-schedule-build.md)
