---
type: Workflow Stage
title: "Order & Task Intake"
description: "Pull open service_orders and provisioning_tasks from Netcracker Service Orchestration via query_netcracker_service_orchestration_service_orders, scoped to in_flight and entered orders approaching due_date."
source_id: order_task_intake
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order & Task Intake

Pull open service_orders and provisioning_tasks from Netcracker Service Orchestration via query_netcracker_service_orchestration_service_orders, scoped to in_flight and entered orders approaching due_date.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)
- [action_netcracker_service_orchestration_draft](/tools/action-netcracker-service-orchestration-draft.md)

Next: [Baseline Comparison & Slip Scoring](/workflow/baseline-comparison-slip-scoring.md)
