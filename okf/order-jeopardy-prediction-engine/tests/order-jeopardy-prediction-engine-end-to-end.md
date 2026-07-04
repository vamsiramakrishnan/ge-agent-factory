---
type: Eval Scenario
title: Run the Order Jeopardy Prediction Engine workflow for the current period. Cit...
description: "Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "order-jeopardy-prediction-engine-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)
- [action_netcracker_service_orchestration_draft](/tools/action-netcracker-service-orchestration-draft.md)

## Success rubric

Action draft executed against Netcracker Service Orchestration, with audit-trail entry and Delivery Program Manager notified of outcomes.

# Citations

- [Order Jeopardy Prediction Engine Service Assurance Runbook](/documents/order-jeopardy-prediction-engine-assurance-runbook.md)
