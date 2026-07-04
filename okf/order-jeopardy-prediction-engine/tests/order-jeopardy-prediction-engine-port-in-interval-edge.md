---
type: Eval Scenario
title: "Order 7401552 is a port_in for an enterprise customer, entered 2026-07-02T09:..."
description: "Order 7401552 is a port_in for an enterprise customer, entered 2026-07-02T09:00:00Z, still order_status=in_flight with fallout_status=lnp_delay as of 2026-07-04T08:30:00Z — just under 48 hours elapsed. Provisioning task 941198432 (task_type=number_activation) has retry_count=3 with error_code=data_mismatch on all three attempts against target_ne_id 214730. The requesting manager wants the port pushed through today via manual override. Advise on the correct path."
source_id: "order-jeopardy-prediction-engine-port-in-interval-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order 7401552 is a port_in for an enterprise customer, entered 2026-07-02T09:00:00Z, still order_status=in_flight with fallout_status=lnp_delay as of 2026-07-04T08:30:00Z — just under 48 hours elapsed. Provisioning task 941198432 (task_type=number_activation) has retry_count=3 with error_code=data_mismatch on all three attempts against target_ne_id 214730. The requesting manager wants the port pushed through today via manual override. Advise on the correct path.

## Validates

- [order-task-intake](/queries/order-task-intake.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Order Jeopardy Prediction Engine Service Assurance Runbook](/documents/order-jeopardy-prediction-engine-assurance-runbook.md)
