---
type: Workflow Stage
title: "Analyze & Detect"
description: "Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Field Operations Supervisor's queue."
source_id: analyze_detect
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Analyze & Detect

Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Field Operations Supervisor's queue.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

Next: [Validate Evidence](/workflow/validate-evidence.md)
