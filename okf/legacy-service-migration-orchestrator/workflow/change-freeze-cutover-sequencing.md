---
type: Workflow Stage
title: "Change-Freeze & Cutover Sequencing"
description: "Cross-check ServiceNow change_requests and tickets for a registered freeze window on the serving terminal via query_servicenow_tickets, then sequence service_orders cutover dates so no two migrations stack against a single contested change window."
source_id: change_freeze_cutover_sequencing
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Change-Freeze & Cutover Sequencing

Cross-check ServiceNow change_requests and tickets for a registered freeze window on the serving terminal via query_servicenow_tickets, then sequence service_orders cutover dates so no two migrations stack against a single contested change window.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Migration Order Generation & Task Execution](/workflow/migration-order-generation-task-execution.md)
