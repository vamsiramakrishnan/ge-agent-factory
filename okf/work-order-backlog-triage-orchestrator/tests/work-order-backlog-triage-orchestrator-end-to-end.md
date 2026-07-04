---
type: Eval Scenario
title: Run the Work Order Backlog Triage Orchestrator workflow for the current perio...
description: "Run the Work Order Backlog Triage Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "work-order-backlog-triage-orchestrator-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Work Order Backlog Triage Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)
- [action_ibm_maximo_escalate](/tools/action-ibm-maximo-escalate.md)

## Success rubric

Action escalate executed against IBM Maximo, with audit-trail entry and Maintenance Supervisor notified of outcomes.

# Citations

- [Work Order Backlog Triage Orchestrator Standard Operating Procedure](/documents/work-order-backlog-triage-orchestrator-sop.md)
