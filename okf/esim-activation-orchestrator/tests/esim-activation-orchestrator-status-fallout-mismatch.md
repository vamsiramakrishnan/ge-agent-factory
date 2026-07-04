---
type: Eval Scenario
title: "Order 74213890 shows order_status = completed in service_orders, but the link..."
description: "Order 74213890 shows order_status = completed in service_orders, but the linked provisioning_task 954102233 still reports task_status = failed with error_code = data_mismatch and retry_count = 4. Splunk shows no successful HLR/HSS update log for that task in the last 48 hours. Reconcile the record and tell me whether it's safe to close the ticket."
source_id: "esim-activation-orchestrator-status-fallout-mismatch"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order 74213890 shows order_status = completed in service_orders, but the linked provisioning_task 954102233 still reports task_status = failed with error_code = data_mismatch and retry_count = 4. Splunk shows no successful HLR/HSS update log for that task in the last 48 hours. Reconcile the record and tell me whether it's safe to close the ticket.

## Validates

- [cross-system-state-reconciliation](/queries/cross-system-state-reconciliation.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [eSIM Activation Orchestrator Service Assurance Runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
