---
type: Workflow Stage
title: "Live Network-State & Inventory Validation"
description: "Validate network_inventory_items admin_state, software_version, and capacity_utilization_pct against in-flight provisioning_tasks in Netcracker Service Orchestration to confirm the target network element is actually ready before a cutover is sequenced."
source_id: live_network_state_inventory_validation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Live Network-State & Inventory Validation

Validate network_inventory_items admin_state, software_version, and capacity_utilization_pct against in-flight provisioning_tasks in Netcracker Service Orchestration to confirm the target network element is actually ready before a cutover is sequenced.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Change-Freeze & Cutover Sequencing](/workflow/change-freeze-cutover-sequencing.md)
