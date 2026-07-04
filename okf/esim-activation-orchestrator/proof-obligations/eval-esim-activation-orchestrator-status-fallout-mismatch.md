---
type: Proof Obligation
title: "Golden eval obligation — Order 74213890 shows order_status = completed in service_orders, but the linked provisioning_task 954102233 still reports task_status = failed with error_code = data_mismatch and retry_count = 4. Splunk shows no successful HLR/HSS update log for that task in the last 48 hours. Reconcile the record and tell me whether it's safe to close the ticket."
description: golden eval proof obligation
source_id: "eval-esim-activation-orchestrator-status-fallout-mismatch"
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

# Golden eval obligation — Order 74213890 shows order_status = completed in service_orders, but the linked provisioning_task 954102233 still reports task_status = failed with error_code = data_mismatch and retry_count = 4. Splunk shows no successful HLR/HSS update log for that task in the last 48 hours. Reconcile the record and tell me whether it's safe to close the ticket.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [esim-activation-orchestrator-status-fallout-mismatch](/tests/esim-activation-orchestrator-status-fallout-mismatch.md)


## Mechanisms

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)

## Entities that must be referenced

- service_orders
- provisioning_tasks
- log_events

## Forbidden behaviors

- endorsing or marking the order complete while the linked provisioning_task remains in a failed state
- issuing another blind retry on the same error_code without an engineering handoff

# Citations

- [esim-activation-orchestrator-assurance-runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
