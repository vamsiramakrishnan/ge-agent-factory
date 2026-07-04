---
type: Proof Obligation
title: "Golden eval obligation — Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-order-jeopardy-prediction-engine-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [order-jeopardy-prediction-engine-end-to-end](/tests/order-jeopardy-prediction-engine-end-to-end.md)


## Mechanisms

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)
- [action_netcracker_service_orchestration_draft](/tools/action-netcracker-service-orchestration-draft.md)

## Entities that must be referenced

- service_orders
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [order-jeopardy-prediction-engine-assurance-runbook](/documents/order-jeopardy-prediction-engine-assurance-runbook.md)
