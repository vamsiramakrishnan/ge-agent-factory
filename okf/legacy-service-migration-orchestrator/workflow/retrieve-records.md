---
type: Workflow Stage
title: Retrieve Records
description: Query service orders and provisioning tasks from Netcracker Service Orchestration and correlate with ServiceNow for the Legacy Service Migration Orchestrator workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query service orders and provisioning tasks from Netcracker Service Orchestration and correlate with ServiceNow for the Legacy Service Migration Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
