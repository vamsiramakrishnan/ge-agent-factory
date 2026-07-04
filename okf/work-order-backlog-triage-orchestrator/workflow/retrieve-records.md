---
type: Workflow Stage
title: Retrieve Records
description: Query maintenance work orders and asset registry entries from IBM Maximo and correlate with ServiceNow for the Work Order Backlog Triage Orchestrator workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query maintenance work orders and asset registry entries from IBM Maximo and correlate with ServiceNow for the Work Order Backlog Triage Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)
- [action_ibm_maximo_escalate](/tools/action-ibm-maximo-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
