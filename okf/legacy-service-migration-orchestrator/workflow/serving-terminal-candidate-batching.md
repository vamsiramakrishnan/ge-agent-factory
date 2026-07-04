---
type: Workflow Stage
title: "Serving-Terminal Candidate Batching"
description: "Batch copper-to-fiber and TDM-to-IP migration candidates from service_orders and network_inventory_items in Netcracker Service Orchestration, grouping by serving terminal (site_id/ne_id) and order_type via query_netcracker_service_orchestration_service_orders."
source_id: serving_terminal_candidate_batching
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Serving-Terminal Candidate Batching

Batch copper-to-fiber and TDM-to-IP migration candidates from service_orders and network_inventory_items in Netcracker Service Orchestration, grouping by serving terminal (site_id/ne_id) and order_type via query_netcracker_service_orchestration_service_orders.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Live Network-State & Inventory Validation](/workflow/live-network-state-inventory-validation.md)
