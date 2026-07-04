---
type: Workflow Stage
title: Remote Diagnostic Battery
description: "Run the line, CPE, and provisioning check sequence (ONT reset, profile re-push, firmware verification) against the work order's premise and log results alongside BigQuery analytics_events readings for that circuit."
source_id: remote_diagnostic_battery
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Remote Diagnostic Battery

Run the line, CPE, and provisioning check sequence (ONT reset, profile re-push, firmware verification) against the work order's premise and log results alongside BigQuery analytics_events readings for that circuit.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

Next: [No-Fault-Found Risk Scoring](/workflow/no-fault-found-risk-scoring.md)
