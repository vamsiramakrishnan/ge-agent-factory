---
type: Workflow Stage
title: "SOP-gated escalation"
description: "Look up the Work Order Backlog Triage Orchestrator Standard Operating Procedure and the Preventive Maintenance Interval & Regulatory Compliance Schedule to gate any escalate decision, then execute action_ibm_maximo_escalate in IBM Maximo for safety-critical work orders aging past threshold, routing through ServiceNow incidents to the Maintenance Supervisor."
source_id: sop_gated_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP-gated escalation

Look up the Work Order Backlog Triage Orchestrator Standard Operating Procedure and the Preventive Maintenance Interval & Regulatory Compliance Schedule to gate any escalate decision, then execute action_ibm_maximo_escalate in IBM Maximo for safety-critical work orders aging past threshold, routing through ServiceNow incidents to the Maintenance Supervisor.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)
- [action_ibm_maximo_escalate](/tools/action-ibm-maximo-escalate.md)

Next: [Weekly schedule proposal & audit publish](/workflow/weekly-schedule-proposal-audit-publish.md)
