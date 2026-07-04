---
type: Workflow Stage
title: "No-Fault-Found Risk Scoring"
description: "Score the open field_work_orders record's no-fault-found risk using its repeat_within_30d flag and truck_rolls count against BigQuery historical_metrics and cached_aggregates baselines to decide whether remote resolution is viable."
source_id: no_fault_found_risk_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# No-Fault-Found Risk Scoring

Score the open field_work_orders record's no-fault-found risk using its repeat_within_30d flag and truck_rolls count against BigQuery historical_metrics and cached_aggregates baselines to decide whether remote resolution is viable.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

Next: [Runbook-Gated Remediation Decision](/workflow/runbook-gated-remediation-decision.md)
