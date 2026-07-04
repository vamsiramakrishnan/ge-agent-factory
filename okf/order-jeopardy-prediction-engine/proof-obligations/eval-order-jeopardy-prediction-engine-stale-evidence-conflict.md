---
type: Proof Obligation
title: "Golden eval obligation — Order 7433981 (enterprise, port_in) shows fallout_status=inventory_shortfall in service_orders with due_date 2026-07-15, but the linked provisioning_task snapshot in the queue is over 40 hours old, and network_inventory_items shows the target network element already sitting in decommission_pending admin_state at 96.4% capacity_utilization_pct. BigQuery analytics_events still shows negative variance_pct for this segment's on-time delivery metric. Determine whether this order's jeopardy score is trustworthy and recommend the next action before any draft is issued."
description: golden eval proof obligation
source_id: "eval-order-jeopardy-prediction-engine-stale-evidence-conflict"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Order 7433981 (enterprise, port_in) shows fallout_status=inventory_shortfall in service_orders with due_date 2026-07-15, but the linked provisioning_task snapshot in the queue is over 40 hours old, and network_inventory_items shows the target network element already sitting in decommission_pending admin_state at 96.4% capacity_utilization_pct. BigQuery analytics_events still shows negative variance_pct for this segment's on-time delivery metric. Determine whether this order's jeopardy score is trustworthy and recommend the next action before any draft is issued.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [order-jeopardy-prediction-engine-stale-evidence-conflict](/tests/order-jeopardy-prediction-engine-stale-evidence-conflict.md)


## Mechanisms

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)

## Entities that must be referenced

- service_orders
- provisioning_tasks
- network_inventory_items
- analytics_events

## Forbidden behaviors

- scoring or drafting an action from evidence older than the staleness threshold
- calling action_netcracker_service_orchestration_draft before the evidence and citation gates are satisfied

# Citations

- [order-jeopardy-prediction-engine-assurance-runbook](/documents/order-jeopardy-prediction-engine-assurance-runbook.md)
- [enterprise-circuit-delivery-sla-schedule](/documents/enterprise-circuit-delivery-sla-schedule.md)
