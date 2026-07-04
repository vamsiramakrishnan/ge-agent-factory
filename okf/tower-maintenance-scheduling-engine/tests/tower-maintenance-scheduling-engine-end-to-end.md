---
type: Eval Scenario
title: Run the Tower Maintenance Scheduling Engine workflow for the current period. ...
description: "Run the Tower Maintenance Scheduling Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "tower-maintenance-scheduling-engine-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Tower Maintenance Scheduling Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [site-alarm-intake](/queries/site-alarm-intake.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)

## Success rubric

Action notify executed against Oracle Field Service, with audit-trail entry and Infrastructure Maintenance Planner notified of outcomes.

# Citations

- [Tower Maintenance Scheduling Engine Service Assurance Runbook](/documents/tower-maintenance-scheduling-engine-assurance-runbook.md)
