---
type: Workflow Stage
title: "Escalate & Audit"
description: "Execute action_netcracker_service_orchestration_escalate with a full audit trail, open or update the linked ServiceNow ticket or change_request, and notify the Order Management Specialist or named handoff target of the outcome."
source_id: escalate_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalate & Audit

Execute action_netcracker_service_orchestration_escalate with a full audit trail, open or update the linked ServiceNow ticket or change_request, and notify the Order Management Specialist or named handoff target of the outcome.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)
