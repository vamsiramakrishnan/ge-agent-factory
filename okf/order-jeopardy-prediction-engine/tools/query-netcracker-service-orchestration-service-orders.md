---
type: Agent Tool
title: query_netcracker_service_orchestration_service_orders
description: Retrieve service orders from Netcracker Service Orchestration for the Order Jeopardy Prediction Engine workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_netcracker_service_orchestration_service_orders

Retrieve service orders from Netcracker Service Orchestration for the Order Jeopardy Prediction Engine workflow.

- **Kind:** query
- **Source system:** [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)

## Inputs

- order_number
- date_range

## Outputs

- service_orders_records
- service_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [order_task_intake](/workflow/order-task-intake.md)
- [runbook_sla_evidence_validation](/workflow/runbook-sla-evidence-validation.md)
- [recovery_drafting_notification_audit](/workflow/recovery-drafting-notification-audit.md)

## Evals

- [Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/order-jeopardy-prediction-engine-end-to-end.md)
- [Order 7433981 (enterprise, port_in) shows fallout_status=inventory_shortfall in service_orders with due_date 2026-07-15, but the linked provisioning_task snapshot in the queue is over 40 hours old, and network_inventory_items shows the target network element already sitting in decommission_pending admin_state at 96.4% capacity_utilization_pct. BigQuery analytics_events still shows negative variance_pct for this segment's on-time delivery metric. Determine whether this order's jeopardy score is trustworthy and recommend the next action before any draft is issued.](/tests/order-jeopardy-prediction-engine-stale-evidence-conflict.md)
- [Order 7401552 is a port_in for an enterprise customer, entered 2026-07-02T09:00:00Z, still order_status=in_flight with fallout_status=lnp_delay as of 2026-07-04T08:30:00Z — just under 48 hours elapsed. Provisioning task 941198432 (task_type=number_activation) has retry_count=3 with error_code=data_mismatch on all three attempts against target_ne_id 214730. The requesting manager wants the port pushed through today via manual override. Advise on the correct path.](/tests/order-jeopardy-prediction-engine-port-in-interval-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- order_number
- date_range

## Produces

- service_orders_records
- service_orders_summary

# Examples

```
query_netcracker_service_orchestration_service_orders(order_number=<order_number>, date_range=<date_range>)
```

# Citations

- [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
