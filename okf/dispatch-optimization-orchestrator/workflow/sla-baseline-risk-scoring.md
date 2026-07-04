---
type: Workflow Stage
title: "SLA & Baseline Risk Scoring"
description: "Score service_appointments arrival_window jeopardy and field_work_orders repeat_within_30d exposure against analytics_events and historical_metrics baselines in BigQuery to prioritize the Field Operations Supervisor's exception queue."
source_id: sla_baseline_risk_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SLA & Baseline Risk Scoring

Score service_appointments arrival_window jeopardy and field_work_orders repeat_within_30d exposure against analytics_events and historical_metrics baselines in BigQuery to prioritize the Field Operations Supervisor's exception queue.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

Next: [Emergency Insertion & Re-Optimization](/workflow/emergency-insertion-re-optimization.md)
