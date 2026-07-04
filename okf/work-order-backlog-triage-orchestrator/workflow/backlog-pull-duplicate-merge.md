---
type: Workflow Stage
title: "Backlog pull & duplicate merge"
description: "Query maintenance_work_orders and asset_registry_entries from IBM Maximo, cross-reference open tickets and incidents in ServiceNow for the same asset_number, and merge duplicate requests raised against a single failing asset before they fan out to different technicians."
source_id: backlog_pull_duplicate_merge
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Backlog pull & duplicate merge

Query maintenance_work_orders and asset_registry_entries from IBM Maximo, cross-reference open tickets and incidents in ServiceNow for the same asset_number, and merge duplicate requests raised against a single failing asset before they fan out to different technicians.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)
- [action_ibm_maximo_escalate](/tools/action-ibm-maximo-escalate.md)

Next: [Criticality & failure-history scoring](/workflow/criticality-failure-history-scoring.md)
