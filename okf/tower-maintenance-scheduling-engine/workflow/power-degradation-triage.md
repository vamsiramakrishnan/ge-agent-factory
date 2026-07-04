---
type: Workflow Stage
title: Power Degradation Triage
description: Flag degrading battery/generator trends surfaced in analytics_events and alert_actions and convert them into priority field_work_orders ahead of storm season rather than waiting for the next standard PM cycle.
source_id: power_degradation_triage
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Power Degradation Triage

Flag degrading battery/generator trends surfaced in analytics_events and alert_actions and convert them into priority field_work_orders ahead of storm season rather than waiting for the next standard PM cycle.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)

Next: [Runbook Gate & Dispatch](/workflow/runbook-gate-dispatch.md)
