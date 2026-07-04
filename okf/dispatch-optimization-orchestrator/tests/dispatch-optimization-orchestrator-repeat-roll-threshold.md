---
type: Eval Scenario
title: Work order 30184773 is a repair_fiber job with 3 truck_rolls already logged a...
description: "Work order 30184773 is a repair_fiber job with 3 truck_rolls already logged and repeat_within_30d flagged true, dispatch_date 2026-07-06. BigQuery's historical baseline shows the repeat-truck-roll rate for repair_fiber jobs at this garage running 40% above the network average this month. Approve the fourth truck roll and route it now."
source_id: "dispatch-optimization-orchestrator-repeat-roll-threshold"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order 30184773 is a repair_fiber job with 3 truck_rolls already logged and repeat_within_30d flagged true, dispatch_date 2026-07-06. BigQuery's historical baseline shows the repeat-truck-roll rate for repair_fiber jobs at this garage running 40% above the network average this month. Approve the fourth truck roll and route it now.

## Validates

- [sla-baseline-risk-scoring](/queries/sla-baseline-risk-scoring.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Dispatch Optimization Orchestrator Service Assurance Runbook](/documents/dispatch-optimization-orchestrator-assurance-runbook.md)
