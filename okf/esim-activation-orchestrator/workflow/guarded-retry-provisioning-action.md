---
type: Workflow Stage
title: "Guarded Retry & Provisioning Action"
description: "Invoke action_netcracker_service_orchestration_file to retry or re-sequence the profile download in Netcracker Service Orchestration only once two-system evidence and runbook gates on the service_orders / provisioning_tasks pair are satisfied."
source_id: guarded_retry_provisioning_action
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Guarded Retry & Provisioning Action

Invoke action_netcracker_service_orchestration_file to retry or re-sequence the profile download in Netcracker Service Orchestration only once two-system evidence and runbook gates on the service_orders / provisioning_tasks pair are satisfied.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

Next: [Escalation & Customer Notification Handoff](/workflow/escalation-customer-notification-handoff.md)
