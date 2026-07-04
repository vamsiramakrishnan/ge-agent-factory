---
type: Workflow Stage
title: "Migration Order Generation & Task Execution"
description: "Generate per-customer migration orders from service_orders and drive provisioning_tasks (hlr_hss_update, olt_port_assign, e911_address_load, number_activation) to completion, citing the Legacy Service Migration Orchestrator Service Assurance Runbook via lookup_legacy_service_migration_orchestrator_assurance_runbook before calling action_netcracker_service_orchestration_escalate."
source_id: migration_order_generation_task_execution
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Migration Order Generation & Task Execution

Generate per-customer migration orders from service_orders and drive provisioning_tasks (hlr_hss_update, olt_port_assign, e911_address_load, number_activation) to completion, citing the Legacy Service Migration Orchestrator Service Assurance Runbook via lookup_legacy_service_migration_orchestrator_assurance_runbook before calling action_netcracker_service_orchestration_escalate.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Post-Cutover Health Verification & Rollback](/workflow/post-cutover-health-verification-rollback.md)
