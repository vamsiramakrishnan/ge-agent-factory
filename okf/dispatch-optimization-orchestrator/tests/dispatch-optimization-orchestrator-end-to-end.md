---
type: Eval Scenario
title: Run the Dispatch Optimization Orchestrator workflow for the current period. C...
description: "Run the Dispatch Optimization Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dispatch-optimization-orchestrator-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Dispatch Optimization Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [sla-baseline-risk-scoring](/queries/sla-baseline-risk-scoring.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

## Success rubric

Action route executed against Oracle Field Service, with audit-trail entry and Field Operations Supervisor notified of outcomes.

# Citations

- [Dispatch Optimization Orchestrator Service Assurance Runbook](/documents/dispatch-optimization-orchestrator-assurance-runbook.md)
